import Razorpay from 'razorpay';

async function test() {
  const key_id = 'rzp_test_TCUHDZolFKSGYt';
  const key_secret = '59kgXlfrBV0bpnu2QDvEFeUR';
  
  if (!key_id || !key_secret) {
    console.error("Keys missing");
    return;
  }
  
  try {
    const razorpay = new Razorpay({ key_id, key_secret });
    const order = await razorpay.orders.create({
      amount: 100, // 1 INR
      currency: 'INR',
      receipt: 'test_123'
    });
    console.log("Success:", order);
  } catch(e) {
    console.error("Error:", e);
  }
}
test();
