import * as cdk from '@aws-cdk/core';
import * as sst from '@serverless-stack/resources';
import { getRemovalPolicy } from './RemovalPolicy';

export default class AuthStack extends sst.Stack {
  constructor(scope: sst.App, id: string, singersTable: sst.Table, props?: sst.StackProps) {
    super(scope, id, props);

    const auth = new sst.Auth(this, 'Auth', {
      cognito: {
        defaultFunctionProps: {
          environment: {
            singersTable: singersTable.dynamodbTable.tableName,
          },
        },
        userPool: {
          signInAliases: { email: true },
          removalPolicy: getRemovalPolicy(scope),
        },
        triggers: {
          postConfirmation: 'src/services/singers/functions/KAR_SNG_create_singer.handler',
        },
      },
    });

    auth.attachPermissionsForTriggers([singersTable]);

    this.addOutputs({
      UserPoolId: auth.cognitoUserPool!.userPoolId,
      IdentityPoolId: auth.cognitoCfnIdentityPool.ref,
      UserPoolClientId: auth.cognitoUserPoolClient!.userPoolClientId,
    });
  }
}
