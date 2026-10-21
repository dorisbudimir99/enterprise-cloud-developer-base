const { DynamoDBClient, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');

const response = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
});

const createClient = () => new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  endpoint: process.env.DYNAMODB_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test'
  }
});

const createHandler = (client = createClient()) => async (event = {}) => {
  const id = event.pathParameters && event.pathParameters.id;
  if (!id) {
    return response(400, { message: 'Path parameter id is required' });
  }

  try {
    const result = await client.send(new GetItemCommand({
      TableName: process.env.TABLE_NAME || 'coupons',
      Key: { coupon_id: { S: id } },
      ConsistentRead: false
    }));

    if (!result.Item) {
      return response(404, { message: `Coupon ${id} was not found` });
    }

    return response(200, unmarshall(result.Item));
  } catch (error) {
    console.error('Unable to retrieve coupon', error);
    return response(500, { message: 'Unable to retrieve coupon' });
  }
};

exports.createHandler = createHandler;
exports.handler = createHandler();
