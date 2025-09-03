Aply. ✨
An AI-powered application agent that automates your job applications in minutes.

Aply. is a solution for every job seeker tired of repetitive applications. It's a smart assistant that takes your professional data once and then handles the entire application process for you. Just provide a job link, and Aply. does the rest.

🚀 The Problem & The Solution
The Problem: The job application process is incredibly time-consuming, repetitive, and frustrating. Filling out the same information on different forms, tailoring resumes, and writing cover letters for every single job can take hours and often leads to burnout.

The Solution: Aply. uses AI agents to automate the entire workflow. It acts as your personal application bot, saving you time and effort so you can focus on what really matters: preparing for the interview.

🌟 Key Features
Automated Resume Ingestion: Upload your resume once, and Aply. intelligently parses all your data.

Job-Specific Customization: The AI analyzes job descriptions to tailor your resume and cover letter, ensuring a high ATS (Applicant Tracking System) score.

Intelligent Form Automation: Aply. navigates application portals, fills in your information, and clicks submit.

Interactive Q&A: For unique questions on an application, Aply. seamlessly switches to a chat interface to get your answers and continues the process.

Application History: Track all your past applications and download the exact, tailored resume that was submitted for each job.

🛠️ Tech Stack
Frontend: Vite, React, Tailwind CSS, @Mantine

Backend: Node.js, Express, Puppeteer

AI/LLM: Gemini or OpenAI

Database: Google Firestore

📖 Getting Started
Follow these steps to set up and run Aply. on your local machine.

Prerequisites
Node.js (v18 or higher)

npm

A Gemini or OpenAI API key

A Firebase project with Firestore set up

Installation
Clone the repository:

Bash

git clone https://github.com/SwSsinha/Aply.git
cd aply
Set up the backend:

Bash

cd aply-backend
npm install
Create a .env file in the aply-backend directory and add your API keys:

API_KEY=your_gemini_or_openai_api_key
...
Set up the frontend:

Bash

cd ../aply-frontend
npm install
Create a .env file in the aply-frontend directory and add your backend URL:

REACT_APP_API_URL=http://localhost:3000
Running the Project
Start the backend server:

Bash

cd aply-backend
npm start
Start the frontend development server:

Bash

cd ../aply-frontend
npm run dev
Your application should now be running at http://localhost:5173.

🤝 Contribution
This project was built for the mosAIc: AI in action with The Product Folks hackathon. Contributions are welcome! Feel free to open issues or pull requests.

📄 License
This project is licensed under the MIT License.