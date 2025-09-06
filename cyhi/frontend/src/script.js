const API_URL = 'http://127.0.0.1:5000/api';
const EXAM_API_URL = 'http://127.0.0.1:5000/api/exams';

const navItems = document.querySelectorAll('.nav-item');
const tabContents = document.querySelectorAll('.tab-content');
const messageBanner = document.getElementById('message-banner');

const overallAttendance = document.getElementById('overall-attendance');
const todayClassesCount = document.getElementById('today-classes-count');
const subjectAttendanceList = document.getElementById('subject-attendance-list');
const todaysClassesList = document.getElementById('todays-classes-list');
const currentDateEl = document.getElementById('current-date');
const currentTimeEl = document.getElementById('current-time');

const timetableFileInput = document.getElementById('timetable-file-input');
const timetableUploadButton = document.getElementById('upload-button');
const manualAddButton = document.getElementById('manual-add-button');
const timetableContent = document.getElementById('timetable-content');

const attendanceSummaryList = document.getElementById('attendance-summary-list');
const calcSubjectSelect = document.getElementById('calc-subject-select');
const remainingClassesInput = document.getElementById('remaining-classes');
const improvementResult = document.getElementById('improvement-result');
const improvementForm = document.getElementById('improvement-form');

const addSubjectModal = document.getElementById('add-subject-modal');
const addSubjectForm = document.getElementById('add-subject-form');
const subjectNameInput = document.getElementById('subject-name');
const totalClassesInput = document.getElementById('total-classes');
const classesAttendedInput = document.getElementById('classes-attended');
const addSubjectButton = document.getElementById('add-subject-button');
const cancelAddSubjectBtn = document.getElementById('cancel-add-subject');

const addClassModal = document.getElementById('add-class-modal');
const addClassForm = document.getElementById('add-class-form');
const addClassSubjectInput = document.getElementById('add-class-subject-input');
const addClassDaySelect = document.getElementById('add-class-day');
const addClassTimeInput = document.getElementById('add-class-time');
const cancelAddClassBtn = document.getElementById('cancel-add-class');

const examFileInput = document.getElementById('exam-file-input');
const examUploadButton = document.getElementById('upload-exam-button');
const upcomingExamsList = document.getElementById('upcoming-exams-list');
const upcomingExamsCount = document.getElementById('upcoming-exams-count');

const resetButton = document.getElementById('reset-button'); // New reset button element

let allSubjects = [];
let timetableData = {};
let examData = [];

function showMessage(message, type = 'info') {
    if (!messageBanner) return;
    messageBanner.textContent = message;
    messageBanner.classList.remove('hidden', 'bg-red-600', 'bg-green-600', 'bg-blue-600');
    if (type === 'error') {
        messageBanner.classList.add('bg-red-600');
    } else if (type === 'success') {
        messageBanner.classList.add('bg-green-600');
    } else {
        messageBanner.classList.add('bg-blue-600');
    }
    messageBanner.classList.remove('hidden');
    setTimeout(() => {
        messageBanner.classList.add('hidden');
    }, 5000);
}

function updateDateTime() {
    const now = new Date();
    const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const optionsTime = { hour: '2-digit', minute: '2-digit' };
    if (currentDateEl) currentDateEl.textContent = now.toLocaleDateString('en-US', optionsDate);
    if (currentTimeEl) currentTimeEl.textContent = now.toLocaleTimeString('en-US', optionsTime);
}

function calculateOverallAttendance() {
    if (!allSubjects || allSubjects.length === 0) {
        if (overallAttendance) overallAttendance.textContent = '0%';
        return;
    }
    const totalAttended = allSubjects.reduce((sum, s) => sum + s.classesAttended, 0);
    const totalClasses = allSubjects.reduce((sum, s) => sum + s.totalClasses, 0);
    const overallPercentage = totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 0;
    if (overallAttendance) overallAttendance.textContent = `${overallPercentage.toFixed(1)}%`;
}

