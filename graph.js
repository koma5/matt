function onConnect() {
    console.log("onConnect");
    for(i = 0; i < graphs.length; i++) {
      graphs[i].subscribe();
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
  for(i = 0; i< graphs.length; i++) {
    if(message.destinationName == graphs[i].topic) {
      graphs[i].data.push({value: message.payloadString,
                time: new Date()});
      graphs[i].update();
    }
  }

}

var Graph = function(topic, width, height) {
  var self = this;

  self.topic = topic;
  self.data = [];

  self.update = function() {

    self.x = d3.scaleTime()
        .domain([d3.min(self.data, function(d) {return d.time;}), d3.max(self.data, function(d) {return d.time;}) ])
        .range([0, self.width]);

    self.y = d3.scaleLinear()
        .domain([d3.min(self.data, function(d) {return d.value;}), d3.max(self.data, function(d) {return d.value;}) ])
        .range([self.height, 0]);

    self.xAxis = d3.axisBottom(self.x);
    self.yAxis = d3.axisRight(self.y);

    self.svg.selectAll(".axis--y")
      .transition().duration(500)
      .call(self.yAxis);
    self.svg.selectAll(".axis--x")
      .transition().duration(500)
      .call(self.xAxis);

    self.svg.selectAll(".line")
      .transition().duration(500)
      .attr('d', self.line(self.data));

      localStorage.setItem(self.topic, JSON.stringify(self.data));
  }

  self.svg = d3.select("body").append("svg").attr("id", self.topic).attr("width", width).attr("height", height);
  self.margin = {top: 20, right: 30, bottom: 30, left: 20}
  self.width = + width - self.margin.left - self.margin.right
  self.height = + height - self.margin.top - self.margin.bottom
  self.g = self.svg.append("g").attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")");


  self.line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d, i) {
      //console.log(x(d.time));
      return self.x(d.time);
    })
    .y(function(d, i) {
      //console.log(y(d.value));
      return self.y(d.value);
    })

  self.g.append("path")
    .attr("class", "line")
    .attr("fill", "black")

  self.g.append("g")
    .attr("class", "axis axis--y")
    .attr("transform", "translate(" + self.width + ", 0)");

  self.g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0 , " + self.height + ")");

  if(localStorage.getItem(self.topic) !== null) {
    self.data = JSON.parse(localStorage.getItem(self.topic));
    self.data.forEach(function(d, i) { d.time = d3.isoParse(d.time); });
    self.update();
  }

  self.subscribe = function() {
    client.subscribe(self.topic);
  }

}
