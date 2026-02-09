import type { APIRoute } from 'astro';

export const prerender = false;

const MAX_SIZE = 20 * 1024 * 1024; // 20 MB

export const POST: APIRoute = async ({ locals, request }) => {
  const runtime = (locals as any).runtime;
  const bucket = runtime?.env?.IMAGES_BUCKET as R2Bucket | undefined;
  const ai = runtime?.env?.AI;

  if (!bucket) {
    return new Response(JSON.stringify({ error: 'R2 bucket not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (!ai) {
    return new Response(JSON.stringify({ error: 'AI binding not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const formData = await request.formData();
  const file = formData.get('file');
  if (!file || !(file instanceof File)) {
    return new Response(JSON.stringify({ error: 'No file provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (file.type !== 'application/pdf') {
    return new Response(JSON.stringify({ error: `Invalid file type: ${file.type}. Only PDF files are accepted.` }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (file.size > MAX_SIZE) {
    return new Response(JSON.stringify({ error: 'File exceeds 20 MB limit' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const arrayBuffer = await file.arrayBuffer();

  // Upload PDF to R2
  const pdfKey = `job-pdfs/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.pdf`;
  await bucket.put(pdfKey, arrayBuffer, {
    httpMetadata: { contentType: 'application/pdf' },
  });

  // Extract text using Workers AI
  try {
    const result = await ai.toMarkdown([{
      name: file.name,
      blob: new Blob([arrayBuffer], { type: 'application/pdf' }),
    }]);

    const markdown = result?.[0]?.data || '';

    return new Response(JSON.stringify({ ok: true, markdown, pdfKey }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: `AI extraction failed: ${err.message}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
