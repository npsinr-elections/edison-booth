import { config } from "../../config";

import { getData } from "../utils/database";

/**
 * Structure for user password file
 */
export interface UserData {
  /** Encryption key encrypted itself, with the password */
  key: string;
  /** Hashed user password */
  password: string;
}

/**
 * Reads users.json and returns its contents.
 * @returns {database.UserData}
 */
export async function getUserData(): Promise<UserData> {
  console.log(config.database.users);
  return await getData(config.database.users);
}
