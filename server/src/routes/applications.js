const express = require('express');
const { uploadCV, handleUploadError } = require('../middleware/upload');
const prisma = require('../utils/prisma');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Get user's applications (USER role)
router.get('/my-applications', authorizeRoles('USER'), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where: { userId: req.user.id },
        include: {
          job: {
            include: {
              company: {
                select: {
                  id: true,
                  name: true,
                  logoUrl: true
                }
              }
            }
          }
        },
        orderBy: { appliedAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.application.count({
        where: { userId: req.user.id }
      })
    ]);

    res.json({
      applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get user applications error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch applications', 
      message: 'Could not retrieve applications' 
    });
  }
});

// Get applications for a job (COMPANY, ADMIN)
router.get('/job/:jobId', authorizeRoles('COMPANY', 'ADMIN'), async (req, res) => {
  try {
    const { jobId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Verify job exists and user has permission
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { company: true }
    });

    if (!job) {
      return res.status(404).json({ 
        error: 'Job not found', 
        message: 'Job with this ID does not exist' 
      });
    }

    // For COMPANY role, ensure they can only view applications for their jobs
    if (req.user.role === 'COMPANY' && job.companyId !== req.user.companyId) {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'You can only view applications for your own company\'s jobs' 
      });
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where: { jobId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          job: {
            include: {
              company: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        },
        orderBy: { appliedAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.application.count({
        where: { jobId }
      })
    ]);

    res.json({
      applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch applications', 
      message: 'Could not retrieve applications' 
    });
  }
});

// Apply for a job (USER role)
router.post('/jobs/:jobId/apply', authorizeRoles('USER'), uploadCV, handleUploadError, async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check if CV file was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        error: 'CV required', 
        message: 'Please upload your CV (PDF format)' 
      });
    }

    // Verify job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { company: true }
    });

    if (!job) {
      return res.status(404).json({ 
        error: 'Job not found', 
        message: 'Job with this ID does not exist' 
      });
    }

    // Check if user already applied for this job
    const existingApplication = await prisma.application.findUnique({
      where: {
        userId_jobId: {
          userId: req.user.id,
          jobId: jobId
        }
      }
    });

    if (existingApplication) {
      return res.status(400).json({ 
        error: 'Already applied', 
        message: 'You have already applied for this job' 
      });
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        userId: req.user.id,
        jobId: jobId,
        cvUrl: `/uploads/${req.file.filename}`
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        job: {
          include: {
            company: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });

  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({ 
      error: 'Failed to submit application', 
      message: 'Could not submit application' 
    });
  }
});

// Delete application (USER can delete their own, COMPANY/ADMIN can delete any)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        user: true,
        job: {
          include: { company: true }
        }
      }
    });

    if (!application) {
      return res.status(404).json({ 
        error: 'Application not found', 
        message: 'Application with this ID does not exist' 
      });
    }

    // Check permissions
    const canDelete = 
      req.user.role === 'ADMIN' ||
      req.user.role === 'COMPANY' && application.job.companyId === req.user.companyId ||
      req.user.role === 'USER' && application.userId === req.user.id;

    if (!canDelete) {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'You do not have permission to delete this application' 
      });
    }

    await prisma.application.delete({
      where: { id }
    });

    res.json({
      message: 'Application deleted successfully'
    });

  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ 
      error: 'Failed to delete application', 
      message: 'Could not delete application' 
    });
  }
});

module.exports = router; 