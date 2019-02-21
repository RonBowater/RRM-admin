"use strict";

var L_msg_model;
var L_msgs;
var L_msgs_valid;
var L_local_msgs_valid=0;

// message local variables
var L_selected_msg_index;    /* index in messages table */
var L_selected_msg_id;       /* actual id in database .. numeric */
var L_selected_msg_code;     /* code e.g. BCU */ 
var L_selected_msg_descr;    /* message description */ 
var L_selected_msg_db_field; /* name of field in db where sending of this msg is recorded */
var L_selected_msg_id_index; /* index origin 0 into the msg table */

// operational variables
var L_how_to_send;
var L_test_or_send;

// team local variables
var L_test_email_address;
var L_test_email_name; 
var L_test_text_number;

var L_team_email_address;
var L_team_email_name;
var L_team_text_number;

var L_team_captain_first_name;
var L_team_captain_last_name;
var L_team_code;
var L_team_name;
var L_team_code_string;
var L_amount_paid;

var L_grouping;
var L_num_teams_in_group;
var L_send_name_values;
var L_send_name_values_queue=[];
var L_team_code_queue=[];

var L_team_parms;
var L_message_parms;
var L_message_code;

var L_save_callback;
var L_last_selected_msg;

function rrm_msgs_init ()
{
	L_msgs_valid = false;
	L_last_selected_msg = "";
	G_clipboard_msg_id = ""; 
	G_clipboard_msg_code = ""; 
	G_clipboard_msg_html = "";  
	G_clipboard_msg_subject = ""; 		
	G_clipboard_msg_description = "";  
}

//======================// 
//  EDIT MESSAGES VIEW    //
//======================// 

G_EditMsgsView_Definition = Backbone.View.extend(
{   
    // initialize
    initialize: function () 
    {
        _.bindAll(this, 'render', 'doFunction'); 
        this.on('doFunction', this.doFunction, this);
        this.on('escKey', this.doCancel, this);
    }, 
      
    // render   
   	render: function () 
    {
    	// setup the view
    	G_current_view = this;
    	setup_view ("U", "", "T-Edit-Msgs-Commands", "T-Edit-Msgs-Content");	
    	
        // handle view button
    	if (G_selected_view_id!=null)
    	{
		   $(G_selected_view_id).addClass('nav-top-item').removeClass('nav-selected-item');
    	}    	
		$("#id-messages").addClass('nav-selected-item').removeClass('nav-top-item');
		G_selected_view_id = "#id-messages";

		// set the screen height into the main-content div
		$("#main-content").css("height", window.innerHeight);
			
		// hide the buttons
		$("#delete-msg").hide();
		$("#edit-msg").hide();
		$("#test-msg").hide();
		$("#copy-msg").hide();
		
		// read msg list from database
		load_messages(edit_msgs1);
		
		// continue with function edit_msgs1
    },
    
    // dofunction - mouse click entry point  
   	doFunction: function (func) 
    {	
    	// switch view requested
        if (func=="switch_view_request")
        { 
    		return "OK_TO_SWITCH";
        }
    
		// logoff requeted
		else if (func=="logoff")
    	{
    		do_logoff(0);
		}	
		
    	// add msg
    	else if (func=="add-msg")
    	{		
			add_msg();	
		}
		
		// delete msg
		else if (func=="delete-msg")
		{
			delete_msg();
		}
		
		// msg edit update
		else if (func=="test-msg")
    	{
    		G_TestMsgView.render();
		}	
		
		// copy msg to clipboard
		else if (func=="copy-msg")
    	{
    		G_clipboard_msg_id = L_msgs[L_selected_msg_index]["ID"];
			G_clipboard_msg_code = L_msgs[L_selected_msg_index]["Code"];
			G_clipboard_msg_html = L_msgs[L_selected_msg_index]["HTML"] ;	 
			G_clipboard_msg_subject = L_msgs[L_selected_msg_index]["Subject"] ;	 			
			G_clipboard_msg_description = L_msgs[L_selected_msg_index]["Description"];	
			clear_and_display_modal();
			$("#modal-cancel-button").hide();
			$("#modal-proceed-button").hide();
			write_modal ("Message with ID " + L_msgs[L_selected_msg_index]["ID"] + " (" + L_msgs[L_selected_msg_index]["Code"] + ")" + " copied to RRM clipbaord"); 
			show_modal_close ();
		}	
		
		// modal close
		else if (func=="button-close")
		{
			// do nothing
		}
		
		// edit msg
		else if (func=="edit-msg")
		{
			G_EditSingleMsgView.render();
		}
		
		// error
		else			
    	{
	    	alert ("Undecoded Edit Msg Function " + func);	
    	}
    },
    
    // remove function
    remove: function() 
    {
        this.undelegateEvents();
        this.$el.empty();
        this.stopListening();
        return this;
    }
});

