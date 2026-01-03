#!/bin/bash
set -e

# Define variables
FLUTTER_VERSION="3.19.0" # Recent stable version
INSTALL_DIR="$HOME/flutter_sdk"
FLUTTER_ZIP="flutter_macos_${FLUTTER_VERSION}-stable.zip"
FLUTTER_URL="https://storage.googleapis.com/flutter_infra_release/releases/stable/macos/${FLUTTER_ZIP}"

echo "🎃 Starting Flutter SDK Installation..."

# Create installation directory
mkdir -p "$INSTALL_DIR"
cd "$INSTALL_DIR"

# Download Flutter
if [ ! -f "$FLUTTER_ZIP" ]; then
    echo "Downloading Flutter SDK v${FLUTTER_VERSION}..."
    curl -O "$FLUTTER_URL"
else
    echo "Flutter ZIP already exists, skipping download."
fi

# Extract
echo "Extracting..."
unzip -q -o "$FLUTTER_ZIP"

# Add to PATH (temporary for this script's session/usage)
export PATH="$INSTALL_DIR/flutter/bin:$PATH"

echo "Flutter installed successfully!"
echo "Verifying installation..."
flutter --version

echo "Installation complete. Please add the following to your shell profile (.zshrc or .bash_profile):"
echo "export PATH=\"$INSTALL_DIR/flutter/bin:\$PATH\""
