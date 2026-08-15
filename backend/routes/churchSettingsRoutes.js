const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const churchSettingsController = require(
  "../controllers/churchSettingsController"
);

const {
  protect,
  authorize,
} = require("../middleware/auth");


/*
|--------------------------------------------------------------------------
| Church Logo Upload Configuration
|--------------------------------------------------------------------------
*/

const uploadDirectory = path.join(
  __dirname,
  "..",
  "uploads",
  "church-logo"
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(
      file.originalname
    ).toLowerCase();

    cb(
      null,
      `church-logo-${Date.now()}${extension}`
    );
  },
});


const fileFilter = (
  req,
  file,
  cb
) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (
    allowedTypes.includes(
      file.mimetype
    )
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, PNG, and WebP images are allowed."
      )
    );
  }
};


const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});


/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

router.use(protect);


/*
|--------------------------------------------------------------------------
| Get Settings
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authorize(
    "super_admin",
    "admin",
    "pastor"
  ),
  churchSettingsController.getSettings
);


/*
|--------------------------------------------------------------------------
| Update Settings
|--------------------------------------------------------------------------
*/

router.put(
  "/",
  authorize("super_admin"),
  churchSettingsController.updateSettings
);


/*
|--------------------------------------------------------------------------
| Upload Logo
|--------------------------------------------------------------------------
*/

router.post(
  "/logo",
  authorize("super_admin"),
  upload.single("logo"),
  churchSettingsController.uploadLogo
);


/*
|--------------------------------------------------------------------------
| Remove Logo
|--------------------------------------------------------------------------
*/

router.delete(
  "/logo",
  authorize("super_admin"),
  churchSettingsController.removeLogo
);


module.exports = router;