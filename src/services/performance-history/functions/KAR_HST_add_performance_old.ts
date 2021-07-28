import { APIGatewayProxyEvent, Handler, APIGatewayProxyResult } from 'aws-lambda';
import { middify, formatJSONResponse } from 'lambda-helpers';
import AddPerformance from '../dtos/addPerformanceDto';
import performanceService from '../database';

export const handler: Handler = middify(
  async (event: APIGatewayProxyEvent & AddPerformance): Promise<APIGatewayProxyResult> => {
    const { singerId, songId, songTitle, artist } = event.body;
    try {
      const performanceDate = new Date().toISOString();
      const result = await performanceService.createPerformance({
        singerId,
        songId,
        songTitle,
        artist,
        performanceDate,
      });

      return formatJSONResponse(201, result);
    } catch (err) {
      return formatJSONResponse(500, `${err}`);
    }
  }
);
