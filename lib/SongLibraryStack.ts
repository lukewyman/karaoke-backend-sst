import { RemovalPolicy } from '@aws-cdk/core';
import * as sst from '@serverless-stack/resources';
import { getRemovalPolicy } from './RemovalPolicy';

export default class SongLibraryStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    const songsTable = new sst.Table(this, 'songs', {
      fields: {
        songId: sst.TableFieldType.STRING,
      },
      primaryIndex: { partitionKey: 'song_id' },
      dynamodbTable: {
        removalPolicy: getRemovalPolicy(scope),
      },
    });

    const songLibraryApi = new sst.Api(this, 'SongLibraryApi', {
      defaultFunctionProps: {
        runtime: 'python3.8',
        srcPath: 'src/karaoke/song_library',
        environment: {
          SONGS_TABLE: songsTable.dynamodbTable.tableName,
        },
      },
    });

    songLibraryApi.addRoutes(this, {
      'POST /karaoke/songs': 'KAR_LIB_create_song.handler',
      'GET /karaoke/songs/{songId}': 'KAR_LIB_get_song.handler',
      'GET /karaoke/songs': 'KAR_LIB_get_all_songs.handler',
      'PUT /karaoke/songs/{songId}': 'KAR_LIB_update_song.handler',
      'DELETE /karaoke/songs/{songId}': 'KAR_LIB_delete_song.handler',
    });

    songLibraryApi.attachPermissions([songsTable]);

    this.addOutputs({
      SongLibraryApiEndpoint: {
        value: songLibraryApi.url,
        exportName: scope.logicalPrefixedName('SongLibraryApiEndpoint'),
      },
    });
  }
}
