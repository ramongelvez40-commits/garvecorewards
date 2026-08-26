// Catalog Rewards Store — persists Shein catalog purchase rewards per user
// Rewards are virtual and can only be withdrawn 1 month after purchase date

const CATALOG_REWARDS_KEY = 'garveco_catalog_rewards';

export interface CatalogRewardEntry {
  email: string;
  balance: number;           // current virtual balance (coins)
  transactions: CatalogTransaction[];
}

export interface CatalogTransaction {
  id: string;
  amount: number;
  addedAt: string;           // ISO date string when admin added the reward
  availableAt: string;       // ISO date string = addedAt + 1 month (withdrawal unlock)
}

function getAllRewards(): CatalogRewardEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CATALOG_REWARDS_KEY);
    if (stored) return JSON.parse(stored) as CatalogRewardEntry[];
  } catch {
    // ignore
  }
  return [];
}

function saveAllRewards(entries: CatalogRewardEntry[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CATALOG_REWARDS_KEY, JSON.stringify(entries));
  } catch {
    // ignore
  }
}

/** Get the reward entry for a specific user email */
export function getUserCatalogReward(email: string): CatalogRewardEntry | null {
  const all = getAllRewards();
  return all.find(e => e.email.toLowerCase() === email.toLowerCase()) || null;
}

/** Get all reward entries (for admin panel) */
export function getAllCatalogRewards(): CatalogRewardEntry[] {
  return getAllRewards();
}

/** Admin: add balance to a specific user's catalog reward */
export function addCatalogReward(email: string, amount: number): void {
  if (!email || amount <= 0) return;
  const all = getAllRewards();
  const now = new Date();
  const availableAt = new Date(now);
  availableAt.setMonth(availableAt.getMonth() + 1);

  const transaction: CatalogTransaction = {
    id: `ct-${Date.now()}`,
    amount,
    addedAt: now.toISOString(),
    availableAt: availableAt.toISOString(),
  };

  const existing = all.find(e => e.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    existing.balance += amount;
    existing.transactions.push(transaction);
  } else {
    all.push({ email: email.toLowerCase(), balance: amount, transactions: [transaction] });
  }
  saveAllRewards(all);
}

/** Register a new user email in the catalog rewards list (balance 0) */
export function registerCatalogUser(email: string): void {
  if (!email) return;
  const all = getAllRewards();
  const exists = all.find(e => e.email.toLowerCase() === email.toLowerCase());
  if (!exists) {
    all.push({ email: email.toLowerCase(), balance: 0, transactions: [] });
    saveAllRewards(all);
  }
}

/** Get the next available withdrawal date for a user (earliest locked transaction) */
export function getNextWithdrawalDate(email: string): Date | null {
  const entry = getUserCatalogReward(email);
  if (!entry || entry.transactions.length === 0) return null;
  const locked = entry.transactions
    .filter(t => new Date(t.availableAt) > new Date())
    .sort((a, b) => new Date(a.availableAt).getTime() - new Date(b.availableAt).getTime());
  if (locked.length === 0) return null;
  return new Date(locked[0].availableAt);
}

/** Get unlocked (available to withdraw) balance for a user */
export function getUnlockedBalance(email: string): number {
  const entry = getUserCatalogReward(email);
  if (!entry) return 0;
  const now = new Date();
  return entry.transactions
    .filter(t => new Date(t.availableAt) <= now)
    .reduce((sum, t) => sum + t.amount, 0);
}
