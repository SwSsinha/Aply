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

// Placeholder functions for other DB operations
async function getResumeData(userId) {
  try {
    const docRef = db.collection('users').doc(userId).collection('resume-data').doc('latest');
    const doc = await docRef.get();
    if (!doc.exists) {
      return null;
    }
    return doc.data();
  } catch (error) {
    console.error('Error getting resume data from Firestore:', error);
    throw new Error('Failed to retrieve resume data');
  }
}
async function saveApplicationHistory(userId, application) { return {}; }

module.exports = { saveResumeData, getResumeData, saveApplicationHistory };