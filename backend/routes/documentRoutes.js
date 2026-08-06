const express = require("express");

const router = express.Router();

const documentController = require("../controllers/documentController");

const {
  protect,
  authorize
} = require("../middleware/auth");

const upload = require("../middleware/upload");


// =====================================
// All document routes require login
// =====================================

router.use(protect);



// =====================================
// GET ALL DOCUMENTS
// GET /api/documents
// =====================================

router.get(
  "/",
  documentController.getDocuments
);



// =====================================
// GET SINGLE DOCUMENT
// GET /api/documents/:id
// =====================================

router.get(
  "/:id",
  documentController.getDocument
);



// =====================================
// UPLOAD DOCUMENT
// POST /api/documents
// =====================================

router.post(
  "/",
  authorize(
    "super_admin",
    "admin",
    "pastor",
    "secretary",
    "treasurer",
    "finance_officer"
  ),
  upload.single("file"),
  documentController.uploadDocument
);



// =====================================
// UPDATE DOCUMENT
// PUT /api/documents/:id
// =====================================

router.put(
  "/:id",
  authorize(
    "super_admin",
    "admin",
    "pastor"
  ),
  documentController.updateDocument
);



// =====================================
// ARCHIVE DOCUMENT
// PATCH /api/documents/:id/archive
// =====================================

router.patch(
  "/:id/archive",
  authorize(
    "super_admin",
    "admin",
    "pastor"
  ),
  documentController.archiveDocument
);



// =====================================
// DELETE DOCUMENT
// DELETE /api/documents/:id
// =====================================

router.delete(
  "/:id",
  authorize(
    "super_admin",
    "admin"
  ),
  documentController.deleteDocument
);



module.exports = router;