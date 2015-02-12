/* global $, console; */

/*-- Web Service Methods --*/
	function getStories(id, onSuccess){
		$.ajax({
			url: '/Agile/WebCalls/stories.php?id=' + id,
		  	success: function(data) {
		  		console.log('Got All Stories');
		  		//data = JSON.parse(data);
		  		onSuccess(data);
		  		return data;
		  	}
		  	//TODO add error handling
		});
	}
	function getStoriesByProject(id, project, onSuccess){
		$.ajax({
			url: '/Agile/WebCalls/stories.php?id=' + id + '&project=' + project,
		  	success: function(data) {
		  		console.log('Got All Stories');
		  		//data = JSON.parse(data);
		  		onSuccess(data);
		  		return data;
		  	}
		  	//TODO add error handling
		});
	}
	function getAllStories(onSuccess){
		$.ajax({
			url: '/Agile/WebCalls/getAllStories.php',
		  	success: function(data) {
		  		console.log('Got All Stories');
		  		//data = JSON.parse(data);
		  		onSuccess(data);
		  		return data;
		  	}
		});
	}
	function updateStatus(status, id){
		var url = '/Agile/WebCalls/updateStatus.php';
		$.ajax({
			type: 'PUT',
			headers: {
				'uid' : id,
				'status' : status
			},
			url: url,
		  	success: function(data) {
		  		console.log('Updated Status');
		  		//$('.story').remove();
		  		//getAllStories(populate);
		  	}
		});
	}
	function addStory(data, callback){
		$.ajax({
			type: "POST",
			url: '/Agile/WebCalls/newStory.php',
			data: data,
			success: callback
		});
	}
	function updateStory(data, callback){
		var url = '/Agile/WebCalls/stories.php';
		console.log('id = ' + data.id);
		$.ajax({
			type: "PUT",
			url: url,
			headers: {
				'uid': data.id,
				'summary': data.summary,
				'description': 	data.description,
				'estimate': 	data.estimate,
				'points': 		data.points,
				'status': 		data.status,
				'type': 		data.type,
				'typecolor': 	data.typecolor
			},
			success: callback
		});
	}
	function deleteStory(id){
		var url = '/Agile/WebCalls/stories.php?uid=' + id;
		console.log('deleting');
		$.ajax({
			type: 'DELETE',
			url: url,
		  	success: function(data) {
		  		console.log('Deleted Story');
		  		//data = JSON.parse(data);
		  		$('.story').remove();
		  		$('.deleteModal').fadeOut('200');
		  		$('.modal-Overlay').hide();
		  		getStories(ID, populate);
		  		hideModal();
		  	}
		});
	}
	function getProjects(id, onSuccess){
		$.ajax({
			url: '/Agile/WebCalls/projects.php?uid=' + id,
		  	success: function(data) {
		  		console.log('Got All Stories');
		  		//data = JSON.parse(data);
		  		onSuccess(data);
		  		return data;
		  	}
		  	//TODO add error handling
		});
	}

	function login(username, password){
		var url = '/Agile/WebCalls/users.php?username=' + username + '&password=' + password;
		console.log('login');
		$.ajax({
			type: 'GET',
			url: url,
		  	success: function(data) {
		  		console.log('logging in');
		  		console.log(data);
		  		
		  		if (data.status == 200){
		  			$('#notLoggedInMessage').fadeOut('200', function() {
		  				hideModal();
		  				$('#usernameInput').val('');
		  				$('#passwordInput').val('');
		  				$('#loginModal').find('h4').hide();
		  				getStories(ID, populate);
		  			});
		  			ID = data.ID;
		  			$.cookie('token', ID, { expires: 1, path: '/' });
		  			$.cookie('remember', true, { expires: 1, path: '/' });
		  			$('#controlsLoginBtn').val( 'Logout' );
		  		} else {
		  			$('#loginModal').find('h4').show();
		  		}
		  	},
		  	error: function(data){
		  		console.log('login failed');
		  		console.log(data);
		  		$('#loginModal').find('h4').show();
		  	}
		});
	}
	function logout(){
		$('.story').fadeOut();
		ID = null;
		$.removeCookie('remember', { path: '/' });
		$.removeCookie('token', { path: '/' });
		$('#notLoggedInMessage').fadeIn();
		$('#controlsLoginBtn').val( 'Login' );
	}
/*-- End Web Service Methods --*/
