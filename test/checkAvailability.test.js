const checkAvailability = require('../functions/checkAvailability');

test('Expect to check availability for the next week with one date and one time', async () => {
  const response = JSON.parse(await checkAvailability());
  expect(response).toHaveProperty('availability');
  expect(response.availability).toHaveProperty('date');
  expect(response.availability).toHaveProperty('time');

  const availableDate = new Date(response.availability.date);
  const today = new Date();
  const diffTime = Math.abs(availableDate - today);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  expect(diffDays).toBeLessThanOrEqual(7);
  expect(availableDate.getDay()).not.toBe(0); // Not Sunday
  expect(availableDate.getDay()).not.toBe(6); // Not Saturday

  const times = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM'];
  expect(times).toContain(response.availability.time);
});
