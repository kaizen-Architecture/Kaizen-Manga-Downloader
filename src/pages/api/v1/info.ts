import { NextApiRequest, NextApiResponse } from 'next';

/**
 * GET /api/v1/info
 * Returns build metadata baked into the Docker image at build time.
 * No authentication required — useful for verifying which build/commit is running.
 *
 * Example response:
 * {
 *   "version": "1.10.0",
 *   "gitCommit": "abc1234def5678...",
 *   "gitCommitShort": "abc1234",
 *   "buildDate": "2026-05-18T08:00:00Z",
 *   "nodeEnv": "production"
 * }
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const gitCommit = process.env.NEXT_PUBLIC_GIT_COMMIT_SHORT || process.env.KAIZEN_GIT_COMMIT || 'unknown';
  const buildDate = process.env.NEXT_PUBLIC_BUILD_DATE || process.env.KAIZEN_BUILD_DATE || 'unknown';

  res.status(200).json({
    version: process.env.npm_package_version || process.env.NEXT_PUBLIC_APP_VERSION || 'unknown',
    gitCommit,
    gitCommitShort: gitCommit !== 'unknown' ? gitCommit.slice(0, 7) : 'unknown',
    buildDate,
    nodeEnv: process.env.NODE_ENV,
  });
}
