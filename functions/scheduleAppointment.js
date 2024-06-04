async function scheduleAppointment(functionArgs) {
  const { date, time, patientName } = functionArgs;
  console.log('Scheduling appointment...');
  
  return JSON.stringify({ confirmation: `Appointment scheduled for ${patientName} on ${date} at ${time}` });
}

module.exports = scheduleAppointment;
