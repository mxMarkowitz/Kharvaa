<?php
	// Include confi.php
	include_once('confi.php');

	if($_SERVER['REQUEST_METHOD'] == "GET"){
		$id = isset($_GET['uid']) ? mysql_real_escape_string($_GET['uid']) : "";

		if ($id != null and $id != ''){
			$qur = mysql_query("SELECT ID, name, description, owner, hash FROM `project` WHERE owner='$id'");

			if($qur === FALSE) {
				die(mysql_error()); // TODO: better error handling
			}
			$result =array();
			while($r = mysql_fetch_array($qur)){
				extract($r);
				$result[] = array("ID" => $ID,
								  "name" => $name, 
								  "description" => $description, 
								  "owner" => $owner,
								  "hash" => $hash); 
			}
			$json = array("status" => 1, "stories" => $result, 'id' => $id);
		}
		else {
			$json = array('status' => 400, "msg" => 'No id');
		}
	}
	else if($_SERVER['REQUEST_METHOD'] == "POST"){
		$name = isset($_POST['name']) ? mysql_real_escape_string($_POST['name']) : "";
		$description = isset($_POST['description']) ? mysql_real_escape_string($_POST['description']) : "";
		$owner = isset($_POST['owner']) ? mysql_real_escape_string($_POST['owner']) : "";

		$sql = "INSERT INTO `$serverName`.`project` (`ID`, `name`, `description`, `owner`) VALUES (NULL, '$name', '$description', '$owner')";
		//prepared statements
		$qur = mysql_query($sql);
		if($qur){
			$json = array("status" => 1, "msg" => "Project Added!");
		}else{
			$json = array("status" => 0, "msg" => "Error Project not added!");
		}
	}
	else if($_SERVER['REQUEST_METHOD'] == "PUT"){
	}
	else if($_SERVER['REQUEST_METHOD'] == "DELETE"){
	}
	else{
		$json = array("status" => 400, "msg" => "No method specified");
	}

@mysql_close($conn);

/* Output header */
	header('Content-type: application/json');
	echo json_encode($json);
