import * as sst from '@serverless-stack/resources';
import * as events from '@aws-cdk/aws-events';

export default class EventBusStack extends sst.Stack {
  private _eventBus: events.EventBus;
  private _performanceCompletedRule: events.Rule;

  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    const karaokeBus = new events.EventBus(this, 'karaoke-bus');
    this._eventBus = karaokeBus;

    const performanceCompletedRule = new events.Rule(this, 'performance-completed', {
      eventBus: karaokeBus,
      eventPattern: {
        source: ['karaoke.rotations'],
        detailType: ['PerformanceCompleted'],
      },
    });

    this._performanceCompletedRule = performanceCompletedRule;

    this.addOutputs({
      karaokeEventBusName: {
        value: karaokeBus.eventBusName,
        exportName: scope.logicalPrefixedName('EventBusName'),
      },
      karaokeEventBusArn: {
        value: karaokeBus.eventBusArn,
        exportName: scope.logicalPrefixedName('EventBusArn'),
      },
    });
  }

  public get eventBus(): events.EventBus {
    return this._eventBus;
  }

  public get performanceCompletedRule(): events.Rule {
    return this._performanceCompletedRule;
  }
}
