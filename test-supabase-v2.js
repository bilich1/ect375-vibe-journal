const fs = require('fs');
const path = require('path');

// Load .env.local with explicit encoding
const envPath = path.join(__dirname, '.env.local');
console.log('Reading from:', envPath);

const envFile = fs.readFileSync(envPath, 'utf8');
console.log('Raw file content length:', envFile.length);

const envVars = {};
envFile.split('\n').forEach((line, idx) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    const value = valueParts.join('=');
    if (key) {
      envVars[key.trim()] = value.trim();
    }
  }
});

console.log('\nParsed variables:');
Object.keys(envVars).forEach(key => {
  const val = envVars[key];
  console.log(`${key}: ${val.substring(0, 20)}${val.length > 20 ? '...' : ''}`);
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('\n❌ Error: Missing Supabase credentials in .env.local');
  process.exit(1);
}

console.log('\n🔗 Testing Supabase connection...');

fetch(`${supabaseUrl}/rest/v1/`, {
  headers: {
    'apikey': supabaseAnonKey,
  },
})
  .then(response => {
    console.log('Server responded with status:', response.status);
    if (response.status === 401 || response.status === 200 || response.status === 404) {
      console.log('✅ SUCCESS: Supabase server is reachable and credentials were recognized!');
      return 'Success';
    }
    throw new Error(`Unexpected status: ${response.status}`);
  })
  .then(() => {
    console.log('✅ Connection test completed successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  });
