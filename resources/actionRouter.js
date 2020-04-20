const express = require("express");
const db = require("../data/helpers/actionModel");

const router = express.Router();

//  Get all actions
//  -> array
router.get("/", validateActionId(), (req, res, next) => {
    res.send(req.action);
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
                    //  Project does not exist
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

module.exports = router;
