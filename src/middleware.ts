import { defineMiddleware } from 'astro:middleware';

const READ_ONLY_BANNER = `
<style>
  body { padding-top: 44px !important; }
  .ks-readonly-banner {
    position: fixed; top: 0; left: 0; right: 0; z-index: 2147483647;
    background: #d97706; color: #000; padding: 10px 16px;
    font: 600 13px/1.4 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }
  .ks-readonly-banner a { color: #000; text-decoration: underline; margin-left: 8px; }
  /* Disabled state for buttons and inputs */
  .ks-disabled {
    opacity: 0.35 !important;
    pointer-events: none !important;
    cursor: not-allowed !important;
    user-select: none !important;
  }
</style>
<div class="ks-readonly-banner">
  READ-ONLY &#8212; You are viewing main. Editing is disabled.
  <a href="/admin">Go to Admin Dashboard</a>
</div>
<script>
(function() {
  function disableNode(el) {
    if (el.closest && el.closest('.ks-readonly-banner')) return;
    if (el.tagName === 'BUTTON') { el.disabled = true; el.classList.add('ks-disabled'); }
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
      el.disabled = true; el.readOnly = true; el.classList.add('ks-disabled');
    }
    if (el.getAttribute && el.getAttribute('contenteditable') === 'true') {
      el.setAttribute('contenteditable', 'false'); el.classList.add('ks-disabled');
    }
  }
  function disableTree(root) {
    root.querySelectorAll('button, input, textarea, select, [contenteditable="true"]').forEach(disableNode);
  }
  // Initial pass
  disableTree(document.body);
  // Only process added nodes, debounced via rAF
  var pending = false;
  var queue = [];
  new MutationObserver(function(mutations) {
    for (var i = 0; i < mutations.length; i++) {
      var added = mutations[i].addedNodes;
      for (var j = 0; j < added.length; j++) {
        if (added[j].nodeType === 1) queue.push(added[j]);
      }
    }
    if (!pending && queue.length) {
      pending = true;
      requestAnimationFrame(function() {
        for (var k = 0; k < queue.length; k++) {
          disableNode(queue[k]);
          if (queue[k].querySelectorAll) disableTree(queue[k]);
        }
        queue = [];
        pending = false;
      });
    }
  }).observe(document.body, { childList: true, subtree: true });
})();
</script>`;

const ADMIN_NAV_BUTTON = `
<style>
  .ks-admin-nav {
    position: fixed; bottom: 1.25rem; right: 1.25rem; z-index: 2147483640;
    display: flex; gap: 0.5rem; align-items: center;
  }
  .ks-admin-nav a {
    display: inline-flex; align-items: center; gap: 0.375rem;
    padding: 0.5rem 1rem; border-radius: 0.5rem;
    font: 500 13px/1.25 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    text-decoration: none; transition: all 0.15s;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  }
  .ks-admin-nav .ks-nav-admin {
    background: #3b82f6; color: #fff;
  }
  .ks-admin-nav .ks-nav-admin:hover { background: #2563eb; }
  .ks-admin-nav .ks-nav-admin svg { width: 14px; height: 14px; }
</style>
<div class="ks-admin-nav">
  <a href="/admin" class="ks-nav-admin">
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 6l6-4.5L14 6v7.5a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 012 13.5z"/><path d="M6 15V8h4v7"/></svg>
    Admin
  </a>
</div>`;

