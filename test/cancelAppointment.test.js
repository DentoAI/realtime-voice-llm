const cancelAppointment = require('../functions/cancelAppointment');

test('Expect to cancel an appointment', async () => {
  const response = JSON.parse(await cancelAppointment({ date: '2024-06-15', time: '10:00 AM', patientName: 'John Doe' }));
  expect(response).toHaveProperty('confirmation');
});
