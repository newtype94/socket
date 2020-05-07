# voiceChain backend

AWS serverless architecture

## AWS CLI commands

- install the [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)

```
sam package --template-file template.yaml --output-template-file packaged.yaml --s3-bucket newtype94

sam deploy --template-file packaged.yaml --stack-name voice-chain-backend --capabilities CAPABILITY_IAM

aws cloudformation describe-stacks --stack-name voice_chain_backend --query 'Stacks[].Outputs'
```

## link

https://9qmjknn869.execute-api.ap-northeast-2.amazonaws.com/Prod/@connections

## Testing the chat API

1. [Install NPM](https://www.npmjs.com/get-npm).
2. Install wscat:

```bash
$ npm install -g wscat
```

3. On the console, connect to your published API endpoint by executing the following command:

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
