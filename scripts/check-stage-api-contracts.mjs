import { readdirSync, readFileSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

const ignoredDirectories = new Set([
  '.astro',
  '.cache',
  '.git',
  'dist',
  'node_modules'
]);

const scannedExtensions = new Set([
  '.astro',
  '.css',
  '.html',
  '.js',
  '.json',
  '.md',
  '.mjs',
  '.svg',
  '.ts',
  '.txt',
  '.yaml',
  '.yml'
]);

const requiredFiles = [
  '.env.example',
  'optional/cloudflare-rebuild/README.md',
  'optional/newsletter/README.md',
  'optional/preview/README.md',
  'docs/deployment.md',
  'docs/security.md',
  'scripts/test-stage-webhook-signature.mjs',
  'src/components/stage/AnalyticsConsent.astro',
  'src/components/stage/StageAnalytics.astro',
  'src/components/stage/StageImage.astro',
  'src/components/ui/ErrorState.astro',
  'src/lib/posts/client.ts',
  'src/lib/posts/sitemap.ts',
  'src/lib/stage/client.ts',
  'src/lib/stage/content-helpers.ts',
  'src/lib/stage/homepage.ts',
  'src/lib/seo/sitemap.ts',
  'src/pages/posts/index.astro',
  'src/pages/posts/[slug].astro',
  'src/styles/fonts.css',
  'src/styles/global.css',
  'src/styles/reset.css',
  'src/styles/tokens.css',
  'src/styles/typography.css',
  'public/assets/fonts/NotoSans-Regular.woff2',
  'public/assets/fonts/NotoSans-Bold.woff2',
  'public/assets/images/.gitkeep'
];

const forbiddenFragments = [
  ['/api/public', '/content'].join(''),
  ['/api/public', '/site'].join(''),
  ['flop', 'artcollective'].join(''),
  ['Flop', ' Art Collective'].join('')
];

const forbiddenLocalEnvFiles = [
  '.env',
  '.env.local',
  '.env.development',
  '.env.production'
];

const requiredBlankExampleSecrets = [
  'STAGE_API_TOKEN',
  'STAGE_PREVIEW_TOKEN',
  'STAGE_PREVIEW_SECRET',
  'PUBLIC_NEWSLETTER_FORM_TOKEN',
  'PUBLIC_STAGE_ANALYTICS_SCRIPT_URL',
  'PUBLIC_STAGE_ANALYTICS_WEBSITE_ID',
  'PUBLIC_STAGE_ANALYTICS_REPLAY_SCRIPT_URL',
  'CLOUDFLARE_PAGES_DEPLOY_HOOK_URL',
  'STAGE_WEBHOOK_SECRET'
];

const browserFacingRoots = [
  'src/components/',
  'src/layouts/',
  'src/pages/',
  'optional/newsletter/'
];

const requiredOptionalCopyTargets = new Map([
  ['optional/cloudflare-rebuild/README.md', ['functions/api/stage/rebuild.ts']],
  ['optional/newsletter/README.md', ['src/components/newsletter/NewsletterForm.astro']],
  ['optional/preview/README.md', ['src/lib/stage/preview.ts', 'src/pages/api/preview.ts']]
]);

function fail(message) {
  console.error(`[template-guard] ${message}`);
  process.exitCode = 1;
}

function read(relativePath) {
  return readFileSync(join(root, relativePath), 'utf8');
}

function exists(relativePath) {
  try {
    statSync(join(root, relativePath));
    return true;
  } catch {
    return false;
  }
}

function isGitIgnored(relativePath) {
  try {
    execFileSync('git', ['check-ignore', '--quiet', relativePath], { cwd: root, stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function walk(directory) {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = join(directory, entry.name);
    const relativePath = relative(root, absolutePath);

    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        files.push(...walk(absolutePath));
      }
      continue;
    }

    if (entry.isFile() && scannedExtensions.has(extname(entry.name))) {
      files.push(relativePath);
    }
  }

  return files;
}

for (const file of requiredFiles) {
  if (!exists(file)) {
    fail(`Missing required template file: ${file}`);
  }
}

for (const file of forbiddenLocalEnvFiles) {
  if (exists(file) && !isGitIgnored(file)) {
    fail(`Do not commit local environment file: ${file}`);
  }
}

const envExample = read('.env.example');
for (const variable of requiredBlankExampleSecrets) {
  const match = envExample.match(new RegExp(`^${variable}=(.*)$`, 'm'));
  if (!match) {
    fail(`Missing ${variable} in .env.example`);
    continue;
  }
  if (match[1].trim() !== '') {
    fail(`${variable} must stay blank in .env.example`);
  }
}

const packageJson = JSON.parse(read('package.json'));
for (const section of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
  const dependencies = packageJson[section] && typeof packageJson[section] === 'object' ? packageJson[section] : {};
  for (const [name, version] of Object.entries(dependencies)) {
    if (name.startsWith('@ooopsstudio/') && typeof version === 'string' && /^(file:|link:|\.\.?\/)/.test(version)) {
      fail(`Use a published semver version for ${name}; local dependency paths are not allowed in ${section}.`);
    }
  }
}

for (const [readmePath, copyTargets] of requiredOptionalCopyTargets) {
  const source = read(readmePath);
  for (const target of copyTargets) {
    if (!source.includes(target)) {
      fail(`${readmePath} must document copy target ${target}`);
    }
  }
}

const stageSource = [
  read('src/lib/stage/client.ts'),
  read('src/lib/stage/homepage.ts'),
  read('src/lib/posts/client.ts')
].join('\n');

if (!stageSource.includes('getStageSingle') && !stageSource.includes('/content/singles/')) {
  fail('Expected Stage API v1 single-type client usage was not found.');
}

if (!stageSource.includes('getStageCollectionEntries') && !stageSource.includes('/content/collections/')) {
  fail('Expected Stage API v1 collection client usage was not found.');
}

for (const file of walk(root)) {
  const source = read(file);
  for (const fragment of forbiddenFragments) {
    if (source.includes(fragment)) {
      fail(`Forbidden template fragment "${fragment}" found in ${file}`);
    }
  }

  if (browserFacingRoots.some((prefix) => file.startsWith(prefix))) {
    for (const secret of ['STAGE_API_TOKEN', 'STAGE_PREVIEW_TOKEN', 'STAGE_PREVIEW_SECRET']) {
      if (source.includes(secret)) {
        fail(`Browser-facing file must not reference ${secret}: ${file}`);
      }
    }
  }
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log('[template-guard] Stage API and template guard passed.');
