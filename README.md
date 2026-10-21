# Enterprise Cloud Developer Assessments

This fork contains the completed assessment tasks running against LocalStack.

## Assessment Part 1

Part 1 provisions:

- the `coupons_lambda_role` IAM role with CloudWatch permissions restricted to `/aws/lambda/coupons*` and DynamoDB permissions restricted to the `coupons` table;
- the `coupons_list` Lambda function;
- the `GET /coupons_poc` API Gateway endpoint;
- a Jest unit test and Newman endpoint test.

The Lambda response matches `samples/t1_sample_coupons_list_response.json`. See `Command.txt` for the PowerShell and WSL commands used to bootstrap, provision, and test the project.

## Assessment Part 2

Part 2 provisions:

- the `coupons` DynamoDB table with 25 read capacity units for 50 eventually consistent 1 KB reads per second and 10 write capacity units;
- three sample coupons using `coupon_id` as the partition key;
- `coupons_get_by_id`, which retrieves the coupon identified by `pathParameters.id`;
- `coupons_update`, which updates allowed coupon fields using `pathParameters.id`;
- the `provider_id-campaign_id-index` global secondary index.

The repository includes unit-test JSON, API output, table-description output, and index-query output for Part 2.
