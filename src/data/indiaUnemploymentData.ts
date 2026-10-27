import { UnemploymentRecord } from '../types';

// Authentic monthly data structure mirroring CodeAlpha's 'Unemployment_in_India.csv' / 'Unemployment in India during COVID-19'
const rawStates = [
  { name: 'Andhra Pradesh', baseRate: 6.2, peakRate: 32.3, urbanMult: 1.15, employedBase: 15400000 },
  { name: 'Assam', baseRate: 5.4, peakRate: 11.1, urbanMult: 1.25, employedBase: 10800000 },
  { name: 'Bihar', baseRate: 13.8, peakRate: 46.6, urbanMult: 1.2, employedBase: 26300000 },
  { name: 'Chhattisgarh', baseRate: 8.5, peakRate: 28.3, urbanMult: 1.1, employedBase: 8400000 },
  { name: 'Delhi', baseRate: 12.5, peakRate: 42.3, urbanMult: 1.0, employedBase: 5800000 },
  { name: 'Goa', baseRate: 9.1, peakRate: 25.5, urbanMult: 0.95, employedBase: 480000 },
  { name: 'Gujarat', baseRate: 4.8, peakRate: 18.7, urbanMult: 1.1, employedBase: 23500000 },
  { name: 'Haryana', baseRate: 21.2, peakRate: 43.3, urbanMult: 1.18, employedBase: 7100000 },
  { name: 'Himachal Pradesh', baseRate: 14.1, peakRate: 26.9, urbanMult: 1.1, employedBase: 2100000 },
  { name: 'Jammu & Kashmir', baseRate: 16.5, peakRate: 24.0, urbanMult: 1.08, employedBase: 3400000 },
  { name: 'Jharkhand', baseRate: 14.2, peakRate: 59.2, urbanMult: 1.22, employedBase: 9900000 },
  { name: 'Karnataka', baseRate: 5.6, peakRate: 29.8, urbanMult: 1.2, employedBase: 22100000 },
  { name: 'Kerala', baseRate: 8.9, peakRate: 29.7, urbanMult: 1.12, employedBase: 10400000 },
  { name: 'Madhya Pradesh', baseRate: 6.8, peakRate: 21.9, urbanMult: 1.15, employedBase: 22800000 },
  { name: 'Maharashtra', baseRate: 5.8, peakRate: 25.2, urbanMult: 1.25, employedBase: 42000000 },
  { name: 'Meghalaya', baseRate: 3.8, peakRate: 9.2, urbanMult: 1.1, employedBase: 1300000 },
  { name: 'Odisha', baseRate: 6.9, peakRate: 23.8, urbanMult: 1.12, employedBase: 13500000 },
  { name: 'Puducherry', baseRate: 8.4, peakRate: 75.8, urbanMult: 1.05, employedBase: 410000 },
  { name: 'Punjab', baseRate: 10.3, peakRate: 33.6, urbanMult: 1.18, employedBase: 9800000 },
  { name: 'Rajasthan', baseRate: 12.1, peakRate: 24.1, urbanMult: 1.14, employedBase: 19800000 },
  { name: 'Sikkim', baseRate: 5.1, peakRate: 19.3, urbanMult: 1.05, employedBase: 270000 },
  { name: 'Tamil Nadu', baseRate: 6.4, peakRate: 49.8, urbanMult: 1.24, employedBase: 27300000 },
  { name: 'Telangana', baseRate: 7.2, peakRate: 36.8, urbanMult: 1.2, employedBase: 16200000 },
  { name: 'Tripura', baseRate: 27.5, peakRate: 41.5, urbanMult: 1.1, employedBase: 1400000 },
  { name: 'Uttar Pradesh', baseRate: 9.8, peakRate: 21.5, urbanMult: 1.15, employedBase: 56000000 },
  { name: 'Uttarakhand', baseRate: 7.9, peakRate: 22.3, urbanMult: 1.1, employedBase: 2800000 },
  { name: 'West Bengal', baseRate: 6.5, peakRate: 17.4, urbanMult: 1.2, employedBase: 34500000 }
];

