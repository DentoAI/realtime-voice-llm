const checkAvailability = require('../functions/checkAvailability');

test('Expect to check availability for the next two weeks with one date and one time, avoiding previously suggested dates', async () => {
  const suggestedDates = ['2024-06-10', '2024-06-11']; // Example of previously suggested dates
  const response = JSON.parse(await checkAvailability({ suggestedDates }));
  
  expect(response).toHaveProperty('availability');
  expect(response.availability).toHaveProperty('date');
  expect(response.availability).toHaveProperty('time');
  expect(response.availability).toHaveProperty('suggestedDates');

  const availableDate = new Date(response.availability.date);
  const today = new Date();
  const diffTime = Math.abs(availableDate - today);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  expect(diffDays).toBeLessThanOrEqual(14); // Check for availability within two weeks
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
