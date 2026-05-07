#!/usr/bin/env node

// Simple script to create test data in Supabase
// Run with: node create-test-data.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestData() {
  try {
    console.log('Creating test demand requests...');

    // Create test demand requests (these will be visible to all authenticated users)
    const { data, error } = await supabase
      .from('demand_requests')
      .insert([
        {
          title: 'Server Hardware Upgrade',
          description: 'Upgrade production database servers for better performance',
          status: 'pending',
          priority: 'high',
          category: 'IT Infrastructure',
          requester_id: '550e8400-e29b-41d4-a716-446655440000', // Dummy UUID
        },
        {
          title: 'Software License Renewal',
          description: 'Annual renewal for SAP ERP system',
          status: 'in_progress',
          priority: 'medium',
          category: 'Software',
          requester_id: '550e8400-e29b-41d4-a716-446655440000',
        },
        {
          title: 'Network Infrastructure',
          description: 'Install fiber optic cables in facility',
          status: 'completed',
          priority: 'low',
          category: 'Infrastructure',
          requester_id: '550e8400-e29b-41d4-a716-446655440000',
        },
        {
          title: 'Security Patch Deployment',
          description: 'Critical security updates needed',
          status: 'delayed',
          priority: 'critical',
          category: 'Security',
          requester_id: '550e8400-e29b-41d4-a716-446655440000',
        }
      ]);

    if (error) {
      console.error('Error creating test data:', error);
      return;
    }

    console.log('✅ Test data created successfully!');
    console.log('Created', data?.length || 0, 'demand requests');

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

createTestData();