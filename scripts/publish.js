#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');

// Parse command line arguments
const args = process.argv.slice(2);
const flags = args.filter(arg => arg.startsWith('--'));
const nonFlags = args.filter(arg => !arg.startsWith('--'));
const versionTypeArg = nonFlags[0]; // May be undefined if no version type specified
const prereleaseTagArg = nonFlags[1]; // May be undefined if no prerelease tag specified
const shouldTag = flags.includes('--tag');
const dryRun = flags.includes('--dry-run');

// Additional options to pass to npm publish
const publishArgs = args.filter(
  arg =>
    !['patch', 'minor', 'major', 'prerelease'].includes(arg) &&
    !flags.includes(arg) &&
    arg !== versionTypeArg &&
    arg !== prereleaseTagArg,
);

// Get current version from package.json
const packageJsonPath = path.resolve(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const currentVersion = packageJson.version;

async function main() {
  let versionType = versionTypeArg;
  let prereleaseTag = prereleaseTagArg;

  // If no version type provided, prompt for selection
  if (!versionType) {
    // Extract the base version without any prerelease suffix for display
    const baseVersion = currentVersion.replace(/-.*$/, '');
    const [major, minor, patch] = baseVersion.split('.').map(Number);

    const response = await inquirer.prompt([
      {
        type: 'list',
        name: 'versionType',
        message: `Select a new version (currently ${currentVersion})`,
        choices: [
          { name: `Patch (${major}.${minor}.${patch + 1})`, value: 'patch' },
          { name: `Minor (${major}.${minor + 1}.0)`, value: 'minor' },
          { name: `Major (${major + 1}.0.0)`, value: 'major' },
          { name: `Prepatch (${major}.${minor}.${patch + 1}-alpha.0)`, value: 'prepatch' },
          { name: `Preminor (${major}.${minor + 1}.0-alpha.0)`, value: 'preminor' },
          { name: `Premajor (${major + 1}.0.0-alpha.0)`, value: 'premajor' },
          { name: 'Custom Prerelease', value: 'prerelease' },
          { name: 'Custom Version', value: 'custom' },
        ],
      },
    ]);

    versionType = response.versionType;

    // If prerelease is selected but no tag is provided, prompt for it
    if (versionType === 'prerelease' && !prereleaseTag) {
      const prereleaseResponse = await inquirer.prompt([
        {
          type: 'list',
          name: 'prereleaseType',
          message: 'Select prerelease type:',
          choices: [
            { name: 'alpha', value: 'alpha' },
            { name: 'beta', value: 'beta' },
            { name: 'rc (Release Candidate)', value: 'rc' },
            { name: 'Other (specify)', value: 'other' },
          ],
        },
      ]);

      prereleaseTag = prereleaseResponse.prereleaseType;

      if (prereleaseTag === 'other') {
        const customTagResponse = await inquirer.prompt([
          {
            type: 'input',
            name: 'customTag',
            message: 'Enter prerelease tag:',
            validate: input => {
              if (input.match(/^[0-9A-Za-z-]+$/)) {
                return true;
              }
              return 'Please enter a valid prerelease tag (alphanumeric characters and hyphens only)';
            },
          },
        ]);
        prereleaseTag = customTagResponse.customTag;
      }
    }
  }

  try {
    // First, update the version
    console.log(`Updating version (${versionType}${prereleaseTag ? ` ${prereleaseTag}` : ''})...`);
    const versionScript = path.resolve(__dirname, 'version.js');
    const versionCmd = `node ${versionScript} ${versionType}${
      prereleaseTag ? ` ${prereleaseTag}` : ''
    } ${shouldTag ? '--tag' : ''} ${dryRun ? '--dry-run' : ''} ${
      flags.includes('--commit') ? '--commit' : ''
    }`;
    execSync(versionCmd, { stdio: 'inherit' });

    // If dry run, don't actually publish
    if (dryRun) {
      console.log('\nDry run complete. No package was published.');
      return;
    }

    // Confirm before publishing
    if (!flags.includes('--yes')) {
      const { confirmPublish } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirmPublish',
          message: 'Are you sure you want to publish to npm?',
          default: false,
        },
      ]);

      if (!confirmPublish) {
        console.log('\nPublish canceled.');
        return;
      }
    }

    // Then, publish to npm
    console.log('\nPublishing to npm...');
    const publishCmd = `npm publish ${publishArgs.join(' ')}`;
    console.log(`Running: ${publishCmd}`);
    execSync(publishCmd, { stdio: 'inherit' });

    console.log('\nPackage published successfully!');
  } catch (error) {
    console.error('\nError during publish process:', error.message);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
