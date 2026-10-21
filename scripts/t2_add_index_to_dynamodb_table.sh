#!/bin/bash

set -e

echo "Adding provider_id-campaign_id-index"
awslocal dynamodb update-table \
  --table-name "coupons" \
  --attribute-definitions \
    AttributeName=provider_id,AttributeType=S \
    AttributeName=campaign_id,AttributeType=S \
  --global-secondary-index-updates \
    '[{"Create":{"IndexName":"provider_id-campaign_id-index","KeySchema":[{"AttributeName":"provider_id","KeyType":"HASH"},{"AttributeName":"campaign_id","KeyType":"RANGE"}],"Projection":{"ProjectionType":"ALL"},"ProvisionedThroughput":{"ReadCapacityUnits":25,"WriteCapacityUnits":10}}}]'

awslocal dynamodb wait table-exists --table-name "coupons"
echo "provider_id-campaign_id-index added successfully"

