function writeStoryToColumn(storyData, column){
	/*
	var template =	'<div class="story ui-draggable ui-draggable-handle">'+
						'<div class="summary">'+
							'<b class="id">#{{ ID }}</b>'+
							'<span>{{ summary }}</span>'+
						'</div>'+
						'<div class="details" style="display: none;">{{ details }}</div>'+
						'<div class="controls"> '+
							'<div class="controls-Buttons">'+
								'<div class="edit">edit</div>'+
								'<div class="delete">delete</div>'+
							'</div>'+
							'<div class="controls-Status">'+
								'<div class="points" {{ point-hide }} data-value="{{ pointData }}">{{ points }}</div>'+
								'<div class="estimate">0</div>'+
								'<div class="tag" style="background:{{ typeColor }}">{{ type }}</div> '+
							'</div>'+
						'</div>'+
					'</div>';
	*/
	var template =	'<div class="story ui-draggable ui-draggable-handle">'+
						'<div class="summary">'+
							'<b class="id">#{{ ID }}</b>'+
							'<span>{{ summary }}</span>'+
						'</div>'+
						'<div class="details">{{ details }}</div>'+
						'<div class="controls"> '+
							'<div class="controls-Status">'+
								'<div class="edit">edit</div>'+
								'<div class="delete">delete</div>'+
								'<div class="tag" style="background:{{ typeColor }}">{{ type }}</div> '+
							'</div>'+
						'</div>'+
					'</div>';
	template = template.replace('{{ ID }}', storyData.ID);
	template = template.replace('{{ summary }}', storyData.summary);
	template = template.replace('{{ details }}', storyData.description);
	template = template.replace('{{ pointData }}', storyData.points);
	if (storyData.points == 1){
		template = template.replace('{{ points }}', storyData.points + ' Point');
		template = template.replace('{{ point-hide }}', '');
	} else if (storyData.points == 0){
		template = template.replace('{{ point-hide }}', 'style="display: none"');
	} else {
		template = template.replace('{{ point-hide }}', '');
		template = template.replace('{{ points }}', storyData.points + ' Points');
	}
	template = template.replace('{{ type }}', storyData.type);
	template = template.replace('{{ typeColor }}', storyData.typecolor);
	template = template.replace('{{ estimate }}', storyData.estimate);


	column.children('.story-Col-Body').append(template);
}

function init(){
	$('.story').remove();
	if (ID){
		if (hashCheck() == false){
			$('#controlsLoginBtn').val( 'Logout' );
			getStories(ID, populate);
		}
	} else {
		console.log('cookie = ' + $.cookie('remember')  );
		if ($.cookie('remember') == 'true'){
				console.log('cookie is true, logging in');
				ID = $.cookie('token');
				$('#controlsLoginBtn').val( 'Logout' );
			if (hashCheck() == false){
				getStories(ID, populate);
			}
		} else {
			console.log('cookie is false, displaying logged out message');
			$('#notLoggedInMessage').fadeIn();
		}
	}
}
function hashCheck(){
	if ( document.location.hash != '' ){
		getProjects(ID, function(data){
			for ( var i = 0, len = data.stories.length; i < len; i++){
				if (data.stories[i].hash == document.location.hash ){
					getByProject( data.stories[i].ID, data.stories[i].name, data.stories[i].hash);
					break;
				}
			}
		});
		return true;
	}
	return false;
}

function populate(data){
	showMain();
	var stories = data.stories;
	for (var i = 0; i < stories.length; i++){
		writeStoryToColumn(stories[i], $('#' +stories[i].status) );
	}
	$('.story').draggable({ revert: true,
							revertDuration: 0,
							containment: $('.main-Area') });
	setDroppable();
	$('.story').on('click', function(e){
		expand(e.currentTarget);
	})
	$('.story .delete').on('click', function(e) {
		e.stopPropagation();
		var id = $(e.currentTarget).parent().parents('.story').find('.id').html().slice(1);

		//deleteStory(id);
		showDeleteModal(id);
	});
	$('.story .edit').on('click', function(e) {
		e.stopPropagation();
		var parent = $(e.currentTarget).parent().parents('.story');
		var data = {
			id: parent.find('.id').html().slice(1),
			summary: parent.find('.summary').children('span').html(),
			details: parent.find('.details').html(),
			tag: parent.find('.tag').html(),
			points: parent.find('.points').data('value'),
			estimate: parent.find('.estimate').html(),
			status: parent.parents('.story-Col').attr('id')
		}
		showEditModal(data);
	});
	$('.project').on('click', function(e){
		getByProject($(this).data('id'));
	});
}
function getByProject(project, name, hash){
	//activeProject = project;
	activeProject = {
		id : project,
		name : name,
		hash : hash
	}
	getStoriesByProject(ID, project, populate);
	$('.project-Name').html( name );
	document.location.hash = hash;
}

