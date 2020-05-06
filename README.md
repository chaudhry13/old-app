# Human Risks Ionic App

The Human Risks Ionic app for both Android and IOS.

## Installation

Install all dependencies with:

```bash
npm install
```

In the root directory of the project.

## Running the app (Debug)

The app can be run with:

```bash
ionic serve
```

To run it in the browser. _Here some features won't work, e.g. camera_.


Run the app on an Android device with
```bash
ionic cordova run android
```

When developing with an Android phone, you can use the following to see console.log()'s and get live-reload:
```bash
ionic cordova run android --device -l -s -c
```

Or on IOS device with
```bash
ionic cordova run ios
```
## Run the app in Android Studio or XCode

To prepare the app for building in Android Studio or XCode, run
```bash
ionic cordova prepare android
```

Or
```bash
ionic cordova prepare ios
```

When the app is prepared open the project in Android Studio or XCode.

*Make sure to open the XCode Workspace file when using XCode to make sure all dependencies are loaded*
