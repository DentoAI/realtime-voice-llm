async function checkAvailabilityByDays(functionArgs) {
  console.log('Checking availability by days...', functionArgs);
  
  const { suggestedDates: initialSuggestedDates, daysFromToday } = functionArgs || {};
  const suggestedDates = new Set(initialSuggestedDates);

  if (typeof daysFromToday !== 'number' || daysFromToday < 0) {
    console.error('Invalid number of days provided.');
    return JSON.stringify({ error: 'Invalid number of days provided.' });
  }

  const today = new Date();
  let availableDate = new Date(today);
  availableDate.setDate(today.getDate() + daysFromToday);

  const day = availableDate.getDay();
  if (day === 0 || day === 6) {
    console.error('Selected date falls on a weekend.');
    return JSON.stringify({ error: 'Selected date falls on a weekend.' });
  }

  const dateString = availableDate.toISOString().split('T')[0];
  if (suggestedDates.has(dateString)) {
    console.error('The suggested date has already been provided.');
    return JSON.stringify({ error: 'The suggested date has already been provided.' });
  }

  suggestedDates.add(dateString);

  const times = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM'];
  const randomTime = times[Math.floor(Math.random() * times.length)];

  const availability = {
    date: dateString,
    time: randomTime,
    suggestedDates: Array.from(suggestedDates) // Return the updated set of suggested dates
  };

  return JSON.stringify({ availability });
}

module.exports = checkAvailabilityByDays;
