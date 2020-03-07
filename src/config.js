const fs = require("fs"),
	config_path = "/root/config/config.json";

if (fs.existsSync(config_path)) {
	module.exports = require(config_path);
} else {
	throw "config file not found, aborting";
}
