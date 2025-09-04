const { extractResumeText } = require('../services/resumeParser');
const { parseResumeText } = require('../utils/llm');
const { saveResumeData } = require('../utils/database');

const upload = async (req, res) => {
  // File Existence Check
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const file = req.files.resume;

  // File Type Validation
  if (!file) {
    return res.status(400).send('No resume file provided.');
  }
  if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.mimetype)) {
    return res.status(400).send('Invalid file type. Only PDF and DOCX are supported.');
  }

  try {
    // Raw Text Extraction
    const rawText = await extractResumeText(file.data, file.mimetype);

    // LLM API Call
    const structuredData = await parseResumeText(rawText);

    // LLM Response Validation
    if (!structuredData || typeof structuredData !== 'object' || !structuredData.name) {
      return res.status(400).json({ message: 'Could not parse resume data' });
    }

    // Database Storage
    const userId = 'test-user-id'; // Placeholder; implement auth to get real userId
    await saveResumeData(userId, structuredData);

    // Success Response
    res.status(200).json({ message: 'Resume uploaded and parsed successfully', data: structuredData });
  } catch (error) {
    console.error('Error in resume upload:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { upload };