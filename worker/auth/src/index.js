import { Router } from 'itty-router';
import { sign, verify } from '@tsndr/cloudflare-worker-jwt';

const router = Router();

// User registration
router.post('/auth/register', async (request, env) => {
	const { email, password } = await request.json();

	// Hash password in production
	const result = await env.DB.prepare('INSERT INTO users (email, password) VALUES (?, ?)').bind(email, password).run();

	return new Response(JSON.stringify({ success: true }), {
		headers: { 'Content-Type': 'application/json' },
	});
});

// User login
router.post('/auth/login', async (request, env) => {
	const { email, password } = await request.json();

	const user = await env.DB.prepare('SELECT * FROM users WHERE email = ? AND password = ?').bind(email, password).first();

	if (!user) {
		return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const token = await sign({ sub: user.id, email: user.email }, env.JWT_SECRET);

	return new Response(JSON.stringify({ token }), {
		headers: {
			'Content-Type': 'application/json',
			'Set-Cookie': `token=${token}; HttpOnly; Secure; SameSite=Strict`,
		},
	});
});

// Protected route example
router.get('/auth/user', async (request, env) => {
	const authHeader = request.headers.get('Authorization');
	if (!authHeader?.startsWith('Bearer ')) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}

	const token = authHeader.split(' ')[1];
	try {
		const payload = await verify(token, env.JWT_SECRET);
		return new Response(JSON.stringify({ user: payload }));
	} catch {
		return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
	}
});
