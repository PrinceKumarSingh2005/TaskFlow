const express = require("express");

const Task = require("../modals/Task");

const authMiddleware = require("../middleware/auth");

const AppError = require("../utils/AppError");

const router = express.Router();

router.post("/", authMiddleware, async (req, res, next) => {

    try{
 
        
    const { title, description, status } = req.body;

    const task = await Task.create({
        title,
        description,
        status,
        userId: req.user.userId
    });

    res.status(201).json({
        message: "Task created successfully",
        task
    });
    } catch (error){
        next(error);
    }
 

});
 
router.get("/", authMiddleware, async (req, res, next) => {

    try{
        const tasks = await Task.find({
        userId: req.user.userId
    });

     
    
res.status(200).json({
    tasks
});
 
    }
    catch(error){
        next(error);
    }
     

      });
      router.get("/:id", authMiddleware, async(req, res, next ) =>{

        try{
            const task = await Task.findOne({
            _id: req.params.id,
            userId: req.user.userId
        });
        
        if(!task){
            next(new AppError("Task not found", 404));
        }
      
    res.status(200).json({
        task
    });

        } catch(error){
            next(error);
        }
         
});

router.put("/:id", authMiddleware, async(req, res, next) => {

 try{
    const updateData = {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status
    };


    const task = await Task.findOneAndUpdate(
        {
            _id: req.params.id,
            userId: req.user.userId
        },
        updateData,
        {
            new: true
        }
    );


    if(!task){
        return res.status(404).json({
            message: "Task not found"
        });
    }

  
    res.status(200).json({
        task
    });
 }
 catch (error){
next(error);
 }
     
});

router.delete("/:id", authMiddleware, async(req, res, next) => {

    try{
         const task = await Task.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.userId
    });
    if (!task){
        return res.status(404).json({
                message: "Task not found"
            });
         
    }

    res.status(200).json({
        message: "Task deleted successfully"
    });
} catch(error){
    next(error);
   

    

}
     
});
module.exports = router;