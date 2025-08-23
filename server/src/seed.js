const bcrypt = require('bcryptjs');
const prisma = require('./utils/prisma');

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    await prisma.application.deleteMany();
    await prisma.job.deleteMany();
    await prisma.company.deleteMany();
    await prisma.user.deleteMany();

    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@jobboard.com',
        password: adminPassword,
        role: 'ADMIN'
      }
    });

    // Create company user
    const companyPassword = await bcrypt.hash('company123', 12);
    const companyUser = await prisma.user.create({
      data: {
        name: 'Company Manager',
        email: 'company@jobboard.com',
        password: companyPassword,
        role: 'COMPANY'
      }
    });

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 12);
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'user@jobboard.com',
        password: userPassword,
        role: 'USER'
      }
    });

    console.log('👥 Created users');

    // Create companies
    const companies = await Promise.all([
      prisma.company.create({
        data: {
          name: 'TechCorp Solutions',
          description: 'Leading technology solutions provider specializing in software development and digital transformation.',
          logoUrl: 'https://via.placeholder.com/150x150/3B82F6/FFFFFF?text=TC'
        }
      }),
      prisma.company.create({
        data: {
          name: 'InnovateSoft',
          description: 'Innovative software company focused on creating cutting-edge applications and platforms.',
          logoUrl: 'https://via.placeholder.com/150x150/10B981/FFFFFF?text=IS'
        }
      }),
      prisma.company.create({
        data: {
          name: 'DataFlow Systems',
          description: 'Data analytics and business intelligence solutions for modern enterprises.',
          logoUrl: 'https://via.placeholder.com/150x150/F59E0B/FFFFFF?text=DF'
        }
      })
    ]);

    console.log('🏢 Created companies');

    // Create jobs
    const jobs = await Promise.all([
      prisma.job.create({
        data: {
          title: 'Senior Full-Stack Developer',
          description: 'We are looking for an experienced Full-Stack Developer to join our team. You will be responsible for developing and maintaining web applications using modern technologies like React, Node.js, and PostgreSQL. The ideal candidate should have 3+ years of experience in web development.',
          location: 'Berlin, Germany',
          companyId: companies[0].id
        }
      }),
      prisma.job.create({
        data: {
          title: 'Frontend Developer (React)',
          description: 'Join our frontend team to build beautiful and responsive user interfaces. We use React, TypeScript, and modern CSS frameworks. Experience with state management (Redux, Zustand) is a plus.',
          location: 'Munich, Germany',
          companyId: companies[0].id
        }
      }),
      prisma.job.create({
        data: {
          title: 'Backend Engineer (Node.js)',
          description: 'We need a skilled backend engineer to develop robust APIs and microservices. Experience with Node.js, Express, and databases (PostgreSQL, MongoDB) is required. Knowledge of Docker and AWS is a plus.',
          location: 'Hamburg, Germany',
          companyId: companies[1].id
        }
      }),
      prisma.job.create({
        data: {
          title: 'DevOps Engineer',
          description: 'Help us build and maintain our cloud infrastructure. Experience with AWS, Docker, Kubernetes, and CI/CD pipelines is required. Knowledge of monitoring and logging tools is a plus.',
          location: 'Frankfurt, Germany',
          companyId: companies[1].id
        }
      }),
      prisma.job.create({
        data: {
          title: 'Data Scientist',
          description: 'Join our data science team to analyze large datasets and build machine learning models. Experience with Python, pandas, scikit-learn, and SQL is required. Knowledge of deep learning frameworks is a plus.',
          location: 'Stuttgart, Germany',
          companyId: companies[2].id
        }
      }),
      prisma.job.create({
        data: {
          title: 'Product Manager',
          description: 'Lead product development from conception to launch. Experience with agile methodologies, user research, and product analytics is required. Technical background is a plus.',
          location: 'Cologne, Germany',
          companyId: companies[2].id
        }
      })
    ]);

    console.log('💼 Created jobs');

    // Create some applications
    const applications = await Promise.all([
      prisma.application.create({
        data: {
          userId: user.id,
          jobId: jobs[0].id,
          cvUrl: '/uploads/sample-cv-1.pdf'
        }
      }),
      prisma.application.create({
        data: {
          userId: user.id,
          jobId: jobs[2].id,
          cvUrl: '/uploads/sample-cv-2.pdf'
        }
      })
    ]);

    console.log('📝 Created applications');

    console.log('✅ Database seeded successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('Admin: admin@jobboard.com / admin123');
    console.log('Company: company@jobboard.com / company123');
    console.log('User: user@jobboard.com / user123');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed(); 