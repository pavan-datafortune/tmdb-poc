import * as fs from 'fs';
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
const env = dotenv.config();

dotenvExpand.expand(env);

export const environment = {
  production: false,
  tmdb: {
    apiKey: process.env['VITE_API_KEY'] as string, // never commit the real key!
    baseUrl: process.env['VITE_API_BASE_URL'] as string,
    defaultLang: 'en-US',
  },
};
