import { EventBridgeEvent, EventBridgeHandler } from 'aws-lambda';
import performanceService from '../database';
import { PerformanceCompleted } from 'karaoke-events';
import Performance from '../domain/Performance';

export const handler = async (event: EventBridgeEvent<string, PerformanceCompleted>) => {
  try {
    const performanceCompleted: PerformanceCompleted = event.detail;
    const performance: Performance = performanceCompleted;
    const result = await performanceService.createPerformance(performance);

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
