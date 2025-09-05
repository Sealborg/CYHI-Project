# Smart Student Planner

## Overview
Smart Student Planner is a web-based application designed to help students manage their academic schedules, track attendance, and plan for academic improvement. The application allows users to add subjects, update attendance, view their weekly timetable, and calculate the number of classes needed to achieve a target attendance percentage (e.g., 75%).

## Features
- **Dashboard**: Displays an overview of overall attendance, today's classes, upcoming exams, and subject-wise attendance details.
- **Timetable**: Visualize weekly class schedules with the ability to add new classes.
- **Attendance Tracking**: Record attendance for each subject with options to mark present or absent, and view future attendance projections.
- **Improvement Calculator**: Calculate how many classes a student needs to attend to reach a target attendance percentage.
- **Responsive Design**: Built with Tailwind CSS for a modern, user-friendly interface that works across devices.
- **Backend API**: Powered by Flask to handle data storage and retrieval using a JSON file (`attendance_data.json`).

## Tech Stack
- **Frontend**:
  - HTML, CSS (with Tailwind CSS for styling)
  - JavaScript for dynamic functionality
  - Inter font (via Google Fonts)
- **Backend**:
  - Flask (Python) for API endpoints
  - JSON file (`attendance_data.json`) for data persistence
- **Dependencies**:
  - Flask
  - Flask-CORS
  - Tailwind CSS (CDN)
  - Google Fonts

## Project Structure
```
smart-student-planner/
├── index.html          # Main HTML file for the frontend
├── style.css           # Custom CSS styles
├── script.js           # JavaScript for frontend logic
├── attendance_data.json # JSON file for storing subjects and timetable
├── app.py              # Flask backend server
└── README.md           # Project documentation
```

## Setup Instructions

### Prerequisites
- Python 3.6+
- Node.js (optional, for local development with Tailwind CSS if not using CDN)
- A modern web browser

### Installation
1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd smart-student-planner
   ```

2. **Set Up the Backend**:
   - Install Python dependencies:
     ```bash
     pip install flask flask-cors
     ```
   - Run the Flask server:
     ```bash
     python app.py
     ```
     The backend will run on `http://127.0.0.1:5000`.

3. **Set Up the Frontend**:
   - The frontend is served as static files (`index.html`, `style.css`, `script.js`).
   - Ensure the backend is running, as the frontend makes API calls to `http://127.0.0.1:5000/api`.
   - Open `index.html` in a browser, or serve it using a local server (e.g., with Python):
     ```bash
     python -m http.server 8000
     ```
     Then navigate to `http://localhost:8000` in your browser.

4. **Data Storage**:
   - The application uses `attendance_data.json` to store subjects and timetable data. Ensure this file is in the same directory as `app.py`.
   - A sample `attendance_data.json` is provided with initial data for testing.

### Running the Application
1. Start the Flask backend:
   ```bash
   python app.py
   ```
2. Open `index.html` in a browser or serve it via a local server.
3. Interact with the application through the dashboard, timetable, attendance, and improvement tabs.

## Usage
- **Dashboard**: View overall attendance, today's classes, and subject-wise attendance.
- **Timetable**: Check your weekly schedule and add new classes via the "Add Class" button.
- **Attendance**: Mark attendance for subjects (✓ for present, ✕ for absent) and add new subjects.
- **Improvement**: Select a subject and input the number of remaining classes to calculate how many you need to attend to reach 75% attendance.

## API Endpoints
The Flask backend provides the following API endpoints:
- `GET /api/data`: Retrieves all subjects and timetable data.
- `POST /api/subjects`: Adds a new subject.
- `PUT /api/subjects/<subject_name>`: Updates attendance for a specific subject.
- `POST /api/timetable/add`: Adds a class to the timetable.

## Notes
- Ensure the Flask server is running before using the frontend, as it relies on API calls.
- The application assumes a target attendance of 75% for the improvement calculator.
- CORS is enabled in the Flask backend to allow communication with the frontend.
- The frontend uses Tailwind CSS via CDN for styling, so no additional setup is required for CSS.

## Future Improvements
- Add user authentication to support multiple users.
- Implement a database (e.g., SQLite or PostgreSQL) instead of a JSON file for better scalability.
- Add support for editing or deleting subjects and timetable entries.
- Enhance the UI with additional visualizations (e.g., attendance charts).

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.