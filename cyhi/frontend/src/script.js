const API_URL = 'http://127.0.0.1:5000/api';

const navItems = document.querySelectorAll('.nav-item');
const contentSections = document.querySelectorAll('.content-section');
const messageBanner = document.getElementById('message-banner');

const subjectListDiv = document.getElementById('subject-list');
const attendanceListDiv = document.getElementById('attendance-list');
const overallAttendanceDiv = document.getElementById('overall-attendance');
const timetableGridDiv = document.getElementById('timetable-grid');

const addSubjectModal = document.getElementById('add-subject-modal');
const addSubjectForm = document.getElementById('add-subject-form');
const addSubjectBtn = document.getElementById('add-subject-btn');
const cancelAddSubjectBtn = document.getElementById('cancel-add-subject');

const addTimetableModal = document.getElementById('add-timetable-modal');
const timetableSubjectSelect = document.getElementById('timetable-subject');
const addTimetableForm = document.getElementById('add-timetable-form');
const addTimetableBtn = document.getElementById('add-timetable-btn'); 
const cancelTimetableBtn = document.getElementById('cancel-timetable');

const improvementForm = document.getElementById('improvement-form');
const calcSubjectSelect = document.getElementById('calc-subject');
const remainingClassesInput = document.getElementById('remaining-classes');
const improvementResultDiv = document.getElementById('improvement-result');

let subjects = [];
let timetable = {};

document.addEventListener('DOMContentLoaded', () => {
    if (addTimetableBtn) {
        addTimetableBtn.addEventListener('click', () => addTimetableModal.classList.remove('hidden'));
    }
    
    if (addSubjectBtn) {
        addSubjectBtn.addEventListener('click', () => {
            addSubjectModal.classList.remove('hidden');
        });
    }

    if (cancelAddSubjectBtn) {
        cancelAddSubjectBtn.addEventListener('click', () => {
            addSubjectModal.classList.add('hidden');
        });
    }

    if (cancelTimetableBtn) {
        cancelTimetableBtn.addEventListener('click', () => {
            addTimetableModal.classList.add('hidden');
        });
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            const tab = item.getAttribute('data-tab');
            contentSections.forEach(section => {
                section.classList.add('hidden');
                if (section.id === tab) {
                    section.classList.remove('hidden');
                }
            });
            if (tab === 'timetable') {
                renderTimetable();
            } else if (tab === 'attendance') {
                renderAttendanceList();
            }
        });
    });

    addSubjectForm.addEventListener('submit', handleAddSubject);
    addTimetableForm.addEventListener('submit', handleAddTimetable);
    improvementForm.addEventListener('submit', handleCalculateImprovement);
    
    fetchData();
});

const showMessage = (message, type = 'info') => {
    messageBanner.textContent = message;
    messageBanner.classList.remove('hidden', 'bg-red-600', 'bg-green-600', 'bg-blue-600');
    if (type === 'error') {
        messageBanner.classList.add('bg-red-600');
    } else if (type === 'success') {
        messageBanner.classList.add('bg-green-600');
    } else {
        messageBanner.classList.add('bg-blue-600');
    }
    setTimeout(() => {
        messageBanner.classList.add('hidden');
    }, 5000);
};

const fetchData = async () => {
    showMessage('Loading data...', 'info');
    try {
        const response = await fetch(`${API_URL}/data`);
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        const data = await response.json();
        subjects = data.subjects;
        timetable = data.timetable;
        renderDashboard();
        populateSubjectSelects();
        showMessage('Data loaded successfully!', 'success');
    } catch (error) {
        console.error('Error fetching data:', error);
        showMessage('Error fetching data. Please ensure the Flask server is running and CORS is configured.', 'error');
    }
};

