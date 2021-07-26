import * as cdk from '@aws-cdk/core';
import * as sst from '@serverless-stack/resources';

export default class SingersTableStack extends sst.Stack {
  private _singersTable: sst.Table;

  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    const singersTable = new sst.Table(this, 'singers', {
      fields: {
        singer_id: sst.TableFieldType.STRING,
      },
      primaryIndex: { partitionKey: 'singer_id' },
      dynamodbTable: {
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      },
    });

    this._singersTable = singersTable;
  }

  public get singersTable(): sst.Table {
    return this._singersTable;
  }
}
