import { APIGatewayProxyEvent, Handler, APIGatewayProxyResult } from 'aws-lambda';
import * as uuid from 'uuid';
import { middify, formatJSONResponse } from 'lambda-helpers';
import CreateSinger from '../dtos/createSingerDto';
import singerService from '../database';

export const handler: Handler = middify(
  async (event: APIGatewayProxyEvent & CreateSinger): Promise<APIGatewayProxyResult> => {
    const { firstName, lastName, stageName, email } = event.body;
    try {
      const singerId: string = uuid.v4();
      const singer = await singerService.createSinger({
        singerId,
        firstName,
        lastName,
        stageName,
        email,
      });

      return formatJSONResponse(201, singer);
    } catch (err) {
      return formatJSONResponse(500, err);
    }
  }
);
