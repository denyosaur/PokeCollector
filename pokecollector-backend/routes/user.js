"use strict";

/* Routes for Users */

const express = require("express");

const { ensureAdmin, ensureCorrectUserOrAdmin } = require("../middleware/auth");

const User = require("../models/users");

const { createToken } = require("../helpers/token-helpers");

const { jsonValidate } = require("../helpers/jsonvalidator-helpers");
const userNewAdminSchema = require("../schemas/userNewAdmin.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();

/*********CORRECT USER  OR ADMIN ONLY*********/

/* GET user/:username =>  { username, firstName, lastName, email, isAdmin, currencyAmount, [cardIds] }
Returns user info and cards owned - Correct User or Admin Only
*/
router.get("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const { username } = req.params;

        const user = await User.getUser(username);

        return res.json({ user });
    } catch (error) {
        return next(error);
    };
});

/* PATCH user/:username =>  { user }
update user info and cards owned - Correct User or Admin Only
check inputs against jsonschema to validate that inputs are correct.if not throw BadRequestError
send req.body(contains changes) and username to updateUserInfo
return user
*/
router.patch("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        jsonValidate(req.body, userUpdateSchema); //json validator helper function

        const { username } = req.params;

        const user = await User.updateUserInfo(username, req.body);
        return res.json({ user });

    } catch (error) {
        return next(error);
    }
});



/* DELETE /[username]  =>  { deleted: username }
deletes user info and cards owned - Correct User or Admin Only
pass in user's username to User.deleteUser which deletes and returns username
return json object 
*/
router.delete("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const { username } = req.params;

        const user = await User.getUser(username);

        await user.delete();

        return res.json({ deleted: user });
    } catch (error) {
        return next(error);
    };
});




/*********ADMIN ONLY*********/

/* GET user/ {user} =>  { users: [ {username, firstName, lastName, email }, ... ] }
Returns list of all users - admin only
user findAll method from User to fetch list of all users
return user object
*/
router.get("/", ensureAdmin, async function (req, res, next) {
    try {
        const user = await User.findAll();

        return res.json({ user });
    } catch (error) {
        return next(error);
    };
});


/* POST user/ {user} => {user, token}
create a new user. can set to admin - admin only
check inputs against jsonschema to validate that inputs are correct. if not throw BadRequestError
pass in req.body to User.register to create new account.
return user and token
*/
router.post("/", ensureAdmin, async function (req, res, next) {
    try {
        jsonValidate(req.body, userNewAdminSchema); //json validator helper function

        const token = createToken(user);

        const user = await User.register(req.body);

        return res.status(201).json({ user, token });
    } catch (error) {
        return next(error);
    };
});

module.exports = router;