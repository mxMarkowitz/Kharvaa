<?php
//`summary`
//`description` varchar(500) NOT NULL,
//`estimate` int,
//`points` int(11),

// Include confi.php
include_once('confi.php');

if($_SERVER['REQUEST_METHOD'] == "GET"){
	//Get Data
	$username = isset($_GET['username']) ? mysql_real_escape_string($_GET['username']) : "";
	$password = isset($_GET['password']) ? mysql_real_escape_string($_GET['password']) : "";

	$qur = mysql_query("SELECT ID FROM `users` WHERE name='$username' AND password='$password'");
	$result =array();
		while($r = mysql_fetch_array($qur)){
			extract($r);
			$result[] = array("ID" => $ID);
		}

	if($qur){
		$json = array("status" => 1, "msg" => "Login success", "ID" => $result[0]['ID']);
	}else{
		$json = array("status" => 0, "msg" => "Login credentials incorrect");
	}
}else{
	$json = array("status" => 0, "msg" => "Request method not accepted");
}

@mysql_close($conn);

/* Output header */
	header('Content-type: application/json');
	echo json_encode($json);
