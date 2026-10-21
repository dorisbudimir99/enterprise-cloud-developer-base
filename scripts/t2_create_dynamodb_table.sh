#!/bin/bash

set -e

echo "Creating coupons DynamoDB table"
awslocal dynamodb create-table \
  --table-name "coupons" \
  --attribute-definitions AttributeName=coupon_id,AttributeType=S \
  --key-schema AttributeName=coupon_id,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=25,WriteCapacityUnits=10

awslocal dynamodb wait table-exists --table-name "coupons"

echo "Adding sample coupons"
awslocal dynamodb batch-write-item \
  --request-items file://scripts/t2_seed_coupons.json

echo "coupons table created with 25 RCUs and 10 WCUs"

