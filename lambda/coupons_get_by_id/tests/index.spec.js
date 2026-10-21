const { marshall } = require('@aws-sdk/util-dynamodb');
const { createHandler } = require('../index.js');
const expectedCoupon = require('../../../samples/t2_coupons_get_by_id_response.json');

describe('Coupon get by id', () => {
  test('returns the coupon identified by pathParameters.id', async () => {
    const client = { send: jest.fn().mockResolvedValue({ Item: marshall(expectedCoupon) }) };
    const handler = createHandler(client);

    const result = await handler({
      pathParameters: { id: expectedCoupon.coupon_id }
    });

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toStrictEqual(expectedCoupon);
    expect(client.send.mock.calls[0][0].input).toMatchObject({
      TableName: 'coupons',
      Key: { coupon_id: { S: expectedCoupon.coupon_id } },
      ConsistentRead: false
    });
  });

  test('returns 400 when id is missing', async () => {
    const client = { send: jest.fn() };
    const result = await createHandler(client)({ pathParameters: {} });

    expect(result.statusCode).toBe(400);
    expect(client.send).not.toHaveBeenCalled();
  });

  test('returns 404 when the coupon does not exist', async () => {
    const client = { send: jest.fn().mockResolvedValue({}) };
    const result = await createHandler(client)({ pathParameters: { id: 'missing' } });

    expect(result.statusCode).toBe(404);
  });
});
