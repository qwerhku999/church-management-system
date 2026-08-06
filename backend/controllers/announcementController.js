const announcementService =
require("../services/announcementService");


const {
    successResponse
}=require("../utils/helpers");



// GET ALL

const getAnnouncements = async(req,res,next)=>{

    try{

        const announcements =
        await announcementService.getAnnouncements(
            req.query
        );


        return successResponse(
            res,
            "Announcements retrieved successfully.",
            {
                announcements
            }
        );


    }catch(error){

        next(error);

    }

};



// GET ONE

const getAnnouncement = async(req,res,next)=>{

    try{

        const announcement =
        await announcementService.getAnnouncementById(
            req.params.id
        );


        return successResponse(
            res,
            "Announcement retrieved successfully.",
            {
                announcement
            }
        );


    }catch(error){

        next(error);

    }

};



// CREATE

const createAnnouncement = async(req,res,next)=>{

    try{

        const announcement =
        await announcementService.createAnnouncement(
            req.body,
            req.user._id
        );


        return successResponse(
            res,
            "Announcement created successfully.",
            {
                announcement
            },
            201
        );


    }catch(error){

        next(error);

    }

};



// UPDATE

const updateAnnouncement = async(req,res,next)=>{

    try{

        const announcement =
        await announcementService.updateAnnouncement(
            req.params.id,
            req.body
        );


        return successResponse(
            res,
            "Announcement updated successfully.",
            {
                announcement
            }
        );


    }catch(error){

        next(error);

    }

};



// DELETE

const deleteAnnouncement = async(req,res,next)=>{

    try{


        await announcementService.deleteAnnouncement(
            req.params.id
        );


        return successResponse(
            res,
            "Announcement deleted successfully."
        );


    }catch(error){

        next(error);

    }

};



module.exports = {

    getAnnouncements,
    getAnnouncement,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement

};