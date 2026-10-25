/**
 * Portfolio Project Management Portal (Assignment 2)
 * Handles Token-based Authentication & Full CRUD REST API Operations
 */

(function () {
  'use strict';

  // Base API configuration (adjust if backend is on a different port)
  const API_BASE = 'http://127.0.0.1:8000/api';

  // DOM Elements
  const authSection = document.getElementById('authSection');
  const dashboardSection = document.getElementById('dashboardSection');
  const tabLogin = document.getElementById('tabLogin');
  const tabRegister = document.getElementById('tabRegister');
  const loginFormWrap = document.getElementById('loginFormWrap');
  const registerFormWrap = document.getElementById('registerFormWrap');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const createProjectForm = document.getElementById('createProjectForm');
  const editProjectForm = document.getElementById('editProjectForm');
  const editModal = document.getElementById('editModal');
  const closeEditModalBtn = document.getElementById('closeEditModal');
  const cancelEditBtn = document.getElementById('cancelEditBtn');
  const projectsList = document.getElementById('projectsList');
  const authAlert = document.getElementById('authAlert');
  const dashboardAlert = document.getElementById('dashboardAlert');
  const userInfoSpan = document.getElementById('userInfoSpan');
  const logoutBtn = document.getElementById('logoutBtn');

  // Local state
  let currentToken = localStorage.getItem('auth_token');
  let loadedProjects = [];

  // ==========================================
  // Helper Functions
  // ==========================================

  function showAlert(alertEl, message, type = 'error') {
    if (!alertEl) return;
    alertEl.hidden = false;
    alertEl.className = `alert alert-${type}`;
    alertEl.textContent = message;
    alertEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideAlert(alertEl) {
    if (!alertEl) return;
    alertEl.hidden = true;
    alertEl.textContent = '';
  }

  function setButtonLoading(btn, isLoading, defaultText) {
    if (!btn) return;
    btn.disabled = isLoading;
    if (isLoading) {
      btn.innerHTML = `<span class="spinner"></span> Processing...`;
    } else {
      btn.innerHTML = defaultText;
    }
  }

  function parseErrorResponse(data) {
    if (!data) return 'An unexpected error occurred.';
    if (typeof data === 'string') return data;
    if (data.error) return data.error;
    if (data.detail) return data.detail;

    // Collect field errors from DRF
    const messages = [];
    for (const [key, val] of Object.entries(data)) {
      if (Array.isArray(val)) {
        messages.push(`${key}: ${val.join(' ')}`);
      } else if (typeof val === 'string') {
        messages.push(`${key}: ${val}`);
      }
    }
    return messages.length > 0 ? messages.join(' | ') : JSON.stringify(data);
  }

  // ==========================================
  // Auth View Toggling & State Management
  // ==========================================

  function switchTab(tab) {
    hideAlert(authAlert);
    if (tab === 'login') {
      tabLogin.classList.add('is-active');
      tabRegister.classList.remove('is-active');
      loginFormWrap.hidden = false;
      registerFormWrap.hidden = true;
    } else {
      tabRegister.classList.add('is-active');
      tabLogin.classList.remove('is-active');
      registerFormWrap.hidden = false;
      loginFormWrap.hidden = true;
    }
  }

  function showDashboard(user) {
    authSection.hidden = true;
    dashboardSection.hidden = false;
    userInfoSpan.innerHTML = `Welcome, <strong>${escapeHtml(user.username)}</strong> (${escapeHtml(user.email || 'No email')})`;
    fetchUserProjects();
  }

  function showAuth() {
    authSection.hidden = false;
    dashboardSection.hidden = true;
    currentToken = null;
    localStorage.removeItem('auth_token');
  }

  // ==========================================
  // API Requests
  // ==========================================

  async function checkAuthStatus() {
    if (!currentToken) {
      showAuth();
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/me/`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${currentToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        const user = await res.json();
        showDashboard(user);
      } else {
        // Token invalid or expired
        showAuth();
      }
    } catch (err) {
      console.warn('Backend server may not be running:', err);
      showAuth();
      showAlert(authAlert, 'Cannot connect to backend API server at ' + API_BASE + '. Please ensure the Django development server is running.', 'error');
    }
  }

  // Registration
  registerForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    hideAlert(authAlert);

    const submitBtn = registerForm.querySelector('button[type="submit"]');
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;

    // Frontend validation
    if (!username || !email || !password) {
      showAlert(authAlert, 'Please fill in all registration fields.');
      return;
    }
    if (password.length < 8) {
      showAlert(authAlert, 'Password must be at least 8 characters long.');
      return;
    }

    setButtonLoading(submitBtn, true, 'Register Account');

    try {
      const res = await fetch(`${API_BASE}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const data = await res.json();

      if (res.status === 201) {
        // Auto-login with returned token
        currentToken = data.token;
        localStorage.setItem('auth_token', currentToken);
        registerForm.reset();
        showAlert(authAlert, 'Registration successful! Redirecting to dashboard...', 'success');
        setTimeout(() => {
          hideAlert(authAlert);
          showDashboard(data.user);
        }, 800);
      } else {
        showAlert(authAlert, parseErrorResponse(data));
      }
    } catch (err) {
      showAlert(authAlert, 'Network error: could not connect to server.');
    } finally {
      setButtonLoading(submitBtn, false, 'Register Account');
    }
  });

  // Login
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    hideAlert(authAlert);

    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
      showAlert(authAlert, 'Please provide both username and password.');
      return;
    }

    setButtonLoading(submitBtn, true, 'Sign In');

    try {
      const res = await fetch(`${API_BASE}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.status === 200) {
        currentToken = data.token;
        localStorage.setItem('auth_token', currentToken);
        loginForm.reset();
        showDashboard(data.user);
      } else {
        showAlert(authAlert, parseErrorResponse(data));
      }
    } catch (err) {
      showAlert(authAlert, 'Network error: could not reach ' + API_BASE);
    } finally {
      setButtonLoading(submitBtn, false, 'Sign In');
    }
  });

  // Logout
  logoutBtn.addEventListener('click', async function () {
    if (currentToken) {
      try {
        await fetch(`${API_BASE}/auth/logout/`, {
          method: 'POST',
          headers: {
            'Authorization': `Token ${currentToken}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (e) {
        // Silently clear local session
      }
    }
    showAuth();
    showAlert(authAlert, 'You have been logged out successfully.', 'info');
  });

  // Tab switching events
  tabLogin.addEventListener('click', () => switchTab('login'));
  tabRegister.addEventListener('click', () => switchTab('register'));

  // ==========================================
  // Project CRUD Operations
  // ==========================================

  async function fetchUserProjects() {
    projectsList.innerHTML = `<div class="empty-state"><span class="spinner spinner-dark"></span><p>Loading projects...</p></div>`;

    try {
      const res = await fetch(`${API_BASE}/projects/`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${currentToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.status === 401) {
        showAuth();
        showAlert(authAlert, 'Session expired. Please log in again.');
        return;
      }

      if (res.ok) {
        loadedProjects = await res.json();
        renderProjectsList(loadedProjects);
      } else {
        showAlert(dashboardAlert, 'Failed to fetch projects.');
      }
    } catch (err) {
      projectsList.innerHTML = `<div class="empty-state"><p>Error connecting to backend API server.</p></div>`;
    }
  }

  function renderProjectsList(projects) {
    if (!projects || projects.length === 0) {
      projectsList.innerHTML = `
        <div class="empty-state">
          <p>No projects found in your account.</p>
          <p>Use the <strong>"Create New Portfolio Project"</strong> form above to add your first project.</p>
        </div>`;
      return;
    }

    projectsList.innerHTML = projects.map(proj => `
      <div class="project-item" data-id="${proj.id}">
        <div class="project-item-header">
          <div>
            <h3>${escapeHtml(proj.title)}</h3>
            <span class="badge badge-blue">${escapeHtml(proj.technologies)}</span>
          </div>
          <div class="project-actions">
            <button class="btn btn-sm btn-outline edit-btn" data-id="${proj.id}">Edit</button>
            <button class="btn btn-sm btn-danger delete-btn" data-id="${proj.id}">Delete</button>
          </div>
        </div>
        <p>${escapeHtml(proj.description)}</p>
        <div style="font-size: 0.9rem; display: flex; gap: 1rem; flex-wrap: wrap;">
          ${proj.github_url ? `<a href="${escapeHtml(proj.github_url)}" target="_blank" rel="noopener">GitHub Repo ↗</a>` : ''}
          ${proj.live_demo_url ? `<a href="${escapeHtml(proj.live_demo_url)}" target="_blank" rel="noopener">Live Demo ↗</a>` : ''}
          <span style="color: var(--muted); margin-left: auto;">Added: ${new Date(proj.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    `).join('');

    // Attach edit and delete event listeners
    projectsList.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => openEditModal(btn.dataset.id));
    });
    projectsList.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteProject(btn.dataset.id));
    });
  }

  // Create Project (POST /api/projects/)
  createProjectForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    hideAlert(dashboardAlert);

    const submitBtn = createProjectForm.querySelector('button[type="submit"]');
    const title = document.getElementById('projectTitle').value.trim();
    const technologies = document.getElementById('projectTechnologies').value.trim();
    const description = document.getElementById('projectDescription').value.trim();
    const github_url = document.getElementById('projectGithub').value.trim();
    const live_demo_url = document.getElementById('projectDemo').value.trim();

    // Frontend validation
    if (!title || !technologies || !description) {
      showAlert(dashboardAlert, 'Title, technologies, and description are required.');
      return;
    }

    setButtonLoading(submitBtn, true, 'Publish Project');

    const payload = {
      title,
      technologies,
      description,
      github_url: github_url || '',
      live_demo_url: live_demo_url || ''
    };

    try {
      const res = await fetch(`${API_BASE}/projects/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${currentToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.status === 201) {
        showAlert(dashboardAlert, `Project "${data.title}" successfully created!`, 'success');
        createProjectForm.reset();
        fetchUserProjects();
      } else {
        showAlert(dashboardAlert, parseErrorResponse(data));
      }
    } catch (err) {
      showAlert(dashboardAlert, 'Network error while creating project.');
    } finally {
      setButtonLoading(submitBtn, false, 'Publish Project');
    }
  });

  // Open Edit Modal
  function openEditModal(projectId) {
    const proj = loadedProjects.find(p => String(p.id) === String(projectId));
    if (!proj) return;

    document.getElementById('editProjectId').value = proj.id;
    document.getElementById('editProjectTitle').value = proj.title;
    document.getElementById('editProjectTechnologies').value = proj.technologies;
    document.getElementById('editProjectDescription').value = proj.description;
    document.getElementById('editProjectGithub').value = proj.github_url || '';
    document.getElementById('editProjectDemo').value = proj.live_demo_url || '';

    editModal.hidden = false;
  }

  function closeEditModal() {
    editModal.hidden = true;
    editProjectForm.reset();
  }

  closeEditModalBtn.addEventListener('click', closeEditModal);
  cancelEditBtn.addEventListener('click', closeEditModal);

  // Update Project (PUT / PATCH /api/projects/<id>/)
  editProjectForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    hideAlert(dashboardAlert);

    const submitBtn = editProjectForm.querySelector('button[type="submit"]');
    const id = document.getElementById('editProjectId').value;
    const title = document.getElementById('editProjectTitle').value.trim();
    const technologies = document.getElementById('editProjectTechnologies').value.trim();
    const description = document.getElementById('editProjectDescription').value.trim();
    const github_url = document.getElementById('editProjectGithub').value.trim();
    const live_demo_url = document.getElementById('editProjectDemo').value.trim();

    if (!title || !technologies || !description) {
      alert('Please fill out all required fields.');
      return;
    }

    setButtonLoading(submitBtn, true, 'Save Changes');

    const payload = {
      title,
      technologies,
      description,
      github_url: github_url || '',
      live_demo_url: live_demo_url || ''
    };

    try {
      const res = await fetch(`${API_BASE}/projects/${id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Token ${currentToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.status === 200) {
        closeEditModal();
        showAlert(dashboardAlert, `Project "${data.title}" successfully updated!`, 'success');
        fetchUserProjects();
      } else {
        alert(parseErrorResponse(data));
      }
    } catch (err) {
      alert('Network error while updating project.');
    } finally {
      setButtonLoading(submitBtn, false, 'Save Changes');
    }
  });

  // Delete Project (DELETE /api/projects/<id>/)
  async function deleteProject(projectId) {
    const proj = loadedProjects.find(p => String(p.id) === String(projectId));
    const title = proj ? proj.title : 'this project';

    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/projects/${projectId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${currentToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.status === 204) {
        showAlert(dashboardAlert, `Project deleted successfully.`, 'success');
        fetchUserProjects();
      } else {
        const data = await res.json().catch(() => null);
        showAlert(dashboardAlert, parseErrorResponse(data));
      }
    } catch (err) {
      showAlert(dashboardAlert, 'Network error while deleting project.');
    }
  }

  // Utility to prevent XSS
  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Initialize
  checkAuthStatus();
})();
