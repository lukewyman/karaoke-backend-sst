import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import Performance from '../domain/Performance';

class PerformanceService {
  constructor(private readonly docClient: DocumentClient, private readonly tableName: string) {}

  async createPerformance(performance: Performance): Promise<Performance> {
    await this.docClient
      .put({
        TableName: this.tableName,
        Item: {
          singer_id: performance.singerId,
          song_id: performance.songId,
          song_title: performance.songTitle,
          artist: performance.artist,
          performance_date: performance.performanceDate,
        },
      })
      .promise();

    return performance;
  }

  async getAllPerformances(singerId: string): Promise<Performance[]> {
    const result = await this.docClient
      .query({
        TableName: this.tableName,
        KeyConditionExpression: '#singer_id = :singer_id',
        ExpressionAttributeNames: {
          '#singer_id': 'singer_id',
        },
        ExpressionAttributeValues: {
          ':singer_id': singerId,
        },
      })
      .promise();

    return result.Items as Performance[];
  }
}

export default PerformanceService;
