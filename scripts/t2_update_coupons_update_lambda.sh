#!/bin/bash

set -e

PROJECT_DIR=$(pwd)
BUILD_DIR="./build/coupons_update"

rm -rf "${BUILD_DIR}"
mkdir -p "${BUILD_DIR}"
cp ./lambda/coupons_update/index.js ./lambda/coupons_update/package.json ./lambda/coupons_update/package-lock.json "${BUILD_DIR}/"
npm install --omit=dev --prefix "${BUILD_DIR}"

rm -f "${PROJECT_DIR}/coupons_update.zip"
cd "${BUILD_DIR}"
zip -rq "${PROJECT_DIR}/coupons_update.zip" .
cd "${PROJECT_DIR}"

awslocal lambda update-function-code \
  --function-name "coupons_update" \
  --zip-file fileb://coupons_update.zip
awslocal lambda wait function-updated-v2 --function-name "coupons_update"

awslocal lambda update-function-configuration \
  --function-name "coupons_update" \
  --role "arn:aws:iam::000000000000:role/coupons_lambda_role" \
  --timeout 10 \
  --environment "Variables={TABLE_NAME=coupons,DYNAMODB_ENDPOINT=http://localhost.localstack.cloud:4566}"
awslocal lambda wait function-updated-v2 --function-name "coupons_update"

echo "coupons_update updated successfully"

