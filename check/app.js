const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION,
});

const { TABLE_USERS } = process.env;

const errs = (e) => ({ statusCode: e.statusCode || 500, body: e.stack });

exports.handler = async (event) => {
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint:
      event.requestContext.domainName + "/" + event.requestContext.stage,
  });
  const body = JSON.parse(event.body).data;
  const requester = event.requestContext.connectionId;
  let connectionData;

  //body에 requester 항목이 없으면 새로운 검증을 부탁하는 요청임
  if (!body.requester) {
    //연결된 유저 리스트 가져오기
    try {
      connectionData = await ddb
        .scan({ TableName: TABLE_USERS, ProjectionExpression: "connectionId" })
        .promise();
    } catch (e) {
      return errs(e);
    }

    body.requester = requester;
    //연결된 유저들에게 검증 요청 broadcast
    const postCalls = connectionData.Items.map(async ({ connectionId }) => {
      try {
        await apigwManagementApi
          .postToConnection({
            ConnectionId: connectionId,
            Data: JSON.stringify({ message: "checkPlz", data: body }),
          })
          .promise();
      } catch (e) {
        if (e.statusCode === 410)
          await ddb
            .delete({ TableName: TABLE_USERS, Key: { connectionId } })
            .promise();
      }
    });
    try {
      await Promise.all(postCalls);
    } catch (e) {
      return errs(e);
    }
  } else {
    //body에 requester 항목이 있으면 검증한 결과를 원래 요청자에게 toss함
    try {
      await apigwManagementApi
        .postToConnection({
          ConnectionId: body.requester,
          Data: JSON.stringify({
            message: "checkResult",
            data: body,
          }),
        })
        .promise();
    } catch (e) {
      return errs(e);
    }
  }

  return { statusCode: 200, body: "handler end.." };
};
