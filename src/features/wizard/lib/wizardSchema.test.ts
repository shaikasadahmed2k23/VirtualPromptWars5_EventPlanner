import {
  detailsStepSchema,
  firstInvalidStep,
  guestsBudgetStepSchema,
  toDraftPatch,
  toNewEventInput,
  typeStepSchema,
  type WizardValues,
} from './wizardSchema';

const VALID: WizardValues = {
  type: 'anniversary',
  name: 'Ruby anniversary',
  date: '2030-06-01',
  startTime: '19:30',
  city: 'Pune',
  venue: '',
  guestCount: 60,
  budget: 300_000,
  currency: 'INR',
  style: 'garden',
  dietary: ['vegetarian'],
  accessibility: '',
  cultural: '',
  notes: '',
};

describe('wizard step schemas', () => {
  it('requires an event type with a friendly message', () => {
    const result = typeStepSchema.safeParse({});
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Choose the kind of celebration you are planning');
  });

  it('rejects past dates and malformed times', () => {
    const result = detailsStepSchema.safeParse({ ...VALID, date: '2001-01-01', startTime: '25:00' });
    const messages = result.error?.issues.map((issue) => issue.message);
    expect(messages).toEqual(expect.arrayContaining(['Choose a date from today onwards', 'Choose a start time']));
  });

  it('explains empty or out-of-range numbers', () => {
    const result = guestsBudgetStepSchema.safeParse({ guestCount: Number.NaN, budget: 0, currency: 'INR' });
    const messages = result.error?.issues.map((issue) => issue.message);
    expect(messages).toContain('Enter the guest count');
    expect(messages?.some((message) => message.startsWith('The total budget must be at least'))).toBe(true);
  });

  it('trims text input', () => {
    expect(detailsStepSchema.parse({ ...VALID, name: '  Ruby anniversary  ' }).name).toBe('Ruby anniversary');
  });
});

describe('firstInvalidStep', () => {
  it('returns null for a complete draft', () => {
    expect(firstInvalidStep(VALID)).toBeNull();
  });

  it('points at the first step needing attention', () => {
    expect(firstInvalidStep({})).toBe(0);
    expect(firstInvalidStep({ ...VALID, budget: undefined })).toBe(2);
  });
});

describe('draft helpers', () => {
  it('drops unset values and NaN from emptied number inputs', () => {
    expect(toDraftPatch({ name: 'A', guestCount: Number.NaN, venue: undefined, budget: 5 })).toEqual({
      name: 'A',
      budget: 5,
    });
  });

  it('maps wizard answers onto the event model', () => {
    const input = toNewEventInput(VALID);
    expect(input.requirements).toEqual({ dietary: ['vegetarian'], accessibility: '', cultural: '', notes: '' });
    expect(input).not.toHaveProperty('dietary');
    expect(input.style).toBe('garden');
  });
});
