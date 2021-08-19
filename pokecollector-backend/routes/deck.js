"use strict";

/* Routes for Authentication */

const jsonschema = require("jsonschema");
const cardSchema = require("../schemas/cardSchema.json");

const { ensureCorrectUserOrAdmin } = require("../middleware/auth");
const express = require("express");
const UsersCards = require("../models/users_cards");
const Users = require("../models/users");
const router = new express.Router();

const { BadRequestError } = require("../expressError");

router.get