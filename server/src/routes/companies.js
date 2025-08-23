const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../utils/prisma');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateCompany = [
  body('name').trim().isLength({ min: 2 }).withMessage('Company name must be at least 2 characters'),
  body('description').optional().trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('logoUrl').optional().isURL().withMessage('Logo URL must be a valid URL')
];

// Apply authentication to all routes
router.use(authenticateToken);
router.use(authorizeRoles('ADMIN'));

// Get all companies
router.get('/', async (req, res) => {
  try {
    const companies = await prisma.company.findMany({
      include: {
        _count: {
          select: { jobs: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ companies });
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch companies', 
      message: 'Could not retrieve companies' 
    });
  }
});

// Get company by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        jobs: {
          include: {
            _count: {
              select: { applications: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: { jobs: true }
        }
      }
    });

    if (!company) {
      return res.status(404).json({ 
        error: 'Company not found', 
        message: 'Company with this ID does not exist' 
      });
    }

    res.json({ company });
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch company', 
      message: 'Could not retrieve company' 
    });
  }
});

// Create company
router.post('/', validateCompany, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { name, description, logoUrl } = req.body;

    // Check if company already exists
    const existingCompany = await prisma.company.findFirst({
      where: { name }
    });

    if (existingCompany) {
      return res.status(400).json({ 
        error: 'Company already exists', 
        message: 'A company with this name already exists' 
      });
    }

    const company = await prisma.company.create({
      data: {
        name,
        description,
        logoUrl
      }
    });

    res.status(201).json({
      message: 'Company created successfully',
      company
    });

  } catch (error) {
    console.error('Create company error:', error);
    res.status(500).json({ 
      error: 'Failed to create company', 
      message: 'Could not create company' 
    });
  }
});

// Update company
router.put('/:id', validateCompany, async (req, res) => {
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
    const { name, description, logoUrl } = req.body;

    // Check if company exists
    const existingCompany = await prisma.company.findUnique({
      where: { id }
    });

    if (!existingCompany) {
      return res.status(404).json({ 
        error: 'Company not found', 
        message: 'Company with this ID does not exist' 
      });
    }

    // Check if name is being changed and if it conflicts
    if (name && name !== existingCompany.name) {
      const nameConflict = await prisma.company.findFirst({
        where: { 
          name,
          id: { not: id }
        }
      });

      if (nameConflict) {
        return res.status(400).json({ 
          error: 'Company name conflict', 
          message: 'A company with this name already exists' 
        });
      }
    }

    const company = await prisma.company.update({
      where: { id },
      data: {
        name,
        description,
        logoUrl
      }
    });

    res.json({
      message: 'Company updated successfully',
      company
    });

  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({ 
      error: 'Failed to update company', 
      message: 'Could not update company' 
    });
  }
});

// Delete company
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if company exists
    const existingCompany = await prisma.company.findUnique({
      where: { id },
      include: {
        _count: {
          select: { jobs: true }
        }
      }
    });

    if (!existingCompany) {
      return res.status(404).json({ 
        error: 'Company not found', 
        message: 'Company with this ID does not exist' 
      });
    }

    // Check if company has jobs
    if (existingCompany._count.jobs > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete company', 
        message: 'Company has associated jobs. Delete jobs first.' 
      });
    }

    await prisma.company.delete({
      where: { id }
    });

    res.json({
      message: 'Company deleted successfully'
    });

  } catch (error) {
    console.error('Delete company error:', error);
    res.status(500).json({ 
      error: 'Failed to delete company', 
      message: 'Could not delete company' 
    });
  }
});

module.exports = router; 