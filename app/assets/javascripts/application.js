/* global $ */

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function () {
  window.GOVUKFrontend.initAll()

  $('#defra-step-nav .defra-step-nav--panel').addClass('panel--is-closed');
  $('#defra-step-nav--show-all').addClass('hide-all')

  $('#defra-step-nav--show-all').click(function(e){
    if($(this).hasClass('hide-all')) {
      $('.defra-step-nav--panel').removeClass('panel--is-closed');
      $(this).removeClass('hide-all');
    }
    else {
      $('.defra-step-nav--panel').addClass('panel--is-closed');
      $(this).addClass('hide-all');
    }
  });

  $('#defra-step-nav-explore-apis-1').click(function(e){
    togglePanel(this.id);
  });

  $('#defra-step-nav-review-api-documentation-2').click(function(e){
    togglePanel(this.id);
  });

  $('#defra-step-nav-create-account-3').click(function(e){
    togglePanel(this.id);
  });

  $('#defra-step-nav-view-sample-project-4').click(function(e){
    togglePanel(this.id);
  });
  
  $('#defra-step-nav-view-sample-project-5').click(function(e){
    togglePanel(this.id);
  });
  
  $('#defra-step-nav-view-sample-project-6').click(function(e){
    togglePanel(this.id);
  });
});

function togglePanel(stepId) {
  var panelId = '#' + stepId + '--panel';
  $(panelId).toggleClass('panel--is-closed');
  return;
}