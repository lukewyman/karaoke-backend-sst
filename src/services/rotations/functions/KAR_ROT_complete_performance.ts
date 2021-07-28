import { APIGatewayProxyEvent, Handler, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { middify, formatJSONResponse } from 'lambda-helpers';
import AddPerformance from '../dtos/addPerformanceDto';
import PerformanceCompleted from '../events/PerformanceCompleted';

export const handler: Handler = middify(
  async (event: APIGatewayProxyEvent & AddPerformance): Promise<APIGatewayProxyResult> => {
    const { singerId, songId, songTitle, artist } = event.body;
    const performanceCompleted: PerformanceCompleted = {
      singerId,
      songId,
      songTitle,
      artist,
      performanceDate: new Date().toISOString(),
    };

    console.log(`PerformanceCompleted: ${JSON.stringify(performanceCompleted)}`);

    const params = {
      Entries: [
        {
          Detail: JSON.stringify(performanceCompleted),
          DetailType: process.env.PERFORMANCE_COMPLETED_DETAIL_TYPE,
          Source: process.env.PERFORMANCE_COMPLETED_SOURCE,
          EventBusName: process.env.KARAOKE_BUS,
        },
      ],
    };

    console.log(`Params: ${JSON.stringify(params)}`);

    try {
      const eventBridge = new AWS.EventBridge();
      const result = await eventBridge
        .putEvents(params, (err, data) => {
          if (err) console.log(err, err.stack);
          else console.log(data);
        })
        .promise();

      return formatJSONResponse(201, result);
    } catch (err) {
      return formatJSONResponse(500, err);
    }
  }
);
