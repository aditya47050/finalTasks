// utils/passwordGenerator.ts
export function generateSecurePassword() {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const symbols = '!@#$%^&*()_+[]{}|;:,.<>?';

  const allChars = upper + lower + digits + symbols;

  const getRandomChar = (charset) =>
    charset[Math.floor(Math.random() * charset.length)];

  let password = '';
  password += getRandomChar(upper);
  password += getRandomChar(lower);
  password += getRandomChar(digits);
  password += getRandomChar(symbols);

  for (let i = 4; i < 8; i++) {
    password += getRandomChar(allChars);
  }

  return password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');
}
