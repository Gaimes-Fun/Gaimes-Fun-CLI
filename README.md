# MAGA AI

## Create 2D and 3D Games with AI-Powered Technology

MAGA AI is a revolutionary platform that enables game developers and creators to build stunning 2D and 3D games using the power of artificial intelligence, seamlessly integrated with Cursor AI.

## Features

- **AI-Powered Game Creation**: Generate game assets, levels, and mechanics using advanced AI models
- **2D and 3D Support**: Create games in either 2D or 3D environments based on your project needs
- **Cursor AI Integration**: Leverage the capabilities of Cursor AI for intelligent code completion and suggestions
- **Intuitive CLI**: Simple command-line interface for managing your game projects
- **Asset Generation**: Create textures, models, animations, and sound effects with AI assistance
- **Rapid Prototyping**: Go from concept to playable prototype in record time

## Getting Started

### Installation

You can use MAGA AI in two ways:

#### Option 1: Global Installation

```bash
npm install -g maga-ai
```

Then create a new project:

```bash
maga-ai init my-awesome-game
cd my-awesome-game
```

#### Option 2: Using npx (No Installation Required)

You can use npx to run MAGA AI without installing it globally:

```bash
npx maga-ai@latest init my-awesome-game
cd my-awesome-game
```

### Generate Game Assets

```bash
maga-ai generate asset --type model --prompt "futuristic spaceship"
```

## Documentation

For full documentation, visit [our documentation site](https://docs.maga.ai).

## Examples

Check out the `examples` directory for sample games created with MAGA AI:

- 2D platformer: `maga-ai init --template game-2d my-2d-game`
- 3D first-person adventure: `maga-ai init --template game-3d my-3d-game`
- Top-down RPG: `maga-ai init --template game-2d --variant rpg my-rpg`
- Puzzle game: `maga-ai init --template game-2d --variant puzzle my-puzzle`

## Requirements

- Node.js 16+
- Cursor AI (for enhanced development experience)
- OpenGL compatible graphics card for 3D games

## Community

Join our community to share your creations, get help, and contribute to the platform:

- [Discord](https://discord.gg/maga-ai)
- [Twitter](https://twitter.com/maga_ai)
- [GitHub](https://github.com/maga-ai)

## License

MIT

---

## Development and Publishing

### Templates

The `templates` directory contains project templates that can be used to generate new projects. When publishing to npm, the following files are automatically cleaned from the templates:

- `node_modules`
- `package-lock.json`
- `yarn.lock`
- `pnpm-lock.yaml`
- `.DS_Store`

You can manually clean the templates by running:

```bash
npm run clean-templates
```

### Versioning and Publishing

This package includes custom scripts to manage versioning and publishing to npm:

#### Version Management

Update the version number in package.json:

```bash
# Interactive version selection
npm run version [type] [tag]
```

Where:
- `[type]` (optional): `patch`, `minor`, `major`, `prerelease`, or `custom`
- `[tag]` (optional): For prerelease versions, e.g., `alpha`, `beta`, `rc`

Examples:
```bash
npm run version                  # Interactive selection
npm run version patch            # 1.0.0 -> 1.0.1
npm run version minor            # 1.0.0 -> 1.1.0
npm run version major            # 1.0.0 -> 2.0.0
npm run version prerelease alpha # 1.0.0 -> 1.0.0-alpha.0
npm run version custom           # Prompts for custom version
```

Additional flags:
- `--commit`: Automatically commit the version change
- `--tag`: Create a git tag for the new version
- `--dry-run`: Show what would happen without making changes

#### Publishing to npm

Combined version update and npm publish:

```bash
# Interactive version selection and publishing
npm run release [type] [tag]
```

Where:
- `[type]` (optional): `patch`, `minor`, `major`, `prerelease`, or `custom`
- `[tag]` (optional): For prerelease versions, e.g., `alpha`, `beta`, `rc`

Examples:
```bash
npm run release                  # Interactive selection
npm run release patch            # Update patch and publish
npm run release prerelease beta  # Update beta prerelease and publish
npm run dry-run                  # Dry run with interactive selection
```

Additional flags:
- `--tag`: Create a git tag for the new version
- `--yes`: Skip the confirmation prompt before publishing
- `--dry-run`: Perform a dry run without actually publishing

#### Using the Latest Version

After publishing, users can access the latest version using npx:

```bash
npx maga-ai@latest init my-project
```

For specific versions or tags:

```bash
npx maga-ai@0.0.1-alpha.4 init my-project  # Specific version
npx maga-ai@alpha init my-project          # Latest alpha version
```

---

Made with ❤️ by the MAGA AI Team
