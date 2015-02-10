<?php
//`summary`
//`description` varchar(500) NOT NULL,
//`estimate` int,
//`points` int(11),

// Include confi.php
include_once('confi.php');

if($_SERVER['REQUEST_METHOD'] == "POST"){
	//Get Data
	$summary = isset($_POST['summary']) ? mysql_real_escape_string($_POST['summary']) : "";
	$description = isset($_POST['description']) ? mysql_real_escape_string($_POST['description']) : "";
	$estimate = isset($_POST['estimate']) ? mysql_real_escape_string($_POST['estimate']) : "";
	$points = isset($_POST['points']) ? mysql_real_escape_string($_POST['points']) : "";
	$status = isset($_POST['status']) ? mysql_real_escape_string($_POST['status']) : "";
	$type = isset($_POST['type']) ? mysql_real_escape_string($_POST['type']) : "";
	$typecolor = isset($_POST['typecolor']) ? mysql_real_escape_string($_POST['typecolor']) : "";
	$owner = isset($_POST['owner']) ? mysql_real_escape_string($_POST['owner']) : "";
	$project = isset($_POST['project']) ? mysql_real_escape_string($_POST['project']): NULL;

	// Insert data into data base
	$sql = "INSERT INTO `$serverName`.`stories` (`ID`, `summary`, `description`, `estimate`, `points`, `status`, `type`, `typecolor`, `owner`, `project`) VALUES (NULL, '$summary', '$description', '$estimate', '$points', '$status', '$type', '$typecolor', '$owner', '$project')";
	//prepared statements
	$qur = mysql_query($sql);
	if($qur){
		$json = array("status" => 1, "msg" => "Story Added!");
	}else{
		$json = array("status" => 0, "msg" => "Error Story not added!");
	}
}else{
	$json = array("status" => 0, "msg" => "Request method not accepted");
}

@mysql_close($conn);

/* Output header */
	header('Content-type: application/json');
	echo json_encode($json);
