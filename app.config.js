import 'dotenv/config';

export default {
  expo: {
    name: "Mix it up",
    slug: "MixItUp",
    version: "1.0.0",
    description: "A cocktail app for party experimentation",
    primaryColor: "#2E7D32",
    platforms: [
      "ios",
      "android"
    ],
    orientation: "portrait",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
      "**/*"
    ],
    splash: {
      image: "./assets/appIcon.png",
      resizeMode: "contain",
      backgroundColor: "#0f724c"
    },
    ios: {
      supportsTablet: true,
      icon: "./assets/appIcon.png",
      bundleIdentifier: "com.guidoroos.CocktailApp",
      buildNumber: "1.0.0",
      infoPlist: {
        CFBundleDisplayName: "Mix it up",
        ITSAppUsesNonExemptEncryption: false
      }
    },
    android: {
      package: "com.guidoroos.CocktailApp",
      versionCode: 1,
      jsEngine: "hermes",
      edgeToEdgeEnabled: true,
      permissions: [
        "INTERNET",
        "ACCESS_NETWORK_STATE"
      ],
      adaptiveIcon: {
        foregroundImage: "./assets/ic_launcher_foreground.png",
        backgroundColor: "#2E2E2E"
      }
    },
    plugins: [
      "expo-sqlite"
    ],
    extra: {
      eas: {
        projectId: "f9392efa-8cbe-4348-806d-1ab61d325ff5"
      },
      apiSecret: process.env.API_SECRET
    },
  }
};