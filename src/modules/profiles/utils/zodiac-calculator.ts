// Simple, deterministic helpers for Western horoscope and Chinese zodiac.
// Dates are evaluated in UTC to avoid timezone edge cases.

const HOROSCOPES = [
  { name: 'Capricorn', start: { month: 1, day: 1 } },
  { name: 'Aquarius', start: { month: 1, day: 20 } },
  { name: 'Pisces', start: { month: 2, day: 19 } },
  { name: 'Aries', start: { month: 3, day: 21 } },
  { name: 'Taurus', start: { month: 4, day: 20 } },
  { name: 'Gemini', start: { month: 5, day: 21 } },
  { name: 'Cancer', start: { month: 6, day: 21 } },
  { name: 'Leo', start: { month: 7, day: 23 } },
  { name: 'Virgo', start: { month: 8, day: 23 } },
  { name: 'Libra', start: { month: 9, day: 23 } },
  { name: 'Scorpio', start: { month: 10, day: 23 } },
  { name: 'Sagittarius', start: { month: 11, day: 22 } },
  { name: 'Capricorn', start: { month: 12, day: 22 } },
];

const ZODIAC_ANIMALS = [
  'Rat',
  'Ox',
  'Tiger',
  'Rabbit',
  'Dragon',
  'Snake',
  'Horse',
  'Goat',
  'Monkey',
  'Rooster',
  'Dog',
  'Pig',
];

export function calculateHoroscope(date: Date): string {
  const month = date.getUTCMonth() + 1; // 1-12
  const day = date.getUTCDate(); // 1-31

  // Find the last sign whose start is <= given date.
  let sign = HOROSCOPES[0].name;
  for (const { name, start } of HOROSCOPES) {
    if (month > start.month || (month === start.month && day >= start.day)) {
      sign = name;
    }
  }
  return sign;
}

export function calculateZodiac(date: Date): string {
  const year = date.getUTCFullYear();
  // 2020 was the Year of the Rat in the Gregorian calendar; use as anchor.
  const baseYear = 2020;
  const index = (((year - baseYear) % 12) + 12) % 12; // handle negative years
  return ZODIAC_ANIMALS[index];
}
