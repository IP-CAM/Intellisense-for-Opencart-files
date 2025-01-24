# OpenCart Intellisense

[![Version](https://img.shields.io/visual-studio-marketplace/v/iabhitech.opencart-intellisense)](https://marketplace.visualstudio.com/items?itemName=iabhitech.opencart-intellisense)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/iabhitech.opencart-intellisense)](https://marketplace.visualstudio.com/items?itemName=iabhitech.opencart-intellisense)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/iabhitech.opencart-intellisense)](https://marketplace.visualstudio.com/items?itemName=iabhitech.opencart-intellisense)

A Visual Studio Code extension that provides intellisense and "Go to Definition" functionality for OpenCart model files. This extension helps developers navigate between controller and model files more efficiently by enabling Ctrl+Click navigation on model references.

## Features

- **Go to Definition**: Navigate to model function definitions
- **Multi-Context Support**: Works with both admin and catalog contexts
- **PHP Support**: Works with all PHP files in your OpenCart project

## Installation

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "OpenCart Intellisense"
4. Click Install

Or install directly from VS Code Marketplace:
[OpenCart Intellisense](https://marketplace.visualstudio.com/items?itemName=iabhitech.opencart-intellisense)

## Configuration

The extension supports custom path configuration for different OpenCart directory structures. You can configure these settings in your VS Code settings:

1. Open VS Code Settings (File > Preferences > Settings)
2. Search for "OpenCart Intellisense"
3. Configure the following settings:

```json
{
  "opencartIntellisense.paths": {
    "admin": "admin",
    "catalog": "catalog",
    "system": "system"
  }
}
```

## Usage

1. Open any PHP file in your OpenCart project
2. Hold Ctrl and hover over a model reference (e.g., `$this->model_api_test->getData()`) to go to definition
3. Simply hover over a model method to see its documentation and declaration

### Available Settings

- `opencartIntellisense.paths`: Object containing custom paths for OpenCart directories
  - `admin`: Path to admin directory (default: "admin")
  - `catalog`: Path to catalog directory (default: "catalog")
  - `system`: Path to system directory (default: "system")

### Example Directory Structure

The extension now supports structures like:

```
your-opencart-project/
├── app/
│   ├── admin/
│   │   ├── controller/
│   │   ├── model/
│   │   └── view/
│   ├── catalog/
│   │   ├── controller/
│   │   ├── model/
│   │   └── view/
│   └── system/
│       └── library/
```

## Path Resolution Logic

The extension follows this order when looking for model files:

1. Checks the current context (admin/catalog) based on the file you're editing
2. Checks the system directory
3. Checks the opposite context
4. Checks the root directory

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

### 0.0.4

- Enhance "Go to Definition" to navigate precisely to function declarations
- Added hover functionality to show function documentation and declaration

### 0.0.1 to 0.0.3

Initial release:
- Basic model resolution
- Go to definition support
- PHP file support
