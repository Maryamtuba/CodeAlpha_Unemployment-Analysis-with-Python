import { UnemploymentRecord } from '../types';

const usStates = [
  { name: 'California', base: 4.0, peak: 16.4, employed: 17500000 },
  { name: 'New York', base: 3.9, peak: 16.2, employed: 9100000 },
  { name: 'Texas', base: 3.6, peak: 12.9, employed: 13200000 },
  { name: 'Florida', base: 3.3, peak: 14.2, employed: 9800000 },
  { name: 'Illinois', base: 4.1, peak: 17.4, employed: 6000000 },
  { name: 'Nevada', base: 3.8, peak: 29.5, employed: 1380000 }, // Heavily impacted by hospitality closures
  { name: 'Hawaii', base: 2.7, peak: 23.4, employed: 590000 }, // Tourism shutdown
  { name: 'Michigan', base: 4.1, peak: 23.6, employed: 4400000 }, // Auto manufacturing halt
  { name: 'Washington', base: 4.3, peak: 16.3, employed: 3600000 },
  { name: 'Georgia', base: 3.5, peak: 12.6, employed: 4800000 },
  { name: 'Ohio', base: 4.2, peak: 17.3, employed: 5300000 },
  { name: 'Pennsylvania', base: 4.5, peak: 16.5, employed: 6000000 },
  { name: 'Massachusetts', base: 2.9, peak: 17.1, employed: 3500000 },
  { name: 'Utah', base: 2.6, peak: 10.1, employed: 1550000 }, // Resilient tech/services
  { name: 'Nebraska', base: 3.1, peak: 8.7, employed: 990000 }
];

const usMonths = [
  { date: '2019-01-31', year: 2019, month: 1, monthName: 'Jan', mult: 1.0 },
  { date: '2019-04-30', year: 2019, month: 4, monthName: 'Apr', mult: 0.96 },
  { date: '2019-07-31', year: 2019, month: 7, monthName: 'Jul', mult: 0.98 },
  { date: '2019-10-31', year: 2019, month: 10, monthName: 'Oct', mult: 0.95 },
  { date: '2020-01-31', year: 2020, month: 1, monthName: 'Jan', mult: 0.97 },
  { date: '2020-02-29', year: 2020, month: 2, monthName: 'Feb', mult: 0.95 },
  { date: '2020-03-31', year: 2020, month: 3, monthName: 'Mar', mult: 1.25 },
  { date: '2020-04-30', year: 2020, month: 4, monthName: 'Apr', mult: 4.2 }, // BLS US Leap to 14.7%
  { date: '2020-05-31', year: 2020, month: 5, monthName: 'May', mult: 3.8 },
  { date: '2020-06-30', year: 2020, month: 6, monthName: 'Jun', mult: 3.1 },
  { date: '2020-08-31', year: 2020, month: 8, monthName: 'Aug', mult: 2.4 },
  { date: '2020-10-31', year: 2020, month: 10, monthName: 'Oct', mult: 1.9 },
  { date: '2020-12-31', year: 2020, month: 12, monthName: 'Dec', mult: 1.8 }
];

export function generateUSDataset(): UnemploymentRecord[] {
  const records: UnemploymentRecord[] = [];
  let id = 1;

  for (const st of usStates) {
    for (const m of usMonths) {
      const isPeak = m.month === 4 || m.month === 5;
      let rate: number;
      if (isPeak) {
        rate = Number((st.peak * (m.month === 4 ? 1.0 : 0.88)).toFixed(2));
      } else {
        rate = Number((st.base * m.mult).toFixed(2));
      }

      const lpr = Number((62.5 - (rate > 10 ? (rate - 10) * 0.35 : 0)).toFixed(2));
      const employed = Math.round(st.employed * (1 - (rate - st.base) / 100));

      records.push({
        id: `us-${id++}`,
        region: st.name,
        date: m.date,
        frequency: 'Monthly',
        unemploymentRate: rate,
        employed: employed,
        labourParticipationRate: lpr,
        area: 'National',
        year: m.year,
        month: m.month,
        monthName: m.monthName
      });
    }
  }

  return records;
}
