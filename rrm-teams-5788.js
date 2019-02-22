"use strict";

//=========================   
// List Teams .. prefix=LT 
//=========================

var TL_info_group_columns;

var TL_info_group1_columns;
var TL_info_group2_columns;
var TL_info_group3_columns;
var TL_info_group4_columns;
var TL_info_group5_columns;
var TL_info_group6_columns;
var TL_info_status_columns;

var TL_info_group_rows;

var TL_info_group1_rows;
var TL_info_group2_rows;
var TL_info_group3_rows; 
var TL_info_group4_rows;
var TL_info_group5_rows;
var TL_info_group6_rows;
var TL_info_status_rows;

var TL_filter_enabled;
var TL_filter_and_if_1 = 1;
var TL_click_filter_block;
var TL_event_block;
var TL_scrolTL_pos;

var EVENT_FILTER_HIDE_SHOW_CLICKED = 1000;
var EVENT_FILTER_OPTIONS_CLICKED = 1001;
var EVENT_TABLE_CLICKED = 1002;
var EVENT_TABLE_REDRAW = 1003;

var TL_teams_in_table;
var TL_num_teams_in_table_last_update;

var TL_draw_content_request;
var TL_list_info_showing;
var TL_single_team_showing;

var TL_delete_queue;
var TL_message_queue;
var TL_timer_var;
var TL_timerxx;
var TL_timer_count;

var TL_scroll_pos = 0;
var TL_height;

var TL_teams_last_selected_team;
var TL_last_group_displayed = -1;

var TL_selected_tab;

function rrm_teams_init ()
{
	TL_teams_last_selected_team = "";
}

//=============================================================
//   LIST TEAMS VIEW 
//=============================================================

