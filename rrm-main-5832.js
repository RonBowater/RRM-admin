"use strict";

//=========================   
// Team Main .. prefix=TM 
//=========================

var L_docdata;
var L_teams_processed_num;
var G_selected_view_id;
var G_selected_view_subid;
var G_running_on_gas = false;

/******************************************/
/* Initialization from google apps script */
/******************************************/  
 
function start_gas_admin() 
{ 
	G_running_on_gas = true;
	start_admin_common();
}

/*******************************/
/* Initialization from web app */
/*******************************/  
 
function start_admin() 
{ 
	// get date cookie
	var cookie = getCookie('RRM-Access-Date');
	if (cookie == "") 
	{
		$("#init_msg").html ("Cannot Continue ... Cookie missing");
		return;
	}

	// get parameter
	var parm = decodeStr(window.location.search.slice(1));
	if (parm=="")
	{
		$("#init_msg").html ("Cannot Continue ... parameter missing");
		return;
	}
	
	//******* Startup code checking .. RRM=d.m.y.h.m.s.m=RCRT123

	// extract 3 sections from parm (separated by equals sign)
	var res = parm.split("=");
	
	// res should be of length 3, res[0]=RRM, res[1]=date/time parts, res[2]=team code
	if (res.length!=3)
	{
		$("#init_msg").html ("Cannot Continue ... bad res count");
		return;
	}
	
	// check first 3 chars (RRM)
	var rrmstring=res[0];
	if (rrmstring!="RRM")
	{
		$("#init_msg").html ("Cannot Continue ... invalid res[0]");
		return;
	}
	
	// check date and time .. res[1] should be time codes day, month, fullyear, hour, min, sec
	var datestring = res[1];

	// check date against cookie
	if (datestring!=cookie)
	{
		$("#init_msg").html ("Cannot Continue ... cookie date mismatch");
		return;
	}
	
	// check team code
	var appstring = res[2];
	
	if (appstring.substring(0,7)=="ADMINRW")  
	{
		G_admin_mode = "RW";
		$("#init_msg").html ("Admin Read/Write mode");
	}
	else if (appstring.substring(0,7)=="ADMINRO")  
	{
		G_admin_mode = "RO";
		$("#init_msg").html ("Admin Read Only mode");
		alert ("Warning: admin is in read-only mode\nClick OK to continue");
	}
	
	else 
	{
		$("#init_msg").html ("Cannot Continue ... bad app string");
		return;
	}
	
	G_running_on_gas = false;
	start_admin_common();
}	
	
function start_admin_common ()	
{	
	// do common init
	CommonInit();
	
	G_team_database_data_valid = 0;
	G_settings_valid = 0;

	G_selected_team = "";

	// init all the views
	G_DashboardView = new G_DashboardView_Definition();
	G_DocumentsView = new G_DocumentsView_Definition();
	//G_TeamsView = new G_TeamsView_Definition();
	G_ListTeamsView = new G_ListTeamsView_Definition();
	//G_EditTeamView = new G_EditTeamView_Definition();
	G_EditMsgsView = new G_EditMsgsView_Definition();
	G_EditSingleMsgView = new G_EditSingleMsgView_Definition();
	// G_SendMsgView = new G_SendMsgView_Definition();
	G_TestMsgView = new G_TestMsgView_Definition();
	// G_MsgMultTeamsView = new G_MsgMultTeamsView_Definition();   		
	// G_EditMultTeamsView = new G_EditMultTeamsView_Definition();   		
	G_SettingsView  = new G_SettingsView_Definition();
	G_ExportTeamsView  = new G_ExportTeamsView_Definition();
	G_ImportTeamsView  = new G_ImportTeamsView_Definition();
	G_SyncTeamsView  = new G_SyncTeamsView_Definition();
	G_TeamActionsView  = new G_TeamActionsView_Definition();
	G_CustomFuncsView  = new G_CustomFunctions_Definition();
	G_SendEmailView  = new G_SendEmailView_Definition();
	G_EventsListView  = new G_EventsListView_Definition();
	G_EventEditView  = new G_EventEditView_Definition();
	
	G_current_view = null;

    G_selected_view_id = null;
    G_selected_view_subid = null;

	// call module initializers 
	rrm_msgs_init();
	rrm_teams_init();
	rrm_events_init();	
 
	G_content_width = $("#content-wrapper").outerWidth();
	G_content_height = $("#content-wrapper").outerHeight();
	
	// run the diagnostics
	run_diags();
	
	// load the database
	$("#init_msg" ).html("<h2>Loading database....</h2>");
	load_team_database (init1);
}

