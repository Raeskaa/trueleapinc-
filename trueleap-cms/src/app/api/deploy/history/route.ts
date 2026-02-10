import { NextResponse } from 'next/server'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? ''
const GITHUB_REPO = process.env.GITHUB_REPO ?? 'Trueleap/trueleap-inc'

export async function GET() {
  if (!GITHUB_TOKEN) {
    return NextResponse.json({ runs: [], error: 'GITHUB_TOKEN not configured' })
  }

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/actions/runs?event=repository_dispatch&per_page=15`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'trueleap-cms',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  )

  if (!res.ok) {
    return NextResponse.json({ runs: [] })
  }

  const data = await res.json()
  const runs = (data.workflow_runs ?? []).map((run: any) => ({
    id: run.id,
    status: run.status === 'completed' ? run.conclusion : run.status,
    created_at: run.created_at,
    url: run.html_url,
  }))

  return NextResponse.json({ runs })
}
