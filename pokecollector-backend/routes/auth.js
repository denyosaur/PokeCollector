"use strict";

/* Routes for Authentication */

const express = require("express");

const User = require("../models/user");

const { createToken } = require("../helpers/tokens");

const { jsonValidate } = require("../helpers/jsonvalidator-helpers");
const userAuthSchema = require("../schemas/userAuth.json");
const userNewSchema = require("../schemas/userNew.json");

const router = new express.Router();

/* POST /auth/token: {username,password} => token 
validate that the username and password are in the right format using jsonschema. if not valid, throw BadRequestError
destructure req.body object 
use authenticate method from User by passing in username and password. if incorrect password, error will be thrown
create a token with the username 
*/
router.post("/token", async function (req, res, next) {
    try {
        jsonValidate(req.body, userAuthSchema);//validate username and password object schema

        //check that username exists and password is correct
        const { username, password } = req.body;
        const user = await User.authenticate(username, password);
        const token = createToken(user);

        return res.json({ token });
    } catch (error) {
        return next(error);
    }
});

/* POST /auth/token: {username,password,firstName,lastName,email,isAdmin} => token 
validate that the object is in the right format using jsonschema. if not valid, throw BadRequestError

register the user with information from req.body using User.register. isAdmin defaults to false
create a new token using user
return token and 201 status
*/
router.post("/register", async function (req, res, next) {
    try {
        jsonValidate(req.body, userNewSchema);//validate username and password object schema

        //check that username/email isnt a duplicate and register user
        const newUser = await User.register({ ...req.body, isAdmin: false });
        const token = createToken(newUser);
        return res.status(201).json({ token });
    } catch (error) {
        return next(error);
    }
})
