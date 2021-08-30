import { App } from '@serverless-stack/resources';
import { RemovalPolicy } from '@aws-cdk/core';

export const getRemovalPolicy = (scope: App) => {
  if (scope.stage == 'test') return RemovalPolicy.DESTROY;
  else return RemovalPolicy.RETAIN;
};
