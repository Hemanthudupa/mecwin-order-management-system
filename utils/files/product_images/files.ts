import multer, { diskStorage } from "multer";
import { join, extname } from "path";
export const product_images_multer = multer({
  storage: diskStorage({
    destination: join(__dirname, "images"),
    filename(req, file, callback) {
      const extName = extname(file.originalname);
      const fileName =
        file.originalname.replace(extName, "") + Date.now() + extName;
      (file as any).savedFileNamePath = join(__dirname, "images", fileName);
      callback(null, fileName);
    },
  }),
});
