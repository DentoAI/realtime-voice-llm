const scheduleAppointment = require('../functions/scheduleAppointment');

test('Expect to schedule an appointment if the date is available', async () => {
  const suggestedDates = ['2024-06-15', '2024-06-16']; // Example of previously checked available dates
  const response = JSON.parse(await scheduleAppointment({ date: '2024-06-15', time: '10:00 AM', patientName: 'John Doe', suggestedDates }));

  expect(response).toHaveProperty('confirmation');
  expect(response.confirmation).toBe('Appointment scheduled for John Doe on 2024-06-15 at 10:00 AM');
});

test('Expect an error when scheduling an appointment on an unavailable date', async () => {
  const suggestedDates = ['2024-06-14', '2024-06-16']; // Example of previously checked available dates, does not include '2024-06-15'
  const response = JSON.parse(await scheduleAppointment({ date: '2024-06-15', time: '10:00 AM', patientName: 'John Doe', suggestedDates }));

  expect(response).toHaveProperty('error');
  expect(response.error).toBe('There\'s no availability on that day.');
});
