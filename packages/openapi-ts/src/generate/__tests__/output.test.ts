import fs from 'node:fs';

import { describe, expect, it, vi } from 'vitest';

import type { Client } from '../../types/client';
import { setConfig } from '../../utils/config';
import { generateLegacyOutput } from '../output';
import { mockTemplates, openApi } from './mocks';

vi.mock('node:fs');

describe('generateLegacyOutput', () => {
  it('writes to filesystem', async () => {
    setConfig({
      client: {
        name: 'legacy/fetch',
      },
      configFile: '',
      debug: false,
      dryRun: false,
      experimentalParser: false,
      exportCore: true,
      input: {
        path: '',
      },
      logs: {},
      output: {
        format: 'prettier',
        path: './dist',
      },
      pluginOrder: ['@hey-api/typescript', '@hey-api/schemas', '@hey-api/sdk'],
      plugins: {
        '@hey-api/schemas': {
          _handler: () => {},
          _handlerLegacy: () => {},
          name: '@hey-api/schemas',
        },
        '@hey-api/sdk': {
          _handler: () => {},
          _handlerLegacy: () => {},
          name: '@hey-api/sdk',
        },
        '@hey-api/typescript': {
          _handler: () => {},
          _handlerLegacy: () => {},
          enums: 'javascript',
          name: '@hey-api/typescript',
        },
      },
      useOptions: false,
    });

    const client: Client = {
      models: [],
      server: 'http://localhost:8080',
      services: [],
      types: {},
      version: 'v1',
    };

    await generateLegacyOutput({
      client,
      openApi,
      templates: mockTemplates,
    });

    expect(fs.rmSync).toHaveBeenCalled();
    expect(fs.mkdirSync).toHaveBeenCalled();
    expect(fs.writeFileSync).toHaveBeenCalled();
  });
});