// called when msgs have been returned from the database
// create screen listing messages
function edit_msgs1()
{	
	var subject;
	var description;
	var scolumns = [];
	var srows = [];
	var acolumn;
	var arow;
	
	$("#list-msg-loading").hide();

	acolumn = {name:"Index", title: "Index"};  
	scolumns.push (acolumn);  
	acolumn = {name:"ID", title: "ID"};  
	scolumns.push (acolumn);  
	acolumn = {name:"Code", title: "Code"};  
	scolumns.push (acolumn);  
	acolumn = {name:"Description", title: "Description"};  
	scolumns.push (acolumn); 	
	for (var imsg=0; imsg<L_msgs.length; imsg++)
	{    
		var s = "arow = {";	 
		s = s + 'Index :"' + imsg  + '",'; 
		s = s + 'ID :"' + L_msgs[imsg]["ID"]  + '",'; 
		s = s + 'Code :"' + L_msgs[imsg]["Code"]  + '",'; 
		s = s + 'Description :"' + L_msgs[imsg]["Description"]  + '",';
		s = s + "};";
		eval (s);
		srows.push (arow);
	}
	
	// display data
	jQuery(function($){
		$('#msgs-table').footable({
			"paging": {"size": 20},
			"toggleColumn": "first",
			"sorting": {"enabled": false},
			"columns": scolumns,
			"rows": srows
		});
	});	
	
	// trigger on click on a row function 
	$('#msgs-table').find('tr').click( function()
	{
		L_selected_msg_index = $(this).find('td:first').text();
		
		if (L_last_selected_msg!="")
		{
			$(L_last_selected_msg).css('background','white');
			L_last_selected_msg = "";	
		}
		
		if (L_selected_msg_index=="")
		{
			$("#delete-msg").hide();
			$("#edit-msg").hide();
			$("#test-msg").hide();
			$("#copy-msg").hide();
		}
		else
		{
			$(this).css('background','aqua');
			
			L_last_selected_msg = this;
			L_selected_msg_id = L_msgs[L_selected_msg_index]["ID"] ;
			L_selected_msg_code = L_msgs[L_selected_msg_index]["Code"] ;
				
			$("#delete-msg").show();
			$("#delete-msg" ).html("Delete Message with ID " + L_selected_msg_id);
			$("#edit-msg").show();
			$("#edit-msg" ).html("Edit Message with ID " + L_selected_msg_id);
			$("#test-msg").show();
			$("#test-msg" ).html("Test Message with ID " + L_selected_msg_id);
			$("#copy-msg").show();
			$("#copy-msg" ).html("Copy Message with ID " + L_selected_msg_id);
		}
	});
	
	// trigger on context menu right button click on a row function 
	$('#msgs-table').find('tr').contextmenu( function()
	{
		L_selected_msg_index = $(this).find('td:first').text();
		
		if (L_last_selected_msg!="")
		{
			$(L_last_selected_msg).css('background','white');
			L_last_selected_msg = "";	
		}
		
		if (L_selected_msg_index=="")
		{
			$("#delete-msg").hide();
			$("#edit-msg").hide();
			$("#test-msg").hide();
			$("#copy-msg").hide();
		}
		else
		{
			$(this).css('background','aqua');
			
			L_last_selected_msg = this;
			L_selected_msg_id = L_msgs[L_selected_msg_index]["ID"] ;
			L_selected_msg_code = L_msgs[L_selected_msg_index]["Code"] ;
				
			$("#delete-msg").show();
			$("#delete-msg" ).html("Delete Message with ID " + L_selected_msg_id);
			$("#edit-msg").show();
			$("#edit-msg" ).html("Edit Message with ID " + L_selected_msg_id);
			$("#test-msg").show();
			$("#test-msg" ).html("Test Message with ID " + L_selected_msg_id);
			$("#copy-msg").show();
			$("#copy-msg" ).html("Copy Message with ID " + L_selected_msg_id);
		}
	});
	
	// context (right button) menu
	$.contextMenu
	({
		selector: '#msgs-table', 
		callback: function(key, options, e) 
		{
			if (key=="delete_message")
			{
				G_EditMsgsView.doFunction("delete-msg");
				return;
			}
			else if (key=="edit_message")
			{
				G_EditMsgsView.doFunction("edit-msg"); 
				return;
			}
			else if (key=="copy_message")
			{
				G_EditMsgsView.doFunction("copy-msg"); 
				return;
			}
		},
		items: 
		{
			"delete_message": {name: "Delete Message"},
			"edit_message": {name: "Edit Message"},
			"copy_message": {name: "Copy Message"}
		}        		
    });

	
	$("#delete-msg").hide();
	$("#edit-msg").hide();

    $(".footable-filtering-search").hide();
}	

//*************************************************** 
// Function : add_msg
// called when Add Message clicked from command menu 
//*************************************************** 

function add_msg()
{
	// do insert if running with gas database
	if (G_running_on_gas==true)
	{
		var key_array = [];
		key_array.push('Code');
		key_array.push('Description');
		key_array.push('Subject');
		key_array.push('HTML');
		var val_array = [];
		val_array.push("TBA");
		val_array.push("TBA");
		val_array.push("TBA");
		val_array.push("<p>HTML to be added</p>");
		db_insert_into ("Messages", key_array, val_array);	
	}
	
	// using SQL Server
	else
	{
	   var mysql = 'INSERT INTO '  + MSGS_TABLE +  '  (Code, Description, Subject) VALUES ("TBA", "TBA", "TBA")';
	   do_sql (mysql, add_msg1, "")
	}
}

// callback when new message added
function add_msg1(response)
{
	invalidate_messages();
	
	// refresh screen
	L_local_msgs_valid = 0;	
	G_EditMsgsView.render();
}

//************************************* 
// Function : delete_msg
// Delete msg called from command menu 
//************************************* 

function delete_msg()
{
	if (confirm("Are you sure that you want to delete msg with id " + L_selected_msg_id + " and code '" + L_selected_msg_code + "'") == true) 
	{
		if (confirm("Are you ABSOLUTELY sure that you want to delete msg with id " + L_selected_msg_id + " and code '" + L_selected_msg_code + '"') == true) 
		{
			// do delete if running with gas database
			if (G_running_on_gas==true)
			{
				db_delete_where ("Messages", "ID", L_selected_msg_id); 
			}
			
			// else using SQL server
			{
				// construct the SQL delete command
				var mysql = "DELETE FROM " + MSGS_TABLE + " WHERE ID='" + L_selected_msg_id + "';";  
				do_sql (mysql, delete_msg1, "")
				return; 	
			}
		} 
	}
}
  
// callback when message deleted
function delete_msg1(response)
{
	invalidate_messages();
	
	// refresh screen
	L_local_msgs_valid = 0;
	G_EditMsgsView.render();
} 

//=============================// 
//  EDIT SINGLE MESSAGE VIEW   //
//=============================// 

G_EditSingleMsgView_Definition = Backbone.View.extend(
{   
    // initialize
    initialize: function () 
    {
        _.bindAll(this, 'render', 'doFunction'); 
        this.on('doFunction', this.doFunction, this);
    }, 
      
    // render   
   	render: function () 
    {
    	// setup the views into the three main screen areas
    	G_current_view = this;
		setup_view ("U", "", "T-Edit-Single-Msg-Commands", "T-Edit-Single-Msg-Content");	
    	
    	// off to main code
    	edit_single_msg(); 
    },
    
    // dofunction - mouse click entry point  
   	doFunction: function (func) 
    {		
    	// switch view requested
        if (func=="switch_view_request")
        { 
    		return "OK_TO_SWITCH";
        }
		
		// msg edit update
		else if (func=="update")
    	{
    		// set up the modal
			clear_and_display_modal();
			$("#modal-cancel-button").show();
			$("#modal-proceed-button").show();
			write_modal ("Are you sure that you want to save your changes ?");
			write_modal ("Please click cancel or proceed");
		}	
		
		// return
		else if (func=="return")
    	{
    		G_EditMsgsView.render();
		}	
		
		// return
		else if (func=="button-close")
    	{
    		hide_modal();
		}
		
		// modal cancel pressed
    	else if (func=="button-cancel")
    	{
    		hide_modal();
    	}
    	
    	// modal proceed pressed
    	else if (func=="button-proceed")
    	{
    		hide_modal();
    		msg_do_update();	
    	}
		
		// error
		else			
    	{
	    	alert ("Undecoded Edit Single Msg Function " + func);	
    	}
    },
    
    // remove function
    remove: function() 
    {
        this.undelegateEvents();
        this.$el.empty();
        this.stopListening();
        return this;
    }
});