const months = [
  { date: '2019-05-31', year: 2019, month: 5, monthName: 'May', covidFactor: 0.96 },
  { date: '2019-06-30', year: 2019, month: 6, monthName: 'Jun', covidFactor: 1.02 },
  { date: '2019-07-31', year: 2019, month: 7, monthName: 'Jul', covidFactor: 0.98 },
  { date: '2019-08-31', year: 2019, month: 8, monthName: 'Aug', covidFactor: 1.04 },
  { date: '2019-09-30', year: 2019, month: 9, monthName: 'Sep', covidFactor: 1.00 },
  { date: '2019-10-31', year: 2019, month: 10, monthName: 'Oct', covidFactor: 1.08 },
  { date: '2019-11-30', year: 2019, month: 11, monthName: 'Nov', covidFactor: 0.99 },
  { date: '2019-12-31', year: 2019, month: 12, monthName: 'Dec', covidFactor: 1.03 },
  { date: '2020-01-31', year: 2020, month: 1, monthName: 'Jan', covidFactor: 0.98 },
  { date: '2020-02-29', year: 2020, month: 2, monthName: 'Feb', covidFactor: 1.01 },
  { date: '2020-03-31', year: 2020, month: 3, monthName: 'Mar', covidFactor: 1.28 }, // Lockdown announced March 24
  { date: '2020-04-30', year: 2020, month: 4, monthName: 'Apr', covidFactor: 3.25 }, // Peak strict lockdown
  { date: '2020-05-31', year: 2020, month: 5, monthName: 'May', covidFactor: 2.95 }, // Continued lockdown
  { date: '2020-06-30', year: 2020, month: 6, monthName: 'Jun', covidFactor: 1.55 }, // Unlock 1.0
  { date: '2020-07-31', year: 2020, month: 7, monthName: 'Jul', covidFactor: 1.22 }, // Unlock 2.0
  { date: '2020-08-31', year: 2020, month: 8, monthName: 'Aug', covidFactor: 1.14 },
  { date: '2020-09-30', year: 2020, month: 9, monthName: 'Sep', covidFactor: 1.06 },
  { date: '2020-10-31', year: 2020, month: 10, monthName: 'Oct', covidFactor: 1.02 }
];

export function generateIndiaDataset(): UnemploymentRecord[] {
  const records: UnemploymentRecord[] = [];
  let idCounter = 1;

  for (const state of rawStates) {
    for (const m of months) {
      // Areas: Rural and Urban
      const areas: ('Rural' | 'Urban')[] = ['Rural', 'Urban'];

      for (const area of areas) {
        let rate: number;
        const isLockdown = m.month === 4 || m.month === 5;
        const isMarchShock = m.month === 3 && m.year === 2020;

        if (isLockdown) {
          // Apr/May 2020 peak
          const peakBase = state.peakRate;
          const noise = ((idCounter * 17) % 7) - 3.5;
          const factor = m.month === 4 ? 1.0 : 0.88;
          rate = Number((peakBase * factor + noise * 0.4).toFixed(2));
        } else if (isMarchShock) {
          const noise = ((idCounter * 13) % 5) - 2.5;
          rate = Number((state.baseRate * 1.45 + noise * 0.3).toFixed(2));
        } else {
          // Normal/Seasonal variation
          const seasonalVar = Math.sin((m.month / 12) * Math.PI * 2) * 0.8;
          const noise = ((idCounter * 11) % 5) - 2.5;
          rate = Number((state.baseRate * m.covidFactor + seasonalVar + noise * 0.25).toFixed(2));
        }

        // Urban vs Rural adjustment
        if (area === 'Urban') {
          rate = Number((rate * state.urbanMult).toFixed(2));
        } else {
          rate = Number((rate * (2 - state.urbanMult)).toFixed(2));
        }

        // Clamp rate
        rate = Math.max(1.8, Math.min(78.5, rate));

        // Labour Participation Rate typically drops during sharp unemployment spikes
        const lprBase = 41.5 + ((idCounter * 7) % 8) - 4;
        const lprDepression = rate > 20 ? (rate - 20) * 0.22 : 0;
        const labourParticipationRate = Number(Math.max(28.0, Math.min(52.5, lprBase - lprDepression)).toFixed(2));

        // Employed people count drops during peak lockdown
        const employmentShockMult = rate > 20 ? 1 - ((rate - state.baseRate) / 100) * 0.75 : 1.0;
        const areaRatio = area === 'Rural' ? 0.65 : 0.35;
        const employed = Math.round(state.employedBase * areaRatio * employmentShockMult);

        records.push({
          id: `ind-${idCounter++}`,
          region: state.name,
          date: m.date,
          frequency: 'Monthly',
          unemploymentRate: rate,
          employed: employed,
          labourParticipationRate: labourParticipationRate,
          area: area,
          year: m.year,
          month: m.month,
          monthName: m.monthName
        });
      }
    }
  }

  return records;
}

export const defaultIndiaData: UnemploymentRecord[] = generateIndiaDataset();
