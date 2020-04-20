const express = require("express");
const db = require("../data/helpers/actionModel");

const router = express.Router();

//  Get all actions
//  -> array
router.get("/", validateActionId(), (req, res, next) => {
    res.send(req.action);
});

//  Get individual action
//  -> object
router.get("/:id", validateActionId(), (req, res, next) => {
    res.send(req.action);
});

//  Add new action
router.post("/", validateActionBody(), (req, res, next) => {
    db.insert(req.actionBody)
        .then((action) => {
            res.send(action);
        })
        .catch((error) => {
            next(error);
        });
});

//  Check if action id exists
function validateActionId() {
    return (req, res, next) => {
        db.get((req.params.id || null))
            .then((action) => {
                //  Check if action exists
                if (action) {
                    //  All good -> continue
                    //  Add action to request object
                    req.action = action;
                    next();
                } else {
                    //  Action does not exist
                    res.status(400).json({
                        message: "invalid action id",
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
function validateActionBody() {
    return (req, res, next) => {
        //  Check that the request body exists
        if (req.body) {
            //  Check for the required key
            if (req.body.project_id && req.body.description && req.body.notes) {
                //  Add action body to request
                req.actionBody = {
                    project_id: req.body.project_id,
                    description: req.body.description,
                    notes: req.body.notes,
                    completed: (req.body.completed || false)
                };
                next();
            } else {
                res.status(400).json({
                    message: "missing required fields; project_id,description,notes",
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
