// YapRoll — yaproll.app
// The theme switch, and closing an open menu. Without this file every page
// still reads, links and follows the system's light or dark, and its menus
// still open and close. With it, the button in the header flips the page
// and remembers the choice in this browser only (yr.theme in localStorage,
// never sent anywhere), and an open menu closes on a tap anywhere else or
// on Escape.
//
// The script never shows or hides the button's icons: the stylesheet does,
// from data-theme and the system's preference. The first version hid them
// by setting `hidden` on the SVGs, which SVG elements do not have, so both
// icons always showed.
(function () {
  'use strict';

  var KEY = 'yr.theme';
  var root = document.documentElement;

  function stored() {
    try {
      var value = localStorage.getItem(KEY);
      return value === 'light' || value === 'dark' ? value : null;
    } catch (e) {
      return null;
    }
  }

  function remember(value) {
    try {
      if (value) localStorage.setItem(KEY, value); else localStorage.removeItem(KEY);
    } catch (e) { /* storage blocked: the switch still works for this page */ }
  }

  function systemDark() {
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }

  function current() {
    return root.getAttribute('data-theme') || (systemDark() ? 'dark' : 'light');
  }

  // The button names what a tap will do, in the page's own language.
  function label(button) {
    var text = current() === 'dark' ? button.getAttribute('data-to-light')
                                    : button.getAttribute('data-to-dark');
    button.setAttribute('aria-label', text);
    button.setAttribute('title', text);
  }

  function apply(value) {
    if (value) root.setAttribute('data-theme', value); else root.removeAttribute('data-theme');
    var button = document.querySelector('.theme-toggle');
    if (button) label(button);
  }

  // Runs from <head>, before the first paint, so a remembered choice never
  // flashes the other theme.
  apply(stored());

  document.addEventListener('DOMContentLoaded', function () {
    var button = document.querySelector('.theme-toggle');
    if (!button) return;
    button.hidden = false;
    label(button);
    button.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      // Choosing what the system already shows means "follow the system".
      var follows = (next === 'dark') === systemDark();
      remember(follows ? null : next);
      apply(follows ? null : next);
    });
  });

  if (window.matchMedia) {
    var query = window.matchMedia('(prefers-color-scheme: dark)');
    var follow = function () { if (!stored()) apply(null); };
    if (query.addEventListener) query.addEventListener('change', follow);
    else if (query.addListener) query.addListener(follow);
  }

  // The language menus and the legal pages' phone menus are <details>,
  // which stay open until their own summary is tapped again.
  var MENUS = 'details.lang-menu[open], details.doc-menu[open]';

  document.addEventListener('click', function (event) {
    var open = document.querySelectorAll(MENUS);
    for (var i = 0; i < open.length; i++) {
      if (!open[i].contains(event.target)) open[i].removeAttribute('open');
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    var open = document.querySelectorAll(MENUS);
    for (var i = 0; i < open.length; i++) {
      var inside = open[i].contains(document.activeElement);
      open[i].removeAttribute('open');
      if (inside) open[i].querySelector('summary').focus();
    }
  });
})();
