#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import { createProject } from './createProject';

const program = new Command();

program
  .name('maga')
  .description('CLI to bootstrap projects from templates')
  .version('1.0.0');

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
          default: 'my-maga-game',
          validate: (input) => {
            if (/^([A-Za-z\-_\d])+$/.test(input)) return true;
            return 'Project name may only include letters, numbers, underscores and hashes.';
          }
        }
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
        }
      ]);
      
      gameType = answers.gameType;
    }
    
    try {
      const currentDir = process.cwd();
      const projectDir = path.join(currentDir, projectName);
      
      // Create the main project directory
      await fs.ensureDir(projectDir);
      
      // Create server directory and copy server template
      const serverDir = path.join(projectDir, 'server');
      await fs.ensureDir(serverDir);
      console.log(chalk.blue(`Creating server folder...`));
      await createProject(serverDir, 'server', false);
      
      // Create UI directory and copy game template
      const uiDir = path.join(projectDir, 'ui');
      await fs.ensureDir(uiDir);
      
      const gameTemplate = `game-${gameType}`;
      console.log(chalk.blue(`Creating UI folder with ${gameTemplate} template...`));
      await createProject(uiDir, gameTemplate, false);
      
      // Create a root package.json for the project
      const rootPackageJson = {
        name: projectName,
        version: '1.0.0',
        description: `${projectName} project with server and UI`,
        scripts: {
          "dev:server": "cd server && npm run dev",
          "dev:ui": "cd ui && npm run dev",
          "install:all": "npm install && cd server && npm install && cd ../ui && npm install",
          "dev": "concurrently \"npm run dev:server\" \"npm run dev:ui\""
        },
        dependencies: {
          "concurrently": "^9.1.2"
        }
      };
      
      await fs.writeJson(path.join(projectDir, 'package.json'), rootPackageJson, { spaces: 2 });
      
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
      
      console.log(chalk.green(`✅ Project ${projectName} created successfully!`));
      console.log(chalk.yellow(`To get started:`));
      console.log(chalk.white(`  cd ${projectName}`));
      console.log(chalk.white(`  npm run install:all`));
      console.log(chalk.white(`  npm run dev`));
    } catch (error) {
      console.error(chalk.red('Failed to create project:'), error);
    }
  });

program.parse(); 