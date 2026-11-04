import bcrypt from 'bcryptjs';

async function main(): Promise<void> {
  const password = process.argv[2];

  if (!password) {
    console.error('Usage: npm run hash -w server -- "your-strong-password"');
    console.error('Generate a unique password of at least 12 characters.');
    process.exitCode = 1;
    return;
  }

  if (Buffer.byteLength(password, 'utf8') > 72) {
    console.error('Password must be at most 72 bytes (bcrypt limit). Use a shorter passphrase.');
    process.exitCode = 1;
    return;
  }

  if (password.length < 12) {
    console.error('Password must be at least 12 characters.');
    process.exitCode = 1;
    return;
  }

  const hash = await bcrypt.hash(password, 12);
  console.log('\nAdd this line to server/.env:\n');
  console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
  console.log('Keep the password in a password manager. Do not commit the hash or password.');
}

void main();
