# CYHI-Project 
# Smart Student Planner

A web-based student planner application designed to help students track their attendance, manage their class timetable, and calculate the required attendance to meet their goals.

## Features

- **Dashboard**: Overview of overall attendance, today's classes, and upcoming exams  
- **Attendance Tracking**: Subject-wise attendance tracking with visual indicators  
- **Timetable Management**: Weekly class schedule management  
- **Improvement Calculator**: Calculate how many classes you need to attend to reach your target attendance percentage  
- **Responsive Design**: Works on desktop and mobile devices  

## Technology Stack

- **Frontend**: HTML, Tailwind CSS, JavaScript  
- **Backend**: Flask (Python)  
- **Data Storage**: JSON file-based storage  
- **Font**: Inter from Google Fonts  

## Installation & Setup

### Prerequisites

- Python 3.x  
- pip (Python package manager)  

### Steps

1. Clone or download the project files:  
   ```bash
   mkdir smart-student-planner
   cd smart-student-planner
Install Python dependencies:

bash
Copy code
pip install flask flask-cors
Ensure all files are in the same directory:

index.html

style.css

script.js

app.py

attendance_data.json (will be created automatically if not present)

Run the Flask server:

bash
Copy code
python app.py
Open the application:

Navigate to http://127.0.0.1:5000/ in your web browser

Or open index.html directly (some features will not work without the backend)

Usage
Adding Subjects
Go to the Attendance tab

Click Add New Subject

Fill in the subject name, total classes, and classes attended

Click Add Subject

Updating Attendance
Click the checkmark (✓) to mark a class as attended

Click the cross (✕) to mark a class as absent

Managing Timetable
Go to the Timetable tab

Click Add Class

Select a subject, day of week, and time

Click Add to Timetable

Calculating Improvement
Go to the Improvement tab

Select a subject

Enter the number of remaining classes in the semester

Click Calculate to see how many classes you need to attend to reach 75% attendance

API Endpoints
GET /api/data - Retrieve all subjects and timetable data

POST /api/subjects - Add a new subject

PUT /api/subjects/<subject_name> - Update attendance for a subject

POST /api/timetable/add - Add a class to the timetable

Data Structure
The application uses a JSON file (attendance_data.json) to store:

Subjects with name, total classes, and classes attended

Weekly timetable with classes organized by day

Browser Compatibility
Works best with modern browsers that support:

ES6+ JavaScript features

CSS Grid and Flexbox

Fetch API

Troubleshooting
CORS errors: Ensure the Flask server is running before using the application

Data not saving: Check that the application has write permissions to the directory

Features not working: Open browser developer tools to check for JavaScript errors

Future Enhancements
User authentication system

Exam and assignment tracking

Notifications and reminders

Data export functionality

Mobile app version
