import { defineMiddleware } from 'astro:middleware';

const BRANCH_GUARD_SCRIPT = `
<script>
(function() {
  var dismissed = false;

  function isOnMain() {
    return !window.location.pathname.includes('/branch/');
  }

  function getOrCreate(id) {
    var el = document.getElementById(id);
    if (!el) {
      el = document.createElement('div');
      el.id = id;
      document.body.appendChild(el);
    }
    return el;
  }

  function check() {
    var onMain = isOnMain();
    var existing = document.getElementById('ks-branch-guard');

    if (!onMain) {
      dismissed = false;
      if (existing) existing.remove();
      return;
    }

    if (dismissed) {
      // Show just a slim banner when dismissed
      var g = getOrCreate('ks-branch-guard');
      g.innerHTML =
        '<div style="position:fixed;top:0;left:0;right:0;z-index:2147483647;background:#d97706;color:#000;padding:8px 16px;font:13px/1.4 -apple-system,BlinkMacSystemFont,sans-serif;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);">' +
          '<strong>Read-only</strong> — You are on the main branch. Create a new branch to edit.' +
        '</div>' +
        '<style>#ks-branch-guard~*{padding-top:36px!important;}</style>';
      return;
    }

    // Full blocking overlay
    var g = getOrCreate('ks-branch-guard');
    g.innerHTML =
      '<div style="position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,sans-serif;">' +
        '<div style="background:#171717;border:1px solid #404040;border-radius:12px;padding:40px;max-width:440px;text-align:center;">' +
          '<div style="width:48px;height:48px;margin:0 auto 16px;border-radius:50%;background:#d97706;display:flex;align-items:center;justify-content:center;">' +
            '<svg width="24" height="24" fill="none" stroke="#000" stroke-width="2" viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01M6 3h12l4 6-10 13L2 9l4-6z"/></svg>' +
          '</div>' +
          '<h2 style="font-size:20px;font-weight:600;color:#f5f5f5;margin:0 0 8px;">Create a branch to edit</h2>' +
          '<p style="color:#a3a3a3;margin:0 0 24px;line-height:1.6;font-size:14px;">Editing on <strong style="color:#d97706;">main</strong> is disabled. Use the branch picker at the top-left of the Keystatic UI to create a new branch, then make your changes.</p>' +
          '<div style="display:flex;gap:12px;justify-content:center;">' +
            '<button id="ks-dismiss-btn" style="background:#262626;color:#a3a3a3;border:1px solid #404040;padding:10px 20px;border-radius:6px;cursor:pointer;font-size:14px;">Browse Read-Only</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.getElementById('ks-dismiss-btn').onclick = function() { dismissed = true; check(); };
  }

  // Run immediately and poll for SPA navigation changes
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', check);
  } else {
    check();
  }
  setInterval(check, 800);

  // Also watch for pushState/replaceState navigation
  var origPush = history.pushState;
  var origReplace = history.replaceState;
  history.pushState = function() { origPush.apply(this, arguments); setTimeout(check, 50); };
  history.replaceState = function() { origReplace.apply(this, arguments); setTimeout(check, 50); };
  window.addEventListener('popstate', function() { setTimeout(check, 50); });
})();
</script>`;

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Auto-inject GitHub token for Keystatic routes so editors
  // only need Google login (via Cloudflare Access) — no GitHub account required.
  if (pathname.startsWith('/keystatic') || pathname.startsWith('/api/keystatic')) {
    const runtime = (context.locals as any).runtime;
    const token = runtime?.env?.GITHUB_TOKEN;
    if (token && !context.cookies.get('keystatic-gh-access-token')?.value) {
      context.cookies.set('keystatic-gh-access-token', token, {
        path: '/',
        sameSite: 'lax',
        secure: import.meta.env.PROD,
        httpOnly: false,
        maxAge: 60 * 60 * 24, // 24 hours — matches CF Access session
      });
    }
  }

  const response = await next();

  // Inject branch guard script into Keystatic HTML pages
  if (pathname.startsWith('/keystatic')) {
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('text/html')) {
      const html = await response.text();
      const modified = html.includes('</head>')
        ? html.replace('</head>', BRANCH_GUARD_SCRIPT + '</head>')
        : html.replace('</body>', BRANCH_GUARD_SCRIPT + '</body>');
      return new Response(modified, {
        status: response.status,
        headers: response.headers,
      });
    }
  }

  return response;
});
