async function checkAvailability() {
  console.log('Checking availability...');

  const today = new Date();
  let availableDate;

  // Find the first weekday (Monday to Friday) in the next week
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const day = date.getDay();
    if (day !== 0 && day !== 6) {
      availableDate = date;
      break;
    }
  }

  const times = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM'];
  const randomTime = times[Math.floor(Math.random() * times.length)];

  const availability = {
    date: availableDate.toISOString().split('T')[0],
    time: randomTime
  };

  return JSON.stringify({ availability });
}

module.exports = checkAvailability;
