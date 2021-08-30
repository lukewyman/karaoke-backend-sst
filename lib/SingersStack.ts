import { RemovalPolicy } from '@aws-cdk/core';
import * as sst from '@serverless-stack/resources';

export default class SingersStack extends sst.Stack {
  constructor(scope: sst.App, id: string, singersTable: sst.Table, props?: sst.StackProps) {
    super(scope, id, props);

    const singersApi = new sst.Api(this, 'singers-api', {
      defaultFunctionProps: {
        runtime: 'python3.8',
        srcPath: 'src/services/singers',
        environment: {
          SINGERS_TABLE: singersTable.dynamodbTable.tableName,
        },
      },
    });

    singersApi.addRoutes(this, {
      'POST   /karaoke/singers': 'KAR_SNG_test_create_singer.handler',
      'GET    /karaoke/singers/{singerId}': 'KAR_SNG_get_singer_by_id.handler',
      'GET    /karaoke/singers': 'KAR_SNG_get_singers.handler',
      'PUT    /karaoke/singers/{singerId}': 'KAR_SNG_update_singer.handler',
      'DELETE /karaoke/singers/{singerId}': 'KAR_SNG_delete_singer.handler',
    });

    singersApi.attachPermissions([singersTable]);

    this.addOutputs({
      SingersApiEndpoint: {
        value: singersApi.url,
        exportName: scope.logicalPrefixedName('SingersApiEndpoint'),
      },
    });
  }
}
