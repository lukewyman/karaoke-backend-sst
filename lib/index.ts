import GreetingsStack from './GreetingsStack';
import * as sst from "@serverless-stack/resources";

export default function main(app: sst.App): void {
  // Set default runtime for all functions
  app.setDefaultFunctionProps({
    runtime: "nodejs12.x"
  });

  new GreetingsStack(app, 'greetings')

  // Add more stacks
}
