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

    // Navigation & Scraping
    const page = await browser.newPage();
    await page.goto(jobUrl, { waitUntil: 'networkidle2' });

    // Scrape job info
    const jobInfo = await page.evaluate(() => {
      const title = document.querySelector('h1')?.textContent?.trim() || 'Not found';
      const company = document.querySelector('.company')?.textContent?.trim() || document.querySelector('[id*="company"]')?.textContent?.trim() || 'Not found';
      const description = document.querySelector('.job-description')?.textContent?.trim() || document.querySelector('[class*="description"]')?.textContent?.trim() || document.querySelector('[id*="description"]')?.textContent?.trim() || '';

      return { title, company, description };
    });

    if (!jobInfo.description || jobInfo.title === 'Not found') {
      return res.status(404).send('Job page structure not recognized.');
    }

    // LLM Calls for Customization
    const { extractJobSkills, generateTailoredResume } = require('../utils/llm');

    // Send job description to LLM to extract key skills and unique questions
    const customizationData = await extractJobSkills(jobInfo.description);

    // Send user data and job info to LLM to create tailored resume and cover letter
    const tailoredContent = await generateTailoredResume(userData, jobInfo);

    // Placeholder for next steps
    res.send('LLM customization complete: ' + JSON.stringify({ customizationData, tailoredContent }));
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