import request from "./api-helper"

class UsersApi {
    constructor(token) {
        this.token = token;
    }

    /************************************CORRECT USER OR ADMIN ONLY************************************/

    /*method for logging in
    form = {username, password}
    */
    static async login(loginForm) {
        const res = await request("auth/token", "POST", loginForm);

        this.token = res.token;

        return res;
    }


    /*method for logging in
    form = {username, password, firstName, lastName, email}
    */
    static async register(registerForm) {
        const res = await request("auth/register", "POST", registerForm);

        this.token = res.token;

        return res;
    }

    /*method for getting user's own info
    form = { username, firstName, lastName, email, isAdmin, currencyAmount }
    returns user object { username, firstName, lastName, email, isAdmin, currencyAmount }
    */
    static async currUser(username) {
        const res = await request(`user/${username}`);

        return res;
    }

    /*method for updating user's own info
    updatedInfo should contain {password, firstName, lastName}
    returns {user:{ username, firstName, lastName, email, isAdmin, currencyAmount }}
    */
    static async patchUserDetails(username, updatedInfo) {
        const res = await request(`user/${username}`, "PATCH", updatedInfo);

        return res;
    }

    /*method for deleting a user
    updatedInfo should contain {password, firstName, lastName}
    returns {user:{ username, firstName, lastName, email, isAdmin, currencyAmount }}
    */
    static async deleteUser(username) {
        const res = await request(`user/${username}`, "DELETE", {});

        return res;
    }

    /*******************ADMIN ONLY************************************/

    /*method for deleting a user
    updatedInfo should contain {password, firstName, lastName}
    returns { users: [ {username, firstName, lastName, email }, ... ] }
    */
    static async getAllUsers() {
        const res = await request(`user/admin/allusers`);

        return res;
    }

    /*method for deleting a user
    updatedInfo should contain {password, firstName, lastName}
    returns { newAdmin:  {username, firstName, lastName, email }, token }
    */
    static async getAllUsers() {
        const res = await request("user/admin/createadmin", "POST", registerForm);

        return res;
    }
};

export default UsersApi;
