import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import Singer from '../domain/Singer';

class SingerService {
  constructor(private readonly docClient: DocumentClient, private readonly tableName: string) {}

  async createSinger(singer: Singer): Promise<Singer> {
    await this.docClient
      .put({
        TableName: this.tableName,
        Item: {
          singer_id: singer.singerId,
          first_name: singer.firstName,
          last_name: singer.lastName,
          stage_name: singer.stageName,
          email: singer.email,
        },
      })
      .promise();

    return singer;
  }

  async getSinger(singerId: string): Promise<Singer> {
    const result = await this.docClient
      .get({
        TableName: this.tableName,
        Key: { singer_id: singerId },
      })
      .promise();

    return result.Item as Singer;
  }

  async getAllSingers(): Promise<Singer[]> {
    const result = await this.docClient
      .scan({
        TableName: this.tableName,
      })
      .promise();

    return result.Items as Singer[];
  }

  async updateSinger(singerId: string, partialSinger: Partial<Singer>): Promise<Singer> {
    const updated = await this.docClient
      .update({
        TableName: this.tableName,
        Key: { singer_id: singerId },
        UpdateExpression:
          'set #stage_name = :stage_name, #first_name = :first_name, #last_name = :last_name, #email = :email',
        ExpressionAttributeNames: {
          '#stage_name': 'stage_name',
          '#first_name': 'first_name',
          '#last_name': 'last_name',
          '#email': 'email',
        },
        ExpressionAttributeValues: {
          ':stage_name': partialSinger.stageName,
          ':first_name': partialSinger.firstName,
          ':last_name': partialSinger.lastName,
          ':email': partialSinger.email,
        },
        ReturnValues: 'ALL_NEW',
      })
      .promise();

    return updated.Attributes as Singer;
  }

  async deleteSinger(singerId: string): Promise<DocumentClient.DeleteItemOutput> {
    return this.docClient
      .delete({
        TableName: this.tableName,
        Key: { singer_id: singerId },
      })
      .promise();
  }
}

export default SingerService;
