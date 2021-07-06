import * as sst from "@serverless-stack/resources";

export default class MyStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    const api = new sst.Api(this, "Api", {
      routes: {
        "GET /greetings/hello": "src/services/greetings/hello.handler",
      },
    });
    
    this.addOutputs({      
        'ApiEndpoint': {
          value: api.url,
          exportName: scope.logicalPrefixedName('GreetingsApi'),
        }      
    });
  }
}
