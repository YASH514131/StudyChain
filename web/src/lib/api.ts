// Pure JS base58 encoder — avoids bs58's Buffer dependency chain in Vite
const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
function encodeBase58(bytes: Uint8Array): string {
  const digits = [0];
  for (let i = 0; i < bytes.length; i++) {
    let carry = bytes[i];
    for (let j = 0; j < digits.length; j++) {
      carry += digits[j] << 8;
      digits[j] = carry % 58;
      carry = (carry / 58) | 0;
    }
    while (carry > 0) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }
  let result = '';
  for (let i = 0; i < bytes.length && bytes[i] === 0; i++) {
    result += '1';
  }
  for (let i = digits.length - 1; i >= 0; i--) {
    result += BASE58_ALPHABET[digits[i]];
  }
  return result;
}

const API_BASE = 'http://localhost:4000/api';

// Helper to get auth headers
function getHeaders(): HeadersInit {
  const token = localStorage.getItem('studychain_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function getNonce(walletAddress: string): Promise<string> {
  const res = await fetch(`${API_BASE}/auth/nonce?walletAddress=${walletAddress}`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch nonce');
  }
  const data = await res.json();
  return data.nonce;
}

export async function loginWithWallet(
  walletAddress: string,
  signature: Uint8Array,
  message: string
): Promise<any> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      walletAddress,
      signature: encodeBase58(signature),
      message,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to log in');
  }

  const data = await res.json();
  localStorage.setItem('studychain_token', data.token);
  return data;
}

export async function fetchChallenges(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/challenges`, {
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error('Failed to fetch challenges');
  }
  return res.json();
}

export async function fetchChallengeDetail(id: number): Promise<any> {
  const res = await fetch(`${API_BASE}/challenges/${id}`, {
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error('Failed to fetch challenge details');
  }
  return res.json();
}

export async function startSession(challengeId: number): Promise<any> {
  const res = await fetch(`${API_BASE}/sessions/start`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ challengeId }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to start session');
  }
  return res.json();
}

export async function verifyExploit(sessionId: string, txSignature: string): Promise<any> {
  const res = await fetch(`${API_BASE}/verify`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ sessionId, txSignature }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to verify exploit');
  }
  return res.json();
}

export async function fetchProfile(walletAddress: string): Promise<any> {
  const res = await fetch(`${API_BASE}/credentials/profile/${walletAddress}`);
  if (!res.ok) {
    throw new Error('Failed to fetch profile details');
  }
  return res.json();
}
