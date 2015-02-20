<?php
//`summary`
//`description` varchar(500) NOT NULL,
//`estimate` int,
//`points` int(11),

// Include confi.php
include_once('confi.php');

if($_SERVER['REQUEST_METHOD'] == "GET"){
	//Get Data
	$email = isset($_GET['email']) ? mysql_real_escape_string($_GET['email']) : "";

	$qur = mysql_query("SELECT email FROM `userrequest` WHERE email='$email'");
	$num_results = mysql_num_rows($qur); 
	if( $num_results > 0 ){
		$json = array("status" => 401, "msg" => "Signup Failed");
	}else{
		$sql = "INSERT INTO `$serverName`.`userrequest` (`ID`, `email`) VALUES (NULL, '$email');";
		$qur = mysql_query($sql);
		$json = array("status" => 200, "msg" => "Signup Successful");
	}
}else{
	$json = array("status" => 400, "msg" => "Request method not accepted");
}

@mysql_close($conn);

/* Output header */
	header('Content-type: application/json');
	echo json_encode($json);
