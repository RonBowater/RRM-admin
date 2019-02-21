"use strict";
   
//=========================   
// Team Edit .. prefix=TE 
//=========================
   
var TE_DatabaseView; 
var TE_DatabaseView_Definition;

var TE_content_width;
var TE_content_height;

var TE_team_code;

var TE_team_data;
var TE_called_from_admin;

var TE_thegroup;

var TE_last_anychange;

var TE_dummy_schema = 
[	
];      
            
/******************/
/* Initialization */
/******************/  

// enter here when called from admin
function TE_start_team_app (teamcode)
{
	TE_team_code = teamcode;
	TE_called_from_admin = true;
	TE_team_code = teamcode;
		
	// do common init	
	CommonInit();

	// load the for this team
	var mysql = "SELECT * from " + MAIN_DATA_TABLE + " WHERE Team_Code='" + TE_team_code + "';";
	do_sql (mysql, TE_setup_continue, "")
}

// continue here after team data has loaded
function TE_setup_continue (response)
{
	if (response.data.length==0)
	{
		$("#init_msg").html ("Null response from database");
		return;
	}
	
	TE_team_data = response.data[0];

	// create views
   	TE_DatabaseView = new TE_DatabaseView_Definition();
   	
   	// set up the body for the main operation panel
	document.getElementsByTagName('body')[0].style = 		 
	"font-family: Arial, Helvetica, sans-serif;" + 
	"color: #555;" + 
	"background: #f6f6f6 url('../wp-content/plugins/Marathon-Apps/team/images/bg-body.gif') top left repeat-y;" + 
	"font-size: 14px";

	// use underscore to setup html structure
	var template = $("#T-root-structure").html();
	$("div.root-div").html(_.template(template,{}));

	TE_content_width = $("#content-wrapper").outerWidth();
	TE_content_height = $("#content-wrapper").outerHeight();
	
	console.log ("width = " + TE_content_width);
	console.log ("height = " + TE_content_height);
   	
	G_current_view = null; 
	  	
	// login main view
   	TE_DatabaseView.render(GROUP_REGISTRATION_INFO, '#registration-view', "Registration", "", "");
}

//=============================================================
//   Database edit view
//=============================================================

