async function testAll() {
  console.log('--- 1. Testing Backend API ---');
  const settingsRes = await fetch('http://localhost:5000/api/settings');
  const settingsData = await settingsRes.json();
  console.log('Backend Settings App Name:', settingsData.settings.appName);

  console.log('--- 2. Testing Hybrid App ---');
  const appRes = await fetch('http://localhost:3000');
  console.log('Hybrid App HTTP Status:', appRes.status);

  console.log('--- 3. Testing Admin Portal ---');
  const adminRes = await fetch('http://localhost:3001');
  console.log('Admin Portal HTTP Status:', adminRes.status);

  console.log('--- 4. Testing End-to-End Live Transaction Flow ---');
  const addMoneyRes = await fetch('http://localhost:5000/api/transactions/add-money', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      senderPhone: '01754150019',
      methodId: 'bkash',
      amount: 10000,
      adminNumber: '01754150019',
      trxId: 'BKASH99281X',
      note: 'প্রবাসী ডিপোজিট'
    })
  });
  const addMoneyData = await addMoneyRes.json();
  console.log('User Add Money Created ID:', addMoneyData.transaction.id);
  console.log('Request Timestamp:', addMoneyData.transaction.requestedAt);

  const approveRes = await fetch('http://localhost:5000/api/admin/transactions/' + addMoneyData.transaction.id + '/status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: 'approved',
      adminNote: 'এডমিন কর্তৃক বিকাশ ভেরিফাই করে ব্যালেন্স যোগ করা হয়েছে।'
    })
  });
  const approveData = await approveRes.json();
  console.log('Admin Approved Status:', approveData.transaction.status);
  console.log('Admin Processed Timestamp:', approveData.transaction.adminProcessedAt);

  const userRes = await fetch('http://localhost:5000/api/auth/me/01754150019');
  const userData = await userRes.json();
  console.log('User New Updated Balance:', userData.user.balance, 'BDT');
}

testAll().catch(console.error);
