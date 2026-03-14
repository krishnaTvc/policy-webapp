const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Policy = require('./models/Policy');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Policy.deleteMany({});

    // Create users
    const salt = await bcrypt.genSalt(10);
    const hash1 = await bcrypt.hash('password123', salt);
    const hash2 = await bcrypt.hash('password123', salt);

    const users = await User.insertMany([
      { email: 'alice@example.com', passwordHash: hash1, role: 'user' },
      { email: 'bob@example.com', passwordHash: hash2, role: 'user' },
    ]);
    console.log('✅ Users seeded:', users.map(u => u.email));

    // Create policies for alice
    const now = new Date();
    const policies = await Policy.insertMany([
      {
        policyId: 'POL-001',
        email: 'alice@example.com',
        policyType: 'Health',
        policyName: 'Star Health Comprehensive',
        pdfBlobUrl: 'https://yourstorageaccount.blob.core.windows.net/policy-pdfs/POL-001.pdf',
        expiryDate: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()),
        renewalStatus: 'Active',
        premium: 12500,
        sumInsured: 500000,
      },
      {
        policyId: 'POL-002',
        email: 'alice@example.com',
        policyType: 'Life',
        policyName: 'LIC Jeevan Anand',
        pdfBlobUrl: 'https://yourstorageaccount.blob.core.windows.net/policy-pdfs/POL-002.pdf',
        expiryDate: new Date(now.getFullYear() + 5, now.getMonth(), now.getDate()),
        renewalStatus: 'Active',
        premium: 25000,
        sumInsured: 2000000,
      },
      {
        policyId: 'POL-003',
        email: 'alice@example.com',
        policyType: 'Vehicle',
        policyName: 'HDFC Ergo Car Insurance',
        pdfBlobUrl: 'https://yourstorageaccount.blob.core.windows.net/policy-pdfs/POL-003.pdf',
        expiryDate: new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
        renewalStatus: 'Expired',
        premium: 8500,
        sumInsured: 300000,
      },
      // Bob's policies
      {
        policyId: 'POL-004',
        email: 'bob@example.com',
        policyType: 'Travel',
        policyName: 'TATA AIG Travel Guard',
        pdfBlobUrl: 'https://yourstorageaccount.blob.core.windows.net/policy-pdfs/POL-004.pdf',
        expiryDate: new Date(now.getFullYear() + 1, now.getMonth() + 3, now.getDate()),
        renewalStatus: 'Active',
        premium: 3200,
        sumInsured: 1000000,
      },
      {
        policyId: 'POL-005',
        email: 'bob@example.com',
        policyType: 'Home',
        policyName: 'Bajaj Allianz Home Shield',
        pdfBlobUrl: 'https://yourstorageaccount.blob.core.windows.net/policy-pdfs/POL-005.pdf',
        expiryDate: new Date(now.getFullYear() + 2, now.getMonth(), now.getDate()),
        renewalStatus: 'Pending Renewal',
        premium: 6000,
        sumInsured: 1500000,
      },
    ]);
    console.log('✅ Policies seeded:', policies.map(p => `${p.policyId} (${p.email})`));

    console.log('\n🎯 Seed complete! Test credentials:');
    console.log('   alice@example.com / password123');
    console.log('   bob@example.com   / password123\n');
  } catch (err) {
    console.error('Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
};

seed();