G_ListTeamsView_Definition = Backbone.View.extend(
{
    // initialization
    initialize: function () 
    {
        _.bindAll(this, 'render', 'doCancel', 'doFunction', 'terminate'); 
        this.on('doFunction', this.doFunction, this);
        this.on('doCancel', this.doCancel, this);
        this.on('escKey', this.doCancel, this);
    }, 
      
    // render   
   	render: function () 
    {	
    	// setup the view
    	setup_view ("U", "T-Main-Views", "T-Commands-Logoff", "T-List-Teams-Content");
    	G_current_view = this;
    	
    	// handle view button
    	if (G_selected_view_id!=null)
    	{
		   $(G_selected_view_id).addClass('nav-top-item').removeClass('nav-selected-item');
    	}
		$("#id-list-teams").addClass('nav-selected-item').removeClass('nav-top-item');
		G_selected_view_id = "#id-list-teams";
    	
    	TL_selected_tab = "id-show-team-status";
    	
    	$('#id-show-team-status').addClass('current');
    
    	// set the screen height into the main-content div
		//var width = G_content_width;
		//$("#content").css("width", width-230);
		//$("#content").scrollTop(TL_scrolTL_pos);

		// filter initially off and 'and'
		TL_filter_enabled = false;	
		TL_filter_and_if_1 = 1;	
		$('#filter-settings').hide();
		$('#filter-header').html(" to enable and show filter options")
 
    	// show group 
    	TL_selected_tab =  '#id-show-team-status';
    	if (TL_last_group_displayed==-1)
    	{
    		draw_content (GROUP_TEAM_STATUS);
    	}
    	else
    	{
    		draw_content (TL_last_group_displayed);
    	}
    	
    	// init variables
    	TL_draw_content_request = 0;
    	TL_event_block = false;
    	TL_single_team_showing = -1;
    	TL_num_teams_in_table_last_update = -1;
    	  	
    	// init the filter  	
    	for (var ifilter=0; ifilter<db_filter.length; ifilter++)
 		{
			db_filter[ifilter][DB_FILTER_VALUE] = "";
		}

		// start the timer
		TL_start_timer();
    },
    
    // doCancel  
   	doCancel: function () 
    {	
    	TL_stop_timer();
    	var ret = do_logoff(0);
    },
    
    // terminate  
   	terminate: function () 
    {	
    	console.log ("teams terminate");
    	TL_stop_timer();
    },
    
    // dofunction - mouse click entry point  
   	doFunction: function (func) 
    {  
    	TL_scroll_pos = $("#main-content").scrollTop();
    	console.log ("Read scrollpos = " + TL_scroll_pos);

    	TL_height = $("#team-table-content-box").height();
    	console.log ("Read height = " + TL_height);
		
        // switch view requested
        if (func=="switch_view_request")
        { 
        	setup_view ("U", "", "T-Commands-Logoff", "");
    		TL_stop_timer();
    		return "OK_TO_SWITCH";
        }
        
    	// logoff requested
		else if (func=="logoff")
    	{
    		do_logoff(0);	
		}	
    	
		// add team
		else if (func=="add-team")
    	{
			add_team();
		}
			
		// delete team
		else if (func=="delete-team")
    	{
			delete_team();
		}	
		// list teams status
		else if (func=="func-show-team-status")  
		{
			$(TL_selected_tab).removeClass('current');
			TL_selected_tab =  '#id-show-team-status';
			$(TL_selected_tab).addClass('current');
	
			draw_content(GROUP_TEAM_STATUS);	
		}
	
		// list registration info
		else if (func=="func-show-registration-info")  
		{
			$(TL_selected_tab).removeClass('current');
			TL_selected_tab =  '#id-show-registration-info';
			$(TL_selected_tab).addClass('current');

			draw_content(GROUP_REGISTRATION_INFO);	
		}
		
		// list contact info
		else if (func=="func-show-contact-info")  
		{
			$(TL_selected_tab).removeClass('current');
			TL_selected_tab =  '#id-show-contact-info';
			$(TL_selected_tab).addClass('current');

			draw_content(GROUP_CONTACT_INFO);	
		}
		
		// list team info
		else if (func=="func-show-team-info")  
		{
			$(TL_selected_tab).removeClass('current');
			TL_selected_tab =  '#id-show-team-info';
			$(TL_selected_tab).addClass('current');

			draw_content(GROUP_TEAM_INFO);	
		}
		
		// list charity info
		else if (func=="func-show-charity-info")  
		{
			$(TL_selected_tab).removeClass('current');
			TL_selected_tab =  '#id-show-charity-info';
			$(TL_selected_tab).addClass('current');

			draw_content(GROUP_CHARITY_INFO);	
		}
		
		// list payment info
		else if (func=="func-show-payment-info")  
		{
			$(TL_selected_tab).removeClass('current');
			TL_selected_tab =  '#id-show-payment-info';
			$(TL_selected_tab).addClass('current');

			draw_content(GROUP_PAYMENT_INFO);	
		}
		
		// list runners info
		else if (func=="func-show-runners-info")  
		{
			$(TL_selected_tab).removeClass('current');
			TL_selected_tab =  '#id-show-runners-info';
			$(TL_selected_tab).addClass('current');

			draw_content(GROUP_RUNNERS_INFO);	
		}
		
		// list dates info
		else if (func=="func-show-dates-info")  
		{
			$(TL_selected_tab).removeClass('current');
			TL_selected_tab =  '#id-show-dates-info';
			$(TL_selected_tab).addClass('current');

			draw_content(GROUP_DATES_INFO);	
		}

		// edit team
		else if (func=="edit-team")
    	{
    		TL_stop_timer();
    		TE_start_team_app(G_selected_team); 
		}
		
		// team info
		else if (func=="info-team")
    	{
    		team_info();
		}	
		
		// paypal info
		else if (func=="paypal-info-team")
    	{
    		paypal_team_info();
		}	
		
		// message team
		else if (func=="msg-team")
    	{	
    		TL_stop_timer();
			Xcall(G_SendMsgView);
		}	
		
		// teams report
		else if (func=="report-teams")
    	{	
			report_teams();
		}	
		
		// message all teams
		else if (func=="msg-all-teams")
    	{
    		TL_stop_timer();
			Xcall(G_MsgMultTeamsView);
		}	

		// team events
		else if (func=="events-team")
    	{
    		TL_stop_timer();
			G_EventsListView.render();
		}	
		
		// delete all teams
		else if (func=="delete-all-teams")
    	{
			delete_all_teams();
		}	

		// email team
		else if (func=="email-team")
    	{
    		TL_stop_timer();
			G_SendEmailView.render();
			
			/*
    		var iteam = team_code_to_index (G_selected_team);
    		var team_email = G_team_database[iteam]["Email"]
    		
    		var body = "Dear " + G_team_database[iteam]["Team_Captain_First_Name"] + "{!BR()}Check From Address is info<{!BR()}Best Wishes<br>\nRon Bowater<br>Relay Marathon Committee";

			// open the email window
			var mailto_link = 'mailto:' + G_team_database[iteam]["Email"] + '&body=' + body + '&Subject=Romsey Relay Marathon';
    		var win = window.open(mailto_link, 'emailWindow');
    		*/
		}	
		
		// close modal
		else if (func=="button-close")
    	{
    		return;
    	}

    	else			
    	{
	    	alert ("Undecoded List Teams Function " + func);	
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

function arraysEqual(a, b) 
{
  	if (a === b) return true;
  	if (a == null || b == null) return false;
  	if (a.length != b.length) return false;

  	// If you don't care about the order of the elements inside
  	// the array, you should sort both arrays here.
  	// Please note that calling sort on an array will modify that array.
  	// you might want to clone your array first.

  	for (var i = 0; i < a.length; ++i) 
  	{
    	if (a[i] !== b[i]) return false;
  	}
  	return true;
}

// generate teams report
function report_teams ()
{
	var report = ""; 

	clear_and_display_modal();
	
	// loop for all database rows i.e. registered teams
	var n = 1;
	for (var iteam=0; iteam<G_team_database.length; iteam++)
	{ 
		var team_events= new Array();
		for (var ievents=0; ievents<L_events_database.length; ievents++)
		{    	
			if (L_events_database[ievents]["Team_Code"]==G_team_database[iteam]["Team_Code"])
			{
				if ((L_events_database[ievents]["Event_Type"]!=EVENT_NOTE)
				 && (L_events_database[ievents]["Event_Type"]!=EVENT_NONE))
				{	
					team_events.push (parseInt(L_events_database[ievents]["Event_Type"]));
				}
			}
		}
		team_events.sort();
		
		var seq_events = new Array();
		var found = 0;
		var iseq = 0;
		while (events_sequence_table[iseq]!=EVENT_STATE_END)
		{
			var a = events_sequence_table[iseq];	
			if (a<100)
			{
				seq_events.push(a);	
			}	
			else
			{
				seq_events.sort();
				report = report + "Test "; 
				for (var i=0; i<team_events.length; i++)
				{
					report = report + team_events[i].toString() + " ";
				} 
				report = report + "    ";
				for (var i=0; i<seq_events.length; i++)
				{
					report = report + seq_events[i].toString() + " ";
				} 
				report = report + "\n";

				
				if (arraysEqual(team_events, seq_events)==true)
				{
					found = 1;
					break;
				}
				else 
				{
					seq_events = new Array();
				}
			}
			iseq = iseq + 1;
		}
		if (found==1)
		{
			report = report + "Team " + G_team_database[iteam]["Team_Code"] + "matches" + "\n";
		}
		else
		{
			report = report + "Team " + G_team_database[iteam]["Team_Code"] + " does not match ";
			for (var i=0; i<team_events.length; i++)
			{
				report = report + team_events[i].toString() + " ";
			}
			report = report + "\n";
		}
	}
	
	report = report + "End of Report\n";
	
	var file = new File([report], {});
	saveAs(file, "report.txt");
		
	write_modal ("File is located in downloads on Mac");
	write_modal ("Report generation completed");

	show_modal_close();
}

// start the timer
function TL_start_timer()
{ 
	TL_timer_var = -1;
	TL_timer_var = setTimeout (TL_timer_handler, 250);
	TL_timer_count = 0;
}

// stop the timer
function TL_stop_timer()
{ 
	if (TL_timer_var!=-1) 
	{
		clearTimeout(TL_timer_var);
		TL_timer_var = -1;
	}
}

// timer handler
function TL_timer_handler()
{
	TL_timer_count = TL_timer_count + 1;
	TL_timer_var = -1;
	
	if (TL_draw_content_request==1)
	{
		TL_draw_content_request = 0;
		draw_content (-1);
	}
	
	determine_selected_teams();
	 
	TL_timer_var = setTimeout (TL_timer_handler, 250);
}

// process event
function process_event(e, event, parm)
{
	if (e.shiftKey) console.log("Shift, yay!")
	 
	// ignore any events while processing
	if (TL_event_block==true) return;
	TL_event_block = true;
	
	switch (event)
	{
		// handle filter hide/show clicked
		case EVENT_FILTER_HIDE_SHOW_CLICKED:
		
			console.log ("Event EVENT_FILTER_HIDE_SHOW_CLICKED");
		
			// show filter options if not currently on the screen
			if (TL_filter_enabled==false)
			{
				TL_filter_enabled = true;
				
				// ask the timer to call draw content
				TL_draw_content_request = 1;
			}
	
			// else turn off filter
			else
			{
				TL_filter_enabled = false;
				
				// ask the timer to call draw content
				TL_draw_content_request = 1;
			}	
			
			// turn off any selected team
			if (TL_teams_last_selected_team!="")
			{
				//console.log (TL_teams_last_selected_team);
				set_table_row(TL_teams_last_selected_team, 'white');
				TL_teams_last_selected_team = "";
				G_selected_team = "";	
			}
							
			break;
			
		// handle filter options clicked	
		case EVENT_FILTER_OPTIONS_CLICKED:

			console.log ("Event EVENT_FILTER_OPTIONS_CLICKED");
		
			// read the filter logic and/or radio button
			TL_filter_and_if_1 = $("input[name='Filter-And-Or']:checked").val();
			console.log (TL_filter_and_if_1);
			
			// build the filter
			build_filter();
			
			// turn off any selected team
			if (TL_teams_last_selected_team!="")
			{
				//console.log (TL_teams_last_selected_team);
				set_table_row(TL_teams_last_selected_team, 'white');
				TL_teams_last_selected_team = "";
				G_selected_team = "";	
			}
			
			// ask the timer to call draw content
			TL_draw_content_request = 1;
			break;
			
		// handle table clicked	
		case EVENT_TABLE_CLICKED :
		
			console.log ("Event EVENT_TABLE_CLICKED " + parm);
			
			// set selected team
			G_selected_team = parm;
		
			// if we had a last selected team, set it to white
			if (TL_teams_last_selected_team!="")
			{
				set_table_row(TL_teams_last_selected_team, 'white');
				TL_teams_last_selected_team = "";	
			}
	
			// if we have a new selected team, set it to aqua
			if (G_selected_team!="")
			{
				set_table_row(G_selected_team, 'aqua');
				TL_teams_last_selected_team = G_selected_team;	
			}
			
			// unblock
			TL_event_block = false;
			break;
			
		case EVENT_TABLE_REDRAW:
		
			console.log ("Event EVENT_TABLE_REDRAW");
				
			// need to allow the table to be redrawn before reading it
			TL_timerxx = setTimeout(determine_selected_teams, 1);	
			
			// unblock
			TL_event_block = false;
			break;
			
		// unrecognised event	
		default:
			alert ("rrm_teams invalid event");
			
			// unblock
			TL_event_block = false;

			break;
	}	
}

// draw the entire content part of the screen 
function draw_content (group)
{
	TL_last_group_displayed = group;
	
	$('#team-table').empty();	
	
	// remember which group we have on the screen
	if (group!=-1)
	{
		TL_list_info_showing = group;
	}
	else
	{
		group = TL_list_info_showing;
	}
	
	// filter eneabled 
	if (TL_filter_enabled==true)
	{
		$('#filter-settings').show();
		$('#filter-header').html(" to disable and hide filter options");
	}
	
	// else filter disabled
	else 
	{
		$('#filter-settings').hide();
		$('#filter-header').html(" to enable and show filter options")
	}

	// create the table
	if (group==GROUP_TEAM_STATUS)
	{
		create_team_status_table();
	}
	else
	{
		create_team_table_by_group(group);
	}	
	
	// output the foo table
	jQuery(function($)
	{
		$('#team-table').footable(
		{
			"paging": {"size": 20},
			"toggleColumn": "first",
			"sorting": {"enabled": true},
			"columns": TL_info_group_columns,
			"rows": TL_info_group_rows
		});
	});	
	
	// create and output filter and/or radio button if enabled
	var html = "";
	if (TL_filter_enabled==true)
	{		
		var checked_and = "";
		var checked_or = "";
		
		if (TL_filter_and_if_1==1) 
		{
			checked_and = "checked='checked'";	
		}
		else 
		{
			checked_or = "checked='checked'";
		}
	 
		html = html + "<input type='radio' " + checked_and + " name='Filter-And-Or' value='1'/> (AND) All conditions must be met <br />";
		html = html + "<input type='radio' " + checked_or + " name='Filter-And-Or' value='0'/> (OR) Any condition can be met <br />";
		html = html + "</p>";  
	}	
 	html = html + "<br class='clear' />";
	$("#filter-andorfieldset").html (html);
	
	// create and output filter radio buttons if enabled
	var html = "";
	if (TL_filter_enabled==true)
	{
		for (var ifilter=0; ifilter<db_filter.length; ifilter++)
		{
			if (ifilter==0)
				html = html + "<p style='float:left'>";
			else
				html = html + "<p style='float:left; margin:0 40px 0 40px'>";
			html = html + "<label>" + db_filter[ifilter][DB_FILTER_TEXT] + "</label>";
		
			var checked0 = "";
			var checked1 = "";
			var checked2 = "";
		
			if (db_filter[ifilter][DB_FILTER_VALUE]=="") checked0 = "checked='checked'";
			else if (db_filter[ifilter][DB_FILTER_VALUE]==db_filter[ifilter][DB_FILTER_OPTION_1_VALUE]) checked1 = "checked='checked'";
			else if (db_filter[ifilter][DB_FILTER_VALUE]==db_filter[ifilter][DB_FILTER_OPTION_2_VALUE]) checked2 = "checked='checked'";
		
			html = html + "<input type='radio' " + checked0 + " name='Filter" + ifilter + "' value=''  /> Not in Filter <br />";
			html = html + "<input type='radio' " + checked1 + " name='Filter" + ifilter + "' value='" + db_filter[ifilter][DB_FILTER_OPTION_1_VALUE] + "'  /> " + db_filter[ifilter][DB_FILTER_OPTION_1_LABEL] + " <br />";
			html = html + "<input type='radio' " + checked2 + " name='Filter" + ifilter + "' value='" + db_filter[ifilter][DB_FILTER_OPTION_2_VALUE] + "'/> " + db_filter[ifilter][DB_FILTER_OPTION_2_LABEL] + " ";
			html = html + "</p>";  
		}
	}	
 	html = html + "<br class='clear' />";
	$("#filter-fieldset").html (html);

	// if we have a selected team, set to aqua
	if (G_selected_team!="")
	{
		set_table_row (G_selected_team, 'aqua');
	}

	// trigger on left button click in a row for single team
	$('#team-table').find('tr').click( function(e)
	{
		process_event (e, EVENT_TABLE_CLICKED, $(this).find('td:first').text());
	});
	
	// trigger on right button click in a row for single team
	$('#team-table').find('tr').contextmenu( function(e)
	{
		process_event (e, EVENT_TABLE_CLICKED, $(this).find('td:first').text());
	});
	
	// right click content menu
	$.contextMenu
	({
		selector: '#team-table', 
		callback: function(key, options, e) 
		{
			if (key=="team_status")
			{
				G_ListTeamsView.doFunction("func-show-team-status");
				return;
			}
			else if (key=="registration_info")
			{
				G_ListTeamsView.doFunction("func-show-registration-info");
				return;
			}
			else if (key=="contact_info")
			{
				G_ListTeamsView.doFunction("func-show-contact-info");
				return;
			}
			else if (key=="team_info")
			{
				G_ListTeamsView.doFunction("func-show-team-info");
				return;
			}
			else if (key=="charity_info")
			{
				G_ListTeamsView.doFunction("func-show-charity-info");
				return;
			}
			else if (key=="payment_info")
			{
				G_ListTeamsView.doFunction("func-show-payment-info");
				return;
			}
			else if (key=="runners_info")
			{
				G_ListTeamsView.doFunction("func-show-runners-info");
				return;
			}
			else if (key=="paypal")
			{
				paypal_team_info();	
			}
			else if (key=="quick")
			{
				team_info();	
			}
			else if (key=="email")
			{
				TL_stop_timer();
				G_SendEmailView.render();	
			}
			else if (key=="events")
			{
				G_ListTeamsView.doFunction("events-team");
			}
			else if (key=="edit")
			{
				TL_stop_timer();
				TE_start_team_app(G_selected_team);	
			}
			else if (key=="process")
			{
				 show_process();
			}
		},
		items: 
		{
			"team_status": {name: "Team Status"},
			"registration_info": {name: "Registration Info"},
			"contact_info": {name: "Contact Info"},
			"team_info": {name: "Team Info"},
			"charity_info": {name: "Charity Info"},
			"payment_info": {name: "Payment Info"},
			"runners_info": {name: "Runners Info"},
			"paypal": {name: "Paypal Info"},
			"quick": {name: "Quick Info"},
			"edit": {name: "Edit Team"},
			"events": {name: "Team Events"},
			"email": {name: "Email Team"},
			"process": {name: "Show Process"}
		}        		
    });

	// trigger on hide or show filter clicked
	$('#click-team-filter').click(function(e)
	{
		process_event (e, EVENT_FILTER_HIDE_SHOW_CLICKED, 0);
	});
	
	// trigger on filter setting changed
	$('#filter-settings').change (function(e)
	{
  		process_event (e, EVENT_FILTER_OPTIONS_CLICKED, 0);
	});
	
	// trigger on screen redraw
	$("#team-table").on("postdraw.ft.table", function (e, ft, row) 
	{
		process_event (e, EVENT_TABLE_REDRAW, 0);
	});	
	
	// enable click events
	document.getElementById('click-team-filter').style.pointerEvents = 'auto';
	
	// scan the table first time round
	determine_selected_teams();
	
	// unblock process
	TL_event_block = false;
	
	// set the scroll position (adjust by change in height)
	var h = $("#team-table-content-box").height();
	var scroll_pos = TL_scroll_pos * h / TL_height;
	$("#main-content").scrollTop(scroll_pos);
}

// set the table row for a team to a background colour
function set_table_row (team, colour)
{
	$('#team-table tr').each(function (row)
	{
		 if (($(this).find('td:first').text())==team)
		 {
		 	$(this).css('background',colour);
		 	return;
		 }
	});
}

// build the filter 
function build_filter()
{
	for (var ifilter=0; ifilter<db_filter.length; ifilter++)
	{
		db_filter[ifilter][DB_FILTER_VALUE] = $("input[name='" + "Filter" + ifilter + "']:checked").val();
	}	
}

// determine a list of teams selected
function determine_selected_teams()
{
	TL_teams_in_table=[];
    $('#listing-header').html(" Processing...")
    
    // if we have a selected team, then set it 
    if (G_selected_team!="")
    {
    	TL_teams_in_table.push(G_selected_team);
    }
    
    // else scan the table
    else
    {
		// get all table rows 
		var $trows = $('#team-table >tbody').find("tr");
		$.each($trows, function() 
		{	
			// get all tds of each row
			var $tds = $(this).find("td");
		
			// only process first td of each row
			var cnt = 0;
			$.each($tds, function() 
			{
				if (cnt==0) 
				{
					TL_teams_in_table.push($(this).text());
					return false;
				}
			});
		});
	}
    
    // if we have one item and it is No Results then we actually have no results
    if ((TL_teams_in_table.length==1) && (TL_teams_in_table[0]=="No results"))
	{
    	TL_teams_in_table = [];
    }
    
    $('#listing-header').html(" " + TL_teams_in_table.length + " teams in table")
    
    // retun if no change to the command menu
	if (TL_teams_in_table.length==TL_num_teams_in_table_last_update) 
	{
		// if one team in table and the same team than return
		if (TL_teams_in_table.length==1)
		{
			if (TL_teams_in_table[0]==TL_single_team_showing) 
			{
				return;
			}
			TL_single_team_showing = TL_teams_in_table[0];
		}
		
		// else (not one) same number of teams in table
		else
		{
			return;
		}
	}
	
	// remember number of teams in table
	TL_num_teams_in_table_last_update = TL_teams_in_table.length;
    
    // if no teams then no menu
    if (TL_teams_in_table.length==0)
    {
    	setup_view ("U", "", "T-List-Team-No-Selected-Commands", "");
    }
    
    // else we have some teams
    else
    {
    	setup_view ("U", "", "T-List-Team-All-Selected-Commands", "");
    	
    	// check for one team
    	if (TL_teams_in_table.length==1)
    	{
    		setup_view ("U", "", "T-List-Team-Single-Selected-Commands", ""); 
		
			G_selected_team = TL_teams_in_table[0];
			$("#edit-team" ).html("Edit Team " + G_selected_team);
			$("#events-team" ).html("Events Team " + G_selected_team); 
			$("#info-team" ).html("Quick Info " + G_selected_team);
			$("#paypal-info-team" ).html("Paypal Info " + G_selected_team);
			$("#delete-team" ).html("Delete Team " + G_selected_team); 
			$("#msg-team" ).html("Message Team " + G_selected_team); 
			$("#email-team" ).html("Email Team " + G_selected_team); 	
		}
		
		// else more that one team in the table
		else  
		{
		   	$("#delete-all-teams" ).html("Delete all " + TL_teams_in_table.length + " listed teams"); 
		}
    }  
}

function check_filter(iteam)
{
	// do filter matching if needed
	var filter_in = true; 
	if (TL_filter_enabled==true)
	{
		// if logic is AND, preset result to true
		if (TL_filter_and_if_1==1) filter_in = true;
	
		// else (OR) preset result to false
		else filter_in = false;	
	
		// loop over all filters
		var num_filters = 0;
		for (var ifilter=0; ifilter<db_filter.length; ifilter++)
		{
			// check for if in filter
			if (db_filter[ifilter][DB_FILTER_VALUE]!="")
			{
				num_filters = num_filters + 1;
		
				var val = G_team_database[iteam][db_filter[ifilter][DB_FILTER_FIELD_NAME]];
				var compval = db_filter[ifilter][DB_FILTER_VALUE];
			
				var testok = false;
			
				// test for mobile supplied
				if ((compval=="#MOB") || (compval=="!#MOB"))
				{
					if ((val.substring(0,1)=="7") || (val.substring(0,2)=="07")) testok = true;
				
					// also test emit number
					var val_emit = G_team_database[iteam]["Tel_EMIT"];
					if ((val_emit.substring(0,1)=="7") || (val_emit.substring(0,2)=="07")) testok = true;
				
					if (compval.substring(0,1)=="!") testok = !testok;					
				}
			
				// else normal compare
				else
				{
					if (compval.substring(0,1)!="!")
					{
						if (val==compval) testok = true;
					}
					else
					{
						if (val!=compval.substr(1)) testok = true;
					}
				}
		
				// if logic is AND, any false test makes result false
				if ((TL_filter_and_if_1==1) && testok==false) filter_in = false;
			
				// else logic is OR, any true test makes result true
				else if ((TL_filter_and_if_1==0) && testok==true) filter_in = true;
			}
		}
	
		// if no filters enabled, filters have no effect
		if (num_filters==0) filter_in = true;
	}
	
	// return the result
	return filter_in;
}

function create_team_status_table ()
{
	// columns for status display	
	TL_info_group_columns=[];

	var code = "Team_Code";
	var acolumn = {name: code, title: "Team Code"};
	TL_info_group_columns.push (acolumn);

	var code = "Ordered_By";
	var acolumn = {name: code, title: "Ordered By"};
	TL_info_group_columns.push (acolumn);

	var code = "Team_Name";
	var acolumn = {name: code, title: "Team Name"};
	TL_info_group_columns.push (acolumn);
	
	var status = "Team_Status";  
	var acolumn = {name: status, title: "Team Status"};  
	TL_info_group_columns.push (acolumn);	
	
	var status = "Payment_Status";  
	var acolumn = {name: status, title: "Booking Status"};  
	TL_info_group_columns.push (acolumn);
	
	var status = "Special_Status";  
	var acolumn = {name: status, title: "Special Status"};  
	TL_info_group_columns.push (acolumn);	

	var status = "Grouping";  
	var acolumn = {name: status, title: "Grouping"};  
	TL_info_group_columns.push (acolumn);	

	// process rows
	TL_info_group_rows=[];
	
	// Do all teams  
	for (var iteam=0; iteam<G_team_database.length; iteam++)
 	{
 		// check filter
 		var filter_in = check_filter(iteam);
 		
		// process row if not filtered out
		if (filter_in==true)
		{		
			var thedate="";
			var difftext="";
			
			var team_code = G_team_database[iteam]["Team_Code"];
			
			// Column 1 status display columns
			var astatusrow = {};	
			var s = 'obj = {' + "Team_Code" + ':"' + team_code + '"};';
			eval (s);	
			$.extend(astatusrow, obj);
			
			// Column 2 - Ordered By
			var val = G_team_database[iteam]["Ordered_By"];
			var s = 'obj = {' + "Ordered_By" + ':"' + val + '"};';
			eval (s);	
			$.extend(astatusrow, obj);
			
			// Column 3 - Team Name
			var val = G_team_database[iteam]["Team_Name"];
			val = val.replace(/{SQUOTE}/g, "\\'")
			val = val.replace(/{DQUOTE}/g, '\\"')
			val = val.replace(/\x0A/gi, ' ');
			val = val.replace(/\x0D/gi, ' ');

			var s = 'obj = {' + "Team_Name" + ':"' + val + '"};';
			eval (s);	
			$.extend(astatusrow, obj);
			
			// Column 4 = Team Status
			var ss = get_event_status (team_code);			
			var obj = {};
			var s = 'obj = {' + "Team_Status" + ':"' +  ss + '"};';
			eval (s);	
			$.extend(astatusrow, obj);
			
			// Column 5 - Payment Status
			var val = G_team_database[iteam]["Payment_Status"];
			var s = 'obj = {' + "Payment_Status" + ':"' + val + '"};';
			eval (s);	
			$.extend(astatusrow, obj);
			
			// Column 6 - Special Status
			var special_status = G_team_database[iteam]["Special_Status"];
			if (special_status.trim()=="") special_status = "None";
			
			var s = 'obj = {' + "Special_Status" + ':"' +  special_status + '"};';
			eval (s);	
			$.extend(astatusrow, obj);
			
			//column 7 - Grouping					
			var grouping = "-";
			if ( G_team_database[iteam]["Grouping"]!='0')
			{
				if (G_team_database[iteam]["Grouping"]==G_team_database[iteam]["Team_Code"])
				{
					grouping = "Group " + G_team_database[iteam]["Grouping"] + " First";
				}
				else
				{
					grouping = "Group " + G_team_database[iteam]["Grouping"];
				}
			}
					
			var s = 'obj = {' + "Grouping" + ':"' + grouping + '"};';
			eval (s);	
			$.extend(astatusrow, obj);
			
			// put accumulated row to rows array	
			TL_info_group_rows.push (astatusrow);
		}  
	}  
}  

// create team table by group
function create_team_table_by_group (group)
{
	console.log (group);

	//  fill the columns
	TL_info_group_columns=[];
	TL_info_group_rows = [];

	var all_groups_cols = [];
	var specific_group_cols = [];
	
	// columns ... do for all items in schema i.e. all database fields
	for (var ischema=0; ischema<db_schema.length; ischema++)
	{
		var acolumn = {name:db_schema[ischema][DB_SCHEMA_FIELD_NAME], title:db_schema[ischema][DB_SCHEMA_FIELD_NAME].replace(/_/g, " ")};  
		
		if (db_schema[ischema][DB_SCHEMA_ALL_GROUPS] != 0) 
		{
			all_groups_cols.push (acolumn);	
		}
		else if (db_schema[ischema][DB_SCHEMA_GROUP]==group) specific_group_cols.push (acolumn);
	}
	
	TL_info_group_columns = all_groups_cols.concat(specific_group_cols);

	// now do the rows (one per row in database i.e. team) 
	var all_groups_rows = [];
	var specific_group_rows = [];
	
	// loop for all database rows i.e. registered teams
	for (var iteam=0; iteam<G_team_database.length; iteam++)
	{ 
		 // check filter
 		var filter_in = check_filter(iteam);
		
		// process row if not filtered out
		if (filter_in==true)
		{
			var all_groups_row = {};
			var specific_group_row = {};
			
			var thedate="";
			var difftext="";
		
			// all schema (columns)
			for (var ischema=0; ischema<db_schema.length; ischema++)
			{
				var val = G_team_database[iteam][db_schema[ischema][DB_SCHEMA_FIELD_NAME]];
				var dbname = db_schema[ischema][DB_SCHEMA_FIELD_NAME];
					
				if (typeof val!="string") 
				{
					alert ("val type != string " + db_schema[ischema][DB_SCHEMA_FIELD_NAME]);
					return;
				}

				if (db_schema[ischema][DB_SCHEMA_TYPE]==SCHEMA_TYPE_DATE)
				{
					if (val=="0000-00-00 00:00:00")
					{
						var thedate = "None";
						var difftext = "";
					}
					else
					{
						var a = moment(new Date());
						var b = moment(val.substring(0, 10));
						var diff = a.diff(b, 'days');
						difftext =  diff + " days ago";
		 
						if (diff==0) difftext = "Today";
						else if (diff==1) difftext = "Yesterday";
					
						thedate = mysql_to_dd_mname_yyyy (val);
					}
		  
					var obj = {};
					if (difftext=="") var s = 'obj = {' + db_schema[ischema][DB_SCHEMA_FIELD_NAME] + ':"' + thedate + '"};';
					else              var s = 'obj = {' + db_schema[ischema][DB_SCHEMA_FIELD_NAME] + ':"' + thedate + ' (' + difftext + ')"};';
					eval (s);
				}
				else
				{
					var obj = {};
					var val = G_team_database[iteam][db_schema[ischema][DB_SCHEMA_FIELD_NAME]];
					val = val.replace(/{SQUOTE}/g, "\\'")
					val = val.replace(/{DQUOTE}/g, '\\"')
					val = val.replace(/\x0A/gi, ' ');
					val = val.replace(/\x0D/gi, ' ');
					var s = 'obj = {' + db_schema[ischema][DB_SCHEMA_FIELD_NAME] + ':"' + val + '"};';
					eval (s);
					 
				}
				
		        if (db_schema[ischema][DB_SCHEMA_ALL_GROUPS] != 0) 
				{
					$.extend(all_groups_row, obj);	
				}
				else if (db_schema[ischema][DB_SCHEMA_GROUP]==group) $.extend(specific_group_row, obj );

			} // for all columns in schema
			
			// put accumulated row to rows array	
			var arow = {};
			$.extend (arow, all_groups_row, specific_group_row);
			TL_info_group_rows.push (arow);
		}  
	}  
}  
/*===============*/
/* add new team  */
/*===============*/

function add_team()
{
	// get next unallocated team code
	var next_team_code = parseInt(G_team_code_order_max)+1;
	var team_code = G_TEAM_CODE_PREFIX + next_team_code.toString(); 
	G_selected_team = team_code;
	
	if (confirm("Please confirm that you wish to manually add team " + team_code + " to the database") == true) 
	{
		var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
		
		clear_and_display_modal();
		write_modal ("Adding team " + G_selected_team + "...");
		
		// build the SQL - names first
		var mysql = "INSERT INTO " + MAIN_DATA_TABLE + "("; 
		for (var ischema=0; ischema<db_schema.length; ischema++)
		{
			if (ischema!=0) mysql = mysql + ", ";	
			mysql = mysql + db_schema[ischema][DB_SCHEMA_FIELD_NAME];
		}
		
		// next do values
		mysql = mysql + " ) VALUE ( ";
		for (var ischema=0; ischema<db_schema.length; ischema++)
		{
			var val = "TBD";
			
			if (ischema!=0) mysql = mysql + ", ";

			// first entry is always team_code
			if (ischema==0)
			{
				val = team_code;
			}
			else
			{
				// else see if we have an init value for this field
				var found = 0
				for (var iadd=0; iadd<db_add_defaults.length; iadd++)
				{
					if (db_add_defaults[iadd][DB_DEFAULTS_DB_NAME]==db_schema[ischema][DB_SCHEMA_FIELD_NAME])
					{
						found = 1;
						val = db_add_defaults[iadd][DB_DEFAULTS_INIT_VALUE]; 
					}
				}
 			
 				// if found, see if we have to substitute date
				if (found!=0)
				{
					if (val=="DATE") val = datetime;
				}
				else
				{
					if (db_schema[ischema][DB_SCHEMA_TYPE]==SCHEMA_TYPE_DATE)
					{
						val = "0000-00-00 00:00:00";
					}
				}
			}
			mysql = mysql + "'" + val + "'";
 		}	
 		mysql = mysql + " )";
			
		do_sql (mysql, proceed_add_team1,"")
		write_modal ("Please wait while team is added");
		return; 
	}
	else
	{
		$('#functions-div').find("*").removeClass("current");
		if (G_content_template=="T-List-Teams-Content")
		{
			$('#list-teams').addClass("current");
		}
	}
}
 
// add team callback after add done 
function proceed_add_team1(response)
{
	write_modal ("Reloading database...");
	G_team_database_data_valid=0;
	load_team_database (proceed_add_team2);
}
 
// add team callback after teams database re-loaded
function proceed_add_team2()
{
	write_modal ("Team " + G_selected_team + " has been added to the database");
	show_modal_close();
	
	$('#functions-div').find("*").removeClass("current");
	
	// if list is on screen then refresh
	if (G_content_template=="T-List-Teams-Content")
	{
		// hide the options
		$("#edit-team" ).hide();
		$("#delete-team" ).hide();
		$("#email-team" ).hide(); 
		$("#text-team" ).hide();
	
		// create the table
		draw_content(TL_list_info_showing);
		
		// set scroll to bottom
		var wtf = $('#content');
    	var height = wtf[0].scrollHeight;
    	wtf.scrollTop(height);
	}
}	 

/*===========*/
/* team info */
/*===========*/
 
function team_code_to_index(team_code)
{ 
	// find team details .. set G_selected_team_index
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
	return iteam;
} 
 
// function to add a paypal field to the modal  
function ppal (n, t1, t2)
{
	t2 = t2.replace(/{SQUOTE}/g, "\\'")
	t2 = t2.replace(/{DQUOTE}/g, '\\"')

	var html = '<p><b>' + t1 + ': </b><span id="aaa' + n + '">' + t2 + '</span>';
	html = html + '<button style="margin-left:10px;margin-bottom:4px" class="btn btn-primary btn-xs" id="bbb' + n + '">';
    html = html + 'Copy to Clipboard</button>'; 
    html = html + '<span style="margin-left:10px;color:red" id="ccc' + n + '"></span></p>'; 
    
	$('#ppalmodal').append(html);
	
	$('#bbb' + n).on("click", function() {copyToClipboard("#aaa" + n, "#ccc" + n) });	    
} 
 
//function to copy to clipboard  
function copyToClipboard (element1, element2)
{
  	var $temp = $("<input>");
  	$("body").append($temp);
  	$temp.val($(element1).text()).select();
  	document.execCommand("copy");
  	$temp.remove();
  	$(element2).text("Done");
	return (-1); 
}
  
// show the process 
function show_process()
{
	clear_and_display_modal();
	
	// enable only close button
	$('#modal-cancel-button').hide();
	$('#modal-proceed-button').hide();

	write_modal ("<b>New Team - Paid on Registration</b>"); 
	write_modal ("1 - Check that money has been received into PayPal");
	write_modal ("2 - Send BCP message .. add BCP event");
	write_modal ("3 - Edit team payment invoice .. No Invoice needed - Paid on registration"); 
	write_modal ("4 - Edit team payment date .. date of registration"); 
	write_modal ("5 - Add team event .. Payment Complete"); 
	write_modal ("6 - Add team event .. Team Status .. Payment complete"); 
	write_modal ("<b>New Team - UnPaid on Registration</b>"); 
	write_modal ("1 - Create and send Paypal invoice .. remember number");
	write_modal (" (remember to add RCRT number)"); 
	write_modal ("2 - Send BCU message .. add BCU event");
	write_modal ("3 - Edit team payment invoice .. BHRMXXXX £YYY"); 
	write_modal ("4 - Add team event .. Paypal Invoice Sent .. BHRMXXXX £YYY "); 
	write_modal ("5 - Add team event .. Team Status .. Awaiting payment"); 
	write_modal ("<b>Team pays by Paypal (notified by email)</b>"); 
	write_modal ("1 - Check that money has been received into PayPal");
	write_modal ("2 - Update team to Paid in WIX"); 
	write_modal ("3 - Export WIX and import into DB"); 
	write_modal ("4 - Send OPC Message .. add OPC event"); 
	write_modal ("5 - Edit team payment invoice .. Add paid by paypal"); 
	write_modal ("6 - Edit team payment date .. date of registration"); 
	write_modal ("7 - Add team event .. Paypal payment received"); 
	write_modal ("8 - Update Team Status - Payment complete"); 
	write_modal ("<b>Team pays by BACS (notified by Charlie)</b>"); 
	write_modal ("1 - Flag Invoice as completed in Paypal");
	write_modal ("2 - Update team to Paid in WIX"); 
	write_modal ("3 - Export WIX and import into DB"); 
	write_modal ("4 - Send OPC Message .. add OPC event"); 
	write_modal ("5 - Edit team payment invoice .. Add paid by BACS"); 
	write_modal ("6 - Edit team payment date .. date of registration"); 
	write_modal ("7 - Add team event .. BACS payment received"); 
	write_modal ("8 - Update Team Status - Payment complete");
	write_modal ("<b>Team pays by Cheque (received in mail)</b>"); 
	write_modal ("1 - Flag Invoice as completed in Paypal");
	write_modal ("2 - Update team to Paid in WIX"); 
	write_modal ("3 - Export WIX and import into DB"); 
	write_modal ("4 - Send OPC Message .. add OPC event"); 
	write_modal ("5 - Edit team payment invoice .. Add paid by Cheque"); 
	write_modal ("6 - Edit team payment date .. date of payment"); 
	write_modal ("7 - Add team event .. BACS payment received"); 
	write_modal ("8 - Update Team Status - Payment complete");
	write_modal ("9 - Pay in cheque .. notify Charlie");
	show_modal_close();  
 } 
  
// get paypal team info  
function paypal_team_info()
{
	G_selected_team_index = team_code_to_index (G_selected_team);

	clear_and_display_modal();
	
	// enable only close button
	$('#modal-cancel-button').hide();
	$('#modal-proceed-button').hide();
	
	// create the element to which results will be attached 
	var text = '<span id="ppalmodal"></span>';
	write_modal (text);
	show_modal_close();
	
	// output the fields
	ppal (1, "Team Code", G_team_database[G_selected_team_index]["Team_Code"]);
	ppal (2, "Email Address", G_team_database[G_selected_team_index]["Email"]);
	ppal (3, "Business Name", G_team_database[G_selected_team_index]["Team_Name"]);
	ppal (4, "First Name", G_team_database[G_selected_team_index]["Team_Captain_First_Name"]);
	ppal (5, "Last Name", G_team_database[G_selected_team_index]["Team_Captain_Last_Name"]);
	ppal (6, "Phone Number", G_team_database[G_selected_team_index]["Tel_Mobile"]);
	
	var address = G_team_database[G_selected_team_index]["Address"].split(",");
	var n = address.length;

	for (var i=0; i<n; i++)
	{
		var x = i+1;
		ppal (7+i, "Address Line " + x.toString().trim(), address[i]);	
	}
	
	var n = address.length;
	
	var postcode = address[n-1].toUpperCase();
	postcode = postcode.replace(/ /g,"");
	postcode = postcode.substring (0,4) + " " + postcode.substring (4); 
	
	ppal (13, "Postcode", postcode);
} 
 
// output team info 
function team_info()
{
	G_selected_team_index = team_code_to_index (G_selected_team);

	clear_and_display_modal();
	
	// enable only close button
	$('#modal-cancel-button').hide();
	$('#modal-proceed-button').hide();
	
	// decode the booking status
	var status;
	var last_event_index = get_last_event_index (G_selected_team);
	
	write_modal ("<b>Status: </b>" + last_event_index);  

	for (var ischema=0; ischema<db_schema.length; ischema++)
	{
		var field = db_schema[ischema][DB_SCHEMA_FIELD_NAME];
		var val = G_team_database[G_selected_team_index][db_schema[ischema][DB_SCHEMA_FIELD_NAME]]
		var difftext, thedate;
		if (db_schema[ischema][DB_SCHEMA_TYPE]==SCHEMA_TYPE_DATE)
		{
			if (val=="0000-00-00 00:00:00")
			{
				difftext = "";
				thedate = "None";
			}
			else
			{
				var a = moment(new Date());
				var b = moment(val.substring(0, 10));
				var diff = a.diff(b, 'days');
				difftext =  diff + " days ago";
	 
				if (diff==0)
				{
					difftext = "Today";
				}
				else if (diff==1)
				{	
					difftext = "Yesterday";
				}
				thedate = mysql_to_dd_mname_yyyy (val);
			}
			val = thedate + " (" + difftext + ")";
		}
		else
		{
			val = val.replace(/{SQUOTE}/g, "\\'")
			val = val.replace(/{DQUOTE}/g, '\\"')
			val = val.replace(/\x0A/gi, ' ');
			val = val.replace(/\x0D/gi, ' ');
		}
		write_modal ("<b>" + field + ": </b>" + val);  
	}
	
	show_modal_close();
}
 
/*====================*/
/* delete single team */
/*====================*/
 
function delete_team()
{
	if (confirm("Are you sure that you want to delete team " + G_selected_team) == true) 
	{
		if (confirm("Are you ABSOLUTELY sure that you want to delete team " + G_selected_team) == true) 
		{
			clear_and_display_modal();
			
			$("#modal-close-button").hide();
			$("#modal-cancel-button").hide();
			$("#modal-proceed-button").hide();
			
			write_modal ("Deleting team " + G_selected_team + "...");
    	 	// construct the SQL Delete command
    		var mysql = "DELETE FROM " + MAIN_DATA_TABLE + " WHERE Team_Code='" + G_selected_team + "';"; 
    	
			do_sql (mysql, proceed_delete_team1,"")
			write_modal ("Please wait for operation to complete");
			return; 	
		} 
	}
}
  
// delete team callback after delete done 
function proceed_delete_team1(response)
{
	write_modal ("Reloading database...");
	G_team_database_data_valid=0;
	load_team_database (proceed_delete_team2);
}

// delete team callback after teams database re-loaded
function proceed_delete_team2()
{
	write_modal ("Team " + G_selected_team + " has been deleted");
	show_modal_close();
	
	// hide the options
	$("#edit-team" ).hide();
	$("#info-team" ).hide();
	$("#paypal-info-team" ).hide();
	$("#delete-team" ).hide();
	$("#email-team" ).hide(); 
	$("#text-team" ).hide(); 

	G_selected_team = "";	

	G_ListTeamsView.render();
}
 
/*===================*/
/* delete all teams  */
/*===================*/

var L_delete_all_teams_team_code;

function delete_all_teams()
{
	if (confirm("Are you sure that you want to delete all listed teams") == true) 
	{
		if (confirm("Are you ABSOLUTELY sure that you want to delete all listed teams") == true) 
		{
			clear_and_display_modal();
			$("#modal-close-button").hide();
			$("#modal-cancel-button").hide();
			$("#modal-proceed-button").hide();
			write_modal ("Please wait while teams are deleted...");

			TL_delete_queue = new Array();
			
			// enqueue all the teams to be deleted
			for (var iteam=0; iteam<TL_teams_in_table.length; iteam++)
			{
				TL_delete_queue.push(TL_teams_in_table[iteam]);	
			}
			var team = TL_delete_queue.shift()
			L_delete_all_teams_team_code = team;
			delete_all_teams_1 ()
		} 
	}
} 

function delete_all_teams_1()
{
	write_modal ("Deleting team " + L_delete_all_teams_team_code);
	var mysql = "DELETE FROM " + MAIN_DATA_TABLE + " WHERE Team_Code='" + L_delete_all_teams_team_code + "';";  
	do_sql (mysql, delete_all_teams_2, "");
}

function delete_all_teams_2(response)
{
	write_modal ("Deleting events for team " + L_delete_all_teams_team_code);
	var mysql = "DELETE FROM RRM_Events WHERE Team_Code='" + L_delete_all_teams_team_code + "';";  
	do_sql (mysql, delete_all_teams_3, "");
}

function delete_all_teams_3(response)
{
	write_modal ("Team data and events for " + L_delete_all_teams_team_code + " deleted...");
	var team = TL_delete_queue.shift()
	if (team!=undefined)
	{
					
		L_delete_all_teams_team_code = team;
		delete_all_teams_1()
	}
	else
	{
		write_modal ("All Teams deleted...reloading database");
		
	
		G_team_database_data_valid=0;
		load_team_database (delete_all_teams_4);
	}
}

function delete_all_teams_4(response)
{
	write_modal ("reloading events");
	L_events_database_valid=0;
	load_events(delete_all_teams_5);
}

function delete_all_teams_5()
{
	show_modal_close();
	
	// hide the options
	$("#edit-team" ).hide();
	$("#paypal-info-team" ).hide();
	$("#delete-team" ).hide();
	$("#email-team" ).hide(); 
	$("#text-team" ).hide(); 

	draw_content(TL_list_info_showing);
}

//=====================// 
//  TEAM ACTIONS VIEW  //
//=====================// 

G_TeamActionsView_Definition = Backbone.View.extend(
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
		setup_view ("U", "T-Events-Record-Functions", "T-Events-Record-Commands", "T-Events-Record-Content");
		G_current_view = this;	

		// set the screen height into the main-content div
		//$("#main-content").css("height", window.outerHeight);
		
		var team_index = team_code_to_index (G_selected_team);
		var state = G_team_database[team_index]["State"];
		$("#record-text-1").text("Current state = " + state);
		$("#record-text-2").text("Current action = " + event_get_action(G_selected_team));
    },
    
    // doCancel  
   	doCancel: function () 
    {	
    	G_ListTeamsView.render();
    },
    
    // dofunction - mouse click entry point  
   	doFunction: function (func) 
    {	
	    alert ("Undecoded Event Record Function " + func);	
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
function events_log1 (response)
{	
	$("#events-loading").hide();
	
	console.log (response);
	
	var L_events= response['data'];
	
	var scolumns = [];
	var acolumn = 0;
	
	acolumn = {name:"DateTime", title: "Date/Time"};  
	scolumns.push (acolumn);
	acolumn = {name:"Event", title: "Event"};  
	scolumns.push (acolumn); 
	acolumn = {name:"Info", title: "Info"};  
	scolumns.push (acolumn); 
	
	var srows = [];
	var arow = 0;
	for (var ievents=0; ievents<L_events.length; ievents++)
	{    	
		var event_date = L_events[ievents]["Date_Time"];
		var a = moment(new Date());
		var b = moment(event_date);
		var diff = a.diff(b, 'days');
		var difftext = diff + " days ago";
		
		if (diff==0)
		{
			difftext = "Today";
		}

		else if (diff==1)
		{
			difftext = "Yesterday";
		}
			
		var s = "arow = {";	 
		s = s + 'DateTime :"' + event_date  + " (" + difftext + ")" + '",'; 
		s = s + 'Event :"' + L_events[ievents]["Event"]  + '",';
		s = s + 'Info :"' + L_events[ievents]["Info"]  + '",'; 
		s = s + "};";
		console.log (s);
		eval (s);
		srows.push (arow);
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
	
	$(".footable-filtering-search").hide();
}	

//=====================// 
//  Send Email view    //
//=====================// 

var SendEmailView_form1;
var SendEmailView_form2;
var SendEmailView_form3;
var SendEmailView_model;

var L_modal_proceed_func;

G_SendEmailView_Definition = Backbone.View.extend(
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
    	var L_proceed_func=null;
    
    	// setup the views into the three main screen areas
		setup_view ("U", "T-Send-Email-Functions", "T-Send-Email-Commands", "T-Send-Email-Content");
		G_current_view = this;	

		// set the screen height into the main-content div
		//$("#main-content").css("height", window.innerHeight);
		
		// create the model
		SendEmailView_model = new Backbone.Model({});

		// create fields
		let myfields1 = [];
		let myfields2 = [];
		let myfields3 = [];
		let myobj;
		
		let iteam = team_code_to_index (G_selected_team);
	
		myobj = {name: "team_code", label: "Team Code", control: "uneditable-input"};
		myfields1.push(myobj);
		SendEmailView_model.set("team_code", G_team_database[iteam]["Team_Code"]);
	
		myobj = {name: "to_email", label: "To Email", control: "input"};
		myfields2.push(myobj);
		SendEmailView_model.set( "to_email", G_team_database[iteam]["Email"]);
		
		//SendEmailView_model.set( "to_email", "ron.bowater@gmail.com");
		
		myobj = {name: "to_name", label: "To Name", control: "input"};
		myfields2.push(myobj);
		SendEmailView_model.set( "to_name", G_team_database[iteam]["Team_Captain_First_Name"] + " " + G_team_database[iteam]["Team_Captain_Last_Name"]);
		
		//SendEmailView_model.set( "to_name", "Ron Bowater");
		
		myobj = {name: "code", label: "Message Code", control: "input"};
		myfields1.push(myobj);
		SendEmailView_model.set( "Code", "");
		
		myobj = {name: "subject", label: "Subject", control: "input"};
		myfields3.push(myobj);
		SendEmailView_model.set( "subject", "Romsey Relay Marathon - 12th May 2019");
		
		let html = "<p>Please enter your email in html here>/p>";
		
		myobj = {name: "content", label: "HTML Content", control: "textarea"};
		myfields3.push(myobj);
		SendEmailView_model.set( "content", html);	
	
		html = '<button type="button" onclick="send_email()" class="btn btn-primary">Send Email</button>';
		html = html + '<button style="margin-left:20px" type="button" onclick="email_check_email()" class="btn btn-primary">Check Email</button>';
		html = html + '<button style="margin-left:20px" type="button" onclick="email_copy_clipboard()" class="btn btn-primary">Copy Clipboard</button>';
		
		let code = SendEmailView_model.get( "Code" );
		if (code!="")
		{
			html = html + '<button style="margin-left:20px" type="button" onclick="email_add_event()" class="btn btn-primary">Add ' + code + ' Event</button>';
		}
		
		SendEmailView_form1 = new Backform.Form({el: "#email-form1", model: SendEmailView_model, fields: myfields1});
		SendEmailView_form1.render();
		
		SendEmailView_form2 = new Backform.Form({el: "#email-form2", model: SendEmailView_model, fields: myfields2});
		SendEmailView_form2.render();
		
		SendEmailView_form3 = new Backform.Form({el: "#email-form3", model: SendEmailView_model, fields: myfields3});
		SendEmailView_form3.render();
		
		$('textarea.form-control').css ("height", 300);
		
		$("#email-button").html(html);
    },
    
    // doCancel  
   	doCancel: function () 
    {	
    	G_ListTeamsView.render();
    },
    
    // dofunction - mouse click entry point  
   	doFunction: function (func) 
    {	
    	// close modal
		if (func=="button-close")
    	{
    		close_modal();
    		return;
    	}
    	
    	// close modal
		if (func=="button-cancel")
    	{
    		close_modal();
    		return;
    	}
    	
    	
    	// modal proceed
		else if (func=="button-proceed")
    	{
    		if (L_modal_proceed_func!=null) L_modal_proceed_func();
    	}
    	
    	// undecoded function
    	else
    	{
	    	alert ("Undecoded Send Email Function " + func);	
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

function get_substituted_content()
{
	let iteam = team_code_to_index (G_selected_team);

	let content  = SendEmailView_model.get( "content" );	
	
	content = content.replace(/{{ FIRSTNAME }}/g, G_team_database[iteam]["Ordered_By_First_Name"]);
	content = content.replace(/{{ LASTNAME }}/g, G_team_database[iteam]["Ordered_By_Last_Name"]);
	
	content = content.replace(/{{ TEAMNAME }}/g, G_team_database[iteam]["Team_Name"]);
	content = content.replace(/{{ TEAMCODE }}/g, G_team_database[iteam]["Team_Code"]);
	
	content = content.replace(/\n/g,  "<br>")
	content = content.replace(/{DQUOTE}/g,  '"')
	content = content.replace(/{SQUOTE}/g,  "'")
	content = content.replace(/{POUND}/g,  "£")
	content = content.replace(/\{DOLLAR}/g, "$");
	
	return content;
}

// send formatted mail to screen
function email_check_email()
{
	let iteam = team_code_to_index (G_selected_team);
	let content = get_substituted_content();
	content = content.replace(/<p>/g,  '<p style="padding:0px">')
	$("#formatted-html").html(content);
}
   
// copy clipboard to fields
function email_copy_clipboard()
{
	SendEmailView_model.set( "subject", G_clipboard_msg_subject);	
	SendEmailView_model.set( "content", G_clipboard_msg_html);
	SendEmailView_model.set( "code", G_clipboard_msg_code);	
	SendEmailView_form1.render();
	SendEmailView_form2.render();
	SendEmailView_form3.render();
	
	// substitute special characters	
	let content = G_clipboard_msg_html;
	content = content.replace(/{DQUOTE}/g,  '"')
	content = content.replace(/{SQUOTE}/g,  "'")
	content = content.replace(/{POUND}/g,  "£")
	content = content.replace(/\{DOLLAR}/g, "$");
	
	SendEmailView_model.set( "content",  content );
	$('textarea.form-control').css ("height", 300);
	
	let html = '<button type="button" onclick="send_email()" class="btn btn-primary">Send Email</button>';
	html = html + '<button style="margin-left:20px" type="button" onclick="email_check_email()" class="btn btn-primary">Check Email</button>';
	html = html + '<button style="margin-left:20px" type="button" onclick="email_copy_clipboard()" class="btn btn-primary">Copy Clipboard</button>';
	
	let code = SendEmailView_model.get( "code" );
	if (code!="")
	{
		var s = "email_add_event('" + code + "')"
		html = html + '<button style="margin-left:20px" type="button" onclick=' + s + ' class="btn btn-primary">Add ' + code + ' Event</button>';
	}
	
	$("#email-button").html(html);
}

// send email
function send_email ()
{
	// modal update
	clear_and_display_modal();
	$("#modal-cancel-button").show();
	$("#modal-close-button").hide();
	$("#modal-proceed-button").show();
	write_modal ("Click Proceed to send email or cancel");
	L_modal_proceed_func = send_email_1	
}

// send email after proceed button pressed
function send_email_1 ()
{
	let content = get_substituted_content();	

	// substitute special characters	
	content = content.replace(/"/g,  "{DQUOTE}")
	content = content.replace(/'/g,  "{SQUOTE}")
	content = content.replace(/£/g,  "{POUND}")
	content = content.replace(/\$/g, "{DOLLAR}");

 	// setup array values for send	
	var L_send_name_values = new Array();
    L_send_name_values.push(
    {
    	Parm_email_sms			: "email",
    	Parm_html_text			: "html",
    	Parm_sib_server		    : "sib",
    	Parm_simple_templated	: "templated",
    	
        Parm_email_to_address   : SendEmailView_model.get( "to_email" ),
        Parm_email_to_name      : SendEmailView_model.get( "to_name" ),
        Parm_email_from_address : "Info@romseymarathon.co.uk",
        Parm_email_from_name    : "Romsey Marathon",
        Parm_email_cc_address	: "",
        Parm_email_cc_name		: "",
        Parm_email_bcc_address  : "Info@romseymarathon.co.uk",
        Parm_email_bcc_name	    : "Romsey Marathon Admin",
        Parm_email_subject      : SendEmailView_model.get( "subject" ),
        Parm_msg_body           : content
    });
    
   	// send generic message
    send_generic_message (L_send_name_values, send_email_callback);
    
    $("#modal-proceed-button").hide();
	$("#modal-cancel-button").hide();
	$("#modal-close-button").show();
	write_modal ("Email sent .. click close to continue");
	write_modal ("Remember to add BCU/BCP etc message event if appropriate");
	show_modal_close();
}

function send_email_callback ()
{
	return
}

// add event for this message
function email_add_event(code)
{
	clear_and_display_modal();
	
	$("#modal-cancel-button").hide();
	$("#modal-close-button").hide();
	$("#modal-proceed-button").hide();

	
	var event; 
	var event_text;
	if (code=="BCU")
	{
		event = EVENT_BCU_MESSAGE_SENT;
		event_text = "BCU Message Sent";
	}
	else if (code=="BCP")
	{
		event = EVENT_BCP_MESSAGE_SENT;
		event_text = "BCP Message Sent";
	}	 
	else if (code=="OPC")
	{
		event = EVENT_OPC_MESSAGE_SENT;
		event_text = "OPC Message Sent";
	}	 
	else
	{
		write_modal ("Cannot add to log ... no corresponding event");
		show_modal_close();
		return;
	}

	write_modal ("Adding " + code + " event to log");
	
	add_event (get_current_sql_date(), G_selected_team, event, event_text)
	process_events_queue(email_add_event_1);	
}

function email_add_event_1()
{
	show_modal_close();
}