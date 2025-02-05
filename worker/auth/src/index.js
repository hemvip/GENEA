import { sign, verify } from '@tsndr/cloudflare-worker-jwt'
import { responseError, responseFailed, responseSuccess } from './response'

export default {
	async fetch(request, env, ctx) {
		const corsHeaders = {
			'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN,
			'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
			'Access-Control-Allow-Credentials': 'true',
		}

		if (request.method === 'OPTIONS') {
			// Handle CORS preflight requests
			return new Response(null, { headers: corsHeaders })
		}

		const url = new URL(request.url)
		const path = url.pathname

		try {
			switch (path) {
				case '/auth/callback/github':
					return handleGithubCallback(request, env, corsHeaders)
				case '/auth/user':
					return handleGetUser(request, env, corsHeaders)
				case '/auth/logout':
					return handleLogout(request, env, corsHeaders)
				default:
					return new Response('Invalid api', { status: 404 })
			}
		} catch (err) {
			return responseError(err, err.message, 500, corsHeaders)
		}
	},
}

async function handleGithubCallback(request, env, corsHeaders) {
	const url = new URL(request.url)
	const code = url.searchParams.get('code')

	if (!code) {
		return responseFailed(null, 'No code provided', 400, corsHeaders)
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

	// Check if token response is OK
	if (!tokenResponse.ok) {
		const errorText = await tokenResponse.text()
		console.error('GitHub Token Error:', errorText)
		return responseFailed(null, `GitHub token request failed: ${errorText}`, 400, corsHeaders)
	}

	const tokenData = await tokenResponse.json()

	if (!tokenData.access_token) {
		return responseFailed(null, `Invalid GitHub OAuth response: ${JSON.stringify(tokenData)}`, 400, corsHeaders)
	}

	// Get user data from GitHub
	const userResponse = await fetch('https://api.github.com/user', {
		headers: {
			Authorization: `Bearer ${tokenData.access_token}`,
			Accept: 'application/json',
			'User-Agent': '"Mozilla/5.0 (compatible; Cloudflare-Worker/1.0)"',
		},
	})

	if (!userResponse.ok) {
		const errorText = await userResponse.text()
		console.error('GitHub API Error:', userResponse.status, errorText)
		return responseFailed(null, `GitHub API Error: ${userResponse.status} - ${errorText}`, userResponse.status, corsHeaders)
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
	const response = Response.redirect(`${env.ALLOWED_ORIGIN}/getting-started`, 302)

	// Set the Set-Cookie header using the correct method
	const responseWithCookie = new Response(response.body, response)
	responseWithCookie.headers.set('Set-Cookie', `auth-token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${24 * 60 * 60}`)

	return responseWithCookie
}

async function handleGetUser(request, env, corsHeaders) {
	const cookies = request.headers.get('Cookie') || ''
	const tokenMatch = cookies.match(/auth-token=([^;]+)/)
	const token = tokenMatch ? tokenMatch[1] : null

	if (!token) {
		return responseFailed(null, 'No token provided', 401, corsHeaders)
	}

	try {
		const res = await verify(token, env.JWT_SECRET)
		if (res?.payload) {
			return responseSuccess(res.payload, corsHeaders)
		} else {
			return responseFailed(null, 'Invalid token', 401, corsHeaders)
		}
	} catch (err) {
		responseError(err, 'Invalid token', 401, corsHeaders)
	}
}

async function handleLogout(request, env, corsHeaders) {
	const response = new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

	response.headers.set('Set-Cookie', 'auth-token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0')

	return response
}
