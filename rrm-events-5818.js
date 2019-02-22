"use strict";

var L_events_queue;

var L_events_database;
var L_events_database_valid;

var L_events_callback;

const EVENT_NONE = 0;
const EVENT_WIX_REGISTRATION = 1;
const EVENT_WIX_PAID_ON_REGISTRATION = 2;
const EVENT_WIX_UNPAID_ON_REGISTRATION = 3;
const EVENT_PAYPAL_PAYMENT_RECEIVED = 4;
const EVENT_PAYMENT_COMPLETE = 5;
const EVENT_PAYPAL_INVOICE_SENT = 6;
const EVENT_FREEBIE_PAYMENT_NOT_REQUIRED = 7;
const EVENT_BCU_MESSAGE_SENT = 8;
const EVENT_BCP_MESSAGE_SENT = 9;
const EVENT_OPC_MESSAGE_SENT = 10;
const EVENT_WIX_CHANGED_TO_PAID = 11;
const EVENT_PAID_BY_PAYPAL = 12;
const EVENT_NOTE = 13;
const EVENT_PAID_BY_BACS = 14;
const EVENT_PAID_BY_CHEQUE = 15;

const EVENT_TEAM_STATUS = 99;

var events_table = [
				 [EVENT_NONE,                            "No Event" ],
				 [EVENT_NOTE,                            "Event log Note"],
				 [EVENT_TEAM_STATUS,                     "Team Status"],
				 [EVENT_PAYMENT_COMPLETE,                "Payment complete"],
				 [EVENT_FREEBIE_PAYMENT_NOT_REQUIRED,    "Freebie payment not required"],
				 
				 [EVENT_WIX_REGISTRATION,                "Registration from WIX" ],
                 [EVENT_WIX_PAID_ON_REGISTRATION,        "Paid on WIX Registration" ],
                 [EVENT_WIX_UNPAID_ON_REGISTRATION,      "UnPaid on WIX Registration" ],
                 [EVENT_WIX_CHANGED_TO_PAID,             "Changed to Paid in WIX"],

                 [EVENT_PAYPAL_PAYMENT_RECEIVED,         "Paypal payment received" ],
                 [EVENT_PAYPAL_INVOICE_SENT,             "Paypal invoice sent"],
                 
                 [EVENT_BCU_MESSAGE_SENT,                "BCU Message Sent"],
                 [EVENT_BCP_MESSAGE_SENT,                "BCP Message Sent"],
                 [EVENT_OPC_MESSAGE_SENT,                "OPC Message Sent"],
                 
                 [EVENT_PAID_BY_PAYPAL,                  "Paid by Paypal"],
                 [EVENT_PAID_BY_BACS,                    "Paid by BACS"],
                 [EVENT_PAID_BY_CHEQUE,                  "Paid by Cheque"] 
				];                 

// module initialization
function rrm_events_init ()
{

	L_events_queue = new Array(); 
	L_events_database_valid=0;
}	

//--------------------------//
// Load the events database //
//--------------------------//

function load_events (callback)
{
	L_events_callback = callback;
	if (L_events_database_valid==1) 
	{
		L_events_callback();
	}
	else
	{
		// check if running on gas
	    if (G_running_on_gas==true)
	    {
	    	db_select_all ("Events", load_events_gas_callback);
	    }
	    
	    // else using SQL server
	    else
	    {    
			var mysql = "SELECT * from RRM_Events ORDER BY ID ASC;";
			G_xhr = $.ajax(
			{
				dataType: 'json',
				url: '../wp-json/doSQL', 
				data: 
				{
					db_sql : mysql,
					db_key : G_db_access_code 
				}, 
				success: function (response) 
				{	
					if (response['success'] == true)
					{
						L_events_database = response['data'];
						L_events_database_valid = 1;
						L_events_callback ();
					} 
					else if (response['success'] == false)
					{
						alert ("Do SQL success false msg = " + response['msg']);
					}
					else  
					{
						alert ("Do SQL " + response['success'] + " false msg = " + response['msg']);
					} 
				},
				error: function (data)
				{
					alert ("Do SQL Error returned");
				}
			});
		}
	}
	return 0;
}

