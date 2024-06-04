async function cancelAppointment(functionArgs) {
  const { date, time, patientName } = functionArgs;
  console.log('Canceling appointment...');
  
  return JSON.stringify({ confirmation: `Appointment for ${patientName} on ${date} at ${time} has been canceled` });
}

module.exports = cancelAppointment;
