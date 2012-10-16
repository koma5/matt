<?php

require("phpMQTT/phpMQTT.php");



if (isset($_REQUEST['t']))
{
	$topic = $_REQUEST['t'];
	$payload = $_REQUEST['p'];

	echo "topic:" . $topic;
	echo "</br>payload: " . $payload;
	$mqtt = new phpMQTT("127.0.0.1", 1883, "PHP MQTT Bridge");

	if ($mqtt->connect())
	{
		$mqtt->publish($topic, $payload,0);
		$mqtt->close();
	}



}









?>



