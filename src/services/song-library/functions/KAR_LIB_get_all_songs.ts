import { APIGatewayProxyEvent, Handler, APIGatewayProxyResult } from 'aws-lambda';
import { middify, formatJSONResponse } from 'lambda-helpers';
import songService from '../database';

export const handler: Handler = middify(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const songs = await songService.getAllSongs();

    return formatJSONResponse(200, songs);
  } catch (err) {
    return formatJSONResponse(500, err);
  }
});
