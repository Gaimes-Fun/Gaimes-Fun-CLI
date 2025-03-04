#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const inquirer = require('inquirer');

// Path to package.json
const packageJsonPath = path.resolve(__dirname, '../package.json');

// Read the current package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Get the current version
const currentVersion = packageJson.version;
console.log(`Current version: ${currentVersion}`);

// Parse command line arguments
const args = process.argv.slice(2);
const flags = args.filter(arg => arg.startsWith('--'));
const nonFlags = args.filter(arg => !arg.startsWith('--'));
const versionTypeArg = nonFlags[0]; // May be undefined if no version type specified
const prereleaseTagArg = nonFlags[1]; // May be undefined if no prerelease tag specified
const dryRun = flags.includes('--dry-run');

// Valid version types
const validTypes = [
  'major',
  'minor',
  'patch',
  'premajor',
  'preminor',
  'prepatch',
  'prerelease',
  'custom',
];

// Function to validate a specific version
function isValidVersion(version) {
  // Support for standard semver and pre-release versions
  return version.match(
    /^\d+\.\d+\.\d+(-[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?(\+[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?$/,
  );
}

// Function to process version update
async function processVersionUpdate(versionType, prereleaseTag) {
  let newVersion;

  // If custom version is selected, prompt for the specific version
  if (versionType === 'custom') {
    const response = await inquirer.prompt([
      {
        type: 'input',
        name: 'customVersion',
        message: 'Enter the specific version (e.g., 1.2.3 or 1.2.3-alpha.1):',
        validate: input => {
          if (isValidVersion(input)) {
            return true;
          }
          return 'Please enter a valid version in the format x.y.z or x.y.z-prerelease';
        },
      },
    ]);
    newVersion = response.customVersion;
  } else if (versionType === 'prerelease') {
    // Handle prerelease versioning
    let finalPrereleaseTag = prereleaseTag;

    if (!finalPrereleaseTag) {
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

      finalPrereleaseTag = prereleaseResponse.prereleaseType;

      if (finalPrereleaseTag === 'other') {
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
        finalPrereleaseTag = customTagResponse.customTag;
      }
    }

    // Extract the base version without any prerelease suffix
    const baseVersion = currentVersion.replace(/-.*$/, '');

    // Check if current version already has the same prerelease tag
    const prereleaseMatch = currentVersion.match(/^(\d+\.\d+\.\d+)-([0-9A-Za-z-]+)\.(\d+)$/);

    if (prereleaseMatch && prereleaseMatch[2] === finalPrereleaseTag) {
      // Increment the prerelease number
      const prereleaseNum = parseInt(prereleaseMatch[3]) + 1;
      newVersion = `${baseVersion}-${finalPrereleaseTag}.${prereleaseNum}`;
    } else {
      // Start a new prerelease
      newVersion = `${baseVersion}-${finalPrereleaseTag}.0`;
    }
  } else if (
    versionType === 'prepatch' ||
    versionType === 'preminor' ||
    versionType === 'premajor'
  ) {
    // Extract the base version without any prerelease suffix
    const baseVersion = currentVersion.replace(/-.*$/, '');
    const [major, minor, patch] = baseVersion.split('.').map(Number);

    // Calculate the new base version based on the version type
    let newBaseVersion;
    switch (versionType) {
      case 'premajor':
        newBaseVersion = `${major + 1}.0.0`;
        break;
      case 'preminor':
        newBaseVersion = `${major}.${minor + 1}.0`;
        break;
      case 'prepatch':
      default:
        newBaseVersion = `${major}.${minor}.${patch + 1}`;
        break;
    }

    // Add alpha.0 suffix
    newVersion = `${newBaseVersion}-alpha.0`;
  } else {
    // Extract the base version without any prerelease suffix
    const baseVersion = currentVersion.replace(/-.*$/, '');
    const [major, minor, patch] = baseVersion.split('.').map(Number);

    // Calculate the new version based on the version type
    switch (versionType) {
      case 'major':
        newVersion = `${major + 1}.0.0`;
        break;
      case 'minor':
        newVersion = `${major}.${minor + 1}.0`;
        break;
      case 'patch':
      default:
        newVersion = `${major}.${minor}.${patch + 1}`;
        break;
    }
  }

  console.log(`New version will be: ${newVersion}`);

  // If dry run, don't actually update the file
  if (dryRun) {
    console.log('Dry run - no changes made');
    return;
  }

  // Update the version in package.json
  packageJson.version = newVersion;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

  console.log(`Updated version: ${newVersion}`);

  // Optionally commit the change
  if (flags.includes('--commit')) {
    try {
      execSync('git add package.json');
      execSync(`git commit -m "Bump version to ${newVersion}"`);
      console.log('Changes committed to git');

      if (flags.includes('--tag')) {
        execSync(`git tag v${newVersion}`);
        console.log(`Created tag: v${newVersion}`);
      }
    } catch (error) {
      console.error('Error committing changes:', error.message);
    }
  }

  console.log('Version update complete. You can now publish with:');
  console.log('npm publish');
}

// Main function
async function main() {
  // If version type is provided and valid, use it directly
  if (versionTypeArg) {
    if (validTypes.includes(versionTypeArg) || isValidVersion(versionTypeArg)) {
      await processVersionUpdate(versionTypeArg, prereleaseTagArg);
    } else {
      console.error(`Invalid version type: ${versionTypeArg}`);
      console.error(`Valid types: ${validTypes.join(', ')} or a specific version (e.g., 1.2.3)`);
      process.exit(1);
    }
  } else {
    // Extract the base version without any prerelease suffix for display
    const baseVersion = currentVersion.replace(/-.*$/, '');
    const [major, minor, patch] = baseVersion.split('.').map(Number);

    // No version type provided, use inquirer to prompt for selection
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

    await processVersionUpdate(response.versionType);
  }
}

// Run the main function
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
