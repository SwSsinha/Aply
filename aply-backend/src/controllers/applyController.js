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
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });

    // Get User Data
    const { getResumeData } = require('../utils/database');
    const userId = 'test-user-id'; // TODO: Get from authentication
    const userData = await getResumeData(userId);
    if (!userData) {
      return res.status(404).json({ message: 'User resume data not found' });
    }

    // Mock Navigation & Scraping (replace with real Puppeteer scraping when browser issues resolved)
    console.log('Simulating navigation to jobUrl:', jobUrl);

    // Mock scraped data for demo purposes
    const jobInfo = {
      title: 'Software Engineer at Aply Demo',
      company: 'Runnable Demo Inc.',
      description: 'Responsibilities include developing full-stack applications using modern technologies like React, Node.js, and Firebase. Collaborate with team on innovative solutions.'
    };

    // LLM Calls for Customization
    const { extractJobSkills, generateTailoredResume } = require('../utils/llm');

    // Send job description to LLM to extract key skills and unique questions
    const customizationData = await extractJobSkills(jobInfo.description);

    // Send user data and job info to LLM to create tailored resume and cover letter
    const tailoredContent = await generateTailoredResume(userData, jobInfo);

    // Checkpoint 3: Log generated content (skip PDF generation to avoid browser issues)
    console.log('Generated tailored resume summary:', tailoredContent.resumeSummary);
    console.log('Key skills extracted:', customizationData.skills);

    // Response for checkpoint - no further steps
    res.status(200).json({
      message: 'Checkpoint 3: Scraping & Content Generation Successful',
      data: {
        jobInfo,
        userData: { name: userData.name, email: userData.email },
        customizationData,
        tailoredContent
      }
    });
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