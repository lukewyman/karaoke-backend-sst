import * as sst from "@serverless-stack/resources";
import SingersStack from './SingersStack';

export default function main(app: sst.App): void {
  // Set default runtime for all functions
  app.setDefaultFunctionProps({
    runtime: "nodejs12.x"
  });

  new SingersStack(app, 'singers');

  // Add more stacks
}
