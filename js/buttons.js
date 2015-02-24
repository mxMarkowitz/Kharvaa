/*-- Button Methods --*/
	$('#controlsAddBtn').on('click', function(e){
		showAddModal();
	});
	$('#controlsOptionsBtn').on('click', function(e){
		showOptionsModal();
	});
	$('#controlsProjectsBtn').on('click', function(e){
		addProjectsArea();
	});
	$('.modal-Right-Button').on('click', function(){
		hideModal();
	});

	$('#controlsProjectsBtn').on('click', function(e){
		getProjects(ID, function(data){
			$('.story').remove();

		});
	});
	$('#controlsLoginBtn' ).on('click', function(e){
		if ($(this).val() == 'Login'){
			showLoginModal();
		} else {
			logout();
		}
	});
	$('#controlsExpandBtn').on('click', function(e){
		if (this.value == 'Expand'){
			expandAllStories(true);
			this.value = 'Collapse';
		} else {
			expandAllStories(false);
			this.value = 'Expand';
		}
	});
	$('#loginModalLoginBtn').on('click', function(e){
		onLoginClick(e);
	});
/*-- End Button Methods --*/