// called to continue to edit a single message
function edit_single_msg()
{
	$("#edit-msg-text" ).html("Edit msg with ID " + L_selected_msg_id);

	// set the screen height into the main-content div
	//$("#main-content").css("height", window.innerHeight);
	
	// set the screen height into the main-content div
	//var width = G_content_width;
	//$("#content").css("width", width-230);

	// find the index for the message
	var found = 0;
	for (var imsg=0; imsg<L_msgs.length; imsg++)
	{
		if (L_msgs[imsg]["ID"]==L_selected_msg_id)
		{
			var found = 1;
			break;
		}
	}

	// msg not found
	if (found==0)
	{
		alert ("In edit_msg L_selected_msg_id not found");
		return;
	}

	L_selected_msg_id_index = imsg;

	// create the model
	L_msg_model = new Backbone.Model({});

	// create fields
	var myfields = [];
	var myobj = {name: "Code", label: "Message Code", control: "input"};
	myfields.push(myobj);
	var myobj = {name: "Description", label: "Message Description", control: "input"};
	myfields.push(myobj);
	var myobj = {name: "Subject", label: "Message Subject", control: "input"};
	myfields.push(myobj);
	var myobj = {name: "HTML", label: "HTML Text for the message", control: "textarea"};
	myfields.push(myobj);

	var myform = new Backform.Form({el: "#MsgForm", model: L_msg_model, fields: myfields});
	myform.render();

	// set the text area as 300 high
	$("#MsgForm div.form-group.HTML div textarea").css("height", "300px");
		
	L_msg_model.set( "Code", L_msgs[L_selected_msg_id_index]["Code"]);	
	L_msg_model.set( "Description", L_msgs[L_selected_msg_id_index]["Description"]);	
	L_msg_model.set( "Subject", L_msgs[L_selected_msg_id_index]["Subject"]);

	// convert quotes and pound sign into actual values
    var html = L_msgs[L_selected_msg_id_index]["HTML"]
    html = html.replace(/{DQUOTE}/g, '"')
	html = html.replace(/{SQUOTE}/g, "'")
	html = html.replace(/{POUND}/g, "£");
	html = html.replace(/{DOLLAR}/g, "$");

	L_msg_model.set( "HTML", html);
	
	var content = html.replace(/<p>/g,  '<p style="padding:0px">')
	$("#formatted-html").html(content);
	
	$("textarea.form-control").css("height", "250px");
	
	// now wait for update
}

