"use strict";

const AWS = require("aws-sdk");
const axios = require("axios");
const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION,
});
const { TABLE_USERS } = process.env;

const url =
  "https://cophwimxel.execute-api.ap-northeast-2.amazonaws.com/prod/block";

const errs = (e) => ({ statusCode: e.statusCode || 500, body: e.stack });

exports.handler = async (event) => {
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint:
      event.requestContext.domainName + "/" + event.requestContext.stage,
  });

  const req = JSON.parse(event.body).data;
  const sender = event.requestContext.connectionId;
  let postResult = true;

  //req 검증
  try {
    await axios.post(url, req);
  } catch (e) {
    postResult = false;
  }

  if (!postResult) {
    try {
      await apigwManagementApi
        .postToConnection({
          ConnectionId: sender,
          Data: JSON.stringify({ message: "addFailed", data: "" }),
        })
        .promise();
    } catch (e) {
      return errs(e);
    }
  } else {
    let connectionData;
    try {
      connectionData = await ddb
        .scan({ TableName: TABLE_USERS, ProjectionExpression: "connectionId" })
        .promise();
    } catch (e) {
      return errs(e);
    }

    const postCalls = connectionData.Items.map(async ({ connectionId }) => {
      try {
        await apigwManagementApi
          .postToConnection({
            ConnectionId: connectionId,
            Data: JSON.stringify({ message: "addPlz", data: req }),
          })
          .promise();
      } catch (e) {
        if (e.statusCode === 410)
          await ddb
            .delete({ TableName: TABLE_USERS, Key: { connectionId } })
            .promise();
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
