"use strict";

// schema columns
const VAREDIT_DBNAME = 0;
const VAREDIT_DISPLAY_NAME = 1;
const VAREDIT_COLUMN = 2;
const VAREDIT_CHANGED_FLAG = 3;
const VAREDIT_ORIG_VALUE = 4;
const VAREDIT_NEW_VALUE = 5;
const VAREDIT_TYPE = 6;

// schema type fields
const VAREDIT_TYPE_YESNO     = 1;
const VAREDIT_TYPE_TEXT      = 2;
const VAREDIT_TYPE_EMAIL     = 3;
const VAREDIT_TYPE_PROT      = 4;

//******************
// VAREDIT variables
//******************

var VAREDIT_timer_var;
var VAREDIT_timer_count;
var VAREDIT_ctl;

var VAREDIT_last_commands;
var VAREDIT_model;
var VAREDIT_anychange;
var VAREDIT_anyerror;
var VAREDIT_timer_callback;
var VAREDIT_random;

//*************************************
// VAREDIT setup fields from the schema
//*************************************

function VAREDIT_setup_fields(timer_callback)
{ 
	VAREDIT_timer_callback = timer_callback;

	// generate a random number for the field name (prevents autofill)
	VAREDIT_random = String(Math.random()).substring(2);

	//  set all changed flags off and copy old to new
	for (var ivar=0; ivar<VAREDIT_ctl.length; ivar++)
	{
		VAREDIT_ctl[ivar][VAREDIT_CHANGED_FLAG]=0;
		VAREDIT_ctl[ivar][VAREDIT_NEW_VALUE]=VAREDIT_ctl[ivar][VAREDIT_ORIG_VALUE]; 
	}

	// set the screen height into the main-content div
	//$("#content").css({"max-width":"auto"});
	
	VAREDIT_model = new Backbone.Model({});
	
	// init fields
	var mycol1fields = [];
	var mycol2fields = [];
	var mycol3fields = [];
	
	// build the fields from the schema
	for (var ivar=0; ivar<VAREDIT_ctl.length; ivar++)
	{
		var thename = String(ivar)+VAREDIT_random;
		if (VAREDIT_ctl[ivar][VAREDIT_TYPE]==VAREDIT_TYPE_YESNO)
		{   
			var myobj = {name: thename, label: VAREDIT_ctl[ivar][VAREDIT_DISPLAY_NAME].split("_").join(" ") + " (Yes/No)", 
			control: "select", options: [{label: "Yes", value: 'Yes'}, {label: "No", value: 'No'}]};
		}
		else if (VAREDIT_ctl[ivar][VAREDIT_TYPE]==VAREDIT_TYPE_TEXT)
		{
			var myobj = {name: thename, label: VAREDIT_ctl[ivar][VAREDIT_DISPLAY_NAME].split("_").join(" ") + " (Text)", 
			control: "textarea"};
		}
		else if (VAREDIT_ctl[ivar][VAREDIT_TYPE]==VAREDIT_TYPE_PROT)
		{
			var myobj = {name: thename, label: VAREDIT_ctl[ivar][VAREDIT_DISPLAY_NAME].split("_").join(" ") + " (Uneditable)", 
			control: "uneditable-input"};
		}
		else if (VAREDIT_ctl[ivar][VAREDIT_TYPE]==VAREDIT_TYPE_EMAIL)
		{
			var myobj = {name: thename, label: VAREDIT_ctl[ivar][VAREDIT_DISPLAY_NAME].split("_").join(" ") + " (Email	)", 
			control: "input"};
		}
		else
		{
			var myobj = {name: thename, label: VAREDIT_ctl[ivar][VAREDIT_DISPLAY_NAME].split("_").join(" ") + " (Input)", 
			control: "input"};
		}
				
		if (VAREDIT_ctl[ivar][VAREDIT_COLUMN]==1)
		{
			mycol1fields.push(myobj);
		}
		else if (VAREDIT_ctl[ivar][VAREDIT_COLUMN]==2)
		{	
			mycol2fields.push(myobj);
		}
		else if (VAREDIT_ctl[ivar][VAREDIT_COLUMN]==3)
		{	
			mycol3fields.push(myobj);
		}

		else
		{
			alert ("invalid column .. " + VAREDIT_ctl[ivar][VAREDIT_DISPLAY_NAME]);
		}
		var s = "input[name='" + VAREDIT_ctl[ivar][VAREDIT_DISPLAY_NAME] + "']"
	}

	// create the forms
	var myformcol1 = new Backform.Form({el: "#VAREDIT_FormCol1", model: VAREDIT_model, fields: mycol1fields});
	var myformcol2 = new Backform.Form({el: "#VAREDIT_FormCol2", model: VAREDIT_model, fields: mycol2fields});
	var myformcol3 = new Backform.Form({el: "#VAREDIT_FormCol3", model: VAREDIT_model, fields: mycol3fields});
	
	// render them to the screen
	myformcol1.render();
	myformcol2.render();
	myformcol3.render();
	
	// clear error model
	VAREDIT_model.errorModel.clear();
	
	// initialize the fields
	for (var ivar=0; ivar<VAREDIT_ctl.length; ivar++)
	{
		var val = VAREDIT_ctl[ivar][VAREDIT_ORIG_VALUE];
		val = val.replace(/{SQUOTE}/g, "'")
		val = val.replace(/{DQUOTE}/g, '"')
		var thename = String(ivar)+VAREDIT_random;
		VAREDIT_model.set(thename, val );	
	}     
	
	// make text fields a little larger
	$('textarea.form-control').height(100);

	// start the timer to scan for changes	
	VAREDIT_start_timer();
}

