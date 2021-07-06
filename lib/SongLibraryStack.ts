import { RemovalPolicy } from '@aws-cdk/core';
import * as sst from '@serverless-stack/resources';

export default class SongLibraryStack extends sst.Stack {
    constructor(scope: sst.App, id: string, props?: sst.StackProps) {
        super(scope, id, props);

        const songsTable = new sst.Table(this, 'songs', {
            fields: {
                songId: sst.TableFieldType.STRING,
            },
            primaryIndex: { partitionKey: 'song_id' },
            dynamodbTable: {
                removalPolicy: RemovalPolicy.DESTROY
            }
        });

        const songLibraryApi = new sst.Api(this, 'SongLibraryApi', {
            defaultFunctionProps: {
                environment: {
                    songsTable: songsTable.dynamodbTable.tableName,
                },
            },
        });

        songLibraryApi.addRoutes(this, {
            'POST /karaoke/songs': 'src/services/song-library/functions/KAR_LIB_create_song.handler',
            'GET /karaoke/songs/{songId}': 'src/services/song-library/functions/KAR_LIB_get_song.handler',
            'GET /karaoke/songs': 'src/services/song-library/functions/KAR_LIB_get_all_songs.handler',
            'PUT /karaoke/songs/{songId}': 'src/services/song-library/functions/KAR_LIB_update_song.handler',
            'DELETE /karaoke/songs/{songId}': 'src/services/song-library/functions/KAR_LIB_delete_song.handler',
        });

        songLibraryApi.attachPermissions([songsTable]);

        this.addOutputs({
            'SongLibraryApiEndpoint': {
                value: songLibraryApi.url,
                exportName: scope.logicalPrefixedName('SongLibraryApiEndpoint'),
            }
        })
    }
}