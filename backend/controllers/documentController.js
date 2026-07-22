const Document = require('../models/Document');
const path = require('path');
const { successResponse, paginatedResponse, getPaginationParams, buildSearchFilter } = require('../utils/helpers');

const getDocuments = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const filter = { isArchived: false };

    if (req.query.search) Object.assign(filter, buildSearchFilter(req.query.search, ['title', 'description']));
    if (req.query.category) filter.category = req.query.category;
    if (req.query.accessLevel) filter.accessLevel = req.query.accessLevel;
    if (req.query.ministry) filter.ministry = req.query.ministry;
    if (req.query.tags) filter.tags = { $in: req.query.tags.split(',') };

    const userRole = req.user.role;
    const accessLevelMap = {
      super_admin: ['public', 'members', 'leaders', 'admin'],
      admin: ['public', 'members', 'leaders', 'admin'],
      pastor: ['public', 'members', 'leaders', 'admin'],
      secretary: ['public', 'members', 'leaders'],
      treasurer: ['public', 'members', 'leaders'],
      finance_officer: ['public', 'members', 'leaders'],
      ministry_leader: ['public', 'members', 'leaders'],
      volunteer: ['public', 'members'],
      member: ['public', 'members'],
    };
    filter.accessLevel = { $in: accessLevelMap[userRole] || ['public'] };

    const [documents, total] = await Promise.all([
      Document.find(filter)
        .populate('uploadedBy', 'firstName lastName')
        .populate('ministry', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Document.countDocuments(filter),
    ]);

    return paginatedResponse(res, 'Documents retrieved.', documents, {
      total, page, limit, pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

const getDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('uploadedBy', 'firstName lastName email')
      .populate('ministry', 'name');
    if (!document) return res.status(404).json({ success: false, message: 'Document not found.' });
    await Document.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });
    return successResponse(res, 'Document retrieved.', { document });
  } catch (error) {
    next(error);
  }
};

const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });

    const fileExt = path.extname(req.file.originalname);
    const document = await Document.create({
      title: req.body.title || req.file.originalname,
      description: req.body.description,
      category: req.body.category || 'other',
      fileUrl: `/uploads/${req.file.mimetype.startsWith('image/') ? 'images' : 'documents'}/${req.file.filename}`,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      fileExtension: fileExt,
      accessLevel: req.body.accessLevel || 'members',
      ministry: req.body.ministry,
      tags: req.body.tags ? req.body.tags.split(',').map((t) => t.trim()) : [],
      uploadedBy: req.user._id,
    });

    return successResponse(res, 'Document uploaded successfully.', { document }, 201);
  } catch (error) {
    next(error);
  }
};

const updateDocument = async (req, res, next) => {
  try {
    const document = await Document.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!document) return res.status(404).json({ success: false, message: 'Document not found.' });
    return successResponse(res, 'Document updated.', { document });
  } catch (error) {
    next(error);
  }
};

const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);
    if (!document) return res.status(404).json({ success: false, message: 'Document not found.' });
    return successResponse(res, 'Document deleted.');
  } catch (error) {
    next(error);
  }
};

const archiveDocument = async (req, res, next) => {
  try {
    const document = await Document.findByIdAndUpdate(
      req.params.id,
      { isArchived: true },
      { new: true }
    );
    if (!document) return res.status(404).json({ success: false, message: 'Document not found.' });
    return successResponse(res, 'Document archived.', { document });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDocuments, getDocument, uploadDocument, updateDocument, deleteDocument, archiveDocument };
