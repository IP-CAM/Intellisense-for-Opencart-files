# OpenCart Intellisense

A Visual Studio Code extension that provides intellisense and "Go to Definition" functionality for OpenCart files. This extension helps developers navigate between controller and model files more efficiently by enabling Ctrl+Click navigation on model references.

## Features

- **Go to Definition**: Ctrl+Click on model methods to jump directly to their definitions
- **Model Path Resolution**: Automatically resolves paths for OpenCart model patterns like `$this->model_api_test`
- **PHP Support**: Works with all PHP files in your OpenCart project

## Installation

### From VSIX File

1. **Package the Extension**
   ```bash
   # Install vsce globally
   npm install -g @vscode/vsce

   # Navigate to extension directory
   cd opencart-intellisense

   # Create .vsix package
   vsce package
   ```

2. **Install in VS Code**

   Choose one of these methods:

   **Method 1 - Using VS Code UI:**
   1. Open VS Code
   2. Press `Ctrl+Shift+X` to open Extensions panel
   3. Click "..." (More Actions)
   4. Select "Install from VSIX..."
   5. Navigate to and select your `.vsix` file

   **Method 2 - Using Command Line:**
   ```bash
   code --install-extension opencart-intellisense-0.0.1.vsix
   ```

   **Method 3 - Using Command Palette:**
   1. Press `Ctrl+Shift+P`
   2. Type "Extensions: Install from VSIX"
   3. Press Enter
   4. Select your `.vsix` file

3. **Reload VS Code** when prompted

## Usage

1. Open any PHP file in your OpenCart project
2. Hold Ctrl and hover over a model reference (e.g., `$this->model_api_test->getData()`)
3. Click to navigate to the model definition

## File Structure

The extension expects your OpenCart project to follow the standard structure:
```
your-opencart-project/
└── model/
    └── api/
        └── Test.php
```

## Development

1. **Clone the Repository**
   ```bash
   git clone [repository-url]
   cd opencart-intellisense
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Compile**
   ```bash
   npm run compile
   ```

4. **Debug**
   - Press F5 in VS Code to launch the extension in debug mode
   - Use the Debug Console to view logs and errors

## Uninstallation

1. Open VS Code
2. Go to Extensions panel (Ctrl+Shift+X)
3. Find "OpenCart Intellisense"
4. Click the gear icon and select "Uninstall"

## Requirements

- Visual Studio Code ^1.85.0
- OpenCart project with standard directory structure

## Known Issues

- Currently only supports model, class, library resolution for standard OpenCart naming patterns
- Path resolution is case-sensitive

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Release Notes

### 0.0.1

Initial release:
- Basic model resolution
- Go to definition support
- PHP file support
