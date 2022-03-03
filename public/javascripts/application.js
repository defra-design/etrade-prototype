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
    // show
    if($(this).hasClass('hide-all')) {
      $(this).removeClass('hide-all');
      $(this).children('.defra-step-nav--chevron').addClass('flipped');
      $('.defra-step-nav--show-all-label').text('Hide all steps');
      $('.defra-step-nav--header .defra-step-nav--toggle .visible').text('Hide');
      $('.defra-step-nav--header .defra-step-nav--chevron').addClass('flipped');
      $('.defra-step-nav--panel').removeClass('panel--is-closed');
    }

    // hide
    else {
      $(this).addClass('hide-all');
      $(this).children('.defra-step-nav--chevron').removeClass('flipped');
      $('.defra-step-nav--show-all-label').text('Show all steps');
      $('.defra-step-nav--header .defra-step-nav--toggle .visible').text('Show');
      $('.defra-step-nav--header .defra-step-nav--chevron').removeClass('flipped');
      $('.defra-step-nav--panel').addClass('panel--is-closed');
    }
  });

  $('.defra-step-nav--step').click(function(e){
    togglePanel(this.id);
  });
});

function togglePanel(stepId) {
  var str_stepId = '#' + stepId,
      str_panelId = '#' + stepId + '--panel',
      str_toggle = str_stepId + ' .defra-step-nav--toggle .visible',
      str_chevron = str_stepId + ' .defra-step-nav--chevron';
      
  $(str_panelId).toggleClass('panel--is-closed');
  $(str_chevron).toggleClass('flipped');

  if($(str_chevron).hasClass('flipped')) {
    $(str_toggle).text('Hide');
  }
  else {
    $(str_toggle).text('Show');
  }
  return;
}