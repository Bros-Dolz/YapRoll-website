// YapRoll — yaproll.app
// Progressive enhancement only. Without this file the pages still read,
// link and follow the system theme; this adds a theme toggle that remembers
// its choice and fills in the footer year.
(function () {
  'use strict';

  var KEY = 'yr.theme';
  var root = document.documentElement;

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function remember(value) {
    try {
      if (value) localStorage.setItem(KEY, value); else localStorage.removeItem(KEY);
    } catch (e) { /* private mode, blocked storage: the toggle still works for this page */ }
  }
  function systemDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function current() {
    return root.getAttribute('data-theme') || (systemDark() ? 'dark' : 'light');
  }
  function apply(value) {
    if (value) root.setAttribute('data-theme', value); else root.removeAttribute('data-theme');
    var button = document.querySelector('.theme-toggle');
    if (!button) return;
    var dark = current() === 'dark';
    button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    button.querySelector('.icon-sun').hidden = !dark;
    button.querySelector('.icon-moon').hidden = dark;
  }

  // Runs from <head>, before first paint, so a remembered choice never
  // flashes the other theme.
  apply(stored());

  document.addEventListener('DOMContentLoaded', function () {
    var button = document.querySelector('.theme-toggle');
    if (button) {
      button.hidden = false;
      apply(stored());
      button.addEventListener('click', function () {
        var next = current() === 'dark' ? 'light' : 'dark';
        // Choosing what the system already says means "follow the system".
        var follows = (next === 'dark') === systemDark();
        remember(follows ? null : next);
        apply(follows ? null : next);
      });
    }
    var year = document.querySelector('[data-year]');
    if (year) year.textContent = String(new Date().getFullYear());
  });

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      if (!stored()) apply(null);
    });
  }
})();
