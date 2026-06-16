// Vercel serverless entrypoint — delegates to the compiled NestJS app.
// `npm run build` compiles the backend to packages/backend/dist (with decorator
// metadata), which this function imports.
// @ts-nocheck
import { createServerlessApp } from '../packages/backend/dist/serverless';

export default async function handler(req: any, res: any) {
  const app = await createServerlessApp();
  return app(req, res);
}