// update button clicked . proceed with DB update 
function msg_do_update()
{
	// read fields
	L_msg_model.errorModel.clear();

	// get fields
	var code = L_msg_model.get("Code");
	L_msgs[L_selected_msg_id_index]["Code"] = code;
	var description = L_msg_model.get("Description");
	L_msgs[L_selected_msg_id_index]["Description"] = description;
	var subject = L_msg_model.get("Subject");
	L_msgs[L_selected_msg_id_index]["Subject"] = subject;
	var html = L_msg_model.get("HTML");
	L_msgs[L_selected_msg_id_index]["HTML"] = html;

	if (code==null) code="";
	if (description==null) description="";
	if (subject==null) subject="";
	if (html==null) html="";

	var error = 0;
	
	// check that we have a message code
	if (code=="")
	{
		L_msg_model.errorModel.set ({"Code" : "Must have a code"});
		error = 1;
	}	  	

	// check that we have a description
	if (description=="")
	{
		L_msg_model.errorModel.set ({"Description" : "Must have a description"});
		error = 1;
	}	  
	
	// check that we have a subject	
	if (subject=="")
	{
		L_msg_model.errorModel.set ({"Subject" : "Must have a subject"});
		error = 1;
	}	 
	
	// check that we have some html 	
	if (html=="")
	{
		L_msg_model.errorModel.set ({"HTML" : "Must have some msg HTML"});
		error = 1;
	}	

	// return if any error
	if (error==1)
	{
		return;
	}

	console.log (html);

	// replace fields
	html = html.replace(/"/g,  "{DQUOTE}")
	html = html.replace(/'/g,  "{SQUOTE}")
	html = html.replace(/£/g,  "{POUND}")
	html = html.replace(/\$/g, "{DOLLAR}");
	
	console.log (html);
	
	// do insert if running with gas database
	if (G_running_on_gas==true)
	{
		var key_array = [];
		key_array.push('Code');
		key_array.push('Description');
		key_array.push('Subject');
		key_array.push('HTML');
		var val_array = [];
		val_array.push(code);
		val_array.push(description);
		val_array.push(subject);
		val_array.push(html);
	    db_update_where ("Messages", "ID", L_msgs[L_selected_msg_id_index]["ID"], key_array, val_arra, msg_edit_update1);
	}
	
	// using SQL Server
	else
	{
		// construct the SQL UPDATE command
		var mysql = "UPDATE " + MSGS_TABLE + " SET "
		mysql = mysql + " Code='" + code + "', "; 
		mysql = mysql + " Description='" + description + "', "; 
		mysql = mysql + " Subject='" + subject + "', "; 
		mysql = mysql + " HTML='" + html + "' "; 
		mysql = mysql + " WHERE ( "
		mysql = mysql + " ID='" + L_msgs[L_selected_msg_id_index]["ID"] + "');";

		// issue the sql
		do_sql (mysql, msg_edit_update1);
	}
}
   
// callback when update is complete
function msg_edit_update1()
{
	
	invalidate_messages();
	L_local_msgs_valid = 0;
	G_EditSingleMsgView.render();
}
      
//===================//
// Test message view //
//===================//

var G_TestMsgView_Definition = Backbone.View.extend(
{   
    // initialize
    initialize: function () 
    {
        _.bindAll(this, 'render', 'doFunction'); 
        this.on('doFunction', this.doFunction, this);
    }, 
      
    // render   
   	render: function () 
    {	
		// setup views
    	G_current_view = this;
    	setup_view ("U", "", "T-Test-Msg-Commands", "T-Test-Msg-Content");
    	
    	$("#htmltext").val("<strong>Hello</strong>"); 
	},
    
    // dofunction - mouse click entry point  
   	doFunction: function (func) 
    {	
    	// switch view requested
        if (func=="switch_view_request")
        { 
    		return "OK_TO_SWITCH";
        }	
        	
		// msg actual send
		else if (func=="send-test-msg")
    	{
    		send_test_msg();
		}	
		
		// return
		else if (func=="return")
    	{
    		G_EditSingleMsgView.render();
		}	
		
		// error
		else			
    	{
	    	alert ("Undecoded Send Msg Function " + func);	
    	}
    },
    
    // remove function
    remove: function() 
    {
        this.undelegateEvents();
        this.$el.empty();
        this.stopListening();
        return this;
    }
});

// send the test message
function send_test_msg()
{
	var email_sms        =  $("input[name='email_sms']:checked").val();
	var html_text        =  $("input[name='html_text']:checked").val();
	var sib_server       =  $("input[name='sib_server']:checked").val();
	var simple_templated =  $("input[name='simple_templated']:checked").val();
 	 
 	// setup array values for send	
	var L_send_name_values = new Array();
    L_send_name_values.push(
    {
    	Parm_email_sms			: email_sms,
    	Parm_html_text			: html_text,
    	Parm_sib_server		    : sib_server,
    	Parm_simple_templated	: simple_templated,
    	
        Parm_email_to_address   : "Ron.Bowater@gmail.com",
        Parm_email_to_name      : "Ron",
        Parm_email_from_address : "Info@romseymarathon.co.uk",
        Parm_email_from_name    : "Romsey Marathon",
        Parm_email_cc_address	: "",
        Parm_email_cc_name		: "",
        Parm_email_bcc_address  : "",
        Parm_email_bcc_name	    : "",
        Parm_email_subject      : "a subject",
        Parm_msg_body           : "test message <SQUOTE> <DQUOTE>"
    });
    
    console.log ("send generic");  
    send_generic_message (L_send_name_values, my_callback);
 
 	return;
   
	var myhtml= L_msgs[L_selected_msg_id_index]["HTML"]

	myhtml = myhtml.replace(/\n|\r/g, "");
	
	alert (myhtml);

 	var liquid_vars = [];
	liquid_vars =
	({
		FIRSTNAME                   : "**FIRSTNAME**",
		LASTNAME                    : "**LASTNAME**",
		TEAMNAME                    : "**TEAMNAME**",
		TEAMCODE                    : "**TEAMCODE**",
		NUMTEAMS                    : 2
	});
		
	var engine = new Liquid()
    engine
    .parseAndRender(myhtml, liquid_vars)
    .then(liquid_msg_done)
}

function liquid_msg_done(result)
{		
	$('#xxx').html(result);
	
	// setup array values	
	var L_send_name_values = new Array();
    L_send_name_values.push(
    {
        Send_Email_Address      : "Ron.Bowater@gmail.com",
        Send_Email_Name         : "Ron",
        Send_Email_Cc_Address	: "",
        Send_Email_Cc_Name		: "",
        Send_Email_Bcc_Address  : "",
        Send_Email_Bcc_Name	    : "",
        Send_Email_Subject      : "a subject",
        Send_Email_Body         : result
    });
    
    var s = JSON.stringify(L_send_name_values);   
    send_templated_email (s, my_callback);
}

function my_callback ()
{
	alert ("msg sent");
}

//*************** 
// Load messages  
//***************

var G_load_msgs_database_callback_save;   

function load_messages(callback)
{
	G_load_msgs_database_callback_save = callback;
	if (L_msgs_valid==true)
	{
		G_load_msgs_database_callback_save()
	}
	else
	{
		// check if running on gas
	    if (G_running_on_gas==true)
	    {
	    	db_select_all ("Messages", load_messages_gas_callback);
	    }
	    
	    // else using SQL server
	    else
		{
			var mysql = "SELECT * FROM " + MSGS_TABLE + " ORDER BY ID ASC";
			do_sql (mysql, load_messages_loaded, "");		
		}
	}
}

function load_messages_loaded (response)
{
	L_msgs = response['data'];
	
	for (var imsg=0; imsg<L_msgs.length; imsg++)
	{ 
		L_msgs[imsg]["DB_Field"] = "";
		L_msgs[imsg]["Group_Message"] = -1;
		L_msgs[imsg]["State_Allowed"] = -1;
		var found = 0;
		for (var ix=0; ix<db_messages.length; ix++)
		{
			if (L_msgs[imsg]["Code"]==db_messages[ix][DB_MESSAGE_CODE])
			{
				L_msgs[imsg]["DB_Field"] = db_messages[ix][DB_MESSAGE_DB_FIELD]
				L_msgs[imsg]["State_Allowed"] = db_messages[ix][DB_MESSAGE_STATE_ALLOWED]
				break;
			}
   		}
	}
	
	L_msgs_valid = true;
	G_load_msgs_database_callback_save()	
}

function load_messages_gas_callback (d)
{
	L_msgs = d;
	
	for (var imsg=0; imsg<L_msgs.length; imsg++)
	{ 
		L_msgs[imsg]["DB_Field"] = "";
		L_msgs[imsg]["Group_Message"] = -1;
		L_msgs[imsg]["State_Allowed"] = -1;
		var found = 0;
		for (var ix=0; ix<db_messages.length; ix++)
		{
			if (L_msgs[imsg]["Code"]==db_messages[ix][DB_MESSAGE_CODE])
			{
				L_msgs[imsg]["DB_Field"] = db_messages[ix][DB_MESSAGE_DB_FIELD]
				L_msgs[imsg]["State_Allowed"] = db_messages[ix][DB_MESSAGE_STATE_ALLOWED]
				break;
			}
   		}
	}
	
	L_msgs_valid = true;
	G_load_msgs_database_callback_save()	
}

function invalidate_messages()
{
	L_msgs_valid = false;
}

// code after here is deprecated
/*

//==============================//
// Send single message msg view //
//==============================//

var G_SendMsgView_Definition = Backbone.View.extend(
{   
    // initialize
    initialize: function () 
    {
        _.bindAll(this, 'render', 'doCancel', 'doFunction'); 
        this.on('doCancel', this.doCancel, this);
        this.on('doFunction', this.doFunction, this);
        this.on('escKey', this.doCancel, this);
    }, 
      
    // render   
   	render: function () 
    {
    	// find team details .. set G_selected_team_index
		var found = 0;
		for (var iteam=0; iteam<G_team_database.length; iteam++)
		{
			if (G_team_database[iteam]["Team_Code"]==G_selected_team)
			{
				found = 1;
				break;
			} 
		}
		if (found==0) 
		{
			alert ("Bad error .. send msg - team not found in database");
			Xreturn();
			return;
		}
		G_selected_team_index = iteam;

		// cannot send a message to group other than first
		if ( G_team_database[G_selected_team_index]["Grouping"].trim()!='0')
		{
			if (G_team_database[G_selected_team_index]["Grouping"]!=G_selected_team)
			{
				alert ("Can only send message to first in group");
				Xreturn();
				return;
			}
		}
		
		send_msg();
    },
    
      // doCancel  
   	doCancel: function () 
    {	
    	Xreturn();
    },
    
    // dofunction - mouse click entry point  
   	doFunction: function (func) 
    {			
		
		// msg actual send
		if (func=="do-send-msg")
    	{
    		send_the_msg();
		}	
		
		// error
		else			
    	{
	    	alert ("Undecoded Send Msg Function " + func);	
    	}
    },
    
    // remove function
    remove: function() 
    {
        this.undelegateEvents();
        this.$el.empty();
        this.stopListening();
        return this;
    }
});

// Called here initially to send single message
function send_msg()
{	
	// setup the views into the three main screen areas
	setup_view ("U", "T-Send-Msg-Functions", "T-Send-Msg-Commands", "T-Send-Msg-Content");	

	// set the screen height into the main-content div
	$("#main-content").css("height", window.innerHeight);
	
	$("#do-send-msg").hide();

	var html = "Messaging Team " + G_selected_team;
	$("#send-team-name-text").html(html);
	
	// display team details
	var html = "";
	html = html + "<ul>";
	html = html + "<li><b>Team Code: </b><span>" + G_team_database[G_selected_team_index]["Team_Code"] + "<span></li>"; 
	html = html + "<li><b>Team Name: </b><span>" + G_team_database[G_selected_team_index]["Team_Name"] + "<span></li>"; 
	html = html + "<li><b>Email Address: </b><span>" + G_team_database[G_selected_team_index]["Email"] + "<span></li>"; 
	html = html + "<li><b>Email Name: </b><span>" + G_team_database[G_selected_team_index]["Ordered_By"] + "<span></li>"; 
	html = html + "<li><b>Team Captain First Name: </b><span>" + G_team_database[G_selected_team_index]["Team_Captain_First_Name"] + "<span></li>"; 
	html = html + "<li><b>Team Captain Last Name: </b><span>" + G_team_database[G_selected_team_index]["Team_Captain_Last_Name"] + "<span></li>"; 
	html = html + "<li><b>Payment Status: </b><span>" + G_team_database[G_selected_team_index]["Payment_Status"] + "<span></li>"; 
	
	L_grouping = "Singleton team";
	L_num_teams_in_group = 1;
	L_team_code_string = G_team_database[G_selected_team_index]["Team_Code"];
	
	// test for group
	if ( G_team_database[G_selected_team_index]["Grouping"]!='0')
	{
		if (G_team_database[G_selected_team_index]["Grouping"]==G_team_database[G_selected_team_index]["Team_Code"])
		{
			L_grouping = "Group - First team"
		}
		else
		{
			L_grouping = "Group - Second etc team"
		}
		
		// count teams in group and build team code strin g
		L_num_teams_in_group = 0;
		L_team_code_string = "";

		for (var iteam=0; iteam<G_team_database.length-1; iteam++)
		{
    		if (G_team_database[iteam]["Grouping"].trim()==G_team_database[G_selected_team_index]["Team_Code"].trim())
			{
				if (L_num_teams_in_group!=0)
				{
					L_team_code_string = L_team_code_string + ", ";
				}
				L_team_code_string = L_team_code_string + G_team_database[iteam]["Team_Code"];
				L_num_teams_in_group = L_num_teams_in_group + 1;	
			}
		}
		if (G_team_database[iteam]["Grouping"].trim()==G_team_database[G_selected_team_index]["Team_Code"].trim())
		{
			if (L_num_teams_in_group!=0)
			{
				L_team_code_string = L_team_code_string + " and ";
			}
			L_team_code_string = L_team_code_string + G_team_database[iteam]["Team_Code"];
			L_num_teams_in_group = L_num_teams_in_group + 1;	
		}
	}
	
	html = html + "<li><b>Grouping: </b><span>" + L_grouping + "<span></li>"; 
	
	if (L_grouping!="Singleton team")
	{
		html = html + "<li><b>Number of teams in group: </b><span>" + L_num_teams_in_group + "<span></li>"; 
	}
	html = html + "</ul>";
	
	$("#msgs_info").html(html) 
	
	// messages have already been loaded	 
 
	var subject;
	var description;
	var scolumns = [];
	var srows = [];
	var acolumn;
	var arow;
	
	// setup the table
	acolumn = {name:"ID", title: "ID"};  
	scolumns.push (acolumn);  
	acolumn = {name:"Code", title: "Code"};  
	scolumns.push (acolumn);  
	acolumn = {name:"Description", title: "Description"};  
	scolumns.push (acolumn); 

	// do for all messages
	for (var imsg=0; imsg<L_msgs.length; imsg++)
	{
	    // check state to see if message is allowed
	    var show_message = 1;
	    if (L_msgs[imsg]["State_Allowed"]!=-1)
	    {
	    	if (parseInt(L_msgs[imsg]["State_Allowed"])!=parseInt(G_team_database[G_selected_team_index]["Booking_State"])) show_message=0;
	    }
		   	
		// display message if allowed
		if (show_message==1)
		{  
			var s = "arow = {";	 
			s = s + 'ID :"' + L_msgs[imsg]["ID"]  + '",'; 
			s = s + 'Code :"' + L_msgs[imsg]["Code"]  + '",'; 
			s = s + 'Description :"' + L_msgs[imsg]["Description"]  + '",';
			s = s + "};";
			eval (s);
			srows.push (arow);
		}
	}
	
	// display data
	jQuery(function($){
		$('#msgs-table').footable({
			"paging": {"size": 20},
			"toggleColumn": "first",
			"sorting": {"enabled": false},
			"columns": scolumns,
			"rows": srows
		});
	});	
	
	// trigger on click on a row function 
	$('#msgs-table').find('tr').click( function()
	{
		L_selected_msg_id = $(this).find('td:first').text();
		
		if (L_last_selected_msg!="")
		{
			$(L_last_selected_msg).css('background','white');
			L_last_selected_msg = "";	
		}
		
		if (L_selected_msg_id=="")
		{
			$("#do-send-msg").hide();
		}
		else
		{
			$(this).css('background','aqua');
			L_last_selected_msg = this;	

			// find the code for the selected message
			L_selected_msg_code = "";
			for (var imsg=0; imsg<L_msgs.length; imsg++)
			{
				if (L_msgs[imsg]["ID"]==L_selected_msg_id)
				{
					L_selected_msg_code = L_msgs[imsg]["Code"];
					break;
				}    
			}
			
			$("#do-send-msg").show();
			$("#do-send-msg" ).html("Send " + L_selected_msg_code + " message");
		}
	});
	
	$(".footable-filtering-search").hide();
	
	// trigger on how to send changed  
	$('#howtosend').change (function()
	{
		L_how_to_send =  $("input[name='howsend']:checked").val();
	});
	
	// trigger on test or send  
	$('#testorsend').change (function()
	{
		L_test_or_send =  $("input[name='testorsend']:checked").val();
		if (L_test_or_send=="test")
		{
			$("#simple-email-address").html (" (" + G_info_settings[0]["Test_Email_Address"] + ")");
			$("#html-email-address").html (" (" + G_info_settings[0]["Test_Email_Address"] + ")");
			$("#text-number").html (" (" + G_info_settings[0]["Test_Text_Phone_Number"] + ")");
		}
		else
		{
			$("#simple-email-address").html (" (" + G_team_database[G_selected_team_index]["Email"] + ")");
			$("#html-email-address").html (" (" + G_team_database[G_selected_team_index]["Email"] + ")");
			$("#text-number").html (" (" + G_team_database[G_selected_team_index]["Tel_Mobile"] + ")");
		}
	});

	$("#simple-email-address").html (" (" + G_info_settings[0]["Test_Email_Address"] + ")");
	$("#html-email-address").html (" (" + G_info_settings[0]["Test_Email_Address"] + ")");
	$("#text-number").html (" (" + G_info_settings[0]["Test_Text_Phone_Number"] + ")");

	$("#test-address-number").html (" (Email : " + G_info_settings[0]["Test_Email_Address"] + " Text : " + G_info_settings[0]["Test_Text_Phone_Number"] + ")");
}

// called here when actual send (single) message clicked 
function send_the_msg()
{
	// get how to send ... 'simple', 'html' or 'text')
	L_how_to_send =  $("input[name='howsend']:checked").val();
	
	// get test or send  ... 'test' or 'send' 
	L_test_or_send =  $("input[name='testorsend']:checked").val();

	// call common setup message code
	setup_team_info(G_selected_team)

	// setup message info
	setup_message_info(); 

	// check if this message has already been sent to this team
	if (L_selected_msg_db_field!="")
	{
		if (G_team_database[G_selected_team_index][L_selected_msg_db_field]!="0000-00-00 00:00:00")
		{		
			if (confirm ("Message type has already been sent to this team. Do you want to continue?")!=true)
			{
				return;
			}
		} 
	}
		
	// setup testing string 
	var testing_string = "";
	if (L_test_or_send=="test") testing_string="***TESTING*** : ";
	
	// setup message type for confirmation
	var msg_type_string;
	if (L_how_to_send=="simple") msg_type_string = "simple email";
	else if (L_how_to_send=="html") msg_type_string = "html email";
	else msg_type_string = "SMS text";
	
	// double check that we really really want to send this message
	if (confirm(testing_string + "Are you sure that you want to send msg with code " + L_selected_msg_code + " as " + msg_type_string + " to " + L_team_email_address) == true) 
	{
		if (confirm(testing_string + "Are you ABSOLUTELY sure that you want to send msg with code " + L_selected_msg_code + " as " + msg_type_string + " to " + L_team_email_address) == true) 
		{	
			// selected team is e.g. RCRT4, L_selected_msg_id is ID in database
			clear_and_display_modal ();
			write_modal (testing_string + "Sending message " + L_selected_msg_id + " to team " + G_selected_team);
			
			// send messages
			send_msg_from_server (JSON.stringify(L_send_name_values), callback1);
		}
	}	
}

// callback after single message sent
function callback1(resp)
{
	write_modal (resp);
	
	// update database if send and this message has a mapping to a database field
	if (L_selected_msg_db_field!="")
	{
		// update this team or all teams in the group
		// get date and time in mysql format
		var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
		var mysql = "UPDATE " + MAIN_DATA_TABLE + " SET " + L_selected_msg_db_field + " = " + "'" + datetime + "'  ";
		
		// singleton team
		if (L_num_teams_in_group==1)
		{
			mysql = mysql + " WHERE Team_Code='" + G_selected_team + "';" 	
		}
		else
		
		// else group team (must be first one) .. update all teams with same info
		{
			mysql = mysql + " WHERE ";
			var count = 0;
			for (var iteam=0; iteam<G_team_database.length; iteam++)
			{
				if (G_team_database[iteam]["Grouping"]==G_selected_team)
				{
					if (count!=0)
					{
						mysql = mysql + " OR ";
					}
					mysql = mysql + " Team_Code='" + G_team_database[iteam]["Team_Code"] + "' ";
					count = count + 1;
				}
			}	
			mysql = mysql + " ;"
		}
		
		// update database if send
		if (L_test_or_send=="send")
		{
			write_modal ("Updating database with message time .. ");
		    do_sql (mysql, callback2, "");
		}
		
		// else log sql to console
		else
		{
			write_modal ("Testing .. not updating database .. see console.log for full sql .. ");
			console.log (mysql)
			callback2()
		}
	}
	else
	{
		write_modal ("No database field specified for the message .. ");
		callback3();
	}
}	

// callback after message sent
function callback2(resp)
{
	write_modal ("Reloading database");
	G_team_database_data_valid=0;
	load_team_database (callback3);
}

// callback after database reloaded
function callback3(resp)
{
	write_modal ("All Complete");
	show_modal_close();
	Xrefresh();
}

//==============================//
// Message multiple teams view  //
//==============================//

G_MsgMultTeamsView_Definition = Backbone.View.extend(
{   
    // initialize
    initialize: function () 
    {
        _.bindAll(this, 'render', 'doCancel', 'doFunction'); 
        this.on('doCancel', this.doCancel, this);
        this.on('doFunction', this.doFunction, this);
        this.on('escKey', this.doCancel, this);
    }, 
      
    // render   
   	render: function () 
    {
    	send_to_multiple_teams();
    },
    
      // doCancel  
   	doCancel: function () 
    {	
    	Xreturn();
    },
    
    // dofunction - mouse click entry point  
   	doFunction: function (func) 
    {			
		// msg actual send
		if (func=="do-send-msg")
    	{
    		do_send_message_to_teams();
		}	
		
		// edit team list
		else if (func=="do-edit-list")
    	{
    		Xcall (G_EditMultTeamsView);
		}	
		// error
		else			
    	{
	    	alert ("Undecoded Send Mult Msg Function " + func);	
    	}
    },
    
    // remove function
    remove: function() 
    {
        this.undelegateEvents();
        this.$el.empty();
        this.stopListening();
        return this;
    }
});

// come here to continue setup of send multiple teams
function send_to_multiple_teams()
{
	// setup the views into the three main screen areas
	setup_view ("U", "T-msg-mult-teams-Functions", "T-msg-mult-teams-Commands", "T-msg-mult-teams-Content");	
	
	// hide the send message
	$("#do-send-msg").hide();
	
	
	L_teams_in_table = [];
	L_teams_in_table.push("RCRT137");
	L_teams_in_table.push("RCRT136");

	// create and output string listing teams to be messaged
	var html = "";
	html = html + "<h3>Following " + L_teams_in_table.length + " teams will be messaged</h3>";
	var count = 0; 
	for (var iteam=0; iteam<L_teams_in_table.length; iteam++)
	{
		if (count !=0) html = html + ", ";
		html = html + L_teams_in_table[iteam];
		count = count + 1;
		if (count==10) 
		{
			count = 0;
			html = html + "</br>";
		}	
	}
	$("#send-teams-text").html (html);
	
	// display messages
	var subject;
	var description;
	var scolumns = [];
	var srows = [];
	var acolumn;
	var arow;
	
	// setup the table
	acolumn = {name:"ID", title: "ID"};  
	scolumns.push (acolumn);  
	acolumn = {name:"Code", title: "Code"};  
	scolumns.push (acolumn);  
	acolumn = {name:"Description", title: "Description"};  
	scolumns.push (acolumn); 
	
	for (var imsg=0; imsg<L_msgs.length; imsg++)
	{   
		// don't allow messages which are dependent upon state
	    var show_message = 1;
	    if (L_msgs[imsg]["State_Allowed"]!=-1) show_message=0;

		if (show_message==1)
		{
			var s = "arow = {";	 
			s = s + 'ID :"' + L_msgs[imsg]["ID"]  + '",'; 
			s = s + 'Code :"' + L_msgs[imsg]["Code"]  + '",'; 
			s = s + 'Description :"' + L_msgs[imsg]["Description"]  + '",';
			s = s + "};";
			eval (s);
			srows.push (arow);
		}
	}
	
	// display data
	jQuery(function($){
		$('#msgs-table').footable({
			"paging": {"size": 20},
			"toggleColumn": "first",
			"sorting": {"enabled": false},
			"columns": scolumns,
			"rows": srows
		});
	});	
	
	// trigger on click on a row function 
	$('#msgs-table').find('tr').click( function()
	{
		L_selected_msg_id = $(this).find('td:first').text();
		
		if (L_last_selected_msg!="")
		{
			$(L_last_selected_msg).css('background','white');
			L_last_selected_msg = "";	
		}
		
		if (L_selected_msg_id=="")
		{
			$("#do-send-msg").hide();
		}
		else
		{
			$(this).css('background','aqua');
			L_last_selected_msg = this;	

			// find the code for the selected message
			L_selected_msg_code = "";
			var found=0;
			for (var imsg=0; imsg<L_msgs.length; imsg++)
			{
				if (L_msgs[imsg]["ID"]==L_selected_msg_id)
				{
					L_selected_msg_code = L_msgs[imsg]["Code"];
					found = 1
					break;
				}    
			}
			
			if (found==0)
			{
				alert ("Message id not found");
				return;
			}
			
			$("#do-send-msg").show();
			$("#do-send-msg" ).html("Send Message with Code " + L_selected_msg_code);

		}
	});
	
	$(".footable-filtering-search").hide();
	
	// trigger on how to send changed  
	$('#howtosend').change (function()
	{
		L_how_to_send =  $("input[name='howsend']:checked").val();
	});
	
	// trigger on test or send  
	$('#testorsend').change (function()
	{
		L_test_or_send =  $("input[name='testorsend']:checked").val();
		if (L_test_or_send=="test")
		{
			$("#simple-email-address").html (" (" + G_info_settings[0]["Test_Email_Address"] + ")");
			$("#html-email-address").html (" (" + G_info_settings[0]["Test_Email_Address"] + ")");
			$("#text-number").html (" (" + G_info_settings[0]["Test_Text_Phone_Number"] + ")");
		}
		else
		{
			$("#simple-email-address").html (" (" + G_team_database[G_selected_team_index]["Email"] + ")");
			$("#html-email-address").html (" (" + G_team_database[G_selected_team_index]["Email"] + ")");
			$("#text-number").html (" (" + G_team_database[G_selected_team_index]["Tel_Mobile"] + ")");
		}
	});

	$("#simple-email-address").html (" (" + G_info_settings[0]["Test_Email_Address"] + ")");
	$("#html-email-address").html (" (" + G_info_settings[0]["Test_Email_Address"] + ")");
	$("#text-number").html (" (" + G_info_settings[0]["Test_Text_Phone_Number"] + ")");

	$("#test-address-number").html (" (Email : " + G_info_settings[0]["Test_Email_Address"] + " Text : " + G_info_settings[0]["Test_Text_Phone_Number"] + ")");	
}

// click here when send button clicked to send single message to multiple teams	
function do_send_message_to_teams()
{	
	// get how to send ... 'simple', 'html' or 'text')
	L_how_to_send =  $("input[name='howsend']:checked").val();
	
	// get test or send  ... 'test' or 'send' 
	L_test_or_send =  $("input[name='testorsend']:checked").val();

	// setup message info
	setup_message_info();

	// do confirmation
	var testing_string = "";
	if (L_test_or_send=="test") testing_string="***TESTING***";
	
	if (confirm(testing_string + " : Are you sure that you want to message all listed teams") == true) 
	{
		if (confirm(testing_string + " : Are you ABSOLUTELY sure that you want to message all listed teams") == true) 
		{
			clear_and_display_modal();
			write_modal ("Creating message queue...");

			L_send_name_values_queue = [];
			L_team_code_queue = [];
			
			// enqueue all the teams to be messages
			for (var iteam=0; iteam<L_teams_in_table.length; iteam++)
			{
				var team_code = L_teams_in_table[iteam];
				console.log (team_code);
				setup_team_info(team_code);
				
				L_team_code_queue.push(L_teams_in_table[iteam]);	
				L_send_name_values_queue.push(L_send_name_values);	
			}
			
			// send the first message
			var team_code = L_team_code_queue.shift();
			var name_values = L_send_name_values_queue.shift();
			message_all_teams_1 (team_code, name_values)
		} 
	}
} 

// send one message
function message_all_teams_1(team_code, name_values)
{
	write_modal ("Sending message " + L_selected_msg_id + " to team " + team_code);
	console.log (team_code);
	console.log (name_values);
	send_msg_from_server (JSON.stringify(name_values), message_all_teams_2);
}

// message sent ... see if more to send
function message_all_teams_2(response)
{
	// get next team info
	var team_code = L_team_code_queue.shift()
	var name_values = L_send_name_values_queue.shift();
	
	if (team_code!=undefined)
	{
		message_all_teams_1 (team_code, name_values)
	}
	else
	{
		write_modal ("Message sent to all teams");
		show_modal_close();
		Xreturn();
	}
}

 
//========================================//
// Message multiple teams edit list view  //
//========================================//

G_EditMultTeamsView_Definition = Backbone.View.extend(
{   
    // initialize
    initialize: function () 
    {
        _.bindAll(this, 'render', 'doCancel', 'doFunction'); 
        this.on('doCancel', this.doCancel, this);
        this.on('doFunction', this.doFunction, this);
        this.on('escKey', this.doCancel, this);
    }, 
      
    // render function .. called initially to set up screen  
   	render: function () 
    {
    	var subject;
		var description;
		var scolumns = [];
		var srows = [];
		var acolumn;
		var arow;
	
    	// setup the views into the three main screen areas
		setup_view ("U", "T-Edit-Team-List-Functions", "T-Edit-Team-List-Commands", "T-Edit-Team-List-Content");	
		
		acolumn = {name:"ID", title: "ID"};  
		scolumns.push (acolumn);  
		acolumn = {name:"Code", title: "Code"};  
		scolumns.push (acolumn);  
		acolumn = {name:"Description", title: "Description"};  
		scolumns.push (acolumn); 	
		
		for (var iteam=0; iteam<L_teams_in_table.length; iteam++)
		{
			var teamcode = L_teams_in_table[iteam];
	
			var s = "arow = {";	 
			s = s + 'ID :"' + iteam + '",'; 
			s = s + 'Code :"' + teamcode  + '",'; 
			s = s + 'Description :"' + teamcode  + '",';
			s = s + "};";
			eval (s);
			srows.push (arow);
		}
	
		// display data
		jQuery(function($){
			$('#msgs-table').footable({
				"paging": {"size": 20},
				"toggleColumn": "first",
				"sorting": {"enabled": false},
				"columns": scolumns,
				"rows": srows
			});
		});	
    },
    
      // doCancel  
   	doCancel: function () 
    {	
    	Xreturn();
    },
    
    // dofunction - mouse click entry point  
   	doFunction: function (func) 
    {						
    	{
	    	alert ("Undecoded Edit Mult Msg Function " + func);	
    	}
    },
    
    // remove function
    remove: function() 
    {
        this.undelegateEvents();
        this.$el.empty();
        this.stopListening();
        return this;
    }
});

// setup message info
function setup_message_info ()
{	
	// find message code in our database mapping table 
	var found = 0;
	L_selected_msg_db_field = "";
	L_selected_msg_descr = "";

	for (var ix=0; ix<db_messages.length; ix++)
	{
		if (L_selected_msg_code==db_messages[ix][DB_MESSAGE_CODE])
		{	
			found = 1;
			break;
		}
	}
	if (found==1)
	{
		L_selected_msg_db_field = db_messages[ix][DB_MESSAGE_DB_FIELD];
		L_selected_msg_descr = db_messages[ix][DB_MESSAGE_DESCRIPTION];
	}
}

// setup team info
function setup_team_info (team_code)
{
	var team_index;
	
	// find G_selected_team_index from team_code
	var found = 0;
	for (var iteam=0; iteam<G_team_database.length; iteam++)
	{
		if (G_team_database[iteam]["Team_Code"]==team_code)
		{
			found = 1;
			break;
		} 
	}
	if (found==0) 
	{
		alert ("Bad error .. send msg - team not found in database");
		Xreturn();
		return;
	}
	team_index = iteam;
	
	// setup test email addresses and number
	if (L_test_or_send=="test")
	{
		L_team_email_address = G_info_settings[0]["Test_Email_Address"];
		L_team_text_number = G_info_settings[0]["Test_SMS_Number"];
		L_team_email_name = "Testing Name";
	}
	
	// else real email address and number
	else
	{
		L_team_email_address = G_team_database[team_index]["Email"];
		L_team_text_number = G_team_database[team_index]["Tel_Mobile"];
		L_team_email_name = G_team_database[team_index]["Ordered_By"];
	}

	L_test_email_address = G_info_settings[0]["Test_Email_Address"];
	L_test_text_number = G_info_settings[0]["Test_SMS_Number"];
	L_test_email_name = "Testing Name";

	// get other info
	L_team_captain_first_name = G_team_database[team_index]["Team_Captain_First_Name"];
	L_team_captain_last_name = G_team_database[team_index]["Team_Captain_Last_Name"];
	L_team_name = G_team_database[team_index]["Team_Name"];
	
	// create total cost
	L_amount_paid = parseInt(G_team_database[team_index]["Ticket_Price"].replace('£',''))*L_num_teams_in_group;
	L_amount_paid = L_amount_paid.toString();
		
	console.log(L_team_name);	
	console.log(L_selected_msg_id);	
		
	// setup array values	
	L_send_name_values = new Array();
    L_send_name_values.push(
    {
        How_to_Send             : L_how_to_send,
        Test_or_Send            : L_test_or_send,
        Send_Email_Address      : L_team_email_address,
        Send_Email_Name         : L_team_email_name,
        Send_Test_Email_Address : L_test_email_address,
        Send_Test_Email_Name    : L_test_email_name,
        Send_Test_Text_Number   : L_test_text_number,
        Send_Text_Number        : L_team_text_number,
        Send_First_Name         : L_team_captain_first_name,
        Send_Last_Name          : L_team_captain_last_name,
    	Send_Team_Code          : L_team_code_string,
    	Send_Team_Name          : L_team_name,
    	Send_Num_Teams          : L_num_teams_in_group,
    	Send_Amount_Paid        : L_amount_paid, 
        Message_ID              : L_selected_msg_id
    });
}

var L_message_callback;

function get_message_liquified (team_code, msg_code, callback)
{
	// save message code
	L_message_code = msg_code;
	L_message_callback = callback;

	// ensure that messages are loaded
	load_messages(get_message_liquified_callback_1);
}

function get_message_liquified_callback_1 ()
{
	// find message
	var found = 0;
	for (var imsg=0; imsg<L_msgs.length; imsg++)
	{   
		if (L_msgs[imsg]["Code"]==L_message_code)
		{ 
			found = 1;
			break;
		}	 
	}
	if (found==0) 
	{
		alert ("get_message_liquified_callback_1 msg code " + L_message_code + " not found");
		return;
	}	
	
	// get html
	var html = L_msgs[imsg]["HTML"];
	
	// do a callback;
	L_message_callback (html);
}


*/