// database loaded .. load settings
function init1()
{
	// load the settings
	$("#init_msg" ).html("<h2>Team database loaded .. Loading settings...</h2>");
	load_settings (init3);
};

// settings loaded .. load messages
function init2()
{
	// load the settings
	$("#init_msg" ).html("<h2>Setting loaded .. Loading messages...</h2>");
	load_messages (init3);
};

// message loaded .. load events
function init3()
{
	// load the settings
	$("#init_msg" ).html("<h2>Messages loaded .. Loading events ..</h2>");
	load_events (init4);
};

// all now loaded loaded .. kick off with dashboard
function init4()
{
	$("#init_msg" ).html("<h2events loaded</h2>");
	
	// enable the root nav
	var template = $("#T-root-structure").html();
	$("div.root-div").html(_.template(template,{}));

	// set up the body for the main operation panel
	document.getElementsByTagName('body')[0].style = 		 
	"font-family: Arial, Helvetica, sans-serif;" + 
	"color: #555;" + 
	"background: #ffffff url('https://www.romseymarathon-admin.co.uk/wp-content/plugins/Marathon-Apps/admin/images/bg-body.gif') top left repeat-y;" + 
	"font-size: 12px";

	// render the views and remember none selected
	setup_view ("U", "T-Main-Views", "", "");	
	G_selected_view_id = null;
    G_selected_view_subid = null;

	
	G_DashboardView.render();	 
};

//******************************************************************
// view_change_request gets called when user clicks a view button
//******************************************************************

function view_change_request(func)
{
    // call current view with switch request to check if OK to switch
    if (G_current_view!=null)
    {
       // call switch request function in active view 
       var ret = G_current_view.doFunction("switch_view_request");
       if (ret!="OK_TO_SWITCH") 
       {
          return;
       }	
    }
    
    if (func=="dashboard")
	{
		G_DashboardView.render();
		return;
	}
	
	else if (func=="documents")
	{
		G_DocumentsView.render();
		return;
	}
	
	else if (func=="settings")
	{
		G_SettingsView.render();
		return;
	}
	
	else if (func=="sync-teams")
	{
		G_SyncTeamsView.render();
		return;
	}
	
	else if (func=="list-teams")
	{
		G_ListTeamsView.render();
		return;
	}
	
	else if (func=="export-teams")
	{
		G_ExportTeamsView.render();
		return;
	}
	
	else if (func=="messages")
	{
		G_EditMsgsView.render();
		return;
	}
	
	else if (func=="custom-funcs")
	{
		G_CustomFuncsView.render();
		return;
	}

	else if (func=="edit-overview")
	{
		TE_OverviewView.render();
		return;
	}
	
	else if (func=="your-actions")
	{
		TE_ActionsView.render();
		return;
	}

	if (func=="edit-registration-info")
	{
		TE_DatabaseView.render(GROUP_REGISTRATION_INFO, '#registration-view', "Registration", "", "");
		return;
	}
	
	else if (func=="edit-contact-info")
	{
		TE_DatabaseView.render(GROUP_CONTACT_INFO, '#contact-info-view', "Contact Info", "", "");
		return;
	}
	
	else if (func=="edit-team-info")
	{
		TE_DatabaseView.render(GROUP_TEAM_INFO, '#team-info-view', "Team Info", "", "");
		return;
	}
	
	else if (func=="edit-charity-info")
	{    
		TE_DatabaseView.render(GROUP_CHARITY_INFO, '#charity-info-view', "Charity Info", "", "");
		return;
	}
	
	else if (func=="edit-payment-info")
	{   
		TE_DatabaseView.render(GROUP_PAYMENT_INFO, '#payment-info-view', "Payment Info", "", "");
		return;
	}
	
	else if (func=="edit-runners-info")
	{
		TE_DatabaseView.render(GROUP_RUNNERS_INFO, '#runners-info-view', "Runners Info", "", "");
		return;
	}
	
	else if (func=="team-functions")
	{
		// reset the previous view if any
    	if (G_selected_view_id!=null)
    	{
		   $(G_selected_view_id).addClass('nav-top-item').removeClass('nav-selected-item');
    	}
    	
    	setup_view ("U", "", "T-Commands-Logoff", "T-Team-Functions-Content");	
    	
    	G_current_view = this;
    
    	$("#id-team-functions").addClass('nav-selected-item').removeClass('nav-top-item');
		G_selected_view_id = "#id-team-functions";
    
		return;
	}

	else 
	{
	    alert ("Undecoded view_change function " + func);
	}        
}