const renderDashboard = () => {

    const totalClasses = subjects.reduce((sum, s) => sum + s.totalClasses, 0);
    const attendedClasses = subjects.reduce((sum, s) => sum + s.classesAttended, 0);
    const overallPercentage = totalClasses > 0 ? ((attendedClasses / totalClasses) * 100).toFixed(0) : 0;
    overallAttendanceDiv.textContent = `${overallPercentage}%`;
    

    if (subjects.length === 0) {
        subjectListDiv.innerHTML = '<p class="text-center text-gray-400">No attendance data available. Add a new subject to get started.</p>';
    } else {
        subjectListDiv.innerHTML = subjects.map(subject => `
            <div class="flex justify-between items-center bg-gray-700 p-4 rounded-xl">
                <div class="flex-1">
                    <span class="font-bold">${subject.name}</span>
                    <div class="text-sm text-gray-400 mt-1">
                        ${subject.classesAttended} / ${subject.totalClasses} classes attended
                    </div>
                </div>
                <div class="text-right">
                    <span class="text-lg font-bold ${
                        (subject.classesAttended / subject.totalClasses) * 100 < 75 ? 'text-red-400' : 'text-green-400'
                    }">
                        ${subject.totalClasses > 0 ? ((subject.classesAttended / subject.totalClasses) * 100).toFixed(1) : '0'}%
                    </span>
                </div>
            </div>
        `).join('');
    }
};

const renderAttendanceList = () => {
    if (subjects.length === 0) {
        attendanceListDiv.innerHTML = `
            <div class="p-8 text-center text-gray-400">
                <p class="mb-4">No attendance records found.</p>
                <button id="add-subject-btn" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl transition-colors">
                    <span class="inline-flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                        <span>Add New Subject</span>
                    </span>
                </button>
            </div>
        `;
        document.getElementById('add-subject-btn').addEventListener('click', () => addSubjectModal.classList.remove('hidden'));
    } else {
        attendanceListDiv.innerHTML = `
            <div class="space-y-4">
                ${subjects.map(subject => `
                    <div class="flex justify-between items-center bg-gray-700 p-4 rounded-xl">
                        <div class="flex-1">
                            <span class="font-bold text-lg">${subject.name}</span>
                            <div class="text-sm text-gray-400 mt-1">
                                ${subject.classesAttended} / ${subject.totalClasses}
                            </div>
                            <div class="flex items-center mt-2 space-x-2 text-sm text-gray-400">
                                <span>Future Attendance:</span>
                                <span class="text-green-400">P: ${
                                    (subject.classesAttended + 1) / (subject.totalClasses + 1) * 100
                                }%</span>
                                <span class="text-red-400">A: ${
                                    (subject.classesAttended) / (subject.totalClasses + 1) * 100
                                }%</span>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <button class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl transition-colors attendance-tick-btn" data-subject="${subject.name}">
                                ✓
                            </button>
                            <button class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl transition-colors attendance-cross-btn" data-subject="${subject.name}">
                                ✕
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="text-center mt-6">
                <button id="add-subject-btn-footer" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl transition-colors">
                    <span class="inline-flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                        <span>Add New Subject</span>
                    </span>
                </button>
            </div>
        `;
        document.querySelectorAll('.attendance-tick-btn').forEach(button => {
            button.addEventListener('click', (e) => handleAttendanceTick(e.target.dataset.subject));
        });
        document.querySelectorAll('.attendance-cross-btn').forEach(button => {
            button.addEventListener('click', (e) => handleAttendanceCross(e.target.dataset.subject));
        });
        document.getElementById('add-subject-btn-footer').addEventListener('click', () => {
            addSubjectModal.classList.remove('hidden');
        });
    }
};

const renderTimetable = () => {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    let timetableHTML = `
        <div class="flex justify-end mb-4">
            <button id="add-class-btn" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl transition-colors">
                <span class="inline-flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    <span>Add Class</span>
                </span>
            </button>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
    `;

    daysOfWeek.forEach(day => {
        timetableHTML += `
            <div class="bg-gray-700 p-4 rounded-xl">
                <h4 class="font-bold text-indigo-400 mb-2">${day}</h4>
                <div class="space-y-2">
                    ${timetable[day] && timetable[day].length > 0
                        ? timetable[day].map(cls => `
                            <div class="bg-gray-600 p-2 rounded-lg">
                                <p class="font-medium">${cls.time}</p>
                                <p class="text-sm text-gray-300">${cls.subject_name}</p>
                            </div>
                        `).join('')
                        : `<p class="text-gray-400 text-sm">No classes</p>`
                    }
                </div>
            </div>
        `;
    });

    timetableHTML += `</div>`;
    timetableGridDiv.innerHTML = timetableHTML;
    document.getElementById('add-class-btn').addEventListener('click', () => {
        addTimetableModal.classList.remove('hidden');
    });
};

const populateSubjectSelects = () => {
    const subjectOptions = subjects.map(subject => `<option value="${subject.name}">${subject.name}</option>`).join('');
    if (timetableSubjectSelect) {
        timetableSubjectSelect.innerHTML = `<option value="">Choose a subject</option>` + subjectOptions;
    }
    if (calcSubjectSelect) {
        calcSubjectSelect.innerHTML = `<option value="">Choose a subject</option>` + subjectOptions;
    }
};

const handleAddSubject = async (e) => {
    e.preventDefault();
    const name = document.getElementById('subject-name').value;
    const totalClasses = parseInt(document.getElementById('total-classes').value);
    const classesAttended = parseInt(document.getElementById('classes-attended').value) || 0;

    try {
        const response = await fetch(`${API_URL}/subjects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, totalClasses, classesAttended }),
        });
        const result = await response.json();
        if (response.ok) {
            showMessage(result.message, 'success');
            addSubjectModal.classList.add('hidden');
            document.getElementById('add-subject-form').reset();
            fetchData();
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        console.error('Error adding subject:', error);
        showMessage('Error adding subject. Please ensure the Flask server is running.', 'error');
    }
};

