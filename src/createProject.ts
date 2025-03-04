import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

export async function createProject(
  projectTarget: string,
  templateName: string,
  askOverwrite: boolean = true,
  customProjectName?: string,
): Promise<void> {
  // If projectTarget is a string, use it as the target directory
  // Otherwise, create a directory with the project name in the current directory
  const projectDir = path.isAbsolute(projectTarget)
    ? projectTarget
    : path.join(process.cwd(), projectTarget);

  // Use custom project name if provided, otherwise use directory name
  const projectName = customProjectName || path.basename(projectDir);
  const templateDir = path.join(__dirname, '../templates', templateName);

  // Check if template exists
  if (!(await fs.pathExists(templateDir))) {
    const availableTemplates = await fs
      .readdir(path.join(__dirname, '../templates'))
      .catch(() => []);

    if (availableTemplates.length > 0) {
      throw new Error(
        `Template "${templateName}" not found. Available templates: ${availableTemplates.join(
          ', ',
        )}`,
      );
    } else {
      throw new Error(`Template "${templateName}" not found. No templates are available.`);
    }
  }

  // Check if project directory already exists
  if (askOverwrite && (await fs.pathExists(projectDir))) {
    const { overwrite } = await import('inquirer').then(m =>
      m.default.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: `Directory ${path.basename(projectDir)} already exists. Overwrite?`,
          default: false,
        },
      ]),
    );

    if (!overwrite) {
      throw new Error('Project creation cancelled.');
    }

    await fs.remove(projectDir);
  }

  // Create directory if it doesn't exist
  await fs.ensureDir(projectDir);

  // Copy template to project directory
  await fs.copy(templateDir, projectDir);

  // Update package.json with project name
  const packageJsonPath = path.join(projectDir, 'package.json');
  if (await fs.pathExists(packageJsonPath)) {
    const packageJson = await fs.readJson(packageJsonPath);
    packageJson.name = projectName;
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  }

  // Update GAME_INFO configuration with project name
  const gameConfigPath = path.join(projectDir, 'src/configs/game.ts');
  if (await fs.pathExists(gameConfigPath)) {
    let gameConfigContent = await fs.readFile(gameConfigPath, 'utf8');
    gameConfigContent = gameConfigContent.replace(/\{\{PROJECT_NAME\}\}/g, projectName);
    await fs.writeFile(gameConfigPath, gameConfigContent, 'utf8');
  }

  console.log(chalk.green(`Template copied to ${projectDir}`));
}
