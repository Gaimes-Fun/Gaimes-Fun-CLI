#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

// Path to templates directory
const templatesDir = path.resolve(__dirname, '../templates');

// Files and directories to remove from each template
const toRemove = [
  'node_modules',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  '.DS_Store'
];

// Function to clean a template directory
async function cleanTemplateDir(templatePath) {
  console.log(`Cleaning template: ${path.basename(templatePath)}`);
  
  for (const item of toRemove) {
    const itemPath = path.join(templatePath, item);
    
    if (await fs.pathExists(itemPath)) {
      console.log(`  Removing: ${item}`);
      await fs.remove(itemPath);
    }
  }
}

// Main function
async function main() {
  try {
    // Get all template directories
    const templates = await fs.readdir(templatesDir);
    
    // Process each template directory
    for (const template of templates) {
      const templatePath = path.join(templatesDir, template);
      const stats = await fs.stat(templatePath);
      
      if (stats.isDirectory()) {
        await cleanTemplateDir(templatePath);
      }
    }
    
    console.log('All templates cleaned successfully!');
  } catch (error) {
    console.error('Error cleaning templates:', error.message);
    process.exit(1);
  }
}

// Run the main function
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
}); 