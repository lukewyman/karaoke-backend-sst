import { APIGatewayProxyEvent, Handler, APIGatewayProxyResult } from 'aws-lambda';
import { middify, formatJSONResponse } from 'lambda-helpers';
import singerService from '../database';
import UpdateSinger from '../dtos/updateSingerDto';


export const handler: Handler = middify(
  async (event: APIGatewayProxyEvent & UpdateSinger): Promise<APIGatewayProxyResult> => {
    const singerId = event.pathParameters!.singerId!;
    const { body } = event;
    try {
      const singer = await singerService.updateSinger(singerId, body);

      return formatJSONResponse(200, singer);
    } catch (err) {
      return formatJSONResponse(500, `An error occurred: ${err}`);
    }
  }
);
