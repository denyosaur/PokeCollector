"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");

class Messages {
    /*Create New Message
    create a variable to hold the current time
    make a query to get username's ID
    make db request to INSERT a new message row
    return newMessage object {tradeId, userId, message, timestamp}
    */
    createMessage(tradeId, username, message) {
        const userResult = db.query(`SELECT id FROM users WHERE username = $1`, [username]);
        const userId = userResult.rows[0];

        const currTime = new Date();

        const createMessage = await db.query(`INSERT INTO messages
                                              (trade_id, user_id, message, timestamp)
                                              VALUES ($1, $2, $3, $4)
                                              RETURNING trade_id AS "tradeId",
                                                        user_id AS "userId"
                                                        message
                                                        timestamp`,
            [tradeId, userId, message, currTime]);

        const newMessage = createMessage.rows[0];

        return newMessage;
    };

    /*Get All Messages by Trade ID
    check that the trade ID exists, if not, throw NotFoundError

    select all messages where trade_id that matches the passed in ID
    return result [{tradeId, fromUserId, toUserId, message, timestamp}, ...]
    */
    getMessages(tradeId) {
        const checkTrade = await db.query(`SELECT id FROM trades WHERE id = $1`[tradeId]);
        if (!checkTrade) throw new NotFoundError(`No Trade with ID of ${tradeId}`);

        const result = await db.query(`SELECT trade_id, user_id, message, timestamp
                                       FROM messages
                                       WHERE trade_id = $1
                                       RETURNING trade_id AS "trade_id",
                                                 user_id AS "userId",
                                                 message,
                                                 timestamp`, [tradeId]);

        return result;
    };

    /*Create New Message
    check message table if entry with messageId exists. if not, throw NotFoundError
    else make a DELETE query to delete row with messageId as ID
    return message id
    */
    deleteMessages(messageId) {
        const checkMessage = await db.query(`SELECT id FROM messages WHERE id = $1`[messageId]);
        if (!checkMessage) throw new NotFoundError(`No Message with ID of ${messageId}`);

        const result = await db.query(`DELETE 
                                       FROM messages
                                       WHERE id = $1
                                       RETURNING id`, [messageId]);
        const message = result.rows[0];

        return message;
    };
}

module.exports = { Messages };
