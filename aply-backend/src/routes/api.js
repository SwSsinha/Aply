const express = require('express');
const resumeController = require('../controllers/resumeController');
const applyController = require('../controllers/applyController');

const router = express.Router();

// Route Definition: app.post('/api/upload-resume', async (req, res) => {
router.post('/upload-resume', resumeController.upload);

// Route Definition: app.post('/api/apply', async (req, res) => {
router.post('/apply', applyController.apply);

// Placeholder for more routes

module.exports = router;