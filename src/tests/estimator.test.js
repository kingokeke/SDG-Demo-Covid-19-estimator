const covid19ImpactEstimator = require('../estimator').default;
let demoData;

beforeEach(() => {
  demoData = require('../demoData').default;
});

afterEach(() => {
  demoData = null;
});

// NOTE: Validation and edge cases were not programmed into the function. Therefore, they are not being tested for in these tests.

test('Number of currently infected people under normal impact estimates should be 10 times the number of reported cases', () => {
  demoData.reportedCases = 948;
  const result = covid19ImpactEstimator(demoData);
  expect(result.impact.currentlyInfected).toEqual(9480);
});

test('Number of currently infected people under severe impact estimates should be 50 times the number of reported cases', () => {
  demoData.reportedCases = 4789;
  const result = covid19ImpactEstimator(demoData);
  expect(result.severeImpact.currentlyInfected).toEqual(239450);
});

test('Number of infections by requested time should double by an exponential factor of 10 in a month (30 days)', () => {
  demoData.periodType = 'months';
  demoData.timeToElapse = 1;
  demoData.reportedCases = 300;
  const result = covid19ImpactEstimator(demoData);
  expect(result.impact.infectionsByRequestedTime).toEqual(3072000);
  expect(result.severeImpact.infectionsByRequestedTime).toEqual(15360000);
});

test('Number of infections by requested time should double by an exponential factor of 2 in a week (7 days)', () => {
  demoData.periodType = 'weeks';
  demoData.timeToElapse = 1;
  demoData.reportedCases = 549;
  const result = covid19ImpactEstimator(demoData);
  expect(result.impact.infectionsByRequestedTime).toEqual(21960);
  expect(result.severeImpact.infectionsByRequestedTime).toEqual(109800);
});

test('Number of infections by requested time should double by an exponential factor of 6 in 20 days', () => {
  demoData.periodType = 'days';
  demoData.timeToElapse = 20;
  demoData.reportedCases = 180;
  const result = covid19ImpactEstimator(demoData);
  expect(result.impact.infectionsByRequestedTime).toEqual(115200);
  expect(result.severeImpact.infectionsByRequestedTime).toEqual(576000);
});
