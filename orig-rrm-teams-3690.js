"use strict";
 
var L_info_group1_columns;
var L_info_group2_columns;
var L_info_group3_columns;
var L_info_group4_columns;
var L_info_group5_columns;
var L_info_status_columns;

var L_info_group1_rows;
var L_info_group2_rows;
var L_info_group3_rows; 
var L_info_group4_rows;
var L_info_group5_rows;
var L_info_status_rows;

var L_filter_options_showing;

var L_teams_in_table;

var L_call_show;
var L_turn_on_filter;
var L_turn_off_filter;

var L_delete_queue;
var L_message_queue;
var L_timer_var;
var L_timerxx;
var L_timer_count;

var L_teams_last_selected_team;

function rrm_teams_init ()
{
	L_teams_last_selected_team = "";
}

//=============================================================
//   TEAM FUNCTIONS VIEW 
//=============================================================

G_TeamsView_Definition = Backbone.View.extend(
{
    // initialization
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
    	// set the screen height into the main-content div
		//$("#main-content").css("height", window.innerHeight);
    	
    	// setup the view
    	setup_view ("T-Team-Functions", "T-Team-Commands", "T-Team-Content"); 
    	
    	// set filter active/inactive
    	var filter_active = 0;	
		for (var ifilter=0; ifilter<db_filter.length; ifilter++)
		{
			if (db_filter[ifilter][DB_FILTER_VALUE]!="")
			{
				filter_active = 1;
				break;
			}	
		}
		if (filter_active==1)
		{
			 $("#filter-teams").html("Filter Teams (Active)");
		}
		else
		{
			 $("#filter-teams").html("Filter Teams (Inactive)");
		}   
		
    },
    
    // doCancel  
   	doCancel: function () 
    {	
    	Xreturn();
    },
    
    // dofunction - mouse click entry point  
   	doFunction: function (func) 
    {
    	// import teams
    	if (func=="import-teams")
    	{
			Xcall(G_ImportTeamsView);
		}	
		
		// sync teams
		else if (func=="sync-teams")
    	{
			Xcall(G_SyncTeamsView); 
		}
		
		// export teams
		else if (func=="export-teams")
    	{
			Xcall(G_ExportTeamsView); 
		}
		
		// team actions
		else if (func=="team-actions")
    	{
			Xcall(G_TeamActionsView); 
		}
				
		// list teams  
		else if (func=="list-teams")
    	{
    		// status display default
    		G_list_info_on_screen = 0;
    		Xcall(G_ListTeamsView)
		} 
		
		/*
		// text team
		else if (func=="text-team")
    	{
			 G_SendTextView.render();
		}	
		*/
	
    	else			
    	{
	    	alert ("Undecoded Teams Function " + func);	
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

//=============================================================
//   LIST TEAMS VIEW 
//=============================================================

G_ListTeamsView_Definition = Backbone.View.extend(
{
    // initialization
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
    	// setup the view
    	setup_view ("T-List-Teams-Functions", "T-List-Team-No-Selected-Commands", "T-List-Teams-Content"); 
    
    	// set the screen height into the main-content div
		var width = G_content_width;
		$("#content").css("width", width-230);

		// create the table
    	create_team_table();
		
    	L_filter_options_showing = false; 	
		$('#filter-settings').hide();
		$('#filter-header').html(" to enable and show filter options")
 
    	// show group 
    	show_list_group(G_list_info_on_screen);
    	
    	L_call_show = 0;
    	L_turn_on_filter = 0;
    	L_turn_off_filter = 0;
    	  	
    	for (var ifilter=0; ifilter<db_filter.length; ifilter++)
 		{
			db_filter[ifilter][DB_FILTER_VALUE] = "";
		}

		// start the timer
		start_timer();	
    },
    
    // doCancel  
   	doCancel: function () 
    {	
    	stop_timer();
    	Xreturn();
    },
    
    // dofunction - mouse click entry point  
   	doFunction: function (func) 
    {	
		// add team
		if (func=="add-team")
    	{
			add_team();
		}
			
		// delete team
		else if (func=="delete-team")
    	{
			delete_team();
		}	
		// list teams status
		else if (func=="list-teams-status")  
		{
			show_list_group(0);	
		}
	
		// list teams group 1
		else if (func=="list-teams-group-1")  
		{
			show_list_group(1);	
		}
		
		// list teams group 2
		else if (func=="list-teams-group-2")  
		{
			show_list_group(2);	
		}
		
		// list teams group 3
		else if (func=="list-teams-group-3")  
		{
			show_list_group(3);	
		}
		
		// list teams group 4
		else if (func=="list-teams-group-4")  
		{
			show_list_group(4);	
		}
		
		// list teams group 4
		else if (func=="list-teams-group-5")  
		{
			show_list_group(5);	
		}
		
		// edit team
		else if (func=="edit-team")
    	{
    		stop_timer();
			Xcall(G_EditTeamView);	
		}	
		
		// email team
		else if (func=="msg-team")
    	{	
    		stop_timer();
			Xcall(G_SendMsgView);
		}	
		
		// message all teams
		else if (func=="msg-all-teams")
    	{
    		stop_timer();
			Xcall(G_MsgMultTeamsView);
		}	

		// events team
		else if (func=="log-team")
    	{
    		stop_timer();
			Xcall(G_EventsLogView);
		}	
		
		// delete all teams
		else if (func=="delete-all-teams")
    	{
			delete_all_teams();
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

// start the timer
function start_timer()
{ 
	return;
	L_timer_var = -1;
	L_timer_var = setTimeout (timer_handler, 1000);
	L_timer_count = 0;
}

// stop the timer
function stop_timer()
{ 
	return;
	if (L_timer_var!=-1) 
	{
		clearTimeout(L_timer_var);
		L_timer_var = -1;
	}
}

// timer handler
function timer_handler()
{
	console.log ("listTimer " + L_timer_count);
	L_timer_count = L_timer_count + 1;
	L_timer_var = -1;
	
	/*
	if (L_call_show==1)
	{
		L_call_show = 0;
		show_list_group (1);
	}
	get_footable_teams();
	*/
	L_timer_var = setTimeout (timer_handler, 1000);
}

// show team list group 
function show_list_group(n)
{
	$('#team-table').empty();	
	
	// remember which group we have on the screen
	G_list_info_on_screen = n;
	
	// process turn on filter
	if (L_turn_on_filter==1)
	{
		L_turn_on_filter = 0;
		L_filter_options_showing = true;
		$('#filter-settings').show();
		$('#filter-header').html(" to disable and hide filter options");
	}
	
	// process turn off filter
	if (L_turn_off_filter==1)
	{
		L_turn_off_filter = 0;
		$('#filter-settings').hide();
		$('#filter-header').html(" to enable and show filter options")
		for (var ifilter=0; ifilter<db_filter.length; ifilter++)
		{
			db_filter[ifilter][DB_FILTER_VALUE] = "";
		}
	}

	// create the table
	create_team_table();

	// per group setup
	var color0 = "#aaa";
	var color1 = "#aaa";
	var color2 = "#aaa";
	var color3 = "#aaa";
	var color4 = "#aaa";
	var color5 = "#aaa";

	switch (n)
	{
		case 0:
			var cols = L_info_status_columns;
			var rows = L_info_status_rows;
			var color0 = "#fff";
			break;
		case 1:
			var cols = L_info_group1_columns;
			var rows = L_info_group1_rows;
			var color1 = "#fff";
			break;
		case 2:
			var cols = L_info_group2_columns;
			var rows = L_info_group2_rows;
			var color2 = "#fff";
			break;
		case 3:
			var cols = L_info_group3_columns;
			var rows = L_info_group3_rows;
			var color3 = "#fff";

			break;
		case 4:
			var cols = L_info_group4_columns;
			var rows = L_info_group4_rows;
			var color4 = "#fff";
			break;
		case 5:
			var cols = L_info_group5_columns;
			var rows = L_info_group5_rows;
			var color5 = "#fff";						
			break;
		default:
			alert ("default in show_list_group");
			break;	
	}
	
	// output the foo table
	jQuery(function($)
	{
		$('#team-table').footable(
		{
			"paging": {"size": 20},
			"toggleColumn": "first",
			"sorting": {"enabled": true},
			"columns": cols,
			"rows": rows
		});
	});	
	
	// highlight group menu item 
	$("#list-teams-status").css("color", color0);
	$("#list-teams-group-1").css("color", color1);
	$("#list-teams-group-2").css("color", color2);
	$("#list-teams-group-3").css("color", color3);	
	$("#list-teams-group-4").css("color", color4);	
	$("#list-teams-group-5").css("color", color5);
	
	// create and output filter radio buttons
	var html = "";
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
 	html = html + "<br class='clear' />";
	$("#filter-fieldset").html (html);

	// if we have a selected team, set to aqua
	if (G_selected_team!="")
	{
		set_table_row (G_selected_team, 'aqua');
	}

	// trigger on click in a row for single team
	$('#team-table').find('tr').click( function()
	{
		G_selected_team = $(this).find('td:first').text();
		
		// if we had a last selected team, set it to white
		if (L_teams_last_selected_team!="")
		{
			set_table_row(L_teams_last_selected_team, 'white');
			L_teams_last_selected_team = "";	
		}
		
		// if we have a new selected team, set it to aqua
		if (G_selected_team!="")
		{
			set_table_row(G_selected_team, 'aqua');
			L_teams_last_selected_team = G_selected_team;	
		}
		
		show_edit_delete_buttons();	
	});

	// trigger on hide or show filter clicked
	$('#click-team-filter').click(function()
	{
		console.log ("click team filter");
		if (L_turn_on_filter==1) return;
		if (L_turn_off_filter==1) return;
		console.log ("aaa");
		
		// show filter options if not currently on the screen
		if (L_filter_options_showing==false)
		{
			L_filter_options_showing = true;
			L_turn_on_filter = 1;
			L_call_show = 1;
		}
		
		// else turn off filter
		else
		{
			L_filter_options_showing = false;
			L_turn_off_filter = 1;
			L_call_show = 1;
		}
		console.log ("bbb");

	});
	
	// trigger on filter setting changed
	$('#filter-settings').change (function()
	{
		console.log("filter change");
		build_filter();
		L_call_show = 1;
	});
	
	// trigger on screen redraw
	$("#team-table").on("postdraw.ft.table", function (e, ft, row) 
	{
		// need to allow the table to be redrawn before reading it
		L_timerxx = setTimeout(get_footable_teams, 1);	
	});	
	
	// enable click events
	document.getElementById('click-team-filter').style.pointerEvents = 'auto';
	
	// scan the table first time round
	get_footable_teams();
}

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

// get a list of all teams in the foo table
function get_footable_teams()
{
	L_teams_in_table=[];
    $('#listing-header').html(" Processing...")
    
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
        		L_teams_in_table.push($(this).text());
        		return false;
        	}
        });
    });
    
    // if we have one item and it is No Results then we actually have no results
    if ((L_teams_in_table.length==1) && (L_teams_in_table[0]=="No results"))
	{
    	L_teams_in_table = [];
    }
    
    $('#listing-header').html(" " + L_teams_in_table.length + " teams in table")
    
    if (L_teams_in_table.length==0)
    {
    	setup_view ("", "T-List-Team-No-Selected-Commands", "");
    }
    else
    {
    	setup_view ("", "T-List-Team-All-Selected-Commands", "");
    	if (L_teams_in_table.length==1)
    	{
    		setup_view ("", "T-List-Team-Single-Selected-Commands", ""); 
		
			G_selected_team = L_teams_in_table[0];
			$("#edit-team" ).html("Edit Team " + G_selected_team);
			$("#delete-team" ).html("Delete Team " + G_selected_team); 
			$("#msg-team" ).html("Message Team " + G_selected_team); 
			$("#log-team" ).html("View Log for Team " + G_selected_team); 	
		}
		else /* more than one team in the table */
		{
		   	if (G_selected_team!="")
		   	{
		   		setup_view ("", "T-List-Team-Single-Selected-Commands", ""); 
		   		
		   		$("#edit-team" ).html("Edit Team " + G_selected_team);
				$("#delete-team" ).html("Delete Team " + G_selected_team); 
				$("#msg-team" ).html("Message Team " + G_selected_team); 
				$("#log-team" ).html("View Log for Team " + G_selected_team); 	
		   	}
		   	else
		   	{
		   		$("#delete-all-teams" ).html("Delete all " + L_teams_in_table.length + " listed teams"); 
		   		$("#msg-all-teams" ).html("Message all " + L_teams_in_table.length + " listed teams");
		   	}	 
		}

    }  
}

// create team table
function create_team_table()
{
	//  fill the columns
	L_info_group1_columns=[];
	L_info_group2_columns=[];
	L_info_group3_columns=[];
	L_info_group4_columns=[];
	L_info_group5_columns=[];
	
	// columns ... do for all items in schema i.e. all database fields
	for (var ischema=0; ischema<db_schema.length; ischema++)
	{
		var acolumn = {name:db_schema[ischema][DB_SCHEMA_FIELD_NAME], title:db_schema[ischema][DB_SCHEMA_FIELD_NAME].replace(/_/g, " ")};  
		if (db_schema[ischema][DB_SCHEMA_LIST_IN_ALL_SETS] == true) 
		{
			L_info_group1_columns.push (acolumn);	
			L_info_group2_columns.push (acolumn);
			L_info_group3_columns.push (acolumn);
			L_info_group4_columns.push (acolumn);
			L_info_group5_columns.push (acolumn);
		}
		else if (db_schema[ischema][DB_SCHEMA_SET]==1) L_info_group1_columns.push (acolumn);
		else if (db_schema[ischema][DB_SCHEMA_SET]==2) L_info_group2_columns.push (acolumn);
		else if (db_schema[ischema][DB_SCHEMA_SET]==3) L_info_group3_columns.push (acolumn);
		else if (db_schema[ischema][DB_SCHEMA_SET]==4) L_info_group4_columns.push (acolumn);
		else if (db_schema[ischema][DB_SCHEMA_SET]==5) L_info_group5_columns.push (acolumn);
	}

	// columns for status display	
	L_info_status_columns=[];
	var code = "Team_Code";
	var acolumn = {name: code, title: "Team Code"};
	L_info_status_columns.push (acolumn);
	
	var status = "Special_Status";  
	var acolumn = {name: status, title: "Special Status"};  
	L_info_status_columns.push (acolumn);	
	
	var status = "Grouping";  
	var acolumn = {name: status, title: "Grouping"};  
	L_info_status_columns.push (acolumn);	

	var status = "Booking_Status";  
	var acolumn = {name: status, title: "Booking Status"};  
	L_info_status_columns.push (acolumn);	
	
	// now do the rows (one per row in database i.e. team) 
	L_info_group1_rows = [];
	L_info_group2_rows = [];
	L_info_group3_rows = [];
	L_info_group4_rows = [];
	L_info_group5_rows = [];
	L_info_status_rows = [];

	// loop for all database rows i.e. registered teams
	for (var iteam=0; iteam<G_team_database.length; iteam++)
	{ 
		// do filter matching
		var filter_in = 1;  
		for (var ifilter=0; ifilter<db_filter.length; ifilter++)
 		{
			if (db_filter[ifilter][DB_FILTER_VALUE]!="")
			{
				var val = G_team_database[iteam][db_filter[ifilter][DB_FILTER_FIELD_NAME]];
				if (val!=db_filter[ifilter][DB_FILTER_VALUE]) 
				{
					filter_in = 0;
				}
			}
		}
		
		// process row if not filtered out
		if (filter_in==1)
		{
			var arow1 = {};
			var arow2 = {};
			var arow3 = {};
			var arow4 = {};
			var arow5 = {};
			
			var thedate="";
			var difftext="";
		
			// all schema (columns)
			for (var ischema=0; ischema<db_schema.length; ischema++)
			{
				var val = G_team_database[iteam][db_schema[ischema][DB_SCHEMA_FIELD_NAME]];
				
				if (typeof val!="string") 
				{
					alert ("val type != string");
					return;
				}

				if (db_schema[ischema][DB_SCHEMA_TYPE]=="DATE")
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
						difftext = "-" + diff;
			 
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
			  
					var obj = {};
					if (difftext=="")
					{
						var s = 'obj = {' + db_schema[ischema][DB_SCHEMA_FIELD_NAME] + ':"' + thedate + '"};';
					}
					else
					{
						var s = 'obj = {' + db_schema[ischema][DB_SCHEMA_FIELD_NAME] + ':"' + thedate + ' (' + difftext + ')"};';
					}
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
				if (db_schema[ischema][DB_SCHEMA_LIST_IN_ALL_SETS]==true) 
				{
					$.extend(arow1, obj);	
					$.extend(arow2, obj);
					$.extend(arow3, obj);
					$.extend(arow4, obj);
					$.extend(arow5, obj);
				}
				else if (db_schema[ischema][DB_SCHEMA_SET]==1) $.extend(arow1, obj );
				else if (db_schema[ischema][DB_SCHEMA_SET]==2) $.extend(arow2, obj );
				else if (db_schema[ischema][DB_SCHEMA_SET]==3) $.extend(arow3, obj );
				else if (db_schema[ischema][DB_SCHEMA_SET]==4) $.extend(arow4, obj );
				else if (db_schema[ischema][DB_SCHEMA_SET]==5) $.extend(arow5, obj );

			} // for all columns in schema

			// status display columns
			var astatusrow = {};	
			var val = G_team_database[iteam]["Team_Code"];
			var s = 'obj = {' + "Team_Code" + ':"' + val + '"};';
			eval (s);	
			$.extend(astatusrow, obj);
			
			// decode the booking status
			switch (G_team_database[iteam]["Booking_State"])
			{
				case BSTATE_BOOKED_UNPAID_NO_MSG:  status = "<span style='color:red'>ACTION:</span> Booked without PayPal payment .. please send BCU message"; break;
				case BSTATE_BOOKED_PAID_PAYPAL_NO_MSG:  status = "<span style='color:red'>ACTION:</span> Booked with PayPal payment .. please send BCP message"; break;
				case BSTATE_BOOKED_UNPAID_BCU_SENT:  status = "AWAITING PAYMENT: Booked without PayPal payment, BCU sent"; break;
				case BSTATE_BOOKED_PAID_PAYPAL_BCP_SENT: status = "PAID: Booked with PayPal payment, BCP sent"; break;
				case BSTATE_BOOKED_UNPAID_BCU_SENT_PAID_OFFLINE: status = "<span style='color:red'>ACTION:</span> Booked without PayPal payment, BCU Sent, Paid Offline, please send OPC message"; break;
				case BSTATE_BOOKED_UNPAID_BCU_SENT_PAID_OFFLINE_OPC_SENT: status = "PAID: Booked without PayPal payment, BCU sent, Paid Offline, OPC sent"; break;
				default: status = "Invalid Booking State " + G_team_database[iteam]["Booking_State"]; break;
			}
			
			var grouping = "-";
			if ( G_team_database[iteam]["Grouping"]!='0')
			{
				if (G_team_database[iteam]["Grouping"]==G_team_database[iteam]["Team_Code"])
				{
					grouping = "Group (First)"
				}
				else
				{
					grouping = "Group " + G_team_database[iteam]["Grouping"];
				}
			}
			
			var s = 'obj = {' + "Booking_Status" + ':"' + status + '"};';
			eval (s);	
			$.extend(astatusrow, obj);
			
			var s = 'obj = {' + "Grouping" + ':"' + grouping + '"};';
			eval (s);	
			$.extend(astatusrow, obj);
			
			var special_status = G_team_database[iteam]["Special_Status"];
			if (special_status.trim()=="") special_status = "None";
			
			var s = 'obj = {' + "Special_Status" + ':"' +  special_status + '"};';
			eval (s);	
			$.extend(astatusrow, obj);
			
			// put accumulated row to rows array	
			L_info_group1_rows.push (arow1);
			L_info_group2_rows.push (arow2);
			L_info_group3_rows.push (arow3);
			L_info_group4_rows.push (arow4);
			L_info_group5_rows.push (arow5);
			L_info_status_rows.push (astatusrow);
			
		} // if filter in
	} // all database rows
} // function create table
 

function show_edit_delete_buttons()
{
	var n = G_selected_team.indexOf(G_TEAM_CODE_PREFIX);
	if (n!=-1)
	{
		setup_view ("", "T-List-Team-Single-Selected-Commands", ""); 
		
		// add text
		$("#edit-team" ).html("Edit Team " + G_selected_team);
		$("#delete-team" ).html("Delete Team " + G_selected_team); 
		$("#msg-team" ).html("Message Team " + G_selected_team); 
		$("#log-team" ).html("View Log for Team " + G_selected_team); 
	}
	else
	{
		setup_view ("", "T-List-Team-No-Selected-Commands", ""); 
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
		var mysql = "INSERT INTO RRM_2018_Data ("; 
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
					if (db_schema[ischema][DB_SCHEMA_TYPE]=="DATE")
					{
						val = "0000-00-00 00:00:00";
					}
				}
			}
			mysql = mysql + "'" + val + "'";
 		}	
 		mysql = mysql + " )";
			
		do_sql (mysql, proceed_add_team1,"")
		add_event (EVENT_TYPE_ADD_MANUALLY_TO_DB, G_selected_team, "");
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
		show_list_group(G_list_info_on_screen);
		
		// set scroll to bottom
		var wtf = $('#content');
    	var height = wtf[0].scrollHeight;
    	wtf.scrollTop(height);
	}
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
			write_modal ("Deleting team " + G_selected_team + "...");
    	 	// construct the SQL Delete command
    		var mysql = "DELETE FROM RRM_2018_Data WHERE Team_Code='" + G_selected_team + "';"; 
    	
    		add_event (EVENT_TYPE_DELETE_FROM_DB, G_selected_team, "");
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
	$("#delete-team" ).hide();
	$("#email-team" ).hide(); 
	$("#text-team" ).hide(); 

	show_list_group(G_list_info_on_screen);
}
 
