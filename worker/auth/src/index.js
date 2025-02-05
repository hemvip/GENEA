import { sign, verify } from '@tsndr/cloudflare-worker-jwt';
import { corsHeaders } from './cors.js';
export default {
	async fetch(request, env, ctx) {
		// Handle CORS preflight
		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders });
		}

		const url = new URL(request.url);
		const path = url.pathname;

		try {
			switch (path) {
				case '/auth/github':
					return handleGithubAuth(request, env);
				case '/auth/github/callback':
					return handleGithubCallback(request, env);
				case '/auth/user':
					return handleGetUser(request, env);
				case '/auth/logout':
					return handleLogout(request, env);
				default:
					return new Response('Not found', { status: 404 });
			}
		} catch (err) {
			return new Response(JSON.stringify({ error: err.message }), {
				status: 500,
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		}
	},
};

async function handleGithubAuth(request, env) {
	const redirectUri = `${new URL(request.url).origin}/auth/github/callback`;
	const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
	githubAuthUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
	githubAuthUrl.searchParams.set('redirect_uri', redirectUri);
	githubAuthUrl.searchParams.set('scope', 'read:user user:email');

	return Response.redirect(githubAuthUrl.toString(), 302);
}

async function handleGithubCallback(request, env) {
	const url = new URL(request.url);
	const code = url.searchParams.get('code');

	if (!code) {
		return new Response('No code provided', { status: 400 });
	}

	// Exchange code for access token
	const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify({
			client_id: env.GITHUB_CLIENT_ID,
			client_secret: env.GITHUB_CLIENT_SECRET,
			code,
		}),
	});

	const tokenData = await tokenResponse.json();

	// Get user data from GitHub
	const userResponse = await fetch('https://api.github.com/user', {
		headers: {
			Authorization: `Bearer ${tokenData.access_token}`,
			Accept: 'application/json',
		},
	});

	const userData = await userResponse.json();

	// Create JWT token
	const token = await sign(
		{
			sub: userData.id.toString(),
			login: userData.login,
			name: userData.name,
			avatar: userData.avatar_url,
			exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
		},
		env.JWT_SECRET
	);

	// Set secure cookie and redirect
	const response = Response.redirect(`${env.ALLOWED_ORIGIN}/`, 302);
	response.headers.set('Set-Cookie', `auth-token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${24 * 60 * 60}`);

	return response;
}

async function handleGetUser(request, env) {
	const cookies = request.headers.get('Cookie') || '';
	const tokenMatch = cookies.match(/auth-token=([^;]+)/);
	const token = tokenMatch ? tokenMatch[1] : null;

	if (!token) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	}

	try {
		const payload = await verify(token, env.JWT_SECRET);
		return new Response(JSON.stringify({ user: payload }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
	} catch {
		return new Response(JSON.stringify({ error: 'Invalid token' }), {
			status: 401,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	}
}

async function handleLogout(request, env) {
	const response = new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

	response.headers.set('Set-Cookie', 'auth-token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');

	return response;
}
