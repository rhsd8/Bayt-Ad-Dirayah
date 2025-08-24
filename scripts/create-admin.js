// Script to create an admin user
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  const email = 'admin@test.com';
  const password = 'admin123';
  const name = 'Test Admin';
  
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  
  console.log('Admin User Details:');
  console.log('Email:', email);
  console.log('Password:', password);
  console.log('Name:', name);
  console.log('Password Hash:', passwordHash);
  console.log('\nSQL Query:');
  console.log(`INSERT INTO admin_users (email, password_hash, name, role, is_active) VALUES ('${email}', '${passwordHash}', '${name}', 'admin', true);`);
}

createAdminUser().catch(console.error);