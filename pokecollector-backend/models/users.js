"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql-helpers");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

class User {
    /*
    method for authenticating a login 
    db.query user information to pull information from user
    if user object contains key-value pairs, use bcrypt to compare the hashed password and the user input password.
    if bcrypt.compare passes, return user object: { id, username, first_name, last_name, email, is_admin, currencyAmount }
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
    Registering a New User
        make a request to pull the new username to check if it exists
        hash password using bcrypt - this will be saved in the database
        make a db.query to create user which returns information about the new user
        return new user object: { username, firstName, lastName, email, isAdmin, currencyAmount }
    */
    static async register({ username, password, firstName, lastName, email, isAdmin = false }) {
        const duplicateCheck = await db.query(`SELECT username, email 
                                                       FROM users 
                                                       WHERE username = $1 OR email = $2`, [username, email]);
        if (duplicateCheck.rows[0]) throw new BadRequestError(`Duplicate username or email`);

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const result = await db.query(`INSERT INTO users
                                       (username, password, first_name, last_name, email, currency_amount, is_admin)
                                       VALUES ($1,$2,$3,$4,$5,$6,$7)
                                       RETURNING username, first_name AS "firstName", last_name AS "lastName", email, is_Admin AS isAdmin, currency_amount AS "currencyAmount`,
            [username, hashedPassword, firstName, lastName, email, 1000, isAdmin]);

        const newUser = result.rows[0];

        return newUser;
    };

    /*
    Find All Users
        create a sql query request for all user's usernam, first name, and last name. Order it by username
        return array of objects: [{ username, firstName, lastName},...]
    */
    static async findAll() {
        const result = await db.query(`SELECT username, 
                                              first_name AS "firstName", 
                                              last_name AS "lastName" 
                                       FROM users 
                                       ORDER BY username`);
        return result.rows;
    };

    /*
    Get User Info and the Cards they Own
        create a sql query to pull information form a user. Create the user variable to hold the information
        throw a NotFoundError if there are no matching usernames.
        return the user object: { username, firstName, lastName, email, isAdmin, currencyAmount, [cardIds] }
    */
    static async getUser(username) {
        const userRes = await db.query(`SELECT id,
                                               username,
                                               first_name AS "firstName",
                                               last_name AS "lastName",
                                               email,
                                               is_admin AS "isAdmin"
                                        FROM users 
                                        WHERE username = $1`, [username]);

        //create variable to hold only user information
        const user = userRes.rows[0];

        //throw NotFoundError if the username doesn't exist
        if (!user) throw new NotFoundError(`No user with username: ${username}`);

        return user;
    };

    /*
    Update User's Own Info

        return the user object: { username, firstName, lastName, email, isAdmin, currencyAmount, [cardIds] }
    */
    static async updateUserInfo(username, data) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
        }

        const { updateCols, values } = sqlForPartialUpdate(
            data,
            {
                firstName: "first_name",
                lastName: "last_name",
                isAdmin: "is_admin",
            }
        );
        const usernameIdx = "$" + (values.length + 1);
        const querySql = `UPDATE users
                          SET ${updateCols}
                          WHERE username = ${usernameIdx}
                          RETURNING username,
                                    first_name AS "firstName",
                                    last_name AS "lastName",
                                    email,
                                    is_admin AS isAdmin"`;

        const result = await db.query(querySql, [...values, username]);
        const user = result.rows[0];

        if (!user) throw new NotFoundError(`No user with username: ${username}`);

        delete user.password;
        return user;
    };

    /* Remove Amount from User's amount
    make a db request to check if username exists. if not, throw NotFoundError
    if user's current amount is greater than or equal to "amount to remove", make an update set the new amount
        return object of username and new currencyAmount {username, currencyAmount}
    else, throw BadRequestError for lack of funds
    */
    static async removeAmount(username, amount) {
        const checkExists = await db.query(`SELECT username, currency_amount
                                            FROM users
                                            WHERE username=$1`, [username]);
        if (!checkExists) throw new NotFoundError(`No user with username: ${username}`);

        const user = checkExists.rows[0];

        if (user.currency_amount >= amount) {
            const newAmount = user.currency_amount - amount;
            const updated = await db.query(`UPDATE users
                                            SET currency_amount
                                            WHERE username=$1
                                            RETURNING username, currency_amount AS "currencyAmount"`, [newAmount]);
            const updatedAmount = updated.rows[0];
            return updatedAmount;
        } else {
            throw new BadRequestError(`Not Enough Funds`);
        };
    };

    /*Add Amount to User's amount
    make a db request to check if username exists. if not, throw NotFoundError
    make an update query to increase user's currency_amount by the amount passed in
    return object of username and new currencyAmount {username, currencyAmount}
    */
    static async addAmount(username, amount) {
        const checkExists = await db.query(`SELECT username, currency_amount
                                            FROM users
                                            WHERE username=$1`, [username]);
        if (!checkExists) throw new NotFoundError(`No user with username: ${username}`);

        const user = checkExists.rows[0];
        const newAmount = user.currency_amount + amount;

        const updated = await db.query(`UPDATE users
                                        SET currency_amount
                                        WHERE username=$1
                                        RETURNING username, currency_amount AS "currencyAmount"`, [newAmount]);
        const updatedAmount = updated.rows[0];
        return updatedAmount;
    };


    /*
    Delete a User 
    create a sql query to delete a user by username. 
    if username is not found, throw a NotFoundError
    returns username
    */
    static async deleteUser(username) {
        const result = await db.query(`DELETE 
                                     FROM users
                                     WHERE username = $1
                                     RETURNING username`, [username]
        );
        const user = result.rows[0];
        if (!user) throw new NotFoundError(`No user with username: ${username}`);
        return user;
    };
}
module.exports = { User }