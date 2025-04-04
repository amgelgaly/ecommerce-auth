import { NextResponse } from 'next/server';
import { auth } from './auth';

type Role = 'admin' | 'seller' | 'customer';

export async function requireAuth(allowedRoles: Role[]) {
  const session = await auth();

  if (!session?.user) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const userRole = session.user.role;
  if (!allowedRoles.includes(userRole)) {
    return new NextResponse(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return null; // Authentication and authorization passed
}

export async function isAdmin() {
  return requireAuth(['admin']);
}

export async function isSeller() {
  return requireAuth(['seller']);
}

export async function isAdminOrSeller() {
  return requireAuth(['admin', 'seller']);
}