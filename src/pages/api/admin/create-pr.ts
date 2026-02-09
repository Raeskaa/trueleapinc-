import type { APIRoute } from 'astro';

export const prerender = false;

const REPO = 'Trueleap/trueleap-inc';

export const POST: APIRoute = async ({ request, locals }) => {
  const runtime = (locals as any).runtime;
  const GITHUB_TOKEN = runtime?.env?.GITHUB_TOKEN;
  if (!GITHUB_TOKEN) {
    return new Response(JSON.stringify({ error: 'GITHUB_TOKEN not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: { branch?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const branch = body.branch?.trim();
  if (!branch || !branch.startsWith('content/')) {
    return new Response(JSON.stringify({ error: 'Must be a content/ branch' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'TrueLeap-Admin',
  };

  // Check no open PR already exists for this branch
  const existingRes = await fetch(
    `https://api.github.com/repos/${REPO}/pulls?state=open&head=Trueleap:${branch}`,
    { headers },
  );
  if (existingRes.ok) {
    const existing = await existingRes.json();
    if (existing.length > 0) {
      return new Response(JSON.stringify({ error: `PR #${existing[0].number} already exists for this branch` }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  const shortName = branch.replace('content/', '');
  const title = `Content: ${shortName}`;

  const createRes = await fetch(`https://api.github.com/repos/${REPO}/pulls`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      head: branch,
      base: 'main',
      body: `Content update from branch \`${branch}\`.`,
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.json();
    return new Response(JSON.stringify({ error: err.message || 'Failed to create PR' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const pr = await createRes.json();

  return new Response(JSON.stringify({ ok: true, prNumber: pr.number }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
};
