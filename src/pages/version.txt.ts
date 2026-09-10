import type { APIRoute } from 'astro';

// Emitted as a static /version.txt at build time. Netlify populates these env
// vars during its build; locally they fall back to "local". Use it to confirm
// which commit is actually deployed:
//   curl -s https://<site>/version.txt
const info: Record<string, string> = {
	commit: process.env.COMMIT_REF ?? 'local',
	branch: process.env.BRANCH ?? 'local',
	context: process.env.CONTEXT ?? 'local',
	deployId: process.env.DEPLOY_ID ?? 'local',
	builtAt: new Date().toISOString(),
};

const body = Object.entries(info).map(([k, v]) => `${k}: ${v}`).join('\n') + '\n';

export const GET: APIRoute = () =>
	new Response(body, {
		headers: {
			'content-type': 'text/plain; charset=utf-8',
			'cache-control': 'no-store',
		},
	});
