"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

class User {
    /*
    method for authenticating a login 
    db.query user information to pull information from user
    if user object contains key-value pairs, use bcrypt to compare the hashed password and the user input password.
    if bcrypt.compare passes, return user object: { username, first_name, last_name, email, is_admin, currencyAmount }
    else, throw UnauthorizedError
    */
    static async authenticate(username, password) {
        const result = await db.query(
            `SELECT *
             FROM users
             WHERE username = $1`,
            [username]);
        const user = result.rows[0];


        if (user) {
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid) {
                delete user.password;
                return user;
            }
        };

        throw new UnauthorizedError("Invalid username/password");
    };

    /*
    method for registering a new user
        make a request to pull the new username to check if it exists
        hash password using bcrypt - this will be saved in the database
        make a db.query to create user which returns information about the new user
        return new user object: { username, firstName, lastName, email, isAdmin, currencyAmount }
    */
    static async register({ username, password, firstName, lastName, email, isAdmin }) {

        const duplicateCheck = await db.query(`SELECT username FROM users WHERE username =$1`, [username]);

        if (duplicateCheck.rows[0]) throw new BadRequestError(`Duplicate username: ${username}`);

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const result = await db.query(`INSERT INTO users
                                       (username, password, first_name, last_name, email, currency_amount, is_admin)
                                       VALUES ($1,$2,$3,$4,$5,$6)
                                       RETURNING username, first_name AS "firstName", last_name AS "lastName", email, is_Admin AS isAdmin, currency_amount AS "currencyAmount`,
            [username, hashedPassword, firstName, lastName, email, currencyAmount, isAdmin]);

        const newUser = result.rows[0];

        return newUser;
    };

    /*
    method for registering a new user
        make a request to pull the new username to check if it exists
        hash password using bcrypt - this will be saved in the database
        make a db.query to create user which returns information about the new user
        return user array of objects: [{ username, firstName, lastName, email, isAdmin, currencyAmount },...]
    */
    static async findAll() {
        const result = await db.query(`SELECT username, first_name AS "firstName", last_name AS "lastName" FROM users ORDER BY username`);
        return result.rows;
    };

    /*
    method for getting user info and the cards they own
        
        return user array of objects: [{ username, firstName, lastName, email, isAdmin, currencyAmount },...]
        if user not found, throw NotFoundError
    */
    static async getUser(username) {
        const userRes = await db.query(`SELECT username,
                                               first_name AS "firstName",
                                               last_name AS "lastName",
                                               email,
                                               is_admin AS "isAdmin"
                                        FROM users 
                                        WHERE username
        `)
    }
}
module.exports = { User }