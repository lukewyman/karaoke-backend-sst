import { RemovalPolicy } from '@aws-cdk/core';
import * as sst from '@serverless-stack/resources';

export default class SingersStack extends sst.Stack {
    constructor(scope: sst.App, id: string, props?: sst.StackProps) {
        super(scope, id, props);

        const singersTable = new sst.Table(this, "singers", {
            fields: {
                singer_id: sst.TableFieldType.STRING,
            },
            primaryIndex: { partitionKey: 'singer_id'},
            dynamodbTable: {
                removalPolicy: RemovalPolicy.DESTROY
            }
        });

        const api = new sst.Api(this, 'Api', {
            defaultFunctionProps: {
                environment: {
                    singersTable: singersTable.dynamodbTable.tableName,
                },
            },
        });

        api.addRoutes(this, {
            'POST /karaoke/singers': 'src/services/singers/functions/KAR_SNG_create_singer.handler',
            'GET /karaoke/singers/{singerId}': 'src/services/singers/functions/KAR_SNG_get_singer.handler',
            'GET /karaoke/singers': 'src/services/singers/functions/KAR_SNG_get_all_singers.handler',
            'PUT /karaoke/singers/{singerId}': 'src/services/singers/functions/KAR_SNG_update_singer.handler',
            'DELETE /karaoke/singers/{singerId}': 'src/services/singers/functions/KAR_SNG_delete_singer.handler', 
        });

        api.attachPermissions([singersTable]);

        this.addOutputs({
            'ApiEndpoint': {
                value: api.url,
                exportName: scope.logicalPrefixedName('SingersApi'),
            },
            'SingersTableName': {
                value: singersTable.tableName,
                exportName: scope.logicalPrefixedName('SingersTableName'),
            },
            'SingersTableArn': {
                value: singersTable.tableArn,
                exportName: scope.logicalPrefixedName('SingersTableArn'),
            }
        });
    }
}