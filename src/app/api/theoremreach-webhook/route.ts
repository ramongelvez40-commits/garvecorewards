import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// TheoremReach Postback / Webhook endpoint
// TheoremReach calls: GET /api/theoremreach-webhook?user_id=XXX&reward=XXX&transaction_id=XXX&hash=XXX
// Hash verification: MD5(user_id + reward + secret_key)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const userId = searchParams.get('user_id') || '';
  const reward = searchParams.get('reward') || '';
  const transactionId = searchParams.get('transaction_id') || '';
  const hash = searchParams.get('hash') || '';

  // Retrieve secret key from env (set via admin or env var)
  const secretKey = process.env.THEOREMREACH_SECRET_KEY || '';

  if (!userId || !reward || !transactionId || !hash) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  // Verify hash: MD5(user_id + reward + secret_key)
  if (secretKey) {
    const expectedHash = crypto
      .createHash('md5')
      .update(userId + reward + secretKey)
      .digest('hex');

    if (hash !== expectedHash) {
      return NextResponse.json({ error: 'Invalid hash' }, { status: 403 });
    }
  }

  const coinsEarned = Math.round(parseFloat(reward) * 100); // 1 cent = 100 coins (adjust ratio as needed)

  // TODO: Persist to database — update user coin balance
  // Example: await db.users.update({ where: { id: userId }, data: { coins: { increment: coinsEarned } } })
  // For now we log and return success so TheoremReach marks the postback as delivered
  console.log(`[TheoremReach Webhook] User: ${userId} | Reward: ${reward} | Coins: ${coinsEarned} | TxID: ${transactionId}`);

  // TheoremReach expects plain text "1" on success
  return new NextResponse('1', {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  });
}
