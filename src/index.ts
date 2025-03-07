#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { createProject } from './createProject';

const program = new Command();

program.name('gaimes-fun').description('CLI to bootstrap projects from templates').version('1.0.0');

program
  .command('init')
  .description('Create a new project with server and UI folders')
  .argument('[project-name]', 'Name of the project (optional)')
  .option('-g, --game <type>', 'Game type (2d or 3d)')
  .action(async (projectName, options) => {
    // If project name is not provided, ask the user
    if (!projectName) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: 'Enter a name for your project:',
          default: 'my-gaimes-game',
          validate: input => {
            if (/^([A-Za-z\-_\d])+$/.test(input)) return true;
            return 'Project name may only include letters, numbers, underscores and hashes.';
          },
        },
      ]);

      projectName = answers.projectName;
    }

    console.log(chalk.blue(`Creating new project: ${projectName}`));

    // If game type is not specified, ask the user
    let gameType = options.game;
    if (!gameType) {
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'gameType',
          message: 'Select a game type for the UI:',
          choices: ['2d', '3d'],
        },
      ]);

      gameType = answers.gameType;
    }

    try {
      const currentDir = process.cwd();
      const projectDir = path.join(currentDir, projectName);

      // Create the main project directory
      await fs.ensureDir(projectDir);

      // Copy .cursor directory to root project if it exists
      const cursorRulesDir = path.join(__dirname, '../templates/.cursor');
      const projectCursorDir = path.join(projectDir, '.cursor');

      if (await fs.pathExists(cursorRulesDir)) {
        await fs.copy(cursorRulesDir, projectCursorDir);
        console.log(chalk.blue(`Cursor rules copied to ${projectCursorDir}`));
      }

      // Create server directory and copy server template
      const serverDir = path.join(projectDir, 'server');
      await fs.ensureDir(serverDir);
      console.log(chalk.blue(`Creating server folder...`));
      await createProject(serverDir, 'server', false, projectName);

      // Create UI directory and copy game template
      const uiDir = path.join(projectDir, 'ui');
      await fs.ensureDir(uiDir);

      const gameTemplate = `game-${gameType}`;
      console.log(chalk.blue(`Creating UI folder with ${gameTemplate} template...`));
      await createProject(uiDir, gameTemplate, false, projectName);

      // Create a root package.json for the project
      const rootPackageJson = {
        name: projectName,
        version: '1.0.0',
        description: `${projectName} project with server and UI`,
        scripts: {
          'dev:server': 'cd server && npm run dev',
          'dev:ui': 'cd ui && npm run dev',
          'install:all': 'npm install && cd server && npm install && cd ../ui && npm install',
          dev: 'concurrently "npm run dev:server" "npm run dev:ui"',
        },
        dependencies: {
          concurrently: '^9.1.2',
        },
      };

      await fs.writeJson(path.join(projectDir, 'package.json'), rootPackageJson, { spaces: 2 });

      // Create a root-level .gitignore file
      const rootGitignoreContent = `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Dependencies
node_modules

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Project specific
server/dist
server/coverage
server/build
server/.env
!server/.env.example

ui/dist
ui/build
ui/.env
!ui/.env.example
ui/dist-ssr
ui/*.local
`;

      await fs.writeFile(path.join(projectDir, '.gitignore'), rootGitignoreContent);

      // Create a README.md for the project
      const readmeContent = `# ${projectName}

This project contains both server and UI components.

## Getting Started

1. Install dependencies:
   \`\`\`
   npm run install:all
   \`\`\`

2. Start development servers:
   \`\`\`
   npm run dev
   \`\`\`

## Project Structure

- \`/server\` - Backend server
- \`/ui\` - Frontend UI (${gameType} game)
`;

      await fs.writeFile(path.join(projectDir, 'README.md'), readmeContent);

      // Copy the game-design.md template to the project root
      const gameDesignTemplatePath = path.join(__dirname, '../templates/game-design.md');
      const projectGameDesignPath = path.join(projectDir, 'game-design.md');

      if (await fs.pathExists(gameDesignTemplatePath)) {
        await fs.copy(gameDesignTemplatePath, projectGameDesignPath);
        console.log(chalk.blue(`Game design document template copied to ${projectGameDesignPath}`));
      }

      console.log(chalk.green(`✅ Project ${projectName} created successfully!`));

      // Run npm run install:all command
      console.log(chalk.blue(`Installing dependencies...`));
      try {
        execSync('npm run install:all', {
          cwd: projectDir,
          stdio: 'inherit',
        });
        console.log(chalk.green(`✅ Dependencies installed successfully!`));
      } catch (error) {
        console.error(chalk.red(`Failed to install dependencies:`), error);
        console.log(chalk.yellow(`You can install dependencies manually by running:`));
        console.log(chalk.white(`  cd ${projectName}`));
        console.log(chalk.white(`  npm run install:all`));
      }

      console.log(chalk.yellow(`To start the development servers:`));
      console.log(chalk.white(`  cd ${projectName}`));
      console.log(chalk.white(`  npm run dev`));
    } catch (error) {
      console.error(chalk.red('Failed to create project:'), error);
    }
  });

program.parse();
