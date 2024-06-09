async function checkAvailability(functionArgs) {
  console.log('Checking availability...');
  
  const { suggestedDates: initialSuggestedDates } = functionArgs || {};
  const suggestedDates = new Set(initialSuggestedDates);

  const today = new Date();
  let availableDate;

  // Find the first weekday (Monday to Friday) in the next week that hasn't been suggested before
  for (let i = 1; i <= 14; i++) { // Extended range to ensure we find a new date if initial week is fully booked
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const day = date.getDay();
    const dateString = date.toISOString().split('T')[0];
    
    if (day !== 0 && day !== 6 && !suggestedDates.has(dateString)) {
      availableDate = date;
      suggestedDates.add(dateString);
      break;
    }
  }

  if (!availableDate) {
    console.error('No available dates found within the next two weeks.');
    return JSON.stringify({ error: 'No available dates found within the next two weeks.' });
  }

  const times = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM'];
  const randomTime = times[Math.floor(Math.random() * times.length)];

  const availability = {
    date: availableDate.toISOString().split('T')[0],
    time: randomTime,
    suggestedDates: Array.from(suggestedDates) // Return the updated set of suggested dates
  };

  return JSON.stringify({ availability });
}

module.exports = checkAvailability;
