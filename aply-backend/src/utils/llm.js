const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Function to parse resume text into structured JSON
async function parseResumeText(text) {
  try {
    const prompt = `Extract the following information from this resume text and return it as a valid JSON object with the keys: name, email, phone, address, skills, experience (as an array of objects with jobTitle, company, duration, description), education (as an array of objects with degree, school, year). If a field is not available, use "Not available". Ensure the response is only JSON, no additional text.\n\nResume Text:\n${text}`;

    const response = await axios.post(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      contents: [{
        parts: [{ text: prompt }]
      }]
    });

    const aiResponse = response.data.candidates[0].content.parts[0].text;
    // Remove markdown code blocks if present (e.g., ```json ... ```)
    const jsonString = aiResponse.replace(/^```json\s*/, '').replace(/\s*```$/gm, '').trim();
    const parsedData = JSON.parse(jsonString);

    return parsedData;
  } catch (error) {
    console.error('Error calling LLM for resume parsing:', error);
    throw new Error('Failed to parse resume data');
  }
}

// Placeholder functions for other LLM usages (to be implemented later)
async function extractJobSkills(text) { return {}; }
async function generateTailoredResume(text, jobDescription) { return {}; }

module.exports = { parseResumeText, extractJobSkills, generateTailoredResume };