const PDF_IMPORT_INJECTION = `
<style>
  .ks-pdf-status {
    margin-top: 0.5rem; padding: 0.75rem; border-radius: 0.375rem;
    font: 400 13px/1.5 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    display: none;
  }
  .ks-pdf-status.loading { display: block; background: #eff6ff; color: #1d4ed8; }
  .ks-pdf-status.error { display: block; background: #fef2f2; color: #dc2626; }
  .ks-pdf-status.success { display: block; background: #f0fdf4; color: #15803d; }
  .ks-pdf-body-preview {
    width: 100%; min-height: 120px; margin-top: 0.5rem;
    font: 12px/1.5 'SF Mono', Monaco, monospace;
    border: 1px solid #d1d5db; border-radius: 0.375rem; padding: 0.5rem;
    resize: vertical; box-sizing: border-box;
  }
</style>
<script>
(function() {
  var nativeSet = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
  var nativeTextSet = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;

  // ── Helpers: set values on React-controlled inputs ──
  function setInput(el, val) {
    if (!el) return;
    var setter = el.tagName === 'TEXTAREA' ? nativeTextSet : nativeSet;
    setter.call(el, val);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // Find a Keystatic field group by its label text.
  // Returns the field group container element (walks up from the label).
  function findFieldGroup(labelText) {
    var els = document.querySelectorAll('label, span');
    for (var i = 0; i < els.length; i++) {
      var t = els[i].textContent.trim();
      if (t === labelText && els[i].children.length === 0) {
        // Walk up to the field group container
        var el = els[i];
        for (var j = 0; j < 8 && el.parentElement; j++) {
          el = el.parentElement;
          // Keystatic field groups use Flex with direction="column"
          var inputs = el.querySelectorAll('input, textarea');
          if (inputs.length > 0 && el.querySelectorAll('label, span[id]').length > 0) {
            return el;
          }
        }
      }
    }
    return null;
  }

  // ── Fill a text/textarea field by label ──
  function fillTextField(labelText, value) {
    if (!value) return;
    var group = findFieldGroup(labelText);
    if (!group) return;
    // For multiline fields, prefer textarea; else first text input
    var el = group.querySelector('textarea') || group.querySelector('input[type="text"], input:not([type])');
    if (el) setInput(el, value);
  }

  // ── Fill the slug field (Title) ──
  // Slug field has two text inputs: name (first) and slug (second).
  function fillSlugField(value) {
    if (!value) return;
    var group = findFieldGroup('Title');
    if (!group) return;
    var inputs = group.querySelectorAll('input[type="text"], input:not([type])');
    if (inputs.length >= 1) {
      setInput(inputs[0], value); // Set the name input
    }
  }

  // ── Fill a Keystatic Picker/Combobox (select) field ──
  // Keystatic renders selects as custom Picker components with a trigger button.
  // Strategy: click the trigger to open the listbox, then click the matching option.
  function fillPickerField(labelText, value) {
    if (!value) return;
    var group = findFieldGroup(labelText);
    if (!group) return;
    // The picker trigger is a button inside the field group
    var trigger = group.querySelector('button[type="button"]');
    if (!trigger) return;
    trigger.click();
    // Wait for the listbox popover to appear
    setTimeout(function() {
      var listbox = document.querySelector('[role="listbox"]');
      if (!listbox) return;
      var options = listbox.querySelectorAll('[role="option"]');
      for (var i = 0; i < options.length; i++) {
        if (options[i].textContent.trim() === value) {
          options[i].click();
          return;
        }
      }
      // Close if no match found — press Escape
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    }, 150);
  }

  // ── Intercept the file field's "Choose file" button ──
  function setup() {
    var group = findFieldGroup('Upload Job Description PDF');
    if (!group) return false;
    if (group.dataset.pdfHooked) return true; // Already set up
    group.dataset.pdfHooked = '1';

    // Add status element after the field group
    var status = document.createElement('div');
    status.className = 'ks-pdf-status';
    group.appendChild(status);

    // Find the "Choose file" button and intercept clicks
    var chooseBtn = group.querySelector('button');
    if (!chooseBtn) return true;

    // Create a hidden file input we control
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,application/pdf';
    fileInput.style.display = 'none';
    group.appendChild(fileInput);

    // Intercept the Choose file button click
    chooseBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      fileInput.click();
    }, true); // Use capture to fire before Keystatic's handler

    fileInput.addEventListener('change', function() {
      if (!fileInput.files.length) return;
      var file = fileInput.files[0];
      if (file.type !== 'application/pdf') {
        showStatus(status, 'error', 'Please select a PDF file.');
        fileInput.value = '';
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        showStatus(status, 'error', 'File exceeds 20 MB limit.');
        fileInput.value = '';
        return;
      }
      showStatus(status, 'loading', 'Extracting text from PDF — this takes 10-20 seconds...');

      var form = new FormData();
      form.append('file', file);
      fetch('/api/jobs/extract-pdf', { method: 'POST', body: form })
        .then(function(r) { return r.json(); })
        .then(function(data) {
          if (data.error) {
            showStatus(status, 'error', data.error);
            return;
          }

          // Fill all structured fields
          var f = data.fields || {};
          fillSlugField(f.title);
          // Fill pickers sequentially (each opens a popover)
          setTimeout(function() {
            fillPickerField('Department', f.department);
            setTimeout(function() {
              fillPickerField('Type', f.type);
              setTimeout(function() {
                fillTextField('Location', f.location);
                fillTextField('Summary (for card listing)', f.summary);

                // Copy markdown body to clipboard
                if (data.markdown) {
                  navigator.clipboard.writeText(data.markdown).then(function() {
                    showStatus(status, 'success',
                      'Fields filled from "' + file.name + '". Body markdown copied to clipboard \\u2014 paste (Ctrl+V) into the Full Description editor below.');
                  }).catch(function() {
                    showStatus(status, 'success',
                      'Fields filled from "' + file.name + '". Copy the body text below:');
                    var ta = document.createElement('textarea');
                    ta.className = 'ks-pdf-body-preview';
                    ta.value = data.markdown;
                    ta.readOnly = true;
                    status.after(ta);
                  });
                } else {
                  showStatus(status, 'success', 'Fields filled from "' + file.name + '".');
                }
              }, 200);
            }, 300);
          }, 200);
        })
        .catch(function(err) {
          showStatus(status, 'error', 'Upload failed: ' + err.message);
        });

      fileInput.value = '';
    });

    return true;
  }

  function showStatus(el, type, msg) {
    el.className = 'ks-pdf-status ' + type;
    el.textContent = msg;
  }

  // Wait for Keystatic to render the form, then set up
  var ready = false;
  function trySetup() { if (!ready && setup()) ready = true; }
  trySetup();
  var obs = new MutationObserver(trySetup);
  obs.observe(document.body, { childList: true, subtree: true });
  var cleanup = setInterval(function() {
    if (ready) { obs.disconnect(); clearInterval(cleanup); }
  }, 2000);
})();
</script>`;

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Inject GitHub token cookie for Keystatic routes
  if (pathname.startsWith('/keystatic') || pathname.startsWith('/api/keystatic')) {
    const runtime = (context.locals as any).runtime;
    const token = runtime?.env?.GITHUB_TOKEN;
    if (token && !context.cookies.get('keystatic-gh-access-token')?.value) {
      context.cookies.set('keystatic-gh-access-token', token, {
        path: '/',
        sameSite: 'lax',
        secure: import.meta.env.PROD,
        httpOnly: false,
        maxAge: 60 * 60 * 24,
      });
    }
  }

  // Redirect /keystatic or /keystatic/ to /admin
  if (pathname === '/keystatic' || pathname === '/keystatic/') {
    return context.redirect('/admin', 302);
  }

  // Block Keystatic API write operations from main branch view
  // (GitHub branch protection is the real enforcement — this is defense-in-depth)
  if (pathname.startsWith('/api/keystatic')) {
    const method = context.request.method.toUpperCase();
    if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
      const referer = context.request.headers.get('referer') || '';
      if (referer.includes('/keystatic/branch/main')) {
        return new Response(JSON.stringify({ error: 'Main branch is read-only' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
  }

  const response = await next();

  // Inject banners on Keystatic pages
  if (pathname.startsWith('/keystatic/branch/')) {
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('text/html')) {
      const html = await response.text();
      const isMain = pathname.startsWith('/keystatic/branch/main');
      let injection = isMain ? READ_ONLY_BANNER : ADMIN_NAV_BUTTON;
      // Add PDF import upload zone on job editor pages (non-main branches)
      if (!isMain && /\/keystatic\/branch\/[^/]+\/collection\/jobs\//.test(pathname)) {
        injection += PDF_IMPORT_INJECTION;
      }
      return new Response(html + injection, {
        status: response.status,
        headers: response.headers,
      });
    }
  }

  return response;
});
