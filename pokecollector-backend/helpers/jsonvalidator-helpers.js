const jsonschema = require("jsonschema");
const { BadRequestError } = require("../expressError");

function jsonValidate(body, schema) {
    const validate = jsonschema.validate(body, schema);
    if (!validate.valid) {
        const errors = validate.errors.map(error => error.stack);
        throw new BadRequestError(errors);
    };
};

module.exports = { jsonValidate };