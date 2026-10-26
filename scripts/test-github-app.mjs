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

function getJwt(appId, privateKey) {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iat: now - 60,
    exp: now + 600,
    iss: appId,
  };

  const header = { alg: 'RS256', typ: 'JWT' };
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
      'User-Agent': 'brillz-brain-test',
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

async function main() {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const defaultBranch = process.env.GITHUB_DEFAULT_BRANCH;
  const appId = process.env.GITHUB_APP_ID;
  const installationId = process.env.GITHUB_APP_INSTALLATION_ID;
  const privateKeyPath = path.resolve(process.env.GITHUB_PRIVATE_KEY_PATH);

  if (!fs.existsSync(privateKeyPath)) {
    throw new Error(`GitHub private key not found at: ${privateKeyPath}`);
  }

  const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
  const jwt = getJwt(appId, privateKey);

  console.log('Requesting installation token...');
  const tokenResponse = await githubJson(
    `https://api.github.com/app/installations/${installationId}/access_tokens`,
    {
      Authorization: `Bearer ${jwt}`,
    },
    { method: 'POST' }
  );

  console.log('Installation token acquired.');
  console.log(`Expires at: ${tokenResponse.expires_at}`);

  const installationToken = tokenResponse.token;
  const repoResponse = await githubJson(
    `https://api.github.com/repos/${owner}/${repo}`,
    {
      Authorization: `Bearer ${installationToken}`,
    }
  );

  const branchResponse = await githubJson(
    `https://api.github.com/repos/${owner}/${repo}/branches/${defaultBranch}`,
    {
      Authorization: `Bearer ${installationToken}`,
    }
  );

  console.log('\nGitHub App authentication is working.');
  console.log(`Repo: ${repoResponse.full_name}`);
  console.log(`Default branch: ${repoResponse.default_branch}`);
  console.log(`Branch SHA: ${branchResponse.commit.sha}`);
  console.log(`Default branch matches expected value: ${repoResponse.default_branch === defaultBranch}`);
}

main().catch((error) => {
  console.error('GitHub App test failed.');
  console.error(error.message);
  process.exit(1);
});
