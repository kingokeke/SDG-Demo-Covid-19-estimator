// Compute the factor by which infections have doubled over the given timeframe
const getInfectionFactor = (timeFrame, number, interval) => {
  const numberOfDays = computeNumberOfDays(timeFrame, number);
  return Math.pow(2, Math.trunc(numberOfDays / interval));
};

// Normalize the time period to days
const computeNumberOfDays = (period, number) => {
  if (period.toLowerCase().includes('month')) {
    return number * 30;
  }
  if (period.toLowerCase().includes('week')) {
    return number * 7;
  }
  return result;
};

// Compute impact estimation for both normal and severe outlooks
const computeImpactEstimations = (data, type) => {
  const CURRENTLY_INFECTED_MULTIPLIER = type === 'severe' ? 50 : 10;
  const CURRENT_DOUBLING_RATE = 3;

  const { reportedCases, periodType, timeToElapse } = data;

  const currentlyInfected = reportedCases * CURRENTLY_INFECTED_MULTIPLIER;
  const infectionFactor = getInfectionFactor(
    periodType,
    timeToElapse,
    CURRENT_DOUBLING_RATE
  );
  const infectionsByRequestedTime = currentlyInfected * infectionFactor;

  return {
    currentlyInfected,
    infectionsByRequestedTime
  };
};

export { getInfectionFactor, computeImpactEstimations };
