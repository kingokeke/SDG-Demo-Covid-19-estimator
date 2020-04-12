// Normalize the time period to days
const computeNumberOfDays = (period, number) => {
  if (period.toLowerCase().includes('month')) {
    return number * 30;
  }
  if (period.toLowerCase().includes('week')) {
    return number * 7;
  }
  return number;
};

// Compute the factor by which infections have doubled over the given timeframe
const getInfectionFactor = (timeFrame, number, interval) => {
  const numberOfDays = computeNumberOfDays(timeFrame, number);
  return 2 ** Math.trunc(numberOfDays / interval);
};

// Compute impact estimation for both normal and severe outlooks
const computeImpactEstimations = (data, type) => {
  const CURRENT_DOUBLING_RATE = 3; // Total no of infections doubles every 3 days
  const FRACTION_OF_SEVERE_CASES = 0.15; // 15 percent
  const FRACTION_OF_BEDS_AVAILABLE = 0.35; // 35 percent
  const FRACTION_OF_ICU_PATIENTS = 0.05; // 5 percent
  const FRACTION_OF_VENTILATOR_PATIENTS = 0.02; // 2 percent
  const INFECTION_TYPE_MULTIPLIER = type === 'severe' ? 50 : 10; // Multiplier for normal and severe cases

  const {
    reportedCases,
    periodType,
    timeToElapse,
    totalHospitalBeds,
    region: { avgDailyIncomeInUSD, avgDailyIncomePopulation }
  } = data;

  const currentlyInfected = reportedCases * INFECTION_TYPE_MULTIPLIER;

  const infectionFactor = getInfectionFactor(
    periodType,
    timeToElapse,
    CURRENT_DOUBLING_RATE
  );

  const infectionsByRequestedTime = Math.trunc(
    currentlyInfected * infectionFactor
  );

  const severeCasesByRequestedTime = Math.trunc(
    infectionsByRequestedTime * FRACTION_OF_SEVERE_CASES
  );

  const availableBeds = Math.trunc(
    totalHospitalBeds * FRACTION_OF_BEDS_AVAILABLE
  );

  const hospitalBedsByRequestedTime = availableBeds - severeCasesByRequestedTime;

  const casesForICUByRequestedTime = Math.trunc(
    infectionsByRequestedTime * FRACTION_OF_ICU_PATIENTS
  );

  const casesForVentilatorsByRequestedTime = Math.trunc(
    infectionsByRequestedTime * FRACTION_OF_VENTILATOR_PATIENTS
  );

  const requestedTime = computeNumberOfDays(periodType, timeToElapse);

  const dollarsInFlight = Math.trunc(
    (infectionsByRequestedTime
      * avgDailyIncomeInUSD
      * avgDailyIncomePopulation)
      / requestedTime
  );

  return {
    currentlyInfected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime,
    hospitalBedsByRequestedTime,
    casesForICUByRequestedTime,
    casesForVentilatorsByRequestedTime,
    dollarsInFlight
  };
};

export { getInfectionFactor, computeImpactEstimations };
