#!/bin/bash

set -e

echo "Creating coupons_lambda_role"
awslocal iam create-role \
  --role-name "coupons_lambda_role" \
  --assume-role-policy-document file://scripts/coupons_lambda_role_assume_role_policy.json

echo "Adding restricted CloudWatch and DynamoDB permissions"
awslocal iam put-role-policy \
  --role-name "coupons_lambda_role" \
  --policy-name "CouponsLambdaPolicy" \
  --policy-document file://scripts/coupons_lambda_role_policy.json

echo "coupons_lambda_role created successfully"

