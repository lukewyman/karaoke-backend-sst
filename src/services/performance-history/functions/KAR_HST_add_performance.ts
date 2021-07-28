import { EventBridgeEvent, EventBridgeHandler } from 'aws-lambda';
import performanceService from '../database';
import Performance from '../domain/Performance';

export const handler = async (event: EventBridgeEvent<string, Performance>) => {
  try {
    const performance = event.detail;
    console.log(performance);
    const result = await performanceService.createPerformance(performance);
    console.log(result);

    return {
      statusCode: 201,
      result,
    };
  } catch (err) {
    return {
      statusCode: 500,
      error: err,
    };
  }
};
