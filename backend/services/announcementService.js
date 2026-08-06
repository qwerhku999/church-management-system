const Announcement = require("../models/Announcement");


// Get all announcements

const getAnnouncements = async (query) => {

    const filter = {};


    if(query.status){
        filter.status = query.status;
    }


    const announcements =
        await Announcement.find(filter)
        .populate(
            "createdBy",
            "firstName lastName email"
        )
        .sort({
            createdAt:-1
        });


    return announcements;

};



// Get single announcement

const getAnnouncementById = async(id)=>{


    const announcement =
        await Announcement.findById(id)
        .populate(
            "createdBy",
            "firstName lastName email"
        );


    if(!announcement){

        const error =
        new Error(
            "Announcement not found."
        );

        error.statusCode = 404;

        throw error;

    }


    return announcement;

};



// Create announcement

const createAnnouncement = async(data,userId)=>{


    const announcement =
    await Announcement.create({

        ...data,

        createdBy:userId

    });


    return announcement;

};



// Update announcement

const updateAnnouncement = async(id,data)=>{


    const announcement =
    await Announcement.findByIdAndUpdate(
        id,
        data,
        {
            new:true,
            runValidators:true
        }
    );


    if(!announcement){

        const error =
        new Error(
            "Announcement not found."
        );

        error.statusCode=404;

        throw error;

    }


    return announcement;

};



// Delete announcement

const deleteAnnouncement = async(id)=>{


    const announcement =
    await Announcement.findByIdAndDelete(id);


    if(!announcement){

        const error =
        new Error(
            "Announcement not found."
        );

        error.statusCode=404;

        throw error;

    }


    return announcement;

};



module.exports = {

    getAnnouncements,
    getAnnouncementById,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement

};