export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isStrongPassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) return { valid: false, message: 'Password must be at least 8 characters.' };
  if (!/[A-Z]/.test(password)) return { valid: false, message: 'Password must contain an uppercase letter.' };
  if (!/[a-z]/.test(password)) return { valid: false, message: 'Password must contain a lowercase letter.' };
  if (!/[0-9]/.test(password)) return { valid: false, message: 'Password must contain a number.' };
  return { valid: true, message: '' };
}

export function isRequired(value: string, fieldName: string): { valid: boolean; message: string } {
  if (!value.trim()) return { valid: false, message: `${fieldName} is required.` };
  return { valid: true, message: '' };
}

export function isValidPhone(phone: string): boolean {
  return /^[\d\s\-()+ ]{7,}$/.test(phone);
}

export function isValidZip(zip: string): boolean {
  // Accepts common postal code formats worldwide:
  // US (5 or 5+4), India (6), Canada (A1A 1A1), UK (e.g. SW1A 1AA), etc.
  const trimmed = zip.trim();
  return /^[A-Za-z0-9\s\-]{3,10}$/.test(trimmed) && /[A-Za-z0-9]/.test(trimmed);
}
