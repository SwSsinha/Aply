// Main entry point for the application. Set up Express server, connect to Firestore, define routes.
// This is the orchestration layer - keep it minimal and delegate logic to src/ modules.

// Require dependencies
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const firebaseAdmin = require('firebase-admin');
const fileUpload = require('express-fileupload');
// Add other requires as needed (e.g., routes, controllers)

// Initialize Firebase Admin SDK with credentials from .env
try {
  const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Handle newlines in private key
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  };

  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
  });
  // Now Firestore is connected and can be accessed via firebaseAdmin.firestore()

  // Initialize Express app
  const app = express();

  // Use Express middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Enable file uploads
  app.use(fileUpload());

  // Placeholder for routes (to be added later)

  // Set up your server to listen on a port
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
} catch (error) {
  console.error('Error during server initialization:', error);
  process.exit(1); // Exit the process if startup error occurs
}