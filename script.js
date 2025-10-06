// In-memory data storage
let users = [];
let skills = [];
let employeeSkills = [];
let projects = [];
let assignments = [];
let currentUser = null;
let currentRole = 'admin';

// Chart instances
let charts = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeSampleData();
    setupEventListeners();
    updateCurrentUser();
    initializeApp();
});

// Initialize sample data
function initializeSampleData() {
    users = [
        { id: 1, name: 'Admin User', email: 'admin@company.com', department: 'IT', role: 'admin' },
        { id: 2, name: 'Manager Smith', email: 'manager@company.com', department: 'Engineering', role: 'manager' },
        { id: 3, name: 'John Developer', email: 'john@company.com', department: 'Engineering', role: 'employee' },
        { id: 4, name: 'Jane Designer', email: 'jane@company.com', department: 'Design', role: 'employee' },
        { id: 5, name: 'Bob Analyst', email: 'bob@company.com', department: 'Analytics', role: 'employee' },
        { id: 6, name: 'Sarah Marketing', email: 'sarah@company.com', department: 'Marketing', role: 'employee' },
        { id: 7, name: 'Mike Frontend', email: 'mike@company.com', department: 'Engineering', role: 'employee' },
        { id: 8, name: 'Lisa Backend', email: 'lisa@company.com', department: 'Engineering', role: 'employee' }
    ];

    skills = [
        { id: 1, name: 'JavaScript', category: 'Technical' },
        { id: 2, name: 'React', category: 'Technical' },
        { id: 3, name: 'Python', category: 'Technical' },
        { id: 4, name: 'SQL', category: 'Technical' },
        { id: 5, name: 'UI/UX Design', category: 'Design' },
        { id: 6, name: 'Project Management', category: 'Management' },
        { id: 7, name: 'Communication', category: 'Soft Skills' },
        { id: 8, name: 'Figma', category: 'Tools' },
        { id: 9, name: 'Node.js', category: 'Technical' },
        { id: 10, name: 'CSS', category: 'Technical' },
        { id: 11, name: 'Leadership', category: 'Soft Skills' },
        { id: 12, name: 'Data Analysis', category: 'Technical' }
    ];

    employeeSkills = [
        { id: 1, userId: 3, skillId: 1, level: 5 },
        { id: 2, userId: 3, skillId: 2, level: 4 },
        { id: 3, userId: 3, skillId: 9, level: 4 },
        { id: 4, userId: 4, skillId: 5, level: 5 },
        { id: 5, userId: 4, skillId: 8, level: 4 },
        { id: 6, userId: 4, skillId: 10, level: 4 },
        { id: 7, userId: 5, skillId: 4, level: 5 },
        { id: 8, userId: 5, skillId: 3, level: 4 },
        { id: 9, userId: 5, skillId: 12, level: 5 },
        { id: 10, userId: 6, skillId: 7, level: 5 },
        { id: 11, userId: 7, skillId: 1, level: 4 },
        { id: 12, userId: 7, skillId: 2, level: 5 },
        { id: 13, userId: 7, skillId: 10, level: 5 },
        { id: 14, userId: 8, skillId: 9, level: 5 },
        { id: 15, userId: 8, skillId: 3, level: 4 }
    ];

    projects = [
        { 
            id: 1, 
            name: 'E-commerce Platform', 
            description: 'Build a modern shopping site with React', 
            requiredSkills: 'JavaScript,React,CSS', 
            minLevel: 4, 
            createdBy: 2 
        },
        { 
            id: 2, 
            name: 'Mobile App Redesign', 
            description: 'Refresh UI/UX for mobile application', 
            requiredSkills: 'UI/UX Design,Figma', 
            minLevel: 4, 
            createdBy: 2 
        },
        { 
            id: 3, 
            name: 'Data Analytics Dashboard', 
            description: 'Create analytics dashboard with Python', 
            requiredSkills: 'Python,SQL,Data Analysis', 
            minLevel: 4, 
            createdBy: 1 
        }
    ];

    assignments = [
        { id: 1, projectId: 1, userId: 3 },
        { id: 2, projectId: 1, userId: 7 },
        { id: 3, projectId: 2, userId: 4 },
        { id: 4, projectId: 3, userId: 5 }
    ];
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('roleSelector').addEventListener('change', (e) => {
        currentRole = e.target.value;
        updateCurrentUser();
        initializeApp();
    });

    document.getElementById('employeeSearch').addEventListener('input', filterEmployees);
    document.getElementById('departmentFilter').addEventListener('change', filterEmployees);
    document.getElementById('roleFilter').addEventListener('change', filterEmployees);

    document.getElementById('addSkillForm').addEventListener('submit', handleAddSkill);
    document.getElementById('addProjectForm').addEventListener('submit', handleAddProject);
}

