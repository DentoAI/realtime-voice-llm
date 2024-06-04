async function confirmAppointment(functionArgs) {
  const { date, time, patientName } = functionArgs;
  console.log('Confirming appointment...');
  
  return JSON.stringify({ confirmation: `Appointment for ${patientName} on ${date} at ${time} is confirmed` });
}

module.exports = confirmAppointment;
