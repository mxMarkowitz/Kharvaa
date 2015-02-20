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

	$qur = mysql_query("SELECT ID, name, status FROM `users` WHERE name='$username' AND password='$password'");
	if($qur){
		
		//$result =array();
		//while($r = mysql_fetch_array($qur)){
		//	extract($r);
		//	$result[] = array("ID" => $id); 
		//} 
		$num_rows = mysql_num_rows($qur);
		if ($num_rows == 0){
			$json = array("status" => 400, "msg" => "Login failed");
		}
		else{
			while($row = mysql_fetch_array( $qur )) {
		
		     // Print out the contents of each row into a table
		     //$json = array("result" => $row[0]);
			//echo json_encode($row);
				$json = array("status" => 200, "msg" => "Login success", "ID" => $row['ID'], "Name"=> $row['name']);
			}

		}
		//$json = array("status" => 1, "msg" => "Login success", "ID" => $num_rows, "username"=> $username, "password"=> $password);
		//$json = array("status" => 1, "msg" => "Login success", "result" => $qur);
	}else{
		$json = array("status" => 400, "msg" => "Login credentials incorrect");
	}

}else if($_SERVER['REQUEST_METHOD'] == "POST"){
	//temp stopper for register
	$json = array("status" => 0, "msg" => "Request method not accepted");
	break;
	//TODO: build random token to submit and use as auth
	$email = isset($_POST['email']) ? mysql_real_escape_string($_POST['email']) : "";
	$username = isset($_POST['username']) ? mysql_real_escape_string($_POST['username']) : "";
	$password = isset($_POST['password']) ? mysql_real_escape_string($_POST['password']) : "";

	//check if user exists already

	$sql = "INSERT INTO `$serverName`.`users` (`ID`, `name`, `email`, `password`, `status`) VALUES (NULL, '$username', '$email', '$password', 'active');";

	$qur = mysql_query($sql);
	if($qur){
		$json = array("status" => 1, "msg" => "User Added!");
	}else{
		$json = array("status" => 0, "msg" => "Error User not added!");
	}
}else{
	$json = array("status" => 400, "msg" => "Request method not accepted");
}

@mysql_close($conn);

/* Output header */
	header('Content-type: application/json');
	echo json_encode($json);
