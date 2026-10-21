# Enterprise Cloud Developer Assessments

This fork contains the completed assessment tasks running against LocalStack.

## Assessment Part 1

Part 1 provisions:

- the `coupons_lambda_role` IAM role with CloudWatch permissions restricted to `/aws/lambda/coupons*` and DynamoDB permissions restricted to the `coupons` table;
- the `coupons_list` Lambda function;
- the `GET /coupons_poc` API Gateway endpoint;
- a Jest unit test and Newman endpoint test.

The Lambda response matches `samples/t1_sample_coupons_list_response.json`. See `Command.txt` for the PowerShell and WSL commands used to bootstrap, provision, and test the project.
