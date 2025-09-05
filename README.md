Smart Student Planner
A comprehensive web application designed to help students manage their class attendance, track subjects, and plan their academic schedule effectively.

Features
Dashboard Overview: Get a quick summary of your overall attendance percentage, today's classes, and upcoming exams.

Subject Management: Add and manage subjects with detailed attendance tracking.

Attendance Tracking: Update attendance for each subject with a single click (present/absent).

Timetable Management: View and manage your weekly class schedule.

Attendance Improvement Calculator: Calculate how many classes you need to attend to reach your desired attendance percentage.

Tech Stack
Backend: Flask (Python) with RESTful API

Frontend: HTML, Tailwind CSS, Vanilla JavaScript

Data Storage: JSON file-based storage

CORS: Enabled for frontend-backend communication

Installation & Setup
Clone or download the project files to your local machine.

Install Python dependencies:

bash
pip install flask flask-cors
Run the Flask backend server:

bash
python app.py
The server will start on http://127.0.0.1:5000

Open the frontend:

Open index.html in a web browser

Or use a local server (e.g., with Live Server extension in VSCode)

File Structure
text
project/
├── app.py              # Flask backend server
├── attendance_data.json # Data storage file
├── index.html          # Main HTML file
├── script.js           # Frontend JavaScript logic
├── style.css           # Additional styling
└── README.md           # This file
API Endpoints
GET /api/data - Retrieve all subjects and timetable data

POST /api/subjects - Add a new subject

PUT /api/subjects/<subject_name> - Update attendance for a specific subject

POST /api/timetable/add - Add a class to the timetable

Usage
Adding Subjects: Navigate to the Attendance tab and click "Add New Subject" to add your courses.

Updating Attendance: Use the checkmark (✓) to mark a class as attended or cross (✕) to mark as absent.

Managing Timetable: Go to the Timetable tab to view your weekly schedule and add new classes.

Improvement Calculator: Use the Improvement tab to calculate how many classes you need to attend to reach your target attendance percentage.

Data Persistence
All data is stored in attendance_data.json which will be automatically created when you first run the application.

Browser Compatibility
This application works best in modern browsers that support:

ES6 JavaScript features

Flexbox and Grid layout

Fetch API

Troubleshooting
If you encounter CORS errors, ensure the Flask server is running before opening the frontend.

If data isn't persisting, check that the application has write permissions to create and modify attendance_data.json.

Future Enhancements
Potential improvements for this application could include:

User authentication system

Exam scheduling and reminders

Data export functionality

Mobile app version

Cloud synchronization

License
This project is open source and available under the MIT License.