TE_DatabaseView_Definition = Backbone.View.extend (
{   
    // initialize
    initialize: function () 
    {
        _.bindAll(this, 'render', 'render_continue', 'timer_callback', 'doFunction'); 
        this.on('doFunction', this.doFunction, this);
    }, 
      
    // render   
   	render: function (group, viewbutton, text1, text2, text3)
    {
        G_current_view = this;	
		TE_last_anychange = 0;
        TE_thegroup = group;	
        	
   		// setup the views
   		var liquid_vars = [];
		liquid_vars.push
		({
			text1 : "Editing Database for Team " + TE_team_code,
			text2 : text1 + " info for Team " + TE_team_code
		});
		
		// push callback to liquid variables
		liquid_vars.push (this.render_continue);
		setup_view (liquid_vars, "TE-Common-Views", "T-Commands-Return", "TE-Generic-Content");	
	
	    // push callback to liquid variables
		liquid_vars.push (this.render_continue);
   		
	    // set the view as current selected view
		$(viewbutton).addClass('nav-selected-item').removeClass('nav-top-item');
    },

    // render continue after liquid has rendered the content   
   	render_continue: function () 
    {
        G_current_view = this;
    
    	// build the VAREDIT array
    	VAREDIT_ctl = [];
		for (var ischema=0; ischema<db_schema.length; ischema++)
		{
			if (db_schema[ischema][DB_SCHEMA_GROUP]==TE_thegroup)
			{
				var element = [];
			
				element[VAREDIT_DBNAME] = db_schema[ischema][DB_SCHEMA_FIELD_NAME];
				element[VAREDIT_DISPLAY_NAME] = db_schema[ischema][DB_SCHEMA_FIELD_NAME];
				element[VAREDIT_COLUMN] = db_schema[ischema][DB_SCHEMA_VAREDIT_COLUMN];
				element[VAREDIT_ORIG_VALUE]=TE_team_data[db_schema[ischema][DB_SCHEMA_FIELD_NAME]];
				element[VAREDIT_TYPE]=db_schema[ischema][DB_SCHEMA_TYPE];
				if (db_schema[ischema][DB_SCHEMA_ADMIN_HIDE_PROTECT].indexOf("P")!=-1)
				{
					element[VAREDIT_TYPE]=VAREDIT_TYPE_PROT;
				}
				element[VAREDIT_CHANGED_FLAG]=false;
				VAREDIT_ctl.push (element)	
			}
		}
		
        // create the structure which drives the variable editing
        /*
        VAREDIT_ctl = [];
		for (var ivar=0; ivar<TE_theschema.length; ivar++)
		{
		    var element = [];
		    
		    element[VAREDIT_DBNAME] = TE_theschema[ivar][TE_SCHEMA_DBNAME]
		    element[VAREDIT_DISPLAY_NAME] = TE_theschema[ivar][TE_SCHEMA_DISPLAY_NAME]
		    element[VAREDIT_COLUMN] = TE_theschema[ivar][TE_SCHEMA_COLUMN]
			element[VAREDIT_ORIG_VALUE]=TE_team_data[TE_theschema[ivar][TE_SCHEMA_DBNAME]];
			element[VAREDIT_TYPE]=TE_theschema[ivar][TE_SCHEMA_TYPE];
			element[VAREDIT_CHANGED_FLAG]=false;
				
			VAREDIT_ctl.push (element)
		}
		*/
                   	
    	// setup the fields from the schema
		VAREDIT_setup_fields (this.timer_callback);
		
		// right click content menu
		$.contextMenu
		({
			selector: '#edit-table', 
			callback: function(key, options, e) 
			{
			
				if (key=="registration_info")
				{
					view_change_request('edit-registration-info')
					return;
				}
				else if (key=="contact_info")
				{
					view_change_request('edit-contact-info')				
					return;
				}
				else if (key=="team_info")
				{
					view_change_request('edit-team-info')	
					return;
				}
				else if (key=="charity_info")
				{
					view_change_request('edit-charity-info')	
					return;
				}
				else if (key=="payment_info")
				{
					view_change_request('edit-payment-info')
					return;
				}
				else if (key=="runners_info")
				{
					view_change_request('edit-runners-info')
					return;
				}
				else if (key=="return")
				{
					view_clickit_function('return')
					return;
				}
			},
			items: 
			{
				"registration_info": {name: "Registration Info"},
				"contact_info": {name: "Contact Info"},
				"team_info": {name: "Team Info"},
				"charity_info": {name: "Charity Info"},
				"payment_info": {name: "Payment Info"},
				"runners_info": {name: "Runners Info"},
				"return": {name: "Return"}

			}        		
		});       
    },
       
    timer_callback: function(anychange)
    {
    	// switch commands menu if any changes
		if (anychange==true)
		{
			if (TE_last_anychange==false)
			{
				setup_view ("U", "", "T-Commands-Return-Restore-Update", "");	
				TE_last_anychange = true;
			}
		}
		else
		{
			if (TE_last_anychange==true)
			{
				setup_view ("U", "", "T-Commands-Return", "");	
				TE_last_anychange = false;
			}
		}
    },   
       
    // dofunction - mouse click entry point  
   	doFunction: function (func) 
    {
    	VAREDIT_stop_timer();
    
        // view gets called if uses has requested a new view 
        if (func=="switch_view_request")
        {
           if (TE_last_anychange==true)
           {
              if (confirm("You have unsaved changes\nDo you wish to continue with view switch")) 
              {
                 return "OK_TO_SWITCH";
              } 
              else 
              {
                return -1;
              }     
           }
           else
           {
              return "OK_TO_SWITCH";
           }
        }
       
        // also gets called if user has requested return
        else if (func=="return")
        {
        	// check for changes
    		if (TE_last_anychange==true)
           	{	 
				if (confirm("You have unsaved changes\nDo you wish to return from edit")) 
				{
					G_team_database_data_valid=0;
					load_team_database (G_ListTeamsView.render);
				} 
				
				// don't want to return ... restart the timer
				else
				{
					VAREDIT_start_timer();	
				}
           	}
           	
           	// else no changes
           	else
           	{
           		G_team_database_data_valid=0;
           		load_team_database (G_ListTeamsView.render);
           	}
       	}
    
    	// handle restore
    	else if (func=="restore")
    	{
    		this.render_continue();
    		return;
    	}
    	
    	// update database
    	else if (func=="update")
    	{
    	    // set up the modal
    	    clear_and_display_modal();
			$("#modal-cancel-button").show();
			$("#modal-proceed-button").show();
    		write_modal ("Are you sure that you want to update the database ?");
    		write_modal ("Please click cancel or proceed");
    		return;
    	}
    	
    	// modal cancel pressed
    	else if (func=="button-cancel")
    	{
    		hide_modal();
    		VAREDIT_start_timer();
    		return;
    	}
    	
    	// modal proceed pressed
    	else if (func=="button-proceed")
    	{
			write_modal ("OK ... Updating database.. ");
    	    var mysql = "UPDATE " + MAIN_DATA_TABLE + " SET "
    	    var first=1;
    	    for (var ivar=0; ivar<VAREDIT_ctl.length; ivar++)
			{
				if (VAREDIT_ctl[ivar][VAREDIT_CHANGED_FLAG]==1)
				{
					if (first==1)
					{
						first = 0;
					}
					else
					{
						mysql = mysql + ", ";
					}
				    mysql = mysql + VAREDIT_ctl[ivar][VAREDIT_DBNAME] + "='" + VAREDIT_ctl[ivar][VAREDIT_NEW_VALUE] + "' ";   
				}
			}
			mysql = mysql + " WHERE Team_Code='" + TE_team_code + "';";
			console.log (mysql);
	        do_sql (mysql, TE_proceed_update1, "");
    		return;
    	}
    	
    	// modal close pressed
    	else if (func=="button-close")
    	{
    		hide_modal();
    		VAREDIT_start_timer();
    		return;
    	}
    	
    	// undecoded function
    	else
    	{
    		alert ("Undecoded function " + func);
    	}
        return 1;
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

// callback after database updated
function TE_proceed_update1()
{
    // load the team data
    write_modal ("OK ... Reloading team data.. ");
	var mysql = "SELECT * from " + MAIN_DATA_TABLE + " WHERE Team_Code='" + TE_team_code + "';";
	do_sql (mysql, TE_proceed_update2, "")
}

// callback after team data reloaded  
function TE_proceed_update2(response)
{
    if (response.data.length==0)
	{
		alert ("ERROR: Null response from database");
		return;
	}
	
	TE_team_data = response.data[0];
	
	hide_modal();
	TE_DatabaseView.render_continue();
}