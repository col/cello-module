var _ = require("lodash");
var awsIot = require('aws-iot-device-sdk');
var Gpio = require('chip-gpio').Gpio;

var deviceName = "cello-chip";
var deviceCredentials = {
  keyPath: '/home/chip/.aws-device/private.pem.key',
  certPath: '/home/chip/.aws-device/certificate.pem.crt',
  caPath: '/home/chip/.aws-device/root-CA.pem',
  clientId: deviceName,
  region: 'ap-southeast-1',
  reconnectPeriod: 1500
};
var mainTopic = "mozart";

var buttons = [
  new Gpio(1, 'in', 'rising', { debounceTimeout: 500 }),
  new Gpio(2, 'in', 'rising', { debounceTimeout: 500 }),
  new Gpio(3, 'in', 'rising', { debounceTimeout: 500 }),
  new Gpio(4, 'in', 'rising', { debounceTimeout: 500 }),
];

var greenLED = new Gpio(6, 'out');
var redLED = new Gpio(7, 'out');

var LED_ON = 0;
var LED_OFF = 1;

var buttonSequence = [];
var correctAnswer = [0, 3, 1, 2];

function watchButtons() {
  for (var i = 0; i < buttons.length; i++) {
    (function(index){
      buttons[index].watch(function(err, value) {
        if (err) throw err;
        if (!value) return

        buttonSequence.push(index);
        if (buttonSequence.length > 4) buttonSequence = buttonSequence.slice(buttonSequence.length-4, buttonSequence.length);
        console.log("Current sequence ", buttonSequence);

        if (_.isEqual(buttonSequence, correctAnswer)) disarm();
        else if (buttonSequence.length >= 4) boom();
      });
    })(i);
  }
}

watchButtons();

var device = awsIot.device(deviceCredentials);

device.subscribe(mainTopic);

function disarm() {
  console.log("Disarm!");
  greenLED.write(LED_ON);
  redLED.write(LED_OFF);
  device.publish(mainTopic, JSON.stringify({ event: 'disarmed', device: deviceName }));
}

function boom() {
  console.log("Boom!");
  greenLED.write(LED_OFF);
  redLED.write(LED_ON);
  device.publish(mainTopic, JSON.stringify({ event: 'boom', device: deviceName }));
}

function arm() {
  console.log("Armed!");
  greenLED.write(LED_OFF);
  redLED.write(LED_ON);
  device.publish(mainTopic, JSON.stringify({ event: 'armed', device: deviceName }));
}

function reset() {
  console.log("Reset.");
  greenLED.write(LED_OFF);
  redLED.write(LED_OFF);
}

device.on('message', function(topic, payload) {
    console.log('Message Received - Topic: ' + topic + ' Payload: ' + payload.toString());

    payload = JSON.parse(payload);
    switch (payload.event) {
      case "arm":
        arm();
        break;
      case "reset":
        reset();
        break;
    }
});

function exit() {
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].unexport();
  }
  process.exit();
}

process.on('SIGINT', exit);