// Update current user based on role
function updateCurrentUser() {
    currentUser = users.find(u => u.role === currentRole) || users[0];
    document.getElementById('userBadge').textContent = `${currentUser.name} (${currentRole.toUpperCase()})`;
}

// Initialize app
function initializeApp() {
    setupNavigation();
    showSection('dashboard');
}

// Setup navigation based on role
function setupNavigation() {
    const navTabs = document.getElementById('navTabs');
    navTabs.innerHTML = '';
    
    const tabs = [
        { id: 'dashboard', label: 'Dashboard', roles: ['admin', 'manager'] },
        { id: 'employees', label: 'Employees', roles: ['admin', 'manager'] },
        { id: 'skills', label: 'Skills', roles: ['admin', 'manager', 'employee'] },
        { id: 'projects', label: 'Projects', roles: ['admin', 'manager'] },
        { id: 'profile', label: 'My Profile', roles: ['admin', 'manager', 'employee'] }
    ];

    tabs.forEach(tab => {
        if (tab.roles.includes(currentRole)) {
            const btn = document.createElement('button');
            btn.className = 'nav-tab';
            btn.textContent = tab.label;
            btn.onclick = () => showSection(tab.id);
            navTabs.appendChild(btn);
        }
    });

    // Show/hide action buttons based on role
    document.getElementById('addSkillBtn').style.display = 
        ['admin', 'manager'].includes(currentRole) ? 'inline-block' : 'none';
    document.getElementById('addProjectBtn').style.display = 
        ['admin', 'manager'].includes(currentRole) ? 'inline-block' : 'none';
}

// Show section
function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    
    document.getElementById(sectionId + 'Section').classList.add('active');
    
    const activeTab = Array.from(document.querySelectorAll('.nav-tab')).find(
        tab => tab.textContent.toLowerCase().includes(sectionId)
    );
    if (activeTab) activeTab.classList.add('active');

    switch(sectionId) {
        case 'dashboard': loadDashboard(); break;
        case 'employees': loadEmployees(); break;
        case 'skills': loadSkills(); break;
        case 'projects': loadProjects(); break;
        case 'profile': loadProfile(); break;
    }
}

// Dashboard Functions
function loadDashboard() {
    loadStats();
    renderCharts();
}

function loadStats() {
    const statsGrid = document.getElementById('statsGrid');
    const avgSkillLevel = employeeSkills.length > 0 
        ? (employeeSkills.reduce((sum, es) => sum + es.level, 0) / employeeSkills.length).toFixed(1)
        : 0;

    statsGrid.innerHTML = `
        <div class="stat-card">
            <h4>Total Employees</h4>
            <div class="stat-value">${users.length}</div>
        </div>
        <div class="stat-card">
            <h4>Total Skills</h4>
            <div class="stat-value">${skills.length}</div>
        </div>
        <div class="stat-card">
            <h4>Active Projects</h4>
            <div class="stat-value">${projects.length}</div>
        </div>
        <div class="stat-card">
            <h4>Avg Skill Level</h4>
            <div class="stat-value">${avgSkillLevel}</div>
        </div>
    `;
}

function renderCharts() {
    renderTopSkillsChart();
    renderDepartmentChart();
    renderSkillLevelChart();
    renderRadarChart();
}

function renderTopSkillsChart() {
    const ctx = document.getElementById('topSkillsChart');
    if (!ctx) return;

    const skillCounts = {};
    employeeSkills.forEach(es => {
        const skill = skills.find(s => s.id === es.skillId);
        if (skill) {
            skillCounts[skill.name] = (skillCounts[skill.name] || 0) + 1;
        }
    });

    const sortedSkills = Object.entries(skillCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);

    if (charts.topSkills) charts.topSkills.destroy();
    
    charts.topSkills = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedSkills.map(s => s[0]),
            datasets: [{
                label: 'Number of Employees',
                data: sortedSkills.map(s => s[1]),
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1 } }
            }
        }
    });
}

