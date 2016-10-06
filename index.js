var Service, Characteristic;
var storage = require('node-persist');

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-lockitron", "Lockitron", LockitronAccessory);
}
function LockitronAccessory(log, config) {
  this.log = log;
  this.name = config["name"];
  this.service = new Service.LockMechanism(this.name);

  this.service
    .getCharacteristic(Characteristic.LockTargetState)
    .on('set', this.setState.bind(this));
}

LockitronAccessory.prototype.setState = function (state, callback) {
    callback = callback || function() {};
    if (this.lockTimer) {
        clearTimeout(this.lockTimer);
        delete this.lockTimer;
    }

    var currentState = (state == Characteristic.LockTargetState.SECURED) ?
        Characteristic.LockCurrentState.SECURED : Characteristic.LockCurrentState.UNSECURED;

    this.service
        .setCharacteristic(Characteristic.LockCurrentState, currentState);
    if (state == Characteristic.LockTargetState.UNSECURED) {
        this.lockTimer = setTimeout(
            function(caller) {
                caller.setState(Characteristic.LockTargetState.SECURED);
                console.log('timer over');
            },
            10000,
            this
        );
    }
    callback();
}
LockitronAccessory.prototype.getServices = function() {
  return [this.service];
}
