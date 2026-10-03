export const ORG_PASSKEY = 'brickbloom2026';

export async function hashPassword(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((part) => part.toString(16).padStart(2, '0'))
    .join('');
}

export function normalizePhoneDigits(phone?: string): string {
  return (phone || '').replace(/\D/g, '');
}

export function matchesPhone(storedPhone?: string, inputPhone?: string): boolean {
  if (!storedPhone || !inputPhone) return false;
  const sDigits = normalizePhoneDigits(storedPhone);
  const iDigits = normalizePhoneDigits(inputPhone);
  if (!sDigits || !iDigits) return false;
  if (sDigits === iDigits) return true;
  // If either has country code prefix (e.g. 91) and the last 10 digits match:
  if (sDigits.length >= 10 && iDigits.length >= 10 && sDigits.slice(-10) === iDigits.slice(-10)) {
    return true;
  }
  return false;
}

export function generateRandomPassword(length = 10): string {
  const lettersUpper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lettersLower = 'abcdefghijkmnpqrstuvwxyz';
  const numbers = '23456789';
  const symbols = '!@#$%&*';

  let pass = '';
  // Ensure at least 1 uppercase, 1 lowercase, 1 number, 1 symbol
  pass += lettersUpper[Math.floor(Math.random() * lettersUpper.length)];
  pass += lettersLower[Math.floor(Math.random() * lettersLower.length)];
  pass += numbers[Math.floor(Math.random() * numbers.length)];
  pass += symbols[Math.floor(Math.random() * symbols.length)];

  const all = lettersUpper + lettersLower + numbers + symbols;
  for (let i = pass.length; i < length; i++) {
    pass += all[Math.floor(Math.random() * all.length)];
  }

  // Shuffle characters
  return pass
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}