const handleAttendanceTick = async (subjectName) => {
    const subjectToUpdate = subjects.find(s => s.name === subjectName);
    if (subjectToUpdate) {
        const updatedClassesAttended = subjectToUpdate.classesAttended + 1;
        const updatedTotalClasses = subjectToUpdate.totalClasses + 1;
        await updateAttendance(subjectName, updatedClassesAttended, updatedTotalClasses);
    }
};

const handleAttendanceCross = async (subjectName) => {
    const subjectToUpdate = subjects.find(s => s.name === subjectName);
    if (subjectToUpdate) {
        const updatedTotalClasses = subjectToUpdate.totalClasses + 1;
        await updateAttendance(subjectName, subjectToUpdate.classesAttended, updatedTotalClasses);
    }
};

const updateAttendance = async (subjectName, classesAttended, totalClasses) => {
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
            showMessage(result.message, 'error');
        }
    } catch (error) {
        console.error('Error updating attendance:', error);
        showMessage('Error updating attendance. Please try again.', 'error');
    }
};

const handleCalculateImprovement = (e) => {
    e.preventDefault();
    const subjectName = calcSubjectSelect.value;
    const remainingClasses = parseInt(remainingClassesInput.value);
    
    if (!subjectName || isNaN(remainingClasses) || remainingClasses < 0) {
        improvementResultDiv.classList.remove('hidden');
        improvementResultDiv.classList.add('bg-red-600');
        improvementResultDiv.innerHTML = `<p class="font-bold">Please select a subject and enter a valid number of remaining classes.</p>`;
        return;
    }

    const subject = subjects.find(s => s.name === subjectName);
    const { classesAttended, totalClasses } = subject;
    const requiredAttendance = 0.75;
    

    const classesNeeded = Math.ceil((requiredAttendance * (totalClasses + remainingClasses)) - classesAttended);

    improvementResultDiv.classList.remove('hidden', 'bg-red-600', 'bg-green-600');
    
    if (classesNeeded > remainingClasses) {
        improvementResultDiv.classList.add('bg-red-600');
        improvementResultDiv.innerHTML = `<p class="font-bold">You cannot reach 75% attendance. You need to attend all ${remainingClasses} classes and even more.</p>`;
    } else if (classesNeeded <= 0) {
        improvementResultDiv.classList.add('bg-green-600');
        improvementResultDiv.innerHTML = `<p class="font-bold">You are already above 75% attendance! Great job!</p>`;
    } else {
        improvementResultDiv.classList.add('bg-blue-600');
        improvementResultDiv.innerHTML = `<p class="font-bold">You need to attend at least ${classesNeeded} out of ${remainingClasses} remaining classes to reach 75%.</p>`;
    }
};

const handleAddTimetable = async (e) => {
    e.preventDefault();
    const subjectName = document.getElementById('timetable-subject').value;
    const day = document.getElementById('timetable-day').value;
    const time = document.getElementById('timetable-time').value;

    if (!subjectName || !day || !time) {
        showMessage('Please fill in all timetable details.', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/timetable/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subject_name: subjectName, day, time }),
        });
        const result = await response.json();
        if (response.ok) {
            showMessage(result.message, 'success');
            addTimetableModal.classList.add('hidden');
            document.getElementById('add-timetable-form').reset();
            fetchData();
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        console.error('Error adding class to timetable:', error);
        showMessage('Error adding class. Please try again.', 'error');
    }
};