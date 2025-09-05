import json
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# Path for the data file
DATA_FILE = 'attendance_data.json'

# --- Utility Functions ---
def get_data():
    """Reads data from the JSON file."""
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'w') as f:
            json.dump({"subjects": [], "timetable": {}, "exams": []}, f)
    with open(DATA_FILE, 'r') as f:
        data = json.load(f)
    # Ensure keys exist to prevent crashes
    if "subjects" not in data:
        data["subjects"] = []
    if "timetable" not in data:
        data["timetable"] = {}
    if "exams" not in data:
        data["exams"] = []
    return data

def save_data(data):
    """Saves data to the JSON file."""
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

# --- Frontend Route ---
@app.route('/')
def serve_index():
    return send_from_directory('frontend', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('frontend', path)

# --- API Endpoints ---
@app.route('/api/data', methods=['GET'])
def get_all_data():
    data = get_data()
    return jsonify(data)

@app.route('/api/subjects', methods=['POST'])
def add_subject():
    data = get_data()
    new_subject = request.json
    
    # Check if subject already exists
    subject_exists = any(s['name'] == new_subject['name'] for s in data['subjects'])
    if subject_exists:
        return jsonify({"error": "Subject with this name already exists."}), 400

    new_subject['totalClasses'] = int(new_subject.get('totalClasses', 0))
    new_subject['classesAttended'] = int(new_subject.get('classesAttended', 0))
    data['subjects'].append(new_subject)
    save_data(data)
    return jsonify({"message": "Subject added successfully!"})

@app.route('/api/subjects/<subject_name>', methods=['PUT'])
def update_subject(subject_name):
    data = get_data()
    for subject in data['subjects']:
        if subject['name'] == subject_name:
            subject['classesAttended'] = int(request.json['classesAttended'])
            subject['totalClasses'] = int(request.json['totalClasses'])
            save_data(data)
            return jsonify({"message": "Attendance updated successfully!"})
    return jsonify({"error": "Subject not found"}), 404

@app.route('/api/upload-timetable', methods=['POST'])
def upload_timetable():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        # Read file with no header and manually assign column names
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file, header=None, names=['Day', 'Time', 'Subject'])
        elif file.filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(file, engine='openpyxl', header=None, names=['Day', 'Time', 'Subject'])
        else:
            return jsonify({"error": "Invalid file type. Please upload a CSV or XLSX file."}), 400

        # Basic validation
        if df.shape[1] != 3:
             return jsonify({"error": "File must contain exactly 3 columns: Day, Time, Subject."}), 400

        timetable = {}
        unique_subjects = df['Subject'].unique()
        
        data = get_data()
        
        for subject_name in unique_subjects:
            subject_exists = any(s['name'] == subject_name for s in data['subjects'])
            if not subject_exists:
                data['subjects'].append({"name": subject_name, "totalClasses": 0, "classesAttended": 0})
        
        for index, row in df.iterrows():
            day = row['Day'].capitalize()
            time = str(row['Time'])
            subject = row['Subject']
            if day not in timetable:
                timetable[day] = []
            timetable[day].append({"time": time, "subject": subject})
        
        data['timetable'] = timetable
        save_data(data)
        return jsonify({"message": "Timetable uploaded successfully!"})
    except Exception as e:
        return jsonify({"error": f"Failed to process file: {str(e)}"}), 500

@app.route('/api/add_class_to_timetable', methods=['POST'])
def add_class_to_timetable():
    data = get_data()
    new_class = request.json
    day = new_class.get('day')
    subject = new_class.get('subject')
    
    if not subject:
        return jsonify({"error": "Subject cannot be empty."}), 400

    if day not in data['timetable']:
        data['timetable'][day] = []
    data['timetable'][day].append(new_class)
    
    subject_exists = any(s['name'] == subject for s in data['subjects'])
    if not subject_exists:
        data['subjects'].append({"name": subject, "totalClasses": 0, "classesAttended": 0})

    save_data(data)
    return jsonify({"message": "Class added to timetable successfully!"})

@app.route('/api/exams/upload-exams', methods=['POST'])
def upload_exams():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file, header=None, names=['Subject', 'Date', 'Time'])
        elif file.filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(file, engine='openpyxl', header=None, names=['Subject', 'Date', 'Time'])
        else:
            return jsonify({"error": "Invalid file type. Please upload a CSV or XLSX file."}), 400
        
        if df.shape[1] != 3:
             return jsonify({"error": "Exam file must contain exactly 3 columns: Subject, Date, Time."}), 400
        
        data = get_data()
        unique_subjects = df['Subject'].unique()
        for subject_name in unique_subjects:
            subject_exists = any(s['name'] == subject_name for s in data['subjects'])
            if not subject_exists:
                data['subjects'].append({"name": subject_name, "totalClasses": 0, "classesAttended": 0})

        exams = []
        for index, row in df.iterrows():
            exams.append({
                "subject": row['Subject'],
                "date": str(row['Date']),
                "time": str(row['Time'])
            })
        
        data['exams'] = exams
        save_data(data)
        return jsonify({"message": "Exam timetable uploaded successfully!"})
    except Exception as e:
        return jsonify({"error": f"Failed to process file: {str(e)}"}), 500


if __name__ == '__main__':
    if not os.path.exists('frontend'):
        print("Frontend directory not found. Please create it and place your HTML, CSS, and JS files inside.")
    app.run(debug=True, port=5000)
