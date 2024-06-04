const generalInfoInvisalign = require('../functions/generalInfoInvisalign');

test('Expect to provide a short summary about a specific Invisalign case', async () => {
  const response = JSON.parse(await generalInfoInvisalign({ fullName: 'John Doe' }));
  expect(response).toHaveProperty('summary');
  expect(response.summary).toContain('Invisalign treatment for John Doe started on 2024-01-15 and is expected to end on 2025-01-15.');
  expect(response.summary).toContain('So far, 12 aligners have been used, and the patient is currently at stage 5 of the treatment.');
  expect(response.summary).toContain('The total cost of the treatment is $5000, and it is covered by insurance.');
  expect(response.summary).toContain('There have been minor adjustments needed, but overall the patient is progressing well.');
});
