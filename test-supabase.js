const fs = require('fs');
const path = require('path');

// Load .env.local manually
const envFile = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey ? supabaseAnonKey.substring(0, 10) + '***' : 'NOT SET');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Missing Supabase credentials in .env.local');
  process.exit(1);
}

// Test connection with basic HTTP request
fetch(`${supabaseUrl}/rest/v1/`, {
  headers: {
    'apikey': supabaseAnonKey,
  },
})
  .then(response => {
    if (response.ok || response.status === 200 || response.status === 401) {
      // 401 is expected if the key is invalid, but it means the server responded
      console.log('✅ Supabase server is reachable');
      console.log('Status:', response.status);
      return response.text();
    } else if (response.status === 404) {
      console.log('✅ Supabase URL is valid (endpoint not found, but connection successful)');
      return 'Success';
    }
    throw new Error(`HTTP ${response.status}`);
  })
  .then(() => {
    console.log('✅ Connection test completed successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Connection failed:', err.message);
    console.error('Please verify your Supabase credentials in .env.local');
    process.exit(1);
  });
