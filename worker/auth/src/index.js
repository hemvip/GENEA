import { sign, verify } from '@tsndr/cloudflare-worker-jwt'

export const corsHeaders = {
	'Access-Control-Allow-Origin': 'http://localhost:3000',
	'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
	'Access-Control-Allow-Credentials': 'true',
}

export default {
	async fetch(request, env, ctx) {
		if (request.method === 'OPTIONS') {
			// Handle CORS preflight requests
			return new Response(null, { headers: corsHeaders })
		}

		const url = new URL(request.url)
		const path = url.pathname

		try {
			switch (path) {
				case '/auth/github':
					return handleGithubAuth(request, env)
				case '/auth/github/callback':
					return handleGithubCallback(request, env)
				case '/auth/user':
					return handleGetUser(request, env)
				case '/auth/logout':
					return handleLogout(request, env)
				default:
					return new Response('Not found', { status: 404 })
			}
		} catch (err) {
			return new Response(JSON.stringify({ error: err.message }), {
				status: 500,
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			})
		}
	},
}

async function handleGithubAuth(request, env) {
	const redirectUri = `${new URL(request.url).origin}/auth/github/callback`
	const githubAuthUrl = new URL('https://github.com/login/oauth/authorize')
	githubAuthUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID)
	githubAuthUrl.searchParams.set('redirect_uri', redirectUri)
	githubAuthUrl.searchParams.set('scope', 'read:user user:email')

	return Response.redirect(githubAuthUrl.toString(), 302)
}

async function handleGithubCallback(request, env) {
	const url = new URL(request.url)
	const code = url.searchParams.get('code')

	if (!code) {
		return new Response('No code provided', { status: 400 })
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
	})

	console.log('GITHUB_CLIENT_ID', env.GITHUB_CLIENT_ID, 'GITHUB_CLIENT_SECRET', env.GITHUB_CLIENT_SECRET, 'code', code)

	// Check if token response is OK
	if (!tokenResponse.ok) {
		const errorText = await tokenResponse.text()
		console.error('GitHub Token Error:', errorText)
		return new Response(`GitHub token request failed: ${errorText}`, { status: 400 })
	}
	console.log('tokenResponse', tokenResponse)

	const tokenData = await tokenResponse.json()
	console.log('tokenData.access_token', tokenData.access_token)

	if (!tokenData.access_token) {
		return new Response(`Invalid GitHub OAuth response: ${JSON.stringify(tokenData)}`, { status: 400 })
	}

	// Get user data from GitHub
	const userResponse = await fetch('https://api.github.com/user', {
		headers: {
			Authorization: `Bearer ${tokenData.access_token}`,
			Accept: 'application/json',
			'User-Agent': '"Mozilla/5.0 (compatible; Cloudflare-Worker/1.0)"',
		},
	})
	console.log('userResponse', userResponse)

	if (!userResponse.ok) {
		const errorText = await userResponse.text()
		console.error('GitHub API Error:', userResponse.status, errorText)
		return new Response(`GitHub API Error: ${userResponse.status} - ${errorText}`, { status: userResponse.status })
	}

	const userData = await userResponse.json()

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
	)

	// Create a new response with the updated headers
	const response = Response.redirect(`${env.ALLOWED_ORIGIN}/`, 302)

	// Set the Set-Cookie header using the correct method
	const responseWithCookie = new Response(response.body, response)
	responseWithCookie.headers.set('Set-Cookie', `auth-token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${24 * 60 * 60}`)

	return responseWithCookie
}

async function handleGetUser(request, env) {
	const cookies = request.headers.get('Cookie') || ''
	const tokenMatch = cookies.match(/auth-token=([^;]+)/)
	const token = tokenMatch ? tokenMatch[1] : null

	if (!token) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		})
	}

	try {
		const payload = await verify(token, env.JWT_SECRET)
		console.log('payload', payload)
		return new Response(JSON.stringify({ user: payload }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
	} catch {
		return new Response(JSON.stringify({ error: 'Invalid token' }), {
			status: 401,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		})
	}
}

async function handleLogout(request, env) {
	const response = new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

	response.headers.set('Set-Cookie', 'auth-token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0')

	return response
}
