<!doctype html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

	<title>matt</title>
	<meta name="description" content="mqtt Home Automation Dashboard">
	<meta name="author" content="Marco Koch">

	<meta name="viewport" content="width=device-width,initial-scale=1">

	<link rel="stylesheet" href="./style.css">

	<script src="jquery-1.7.1.min.js"></script>
	<script src="knockout.js"></script>
	
	<script>
	var device = function(topic)
	{
		deviceTopic = topic;
		postURL = "./mqtt.php";
		
		this.sendToggle = function()
		{
			$.post(postURL, { t: deviceTopic});
		}
		
		this.sendOn = function()
		{
			$.post(postURL, { t: deviceTopic, p: "on" });
		}
		
		this.sendOff = function()
		{
			$.post(postURL, { t: deviceTopic, p: "off" });
		}
	}
	
	
	var mattViewModel = function()
	{
		led = new device("byteli/light/1")
	};
	
	$(document).ready(function()
	{
		ko.applyBindings(new mattViewModel());
	})

	
	</script>
	
</head>
<body>

	<div>
		<ul>
		<li><button data-bind='click: led.sendOn'>on</button></li>
		<li><button data-bind='click: led.sendOff'>off</button></li>
		<li><button data-bind='click: led.sendToggle'>toggle</button></li>
		</ul>
	</div>

</body>
</html>
