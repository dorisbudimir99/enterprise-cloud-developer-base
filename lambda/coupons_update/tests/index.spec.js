const { marshall } = require('@aws-sdk/util-dynamodb');
const { createHandler } = require('../index.js');
const originalCoupon = require('../../../samples/t2_coupons_get_by_id_response.json');

describe('Coupon update', () => {
  test('updates allowed fields for pathParameters.id', async () => {
    const updatedCoupon = { ...originalCoupon, title: 'Updated hotel offer' };
    const client = {
      send: jest.fn().mockResolvedValue({ Attributes: marshall(updatedCoupon) })
    };
    const handler = createHandler(client);

    const result = await handler({
      pathParameters: { id: originalCoupon.coupon_id },
      body: JSON.stringify({ title: updatedCoupon.title })
    });

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toStrictEqual(updatedCoupon);
    expect(client.send.mock.calls[0][0].input).toMatchObject({
      TableName: 'coupons',
      Key: { coupon_id: { S: originalCoupon.coupon_id } },
      ReturnValues: 'ALL_NEW'
    });
  });

  test('returns 400 for invalid JSON', async () => {
    const client = { send: jest.fn() };
    const result = await createHandler(client)({
      pathParameters: { id: originalCoupon.coupon_id },
      body: '{invalid'
    });

    expect(result.statusCode).toBe(400);
    expect(client.send).not.toHaveBeenCalled();
  });

  test('returns 404 when the coupon does not exist', async () => {
    const error = new Error('missing');
    error.name = 'ConditionalCheckFailedException';
    const client = { send: jest.fn().mockRejectedValue(error) };
    const result = await createHandler(client)({
      pathParameters: { id: 'missing' },
      body: JSON.stringify({ title: 'Updated' })
    });

    expect(result.statusCode).toBe(404);
  });
});
