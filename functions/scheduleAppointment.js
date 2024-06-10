async function scheduleAppointment(functionArgs) {
  const { date, time, patientName, suggestedDates } = functionArgs;
  console.log('Scheduling appointment...');

  if (!suggestedDates || !Array.isArray(suggestedDates) || !suggestedDates.includes(date)) {
    return JSON.stringify({ error: 'There\'s no availability on that day.' });
  }
  
  return JSON.stringify({ confirmation: `Appointment scheduled for ${patientName} on ${date} at ${time}` });
}

module.exports = scheduleAppointment;
