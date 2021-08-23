import * as sst from '@serverless-stack/resources';
import AuthStack from './AuthStack';
import EventBusStack from './EventBusStack';
import PerformanceHistoryStack from './PerformanceHistoryStack';
import RotationsStack from './RotationsStack';
import SingersStack from './SingersStack';
import SingersTableStack from './SingersTableStack';
import SongLibraryStack from './SongLibraryStack';

export default function main(app: sst.App): void {
  app.setDefaultFunctionProps({
    runtime: 'nodejs12.x',
  });

  const singersTableStack = new SingersTableStack(app, 'singers-table');
  const authStack = new AuthStack(app, 'auth', singersTableStack.singersTable);
  // const eventBusStack = new EventBusStack(app, 'event-bus');
  // new RotationsStack(app, 'rotations', eventBusStack.eventBus);
  // new PerformanceHistoryStack(app, 'performance-history', eventBusStack.performanceCompletedRule);
  new SingersStack(app, 'singers', singersTableStack.singersTable);
  new SongLibraryStack(app, 'song-library');
}
