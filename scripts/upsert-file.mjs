#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const requiredEnv = [
  'GITHUB_OWNER',
  'GITHUB_REPO',
  'GITHUB_DEFAULT_BRANCH',
  'GITHUB_APP_ID',
  'GITHUB_APP_INSTALLATION_ID',
  'GITHUB_PRIVATE_KEY_PATH',
];

const missing = requiredEnv.filter((name) => !process.env[name]);
if (missing.length > 0) {
  console.error('Missing required environment variables:');
  for (const name of missing) {
    console.error(`  - ${name}`);
  }
  console.error('');
  console.error('Example:');
  console.error('  export GITHUB_OWNER="seperneng-spec"');
  console.error('  export GITHUB_REPO="brillz-brain"');
  console.error('  export GITHUB_DEFAULT_BRANCH="main"');
  console.error('  export GITHUB_APP_ID="YOUR_APP_ID"');
  console.error('  export GITHUB_APP_INSTALLATION_ID="YOUR_INSTALLATION_ID"');
  console.error('  export GITHUB_PRIVATE_KEY_PATH="/secure/path/allvider-connector.private-key.pem"');
  process.exit(1);
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (!item.startsWith('--')) continue;

    const key = item.slice(2);
    const nextVal = argv[i + 1];
    const hasValue = nextVal && !nextVal.startsWith('--');
    args[key] = hasValue ? argv[++i] : true;
  }
  return args;
}

function getJwt(appId, privateKey) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = { iat: now - 60, exp: now + 600, iss: appId };
  const encHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signingInput = `${encHeader}.${encPayload}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signingInput);
  signer.end();
  const signature = signer.sign(privateKey, 'base64url');
  return `${signingInput}.${signature}`;
}

async function githubJson(url, headers, init = {}) {
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'brillz-brain-upsert',
      ...headers,
    },
  });

  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!response.ok) {
    const message = typeof body === 'string' ? body : body?.message || 'GitHub API request failed';
    throw new Error(`${response.status} ${response.statusText}: ${message}`);
  }

  return body;
}

async function getInstallationToken(jwt, installationId) {
  const response = await githubJson(
    `https://api.github.com/app/installations/${installationId}/access_tokens`,
    { Authorization: `Bearer ${jwt}` },
    { method: 'POST' }
  );

  return response.token;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const appId = process.env.GITHUB_APP_ID;
  const installationId = process.env.GITHUB_APP_INSTALLATION_ID;
  const privateKeyPath = path.resolve(process.env.GITHUB_PRIVATE_KEY_PATH);
  const branch = args.branch || process.env.GITHUB_DEFAULT_BRANCH || 'main';
  const targetPath = args.path;
  const commitMessage = args.message || 'Update file via GitHub App';

  if (!targetPath) {
    throw new Error('Missing required --path argument');
  }

  if (!fs.existsSync(privateKeyPath)) {
    throw new Error(`GitHub private key not found at: ${privateKeyPath}`);
  }

  let content;
  if (args['content-file']) {
    const resolved = path.resolve(args['content-file']);
    content = fs.readFileSync(resolved, 'utf8');
  } else if (Object.prototype.hasOwnProperty.call(args, 'content')) {
    content = String(args.content);
  } else {
    throw new Error('Missing file content. Supply --content or --content-file');
  }

  const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
  const jwt = getJwt(appId, privateKey);
  const installationToken = await getInstallationToken(jwt, installationId);

  const repoUrl = `https://api.github.com/repos/${owner}/${repo}`;
  const fileUrl = `${repoUrl}/contents/${encodeURIComponent(targetPath)}`;

  let sha;
  try {
    const existing = await githubJson(`${fileUrl}?ref=${encodeURIComponent(branch)}`, {
      Authorization: `Bearer ${installationToken}`,
    });
    sha = existing?.sha;
  } catch (error) {
    if (!String(error.message).includes('404')) {
      throw error;
    }
  }

  const payload = {
    message: commitMessage,
    content: Buffer.from(content).toString('base64'),
    branch,
  };

  if (sha) {
    payload.sha = sha;
  }

  const result = await githubJson(fileUrl, {
    Authorization: `Bearer ${installationToken}`,
  }, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  console.log('File upserted successfully.');
  console.log(`Path: ${targetPath}`);
  console.log(`Branch: ${branch}`);
  console.log(`URL: ${result.content?.html_url || `${repoUrl}/blob/${branch}/${targetPath}`}`);
}

main().catch((error) => {
  console.error('Upsert failed:');
  console.error(error.message);
  process.exit(1);
});