function renderSubjectAttendance() {
    if (!allSubjects || allSubjects.length === 0) {
        if (subjectAttendanceList) subjectAttendanceList.innerHTML = `<p class="text-center text-gray-400">No attendance data available.</p>`;
        if (attendanceSummaryList) attendanceSummaryList.innerHTML = `<p class="text-center text-gray-400">No attendance records found.</p>`;
        return;
    }
    
    if (subjectAttendanceList) {
        subjectAttendanceList.innerHTML = allSubjects.map(subject => {
            const percentage = subject.totalClasses > 0 ? (subject.classesAttended / subject.totalClasses) * 100 : 0;
            const colorClass = percentage < 75 ? 'text-red-400' : 'text-green-400';
            return `
                <div class="flex justify-between items-center bg-gray-700 p-4 rounded-xl">
                    <div class="flex-1">
                        <span class="font-bold">${subject.name}</span>
                        <div class="text-sm text-gray-400 mt-1">
                            ${subject.classesAttended} / ${subject.totalClasses} classes attended
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="text-lg font-bold ${colorClass}">
                            ${percentage.toFixed(1)}%
                        </span>
                    </div>
                </div>
            `;
        }).join('');
    }

    if (attendanceSummaryList) {
        attendanceSummaryList.innerHTML = allSubjects.map(subject => {
            const percentage = subject.totalClasses > 0 ? (subject.classesAttended / subject.totalClasses) * 100 : 0;
            const futureTotalPresent = subject.totalClasses + 1;
            const futureAttendedPresent = subject.classesAttended + 1;
            const presentPercentage = (futureAttendedPresent / futureTotalPresent) * 100;
            const futureTotalAbsent = subject.totalClasses + 1;
            const futureAttendedAbsent = subject.classesAttended;
            const absentPercentage = (futureAttendedAbsent / futureTotalAbsent) * 100;
            const colorClass = percentage < 75 ? 'text-red-400' : 'text-green-400';

            return `
                <div class="bg-gray-700 p-4 rounded-xl">
                    <div class="flex justify-between items-center mb-2">
                        <span class="font-bold text-lg">${subject.name}</span>
                        <span class="text-sm text-gray-400">Present / Total: ${subject.classesAttended}/${subject.totalClasses}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <div class="w-1/3 text-center">
                            <span class="text-sm text-gray-400 block">Current (%)</span>
                            <span class="text-lg font-bold ${colorClass}">${percentage.toFixed(1)}%</span>
                        </div>
                        <div class="w-1/3 text-center">
                            <span class="text-sm text-gray-400 block">After Present (%)</span>
                            <span class="text-lg font-bold ${presentPercentage < 75 ? 'text-red-400' : 'text-green-400'}">${presentPercentage.toFixed(1)}%</span>
                            <button class="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-xl transition-colors mt-2 text-sm update-btn" data-subject="${subject.name}" data-type="present">✓</button>
                        </div>
                        <div class="w-1/3 text-center">
                            <span class="text-sm text-gray-400 block">After Absent (%)</span>
                            <span class="text-lg font-bold ${absentPercentage < 75 ? 'text-red-400' : 'text-green-400'}">${absentPercentage.toFixed(1)}%</span>
                            <button class="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-xl transition-colors mt-2 text-sm update-btn" data-subject="${subject.name}" data-type="absent">✕</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    document.querySelectorAll('.update-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const subjectName = e.target.dataset.subject;
            const type = e.target.dataset.type;
            const subjectToUpdate = allSubjects.find(s => s.name === subjectName);
            if (!subjectToUpdate) return;

            const updatedTotalClasses = subjectToUpdate.totalClasses + 1;
            const updatedClassesAttended = type === 'present' ? subjectToUpdate.classesAttended + 1 : subjectToUpdate.classesAttended;

            await updateAttendance(subjectName, updatedClassesAttended, updatedTotalClasses);
        });
    });
}

function renderTimetable() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    if (!timetableContent) return;
    const timetableContainer = document.createElement('div');
    timetableContainer.className = "bg-gray-700 p-4 rounded-xl";

    let tableHtml = `<h4 class="text-xl font-bold mb-4">Weekly Timetable</h4>
        <table class="w-full text-center">
            <thead>
                <tr>
                    <th class="p-2 border-b-2 border-gray-600">Day</th>
                    <th class="p-2 border-b-2 border-gray-600">Time</th>
                    <th class="p-2 border-b-2 border-gray-600">Subject</th>
                </tr>
            </thead>
            <tbody>`;

    for (const day of days) {
        if (timetableData[day] && timetableData[day].length > 0) {
            timetableData[day].sort((a, b) => a.time.localeCompare(b.time));
        }
    }

    let hasData = false;
    days.forEach(day => {
        if (timetableData[day] && timetableData[day].length > 0) {
            hasData = true;
            timetableData[day].forEach(item => {
                tableHtml += `
                    <tr>
                        <td class="p-2 border-b border-gray-600">${day}</td>
                        <td class="p-2 border-b border-gray-600">${item.time}</td>
                        <td class="p-2 border-b border-gray-600">${item.subject}</td>
                    </tr>
                `;
            });
        }
    });

    if (!hasData) {
        tableHtml = `<p class="text-center text-gray-400 p-4">No timetable data available.</p>`;
    } else {
        tableHtml += `</tbody></table>`;
    }

    timetableContent.innerHTML = tableHtml;
}

function renderTodaysClasses() {
    const today = new Date();
    const todayDay = today.toLocaleDateString('en-US', { weekday: 'long' });
    const todaysClasses = timetableData[todayDay] || [];

    if (todayClassesCount) todayClassesCount.textContent = todaysClasses.length;

    if (!todaysClassesList) return;
    if (todaysClasses.length === 0) {
        todaysClassesList.innerHTML = `<p class="text-center text-gray-400">No classes scheduled for today.</p>`;
        return;
    }

    todaysClassesList.innerHTML = todaysClasses.map(classItem => {
        return `
            <div class="bg-gray-700 p-4 rounded-xl flex justify-between items-center">
                <div>
                    <span class="font-bold">${classItem.subject}</span>
                    <div class="text-sm text-gray-400 mt-1">${classItem.time}</div>
                </div>
            </div>
        `;
    }).join('');
}

function renderUpcomingExams() {
    if (!upcomingExamsList) return;
    if (!examData || examData.length === 0) {
        upcomingExamsList.innerHTML = `<p class="text-center text-gray-400">No exam data available. Upload a file to get started.</p>`;
        if (upcomingExamsCount) upcomingExamsCount.textContent = 0;
        return;
    }

    if (upcomingExamsCount) upcomingExamsCount.textContent = examData.length;

    examData.sort((a, b) => new Date(a.date) - new Date(b.date));

    upcomingExamsList.innerHTML = examData.map(exam => {
        return `
            <div class="bg-gray-700 p-4 rounded-xl flex justify-between items-center">
                <div>
                    <span class="font-bold">${exam.subject}</span>
                    <div class="text-sm text-gray-400 mt-1">${exam.date} at ${exam.time}</div>
                </div>
            </div>
        `;
    }).join('');
}

async function fetchData() {
    try {
        const response = await fetch(`${API_URL}/data`);
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        const data = await response.json();
        allSubjects = data.subjects || [];
        timetableData = data.timetable || {};
        examData = data.exams || [];
        
        calculateOverallAttendance();
        renderSubjectAttendance();
        renderTodaysClasses();
        renderTimetable();
        renderUpcomingExams();
        populateSubjectSelects();

    } catch (error) {
        console.error('Error fetching data:', error);
        showMessage('Error fetching data from the backend. Please ensure the Flask server is running.', 'error');
    }
}

async function updateAttendance(subjectName, classesAttended, totalClasses) {
    try {
        const response = await fetch(`${API_URL}/subjects/${subjectName}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ classesAttended, totalClasses }),
        });
        const result = await response.json();
        if (response.ok) {
            showMessage(result.message, 'success');
            fetchData();
        } else {
            showMessage(result.error || 'Error updating attendance.', 'error');
        }
    } catch (error) {
        console.error('Error updating attendance:', error);
        showMessage('Error updating attendance. Please try again.', 'error');
    }
}

