#!/bin/bash

set -e

PROJECT_DIR=$(pwd)

echo "Creating coupons_list deployment package"
cd ./lambda/coupons_list
zip -jq "${PROJECT_DIR}/coupons_list.zip" index.js
cd "${PROJECT_DIR}"

echo "Creating coupons_list Lambda function"
awslocal lambda create-function \
  --function-name "coupons_list" \
  --runtime "nodejs22.x" \
  --zip-file fileb://coupons_list.zip \
  --handler "index.handler" \
  --role "arn:aws:iam::000000000000:role/coupons_lambda_role" \
  --timeout 10

awslocal lambda wait function-active-v2 --function-name "coupons_list"
echo "coupons_list created successfully"

