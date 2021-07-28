import * as sst from '@serverless-stack/resources';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';

export default class RotationsStack extends sst.Stack {
  constructor(scope: sst.App, id: string, eventBus: events.EventBus, props?: sst.StackProps) {
    super(scope, id, props);

    const completePerformanceFunction = new sst.Function(this, 'complete-performance', {
      handler: 'src/services/rotations/functions/KAR_ROT_complete_performance.handler',
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

    const rotationsApi = new sst.Api(this, 'rotations-api');

    rotationsApi.addRoutes(this, {
      'POST /karoaoke/rotations/performances': completePerformanceFunction,
    });

    this.addOutputs({
      RotationsApiEndpoint: {
        value: rotationsApi.url,
        exportName: scope.logicalPrefixedName('RotationsApiEndpoint'),
      },
    });
  }
}
