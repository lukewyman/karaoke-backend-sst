import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import Song from '../domain/Song';

class SongService {
  constructor(private readonly docClient: DocumentClient, private readonly tableName: string) {}

  async createSong(song: Song): Promise<Song> {
    await this.docClient
      .put({
        TableName: this.tableName,
        Item: {
          song_id: song.songId,
          title: song.title,
          artist: song.artist,
          play_duration: song.playDuration,
        },
      })
      .promise();

    return song;
  }

  async getSong(songId: string): Promise<Song> {
    const result = await this.docClient
      .get({
        TableName: this.tableName,
        Key: { song_id: songId },
      })
      .promise();

    return result.Item as Song;
  }

  async getAllSongs(): Promise<Song[]> {
    const result = await this.docClient
      .scan({
        TableName: this.tableName,
      })
      .promise();

    return result.Items as Song[];
  }

  async updateSong(songId: string, partialSong: Partial<Song>): Promise<Song> {
    const updated = await this.docClient
      .update({
        TableName: this.tableName,
        Key: { song_id: songId },
        UpdateExpression: 'set #title = :title, #artist = :artist, #play_duration = :play_duration',
        ExpressionAttributeNames: {
          '#title': 'title',
          '#artist': 'artist',
          '#play_duration': 'play_duration',
        },
        ExpressionAttributeValues: {
          ':title': partialSong.title,
          ':artist': partialSong.artist,
          ':play_duration': partialSong.playDuration,
        },
        ReturnValues: 'ALL_NEW',
      })
      .promise();

    return updated.Attributes as Song;
  }

  async deleteSong(songId: string): Promise<DocumentClient.DeleteItemOutput> {
    return this.docClient
      .delete({
        TableName: this.tableName,
        Key: { song_id: songId },
      })
      .promise();
  }
}

export default SongService;
