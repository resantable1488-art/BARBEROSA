// Тест подключения к amoCRM API
require('dotenv').config({ path: '.env.local' });

// Use node-fetch for Node.js environments
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const AMOCRM_DOMAIN = process.env.AMOCRM_DOMAIN;
const AMOCRM_ACCESS_TOKEN = process.env.AMOCRM_ACCESS_TOKEN;

async function testAmoCRM() {
  console.log('🔍 Testing amoCRM connection...\n');
  console.log('Domain:', AMOCRM_DOMAIN);
  console.log('Token:', AMOCRM_ACCESS_TOKEN ? `${AMOCRM_ACCESS_TOKEN.substring(0, 20)}...` : 'NOT SET');
  console.log('');

  if (!AMOCRM_DOMAIN || !AMOCRM_ACCESS_TOKEN) {
    console.error('❌ Error: AMOCRM_DOMAIN or AMOCRM_ACCESS_TOKEN not set in .env.local');
    process.exit(1);
  }

  try {
    // Test 1: Get account info
    console.log('📊 Test 1: Getting account info...');
    const accountResponse = await fetch(`https://${AMOCRM_DOMAIN}/api/v4/account`, {
      headers: {
        'Authorization': `Bearer ${AMOCRM_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!accountResponse.ok) {
      console.error(`❌ Account request failed: ${accountResponse.status} ${accountResponse.statusText}`);
      const errorText = await accountResponse.text();
      console.error('Error details:', errorText);
      process.exit(1);
    }

    const accountData = await accountResponse.json();
    console.log('✅ Account info retrieved successfully!');
    console.log('Account name:', accountData.name);
    console.log('Account ID:', accountData.id);
    console.log('Subdomain:', accountData.subdomain);
    console.log('');

    // Test 2: Get pipelines (воронки)
    console.log('📊 Test 2: Getting pipelines...');
    const pipelinesResponse = await fetch(`https://${AMOCRM_DOMAIN}/api/v4/leads/pipelines`, {
      headers: {
        'Authorization': `Bearer ${AMOCRM_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!pipelinesResponse.ok) {
      console.error(`❌ Pipelines request failed: ${pipelinesResponse.status}`);
      process.exit(1);
    }

    const pipelinesData = await pipelinesResponse.json();
    console.log('✅ Pipelines retrieved successfully!');

    if (pipelinesData._embedded && pipelinesData._embedded.pipelines) {
      console.log('\nAvailable pipelines:');
      pipelinesData._embedded.pipelines.forEach((pipeline) => {
        console.log(`  - ID: ${pipeline.id}, Name: "${pipeline.name}"`);
        if (pipeline._embedded && pipeline._embedded.statuses) {
          console.log('    Statuses:');
          pipeline._embedded.statuses.forEach((status) => {
            console.log(`      - ${status.name} (ID: ${status.id})`);
          });
        }
      });
    }
    console.log('');

    // Test 3: Get custom fields for leads
    console.log('📊 Test 3: Getting custom fields for leads...');
    const fieldsResponse = await fetch(`https://${AMOCRM_DOMAIN}/api/v4/leads/custom_fields`, {
      headers: {
        'Authorization': `Bearer ${AMOCRM_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!fieldsResponse.ok) {
      console.error(`❌ Custom fields request failed: ${fieldsResponse.status}`);
      process.exit(1);
    }

    const fieldsData = await fieldsResponse.json();
    console.log('✅ Custom fields retrieved successfully!');

    if (fieldsData._embedded && fieldsData._embedded.custom_fields) {
      console.log('\nCustom fields for leads:');
      fieldsData._embedded.custom_fields.forEach((field) => {
        console.log(`  - ID: ${field.id}, Name: "${field.name}", Code: ${field.code || 'N/A'}, Type: ${field.type}`);
      });
    } else {
      console.log('No custom fields found. You need to create them in amoCRM settings.');
    }
    console.log('');

    // Test 4: Get contacts custom fields
    console.log('📊 Test 4: Getting custom fields for contacts...');
    const contactFieldsResponse = await fetch(`https://${AMOCRM_DOMAIN}/api/v4/contacts/custom_fields`, {
      headers: {
        'Authorization': `Bearer ${AMOCRM_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!contactFieldsResponse.ok) {
      console.error(`❌ Contact fields request failed: ${contactFieldsResponse.status}`);
    } else {
      const contactFieldsData = await contactFieldsResponse.json();
      console.log('✅ Contact custom fields retrieved successfully!');

      if (contactFieldsData._embedded && contactFieldsData._embedded.custom_fields) {
        console.log('\nCustom fields for contacts:');
        contactFieldsData._embedded.custom_fields.forEach((field) => {
          console.log(`  - ID: ${field.id}, Name: "${field.name}", Code: ${field.code || 'N/A'}, Type: ${field.type}`);
        });
      }
    }
    console.log('');

    console.log('🎉 All tests passed! amoCRM is connected and working!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Update AMOCRM_PIPELINE_ID in .env.local with the pipeline ID from above');
    console.log('2. Update src/lib/amocrm.ts with the custom field IDs');
    console.log('3. Run npm run build to compile the project');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testAmoCRM();
