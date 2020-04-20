const express = require("express");
const db = require("../data/helpers/projectModel");

const router = express.Router();

//  Get all projects
//  -> array
router.get("/", validateProjectId(), (req, res, next) => {
    res.send(req.project);
});

//  Get individual project
//  -> object
router.get("/:id", validateProjectId(), (req, res, next) => {
    res.send(req.project);
});

//  Check if project id exists
function validateProjectId() {
    return (req, res, next) => {
        db.get((req.params.id || null))
            .then((project) => {
                //  Check if project exists
                if (project) {
                    //  All good -> continue
                    //  Add project to request object
                    req.project = project;
                    next();
                } else {
                    //  Project does not exist
                    res.status(400).json({
                        message: "invalid project id",
                    });
                }
            })
            .catch((error) => {
                //  Server failed when accessing database
                next(error);
            });
    };
}

module.exports = router;
