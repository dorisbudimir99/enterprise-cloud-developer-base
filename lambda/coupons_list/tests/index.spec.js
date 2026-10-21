const { handler } = require('../index.js');
const expectedCoupons = require('../../../samples/t1_sample_coupons_list_response.json');

describe('Coupon list', () => {
  test('returns the supplied coupon list as an API Gateway response', async () => {
    const response = await handler({}, null);
    const responseParsed = JSON.parse(response.body);

    expect(response.statusCode).toBe(200);
    expect(response.headers['Content-Type']).toBe('application/json');
    expect(responseParsed).toStrictEqual(expectedCoupons);
  });
});