//=============================================================
//   DASHBOARD VIEW 
//=============================================================

G_DashboardView_Definition = Backbone.View.extend(
{   
    // initialize
    initialize: function () 
    {
        _.bindAll(this, 'render', 'liquid_done', 'doFunction'); 
        this.on('doFunction', this.doFunction, this);
    }, 
      
    // render   
   	render: function () 
    {		
    	// handle view button
    	if (G_selected_view_id!=null)
    	{
		   $(G_selected_view_id).addClass('nav-top-item').removeClass('nav-selected-item');
    	}
    	$("#id-dashboard").addClass('nav-selected-item').removeClass('nav-top-item');
		G_selected_view_id = "#id-dashboard";

		// calculate days to event
		var newyear = new Date('2019-01-01')
		var today = new Date();
		var race_date = new Date('2019-05-12');
		
		// calculate days to event
		var timeinmilisec = race_date.getTime() - today.getTime();
		var num_days_to_event  = Math.ceil(timeinmilisec / (1000 * 60 * 60 * 24));	
		
		var liquid_vars = [];
		liquid_vars.push
		({
		    title                       : "Booking stats",
		    num_teams                   : G_team_database.length,
			paid_teams                  : G_teams_paid,
			unpaid_teams                : G_teams_unpaid,
			fees_paid                   : G_total_entry_fees,
			last_update_on              : G_info_settings[0]["Last_Update_DateTime"],
			last_update_file            : G_info_settings[0]["Last_Update_Wix_Filename"],
			num_days_to_event           : num_days_to_event,
			status                      : "Booking is OPEN",
			adminmode                   : G_admin_mode,
			adminrw						: get_xxx(ADMIN_TEAM_NUM),
			adminro						: get_xxx(ADMIN_TEAM_NUM_READ_ONLY),
			teamwc						: get_xxx(WILDCARD_TEAM_NUM)
		});
		
		// push callback to liquid variables
		liquid_vars.push (this.liquid_done);
   		
		// setup the views into the three main screen areas using underscore
		G_current_view = this;
		setup_view (liquid_vars, "", "T-Commands-Logoff", "T-Dashboard-Content");			
	},
	
	// come here when liquid has done rendering the screen
	liquid_done ()
	{
		// calculate days to event
		var newyear = new Date('2019-01-01')
		var today = new Date();
		var race_date = new Date('2019-05-12');
		
		// calculate days to event
		var timeinmilisec = race_date.getTime() - today.getTime();
		var num_days_to_event  = Math.ceil(timeinmilisec / (1000 * 60 * 60 * 24));	
		
		// booking days from Jan 1 
		var timeinmilisec = race_date.getTime() - newyear.getTime();
		var booking_days  = Math.ceil(timeinmilisec / (1000 * 60 * 60 * 24));
		
		var yy = new Array(booking_days-num_days_to_event+1);
		var xx = new Array(booking_days+1);

		for (var i=0; i<yy.length; i++)
		{
			yy[i] = 0;
		}
		
		for (var i=0; i<xx.length; i++)
		{
			xx[i] = booking_days-i;
		}
		
		for (var iteam=0; iteam<G_team_database.length; iteam++)
		{
			console.log (G_team_database[iteam]["Order_Date"]);
			var bdate = new Date(mysql_to_dd_mname_yyyy (G_team_database[iteam]["Order_Date"]));
			var timeinmilisec = bdate.getTime() - newyear.getTime();
			var bday  = Math.ceil(timeinmilisec / (1000 * 60 * 60 * 24));
			yy[bday]++;
		}
		
		var y = 0;
		for (var i=0; i<(booking_days-num_days_to_event+1); i++)
		{
			y = y + yy[i];
			yy[i] = y;
		}
		
		// get the data for 2018
		var yy2018 = get_2018_data ();
		
		// draw the chart
		draw_chart(xx,yy,yy2018)
	},
    
    // dofunction - mouse click entry point from content area.. only logoff for dashboard  
   	doFunction: function (func) 
	{	
		// check for view change request 
       	if (func=="switch_view_request")
       	{
       	   	return "OK_TO_SWITCH";
       	}
       
       	// check for logoff request
       	else if (func=="logoff")
       	{
       		// check first before logging off
    	    do_logoff(0);
       	}
       	
       	// else error undecoded function
		else			
		{
			alert ("Undecoded Main Function " + func);	
		}
       	return 1;
    },
    
    // all views need a terminate
    terminate: function()
    {
    	// no action
    },
    
    // remove function to clean up
    remove: function() 
    {
        this.undelegateEvents();
        this.$el.empty();
        this.stopListening();
        return this;
    }
});

