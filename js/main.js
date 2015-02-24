/*global $, jQuery, alert, console, document, getProjects, getStoriesByProject, updateStatus, showDeleteModal, showEditModal, getStories*/
/*jslint white: true, plusplus: true */
'use strict';

var DATA = {};
var ID = null;
var activeProject = null;


/*-- Main area modification --*/

    /* Clears main area 
     * @param 
     * @returns
    */
    function clearMain(){
        $('.main-area').hide();
        $('#controlsAddBtn').hide();
        $('.projects-Section').show();
        $('#controlsAddProjectBtn').show();
        $('#controlsProjectsBtn').hide();
        $('#controlsTaskBtn').show();
    }
    /* Shows main area 
     * @param 
     * @returns
    */
    function showMain(){
        $('.projects-Section').hide();
        $('#controlsAddBtn').show();
        $('.main-area').show();
        $('#controlsAddProjectBtn').hide();
        $('#controlsProjectsBtn').show();
        $('#controlsTaskBtn').hide();
    }
/*-- End Main area modification --*/

/*-- Story --*/

    /* Used for expanding stories, accounts for expand all functionality
     * @param 
     *     e - event that occurs to call, most likely click event on the story container
     *     expandAll - boolean flag to detect when the expand all setting may be actived or not
     * @returns
     */
    function expand( e, expandAll ){
        var details = $(e).children('.details'),
            controls = $(e).find('.controls-Buttons');
    
        if (details.is(":visible") && expandAll !== true ){
            controls.slideUp(100);
            details.slideUp(100);
        } else if  ( details.is(":visible") === false && expandAll !== false){
            details.slideDown(100);
            controls.slideDown(100);
    
        }
    }
    /* Expands all stories or collapses them
     * @param
     *     allFlag - boolean flag on whether to expand or collapse
     * @returns
     */
    function expandAllStories( allFlag ){
        var stories = $('.story');
        for (var i = 0; i < stories.length; i++){
            expand( $(stories[i]), allFlag);
        }
    }
    /* Sets drag-and drop functionality on stories 
     * @param
     * @returns
     */
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
                var status = $(this).parent().attr('id'),
                    id = $(ui.draggable).find('.id').html().slice(1),
                    col = ui.draggable.parents('.ui-droppable');
                if (col.attr('id') !== $(this).attr('id') ){
                    updateStatus(status, id);
                    $(this).append( ui.draggable );
                }
            }
        });
    }
    /* Writes out story data to a template and inserts into a column
     * @param
     *     storyData - story data
     *     column - column where story needs to be published
     * @returns
     */
    function writeStoryToColumn(storyData, column) {
        var template =  '<div class="story ui-draggable ui-draggable-handle">' +
                            '<div class="summary">' +
                                '<b class="id">#{{ ID }}</b>' +
                                '<span>{{ summary }}</span>' +
                            '</div>' +
                            '<div class="details">{{ details }}</div>' +
                            '<div class="controls"> ' +
                                '<div class="controls-Status">' +
                                    '<div class="edit">edit</div>' +
                                    '<div class="delete">delete</div>' +
                                    '<div class="tag" style="background:{{ typeColor }}">{{ type }}</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>';
        template = template.replace('{{ ID }}', storyData.ID);
        template = template.replace('{{ summary }}', storyData.summary);
        template = template.replace('{{ details }}', storyData.description);
        template = template.replace('{{ pointData }}', storyData.points);
    
        if (storyData.points === 1) {
            template = template.replace('{{ points }}', storyData.points + ' Point');
            template = template.replace('{{ point-hide }}', '');
        } else if (storyData.points === 0) {
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

    function addColumns(){
        var columns =   '<div class="story-Col" id="todoCol">'+
                        '   <div class="story-Col-Header">'+
                        '       <h2>To Do</h2>'+
                        '   </div>'+
                        '   <div class="story-Col-Body" id="todoBody">'+
                        '   </div>'+
                        '</div>'+
                        '<div class="story-Col" id="inProgressCol">'+
                        '   <div class="story-Col-Header">'+
                        '       <h2>In Progress</h2>'+
                        '   </div>'+
                        '   <div class="story-Col-Body" id="inProgressBody">'+
                        '   </div>'+
                        '</div>'+
                        '<div class="story-Col" id="testingCol">'+
                        '   <div class="story-Col-Header">'+
                        '       <h2>Testing</h2>'+
                        '   </div>'+
                        '   <div class="story-Col-Body" id="testingBody">'+
                        '   </div>'+
                        '</div>'+
                        '<div class="story-Col" id="doneCol">'+
                        '   <div class="story-Col-Header">'+
                        '       <h2>Done</h2>'+
                        '   </div>'+
                        '   <div class="story-Col-Body" id="doneBody">'+
                        '   </div>'+
                        '</div>';
        clearMain();
        $('.main-area').append(columns);
    }
/*-- End Story --*/

/*-- Project --*/

    /* Builds the story area based on a project ID, sets hash and activeProject
     * @param
     *     project - project ID
     *     name - project name
     *     hash - project hash
     * @returns
     */
    function getByProject(project, name, hash){
        activeProject = {
            id : project,
            name : name,
            hash : hash
        };
        getStoriesByProject(ID, project, populate);
        $('.project-Name').html( name );
        document.location.hash = hash;
    }
    /* Builds project from template
     * @param 
     *     data - project data
     * @returns
     *     built project element
     */
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
    /* Creates the project main area and registers events, hides story area
     * @param 
     * @returns
     */
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
        document.location.hash = '#projects';
        $('.project-Name').html( 'Kharvaa' );
        //$('.main-area').append(projects);
    
        getProjects(ID, function(data){
            var stories = data.stories,
                len,
                i;
    
            $('.projects-Body-Interior').html('');
            $('#notLoggedInMessage').hide();
            for ( i = 0, len = stories.length; i < len; i++ ){
                $('.projects-Body-Interior').append(buildProjectElement(stories[i]));
            }
            $('.project').on('click', function(){
                getByProject($(this).data('id'), $(this).data('name'), $(this).data('hash'));
            });
        });
    }
/*-- End Project --*/

/*-- Page Navigation --*/

    function hashCheck() {
        if ( document.location.hash !== '' ) {
            if (document.location.hash == '#projects'){
                addProjectsArea();
            } else {
                getProjects( ID, function (data) {
                    var i, len;
                    for ( i = 0, len = data.stories.length; i < len; i++) {
                        if (data.stories[i].hash === document.location.hash ) {
                            getByProject( data.stories[i].ID, data.stories[i].name, data.stories[i].hash);
                            break;
                        }
                    }
                });
            }
            return true;
        }
        return false;
    }
/*-- End Page Navigation --*/

function populate(data){
    var i, len, stories;
    showMain();
    
    stories = data.stories;
    for ( i = 0, len = stories.length; i < len; i++ ){
        writeStoryToColumn(stories[i], $('#' +stories[i].status) );
    }
    $('.story').draggable({ revert: true,
                            revertDuration: 0,
                            containment: $('.main-Area') });
    setDroppable();
    $('.story').on('click', function(e){
        expand(e.currentTarget);
    });
    $('.story .delete').on('click', function(e) {
        e.stopPropagation();
        var id = $(e.currentTarget).parent().parents('.story').find('.id').html().slice(1);

        //deleteStory(id);
        showDeleteModal(id);
    });
    $('.story .edit').on('click', function(e) {
        e.stopPropagation();
        var parent = $(e.currentTarget).parent().parents('.story'),
            storydata = {
            id: parent.find('.id').html().slice(1),
            summary: parent.find('.summary').children('span').html(),
            details: parent.find('.details').html(),
            tag: parent.find('.tag').html(),
            points: parent.find('.points').data('value'),
            estimate: parent.find('.estimate').html(),
            status: parent.parents('.story-Col').attr('id')
        };
        showEditModal(storydata);
    });
    $('.project').on('click', function(){
        getByProject($(this).data('id'));
    });
}
function init() {
    $('.story').remove();

    if (ID) {
        if (hashCheck() === false) {
            $('#controlsLoginBtn').val( 'Logout' );
            getStories(ID, populate);
        }
    } else {
        console.log('cookie = ' + $.cookie('remember')  );
        if ($.cookie('remember') === 'true') {
                console.log('cookie is true, logging in');
                ID = $.cookie('token');
                $('#controlsLoginBtn').val( 'Logout' );
            if (hashCheck() === false){
                getStories(ID, populate);
            }
        } else {
            console.log('cookie is false, displaying logged out message');
            $('#notLoggedInMessage').fadeIn();
        }
    }
    $('#controlsTaskBtn').on('click', function(){
        activeProject = null;
        document.location.hash = '';
        $('.project-Name').html( 'Kharvaa' );
        getStories(ID, populate);
    })
    $('#controlsAddProjectBtn').on('click', function(){
        $('.modal-Overlay').show();
        $('#projectsModal').fadeIn(200);
    })
}
function convertToSpitBallView(e){
    var target = $(e.currentTarget);
    target.addClass('spitball-project-before');

    var projectsArea = $('.projects-Body-Interior');
    var children = projectsArea.children();
    for (var i = 0; i < children.length; i++){
        if ($( children[i] ).hasClass('spitball-project-before') === false){

            if (i === (children.length - 1)){
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

$(function() {
    activeProject = null;
    ID = null;
    DATA = {};
    init();
});
