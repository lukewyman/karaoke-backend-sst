import { APIGatewayProxyEvent, Handler, APIGatewayProxyResult } from 'aws-lambda';
import * as uuid from 'uuid';

export const handler: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const parsedBody = JSON.parse(event.body || '');
    const id = uuid.v4();
    return {
      statusCode: 200,
      body: `Hello, ${parsedBody?.name}! The id for this invocation is ${id}`,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: `An error occurred: ${err}`,
    };
  }
};