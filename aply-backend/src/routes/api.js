const express = require('express');
const resumeController = require('../controllers/resumeController');

const router = express.Router();

// Route Definition: app.post('/api/upload-resume', async (req, res) => {
router.post('/upload-resume', resumeController.upload);

// Placeholder for more routes

module.exports = router;