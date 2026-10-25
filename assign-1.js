(function () {
  'use strict';

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Mobile menu toggle
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('navLinks');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Highlight the sidebar link for the section in view
  var links = document.querySelectorAll('.nav a');
  var sections = document.querySelectorAll('main section[id]');
  if ('IntersectionObserver' in window && links.length > 0 && sections.length > 0) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (a) {
            a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { observer.observe(s); });
  }

  // Project filter logic
  var chips = document.querySelectorAll('.chip:not(.chip-admin)');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var filter = chip.getAttribute('data-filter');
      chips.forEach(function (c) {
        var active = c === chip;
        c.classList.toggle('is-active', active);
        c.setAttribute('aria-pressed', String(active));
      });
      var projects = document.querySelectorAll('.project');
      projects.forEach(function (p) {
        var types = (p.getAttribute('data-type') || 'web').split(' ');
        p.hidden = !(filter === 'all' || types.indexOf(filter) !== -1);
      });
    });
  });

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

  // Dynamic enhancement: Fetch live projects from public Django REST API if running
  fetch('http://127.0.0.1:8000/api/projects/public/')
    .then(function (res) {
      if (res.ok) return res.json();
      throw new Error('API offline');
    })
    .then(function (apiProjects) {
      if (!apiProjects || apiProjects.length === 0) return;
      var container = document.getElementById('projectsContainer');
      if (!container) return;

      // Extract existing titles to avoid duplicate rendering
      var existingTitles = Array.from(container.querySelectorAll('h3')).map(function (h) {
        return h.textContent.trim().toLowerCase();
      });

      apiProjects.forEach(function (proj) {
        if (existingTitles.includes(proj.title.trim().toLowerCase())) return;

        var article = document.createElement('article');
        var techLower = (proj.technologies || '').toLowerCase();
        var type = 'web';
        if (techLower.includes('esp32') || techLower.includes('arduino') || techLower.includes('iot') || techLower.includes('sensor')) {
          type = 'iot';
        }
        article.className = 'project';
        article.setAttribute('data-type', type);
        article.innerHTML =
          '<h3>' + escapeHtml(proj.title) + '</h3>' +
          '<p>' + escapeHtml(proj.description) + '</p>' +
          '<p class="tech">' + escapeHtml(proj.technologies) + '</p>' +
          '<div style="margin-top: 0.5rem; font-size: 0.9rem; display: flex; gap: 0.8rem;">' +
          (proj.github_url ? '<a href="' + escapeHtml(proj.github_url) + '" target="_blank" rel="noopener">GitHub ↗</a>' : '') +
          (proj.live_demo_url ? '<a href="' + escapeHtml(proj.live_demo_url) + '" target="_blank" rel="noopener">Live Demo ↗</a>' : '') +
          '</div>';
        container.appendChild(article);
      });
    })
    .catch(function () {
      // Graceful offline fallback: static projects remain fully functional
    });
})();