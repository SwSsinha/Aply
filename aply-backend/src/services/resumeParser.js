const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

async function extractResumeText(buffer, mimetype) {
  try {
    if (mimetype === 'application/pdf') {
      const data = await pdfParse(buffer);
      return data.text;
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } else {
      throw new Error('Unsupported file type. Only PDF and DOCX are supported.');
    }
  } catch (error) {
    console.error('Error extracting text from resume:', error);
    throw new Error('Failed to extract text from file');
  }
}

module.exports = { extractResumeText };