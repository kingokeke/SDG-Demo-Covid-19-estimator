const covid19ImpactEstimator = require('../estimator').default;
let demoData;

beforeEach(() => {
  demoData = require('../demoData').default;
});

afterEach(() => {
  demoData = null;
});

// NOTE: Validation and edge cases were not programmed into the function. Therefore, they are not being tested for in these tests.

// Test for currently infected people under normal impact estimates
test('Number of currently infected people under normal impact estimates should be 10 times the number of reported cases', () => {
  demoData.reportedCases = 948;
  const result = covid19ImpactEstimator(demoData);
  expect(result.impact.currentlyInfected).toEqual(9480);
});

// Test for currently infected people under severe impact estimates
test('Number of currently infected people under severe impact estimates should be 50 times the number of reported cases', () => {
  demoData.reportedCases = 4789;
  const result = covid19ImpactEstimator(demoData);
  expect(result.severeImpact.currentlyInfected).toEqual(239450);
});

// Test for number of infections when period type is given in month(s)
test('Number of infections by requested time should double by an exponential factor of 10 in a month (30 days)', () => {
  demoData.periodType = 'months';
  demoData.timeToElapse = 1;
  demoData.reportedCases = 300;
  const result = covid19ImpactEstimator(demoData);
  expect(result.impact.infectionsByRequestedTime).toEqual(3072000);
  expect(result.severeImpact.infectionsByRequestedTime).toEqual(15360000);
});

// Test for number of infections when period type is given in week(s)
test('Number of infections by requested time should double by an exponential factor of 2 in a week (7 days)', () => {
  demoData.periodType = 'weeks';
  demoData.timeToElapse = 1;
  demoData.reportedCases = 549;
  const result = covid19ImpactEstimator(demoData);
  expect(result.impact.infectionsByRequestedTime).toEqual(21960);
  expect(result.severeImpact.infectionsByRequestedTime).toEqual(109800);
});

// Test for number of infections when period type is given in day(s)
test('Number of infections by requested time should double by an exponential factor of 6 in 20 days', () => {
  demoData.periodType = 'days';
  demoData.timeToElapse = 20;
  demoData.reportedCases = 180;
  const result = covid19ImpactEstimator(demoData);
  expect(result.impact.infectionsByRequestedTime).toEqual(115200);
  expect(result.severeImpact.infectionsByRequestedTime).toEqual(576000);
});

// Test for number of severe cases at request time
test('Number of severe cases by request time should be 15% of number of infections by request time', () => {
  demoData.periodType = 'month';
  demoData.timeToElapse = 1;
  demoData.reportedCases = 747;
  const result = covid19ImpactEstimator(demoData);
  expect(result.impact.severeCasesByRequestedTime).toEqual(1147392);
  expect(result.impact.severeCasesByRequestedTime).toEqual(
    Math.trunc(0.15 * result.impact.infectionsByRequestedTime)
  );
  expect(result.severeImpact.severeCasesByRequestedTime).toEqual(5736960);
  expect(result.severeImpact.severeCasesByRequestedTime).toEqual(
    Math.trunc(0.15 * result.severeImpact.infectionsByRequestedTime)
  );
});

// Test for number of available hospital beds at request time
test('Number of hospital beds by request time should be the number of available hospital beds minus the number of severe cases', () => {
  demoData.periodType = 'weeks';
  demoData.timeToElapse = 3;
  demoData.reportedCases = 419;
  const result = covid19ImpactEstimator(demoData);
  expect(result.impact.hospitalBedsByRequestedTime).toEqual(402766);
  expect(result.impact.hospitalBedsByRequestedTime).toEqual(
    Math.trunc(
      result.data.totalHospitalBeds * 0.35 -
        result.impact.severeCasesByRequestedTime
    )
  );
  expect(result.severeImpact.hospitalBedsByRequestedTime).toEqual(80974);
  expect(result.severeImpact.hospitalBedsByRequestedTime).toEqual(
    Math.trunc(
      result.data.totalHospitalBeds * 0.35 -
        result.severeImpact.severeCasesByRequestedTime
    )
  );
});

// Test for number of ICU cases present at request time
test('Number of ICU cases by request time should be 5% of infections by request time', () => {
  demoData.periodType = 'days';
  demoData.timeToElapse = 49;
  demoData.reportedCases = 201;
  const result = covid19ImpactEstimator(demoData);
  expect(result.impact.casesForICUByRequestedTime).toEqual(6586368);
  expect(result.impact.casesForICUByRequestedTime).toEqual(
    Math.trunc(0.05 * result.impact.infectionsByRequestedTime)
  );
  expect(result.severeImpact.casesForICUByRequestedTime).toEqual(32931840);
  expect(result.impact.casesForICUByRequestedTime).toEqual(
    Math.trunc(0.05 * result.impact.infectionsByRequestedTime)
  );
});

// Test for number of cases needing a ventilator at request time
test('Number of cases needing ventilators by request time should be 2% of infections by request time', () => {
  demoData.periodType = 'weeks';
  demoData.timeToElapse = 2;
  demoData.reportedCases = 31;
  const result = covid19ImpactEstimator(demoData);
  expect(result.impact.casesForVentilatorsByRequestedTime).toEqual(99);
  expect(result.impact.casesForVentilatorsByRequestedTime).toEqual(
    Math.trunc(0.02 * result.impact.infectionsByRequestedTime)
  );
  expect(result.severeImpact.casesForVentilatorsByRequestedTime).toEqual(496);
  expect(result.impact.casesForVentilatorsByRequestedTime).toEqual(
    Math.trunc(0.02 * result.impact.infectionsByRequestedTime)
  );
});

// Test for the average daily dollar flight from the economy of the nation at request time
test('Average amount of money the economy is likely to lose on a daily basis, over the given period of time', () => {
  demoData.periodType = 'days';
  demoData.timeToElapse = 58;
  demoData.reportedCases = 674;
  const result = covid19ImpactEstimator(demoData);
  expect(result.impact.dollarsInFlight).toEqual(216286878);
  expect(result.impact.dollarsInFlight).toEqual(
    Math.trunc(
      (result.impact.infectionsByRequestedTime *
        demoData.region.avgDailyIncomeInUSD *
        demoData.region.avgDailyIncomePopulation) /
        demoData.timeToElapse
    )
  );
  expect(result.severeImpact.dollarsInFlight).toEqual(1081434394);
  expect(result.severeImpact.dollarsInFlight).toEqual(
    Math.trunc(
      (result.severeImpact.infectionsByRequestedTime *
        demoData.region.avgDailyIncomeInUSD *
        demoData.region.avgDailyIncomePopulation) /
        demoData.timeToElapse
    )
  );
});
