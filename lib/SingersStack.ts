import { RemovalPolicy } from '@aws-cdk/core';
import * as sst from '@serverless-stack/resources';

export default class SingersStack extends sst.Stack {
  constructor(scope: sst.App, id: string, singersTable: sst.Table, props?: sst.StackProps) {
    super(scope, id, props);

    const singersApi = new sst.Api(this, 'singers-api', {
      defaultFunctionProps: {
        environment: {
          singersTable: singersTable.dynamodbTable.tableName,
        },
      },
    });

    singersApi.addRoutes(this, {
      'POST /karaoke/singers': 'src/services/singers/functions/KAR_SNG_test_create_singer.handler',
      'GET /karaoke/singers/{singerId}': 'src/services/singers/functions/KAR_SNG_get_singer.handler',
      'GET /karaoke/singers': 'src/services/singers/functions/KAR_SNG_get_all_singers.handler',
      'PUT /karaoke/singers/{singerId}': 'src/services/singers/functions/KAR_SNG_update_singer.handler',
      'DELETE /karaoke/singers/{singerId}': 'src/services/singers/functions/KAR_SNG_delete_singer.handler',
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