//=============================================================
//   DOCUMENTS VIEW 
//=============================================================

G_DocumentsView_Definition = Backbone.View.extend(
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
    	// handle view button
    	if (G_selected_view_id!=null)
    	{
		   $(G_selected_view_id).addClass('nav-top-item').removeClass('nav-selected-item');
    	}
    	$("#id-documents").addClass('nav-selected-item').removeClass('nav-top-item');
		G_selected_view_id = "#id-documents";
   		
		// setup the views into the three main screen areas using underscore
		G_current_view = this;
		setup_view ("U", "", "T-Commands-Logoff", "T-Documents-Content");			
	},
    
    // dofunction - mouse click entry point from content area.. only logoff for dashboard  
   	doFunction: function (func) 
	{	
		// check for view change request 
       	if (func=="switch_view_request")
       	{
       	   	return "OK_TO_SWITCH";
       	}
       
       	// check for logoff request
       	else if (func=="logoff")
       	{
       		// check first before logging off
    	    do_logoff(0);
       	}
       	
       	// else error undecoded function
		else			
		{
			alert ("Undecoded Main Function " + func);	
		}
       	return 1;
    },
    
    // all views need a terminate
    terminate: function()
    {
    	// no action
    },
    
    // remove function to clean up
    remove: function() 
    {
        this.undelegateEvents();
        this.$el.empty();
        this.stopListening();
        return this;
    }
});

//---------------------------------------------------------------------------
// Functions to handle loading of database (team data, settings and messages)
//---------------------------------------------------------------------------

/*
// load settings
function init2()
{
	// load the settings
	$("#init_msg" ).html("<h2>Loading settings</h2>");
	get_settings (init3);
}

// loadmessages
function init3()
{
	// load the settings
	$("#init_msg" ).html("<h2>Loading messages</h2>");
	load_messages (main_4);
}

// continue after all loaded
function main_4()
{	
	$("#div_init_msg").hide();
	
	$("#stat_teams_paid").html(G_teams_paid);		
	$("#stat_teams_unpaid").html(G_teams_unpaid);	
	$("#stat_fees_paid").html("£" + G_total_entry_fees);
	$("#stat_last_update").html(G_info_settings[0]["Last_Update_DateTime"]);
	$("#stat_last_wixfile").html(G_info_settings[0]["Last_Update_Wix_Filename"]);
	$("#stat_no_teams").html (G_team_database.length);
	
	// show the stats
	$("#stats").show();
		
	G_loading_in_progress=0;
}
*/

