<?php

// Include confi.php
include_once('confi.php');

if($_SERVER['REQUEST_METHOD'] == "PUT"){

	//Get Data
	$uid = isset($_SERVER['HTTP_UID']) ? mysql_real_escape_string($_SERVER['HTTP_UID']) : "";
	$status = isset($_SERVER['HTTP_STATUS']) ? mysql_real_escape_string($_SERVER['HTTP_STATUS']) : "";

	// Add your validations
	if(!empty($uid)){
		$qur = mysql_query("UPDATE  `$serverName`.`stories` SET `status` = '$status' WHERE  `stories`.`ID` ='$uid';");
		if($qur){
			$json = array("status" => 1, "msg" => "Status updated!!");
		}else{
			$json = array("status" => 0, "msg" => "Error updating status");
		}
	}else{
		$json = array("status" => 0, "msg" => "Story ID not defined");
	}
}else{
		$json = array("status" => 0, "msg" => "Story ID not defined");
	}
	@mysql_close($conn);

	/* Output header */
	header('Content-type: application/json');
	echo json_encode($json);
