const mqtt = require('mqtt'),
	wol = require("wake_on_lan"),
	req = require("request"),
	config = require("./config");

let client = mqtt.connect('mqtts://io.adafruit.com', { username: config.mqtt.username, password: config.mqtt.key });

client.subscribe(`${config.mqtt.username}/f/${config.mqtt.feed}`, (err, data) => {
	if (!err) {
		log(`subscribed to '${data[0].topic}'`);
	}
});
client.on('message', function(topic, message) {
	// message is Buffer
	let str = message.toString();
	if (client.ignoreNext === str) {
		client.ignoreNext = "";
		return;
	}
	log(`received : '${message}'`);
	handleTrigger(str, topic);
});

function handleTrigger(str, topic) {
	switch (str) {
		case "ping":
			send("pong", topic);
			ifttt("pong");
			break;
		case "wake":
			wol.wake(config.mac_address, { address: config.ip_broadcast }, (err) => {
				err ? log(`error waking '${config.mac_address}':\n${err.message}`) : log(`woke '${config.mac_address}'`);
			});
			break;
	}
}

function pad(number, digits) {
	if (number.toString().length > digits) return number.toString();
	return ("0".repeat(digits) + number).slice(-digits);
}

function getTimeStamp() {
	let date = new Date();
	return `${pad(date.getHours(), 2)}:${pad(date.getMinutes(), 2)}:${pad(date.getSeconds(), 2)}`;
}

function log(str) {
	console.log(`[${getTimeStamp()}] ${str}`);
}

function send(str, topic) {
	log(`sent : '${str}'`);
	client.publish(topic, str);
	client.ignoreNext = str;
}

function ifttt(str) {
	req.post(`https://maker.ifttt.com/trigger/rpi_message/with/key/${config.ifttt_key}`, { json: { "value1": str } });
}
