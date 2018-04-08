var RandExp = require("randexp");

module.exports = ({reply }) => {
	return reply(new RandExp(/[A-Z]{12,15}/).gen());
};
