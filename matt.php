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
	var mattViewModel = function()
	{
		this.sendOn = function()
		{
			$.post("./mqtt.php",{ t: "byteli/light/1", p: "on" });
		}
		this.sendOff = function()
		{
			$.post("./mqtt.php",{ t: "byteli/light/1", p: "off" });
		}
		this.sendToggle = function()
		{
			$.post("./mqtt.php",{ t: "byteli/light/1"});
		}
	}
	
	$(document).ready(function()
	{
		ko.applyBindings(new mattViewModel());
	})

	
	</script>
	
</head>
<body>





	<div>
		<button data-bind='click: sendToggle'>toggle</button>
		<button data-bind='click: sendOn'>on</button>
		<button data-bind='click: sendOff'>off</button>
	</div>



</body>
</html>