jQuery.fn.redraw = function() 
{
    return this.hide(0, function() 
    {
        $(this).show();
    });
};

// restore the main command selection menu
function restore_main()
{
	 activate_main();
}

function testing0()
{
	console.log ("testing");
	console.log ("list_teams_email");
	test_function ("items", "values", testing1);
}

function testing1()
{
	console.log ("testing done");
}

// called on logoff request
function logoff ()
{
	// clear the access cookie
	deleteCookie('RRM-Access-Date');	
	
	// call the login app
	location.href = "https://www.romseymarathon-admin.co.uk";
} 	  

//************************************* 
// Function : team_top_level
//************************************* 

function team_top_level()
{
	// enable the main structure
	var template = $("#T-Team").html();
	$("#main-content").html(_.template(template,{}));
}

//************************************* 
// Function : utilities top level
//************************************* 

function utilities()
{
	// enable the main structure
	var template = $("#T-Utilities").html();
	$("#main-content").html(_.template(template,{}));
}

/***********************/
/*  load_team_database */
/***********************/ 
   
var G_load_team_database_callback_save;   
   
function load_team_database (callback)
{
	G_load_team_database_callback_save = callback; 
	if (G_team_database_data_valid==1) 
	{
		G_load_team_database_callback_save();
	}
	else
	{
		// check if running on gas
	    if (G_running_on_gas==true)
	    {
	    	db_select_all ("Team_Data", load_team_database_gas_callback);
	    }
	    
	    // else using SQL server
	    else
	    {    
	    	showPleaseWait('Please wait...Accessing SQL server');
			var mysql = "SELECT * from " + MAIN_DATA_TABLE + " ORDER BY CAST(SUBSTR(Team_Code,5) AS UNSIGNED) ASC";		
			G_xhr = $.ajax(
			{
				dataType: 'json',
				url: '../wp-json/doSQL', 
				data: 
				{
					db_sql : mysql,
					db_key : G_db_access_code, 
					db_parm : "No Parm" 
				}, 
				success: function (response) 
				{	
					hidePleaseWait();
					if (response['success'] == true)
					{
						G_team_database = response['data'];
					    process_team_data ();
						G_load_team_database_callback_save();
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
					hidePleaseWait();
					alert ("Do SQL Error returned");
				}
			});
		}
		return 0;
	}
}

function load_team_database_gas_callback(d)
{
	G_team_database = d;
	G_load_team_database_callback_save();
}

// process team data 
function process_team_data ()
{
	// calculate stats for teams 
	G_teams_paid = 0;
	G_teams_unpaid = 0;
	G_total_entry_fees = 0;
	G_have_runners = 0;

	G_team_code_order_max=0;  
	for (var ix=0; ix<G_team_database.length; ix++)
	{    
		var team_code_order = parseInt(G_team_database[ix]["Team_Code"].substring(4));
		if (team_code_order>G_team_code_order_max)
		{
			 G_team_code_order_max = team_code_order;
		}

		if (G_team_database[ix]["Payment_Status"]=="Paid")
		{
			G_teams_paid++;	
			var price = G_team_database[ix]["Ticket_Price"];
			price = price.replace('£', '');
			G_total_entry_fees += parseInt(price);
		}
		else
		{
			G_teams_unpaid++;	
		}

		if (G_team_database[ix]["Runner1"]!="None")
		{
			G_have_runners = G_have_runners + 1;
		}
	}

	// set database valid and do callback
	G_team_database_data_valid = 1;
}


function get_2018_data ()
{
	var dates_2018 = [
	 '2018-01-12 00:00:00',			
	 '2018-01-12 00:00:00',			
	 '2018-01-23 00:00:00',			
	 '2018-01-25 00:00:00',			
	 '2018-01-27 00:00:00',			
	 '2018-01-23 00:00:00',			
	 '2018-01-23 00:00:00',			
	 '2018-01-22 00:00:00',	 		
	 '2018-01-21 00:00:00',			
	 '2018-01-21 00:00:00',			
	 '2018-01-21 00:00:00',			
	 '2018-01-21 00:00:00',			
	 '2018-01-17 00:00:00',			
	 '2018-03-22 00:00:00',			
	 '2018-01-17 00:00:00',			
	 '2018-01-15 00:00:00',			
	 '2018-01-12 00:00:00',			
	 '2018-01-12 00:00:00',			
	 '2018-01-30 00:00:00',			
	 '2018-01-30 00:00:00',			
	 '2018-01-31 00:00:00',			
	 '2018-01-31 00:00:00',			
	 '2018-01-31 00:00:00',			
	 '2018-01-31 21:40:41',			
	 '2018-02-01 00:00:00',			
	 '2018-02-04 00:00:00',			
	 '2018-02-04 00:00:00',			
	 '2018-02-04 00:00:00',			
	 '2018-02-08 00:00:00',			
	 '2018-02-08 00:00:00',			
	 '2018-02-08 00:00:00',			
	 '2018-02-08 00:00:00',			
	 '2018-02-08 00:00:00',			
	 '2018-02-08 00:00:00',			
	 '2018-02-08 00:00:00',			
	 '2018-02-08 00:00:00',			
	 '2018-02-08 00:00:00',			
	 '2018-02-08 00:00:00',			
	 '2018-02-08 00:00:00',			
	 '2018-02-07 00:00:00',			
	 '2018-02-08 00:00:00',			
	 '2018-02-06 00:00:00',			
	 '2018-02-06 00:00:00',			
	 '2018-02-06 00:00:00',			
	 '2018-02-05 00:00:00',			
	 '2018-02-05 00:00:00',			
	 '2018-02-10 00:00:00',			
	 '2018-02-10 00:00:00',			
	 '2018-02-10 00:00:00',			
	 '2018-02-10 00:00:00',			
	 '2018-02-11 00:00:00',			
	 '2018-02-12 00:00:00',			
	 '2018-02-13 00:00:00',			
	 '2018-02-13 00:00:00',			
	 '2018-02-15 00:00:00',			
	 '2018-02-17 00:00:00',			
	 '2018-02-20 00:00:00',			
	 '2018-02-20 00:00:00',			
	 '2018-02-20 00:00:00',			
	 '2018-02-21 15:01:25',			
	 '2018-02-22 00:00:00',			
	 '2018-02-22 00:00:00',	 	 	 
	 '2018-02-22 00:00:00',			
	 '2018-02-22 21:46:24',			
	 '2018-02-23 12:51:24',			
	 '2018-02-27 10:50:34',			
	 '2018-02-25 00:00:00',			
	 '2018-02-27 10:14:49',			
	 '2018-02-27 00:00:00',			
	 '2018-02-28 00:00:00',			
	 '2018-02-28 00:00:00',			
	 '2018-02-28 00:00:00',			
	 '2018-02-28 00:00:00',			
	 '2018-03-05 07:08:21',			
	 '2018-03-05 07:08:21',			
	 '2018-03-05 00:00:00',			
	 '2018-03-05 00:00:00',			
	 '2018-03-06 00:00:00',			
	 '2018-03-06 00:00:00',			
	 '2018-03-06 00:00:00',			
	 '2018-03-06 00:00:00',			
	 '2018-03-07 00:00:00',			
	 '2018-03-07 00:00:00',			
	 '2018-03-07 00:00:00',			
	 '2018-03-07 00:00:00',			
	 '2018-03-07 00:00:00',			
	 '2018-03-08 00:00:00',			
	 '2018-03-10 00:00:00',			
	 '2018-03-12 09:50:27',			
	 '2018-03-12 16:08:00',			
	 '2018-03-12 00:00:00',			
	 '2018-03-13 07:29:13',			
	 '2018-03-13 00:00:00',			
	 '2018-03-13 18:06:17',			
	 '2018-03-14 19:05:02',			
	 '2018-03-15 22:44:04',			
	 '2018-03-15 22:44:04',			
	 '2018-03-16 00:00:00',			
	 '2018-03-18 20:25:29',			
	 '2018-03-19 19:16:02',			
	 '2018-03-20 00:00:00',			
	 '2018-03-20 00:00:00',			
	 '2018-03-20 00:00:00',			
	 '2018-03-21 00:00:00',			
	 '2018-03-21 00:00:00',			
	 '2018-03-22 00:00:00',			
	 '2018-03-22 00:00:00',			
	 '2018-03-23 00:00:00',			
	 '2018-03-23 00:00:00',			
	 '2018-03-23 00:00:00',			
	 '2018-03-23 19:44:10',			
	 '2018-03-23 19:44:10',			
	 '2018-03-24 00:00:00',			
	 '2018-03-28 00:00:00',			
	 '2018-03-26 00:00:00',			
	 '2018-03-28 00:00:00',			
	 '2018-03-26 00:00:00',			
	 '2018-03-26 00:00:00',			
	 '2018-03-25 00:00:00',			
	 '2018-03-28 00:00:00',			
	 '2018-03-29 00:00:00',			
	 '2018-03-29 00:00:00',			
	 '2018-03-29 00:00:00',			
	 '2018-03-29 00:00:00',			
	 '2018-03-30 00:00:00',	 	 	 
	 '2018-03-31 00:00:00',			
	 '2018-04-05 00:00:00',			
	 '2018-04-11 18:12:44',			
	 '2018-05-03 00:00:00',			
	 '2018-04-12 00:00:00',			
	 '2018-04-16 00:00:00',			
	 '2018-04-16 00:00:00',			
	 '2018-04-16 00:00:00',			
	 '2018-04-25 00:00:00'			
	];
	
	// calculate days to event
	var newyear = new Date('2018-01-01')
	var today = new Date();
	var race_date = new Date('2018-05-13');
	
	// calculate days to event
	var timeinmilisec = race_date.getTime() - today.getTime();
	var num_days_to_event  = Math.ceil(timeinmilisec / (1000 * 60 * 60 * 24));	
	
	// booking days from Jan 1 
	var timeinmilisec = race_date.getTime() - newyear.getTime();
	var booking_days  = Math.ceil(timeinmilisec / (1000 * 60 * 60 * 24));
	
	var yy = new Array(booking_days-num_days_to_event+1);
	var xx = new Array(booking_days+1);

	for (var i=0; i<yy.length; i++)
	{
		yy[i] = 0;
		xx[i] = booking_days-i;
	}
	
	for (var ix=0; ix<dates_2018.length; ix++)
	{
		console.log (ix);
		console.log (dates_2018[i]);
		var bdate = new Date(mysql_to_dd_mname_yyyy (dates_2018[ix].toString()));
		var timeinmilisec = bdate.getTime() - newyear.getTime();
		var bday  = Math.ceil(timeinmilisec / (1000 * 60 * 60 * 24));
		yy[bday]++;
	}
	
	var y = 0;
	for (var i=0; i<(booking_days-num_days_to_event+1); i++)
	{
		y = y + yy[i];
		yy[i] = y;
	}
	return yy	
}

function draw_chart(xx,yy,yy2018)
{
		new Chart(document.getElementById("myChart"), 
		{
  			type: 'line',
  			data: {
    			labels: xx,
    			datasets: [
    			{ 
        			data: yy,
        			label: "2019",
			        borderColor: "blue",
        			fill: false
      			},
      			{ 
        			data: yy2018,
        			label: "2018",
			        borderColor: "green",
        			fill: false
				}
      			]
  			},
  			options: 
  			{
				scales: {
					yAxes: 
					[{
						ticks: 
						{
							min: 0,
							max: 150,
							stepSize: 10
						 },
						 scaleLabel: 
						 {
            				display: true,
            				labelString: 'Number of Teams'
         				 }
					}],
					xAxes: 
					[{
						 scaleLabel: 
						 {
            				display: true,
            				labelString: 'Days to Race Day'
         				 }
					}]
					
				},
    			title: 
    			{
      				display: true,
      				text: 'Booking for Romsey Relay Marathon'
    			}
  			}
		});
}
