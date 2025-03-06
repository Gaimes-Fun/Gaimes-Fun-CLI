# Creating 2D Games with MAGA AI

This guide will walk you through the process of creating a 2D game using the MAGA CLI tool. The MAGA CLI provides a powerful template based on Phaser 3, React, and TypeScript to help you quickly start building your own 2D games.

## Table of Contents

- [Creating 2D Games with MAGA AI](#creating-2d-games-with-maga-ai)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
    - [Install Node.js](#install-nodejs)
    - [Install Cursor](#install-cursor)
    - [Install pnpm](#install-pnpm)
  - [Creating a New 2D Game Project](#creating-a-new-2d-game-project)
  - [Running Your Game](#running-your-game)
  - [Game Idea](#game-idea)
    - [Example AI Prompts for Game Design](#example-ai-prompts-for-game-design)
  - [Building Your Game with Cursor](#building-your-game-with-cursor)
    - [Generate Code with Cursor](#generate-code-with-cursor)
    - [Testing and Debugging](#testing-and-debugging)
  - [Deploying Your Game](#deploying-your-game)
  - [Advanced Topics](#advanced-topics)
    - [Game Assets](#game-assets)
    - [Sound Effects](#sound-effects)

## Prerequisites

Before you begin, make sure you have the following installed:

- You know how to use terminal or command line [MacOS Tutorial](https://www.youtube.com/watch?v=FfT8OfMpARM), [Windows Tutorial](https://www.youtube.com/watch?v=jO4dbUnfRlU). 
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/) (recommended)
- [Cursor](https://cursor.com/) (the world's best AI-powered code editor)
- Basic knowledge of JavaScript/TypeScript
- Basic understanding of game development concepts

## Installation

### Install Node.js

You can install Node.js from [here](https://nodejs.org/en/download/).

### Install Cursor

You can install Cursor from [here](https://cursor.com/).

### Install pnpm

```
npm install -g pnpm@latest-10
```

## Creating a New 2D Game Project

To create a new 2D game project, run the following command:

```bash
npx maga-ai@latest init my-2d-game
```

When prompted, select the "2D Game" template. This will create a new directory with the name you specified, containing all the necessary files to start developing your 2D game.

After the project is created, navigate to the project directory and install the dependencies:

```bash
cd my-2d-game
npm run install:all
```

Or with pnpm:

```bash
cd my-2d-game
pnpm run install:all
```

## Running Your Game

To run your game in development mode, use the following command:

```bash
npm run dev
```

You can visit [http://localhost:8080](http://localhost:8080) to see your game.

This will start a local development server and open your game in the browser. The development server includes hot-reloading, so any changes you make to your code will automatically be reflected in the browser.

## Game Idea

Before diving into the technical aspects of game development, it's important to have a clear game idea and design document. This will serve as your roadmap throughout the development process.

Open a file called `game-design.md` in your project root to document your game concept:

In this file, you should outline:

1. **Game Concept**: A brief description of your game
2. **Core Mechanics**: The main gameplay mechanics
3. **Art Style**: The visual style of your game
4. **Target Audience**: Who will play your game
5. **Platforms**: Which platforms you're targeting
6. **Monetization**: How you plan to monetize your game (if applicable)

You can use AI tools like Grok or ChatGPT to help you brainstorm and refine your game design document. These tools can provide suggestions for game mechanics, art styles, and even help you flesh out your game's narrative.

For more detailed guidance on creating a game design document, see our [game-design.md](../templates/game-design.md) template.

### Example AI Prompts for Game Design

Here are some example prompts you can use with AI tools to help develop your game design:

1. "I want to create a 2D platformer game with a unique twist. Can you suggest 5 innovative mechanics that haven't been overused in the genre?"

2. "I'm designing a puzzle game about [theme]. What are some interesting puzzle mechanics that would fit this theme?"

3. "Help me develop a character progression system for my 2D RPG that feels rewarding but not overly complex."

4. "I need ideas for enemy types in my space shooter game. They should have varied attack patterns and require different strategies to defeat."

5. "Can you suggest a cohesive art style for a game about [theme] that would be feasible to implement with limited artistic resources?"

6. "Help me outline a simple but engaging story for my adventure game that can be told primarily through environmental storytelling."

7. "What are some effective ways to tutorialize the mechanics of my game without explicit text instructions?"

Remember that while AI can provide valuable suggestions and inspiration, the final creative decisions should be yours. Use AI as a collaborative tool to enhance your creativity, not replace it.

## Building Your Game with Cursor

### Generate Code with Cursor

Cursor is a powerful AI-powered code editor that can help you build your game. It uses AI to suggest code, fix bugs, and even write entire functions for you.

1. Open the game folder in Cursor and start coding.
2. Wait 2-3 minutes for Cursor to index the project.
3. Select 'Composer' tab in Cursor.
4. Add file `game-design.md` to context by clicking on the `+` button in the bottom left corner of Cursor and selecting `Add context`.
5. Ask Cursor to help you build your game.
   
Note: Sometimes Cursor generates code that's too long, so you can ask 'Show more' to see the full code.

Example prompts for Cursor:
- "Create a new scene for my game that implements a platformer level"
- "Help me implement player movement with keyboard controls"
- "Write a collision detection system for my game"

### Testing and Debugging

1. **Test your game** by running:

   ```bash
   npm run dev
   ```
   Visit [http://localhost:8080](http://localhost:8080) to see your game.

2. **Debug issues** using Cursor:
   - Check for errors in two places:
     - **Terminal**: Monitor the terminal where you ran `npm run dev` for build errors and server messages
     - **Browser Console**: Press F12 or right-click → Inspect → Console to check for runtime errors
   - Copy the complete error message from either source
   - Open the Composer tab in Cursor
   - Paste the error message and ask for a solution (e.g., "How can I fix this error?")
   - Implement Cursor's suggested fixes
   - Test your game again to verify the issue is resolved

   Cursor's AI can analyze error messages, identify the root cause, and provide targeted solutions for common game development issues.

## Deploying Your Game

To deploy your game to production:

1. **Create a GitHub account** if you don't have one at [GitHub.com](https://github.com/).

2. **Create a new GitHub repository** for your game:
   - Go to [GitHub.com](https://github.com/) and sign in
   - Click the "+" icon in the top-right corner and select "New repository"
   - Name your repository (e.g., "my-2d-game")
   - Choose public visibility
   - Click "Create repository"

3. **Push your code** to the repository:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repository-url>
   git push -u origin main
   ```
   Replace `<your-repository-url>` with your actual repository URL (e.g., `https://github.com/username/my-2d-game.git`).

4. **Deploy your game**:
   - Visit [https://maga.ai/deploy](https://maga.ai/deploy)
   - Connect your GitHub repository when prompted
   - Click the "Deploy" button
   - Wait for the deployment process to complete

5. **Access your game**:
   - Once deployment is successful, you'll receive a unique URL
   - Share this URL with others to let them play your game
   - Your game is now live on the web!

The deployment process automatically optimizes your game for production, ensuring fast loading times and smooth gameplay for your users.

## Advanced Topics

### Game Assets

You want to have a good collection of assets for your game.

1. You can visit open source asset sites like [Itch.io](https://itch.io/game-assets), [OpenGameArt](https://opengameart.org/), [GameDevMarket](https://www.gamedevmarket.net/), [CraftPix](https://craftpix.net/), search for assets for your game and download them.
2. Because you download PNG files, you need to convert them to spritesheets. You can download tools like [Spritesheet Splitter](https://github.com/Maga-AI/Spritesheet-Splitter/releases).

### Sound Effects

You can download sound effects from [Itch.io](https://itch.io/game-assets/tag-sound-effects) or [GameDevMarket](https://www.gamedevmarket.net/category/audio/sound-fx).

Happy game development with MAGA.AI! 