const checkAvailabilityByDays = require('../functions/checkAvailabilityByDays');

test('Expect to check availability based on the number of days from today, avoiding weekends and previously suggested dates', async () => {
  const suggestedDates = ['2024-06-10', '2024-06-11']; // Example of previously suggested dates
  const daysFromToday = 3; // Example of days from today
  const response = JSON.parse(await checkAvailabilityByDays({ suggestedDates, daysFromToday }));

  expect(response).toHaveProperty('availability');
  expect(response.availability).toHaveProperty('date');
  expect(response.availability).toHaveProperty('time');
  expect(response.availability).toHaveProperty('suggestedDates');

  const options = { timeZone: 'America/Los_Angeles', hour12: false };
  const todayPSTString = new Date().toLocaleString('en-US', options);
  const todayPST = new Date(todayPSTString);

  let expectedDate = new Date(todayPST);
  expectedDate.setDate(todayPST.getDate() + daysFromToday);
  expectedDate.setHours(0, 0, 0, 0); // Ensure hours, minutes, seconds, and milliseconds are zeroed

  // Set availableDate to have no time component
  const availableDate = new Date(response.availability.date);
  availableDate.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(availableDate - expectedDate);
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  expect(diffDays).toBe(0); // Check if the available date is the expected date

  expect(availableDate.getDay()).not.toBe(0); // Not Sunday
  expect(availableDate.getDay()).not.toBe(6); // Not Saturday

  const times = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM'];
  expect(times).toContain(response.availability.time);

  // Ensure the new suggested date is not in the previously suggested dates
  expect(suggestedDates).not.toContain(response.availability.date);

  // Ensure the suggested dates include the new date
  expect(response.availability.suggestedDates).toContain(response.availability.date);
  // Ensure all previous suggested dates are still present
  suggestedDates.forEach(date => {
    expect(response.availability.suggestedDates).toContain(date);
  });
});
