/**
 * Subscribes to an MQTT broker and topic.
 * @param {string} broker - The MQTT broker URL.
 * @param {string} topic - The topic to subscribe to.
 */
function subscribeMqtt(broker, topic) {
	//if(clientid == "") {
	//	clientid = makeId(8);
	//}
	clientid = makeId(8)

	console.log(clientid)
	connectionString = constructConnectionString(broker);
	client = new Paho.Client(connectionString, clientid);
	client.connect({
		onSuccess: () => {
			client.subscribe(topic);
			//$SD.api.showOk(jsonObj);
		},
		onFailure: () => {
			//$SD.api.showAlert(jsonObj);
		},
		timeout: 5,
		useSSL: false,
		userName: "",
		password: ""
	});
	
	client.onMessageArrived = (message) => {
		console.log('New message arrived:', message.payloadString);
		console.log(message.topic);
		$SD.setTitle("224e5ec5aaa2e76240e1ddd09ad9a9ff", convertNumber(message.payloadString)+'W');
		// Handle the new message here
	};
}

/**
 * Converts a number to a formatted string.
 * @param {string} number - The number to convert.
 * @returns {string} The formatted string.
 */
function convertNumber(number) {
	let integer = parseInt(number.replace(/,/g, ''))*-1;
	if (integer.toString().length > 3) {
		return (integer / 1000).toFixed(1) + 'k';
	} else {
		return integer;
	}
}

const contextToTopicMapping = new Map();

/**
 * Stores the mapping between a topic and a context.
 * @param {string} topic - The MQTT topic.
 * @param {string} context - The Stream Deck context.
 */
function storeContextToTopicMapping(topic, context) {
	contextToTopicMapping.set(topic, context);
}



/**
 * Fetches the context associated with a topic.
 * @param {string} topic - The MQTT topic.
 * @returns {string | undefined} The Stream Deck context, or undefined if not found.
 */
function fetchContextFromTopic(topic) {
	return contextToTopicMapping.get(topic);
}

/**
 * Generates a random ID.
 * @param {number} length - The length of the ID.
 * @returns {string} The generated ID.
 */
function makeId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
/**
 * Generates ws connection string for given host and port
 * @param {string} host The hostname or IP address of the broker
 * @param {number} [port=80] The port of the broker (optional, default is 80).
 * @returns 
 */
function constructConnectionString(host, port = 80) {
	return `ws://${host}:${port}/ws`;
}

const myAction = new Action('de.openwb.openwb2.action');

/**
 * Event fired when Stream Deck starts.
 * @param {Object} params - The event parameters.
 */
$SD.onConnected(({ actionInfo, appInfo, connection, messageType, port, uuid }) => {
	console.log('Stream Deck connected!');
	subscribeMqtt("ws://192.168.178.205:80/ws","openWB/pv/get/power")
});

myAction.onKeyUp(({ action, context, device, event, payload }) => {
	console.log('Key up');
});

myAction.onDialRotate(({ action, context, device, event, payload }) => {
	console.log('Your dial code goes here!');
});

myAction.onKeyDown(({ action, context, device, event, payload })=> {
	console.log("Key down event received");
	console.log(context);
	//	let settings = payload.settings;

//	sendMqtt(context, settings.valBroker, settings.valPort, settings.valUsername, settings.valPassword, settings.valSsl, settings.valClientId, settings.valTopic, settings.valMessage, settings.valRetain);
});

myAction.onWillAppear(({ action, context, device, event, payload }) => {
	console.log('Retrieving settings for context:', context);
	$SD.getSettings(context);
});

myAction.didReceiveSettings(({ context, payload }) => {
	console.log('Settings received:', payload);
	//check if setting has topic and is of correct type
	// store context to topic mapping
	//storeContextToTopicMapping(payload.valTopic, context);
	// subscribe to topic
	//subscribeMqtt(payload.valBroker, payload.valTopic);

});