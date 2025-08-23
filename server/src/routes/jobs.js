const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../utils/prisma');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateJob = [
  body('title').trim().isLength({ min: 3 }).withMessage('Job title must be at least 3 characters'),
  body('description').trim().isLength({ min: 20 }).withMessage('Job description must be at least 20 characters'),
  body('location').trim().isLength({ min: 2 }).withMessage('Location must be at least 2 characters'),
  body('companyId').isUUID().withMessage('Valid company ID is required')
];

// Public job search (no authentication required)
router.get('/', async (req, res) => {
  try {
    const { location, title, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause for filtering
    const where = {};
    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive'
      };
    }
    if (title) {
      where.title = {
        contains: title,
        mode: 'insensitive'
      };
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logoUrl: true
            }
          },
          _count: {
            select: { applications: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.job.count({ where })
    ]);

    res.json({
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch jobs', 
      message: 'Could not retrieve jobs' 
    });
  }
});

// Get job by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            description: true,
            logoUrl: true
          }
        },
        _count: {
          select: { applications: true }
        }
      }
    });

    if (!job) {
      return res.status(404).json({ 
        error: 'Job not found', 
        message: 'Job with this ID does not exist' 
      });
    }

    res.json({ job });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch job', 
      message: 'Could not retrieve job' 
    });
  }
});

// Protected routes (require authentication)
router.use(authenticateToken);

// Get jobs for company (COMPANY role)
router.get('/company/my-jobs', authorizeRoles('COMPANY', 'ADMIN'), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // For COMPANY role, get jobs from their company
    // For ADMIN role, get all jobs
    const where = req.user.role === 'COMPANY' 
      ? { companyId: req.user.companyId }
      : {};

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logoUrl: true
            }
          },
          _count: {
            select: { applications: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.job.count({ where })
    ]);

    res.json({
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get company jobs error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch company jobs', 
      message: 'Could not retrieve company jobs' 
    });
  }
});

// Create job (COMPANY, ADMIN)
router.post('/', authorizeRoles('COMPANY', 'ADMIN'), validateJob, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { title, description, location, companyId } = req.body;

    // Verify company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId }
    });

    if (!company) {
      return res.status(404).json({ 
        error: 'Company not found', 
        message: 'Company with this ID does not exist' 
      });
    }

    // For COMPANY role, ensure they can only create jobs for their company
    if (req.user.role === 'COMPANY' && req.user.companyId !== companyId) {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'You can only create jobs for your own company' 
      });
    }

    const job = await prisma.job.create({
      data: {
        title,
        description,
        location,
        companyId
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logoUrl: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Job created successfully',
      job
    });

  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ 
      error: 'Failed to create job', 
      message: 'Could not create job' 
    });
  }
});

// Update job (COMPANY, ADMIN)
router.put('/:id', authorizeRoles('COMPANY', 'ADMIN'), validateJob, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { id } = req.params;
    const { title, description, location, companyId } = req.body;

    // Get existing job
    const existingJob = await prisma.job.findUnique({
      where: { id },
      include: { company: true }
    });

    if (!existingJob) {
      return res.status(404).json({ 
        error: 'Job not found', 
        message: 'Job with this ID does not exist' 
      });
    }

    // For COMPANY role, ensure they can only update jobs from their company
    if (req.user.role === 'COMPANY' && existingJob.companyId !== req.user.companyId) {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'You can only update jobs from your own company' 
      });
    }

    // Verify new company exists if changing
    if (companyId && companyId !== existingJob.companyId) {
      const company = await prisma.company.findUnique({
        where: { id: companyId }
      });

      if (!company) {
        return res.status(404).json({ 
          error: 'Company not found', 
          message: 'Company with this ID does not exist' 
        });
      }

      // For COMPANY role, ensure they can only assign to their company
      if (req.user.role === 'COMPANY' && companyId !== req.user.companyId) {
        return res.status(403).json({ 
          error: 'Forbidden', 
          message: 'You can only assign jobs to your own company' 
        });
      }
    }

    const job = await prisma.job.update({
      where: { id },
      data: {
        title,
        description,
        location,
        companyId
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logoUrl: true
          }
        }
      }
    });

    res.json({
      message: 'Job updated successfully',
      job
    });

  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ 
      error: 'Failed to update job', 
      message: 'Could not update job' 
    });
  }
});

// Delete job (COMPANY, ADMIN)
router.delete('/:id', authorizeRoles('COMPANY', 'ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;

    // Get existing job
    const existingJob = await prisma.job.findUnique({
      where: { id },
      include: {
        company: true,
        _count: {
          select: { applications: true }
        }
      }
    });

    if (!existingJob) {
      return res.status(404).json({ 
        error: 'Job not found', 
        message: 'Job with this ID does not exist' 
      });
    }

    // For COMPANY role, ensure they can only delete jobs from their company
    if (req.user.role === 'COMPANY' && existingJob.companyId !== req.user.companyId) {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'You can only delete jobs from your own company' 
      });
    }

    // Check if job has applications
    if (existingJob._count.applications > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete job', 
        message: 'Job has applications. Delete applications first.' 
      });
    }

    await prisma.job.delete({
      where: { id }
    });

    res.json({
      message: 'Job deleted successfully'
    });

  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ 
      error: 'Failed to delete job', 
      message: 'Could not delete job' 
    });
  }
});

module.exports = router; 