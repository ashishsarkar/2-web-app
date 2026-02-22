import { NextResponse } from 'next/server';
import { mockWalletStore } from '@/lib/api/mockStore';

export async function GET() {
  const balance = mockWalletStore.get('default') ?? 0;
  return NextResponse.json({ balance });
}

export async function POST(request) {
  const { action, amount } = await request.json();
  let balance = mockWalletStore.get('default') ?? 0;
  if (action === 'topup') {
    balance += Number(amount) || 0;
  } else if (action === 'use') {
    balance = Math.max(0, balance - (Number(amount) || 0));
  }
  mockWalletStore.set('default', balance);
  return NextResponse.json({ balance });
}
