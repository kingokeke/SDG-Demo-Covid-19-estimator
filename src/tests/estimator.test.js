const covid19ImpactEstimator = require('../estimator').default;
const testData = require('../demoData').default;
let data = null;

beforeEach(() => {
  data = testData;
});

afterEach(() => {
  data = null;
});

test('Region name should remain unchanged', () => {
  const result = covid19ImpactEstimator(data);
  expect(result.region.name).toEqual('Africa');
});
