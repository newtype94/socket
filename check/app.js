const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION,
});
const apigwManagementApi = new AWS.ApiGatewayManagementApi({
  apiVersion: "2018-11-29",
  endpoint: event.requestContext.domainName + "/" + event.requestContext.stage,
});

const { TABLE_USERS } = process.env;

const errs = (e) => {
  return { statusCode: e.statusCode, body: e.stack };
};

exports.handler = async (event) => {
  const req = JSON.parse(event.body).data;
  const sender = event.requestContext.connectionId;

  //body에 sender 항목이 있으면 검증 결과에 대한 소켓 요청임
  if (req.sender) {
    try {
      await apigwManagementApi
        .postToConnection({
          ConnectionId: req.sender,
          Data: JSON.stringify({
            message: "checkResult",
            data: { sender, authrize: req.authorize },
          }),
        })
        .promise();
    } catch (e) {
      if (e.statusCode === 410) {
        await ddb
          .delete({ TableName: TABLE_USERS, Key: { connectionId } })
          .promise();
      }
      return errs(e);
    }
    //body에 sender 항목이 없으면 새로운 검증을 요청하는 소켓 요청임
  } else {
    //소켓 연결 유저 리스트
    let connectionData;
    try {
      connectionData = await ddb
        .scan({ TableName: TABLE_USERS, ProjectionExpression: "connectionId" })
        .promise();
    } catch (e) {
      return errs(e);
    }

    //검증 성공 시 전체 노드에 broadcast
    const postCalls = connectionData.Items.map(async ({ connectionId }) => {
      try {
        await apigwManagementApi
          .postToConnection({
            ConnectionId: connectionId,
            Data: JSON.stringify({ message: "checkPlz", data: req }),
          })
          .promise();
      } catch (e) {
        if (e.statusCode === 410) {
          await ddb
            .delete({ TableName: TABLE_USERS, Key: { connectionId } })
            .promise();
        }
        return errs(e);
      }
    });

    try {
      await Promise.all(postCalls);
    } catch (e) {
      return errs(e);
    }
  }

  return { statusCode: 200, body: "Data sent." };
};