function renderDepartmentChart() {
    const ctx = document.getElementById('departmentChart');
    if (!ctx) return;

    const deptCounts = {};
    users.forEach(u => {
        deptCounts[u.department] = (deptCounts[u.department] || 0) + 1;
    });

    if (charts.department) charts.department.destroy();

    charts.department = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(deptCounts),
            datasets: [{
                data: Object.values(deptCounts),
                backgroundColor: [
                    'rgba(102, 126, 234, 0.8)',
                    'rgba(118, 75, 162, 0.8)',
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });
}

function renderSkillLevelChart() {
    const ctx = document.getElementById('skillLevelChart');
    if (!ctx) return;

    const levelCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    employeeSkills.forEach(es => {
        levelCounts[es.level]++;
    });

    if (charts.skillLevel) charts.skillLevel.destroy();

    charts.skillLevel = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'],
            datasets: [{
                label: 'Number of Skills',
                data: Object.values(levelCounts),
                backgroundColor: [
                    'rgba(244, 67, 54, 0.8)',
                    'rgba(255, 152, 0, 0.8)',
                    'rgba(255, 235, 59, 0.8)',
                    'rgba(76, 175, 80, 0.8)',
                    'rgba(33, 150, 243, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1 } }
            }
        }
    });
}

function renderRadarChart() {
    const ctx = document.getElementById('radarChart');
    if (!ctx) return;

    // Get skills for a sample employee
    const sampleEmployee = users.find(u => u.role === 'employee');
    if (!sampleEmployee) return;

    const userSkills = employeeSkills
        .filter(es => es.userId === sampleEmployee.id)
        .map(es => {
            const skill = skills.find(s => s.id === es.skillId);
            return { name: skill.name, level: es.level };
        });

    if (charts.radar) charts.radar.destroy();

    charts.radar = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: userSkills.map(s => s.name),
            datasets: [{
                label: sampleEmployee.name,
                data: userSkills.map(s => s.level),
                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 5,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

// Employees Functions
function loadEmployees() {
    filterEmployees();
}

function filterEmployees() {
    const search = document.getElementById('employeeSearch').value.toLowerCase();
    const deptFilter = document.getElementById('departmentFilter').value;
    const roleFilter = document.getElementById('roleFilter').value;

    let filtered = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(search) ||
                            user.email.toLowerCase().includes(search) ||
                            user.department.toLowerCase().includes(search);
        const matchesDept = !deptFilter || user.department === deptFilter;
        const matchesRole = !roleFilter || user.role === roleFilter;
        
        return matchesSearch && matchesDept && matchesRole;
    });

    const tbody = document.getElementById('employeesTableBody');
    tbody.innerHTML = filtered.map(user => {
        const userSkillCount = employeeSkills.filter(es => es.userId === user.id).length;
        return `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.department}</td>
                <td><span class="badge badge-${user.role}">${user.role}</span></td>
                <td>${userSkillCount}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="viewEmployeeSkills(${user.id})">
                        View Skills
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function viewEmployeeSkills(userId) {
    const user = users.find(u => u.id === userId);
    const userSkills = employeeSkills.filter(es => es.userId === userId);

    document.getElementById('viewSkillsTitle').textContent = `${user.name}'s Skills`;
    
    const content = document.getElementById('viewSkillsContent');
    content.innerHTML = userSkills.length > 0 ? userSkills.map(es => {
        const skill = skills.find(s => s.id === es.skillId);
        return `
            <div class="skill-card">
                <div class="skill-header">
                    <span class="skill-name">${skill.name}</span>
                    <span class="skill-category">${skill.category}</span>
                </div>
                <div class="skill-rating">
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${es.level * 20}%">
                            Level ${es.level}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('') : '<p class="text-center">No skills recorded yet.</p>';

    openModal('viewSkillsModal');
}

// Skills Functions
function loadSkills() {
    const grid = document.getElementById('skillsGrid');
    
    grid.innerHTML = skills.map(skill => {
        const userSkill = employeeSkills.find(
            es => es.skillId === skill.id && es.userId === currentUser.id
        );
        const level = userSkill ? userSkill.level : 0;

        return `
            <div class="skill-card">
                <div class="skill-header">
                    <span class="skill-name">${skill.name}</span>
                    <span class="skill-category">${skill.category}</span>
                </div>
                <div class="skill-rating">
                    <div class="rating-stars" data-skill-id="${skill.id}">
                        ${[1, 2, 3, 4, 5].map(i => 
                            `<span class="star ${i <= level ? 'active' : ''}" 
                                   onclick="rateSkill(${skill.id}, ${i})">★</span>`
                        ).join('')}
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${level * 20}%">
                            ${level > 0 ? `Level ${level}` : 'Not rated'}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function rateSkill(skillId, level) {
    const existingSkill = employeeSkills.find(
        es => es.skillId === skillId && es.userId === currentUser.id
    );

    if (existingSkill) {
        existingSkill.level = level;
    } else {
        employeeSkills.push({
            id: employeeSkills.length + 1,
            userId: currentUser.id,
            skillId: skillId,
            level: level
        });
    }

    loadSkills();
    showAlert('skillsAlert', `Skill level updated to ${level}!`, 'success');
}

// Projects Functions
function loadProjects() {
    const grid = document.getElementById('projectsGrid');
    
    grid.innerHTML = projects.map(project => {
        const projectAssignments = assignments.filter(a => a.projectId === project.id);
        const requiredSkillsArray = project.requiredSkills.split(',');

        return `
            <div class="project-card">
                <div class="project-header">
                    <h4>${project.name}</h4>
                </div>
                <p class="project-description">${project.description}</p>
                
                <div class="project-requirements">
                    <h5>Required Skills (Min Level: ${project.minLevel}):</h5>
                    <div>
                        ${requiredSkillsArray.map(skill => 
                            `<span class="skill-tag">${skill.trim()}</span>`
                        ).join('')}
                    </div>
                </div>

                <div class="team-members">
                    <h5>Team Members (${projectAssignments.length}):</h5>
                    ${projectAssignments.map(assignment => {
                        const member = users.find(u => u.id === assignment.userId);
                        return `
                            <div class="team-member">
                                <div class="team-member-info">
                                    <span class="team-member-name">${member.name}</span>
                                    <span class="team-member-dept">${member.department}</span>
                                </div>
                                ${['admin', 'manager'].includes(currentRole) ? `
                                    <button class="btn btn-sm btn-danger" 
                                            onclick="unassignMember(${project.id}, ${member.id})">
                                        Remove
                                    </button>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>

                ${['admin', 'manager'].includes(currentRole) ? `
                    <div class="btn-group mt-20">
                        <button class="btn btn-sm btn-success" 
                                onclick="showAssignTeam(${project.id})">
                            Assign Team
                        </button>
                        <button class="btn btn-sm btn-danger" 
                                onclick="deleteProject(${project.id})">
                            Delete Project
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function showAssignTeam(projectId) {
    const project = projects.find(p => p.id === projectId);
    const requiredSkills = project.requiredSkills.split(',').map(s => s.trim());
    const minLevel = project.minLevel;

    // Find matching employees
    const matches = users.filter(user => {
        if (user.role !== 'employee') return false;
        
        // Check if already assigned
        const isAssigned = assignments.some(
            a => a.projectId === projectId && a.userId === user.id
        );
        if (isAssigned) return false;

        // Check skill match
        const userSkillsList = employeeSkills.filter(es => es.userId === user.id);
        const matchCount = requiredSkills.filter(reqSkill => {
            const skill = skills.find(s => s.name === reqSkill);
            if (!skill) return false;
            const userSkill = userSkillsList.find(us => us.skillId === skill.id);
            return userSkill && userSkill.level >= minLevel;
        }).length;

        return matchCount > 0;
    });

    const content = document.getElementById('matchedEmployees');
    content.innerHTML = matches.length > 0 ? `
        <p style="margin-bottom: 15px; color: #666;">
            Found ${matches.length} matching employee(s) based on required skills.
        </p>
        ${matches.map(user => {
            const userSkillsList = employeeSkills.filter(es => es.userId === user.id);
            const matchCount = requiredSkills.filter(reqSkill => {
                const skill = skills.find(s => s.name === reqSkill);
                if (!skill) return false;
                const userSkill = userSkillsList.find(us => us.skillId === skill.id);
                return userSkill && userSkill.level >= minLevel;
            }).length;
            const matchPercentage = Math.round((matchCount / requiredSkills.length) * 100);

            const isAssigned = assignments.some(
                a => a.projectId === projectId && a.userId === user.id
            );

            return `
                <div class="employee-card ${isAssigned ? 'assigned' : ''}" 
                     onclick="assignMember(${projectId}, ${user.id})">
                    <div class="employee-info">
                        <h5>${user.name}</h5>
                        <p>${user.department}</p>
                        <p>Skills: ${userSkillsList.length} | Match: ${matchCount}/${requiredSkills.length}</p>
                    </div>
                    <div class="match-score">${matchPercentage}%</div>
                </div>
            `;
        }).join('')}
    ` : '<p class="text-center">No matching employees found for this project.</p>';

    openModal('assignTeamModal');
}

function assignMember(projectId, userId) {
    const existing = assignments.find(
        a => a.projectId === projectId && a.userId === userId
    );

    if (existing) {
        showAlert('projectsAlert', 'Employee is already assigned to this project!', 'error');
        return;
    }

    assignments.push({
        id: assignments.length + 1,
        projectId: projectId,
        userId: userId
    });

    showAlert('projectsAlert', 'Team member assigned successfully!', 'success');
    loadProjects();
    closeModal('assignTeamModal');
}

function unassignMember(projectId, userId) {
    const index = assignments.findIndex(
        a => a.projectId === projectId && a.userId === userId
    );

    if (index !== -1) {
        assignments.splice(index, 1);
        showAlert('projectsAlert', 'Team member removed successfully!', 'success');
        loadProjects();
    }
}

function deleteProject(projectId) {
    if (confirm('Are you sure you want to delete this project?')) {
        const index = projects.findIndex(p => p.id === projectId);
        if (index !== -1) {
            projects.splice(index, 1);
            // Remove all assignments for this project
            assignments = assignments.filter(a => a.projectId !== projectId);
            showAlert('projectsAlert', 'Project deleted successfully!', 'success');
            loadProjects();
        }
    }
}

// Profile Functions
function loadProfile() {
    const userSkillsList = employeeSkills.filter(es => es.userId === currentUser.id);

    const content = document.getElementById('profileContent');
    content.innerHTML = `
        <div class="profile-info">
            <div class="info-item">
                <label>Full Name</label>
                <div class="value">${currentUser.name}</div>
            </div>
            <div class="info-item">
                <label>Email</label>
                <div class="value">${currentUser.email}</div>
            </div>
            <div class="info-item">
                <label>Department</label>
                <div class="value">${currentUser.department}</div>
            </div>
            <div class="info-item">
                <label>Role</label>
                <div class="value">
                    <span class="badge badge-${currentUser.role}">${currentUser.role}</span>
                </div>
            </div>
            <div class="info-item">
                <label>Total Skills</label>
                <div class="value">${userSkillsList.length}</div>
            </div>
            <div class="info-item">
                <label>Projects Assigned</label>
                <div class="value">${assignments.filter(a => a.userId === currentUser.id).length}</div>
            </div>
        </div>

        <h4 style="margin: 30px 0 20px 0; color: #667eea;">My Skills</h4>
        <div class="skills-grid">
            ${userSkillsList.length > 0 ? userSkillsList.map(es => {
                const skill = skills.find(s => s.id === es.skillId);
                return `
                    <div class="skill-card">
                        <div class="skill-header">
                            <span class="skill-name">${skill.name}</span>
                            <span class="skill-category">${skill.category}</span>
                        </div>
                        <div class="skill-rating">
                            <div class="progress-bar-container">
                                <div class="progress-bar" style="width: ${es.level * 20}%">
                                    Level ${es.level}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('') : '<p class="text-center">No skills added yet. Go to Skills section to add your skills!</p>'}
        </div>
    `;
}

// Modal Functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function showAddSkillModal() {
    if (!['admin', 'manager'].includes(currentRole)) {
        showAlert('skillsAlert', 'Only admins and managers can add new skills!', 'error');
        return;
    }
    openModal('addSkillModal');
}

function showAddProjectModal() {
    if (!['admin', 'manager'].includes(currentRole)) {
        showAlert('projectsAlert', 'Only admins and managers can create projects!', 'error');
        return;
    }
    openModal('addProjectModal');
}

// Form Handlers
function handleAddSkill(e) {
    e.preventDefault();
    
    const name = document.getElementById('newSkillName').value.trim();
    const category = document.getElementById('newSkillCategory').value;

    if (skills.find(s => s.name.toLowerCase() === name.toLowerCase())) {
        showAlert('skillsAlert', 'Skill already exists!', 'error');
        return;
    }

    skills.push({
        id: skills.length + 1,
        name: name,
        category: category
    });

    showAlert('skillsAlert', 'Skill added successfully!', 'success');
    closeModal('addSkillModal');
    document.getElementById('addSkillForm').reset();
    loadSkills();
}

function handleAddProject(e) {
    e.preventDefault();
    
    const name = document.getElementById('newProjectName').value.trim();
    const description = document.getElementById('newProjectDesc').value.trim();
    const requiredSkills = document.getElementById('newProjectSkills').value.trim();
    const minLevel = parseInt(document.getElementById('newProjectMinLevel').value);

    projects.push({
        id: projects.length + 1,
        name: name,
        description: description,
        requiredSkills: requiredSkills,
        minLevel: minLevel,
        createdBy: currentUser.id
    });

    showAlert('projectsAlert', 'Project created successfully!', 'success');
    closeModal('addProjectModal');
    document.getElementById('addProjectForm').reset();
    loadProjects();
}

// Utility Functions
function showAlert(elementId, message, type) {
    const alertDiv = document.getElementById(elementId);
    alertDiv.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    
    setTimeout(() => {
        alertDiv.innerHTML = '';
    }, 3000);
}