/*===================*/
/* delete all teams  */
/*===================*/

function delete_all_teams()
{
	if (confirm("Are you sure that you want to delete all listed teams") == true) 
	{
		if (confirm("Are you ABSOLUTELY sure that you want to delete all listed teams") == true) 
		{
			clear_and_display_modal();
			write_modal ("Please wait while teams are deleted...");

			L_delete_queue = new Array();
			
			// enqueue all the teams to be deleted
			for (var iteam=0; iteam<L_teams_in_table.length; iteam++)
			{
				L_delete_queue.push(L_teams_in_table[iteam]);	
			}
			var team = L_delete_queue.shift()
			delete_all_teams_1(team)
		} 
	}
} 

function delete_all_teams_1(team)
{
	write_modal ("Deleting team " + team);
	var mysql = "DELETE FROM RRM_2018_Data WHERE Team_Code='" + team + "';";  
	do_sql (mysql, delete_all_teams_2, team);
	add_event (EVENT_TYPE_DELETE_FROM_DB, G_selected_team, "Delete All");
}

function delete_all_teams_2(response)
{
	write_modal ("Team " + response['parm'] + " deleted...");
	var team = L_delete_queue.shift()
	if (team!=undefined)
	{
		delete_all_teams_1(team)
	}
	else
	{
		write_modal ("All Teams deleted...reloading database");
		show_modal_close();
	
		G_team_database_data_valid=0;
		load_team_database (delete_all_teams_3);
	}
}

function delete_all_teams_3()
{
	// hide the options
	$("#edit-team" ).hide();
	$("#delete-team" ).hide();
	$("#email-team" ).hide(); 
	$("#text-team" ).hide(); 

	show_list_group(G_list_info_on_screen);
}


	


