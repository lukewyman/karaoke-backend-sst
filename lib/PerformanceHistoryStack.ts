import { RemovalPolicy } from '@aws-cdk/core';
import * as sst from '@serverless-stack/resources';

export default class PerformanceHistoryStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
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
        removalPolicy: RemovalPolicy.DESTROY,
      },
    });

    const performanceHistoryApi = new sst.Api(this, 'PerformanceHistoryApi', {
      defaultFunctionProps: {
        environment: {
          performancesTable: performancesTable.dynamodbTable.tableName,
        },
      },
    });

    performanceHistoryApi.addRoutes(this, {
      'POST /karaoke/performances': 'src/services/performance-history/functions/KAR_HST_add_performance.handler',
      'GET /karaoke/performances/{singerId}': 'src/services/performance-history/functions/KAR_HST_get_history.handler',
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
