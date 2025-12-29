# Pumpkin Mobile 🎃

A native mobile companion for the Pumpkin freelancer platform, built with Flutter.

## Features

- **Atmospheric Design**: Premium dark theme consistent with the web platform.
- **Secure Auth**: JWT-based authentication with secure local storage.
- **Live Dashboard**: Real-time revenue and project metrics.
- **Cross-Platform**: Ready for Android and iOS.

## Prerequisites

- [Flutter SDK](https://docs.flutter.dev/get-started/install) (>= 3.0.0)
- [Dart SDK](https://dart.dev/get-dart)
- Android Studio / Xcode (for emulators and native builds)

## Getting Started

1. **Install dependencies**

    ```bash
    flutter pub get
    ```

2. **Configure API URL**
    Open `lib/core/api_client.dart` and update `baseUrl`:
    - **Android Emulator**: Use `http://10.0.2.2:4000/api`
    - **iOS Simulator / Local**: Use `http://localhost:4000/api`
    - **Physical Device**: Use your machine's local IP (e.g., `http://192.168.1.x:4000/api`)

3. **Run the app**

    ```bash
    flutter run
    ```

## Architecture

- **State Management**: `Provider`
- **Networking**: `Dio`
- **Storage**: `flutter_secure_storage`
- **UI Components**: `Google Fonts` & `Lucide-style` icons
