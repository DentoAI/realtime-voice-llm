async function billingInquiry(functionArgs) {
  const { patientName } = functionArgs;
  console.log('Handling billing inquiry...');
  
  return JSON.stringify({ info: `Billing information for ${patientName} has been sent to your email.` });
}

module.exports = billingInquiry;
