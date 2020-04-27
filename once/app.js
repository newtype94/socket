const AWS = require("aws-sdk");

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION,
});

const { TABLE_USERS } = process.env;

exports.handler = async (event) => {
  const req = JSON.parse(event.body).data;

  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint:
      event.requestContext.domainName + "/" + event.requestContext.stage,
  });

  const { connectionId } = event.requestContext;

  try {
    await apigwManagementApi
      .postToConnection({
        ConnectionId: connectionId,
        Data: connectionId + "requested" + req,
      })
      .promise();
  } catch (e) {
    if (e.statusCode === 410) {
      console.log(`Found stale connection, deleting ${connectionId}`);
      await ddb
        .delete({ TableName: TABLE_USERS, Key: { connectionId } })
        .promise();
    } else return { statusCode: 500, body: e.stack };
  }

  return { statusCode: 200, body: "Data sent." };
};