function addColumns(){
	var columns = 	'<div class="story-Col" id="todoCol">'+
					'	<div class="story-Col-Header">'+
					'		<h2>To Do</h2>'+
					'	</div>'+
					'	<div class="story-Col-Body" id="todoBody">'+
					'	</div>'+
					'</div>'+
					'<div class="story-Col" id="inProgressCol">'+
					'	<div class="story-Col-Header">'+
					'		<h2>In Progress</h2>'+
					'	</div>'+
					'	<div class="story-Col-Body" id="inProgressBody">'+
					'	</div>'+
					'</div>'+
					'<div class="story-Col" id="testingCol">'+
					'	<div class="story-Col-Header">'+
					'		<h2>Testing</h2>'+
					'	</div>'+
					'	<div class="story-Col-Body" id="testingBody">'+
					'	</div>'+
					'</div>'+
					'<div class="story-Col" id="doneCol">'+
					'	<div class="story-Col-Header">'+
					'		<h2>Done</h2>'+
					'	</div>'+
					'	<div class="story-Col-Body" id="doneBody">'+
					'	</div>'+
					'</div>';
	clearMain();
	$('.main-area').append(columns);
}
function addProjectsArea(){
	var projects = '<div class="projects-Section">' +
						'<div class="projects-Head">' +
							'<h2>Projects</h2>' +
						'</div>' +
						'<div class="projects-Body">' +
							'<div class="projects-Body-Interior">' +
							'</div>' +
						'</div>' +
					'</div>';
	clearMain();
	$('.project-Name').html( 'Kharvaa' );
	//$('.main-area').append(projects);

	getProjects(ID, function(data){
		var stories = data.stories;
		$('.projects-Body-Interior').html('');
		$('#notLoggedInMessage').hide();
		for (var i = 0; i < stories.length; i++){
			$('.projects-Body-Interior').append(buildProjectElement(stories[i]));
		}
		$('.projects-Body-Interior').append('<div id="allProjects">All</div>');
		$('.projects-Body-Interior').append('<div id="addProjectButton">+</div>');
		$('.project').on('click', function(e){
			getByProject($(this).data('id'), $(this).data('name'), $(this).data('hash'));
		});
		$('#allProjects').on('click', function(e){
			activeProject = null;
			document.location.hash = '';
			$('.project-Name').html( 'Kharvaa' );
			getStories(ID, populate);
			//convertToSpitBallView(e);
		});
		$('#addProjectButton').on('click', function(){
			$('.modal-Overlay').show();
			$('#projectsModal').fadeIn(200);
		})
	});

}
function buildProjectElement(data){
	var projectElement = '<div class="project" data-owner="{{ owner }}" data-id="{{ id }}" data-name="{{ title }}" data-hash="{{ hash }}">' +
							'<div class="project-Title">' +
								'<h2>{{ title }}</h2>' +
							'</div>' +
							'<div class="project-Content">' +
								'<p>{{ description }}</p>' +
							'</div>' +
						 '</div>';
	projectElement = projectElement.replace('{{ id }}', data.ID);
	projectElement = projectElement.replace('{{ owner }}', data.owner);				 
	projectElement = projectElement.replace(/{{ title }}/g, data.name);
	projectElement = projectElement.replace('{{ description }}', data.description);
	projectElement = projectElement.replace('{{ hash }}', data.hash);
	return projectElement;
}
function convertToSpitBallView(e){
	var target = $(e.currentTarget);
	target.addClass('spitball-project-before');

	var projectsArea = $('.projects-Body-Interior');
	var children = projectsArea.children();
	for (var i = 0; i < children.length; i++){
		if ($( children[i] ).hasClass('spitball-project-before') == false){

			if (i == (children.length - 1)){
				$( children[i] ).fadeOut('200', function() {
					$(this).remove();
					target.removeClass('spitball-project-before');
					target.animate({
						width: '100%',
						height: '100px'},
						400, function() {
						target.removeAttr('id');
						target.removeClass();
						target.addClass('spitball-header');
						target.append('<div class="idea-create-btn">Add an Idea</div>');
						projectsArea.append('<div class="spitball-body"></div>');
						/* stuff to do after animation is complete */
					});
				});
			} else {
				$( children[i] ).fadeOut('200', function() {
					$(this).remove();
				});
			}
		}
	}
}
function createSpitballArea(projectData){
	var template = '<div class="spitball-header>' +
						'<div class="spitball-header-project-container">' +
							'<h2> {{ project-Name }} </h2>' +
							'<p> {{ project-Description }} </p>' +
						'</div>' +
					'</div>' +
					'<div class="spitball-body">' +
					'</div>';
}

function clearMain(){
	$('.main-area').hide();
	$('#controlsAddBtn').hide();
	$('.projects-Section').show();
}
function showMain(){
	$('.projects-Section').hide();
	$('#controlsAddBtn').show();
	$('.main-area').show();
}
function expandAllStories(all){
	var stories = $('.story');
	for (var i = 0; i < stories.length; i++){
		expand( $(stories[i]), all);
	}
}
//allflag true = expand all
//allflag false = collapse all
function expand(e, allFlag){
	var details = $(e).children('.details')
		controls = $(e).find('.controls-Buttons');

	if (details.is(":visible") && allFlag != true ){
		controls.slideUp(100);
		details.slideUp(100);
	} else if  ( details.is(":visible") == false && allFlag != false){
		details.slideDown(100);
		controls.slideDown(100);

	}
}
function setDroppable(){
	//inprogressdrop
	//accept any
	//testingdrop
	//only accept in progress
	//done
	//accept any

	$( ".story-Col-Body" ).droppable({
		  accept: ".story",
		  activeClass: "ui-state-hover",
		  hoverClass: "ui-state-active",
		  drop: function( event, ui ) {
		  	var status = $(this).parent().attr('id');
		  	var id = $(ui.draggable).find('.id').html().slice(1);
		  	var col = ui.draggable.parents('.ui-droppable');
		  	if (col.attr('id') != $(this).attr('id') ){
		  		updateStatus(status, id);
		  		$(this).append( ui.draggable );
		  	}
		}
	});
}

var DATA = {};
var ID = null;
var activeProject = null;

$(function() {
	console.log('document is ready');
	activeProject = null;
	ID = null;
	DATA = {};
	init();
});
