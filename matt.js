function onConnect() {
    console.log("onConnect");
    for(i = 0; i < devices.length; i++) {
      devices[i].subscribeState();
    }
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
    client.connect({onSuccess:onConnect});
    }
}

// called when a message arrives
function onMessageArrived(message) {
  console.log(message.destinationName + " " + message.payloadString);
  for(i = 0; i< devices.length; i++) {
    if(message.destinationName == devices[i].deviceStateTopic) {
      if(message.payloadString == "on") {
          devices[i].state(true);
      }
      else {
          devices[i].state(false);
      }
    }
  }
}


var device = function(topic, stateTopic, name)
{
  var self = this;
  self.state = ko.observable();
  self.deviceTopic = topic;
  self.deviceStateTopic = stateTopic;
  self.name = name == undefined? topic : name;

  self.isOn  = function() { return  self.state(); }
  self.isOff = function() {
    if(typeof self.state() === 'undefined') { return false;}
    else { return !self.state(); }
  }

  self.sendMessage = function(messageString)
  {
    message = new Paho.MQTT.Message(messageString);
    message.destinationName = self.deviceTopic;
    client.send(message);
    console.log("send: " + self.deviceTopic + " " + message.payloadString);
  }

  self.sendOn     = function() { self.sendMessage("on");     }
  self.sendOff    = function() { self.sendMessage("off");    }
  self.sendToggle = function() { self.sendMessage("toggle"); }

  self.subscribeState = function() {
    client.subscribe(self.deviceStateTopic);
  }
}
