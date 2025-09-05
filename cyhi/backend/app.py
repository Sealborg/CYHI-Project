from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app) 

DATA_FILE = os.path.join(os.path.dirname(__file__), 'attendance_data.json')

def load_data():
    """Loads data from the JSON file."""
    if not os.path.exists(DATA_FILE):
        return {
            "subjects": [],
            "timetable": {
                "Monday": [],
                "Tuesday": [],
                "Wednesday": [],
                "Thursday": [],
                "Friday": [],
                "Saturday": [],
                "Sunday": []
            }
        }
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def save_data(data):
    """Saves data to the JSON file."""
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

@app.route('/api/data', methods=['GET'])
def get_data():
    """Returns all subjects and timetable data."""
    data = load_data()
    return jsonify(data)

@app.route('/api/subjects', methods=['POST'])
def add_subject():
    """Adds a new subject to the data."""
    new_subject = request.json
    data = load_data()
    
    if any(s['name'] == new_subject['name'] for s in data['subjects']):
        return jsonify({"message": "Subject with this name already exists."}), 409
    
    data['subjects'].append(new_subject)
    save_data(data)
    return jsonify({"message": "Subject added successfully!"}), 201

@app.route('/api/subjects/<subject_name>', methods=['PUT'])
def update_attendance(subject_name):
    """Updates attendance for a specific subject."""
    update_data = request.json
    data = load_data()
    
    found_subject = False
    for subject in data['subjects']:
        if subject['name'] == subject_name:
            subject['classesAttended'] = update_data['classesAttended']
            subject['totalClasses'] = update_data['totalClasses']
            found_subject = True
            break
            
    if not found_subject:
        return jsonify({"message": "Subject not found."}), 404
        
    save_data(data)
    return jsonify({"message": f"Attendance for {subject_name} updated successfully!"})

@app.route('/api/timetable/add', methods=['POST'])
def add_class_to_timetable():
    """Adds a class manually to the timetable."""
    new_class = request.json
    data = load_data()
    day = new_class['day']
    
    if day in data['timetable']:
        data['timetable'][day].append({
            "subject_name": new_class['subject_name'],
            "time": new_class['time']
        })
        save_data(data)
        return jsonify({"message": "Class added to timetable successfully!"}), 201
    else:
        return jsonify({"message": "Invalid day of the week."}), 400

if __name__ == '__main__':
    app.run(debug=True)
