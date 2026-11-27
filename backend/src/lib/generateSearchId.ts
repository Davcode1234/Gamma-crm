import { CounterModel } from '../Counter/Counter.model';

// MK = marketing order, KM = marketing campaign.
export type SearchIdPrefix = 'MK' | 'KM';

// ST = studio tasks and reckoning tasks. They share one counter, because a
// reckoning task added from the kanban takes the number of its studio task.
export type NumericSearchIdPrefix = 'ST';

// Numeric ids have 5 digits for the counter, so at most 99999 per month.
const MAX_NUMERIC_SEQ = 99999;

// "2611" for November 2026, in Polish time, so an order created
// just after midnight on the 1st already gets the new month.
const getYearMonth = (date: Date) => {
  const parts = new Intl.DateTimeFormat('pl-PL', {
    timeZone: 'Europe/Warsaw',
    year: '2-digit',
    month: '2-digit',
  }).formatToParts(date);

  const year = parts.find((part) => part.type === 'year').value;
  const month = parts.find((part) => part.type === 'month').value;
  return `${year}${month}`;
};

// Atomically adds 1 to the counter and returns the new value.
// $inc on a single document is atomic, so two requests at the same moment
// always get different values. upsert creates the counter on its first use.
const nextSeq = async (counterName: string) => {
  const counter = await CounterModel.findOneAndUpdate(
    { _id: counterName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  )
    .lean()
    .exec();

  return counter.seq;
};

// Returns the next number for the prefix in the current month,
// e.g. "MK-2611-0001", "MK-2611-0002"...; the counter restarts every month.
export async function generateSearchId(
  prefix: SearchIdPrefix,
  date: Date = new Date(),
): Promise<string> {
  const counterName = `${prefix}-${getYearMonth(date)}`;
  const seq = await nextSeq(counterName);

  return `${counterName}-${String(seq).padStart(4, '0')}`;
}

// Numeric version for studio and reckoning tasks, where searchID is a Number:
// year + month + 5-digit counter, e.g. 261100001, 261100002...
//
// Old ids were year + month + 4 random digits (8 digits, e.g. 26114821).
// New ids always have 9 digits, so they can never repeat an old one.
export async function generateNumericSearchId(
  prefix: NumericSearchIdPrefix,
  date: Date = new Date(),
): Promise<number> {
  const yearMonth = getYearMonth(date);
  const seq = await nextSeq(`${prefix}-${yearMonth}`);

  // A 6-digit counter would run into the next month's numbers.
  if (seq > MAX_NUMERIC_SEQ) {
    throw new Error(`Search ID counter ${prefix}-${yearMonth} is full`);
  }

  return Number(`${yearMonth}${String(seq).padStart(5, '0')}`);
}
