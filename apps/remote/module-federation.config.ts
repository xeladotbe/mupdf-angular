import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'remote',
  exposes: {
    './Routes': 'apps/remote/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
