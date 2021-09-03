import * as sst from '@serverless-stack/resources';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';

export default class RotationsStack extends sst.Stack {
  constructor(scope: sst.App, id: string, eventBus: events.EventBus, props?: sst.StackProps) {
    super(scope, id, props);

    const rotationsSrcPath = 'src/karaoke/rotations';

    const completePerformanceFunction = new sst.Function(this, 'complete-performance', {
      srcPath: rotationsSrcPath,
      handler: 'KAR_ROT_complete_performance.handler',
      environment: {
        KARAOKE_BUS: eventBus.eventBusName,
        PERFORMANCE_COMPLETED_SOURCE: 'karaoke.rotations',
        PERFORMANCE_COMPLETED_DETAIL_TYPE: 'PerformanceCompleted',
      },
    });

    completePerformanceFunction.attachPermissions([
      new iam.PolicyStatement({
        actions: ['events:PutEvents'],
        effect: iam.Effect.ALLOW,
        resources: [eventBus.eventBusArn],
      }),
    ]);

    const createRotationFunction = new sst.Function(this, 'create-rotation', {
      srcPath: rotationsSrcPath,
      handler: 'KAR_ROT_create_rotation.handler',
    });
    const getRotationByIdFunction = new sst.Function(this, 'get-rotation-by-id', {
      srcPath: rotationsSrcPath,
      handler: 'KAR_ROT_get_rotation_by_id.handler',
    });
    const updateRotationFunction = new sst.Function(this, 'update-rotation', {
      srcPath: rotationsSrcPath,
      handler: 'KAR_ROT_update_rotation.handler',
    });
    const addSingerFunction = new sst.Function(this, 'add-singer-to-rotation', {
      srcPath: rotationsSrcPath,
      handler: 'KAR_ROT_add_singer.handler',
    });
    const removeSingerFunction = new sst.Function(this, 'remove-singer-from-rotation', {
      srcPath: rotationsSrcPath,
      handler: 'KAR_ROT_remove_singer.handler',
    });
    const addRotationPlaylistFunction = new sst.Function(this, 'add-rotation-playlist', {
      srcPath: rotationsSrcPath,
      handler: 'KAR_ROT_add_rotation_playlist.handler',
    });
    const updateRotationPlaylistFunction = new sst.Function(this, 'update-rotation-playlist', {
      srcPath: rotationsSrcPath,
      handler: 'KAR_ROT_update_rotation_playlist.handler',
    });
    const deleteRotationPlaylistFunction = new sst.Function(this, 'delete-rotation-playlist', {
      srcPath: rotationsSrcPath,
      handler: 'KAR_ROT_delete_rotation_playlist.handler',
    });

    const rotationsApi = new sst.Api(this, 'rotations-api');

    rotationsApi.addRoutes(this, {
      'POST /karaoke/rotations': createRotationFunction,
      'GET /karaoke/rotations/{rotationId}': getRotationByIdFunction,
      'PUT /karaoke/rotations/{rotationId}': updateRotationFunction,
      'POST /karaoke/rotations/{rotationId}/singers': addSingerFunction,
      'PUT /karaoke/rotations/{rotationId}/singers/{singerId}': updateRotationPlaylistFunction,
      'DELETE /karaoke/rotations/{rotationId}/singers/{singerId}': removeSingerFunction,
      'PATCH /karaoke/rotations/{rotationId}': completePerformanceFunction,
    });

    this.addOutputs({
      RotationsApiEndpoint: {
        value: rotationsApi.url,
        exportName: scope.logicalPrefixedName('RotationsApiEndpoint'),
      },
    });
  }
}
