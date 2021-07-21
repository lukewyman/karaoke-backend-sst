import { APIGatewayProxyEvent, Handler, APIGatewayProxyResult } from 'aws-lambda';
import { middify, formatJSONResponse } from 'lambda-helpers';
import singerService from '../database';

export const handler: Handler = middify(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const singerId: string = event.pathParameters!.singerId!;
  try {
    const singer = await singerService.getSinger(singerId);

    return formatJSONResponse(200, singer);
  } catch (err) {
    return formatJSONResponse(500, `An error occurred: ${err}`);
  }
});
