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

    // PDF Generation: Render HTML template with resume content and save as PDF
    const fs = require('fs');
    const path = require('path');
    const os = require('os');

    const templatePath = path.join(__dirname, '../templates/resume.html');
    let htmlTemplate = fs.readFileSync(templatePath, 'utf8');

    // Prepare data for template
    const resumeData = {
      ...userData,
      resumeSummary: tailoredContent.resumeSummary
    };

    // Basic string replacements
    htmlTemplate = htmlTemplate.replace(/{{name}}/g, resumeData.name || '');
    htmlTemplate = htmlTemplate.replace(/{{email}}/g, resumeData.email || '');
    htmlTemplate = htmlTemplate.replace(/{{phone}}/g, resumeData.phone || '');
    htmlTemplate = htmlTemplate.replace(/{{address}}/g, resumeData.address || '');
    htmlTemplate = htmlTemplate.replace(/{{resumeSummary}}/g, resumeData.resumeSummary || '');

    // Skills array
    const skillsSection = `<h2>Skills</h2><div class="skills">${(resumeData.skills || []).map(skill => `<span class="skill">${skill}</span>`).join('')}</div>`;
    htmlTemplate = htmlTemplate.replace(/{{skillsSection}}/g, skillsSection);

    // Experience array
    const experienceSection = `<h2>Experience</h2>${(resumeData.experience || []).map(exp =>
      `<h3>${exp.jobTitle} at ${exp.company}</h3><p>${exp.description} (${exp.duration})</p>`
    ).join('')}`;
    htmlTemplate = htmlTemplate.replace(/{{experienceSection}}/g, experienceSection);

    // Education array
    const educationSection = `<h2>Education</h2>${(resumeData.education || []).map(edu =>
      `<h3>${edu.degree} - ${edu.school} (${edu.year})</h3>`
    ).join('')}`;
    htmlTemplate = htmlTemplate.replace(/{{educationSection}}/g, educationSection);

    // Projects array
    if (resumeData.projects && resumeData.projects.length > 0) {
      const projectsSection = `<h2>Projects</h2>${(resumeData.projects || []).map(proj =>
        `<h3>${proj.projectName}</h3><p>${proj.description}</p>` +
        proj.technologies.map(tech => `<span class="skill">${tech}</span>`).join('')
      ).join('')}`;
      htmlTemplate = htmlTemplate.replace(/{{projectsSection}}/g, projectsSection);
    } else {
      htmlTemplate = htmlTemplate.replace(/{{projectsSection}}/g, '');
    }

    // Use Puppeteer to generate PDF
    const resumePage = await browser.newPage();
    await resumePage.setContent(htmlTemplate, { waitUntil: 'networkidle0' });
    const tempDir = os.tmpdir();
    const pdfPath = path.join(tempDir, `tailored_resume_${Date.now()}.pdf`);
    await resumePage.pdf({ path: pdfPath, format: 'A4' });
    await resumePage.close();

    // Placeholder for next steps
    res.send('PDF generated at: ' + pdfPath);
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