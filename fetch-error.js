const https = require('https');

const data = JSON.stringify({
  amount: 100,
  currency: 'INR',
  receipt: 'test_receipt'
});

const options = {
  hostname: 'www.entryclub.in',
  port: 443,
  path: '/api/payments/create-order',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('Status:', res.statusCode, 'Body:', body));
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
