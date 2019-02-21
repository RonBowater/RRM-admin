"use strict";

var L_modal_text;

/****************************/  
/* Modal routines           */
/****************************/  
 
function clear_and_display_modal ()
{
	$("#myModal").modal();
	$("#modal-text" ).html("");
	L_modal_text = "";
	$("#modal-close-button").hide();
}

function write_modal (text)
{
	L_modal_text = L_modal_text + "<p style='padding:0px; font-size:16px;'>" + text + "</p>"  ;
	$("#modal-text" ).html(L_modal_text);
}

function write_modal_error (text)
{
	L_modal_text = L_modal_text + "<p style='color:red; padding:0px; font-size:16px;'>" + text + "</p>"  ;
	$("#modal-text" ).html(L_modal_text);
}

function write_modal_warning (text)
{
	L_modal_text = L_modal_text + "<p style='color:orange; padding:0px; font-size:16px;'>" + text + "</p>"  ;
	$("#modal-text" ).html(L_modal_text);
}

function show_modal_close ()
{
	$("#modal-close-button").show();
	write_modal ("Click close to continue");
}

function close_modal ()
{
	$("#myModal").modal('hide');
}










  

 
  