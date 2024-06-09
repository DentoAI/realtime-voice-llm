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
      name: 'checkAvailability',
      description: 'Checks appointment availability for the next two weeks, avoiding previously suggested dates.',
      parameters: {
        type: 'object',
        properties: {
          suggestedDates: {
            type: 'array',
            items: {
              type: 'string',
              description: 'A list of previously suggested dates in YYYY-MM-DD format.'
            },
            description: 'Array of dates that have already been suggested to avoid redundancy.'
          }
        },
        required: []
      },
      returns: {
        type: 'object',
        properties: {
          availability: {
            type: 'object',
            properties: {
              date: { type: 'string', description: 'The date of availability in YYYY-MM-DD format.' },
              time: { type: 'string', description: 'Available time slot.' },
              suggestedDates: {
                type: 'array',
                items: {
                  type: 'string',
                  description: 'A list of all suggested dates including the newly suggested date.'
                },
                description: 'Updated array of suggested dates.'
              }
            }
          },
          error: {
            type: 'string',
            description: 'Error message if no available dates are found.'
          }
        }
      }
    }
  }
];

module.exports = tools;
