const express = require('express');
const router = express.Router();
const Policy = require('../models/Policy');
const authMiddleware = require('../middleware/auth');

// GET /api/policies — get all policies for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const policies = await Policy.find({ email: req.user.email });
    res.json(policies);
  } catch (err) {
    console.error('Fetch policies error:', err.message);
    res.status(500).json({ message: 'Failed to fetch policies.' });
  }
});

// GET /api/policies/:id/download — return a mock SAS URL
router.get('/:id/download', authMiddleware, async (req, res) => {
  try {
    const policy = await Policy.findOne({ policyId: req.params.id, email: req.user.email });
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found.' });
    }

    // In production: generate a real SAS URL from Azure Blob Storage
    // For now, return a mock URL that simulates a time-limited signed link
    const sasExpiry = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 min
    const mockSasUrl = `${policy.pdfBlobUrl}?sv=2023-01-03&se=${encodeURIComponent(sasExpiry)}&sp=r&sig=MOCK_SIGNATURE_${policy.policyId}`;

    res.json({ downloadUrl: mockSasUrl, expiresAt: sasExpiry });
  } catch (err) {
    console.error('Download error:', err.message);
    res.status(500).json({ message: 'Failed to generate download link.' });
  }
});

// GET /api/policies/:id/renew — return the payment gateway redirect URL
router.get('/:id/renew', authMiddleware, async (req, res) => {
  try {
    const policy = await Policy.findOne({ policyId: req.params.id, email: req.user.email });
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found.' });
    }

    const paymentUrl = `${process.env.PAYMENT_GATEWAY_URL}?policyId=${policy.policyId}&email=${encodeURIComponent(req.user.email)}&amount=${policy.premium}`;

    res.json({ paymentUrl });
  } catch (err) {
    console.error('Renew error:', err.message);
    res.status(500).json({ message: 'Failed to generate renewal link.' });
  }
});

module.exports = router;
