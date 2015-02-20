<?php
	// Include confi.php
	include_once('confi.php');

	if($_SERVER['REQUEST_METHOD'] == "GET"){
		$id = isset($_GET['id']) ? mysql_real_escape_string($_GET['id']) : "";
		$project = isset($_GET['project']) ? mysql_real_escape_string($_GET['project']) : "";

		if ($id != null and $id != ''){
			if ($project != null and $project != ''){
				$qur = mysql_query("SELECT ID, summary, description, status, estimate, points, type, typecolor, project FROM `stories` WHERE owner='$id' AND project='$project'");
			} else {
				$qur = mysql_query("SELECT ID, summary, description, status, estimate, points, type, typecolor, project FROM `stories` WHERE owner='$id'");
			}

		
			if($qur === FALSE) {
				die(mysql_error()); // TODO: better error handling
			}
			$result =array();
			while($r = mysql_fetch_array($qur)){
				extract($r);
				$result[] = array("ID" => $ID,
								  "summary" => $summary, 
								  "description" => $description, 
								  "status" => $status,
								  "estimate" => $estimate,
								  "points" => $points,
								  "type" => $type,
								  "typecolor" => $typecolor,
								  "project" => $project); 
			}
			$json = array("status" => 1, "stories" => $result, 'id' => $id);
		}
		else {
			$json = array('status' => 400, "msg" => "No id ");
		}
	}
	else if($_SERVER['REQUEST_METHOD'] == "POST"){
		//Get Data
		$id = isset($_GET['id']) ? mysql_real_escape_string($_GET['id']) : "";
		if ($id != null and $id != ''){
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
			$sql = "INSERT INTO `$serverName`.`stories` (`ID`, `summary`, `description`, `estimate`, `points`, `status`, `type`, `typecolor`, `owner`, `project`) VALUES (	NULL, '$summary', '$description', '$estimate', '$points', '$status', '$type', '$typecolor', '$id', '$project');";
			$qur = mysql_query($sql);
			if($qur){
				$json = array("status" => 1, "msg" => "Story Added!");
			}else{
				$json = array("status" => 0, "msg" => "Error Story not added!");
			}
		}else{
			$json = array("status" => 400, "msg" => "No id");
		}
	}
	else if($_SERVER['REQUEST_METHOD'] == "PUT"){
		//Get Data
		$uid = isset($_SERVER['HTTP_UID']) ? mysql_real_escape_string($_SERVER['HTTP_UID']) : "";
		$summary = isset($_SERVER['HTTP_SUMMARY']) ? mysql_real_escape_string($_SERVER['HTTP_SUMMARY']) : "";
		$description = isset($_SERVER['HTTP_DESCRIPTION']) ? mysql_real_escape_string($_SERVER['HTTP_DESCRIPTION']) : "";
		$estimate = isset($_SERVER['HTTP_ESTIMATE']) ? mysql_real_escape_string($_SERVER['HTTP_ESTIMATE']) : "";
		$points = isset($_SERVER['HTTP_POINTS']) ? mysql_real_escape_string($_SERVER['HTTP_POINTS']) : "";
		$status = isset($_SERVER['HTTP_STATUS']) ? mysql_real_escape_string($_SERVER['HTTP_STATUS']) : "";
		$type = isset($_SERVER['HTTP_TYPE']) ? mysql_real_escape_string($_SERVER['HTTP_TYPE']) : "";
		$typecolor = isset($_SERVER['HTTP_TYPECOLOR']) ? mysql_real_escape_string($_SERVER['HTTP_TYPECOLOR']) : "";
		
		// Add your validations
		if(!empty($uid)){
			$qur = mysql_query("UPDATE `$serverName`.`stories` SET `summary` = '$summary', `description` = '$description', `estimate` = '$estimate', `points` = '$points', `status` = '$status', `type` = '$type', `typecolor` = '$typecolor' WHERE  `stories`.`ID` ='$uid'");
			if($qur){
				$json = array("status" => 1, "msg" => "Status updated!!.");
			}else{
				$json = array("status" => 0, "msg" => "Error updating status");
			}
		}else{
			$json = array("status" => 0, "msg" => "Story ID not define");
		}
	} 
	else if($_SERVER['REQUEST_METHOD'] == "DELETE"){
		//Get Data
		$uid = isset($_GET['uid']) ? mysql_real_escape_string($_GET['uid']) : "";
		// Ensure it exists data into data base
		$qur = mysql_query("SELECT ID FROM `stories` WHERE ID='$uid'");
		if($qur === FALSE) {
    		die(mysql_error()); // TODO: better error handling
		} else {
			$result = mysql_query("DELETE FROM `stories` WHERE ID='$uid'");
		}
		if($result){
			$json = array("status" => 1, "msg" => "Story Deleted! at '$uid'");
		}else{
			$json = array("status" => 0, "msg" => "Error Story not deleted!");
		}
	}
	

@mysql_close($conn);

/* Output header */
	header('Content-type: application/json');
	echo json_encode($json);