function populateSubjectSelects() {
    const subjects = allSubjects.map(s => s.name);
    let optionsHtml = '<option value="">Choose a subject</option>';
    subjects.forEach(subject => {
        optionsHtml += `<option value="${subject}">${subject}</option>`;
    });
    if (calcSubjectSelect) calcSubjectSelect.innerHTML = optionsHtml;
}

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const tabName = e.currentTarget.dataset.tab;
        navItems.forEach(nav => nav.classList.remove('active'));
        tabContents.forEach(content => content.classList.add('hidden'));

        e.currentTarget.classList.add('active');
        document.getElementById(tabName).classList.remove('hidden');
        if (tabName === 'timetable') {
            renderTimetable();
        } else if (tabName === 'exams') {
            renderUpcomingExams();
        }
    });
});

addSubjectButton.addEventListener('click', () => {
    addSubjectModal.classList.remove('hidden');
});

cancelAddSubjectBtn.addEventListener('click', () => {
    addSubjectModal.classList.add('hidden');
    addSubjectForm.reset();
});

addSubjectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newSubject = {
        name: subjectNameInput.value,
        totalClasses: parseInt(totalClassesInput.value) || 0,
        classesAttended: parseInt(classesAttendedInput.value) || 0,
    };
    try {
        const response = await fetch(`${API_URL}/subjects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSubject),
        });
        const result = await response.json();
        if (response.ok) {
            showMessage(result.message, 'success');
            addSubjectModal.classList.add('hidden');
            addSubjectForm.reset();
            fetchData();
        } else {
            showMessage(result.error || 'Error adding subject. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Error adding subject:', error);
        showMessage('Error adding subject. Please try again.', 'error');
    }
});

manualAddButton.addEventListener('click', () => {
    addClassModal.classList.remove('hidden');
});

cancelAddClassBtn.addEventListener('click', () => {
    addClassModal.classList.add('hidden');
    addClassForm.reset();
});

addClassForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newClass = {
        subject: addClassSubjectInput.value,
        day: addClassDaySelect.value,
        time: addClassTimeInput.value,
    };
    try {
        const response = await fetch(`${API_URL}/add_class_to_timetable`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newClass),
        });
        const result = await response.json();
        if (response.ok) {
            showMessage(result.message, 'success');
            addClassModal.classList.add('hidden');
            addClassForm.reset();
            fetchData();
        } else {
            showMessage(result.error || 'Error adding class. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Error adding class:', error);
        showMessage('Error adding class. Please try again.', 'error');
    }
});

timetableUploadButton.addEventListener('click', () => {
    timetableFileInput.click();
});

timetableFileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${API_URL}/upload-timetable`, {
            method: 'POST',
            body: formData,
        });
        const result = await response.json();
        if (response.ok) {
            showMessage(result.message, 'success');
            fetchData();
        } else {
            showMessage(result.error || 'Error uploading file.', 'error');
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        showMessage('Error uploading file. Please try again.', 'error');
    }
});

