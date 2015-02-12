/* global $, console; */

/*-- Modal Methods --*/

	/*-- Delete Modal Methods --*/
		/* Show Delete Modal
		 *	@param {integer} id - id of story clicked
		 *	@return
		 */
		function showDeleteModal(id){
			$('#deleteModal').data('id', id);
			$('.modal-Overlay').show();
			$("html, body").animate({ scrollTop: 0 }, 200);
			$('#deleteModal').fadeIn(200);
		}
		/* Delete Modal Confirm Event
		 *	@param 
		 *	@return
		 */
		function deleteModalConfirm(){
			var id = $('#deleteModal').data('id');
			$('#deleteModal').data('id', '');
			deleteStory(id);
		}
	/*-- End Delete Modal Methods --*/

	/*-- Project Modal Methods --*/
		function addProject(){
			var project = {
				//'name': 
			}
		}
	/*-- End Project Modal Methods --*/

	/*-- Add Modal Methods -- */
		/* Show Add Modal
		 * @param 
		 * @returns
		 */
		function showAddModal(){
			$('.modal-Overlay').show();
			$('#addModal').fadeIn(200);
			getProjects(ID, function(data){
				console.log(data);
				var select = $('#addProjectInput'),
					options = $('#addProjectInput option');
				
				options.splice(0, 1);
				options.remove();

				console.log(options);
				for (var i = 0, len = data.stories.length; i < len; i++){
					select.append('<option value="' + data.stories[i].ID + '">' + data.stories[i].name + '</option>');
				}
				if (activeProject != null){
					select.val( activeProject.id );
				}
			});
		}
		/* On Create Click
		 * @param 
		 * @returns
		 * TODO move add post call to generic method
		 */
		function onCreateClick(){
			//required fields 
			// summary
			// type
			var story = {
				'summary' : $('#summaryInput').val(),
				'description' : $('#detailsInput').val(),
				'estimate': $('#estimateInput').val(),
				'status': 		'todoCol',
				'type': 		$('.modal-Text-Check.selected').val(),
				'typecolor': 	$( $('.modal-Text-Check.selected')[0] ).css('outline-color'),
				'owner' : ID,
				'project' : $('#addProjectInput').val()
			}
			if (story.summary !== '' && story.type !== undefined){
				addStory(story, function(data){
					console.log('Story Added');
				  	$('#summaryInput').val('');
				  	$('#detailsInput').val('');
				  	$('#estimateInput').val('');
					$('#pointsInput').val('');
					$( $('.modal-Text-Check.selected')[0] ).css('outline', '');
					$( $('.modal-Text-Check.selected')[0] ).removeClass('selected');
					$('.story').remove();
					if (activeProject == null){
						getStories(ID, populate);
					} else {
						getByProject(activeProject.id, activeProject.name, activeProject.hash);
					}
				  	hideModal();
				});
			} else {
				if ( story.summary == '' ){
					$('#summaryInput').css('outline', '1px solid red');
				} 
				if (story.type == undefined ){
				}
			}
		}
	/*-- End Add Modal Methods --*/

	/*-- Options Modal --*/
		/* Show Options Modal
		 * @param 
		 * @returns
		 */
		function showOptionsModal(){
			$('.modal-Overlay').show();
			$('#optionsModal').fadeIn(200)
		}
	/*-- End Options Model --*/

	/*-- Edit Modal Methods -- */
		/* Show Edit Modal
		 * @param
		 * @returns
		 */
		function showEditModal(data){
			var editModal = $('#editModal');
			editModal.data('id', data.id);
			editModal.data('status', data.status); 
			$('#summaryEditInput').val(data.summary);
			$('#detailsEditInput').html(data.details);
			$('#pointsEditInput').val(data.points);
			$('#estimateEditInput').val(data.estimate);
			var selectedType = $('#editModal').find("input[value='"+data.tag+"']");
				selectedType.trigger('click');
			$('.modal-Overlay').show();
			$('#editModal').fadeIn(200);

		}
		/* On Edit Save Click
		 * @param 
		 * @returns
		 */
		function onEditSaveClick(){
			var story = {
				'id': $('#editModal').data('id'),
				'summary' : 	$('#summaryEditInput').val(),
				'description' : $('#detailsEditInput').val(),
				'estimate': 	$('#estimateEditInput').val(),
				'points':		$('#pointsEditInput').val(),
				'status': 		$('#editModal').data('status'),
				'type': 		$('.modal-Text-Check.selected').val(),
				'typecolor': 	$( $('.modal-Text-Check.selected')[0] ).css('outline-color'),
				'owner' : ID
			}
			updateStory(story, function(data){
				$('#editModal').data('id', ''),
				$('#summaryEditInput').val('');
				$('#detailsEditInput').val('');
				$('#estimateEditInput').val('');
				$('#pointsEditInput').val('');
				$('#editModal').data('status', '');
				$( $('.modal-Text-Check.selected')[0] ).css('outline', '');
				$( $('.modal-Text-Check.selected')[0] ).removeClass('selected');
				$('.story').remove();
				getStories(ID, populate);
				hideModal();
			})

			return false;
		}
	/*-- End Edit Modal Methods -- */

	/*-- Login Modal Methods -- */
		function showLoginModal(){
			$('.modal-Overlay').show();
			$("html, body").animate({ scrollTop: 0 }, 200);
			$('#loginModal').fadeIn(200);
		}
		function showSignupModal(){
			$('.modal-Overlay').show();
			$("html, body").animate({ scrollTop: 0 }, 200);
			$('#signupModal').fadeIn(200);
		}
		function onLoginClick(e){
			console.log($('#passwordInput').val());
			login($('#usernameInput').val(), $('#passwordInput').val());
		}
	/*-- End Login Modal Methods -- */

	/*-- Generic Modal Methods --*/
		/* Hide Modal
		 * @param 
		 * @returns
		 */
		function hideModal(){
			$('.modal-Overlay').hide();
			$('.modal').fadeOut(200);
		}
		/* Check function for story type radio buttons
		 *	@param {object} e - onclick event object
		 *	@returns 
		 */
		function onCheckClick(e){
			e = $(e);

			if ( e.hasClass('selected')){
				e.css('outline', '');
				e.removeClass('selected');
			} else {
				//remove selected
				var selectedChecks = $('.modal-Text-Check.selected');
				if (selectedChecks.length != 0){
					$( selectedChecks[0] ).css('outline', '');
					$( selectedChecks[0] ).removeClass('selected');
				}

				e.addClass('selected');
				var color = e.css('background-color');
				if (color == 'rgb(255, 255, 255)'){
					color = e.css('color');
				}
				e.css('outline', '1px solid ' + color);
			}
		}
	/*-- End Generic Modal Methods --*/
/*-- End Modal Methods --*/
