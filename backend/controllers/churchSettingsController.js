const fs = require("fs");
const path = require("path");

const ChurchSettings = require("../models/ChurchSettings");
const { successResponse } = require("../utils/helpers");

const getSettings = async (req, res, next) => {
  try {
    let settings = await ChurchSettings.findOne();

    if (!settings) {
      settings = await ChurchSettings.create({
        updatedBy: req.user._id,
      });
    }

    return successResponse(
      res,
      "Church settings retrieved successfully.",
      { settings }
    );
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const allowedFields = [
      "churchName",
      "logo",
      "address",
      "phone",
      "currency",
      "reportFooter",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    updates.updatedBy = req.user._id;

    const settings = await ChurchSettings.findOneAndUpdate(
      {},
      updates,
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return successResponse(
      res,
      "Church settings updated successfully.",
      { settings }
    );
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Upload Church Logo
|--------------------------------------------------------------------------
*/

const uploadLogo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a logo image.",
      });
    }

    let settings = await ChurchSettings.findOne();

    if (!settings) {
      settings = await ChurchSettings.create({
        updatedBy: req.user._id,
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Delete previous logo
    |--------------------------------------------------------------------------
    */

    if (settings.logo) {
      const oldLogoPath = path.join(
        __dirname,
        "..",
        settings.logo.replace(/^\/+/, "")
      );

      if (fs.existsSync(oldLogoPath)) {
        fs.unlinkSync(oldLogoPath);
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Save new logo path
    |--------------------------------------------------------------------------
    */

    const logoUrl = `/uploads/church-logo/${req.file.filename}`;

    settings.logo = logoUrl;
    settings.updatedBy = req.user._id;

    await settings.save();

    return successResponse(
      res,
      "Church logo uploaded successfully.",
      {
        settings,
      }
    );
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Remove Church Logo
|--------------------------------------------------------------------------
*/

const removeLogo = async (req, res, next) => {
  try {
    const settings = await ChurchSettings.findOne();

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Church settings not found.",
      });
    }

    if (settings.logo) {
      const logoPath = path.join(
        __dirname,
        "..",
        settings.logo.replace(/^\/+/, "")
      );

      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
    }

    settings.logo = "";
    settings.updatedBy = req.user._id;

    await settings.save();

    return successResponse(
      res,
      "Church logo removed successfully.",
      {
        settings,
      }
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSettings,
  uploadLogo,
  removeLogo,
};