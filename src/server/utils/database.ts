/**
 * Defines Database file json structures, and also utility functions
 * for read/write operations on these files.
 *
 */
import Datastore = require("nedb");

import * as fileHandler from "./fileHandler";

export function dbfind(datastore: Datastore, query: any): Promise<any[]> {
  return new Promise((resolve, reject) => {
    datastore.find(query)
      .sort({ createdAt: 1 })
      .exec((err: any, docs: any[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
  });
}

export function dbInsert<T>(datastore: Datastore, doc: T): Promise<T> {
  return new Promise((resolve, reject) => {
    datastore.insert(doc, (err: any, newDocs: T) => {
      if (err) {
        reject(err);
      } else {
        resolve(newDocs);
      }
    });
  });
}

export function dbRemove(datastore: Datastore, query: any, options?: any) {
  if (options === undefined) {
    options = {};
  }
  return new Promise((resolve, reject) => {
    datastore.remove(query, options, (err: any, numRemoved: number) => {
      if (err) {
        reject(err);
      } else {
        resolve(numRemoved);
      }
    });
  });
}

export function dbUpdate(
  datastore: Datastore,
  query: any,
  update: any,
  options: any) {
  return new Promise((resolve, reject) => {
    datastore.update(query, update, options, (err: any, numRemoved: number) => {
      if (err) {
        reject(err);
      } else {
        resolve(numRemoved);
      }
    });
  });
}
/**
 * Reads a json from its location, and returns
 * its contents as an object. If the datafile doesn't
 * exist, it calls checkDataDir, to initalize missing
 * files and returns an empty object {}.
 * @returns
 */
export async function getData(
  dataPath: string,
  cryptKey?: Buffer): Promise<any> {

  let data;
  try {
    data = JSON.parse(await fileHandler.readFile(dataPath, cryptKey));
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
  }
  return data;
}
