# Human Risks Ionic App

The Human Risks Ionic app for both Android and IOS.

## Installation

Make sure you have installed nodejs version 10 or higher.

Install the Ionic CLI and ionic angular packages:
```bash
npm install -g @ionic/cli
npm install @ionic/angular@latest --save
```

Also, make sure XCode and ios-sim and ios-deploy is installed:

```bash
xcode-select --install
npm install -g ios-sim
brew install ios-deploy
```

Install all pakcages dependencies with:

```bash
npm install
```

In the root directory of the project.

## Running the app (Debug)

The app can be run with:

```bash
ionic serve
```

This is open the app for debugging in the browser. For Mobile view, go to "Developer Tools" in your browser and select "Toggle device toolbar".


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