examUploadButton.addEventListener('click', () => {
    examFileInput.click();
});

examFileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${EXAM_API_URL}/upload-exams`, {
            method: 'POST',
            body: formData,
        });
        const result = await response.json();
        if (response.ok) {
            showMessage(result.message, 'success');
            fetchData();
        } else {
            showMessage(result.error || 'Error uploading exam file.', 'error');
        }
    } catch (error) {
        console.error('Error uploading exam file:', error);
        showMessage('Error uploading exam file. Please try again.', 'error');
    }
});

improvementForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const subjectName = calcSubjectSelect.value;
    const remainingClasses = parseInt(remainingClassesInput.value);

    if (!subjectName || isNaN(remainingClasses) || remainingClasses < 0) {
        improvementResult.textContent = 'Please select a subject and enter remaining classes.';
        improvementResult.classList.remove('hidden');
        return;
    }

    const subject = allSubjects.find(s => s.name === subjectName);
    if (!subject) {
        improvementResult.textContent = 'Subject not found.';
        improvementResult.classList.remove('hidden');
        return;
    }

    const { classesAttended, totalClasses } = subject;
    const requiredAttendance = 0.75;
    const classesNeeded = Math.ceil((requiredAttendance * (totalClasses + remainingClasses)) - classesAttended);

    if (classesNeeded > remainingClasses) {
        improvementResult.textContent = `You cannot reach 75% attendance. You need to attend all ${remainingClasses} classes and even more.`;
    } else if (classesNeeded <= 0) {
        improvementResult.textContent = 'You are already above 75% attendance! Great job!';
    } else {
        improvementResult.textContent = `You need to attend at least ${classesNeeded} out of ${remainingClasses} remaining classes to reach 75%.`;
    }
    
    improvementResult.classList.remove('hidden');
});

function populateSubjectSelects() {
    const subjects = allSubjects.map(s => s.name);
    let optionsHtml = '<option value="">Choose a subject</option>';
    subjects.forEach(subject => {
        optionsHtml += `<option value="${subject}">${subject}</option>`;
    });
    if (calcSubjectSelect) calcSubjectSelect.innerHTML = optionsHtml;
}

// --- Reset Functionality ---
if (resetButton) {
    resetButton.addEventListener('click', async () => {
        if (confirm('Are you sure you want to reset all planner data? This action cannot be undone.')) {
            try {
                const response = await fetch(`${API_URL}/reset-data`, {
                    method: 'DELETE'
                });
                const result = await response.json();
                if (response.ok) {
                    alert(result.message);
                    window.location.reload();
                } else {
                    alert(result.error || 'Failed to reset data.');
                }
            } catch (error) {
                console.error('Error resetting data:', error);
                alert('A network error occurred. Failed to reset data.');
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    fetchData();
});