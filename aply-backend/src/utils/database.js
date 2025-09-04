const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firestore
const db = getFirestore();

// Function to save user resume data
async function saveResumeData(userId, resumeData) {
  try {
    const docRef = db.collection('users').doc(userId).collection('resume-data').doc('latest');
    await docRef.set(resumeData);
    return { success: true };
  } catch (error) {
    console.error('Error saving resume data to Firestore:', error);
    throw new Error('Failed to save resume data');
  }
}

// Placeholder functions for other DB operations (to be implemented later)
async function getResumeData(userId) { return {}; }
async function saveApplicationHistory(userId, application) { return {}; }

module.exports = { saveResumeData, getResumeData, saveApplicationHistory };