function load_events_gas_callback (d)
{
	L_events_database = d;
	L_events_database_valid = 1;
	L_events_callback ();
}

//=====================// 
//  LIST EVENTS VIEW  //
//====================// 

G_EventsListView_Definition = Backbone.View.extend(
{   
    // initialize
    initialize: function () 
    {
        _.bindAll(this, 'render', 'doCancel', 'doFunction'); 
        this.on('doFunction', this.doFunction, this);
        this.on('doCancel', this.doCancel, this);
        this.on('escKey', this.doCancel, this);
    }, 
      
    // render   
   	render: function () 
    {    	
    	// setup the views into the three main screen areas
		setup_view ("U", "T-Events-Functions", "T-Events-Commands", "T-Events-List-Content");
		G_current_view = this;	

		// set the screen height into the main-content div
		$("#main-content").css("height", window.innerHeight);
		
		$("#events-list-hdr").html("Events for Team " + G_selected_team);
		
		// continue at normal function
		events_list_continue();
    },
    
    // doCancel  
   	doCancel: function () 
    {	
    	alert ("Unimplemented cancel");
    },
    
    // dofunction - mouse click entry point  
   	doFunction: function (func) 
    {	
    	if (func=="return")
    	{
    		G_ListTeamsView.render();	
    	}
    	
    	else
    	{
	    	alert ("Undecoded Events Function " + func);
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

// global variables used by this funtion
var L_action, L_action_name, L_state, L_state_name, L_myfields, L_mymodel, L_myobj, L_myform; 

// continue processing
function events_list_continue ()
{	
	$("#events-loading").hide();
		
	var scolumns = [];
	var acolumn = 0;
	
	// generate table columns
	acolumn = {name:"ID", title: "ID", type: "text"};  
	scolumns.push (acolumn);
	acolumn = {name:"DateTime", title: "Date/Time", type: "text"};  
	scolumns.push (acolumn);
	acolumn = {name:"EventType", title: "Event Type", type: "text"};  
	scolumns.push (acolumn); 
	acolumn = {name:"EventText", title: "Event Text", type: "text"};  
	scolumns.push (acolumn); 
	acolumn = {name:"Delete", title: "   Delete", type:"html"};  
	scolumns.push (acolumn); 
	acolumn = {name:"Edit", title: "   Edit", type:"html"};  
	scolumns.push (acolumn); 
	
	
	// generate table rows
	let srows = [];
	let arow = 0;
	for (let ievents=0; ievents<L_events_database.length; ievents++)
	{    	
		if (L_events_database[ievents]["Team_Code"]==G_selected_team)
		{
			// calculate how long ago the event occurred
			let event_date = L_events_database[ievents]["Date_Time"];
			let difftext = get_days_apart_text (new Date(), event_date); 
						
			// get the type for this event
			var type="NONE";
			for (var i=0; i<events_table.length; i++)
			{
				if (L_events_database[ievents]["Event_Type"]==events_table[i][0])
				{
					type = events_table[i][1];
					break;
				}
			} 
			
			let s = "arow = {";	 
			s = s + 'ID :"' + L_events_database[ievents]["ID"]  + '",';
			s = s + 'DateTime :"' + event_date  + " (" + difftext + ")" + '",'; 
			s = s + 'EventType :"' + type  + '",'; 
			if (L_events_database[ievents]["Event_Descr"].trim().length!=0)
			{
				s = s + 'EventText:"' + L_events_database[ievents]["Event_Descr"]  + '",';
			}
			else
			{
				s = s + 'EventText:"' + type + '",';
			}
			
			let button_html = '<button type=\'button\' onclick=\'delete_the_event(' + L_events_database[ievents]["ID"] + ')\' class=\'btn btn-outline-primary btn-sm\'>Click to Delete</button>'
			s = s + 'Delete :"' +  button_html  + '",'; 	
			
			button_html = '<button type=\'button\' onclick=\'edit_the_event(' + L_events_database[ievents]["ID"] + ')\' class=\'btn btn-outline-primary btn-sm\'>Click to Edit</button>'
			s = s + 'Edit :"' +  button_html  + '"'; 	
			
			s = s + "};";
			console.log (s);
			eval (s);
			srows.push (arow);
		}
	}
	
	// display data
	jQuery(function($){
		$('#events-table').footable({
			"paging": {"size": 20},
			"toggleColumn": "first",
			"columns": scolumns,
			"rows": srows
		});
	});	
	
	// hide the loading message
	$(".footable-filtering-search").hide();
	 
	// create the model
	L_mymodel = new Backbone.Model({});

	// create fields
	var L_myfields = [];
	
	var date_time = get_current_sql_date();
	var mydate = date_time.substr(0, 10);
	var mytime = date_time.substr(11);
	
	L_myobj = {name: "date", label: "Date", control: "datepicker", dateFormat: 'yy-mm-dd'};
	L_myfields.push(L_myobj);
	L_mymodel.set("date", mysql_to_dd_mname_yyyy(mydate));
	
	L_myobj = {name: "time", label: "Time", control: "input"};
	L_myfields.push(L_myobj);
	L_mymodel.set("time", mytime);
	
	var a = [];
	for (var i=0; i<events_table.length; i++)
	{
		a.push ({label: events_table[i][1], value: events_table[i][0]});
	} 
	
	L_myobj = {name: "event_type", label: "Event Type", 
	control: "select", 
	options: a};
	L_myfields.push(L_myobj);
	L_mymodel.set( "event_type", "");
	
	L_myobj = {name: "event_description", label: "Event Description", control: "input"};
	L_myfields.push(L_myobj);
	L_mymodel.set( "event_description", "");
	
	let html = '<button type="button" onclick="event_add_event()" class="btn btn-primary">Add Event for team</button>';

	L_myform = new Backform.Form({el: "#event-form", model: L_mymodel, fields: L_myfields});
	L_myform.render();
	
	$("#event-button").html(html);
}

// add the new event
function event_add_event()
{
	var descr = L_mymodel.get("event_description");
	var type = L_mymodel.get("event_type");
	var mydate = L_mymodel.get("date");
	mydate = dd_mname_yyyy_to_mysql(mydate); 
	var mytime = L_mymodel.get("time");	
	var the_datetime = mydate.substr(0,10) + " " + mytime;
	
	add_event ( the_datetime, G_selected_team, type, descr)
	process_events_queue (events_cb);
}

// delete the event
function delete_the_event(id)
{
	if (confirm("Are you sure that you want to delete the event") == true) 
	{
		delete_event (id);
		process_events_queue (events_cb);	
	} 
}

// edit the event
function edit_the_event(id)
{
	G_EventEditView.render(id);
}

// common callback for all event processing .. redraw screen
function events_cb()
{   
	G_EventsListView.render();
}

//====================// 
//  EDIT EVENT VIEW  //
//===================// 

G_EventEditView_Definition = Backbone.View.extend(
{   
    // initialize
    initialize: function () 
    {
        _.bindAll(this, 'render', 'doCancel', 'doFunction'); 
        this.on('doFunction', this.doFunction, this);
        this.on('doCancel', this.doCancel, this);
        this.on('escKey', this.doCancel, this);
    }, 
      
    // render   
   	render: function (id) 
    {    	
    	// setup the views into the three main screen areas
		setup_view ("U", "T-Events-Functions", "T-Events-Commands", "T-Events-Edit-Content");
		G_current_view = this;	

		// set the screen height into the main-content div
		$("#main-content").css("height", window.innerHeight);
		
		$("#events-edit-hdr").html("Editing Event ID " + id + " for Team " + G_selected_team);
		
		// continue at normal function
		event_edit_continue(id);
    },
    
    // doCancel  
   	doCancel: function () 
    {	
    	alert ("Unimplemented cancel");
    },
    
    // dofunction - mouse click entry point  
   	doFunction: function (func) 
    {	
    	if (func=="return")
    	{
    		G_EventsListView.render();	
    	}
    	
    	else if (func=="cancel")
    	{
    		G_EventsListView.render();	
    	}
    	
    	else
    	{
	    	alert ("Undecoded Events Function " + func);
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

function event_edit_continue(id)
{
	// locate the event with this id in the event table 
	let found = 0;
	let ievents;
	for (ievents=0; ievents<L_events_database.length; ievents++)
	{  
		console.log (L_events_database[ievents]["ID"]);
		console.log (id);
		if (L_events_database[ievents]["ID"]==id)
		{
			found = 1;
			break;
		}
	}
	if (found==0) 
	{
		alert ("Event not found in event table");
		return;
	}

	// create the model
	L_mymodel = new Backbone.Model({});

	// create fields
	var L_myfields = [];
	
	var date_time =  L_events_database[ievents]["Date_Time"]
	var mydate = date_time.substr(0, 10);
	var mytime = date_time.substr(11);
	
	L_myobj = {name: "id", label: "ID (not editable)", control: "uneditable-input"};
	L_myfields.push(L_myobj);
	L_mymodel.set("id", id);
	
	L_myobj = {name: "date", label: "Date", control: "datepicker", dateFormat: 'yy-mm-dd'};
	L_myfields.push(L_myobj);
	L_mymodel.set("date", mysql_to_dd_mname_yyyy(mydate));
	
	L_myobj = {name: "time", label: "Time", control: "input"};
	L_myfields.push(L_myobj);
	L_mymodel.set("time", mytime);
	
	var a = [];
	var event_type_val = 0;
	for (var i=0; i<events_table.length; i++)
	{
		if (L_events_database[ievents]["Event_Type"]==events_table[i][0])
		{
			a.push ({label: events_table[i][1], value: events_table[i][0], selected: true});
			event_type_val = events_table[i][0];
		}
		else
		{
			a.push ({label: events_table[i][1], value: events_table[i][0]});
		}
	} 
	
	L_myobj = {name: "event_type", label: "Event Type", control: "select", options: a};
	L_myfields.push(L_myobj);
	L_mymodel.set( "event_type", event_type_val);
	
	L_myobj = {name: "event_descr", label: "Event Description", control: "input"};
	L_myfields.push(L_myobj);
	L_mymodel.set( "event_descr", L_events_database[ievents]["Event_Descr"]);
	
	let html = '<button type="button" onclick="event_edit_update()" class="btn btn-primary">Update Event</button>';
	html = html + '<button style="margin-left:20px" type="button" onclick="G_EventsListView.render()" class="btn btn-primary">Cancel</button>';
	
	L_myform = new Backform.Form({el: "#event-form", model: L_mymodel, fields: L_myfields});
	L_myform.render();
	
	$("#event-button").html(html);
	
	// right click content menu
	$.contextMenu
	({
		selector: '#events-content', 
		callback: function(key, options, e) 
		{
			if (key=="return")
			{
				view_clickit_function('return')
				return;
			}
		},
		items: 
		{
			"return": {name: "Return"}
		}  
	});      		
}

// edit update button pressed
function event_edit_update()
{
	var id = L_mymodel.get("id");
	var event_descr = L_mymodel.get("event_descr");
	var event_type = L_mymodel.get("event_type");
	console.log (event_type);
	var mydate = L_mymodel.get("date");
	mydate = dd_mname_yyyy_to_mysql(mydate); 
	var mytime = L_mymodel.get("time");	
	var date_time = mydate.substr(0,10) + " " + mytime;

	update_event (id, date_time, event_type, event_descr);
	process_events_queue (events_cb);
}

//------------------------------------------//
// get last event for team using team code  //
//------------------------------------------//

function get_last_event_index (team_code)
{
	var last_ievents = -1;
	for (var ievents=0; ievents<L_events_database.length; ievents++)
	{    	
		if (L_events_database[ievents]["Team_Code"]==team_code)
		{
			last_ievents = ievents;
		}
	}
	return(last_ievents);
}

//------------------//
// get team status  //
//------------------//

function get_event_status (team_code)
{
	for (var ievents=0; ievents<L_events_database.length; ievents++)
	{    	
		if (L_events_database[ievents]["Team_Code"]==team_code)
		{
			if (L_events_database[ievents]["Event_Type"]==EVENT_TEAM_STATUS)
			{
				return (L_events_database[ievents]["Event_Descr"]);
			}
		}
	}
	return("No Status available");
}
   
//-------------------------------------------------//
// get the index of the last message for this team //
//-------------------------------------------------//

function get_last_msg_index (team_code)
{
	var last_ievents = -1;
	for (var ievents=0; ievents<L_events_database.length; ievents++)
	{    
		if (L_events_database[ievents]["Team_Code"]==team_code)
		{	
			if ((L_events_database[ievents]["Event_Type"]==EVENT_BCU_MESSAGE_SENT)
			 || (L_events_database[ievents]["Event_Type"]==EVENT_BCP_MESSAGE_SENT)
			 || (L_events_database[ievents]["Event_Type"]==EVENT_OPC_MESSAGE_SENT))
			{
				last_ievents = ievents;
			}
		}
	}
	return(last_ievents);
}

//---------------------------------//
// get the event type for an index //
//---------------------------------//

function get_event_type (index)
{
	return(L_events_database[index]["Event_Type"]);
}

//---------------------------------//
// get the text for an event type  //
//---------------------------------//

function get_event_type_text (type)
{
	for (var i=0; i<events_table.length; i++)
	{
		if (events_table[i][0]==type) 
		{
			return (events_table[i][1]);
		}
	} 	
	alert ("get_event_type_text type not found");	 
	return;
}

//---------------------//
// add event for team  //
//---------------------//

function add_event (date, team_code, event_type, event_descr)
{
	// check for running on gas
	if (G_running_on_gas==true)
	{
		var key_array = [];
		key_array.push('Team_Code');
		key_array.push('Date_Time');
		key_array.push('Event_Type');
		key_array.push('Event_Descr');
		var val_array = [];
		val_array.push(team_code);
		val_array.push(date);
		val_array.push(event_type);
		val_array.push(event_descr);
	    L_events_queue.push (['INSERT', key_array, val_array]);
	}
	
	// else using SQL server
	else
	{
		// add to the events queue
		var mysql = "INSERT INTO RRM_Events (Team_Code, Date_Time, Event_Type, Event_Descr)";
		mysql = mysql + "VALUES ( '" + team_code + "' , '" + date + "' , '" + event_type + "' , '" + event_descr + "' )";
		L_events_queue.push (mysql);
	}
	
	// events database is no longer valid
	L_events_database_valid=0;
}

//------------------------//
// update event for team  //
//------------------------//

function update_event (id, date_time, event_type, event_descr)
{
	// check for running on gas
	if (G_running_on_gas==true)
	{
		var key_array = [];
		key_array.push('Date_Time');
		key_array.push('Event_Type');
		key_array.push('Event_Descr');
		var val_array = [];
		val_array.push(date_time);
		val_array.push(event_type);
		val_array.push(event_descr);
		L_events_queue.push (['UPDATE', "ID", id, key_array, val_array]);
	}
	
	// else using SQL server
	else
	{
		// add to the events queue
		var mysql = "UPDATE RRM_Events SET ";  
		mysql = mysql + "Date_Time = '" + date_time + "' , ";
		mysql = mysql + "Event_Type = '" + event_type + "' , "; 
		mysql = mysql + "Event_Descr = '" + event_descr  + "' "; 
		mysql = mysql + "WHERE ID = '" + id + "';";
		L_events_queue.push (mysql);
	}
	
	// events database is no longer valid
	L_events_database_valid=0;
}

//-------------------------------//
// delete single event using id  //
//-------------------------------//

// delete event - add request to event queue
function delete_event (id)
{
	// check for running on gas
	if (G_running_on_gas==true)
	{
		L_events_queue.push (['DELETE', "ID", id]);
	}
	
	// else using SQL server
	else
	{
		// add to the events queue
		var mysql = "DELETE FROM RRM_Events WHERE ID = " +  id + ";";
		L_events_queue.push (mysql);
	}
	
	// events database is no longer valid
	L_events_database_valid=0;
}

function delete_event_cb_1 ()
{
}

//-------------------------------------------------//
// delete alls events for a team using team code   //
//-------------------------------------------------//

// delete all events for team - add request to event queue
function delete_all_events_for_team (team_code)
{
	// check for running on gas
	if (G_running_on_gas==true)
	{
		L_events_queue.push (['DELETE', "Team_Code", team_code]);
	}
	
	// else using SQL server
	else
	{
		var mysql = "DELETE FROM RRM_Events WHERE Team_Code = '" + team_code + "';"; 
		L_events_queue.push (mysql);
	}
	
}

//-------------------------------------//
// Process the events queue (callback) //
//-------------------------------------//

var L_process_events_cb;
function process_events_queue (callback)
{
	// save the callback
	L_process_events_cb = callback;
	
	// run updates and new entries on database
	var mysql = L_events_queue.shift()	
		
	// update if something to do	
	if (mysql!=undefined) 
	{
		if (G_running_on_gas==true)
		{
			if (mysql[0]=="INSERT")
			{
				db_insert_into ("Events", mysql[1], mysql[2], process_events_queue_2);
			}
			else if (mysql[0]=="DELETE")
			{
				db_delete_where ("Events", mysql[1], mysql[2], process_events_queue_2);
			}
			else if (mysql[0]=="UPDATE")
			{
				db_update_where ("Events", mysql[1], mysql[2], mysql[3], mysql[4],  process_events_queue_2);
			}
		}
		else
		{
			do_sql (mysql, process_events_queue_2, "")
		}
    }
	else
	{
		process_events_queue_3();
	}
} 

// come here to run some sql on the database
function process_events_queue_1 (mysql)
{
	if (G_running_on_gas==true)
	{
		if (mysql[0]=="INSERT")
		{
			db_insert_into ("Events", mysql[1], mysql[2], process_events_queue_2);
		}
		else if (mysql[0]=="DELETE")
		{
			db_delete_where ("Events", mysql[1], mysql[2], process_events_queue_2);
		}
		else if (mysql[0]=="UPDATE")
		{
			db_update_where ("Events", mysql[1], mysql[2], mysql[3], mysql[4],  process_events_queue_2);
		}
	}
	else
	{
		do_sql (mysql, process_events_queue_2, "");
	}
}

// come here when do_sql completes
function process_events_queue_2 (response)
{
	var mysql = L_events_queue.shift()
	if (mysql!=undefined) 
	{
		process_events_queue_1 (mysql)
	}
	else
	{	
		process_events_queue_3();
	}
}

// reload the events database after all the updates
// return via original callback
function process_events_queue_3()
{
	 L_events_database_valid=0;	 
	 load_events (L_process_events_cb)
}

//---------------------------//
// New Wix Team registration //
// Add events to queue       //
//---------------------------//

function event_new_wix_registration (team_code, payment_status)
{
	add_event (get_current_sql_date(), team_code, EVENT_WIX_REGISTRATION, "Team Registration by Wix")
	if (payment_status=="Paid")
	{
		add_event (get_current_sql_date(), team_code, EVENT_WIX_PAID_ON_REGISTRATION, "Paid on WIX Registration")
	}
	else
	{
		add_event (get_current_sql_date(), team_code, EVENT_WIX_UNPAID_ON_REGISTRATION, "UnPaid on WIX Registration")
	}
}

//---------------------------------//
// Wix changed from unpaid to paid //
//---------------------------------//

// convert event type to description
function event_wix_payment_changed (team_code)
{
	add_event (get_current_sql_date(), team_code, EVENT_WIX_CHANGED_TO_PAID, "Changed to Paid in WIX")
}
