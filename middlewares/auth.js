
/**
 * HTTP Basic Authentication
 */
 const debug = require('debug')('photos:auth');
const models = require('../models');
const bcrypt = require('bcrypt');

 const basic = async (req, res, next) => {

	// make sure Authorization header exists, otherwise bail
	if (!req.headers.authorization) {
		debug("Authorization header missing");

		return res.status(401).send({
			status: 'fail',
			data: 'Authorization required',
		});
	}

	const [authSchema, base64Payload] = req.headers.authorization.split(' ');

	// if authSchema isn't "basic", then bail
	if (authSchema.toLowerCase() !== "basic") {
		debug("Authorization schema isn't basic");

		return res.status(401).send({
			status: 'fail',
			data: 'Authorization required',
		});
	}

	// decode payload from base64 => ascii
	const decodedPayload = Buffer.from(base64Payload, 'base64').toString('ascii');
	// decodedPayload = "email:password"

	// split decoded payload into "<email>:<password>"
	const [email, password] = decodedPayload.split(':');

	const user = await new models.user({ email }).fetch({require: false});
	if (!user) {
		return res.status(401).send({
			status: 'fail',
			data: 'Wrong email',
		});
	}

    const hash = user.get('password');

    const result = await bcrypt.compare(password, hash);
    if(!result){
        return res.status(401).send({
            status: 'fail',
            data: "auth failed",
        });
    }

	// finally, attach user to request
	req.user = user;

    next();
 }

 module.exports = {
     basic,
 }