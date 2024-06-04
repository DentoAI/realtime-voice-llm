const billingInquiry = require('../functions/billingInquiry');

test('Expect to handle a billing inquiry', async () => {
  const response = JSON.parse(await billingInquiry({ patientName: 'John Doe' }));
  expect(response).toHaveProperty('info');
});
