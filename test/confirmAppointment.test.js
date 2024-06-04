const confirmAppointment = require('../functions/confirmAppointment');

test('Expect to confirm an appointment', async () => {
  const response = JSON.parse(await confirmAppointment({ date: '2024-06-15', time: '10:00 AM', patientName: 'John Doe' }));
  expect(response).toHaveProperty('confirmation');
});
