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

const PDF_IMPORT_BUTTON = `
<style>
  .ks-pdf-import-btn {
    position: fixed; bottom: 4rem; right: 1.25rem; z-index: 2147483640;
    display: inline-flex; align-items: center; gap: 0.375rem;
    padding: 0.5rem 1rem; border-radius: 0.5rem; border: none; cursor: pointer;
    font: 500 13px/1.25 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #8b5cf6; color: #fff; transition: all 0.15s;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  }
  .ks-pdf-import-btn:hover { background: #7c3aed; }
  .ks-pdf-import-btn svg { width: 14px; height: 14px; }
  .ks-pdf-modal-overlay {
    display: none; position: fixed; inset: 0; z-index: 2147483646;
    background: rgba(0,0,0,0.5); align-items: center; justify-content: center;
  }
  .ks-pdf-modal-overlay.active { display: flex; }
  .ks-pdf-modal {
    background: #fff; border-radius: 0.75rem; padding: 1.5rem; width: 90%; max-width: 640px;
    max-height: 80vh; display: flex; flex-direction: column; gap: 1rem;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    font: 400 14px/1.5 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  .ks-pdf-modal h3 { margin: 0; font-size: 16px; font-weight: 600; }
  .ks-pdf-modal-body { overflow-y: auto; flex: 1; }
  .ks-pdf-drop-zone {
    border: 2px dashed #d1d5db; border-radius: 0.5rem; padding: 2rem;
    text-align: center; cursor: pointer; transition: border-color 0.15s;
  }
  .ks-pdf-drop-zone:hover, .ks-pdf-drop-zone.dragover { border-color: #8b5cf6; }
  .ks-pdf-drop-zone input { display: none; }
  .ks-pdf-progress { display: none; text-align: center; padding: 1.5rem; color: #6b7280; }
  .ks-pdf-progress.active { display: block; }
  .ks-pdf-result { display: none; }
  .ks-pdf-result.active { display: block; }
  .ks-pdf-result textarea {
    width: 100%; min-height: 200px; border: 1px solid #d1d5db; border-radius: 0.375rem;
    padding: 0.75rem; font: 13px/1.5 'SF Mono', Monaco, monospace; resize: vertical;
    box-sizing: border-box;
  }
  .ks-pdf-actions { display: flex; gap: 0.5rem; justify-content: flex-end; }
  .ks-pdf-actions button {
    padding: 0.5rem 1rem; border-radius: 0.375rem; border: 1px solid #d1d5db;
    font: 500 13px/1.25 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    cursor: pointer; transition: all 0.15s;
  }
  .ks-pdf-actions .ks-pdf-copy {
    background: #8b5cf6; color: #fff; border-color: #8b5cf6;
  }
  .ks-pdf-actions .ks-pdf-copy:hover { background: #7c3aed; }
  .ks-pdf-actions .ks-pdf-close { background: #fff; }
  .ks-pdf-actions .ks-pdf-close:hover { background: #f3f4f6; }
  .ks-pdf-error { color: #dc2626; padding: 0.75rem; display: none; }
  .ks-pdf-error.active { display: block; }
</style>
<button class="ks-pdf-import-btn" id="ks-pdf-import-btn">
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 10v3a1 1 0 01-1 1H3a1 1 0 01-1-1v-3"/><path d="M4 7l4 4 4-4"/><path d="M8 11V2"/></svg>
  Import from PDF
</button>
<div class="ks-pdf-modal-overlay" id="ks-pdf-modal-overlay">
  <div class="ks-pdf-modal">
    <h3>Import Job Description from PDF</h3>
    <div class="ks-pdf-modal-body">
      <div class="ks-pdf-drop-zone" id="ks-pdf-drop-zone">
        <input type="file" accept=".pdf,application/pdf" id="ks-pdf-file-input" />
        <p><strong>Click to select</strong> or drag &amp; drop a PDF file</p>
        <p style="font-size:12px;color:#9ca3af;">Max 20 MB</p>
      </div>
      <div class="ks-pdf-progress" id="ks-pdf-progress">
        <p>Uploading and extracting text...</p>
      </div>
      <div class="ks-pdf-error" id="ks-pdf-error"></div>
      <div class="ks-pdf-result" id="ks-pdf-result">
        <p style="font-size:12px;color:#6b7280;margin:0 0 0.5rem;">Extracted markdown — review and copy to the body field:</p>
        <textarea id="ks-pdf-markdown" readonly></textarea>
      </div>
    </div>
    <div class="ks-pdf-actions">
      <button class="ks-pdf-close" id="ks-pdf-close">Close</button>
      <button class="ks-pdf-copy" id="ks-pdf-copy" style="display:none;">Copy to Clipboard</button>
    </div>
  </div>
</div>
<script>
(function() {
  var btn = document.getElementById('ks-pdf-import-btn');
  var overlay = document.getElementById('ks-pdf-modal-overlay');
  var dropZone = document.getElementById('ks-pdf-drop-zone');
  var fileInput = document.getElementById('ks-pdf-file-input');
  var progress = document.getElementById('ks-pdf-progress');
  var errorEl = document.getElementById('ks-pdf-error');
  var result = document.getElementById('ks-pdf-result');
  var textarea = document.getElementById('ks-pdf-markdown');
  var copyBtn = document.getElementById('ks-pdf-copy');
  var closeBtn = document.getElementById('ks-pdf-close');

  function reset() {
    dropZone.style.display = '';
    progress.classList.remove('active');
    errorEl.classList.remove('active');
    result.classList.remove('active');
    copyBtn.style.display = 'none';
    textarea.value = '';
    fileInput.value = '';
  }

  btn.addEventListener('click', function() {
    reset();
    overlay.classList.add('active');
  });

  closeBtn.addEventListener('click', function() {
    overlay.classList.remove('active');
  });

  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) overlay.classList.remove('active');
  });

  dropZone.addEventListener('click', function() { fileInput.click(); });
  dropZone.addEventListener('dragover', function(e) {
    e.preventDefault(); dropZone.classList.add('dragover');
  });
  dropZone.addEventListener('dragleave', function() {
    dropZone.classList.remove('dragover');
  });
  dropZone.addEventListener('drop', function(e) {
    e.preventDefault(); dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
  });

  fileInput.addEventListener('change', function() {
    if (fileInput.files.length) handleFile(fileInput.files[0]);
  });

  function handleFile(file) {
    if (file.type !== 'application/pdf') {
      showError('Please select a PDF file.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      showError('File exceeds 20 MB limit.');
      return;
    }
    dropZone.style.display = 'none';
    errorEl.classList.remove('active');
    progress.classList.add('active');

    var form = new FormData();
    form.append('file', file);
    fetch('/api/jobs/extract-pdf', { method: 'POST', body: form })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        progress.classList.remove('active');
        if (data.error) {
          showError(data.error);
          dropZone.style.display = '';
          return;
        }
        textarea.value = data.markdown;
        result.classList.add('active');
        copyBtn.style.display = '';
        // Auto-fill pdfUrl field if present
        if (data.pdfKey) {
          var pdfInput = document.querySelector('input[name="pdfUrl"]');
          if (pdfInput) {
            var nativeSet = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
            nativeSet.call(pdfInput, data.pdfKey);
            pdfInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }
      })
      .catch(function(err) {
        progress.classList.remove('active');
        showError('Upload failed: ' + err.message);
        dropZone.style.display = '';
      });
  }

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.classList.add('active');
  }

  copyBtn.addEventListener('click', function() {
    navigator.clipboard.writeText(textarea.value).then(function() {
      copyBtn.textContent = 'Copied!';
      setTimeout(function() { copyBtn.textContent = 'Copy to Clipboard'; }, 2000);
    });
  });
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
      // Add PDF import button on job editor pages (non-main branches)
      if (!isMain && /\/keystatic\/branch\/[^/]+\/collection\/jobs\//.test(pathname)) {
        injection += PDF_IMPORT_BUTTON;
      }
      return new Response(html + injection, {
        status: response.status,
        headers: response.headers,
      });
    }
  }

  return response;
});
