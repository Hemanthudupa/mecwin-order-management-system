import { Transform } from "stream";
import { createReadStream } from "fs";
import { APIError } from "./Error";

export function tranform(path: string) {
  try {
    return new Promise((resolve, reject) => {
      const read = createReadStream(path);
      let chunks: Buffer[] = [];
      const trans = new Transform({
        transform(chunk, encoding, callback) {
          chunks.push(chunk);
          callback();
        },
      });
      read.pipe(trans);
      trans.on("end", () => {
        const buffer = Buffer.concat(chunks);
        resolve(`data:image/png;base64,${buffer.toString("base64")}`);
      });
      trans.on("finish", () => {
        const buffer = Buffer.concat(chunks);
        resolve(`data:image/png;base64,${buffer.toString("base64")}`);
      });
      read.on("end", () => {
        console.log("all the data readed from the images");
      });
      trans.on("error", (err) => {
        console.error(`Error reading file ${path}:`, err);
        reject(
          new APIError(`Error reading image: ${path}`, "IMAGE_READ_ERROR")
        );
      });
      read.on("error", (err) => {
        console.error(`Error reading file ${path}:`, err);
        reject(
          new APIError(`Error reading image: ${path}`, "IMAGE_READ_ERROR")
        );
      });
    });
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}
