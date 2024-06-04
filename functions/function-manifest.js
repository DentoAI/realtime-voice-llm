const tools = [
  {
    type: 'function',
    function: {
      name: 'scheduleAppointment',
      description: 'Schedules an appointment for a patient.',
      parameters: {
        type: 'object',
        properties: {
          date: { type: 'string', description: 'The date of the appointment.' },
          time: { type: 'string', description: 'The time of the appointment.' },
          patientName: { type: 'string', description: 'The name of the patient.' },
        },
        required: ['date', 'time', 'patientName'],
      },
      returns: {
        type: 'object',
        properties: {
          confirmation: { type: 'string', description: 'Confirmation message.' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'cancelAppointment',
      description: 'Cancels an existing appointment.',
      parameters: {
        type: 'object',
        properties: {
          date: { type: 'string', description: 'The date of the appointment.' },
          time: { type: 'string', description: 'The time of the appointment.' },
          patientName: { type: 'string', description: 'The name of the patient.' },
        },
        required: ['date', 'time', 'patientName'],
      },
      returns: {
        type: 'object',
        properties: {
          confirmation: { type: 'string', description: 'Confirmation message.' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'generalInfoInvisalign',
      description: 'Provides a short summary of the Invisalign treatment for a specific case.',
      parameters: {
        type: 'object',
        properties: {
          fullName: { type: 'string', description: 'The full name of the patient.' },
        },
        required: ['fullName'],
      },
      returns: {
        type: 'object',
        properties: {
          summary: { type: 'string', description: 'Short summary of the Invisalign treatment.' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'checkAvailability',
      description: 'Checks appointment availability for the next week.',
      parameters: {},
      returns: {
        type: 'object',
        properties: {
          availability: {
            type: 'object',
            properties: {
              date: { type: 'string', description: 'The date of availability.' },
              time: { type: 'string', description: 'Available time slot.' },
            },
          },
        },
      },
    },
  },
];

module.exports = tools;
