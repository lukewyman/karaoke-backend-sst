import * as sst from '@serverless-stack/resources';
import PerformanceHistoryStack from './PerformanceHistoryStack';
import SingersStack from './SingersStack';
import SongLibraryStack from './SongLibraryStack';

export default function main(app: sst.App): void {
  app.setDefaultFunctionProps({
    runtime: 'nodejs12.x',
  });

  new PerformanceHistoryStack(app, 'performance-history');
  new SingersStack(app, 'singers');
  new SongLibraryStack(app, 'song-library');
}
