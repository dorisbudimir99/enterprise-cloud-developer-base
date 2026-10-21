const { DynamoDBClient, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

const allowedFields = [
  'title',
  'description',
  'coupon_code',
  'campaign_id',
  'provider_id',
  'provider_name',
  'start_date',
  'end_date'
];

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

  let requestBody;
  try {
    requestBody = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
  } catch (error) {
    return response(400, { message: 'Request body must be valid JSON' });
  }

  const updates = Object.entries(requestBody || {})
    .filter(([key, value]) => allowedFields.includes(key) && value !== undefined);
  if (updates.length === 0) {
    return response(400, { message: 'At least one coupon field must be provided' });
  }

  const expressionAttributeNames = {};
  const expressionAttributeValues = {};
  const assignments = updates.map(([key, value], index) => {
    const name = `#field${index}`;
    const valueName = `:value${index}`;
    expressionAttributeNames[name] = key;
    expressionAttributeValues[valueName] = marshall({ value }).value;
    return `${name} = ${valueName}`;
  });

  try {
    const result = await client.send(new UpdateItemCommand({
      TableName: process.env.TABLE_NAME || 'coupons',
      Key: { coupon_id: { S: id } },
      UpdateExpression: `SET ${assignments.join(', ')}`,
      ConditionExpression: 'attribute_exists(coupon_id)',
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    }));

    return response(200, unmarshall(result.Attributes));
  } catch (error) {
    if (error.name === 'ConditionalCheckFailedException') {
      return response(404, { message: `Coupon ${id} was not found` });
    }
    console.error('Unable to update coupon', error);
    return response(500, { message: 'Unable to update coupon' });
  }
};

exports.createHandler = createHandler;
exports.handler = createHandler();
