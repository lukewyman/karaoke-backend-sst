import { RemovalPolicy } from '@aws-cdk/core';
import * as sst from '@serverless-stack/resources';
import * as targets from '@aws-cdk/aws-events-targets';
import * as events from '@aws-cdk/aws-events';
import { getRemovalPolicy } from './RemovalPolicy';

export default class PerformanceHistoryStack extends sst.Stack {
  constructor(scope: sst.App, id: string, performanceCompletedRule: events.Rule, props?: sst.StackProps) {
    super(scope, id, props);

    const performancesTable = new sst.Table(this, 'performances', {
      fields: {
        singer_id: sst.TableFieldType.STRING,
        performance_date: sst.TableFieldType.STRING,
      },
      primaryIndex: {
        partitionKey: 'singer_id',
        sortKey: 'performance_date',
      },
      dynamodbTable: {
        removalPolicy: getRemovalPolicy(scope),
      },
    });

    const performanceHistoryApi = new sst.Api(this, 'PerformanceHistoryApi', {
      defaultFunctionProps: {
        runtime: 'python3.8',
        srcPath: 'src/karaoke/performance_history',
        environment: {
          PERFORMANCES_TABLE: performancesTable.dynamodbTable.tableName,
        },
      },
    });

    const historyLogger = new sst.Function(this, 'history-logger', {
      runtime: 'python3.8',
      srcPath: 'src/karaoke/performance_history',
      handler: 'KAR_HST_add_performance.handler',
      environment: {
        PERFORMANCES_TABLE: performancesTable.dynamodbTable.tableName,
      },
    });
    historyLogger.attachPermissions([performancesTable]);
    performanceCompletedRule.addTarget(new targets.LambdaFunction(historyLogger));

    performanceHistoryApi.addRoutes(this, {
      'GET /karaoke/performances/{singerId}': 'KAR_HST_get_history.handler',
    });

    performanceHistoryApi.attachPermissions([performancesTable]);

    this.addOutputs({
      PerformanceHistoryApiEndpoint: {
        value: performanceHistoryApi.url,
        exportName: scope.logicalPrefixedName('PerformanceHistoryApiEndpoint'),
      },
    });
  }
}
