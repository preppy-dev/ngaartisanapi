import multer from 'multer';
import express from 'express';
import { isAuth } from '../helpers/utils.js';

const uploadRouter = express.Router();
const upload_dir = './uploads';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, upload_dir);
  },
  /* filename(req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  }, */
  /* filename: (req, file, cb) => {
    cb(null, `${file.filename}-${Date.now()}`);
  }, */
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, fileName)
  }
});



/* const upload = multer({ storage });
 */
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

/* uploadRouter.post('/', upload.single('image'),isAuth); */
/* uploadRouter.post('/', isAuth, upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`);
});
 */
// POST
uploadRouter.post('/',isAuth, upload.single('image'), (req, res, next) => {
  res.send(`/${req.file.path}`);
})

export default uploadRouter;
