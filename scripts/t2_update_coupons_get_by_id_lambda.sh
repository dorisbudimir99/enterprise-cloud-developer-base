#!/bin/bash

set -e

PROJECT_DIR=$(pwd)
BUILD_DIR="./build/coupons_get_by_id"

rm -rf "${BUILD_DIR}"
mkdir -p "${BUILD_DIR}"
cp ./lambda/coupons_get_by_id/index.js ./lambda/coupons_get_by_id/package.json ./lambda/coupons_get_by_id/package-lock.json "${BUILD_DIR}/"
npm install --omit=dev --prefix "${BUILD_DIR}"

rm -f "${PROJECT_DIR}/coupons_get_by_id.zip"
cd "${BUILD_DIR}"
zip -rq "${PROJECT_DIR}/coupons_get_by_id.zip" .
cd "${PROJECT_DIR}"

awslocal lambda update-function-code \
  --function-name "coupons_get_by_id" \
  --zip-file fileb://coupons_get_by_id.zip
awslocal lambda wait function-updated-v2 --function-name "coupons_get_by_id"

awslocal lambda update-function-configuration \
  --function-name "coupons_get_by_id" \
  --role "arn:aws:iam::000000000000:role/coupons_lambda_role" \
  --timeout 10 \
  --environment "Variables={TABLE_NAME=coupons,DYNAMODB_ENDPOINT=http://localhost.localstack.cloud:4566}"
awslocal lambda wait function-updated-v2 --function-name "coupons_get_by_id"

echo "coupons_get_by_id updated successfully"

