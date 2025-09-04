const apply = async (req, res) => {
  const jobUrl = req.body.jobUrl;

  // URL Validation
  if (!jobUrl || !isValidUrl(jobUrl)) {
    return res.status(400).send('Invalid or missing jobUrl');
  }

  let browser;
  try {
    // Puppeteer Launch
    const puppeteer = require('puppeteer');
    browser = await puppeteer.launch({ headless: true });

    // Get User Data
    const { getResumeData } = require('../utils/database');
    const userId = 'test-user-id'; // TODO: Get from authentication
    const userData = await getResumeData(userId);
    if (!userData) {
      return res.status(404).json({ message: 'User resume data not found' });
    }

    // Placeholder for next steps
    res.send('Puppeteer launched and user data retrieved');
  } catch (error) {
    console.error('Error in apply:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

// Helper function for URL validation
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = { apply };