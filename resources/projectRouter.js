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

//  Get individual project actions
//  -> object
router.get("/:id/actions", validateProjectId(), (req, res, next) => {
    res.send(req.project.actions);
});

//  Add new project
router.post("/", validateProjectBody(), (req, res, next) => {
    db.insert(req.projectBody)
        .then((project) => {
            res.send(project);
        })
        .catch((error) => {
            next(error);
        });
});

//  Update project
router.put("/:id", validateProjectBody(), validateProjectId(), (req, res, next) => {
    db.update(req.project.id, req.projectBody)
        .then((project) => {
            res.send(project);
        })
        .catch((error) => {
            next(error);
        });
});

//  Delete project
router.delete("/:id", validateProjectId(), (req, res, next) => {
    db.remove(req.project.id)
        .then((success) => {
            if (success)
            {
                res.send(req.project);
            } else {
                next(error);
            }
        })
        .catch((error) => {
            next(error);
        });
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

//  Validate the request body
function validateProjectBody() {
    return (req, res, next) => {
        //  Check that the request body exists
        if (req.body) {
            //  Check for the required key
            if (req.body.name && req.body.description) {
                //  Add project body to request
                req.projectBody = {
                    name: req.body.name,
                    description: req.body.description,
                    completed: (req.body.completed || false)
                };
                next();
            } else {
                res.status(400).json({
                    message: "missing required fields; name,description",
                });
            }
        } else {
            res.status(400).json({
                message: "missing user data",
            });
        }
    };
}

module.exports = router;
