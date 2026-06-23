/**
 * COGNIVEX — Corporate Enterprise Website
 * Vanilla JavaScript — subtle interactions only
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initBackToTop();
  initRevealAnimations();
  initCounters();
  initTestimonialsSlider();
  initPortfolioFilter();
  initContactForm();
  setActiveNavLink();
});

function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }
}

function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initRevealAnimations() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  els.forEach(el => observer.observe(el));
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = prefix + Math.floor(eased * target).toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = prefix + target.toLocaleString() + suffix;
  }
  requestAnimationFrame(update);
}

function initTestimonialsSlider() {
  const track = document.querySelector('.testimonials-track');
  const dots = document.querySelectorAll('.testimonial-dot');
  if (!track) return;

  const slides = track.querySelectorAll('.testimonial-slide');
  let current = 0;
  let interval;

  function goTo(index) {
    current = index;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() { goTo((current + 1) % slides.length); }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); resetInterval(); });
  });

  function resetInterval() {
    clearInterval(interval);
    interval = setInterval(next, 6000);
  }
  resetInterval();
}

function initPortfolioFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.portfolio-item');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      items.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('hidden-item', !show);
      });
    });
  });
}

function initContactForm() {
  const form = document.querySelector('.contact-form-wrap');
  if (!form) return;

  const formEl = form.querySelector('form');
  if (!formEl) return;

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const body = form.querySelector('.form-body');
    const success = form.querySelector('.form-success');
    if (body && success) {
      body.style.display = 'none';
      success.classList.add('show');
    }
  });
}
