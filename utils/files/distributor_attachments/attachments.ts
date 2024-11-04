import multer, { memoryStorage, Multer } from "multer";
// import { Sharp } from "sharp";
import path, { join } from "path";
const storage = multer.diskStorage({
  destination: join(__dirname, "..", "attachments"),
  filename(req: any, file, callback) {
    const name = (req as any)?.user?.username || "test";
    const fileName = file.originalname;
    const date = Date.now();
    req.file;
    req["fileName"] = name + date + fileName;
    callback(null, name + date + fileName);
  },
});
// const storage = memoryStorage();
export const fileMulter = multer({ storage });
