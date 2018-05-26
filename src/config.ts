import path = require("path");

/**
 * Folder in which the app stores it's data
 *
 * Windows: %APPDATA%
 * Linux: $HOME
 * Mac: "Library/Preferences"
 */
const APPDATA = path.join(
  process.env.APPDATA
  || (
    process.platform === "darwin" ?
      path.join(process.env.HOME, "Library/Preferences") :
      process.env.HOME), ".edison"
);

interface Config {
  /** */
  appName: string;
  devMode: boolean;
  port: string;
  static: Readonly<{
    views: string;
    assets: string;
  }>;
  database: Readonly<{
    dir: string;
    images: string;
    elections: string;
    exportTemp: string;
  }>;
}

export const config: Readonly<Config> = {
  appName: "edison-booth",
  devMode: process.env.NODE_ENV === "development",
  port: process.env.PORT || "3000",
  static: {
    views: path.join(__dirname, "client", "views"),
    assets: path.join(__dirname, "client", "assets"),
  },
  database: {
    dir: APPDATA,
    images: path.join(APPDATA, "images"),
    elections: path.join(APPDATA, "data.db"),
    exportTemp: path.join(APPDATA, "export-temp")
  }
};
