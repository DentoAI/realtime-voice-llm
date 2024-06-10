async function scheduleAppointment(functionArgs) {
  const { date, time, patientName, suggestedDates } = functionArgs;
  console.log('Scheduling appointment...');
  console.log('Function arguments:', functionArgs);

  // Parse the date string into a Date object
  const requestedDate = new Date(date + 'T00:00:00.000Z'); // Ensure the time component is set to midnight UTC

  if (requestedDate.getUTCDay() === 0 || requestedDate.getUTCDay() === 6) {
    console.error(`Error: No availability on ${date} because it falls on a weekend.`);
    return JSON.stringify({ error: `No availability on ${date} because it falls on a weekend.` });
  }

  if (!suggestedDates || !Array.isArray(suggestedDates) || !suggestedDates.includes(date)) {
    console.error(`Error: No availability on ${date}. Suggested dates:`, suggestedDates);
    return JSON.stringify({ error: 'There\'s no availability on that day.' });
  }

  console.log(`Appointment scheduled for ${patientName} on ${date} at ${time}`);
  return JSON.stringify({ confirmation: `Appointment scheduled for ${patientName} on ${date} at ${time}` });
}

module.exports = scheduleAppointment;
