import { withModuleFederation } from '@nx/angular/module-federation';
import config from './module-federation.config';
import { type Configuration } from 'webpack';

export default async (webpack: Configuration) => {
  const apply = await withModuleFederation(config);

  const configuration = apply({
    ...webpack,
    experiments: {
      ...webpack.experiments,
      topLevelAwait: true,
    },
    output: {
      ...webpack.output,
      workerPublicPath: '/proxy/remote/',
    },
    externals: {
      mupdf: 'module /proxy/remote/assets/mupdf.js',
      'comlink-esm': 'module /proxy/remote/assets/comlink.min.js',
    },
    resolve: {
      ...webpack.resolve,
      fallback: {
        ...webpack.resolve?.fallback,
        fs: false,
        module: false,
      },
    },
  } as Configuration);

  return configuration;
};
