import { computeImpactEstimations } from './utils';

const covid19ImpactEstimator = (data) => {
  const impact = computeImpactEstimations(data, 'normal');
  const severeImpact = computeImpactEstimations(data, 'severe');

  return {
    data,
    impact,
    severeImpact
  };
};

export default covid19ImpactEstimator;
