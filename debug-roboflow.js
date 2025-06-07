// debug-roboflow.js - Run this locally to test your API key
// Usage: node debug-roboflow.js

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testRoboflowAPI() {
  const apiKey = process.env.ROBOFLOW_API_KEY;
  
  console.log('🔍 Testing Roboflow API Configuration');
  console.log('=====================================');
  
  if (!apiKey) {
    console.error('❌ ROBOFLOW_API_KEY not found in environment variables');
    console.log('💡 Make sure your .env file contains: ROBOFLOW_API_KEY=your_key_here');
    return;
  }
  
  console.log('✅ API Key found');
  console.log(`📏 Key length: ${apiKey.length} characters`);
  console.log(`🔑 Key prefix: ${apiKey.substring(0, 12)}...`);
  
  // Create a more realistic test image (a small but valid JPEG)
  // This is a 50x50 pixel white square JPEG
  const testImageBase64 = '/9j/4AAQSkZJRgABAQEAAAAAAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAgACADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9U6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//Z';
  
  try {
    console.log('\n🌐 Testing API endpoint...');
    console.log('📏 Test image size:', testImageBase64.length, 'characters');
    
    const response = await fetch(
      `https://serverless.roboflow.com/skin-problem-multilabel/1?api_key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: testImageBase64
      }
    );
    
    console.log(`📡 Response status: ${response.status} ${response.statusText}`);
    console.log(`📋 Response headers:`, Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log(`📄 Response length: ${responseText.length} characters`);
    
    if (!response.ok) {
      console.error('❌ API request failed');
      console.error(`🔴 Error response: ${responseText}`);
      return;
    }
    
    // Try to parse as JSON
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(responseText);
      console.log('✅ Response is valid JSON');
      console.log('📊 Parsed response:', JSON.stringify(jsonResponse, null, 2));
      
      // Check the structure
      if (jsonResponse.predictions) {
        console.log('✅ Found predictions object');
        console.log(`📈 Number of predictions: ${Object.keys(jsonResponse.predictions).length}`);
        
        Object.entries(jsonResponse.predictions).forEach(([key, value]) => {
          console.log(`  🎯 ${key}: confidence ${value.confidence || 'unknown'}`);
        });
      } else {
        console.log('⚠️  No predictions object found in response');
      }
      
    } catch (parseError) {
      console.error('❌ Failed to parse response as JSON');
      console.error(`🔴 Parse error: ${parseError.message}`);
      console.log(`📄 Raw response: ${responseText.substring(0, 200)}${responseText.length > 200 ? '...' : ''}`);
    }
    
  } catch (error) {
    console.error('❌ Network error or API call failed');
    console.error(`🔴 Error: ${error.message}`);
  }
}

// Common issues and solutions
function printTroubleshootingTips() {
  console.log('\n🛠️  Troubleshooting Tips');
  console.log('=======================');
  console.log('1. ✅ API Key: Check your Roboflow dashboard for the correct API key');
  console.log('2. 📂 Model: Verify "skin-problem-multilabel/1" exists in your workspace');
  console.log('3. 🚀 Publishing: Make sure your model is published and accessible');
  console.log('4. 💳 Credits: Check if you have API credits remaining');
  console.log('5. 🌐 Network: Ensure your network allows outbound HTTPS requests');
  console.log('6. 📋 Format: API key should be a long alphanumeric string');
}

// Run the test
testRoboflowAPI()
  .then(() => {
    console.log('\n✨ Test completed');
    printTroubleshootingTips();
  })
  .catch((error) => {
    console.error('\n💥 Test failed with error:', error);
    printTroubleshootingTips();
  });