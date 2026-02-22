import { NextResponse } from 'next/server';

const PROMOS = {
  SAVE10: { discount: 10, type: 'percent' },
  FLAT500: { discount: 500, type: 'fixed' },
  WELCOME: { discount: 15, type: 'percent' },
};

export async function POST(request) {
  const { code, amount } = await request.json();
  const promo = PROMOS[String(code).toUpperCase()];
  if (!promo) {
    return NextResponse.json({ valid: false, message: 'Invalid promo code' }, { status: 400 });
  }
  const savings = promo.type === 'percent'
    ? Math.round((amount * promo.discount) / 100)
    : Math.min(promo.discount, amount);
  return NextResponse.json({
    valid: true,
    code: String(code).toUpperCase(),
    savings,
    message: `You save ${promo.type === 'percent' ? promo.discount + '%' : '₹' + promo.discount}`,
  });
}
