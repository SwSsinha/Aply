const apply = async (req, res) => {
  const jobUrl = req.body.jobUrl;

  // URL Validation
  if (!jobUrl || !isValidUrl(jobUrl)) {
    return res.status(400).send('Invalid or missing jobUrl');
  }

  // Placeholder for next steps
  res.send('URL validated');
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