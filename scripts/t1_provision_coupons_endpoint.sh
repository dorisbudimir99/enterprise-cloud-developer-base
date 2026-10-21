#!/bin/bash

set -e

REGION="us-east-1"
STAGE="local"
API_NAME="coupons"

API_ID=$(awslocal apigateway get-rest-apis \
  --region "${REGION}" \
  --query "items[?name==\`${API_NAME}\`].id" \
  --output text)

ROOT_RESOURCE_ID=$(awslocal apigateway get-resources \
  --region "${REGION}" \
  --rest-api-id "${API_ID}" \
  --query 'items[?path==`/`].id' \
  --output text)

COUPONS_POC_RESOURCE_ID=$(awslocal apigateway create-resource \
  --region "${REGION}" \
  --rest-api-id "${API_ID}" \
  --parent-id "${ROOT_RESOURCE_ID}" \
  --path-part "coupons_poc" \
  --query id \
  --output text)

awslocal apigateway put-method \
  --region "${REGION}" \
  --rest-api-id "${API_ID}" \
  --resource-id "${COUPONS_POC_RESOURCE_ID}" \
  --http-method GET \
  --authorization-type NONE

LAMBDA_ARN="arn:aws:lambda:${REGION}:000000000000:function:coupons_list"
INTEGRATION_URI="arn:aws:apigateway:${REGION}:lambda:path/2015-03-31/functions/${LAMBDA_ARN}/invocations"

awslocal apigateway put-integration \
  --region "${REGION}" \
  --rest-api-id "${API_ID}" \
  --resource-id "${COUPONS_POC_RESOURCE_ID}" \
  --http-method GET \
  --type AWS_PROXY \
  --integration-http-method POST \
  --uri "${INTEGRATION_URI}"

awslocal lambda add-permission \
  --function-name "coupons_list" \
  --statement-id "apigateway-coupons-list-get" \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:${REGION}:000000000000:${API_ID}/*/GET/coupons_poc"

awslocal apigateway create-deployment \
  --region "${REGION}" \
  --rest-api-id "${API_ID}" \
  --stage-name "${STAGE}"

echo "API_ID=${API_ID}"
echo "Coupons endpoint: http://localhost:4566/_aws/execute-api/${API_ID}/${STAGE}/coupons_poc"

