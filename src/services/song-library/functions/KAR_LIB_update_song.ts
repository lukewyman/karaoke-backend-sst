import { APIGatewayProxyEvent, Handler, APIGatewayProxyResult } from 'aws-lambda';
import { middify, formatJSONResponse } from 'lambda-helpers';
import UpdateSong from '../dtos/updateSongDto';
import songService from '../database';

export const handler: Handler = middify(
  async (event: APIGatewayProxyEvent & UpdateSong): Promise<APIGatewayProxyResult> => {
    const songId: string = event.pathParameters!.songId!;
    const { body } = event;
    try {
      const song = await songService.updateSong(songId, body);

      return formatJSONResponse(200, song);
    } catch (err) {
      return formatJSONResponse(500, err);
    }
  }
);
