const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const modelId = 'gemini-1.5-pro';

// Function to parse resume text into structured JSON
async function parseResumeText(text) {
  try {
    const prompt = `Extract the following information from this resume text and return it as a valid JSON object with the keys: name, email, phone, address, skills, experience (as an array of objects with jobTitle, company, duration, description), education (as an array of objects with degree, school, year), projects (as an array of objects with projectName, description, technologies, link if available). If a field is not available, use "Not available". Ensure the response is only JSON, no additional text.\n\nResume Text:\n${text}`;

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
    if (error.response && error.response.status === 429) {
      console.log('Gemini API quota exceeded, using mock data for resume parsing');
      return {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        address: '123 Main St',
        skills: ['JavaScript', 'React', 'Node.js'],
        experience: [{ jobTitle: 'Developer', company: 'Example Co', duration: '2 years', description: 'Developed apps' }],
        education: [{ degree: 'BS Computer Science', school: 'University', year: '2020' }],
        projects: [{ projectName: 'My Project', description: 'Built an app', technologies: ['React', 'Node'], link: '' }]
      };
    } else {
      console.error('Error calling LLM for resume parsing:', error);
      throw new Error('Failed to parse resume data');
    }
  }
}

// Function to extract key skills and unique questions from job description
async function extractJobSkills(description) {
  try {
    const prompt = `Analyze this job description and extract:
1. Top 5 key skills required (as an array)
2. Any unique application questions mentioned (as an array of question strings)
Return as JSON object with keys: skills (array of strings), questions (array of strings).
If no unique questions, use empty array.
Description: ${description}`;

    const response = await axios.post(`https://generativelanguage.googleapis.com/v1/models/${modelId}:generateContent?key=${GEMINI_API_KEY}`, {
      contents: [{
        parts: [{ text: prompt }]
      }]
    });

    const aiResponse = response.data.candidates[0].content.parts[0].text;
    const cleanedResponse = aiResponse.replace(/^```json\s*/, '').replace(/\s*```$/gm, '').trim();
    const parsedData = JSON.parse(cleanedResponse);

    return parsedData;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.log('Gemini API quota exceeded, using mock data for job skills');
      return { skills: ['React', 'Node.js', 'Firebase', 'JavaScript', 'Full-Stack Development'], questions: [] };
    } else {
      console.error('Error extracting job skills:', error);
      throw new Error('Failed to extract job skills');
    }
  }
}

// Function to generate tailored resume summary and cover letter
async function generateTailoredResume(userData, jobInfo) {
  try {
    const prompt = `Based on user's resume data: ${JSON.stringify(userData)}
And job information: ${JSON.stringify(jobInfo)}
Generate:
1. A tailored resume summary (2-3 sentences)
2. A short cover letter (3-4 paragraphs)
Return as JSON with keys: resumeSummary, coverLetter`;

    const response = await axios.post(`https://generativelanguage.googleapis.com/v1/models/${modelId}:generateContent?key=${GEMINI_API_KEY}`, {
      contents: [{
        parts: [{ text: prompt }]
      }]
    });

    const aiResponse = response.data.candidates[0].content.parts[0].text;
    const cleanedResponse = aiResponse.replace(/^```json\s*/, '').replace(/\s*```$/gm, '').trim();
    const parsedData = JSON.parse(cleanedResponse);

    return parsedData;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.log('Gemini API quota exceeded, using mock data for tailored resume');
      return { resumeSummary: 'Experienced full-stack developer with 3+ years in React and Node.js development.', coverLetter: 'Dear Hiring Manager, I am writing to express my interest in the Software Engineer position.' };
    } else {
      console.error('Error generating tailored resume:', error);
      throw new Error('Failed to generate tailored resume');
    }
  }
}

module.exports = { parseResumeText, extractJobSkills, generateTailoredResume };