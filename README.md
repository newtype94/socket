# voiceChain backend

AWS serverless architecture

## AWS CLI commands

- install the [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)

```
sam package --template-file template.yaml --output-template-file packaged.yaml --s3-bucket voice-chain-socket

sam deploy --template-file packaged.yaml --stack-name voice-chain-socket --capabilities CAPABILITY_IAM

aws cloudformation describe-stacks --stack-name voice-chain-socket --query 'Stacks[].Outputs'
```

## link

https://9qmjknn869.execute-api.ap-northeast-2.amazonaws.com/Prod/@connections

## Testing the chat API

```bash
$ npm install -g wscat
```

1. connect

```bash
$ wscat -c wss://5nhf5xw971.execute-api.ap-northeast-2.amazonaws.com/Prod
```

4. To test the sendMessage function, send a JSON message like the following example. The Lambda function sends it back using the callback URL:

```bash
$ wscat -c wss://5nhf5xw971.execute-api.ap-northeast-2.amazonaws.com/Prod
connected (press CTRL+C to quit)
> {"message":"sendmessage", "data":"hello world"}
< hello world
```