//***********************
// start the change timer
//***********************

function VAREDIT_start_timer()
{ 
	VAREDIT_timer_var = -1;
	VAREDIT_timer_var = setTimeout (VAREDIT_timer_handler, 250);
	VAREDIT_timer_count = 0;
}

//**********************
// stop the change timer
//**********************

function VAREDIT_stop_timer()
{ 
	if (VAREDIT_timer_var!=-1) 
	{
		clearTimeout(VAREDIT_timer_var);
		VAREDIT_timer_var = -1;
	}
}

//**************************************************
// timer handler - scan for changes in screen fields
//**************************************************

function VAREDIT_timer_handler()
{
	VAREDIT_anyerror = 0;
	VAREDIT_model.errorModel.clear();

	for (var ivar=0; ivar<VAREDIT_ctl.length; ivar++)
	{
	    var thename = String(ivar)+VAREDIT_random;
		var classname = "form-control " + thename;
		var oldval = VAREDIT_ctl[ivar][VAREDIT_ORIG_VALUE];

		//handle unprotected fields
		if (VAREDIT_ctl[ivar][VAREDIT_TYPE]!=VAREDIT_TYPE_PROT)
		{
			// yesno variable
			if (VAREDIT_ctl[ivar][VAREDIT_TYPE]==VAREDIT_TYPE_YESNO)
			{
				var newval = $('[name="' + thename + '"]').val();
			
				//remove double quotes
				newval = newval.slice(1,-1);
			
				// YESNO can only be yes or no
				if ((newval!="Yes") && (newval!="No"))
				{
					VAREDIT_model.errorModel.set (thename, "Field must be yes or no");
					VAREDIT_anyerror = 1;
				}
			}

			// email variable
			else if (VAREDIT_ctl[ivar][VAREDIT_TYPE]==VAREDIT_TYPE_EMAIL)
			{
				var newval = $('[name="' + thename + '"]').val();

				var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
				if (!filter.test(newval))  
				{
					VAREDIT_model.errorModel.set (thename, "Not a valid email address");
					VAREDIT_anyerror = 1;
				}
			}
		
			//  textarea variable
			else if (VAREDIT_ctl[ivar][VAREDIT_TYPE]==VAREDIT_TYPE_TEXT)
			{
				var newval = $('[name="' + thename + '"]').val();
			}
		
			// else input variable
			else
			{
				var newval = $('[name="' + thename + '"]').val();
			}
		
			// replace quotes
			newval = newval.replace(/'/g, "{SQUOTE}")
			newval = newval.replace(/"/g, "{DQUOTE}")
		
			// set changed
			if (newval!=oldval)
			{
				$('[class="' + classname + '"] > label.control-label').html(VAREDIT_ctl[ivar][VAREDIT_DISPLAY_NAME] + " (changed)");
				VAREDIT_ctl[ivar][VAREDIT_CHANGED_FLAG]=1;
				VAREDIT_ctl[ivar][VAREDIT_NEW_VALUE] = newval;
			}
		
			// else reset changed
			else
			{
				$('[class="' + classname + '"] > label.control-label').html(VAREDIT_ctl[ivar][VAREDIT_DISPLAY_NAME]);
				VAREDIT_ctl[ivar][VAREDIT_CHANGED_FLAG]=0;
			}
		}
	}
	
	// check for any changes 
	var anychange = false;
	if (VAREDIT_anyerror==0)
	{
		for (var ivar=0; ivar<VAREDIT_ctl.length; ivar++)
		{
			if (VAREDIT_ctl[ivar][VAREDIT_CHANGED_FLAG]==1) 
			{	
				console.log ("Field " + VAREDIT_ctl[ivar][VAREDIT_DISPLAY_NAME] + " changed");
				anychange=true;
			}
		}
	}

    VAREDIT_anychange = anychange; 
	
	// call code back to say in any changes have been made
	VAREDIT_timer_callback(VAREDIT_anychange);
	
	// restart the timer 
	VAREDIT_timer_var = setTimeout (VAREDIT_timer_handler, 250);
}
