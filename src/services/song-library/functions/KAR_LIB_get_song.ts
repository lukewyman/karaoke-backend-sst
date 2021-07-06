import { APIGatewayProxyEvent, Handler, APIGatewayProxyResult } from 'aws-lambda';
import { middify, formatJSONResponse } from 'lambda-helpers';
import songService from '../database';

export const handler: Handler = middify(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const songId: string = event.pathParameters!.songId!;
  try {
    const song = await songService.getSong(songId);

    return formatJSONResponse(200, song);
  } catch (err) {
    return formatJSONResponse(500, err);
  }
});
