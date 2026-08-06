const Ministry = require('../models/Ministry');
const Member = require('../models/Member');

const {
  successResponse,
  paginatedResponse,
  getPaginationParams,
  getSortParams,
  buildSearchFilter,
} = require('../utils/helpers');


// ===============================
// Get All Ministries
// ===============================

const getMinistries = async (req, res, next) => {
  try {

    const {
      page,
      limit,
      skip
    } = getPaginationParams(req.query);


    const filter = {};


    if (req.query.search) {

      Object.assign(
        filter,
        buildSearchFilter(
          req.query.search,
          [
            'name',
            'description',
            'category'
          ]
        )
      );

    }


    if (req.query.status) {
      filter.status = req.query.status;
    }


    if (req.query.category) {
      filter.category = req.query.category;
    }



    const sort = req.query.sortBy
      ? getSortParams(req.query)
      : {
          createdAt: -1
        };



    const [
      ministries,
      total
    ] = await Promise.all([


      Ministry.find(filter)

        .populate(
          'leader',
          'firstName lastName email role'
        )

        .populate(
          'coLeaders',
          'firstName lastName email role'
        )

        .populate(
          'members.member',
          'firstName lastName phone'
        )

        .populate(
          'createdBy',
          'firstName lastName'
        )

        .sort(sort)

        .skip(skip)

        .limit(limit),



      Ministry.countDocuments(filter)


    ]);



    return paginatedResponse(
      res,
      'Ministries retrieved successfully.',
      ministries,
      {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    );


  } catch(error) {

    next(error);

  }
};




// ===============================
// Get Single Ministry
// ===============================

const getMinistry = async (req,res,next)=>{

  try {


    const ministry =
      await Ministry.findById(req.params.id)

      .populate(
        'leader',
        'firstName lastName email role'
      )

      .populate(
        'coLeaders',
        'firstName lastName email role'
      )

      .populate(
        'members.member',
        'firstName lastName email phone'
      )

      .populate(
        'createdBy',
        'firstName lastName'
      );



    if(!ministry){

      return res.status(404).json({

        success:false,

        message:'Ministry not found.'

      });

    }



    return successResponse(
      res,
      'Ministry retrieved successfully.',
      {
        ministry
      }
    );



  } catch(error){

    next(error);

  }

};




// ===============================
// Create Ministry
// ===============================

const createMinistry = async(req,res,next)=>{

  try {


    if(req.file){

      req.body.image =
      `/uploads/images/${req.file.filename}`;

    }



    const ministry =
      await Ministry.create({

        ...req.body,

        createdBy:req.user._id

      });



    return successResponse(
      res,
      'Ministry created successfully.',
      {
        ministry
      },
      201
    );



  } catch(error){

    next(error);

  }

};

// ===============================
// Update Ministry
// ===============================

const updateMinistry = async(req,res,next)=>{

  try {


    if(req.file){

      req.body.image =
      `/uploads/images/${req.file.filename}`;

    }



    const ministry =
      await Ministry.findByIdAndUpdate(

        req.params.id,

        req.body,

        {
          new:true,
          runValidators:true
        }

      );



    if(!ministry){

      return res.status(404).json({

        success:false,

        message:'Ministry not found.'

      });

    }



    return successResponse(
      res,
      'Ministry updated successfully.',
      {
        ministry
      }
    );



  } catch(error){

    next(error);

  }

};




// ===============================
// Delete Ministry
// ===============================

const deleteMinistry = async(req,res,next)=>{

  try {


    const ministry =
      await Ministry.findByIdAndDelete(
        req.params.id
      );



    if(!ministry){

      return res.status(404).json({

        success:false,

        message:'Ministry not found.'

      });

    }



    // Remove ministry from members

    await Member.updateMany(

      {
        ministries:ministry._id
      },

      {

        $pull:{

          ministries:ministry._id

        }

      }

    );



    return successResponse(

      res,

      'Ministry deleted successfully.'

    );



  } catch(error){

    next(error);

  }

};




// ===============================
// Add Member To Ministry
// ===============================

const addMember = async(req,res,next)=>{

  try {


    console.log(
      "ADD MEMBER BODY:",
      req.body
    );



    const memberId =
      req.body.memberId || req.body.member;



    const role =
      req.body.role || 'member';



    if(!memberId){

      return res.status(400).json({

        success:false,

        message:'Member ID is required.'

      });

    }



    const ministry =
      await Ministry.findById(
        req.params.id
      );



    if(!ministry){

      return res.status(404).json({

        success:false,

        message:'Ministry not found.'

      });

    }



    const member =
      await Member.findById(memberId);



    if(!member){

      return res.status(404).json({

        success:false,

        message:'Member not found.'

      });

    }




    const alreadyExists =
      ministry.members.some(

        item =>

          item.member &&

          item.member.toString()
          === member._id.toString()

      );




    // Member already exists in ministry

    if(alreadyExists){


      if(!member.ministries){

        member.ministries=[];

      }



      const hasLink =
        member.ministries.some(

          id =>

          id.toString()
          === ministry._id.toString()

        );



      if(!hasLink){

        member.ministries.push(
          ministry._id
        );

        await member.save();

      }



      const updatedMinistry =
        await Ministry.findById(
          ministry._id
        )

        .populate(
          'members.member',
          'firstName lastName phone'
        );



      return successResponse(

        res,

        'Member already belongs to this ministry.',

        {
          ministry:updatedMinistry
        }

      );

    }

        // Add member to ministry

    ministry.members.push({

      member: member._id,

      role

    });



    await ministry.save();




    // Sync member document

    if(!member.ministries){

      member.ministries = [];

    }



    const alreadyLinked =

      member.ministries.some(

        id =>

        id.toString() === ministry._id.toString()

      );



    if(!alreadyLinked){

      member.ministries.push(
        ministry._id
      );

      await member.save();

    }





    const updatedMinistry =

      await Ministry.findById(
        ministry._id
      )

      .populate(

        'members.member',

        'firstName lastName phone'

      );




    return successResponse(

      res,

      'Member added to ministry successfully.',

      {

        ministry: updatedMinistry

      }

    );




  } catch(error){

    next(error);

  }

};





// ===============================
// Remove Member From Ministry
// ===============================

const removeMember = async(req,res,next)=>{

  try {


    const ministry =

      await Ministry.findById(
        req.params.id
      );



    if(!ministry){

      return res.status(404).json({

        success:false,

        message:'Ministry not found.'

      });

    }





    ministry.members =

      ministry.members.filter(

        item =>

        item.member &&

        item.member.toString()
        !== req.params.memberId

      );



    await ministry.save();





    await Member.findByIdAndUpdate(

      req.params.memberId,

      {

        $pull:{

          ministries:ministry._id

        }

      }

    );





    const updatedMinistry =

      await Ministry.findById(
        ministry._id
      )

      .populate(

        'members.member',

        'firstName lastName phone'

      );





    return successResponse(

      res,

      'Member removed from ministry successfully.',

      {

        ministry:updatedMinistry

      }

    );




  } catch(error){

    next(error);

  }

};






module.exports = {

  getMinistries,

  getMinistry,

  createMinistry,

  updateMinistry,

  deleteMinistry,

  addMember,

  removeMember

};