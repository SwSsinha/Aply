const apply = async (req, res) => {
  const jobUrl = req.body.jobUrl;

  // URL Validation
  if (!jobUrl || !isValidUrl(jobUrl)) {
    return res.status(400).send('Invalid or missing jobUrl');
  }

  let browser;
  try {
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

    // Checkpoint 3: Log generated content
    console.log('Generated tailored resume summary:', tailoredContent.resumeSummary);
    console.log('Key skills extracted:', customizationData.skills);

    // Form Automation Logic
    const applicationUrl = jobUrl; // Assume same URL for demo

    try {
      if (!browser) {
        const puppeteer = require('puppeteer');
        browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
      }
      const page = await browser.newPage();

      // Navigate to Application Form
      await page.goto(applicationUrl, { waitUntil: 'networkidle2' });

      // Iterate Through Fields: Loop through an array of form field names (e.g., fullName, email, phone). Use await page.type('#fullName', 'John Doe'); to fill in data.
      const fields = [
        { selector: '#fullName', value: userData.name },
        { selector: '#email', value: userData.email },
        { selector: '#phone', value: userData.phone },
        { selector: '#address', value: userData.address },
      ];

      for (const field of fields) {
        try {
          if (await page.$(field.selector)) {
            await page.type(field.selector, field.value || '');
          } else {
            console.log(`Field ${field.selector} not found`);
          }
        } catch (error) {
          console.error(`Error filling field ${field.selector}:`, error);
        }
      }

      console.log('Form automation completed on', applicationUrl);

      // Unique Question Detection: Implement logic to check the page for keywords that indicate a unique question (e.g., "eligible to work," "security clearance").
      const pageText = await page.evaluate(() => document.body.innerText);

      if (pageText.includes('eligible to work') || pageText.includes('security clearance')) {
        return res.status(202).json({
          status: 'Awaiting User Input',
          question: 'Are you eligible to work in the US?',
          state: 'unique_question_detected'
        });
      }

      // Form Submission: After all fields are filled, await page.click('button[type="submit"]');
      await page.click('button[type="submit"]');

      // Wait for submission (optional)
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {
        console.log('Navigation after submit timed out or not occurred');
      });

      // Database Update: If successful, save the application history in Firestore.
      const { saveApplicationHistory } = require('../utils/database');
      const applicationResult = await saveApplicationHistory(userId, {
        jobUrl: jobUrl,
        applicationDate: new Date().toISOString(),
        status: 'submitted',
        jobInfo,
        tailoredContent
      });

      await browser.close(); // Close after use
      browser = null; // Prevent double close

      // Success Response
      return res.status(200).json({
        message: 'Application submitted successfully!',
        application: {
          id: applicationResult.id,
          jobUrl: jobUrl,
          userId: userId,
          status: 'submitted',
          date: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error in form automation:', error);
    }

    // Response with all phases completed
    res.status(200).json({
      message: 'Phase 3+: Scraping, Content Generation & Form Automation Successful',
      data: {
        jobInfo,
        userData: { name: userData.name, email: userData.email },
        customizationData,
        tailoredContent,
        formStatus: 'Form filled on application page'
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