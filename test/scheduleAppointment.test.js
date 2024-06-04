const scheduleAppointment = require('../functions/scheduleAppointment');

test('Expect to schedule an appointment', async () => {
  const response = JSON.parse(await scheduleAppointment({ date: '2024-06-15', time: '10:00 AM', patientName: 'John Doe' }));
  expect(response).toHaveProperty('confirmation');
});
