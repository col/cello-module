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

var device = awsIot.device(deviceCredentials);

device.subscribe(mainTopic);

function disarm() {
  device.publish(mainTopic, JSON.stringify({ event: 'disarmed', device: deviceName }));
}

function boom() {
  device.publish(mainTopic, JSON.stringify({ event: 'boom', device: deviceName }));
}

function arm() {
  device.publish(mainTopic, JSON.stringify({ event: 'armed', device: deviceName }));
}

function reset() {
  console.log("Reset.")
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
  process.exit();
}

process.on('SIGINT', exit);
