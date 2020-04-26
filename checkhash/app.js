const AWS = require("aws-sdk");

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION,
});

const { TABLE_CHAINS } = process.env;

exports.handler = async (event) => {
  let connectionData;
  const clientLastBlock = JSON.parse(event.body).data;

  try {
    connectionData = await ddb
      .scan({
        TableName: TABLE_CHAINS,
        ProjectionExpression: "hash",
        ScanIndexForward: false,
      })
      .promise();
  } catch (e) {
    return { statusCode: 500, body: e.stack };
  }

  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint:
      event.requestContext.domainName + "/" + event.requestContext.stage,
  });

  try {
    await apigwManagementApi
      .postToConnection({
        ConnectionId: event.requestContext.connectionId,
        Data: event.requestContext.connectionId + ",,,,,," + clientLastBlock,
      })
      .promise();
  } catch (e) {
    if (e.statusCode === 410) {
      console.log(`Found stale connection, deleting ${connectionId}`);
      await ddb
        .delete({ TableName: TABLE_USERS, Key: { connectionId } })
        .promise();
    } else {
      throw e;
    }
  }

  return { statusCode: 200, body: "Data sent." };
};
