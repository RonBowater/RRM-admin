"use strict";
 
var L_settings_model; 
var G_timer_var;
var SG_last_anychange;
  
//============================================================= 
//  SETTINGS STUFF 
//=============================================================

G_SettingsView_Definition = Backbone.View.extend(
{   
    // initialize
    initialize: function () 
    {
        _.bindAll(this, 'render', 'doCancel', 'doFunction', 'timer_callback', 'terminate'); 
        this.on('doFunction', this.doFunction, this);
        this.on('escKey', this.doCancel, this);
    }, 
      
    // render   
   	render: function () 
    {
    	// setup views
    	G_current_view = this;
    	setup_view ("U", "T-Main-Views", "T-Commands-Logoff", "T-Settings-Content");
	
    	// handle view button
    	if (G_selected_view_id!=null)
    	{
		   $(G_selected_view_id).addClass('nav-top-item').removeClass('nav-selected-item');
    	}   
		$("#id-settings").addClass('nav-selected-item').removeClass('nav-top-item');
		G_selected_view_id = "#id-settings";

		// set the screen height into the main-content div
		$("#main-content").css("height", window.innerHeight);
		
		SG_last_anychange = 0;
		
		// create the structure which drives the variable editing
        VAREDIT_ctl = [];
		for (var ivar=0; ivar<db_settings.length; ivar++)
		{
		    var element = [];
		    
		    element[VAREDIT_DBNAME] = db_settings[ivar][DB_SETTINGS_DB_NAME];
		    element[VAREDIT_DISPLAY_NAME] = db_settings[ivar][DB_SETTINGS_TITLE];
		    element[VAREDIT_COLUMN] = 1;
			element[VAREDIT_ORIG_VALUE]=G_info_settings[0][db_settings[ivar][DB_SETTINGS_DB_NAME]];
			element[VAREDIT_TYPE]=db_settings[ivar][DB_SETTINGS_TYPE];
			element[VAREDIT_NEW_VALUE]="";	
			element[VAREDIT_CHANGED_FLAG]=false;
				
			VAREDIT_ctl.push (element)
		}
                   	
    	// setup the fields from the schema
		VAREDIT_setup_fields (this.timer_callback);
	},
	
	// VAREDIT timer callback
	timer_callback: function (anychange)
	{
		// switch commands menu if any changes
		if (anychange==true)
		{
			if (SG_last_anychange==false)
			{
				setup_view ("U", "", "T-Commands-Logoff-Restore-Update", "");	
            
				SG_last_anychange = true;
			}
		}
		else
		{
			if (SG_last_anychange==true)
			{
				setup_view ("U", "", "T-Commands-Logoff", "");	
            
				SG_last_anychange = false;
			}
		}
	},
	
	// doCancel  
   	doCancel: function () 
    {	
    	// not used
    },
    
	// terminate  
   	terminate: function () 
    {	
    	// no actions
    },
    
    // dofunction - mouse click entry point  
   	doFunction: function (func) 
    {
    	VAREDIT_stop_timer();
    	
    	// switch view requested
        if (func=="switch_view_request")
        {
        	// changes made .. do confirm 
            if (SG_last_anychange==true)
            {
            	// check if user really wants to exit
				if (confirm("You have unsaved changes\nDo you wish to continue with view switch")) 
                {
            		// ok to switch
                  	return "OK_TO_SWITCH";
               	}
             
             	// didn't confirm .. restart timer  	 
               	else 
               	{
               		VAREDIT_start_timer();
                	return -1;
               	}     
            }
           
            // no changes made - ok to switch
            else
            {
               return "OK_TO_SWITCH";
            }
        }
    
		// logoff requested
		else if (func=="logoff")
    	{
    		// we have changes
    		if (SG_last_anychange==true)
           	{
              	if (confirm("You have unsaved changes\nDo you wish to continue with logoff")) 
              	{
            		// user definitely wants to do logoff  		
                	ret = do_logoff(1);
              	} 
              	else
              	{
              		VAREDIT_start_timer();	
              	}
           	}
           	
           	// else no changes
           	else
           	{
           		// check for logoff
           		var ret = do_logoff(0)
           		
           		// zero means logoff not done so restart timer
           		if (ret==0)
           		{
               		VAREDIT_start_timer();
           		}
           	}
		}	
	
		// settings update database button
		else if (func=="update")
    	{    	  	
    	    // set up the modal
    	    clear_and_display_modal();
			$("#modal-cancel-button").show();
			$("#modal-proceed-button").show();
    		write_modal ("Are you sure that you want to save your changes ?");
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
    	
    	// modal close pressed
    	else if (func=="button-close")
    	{
    		hide_modal();
    		VAREDIT_start_timer();
    		return;
    	}
    	
    	// modal proceed pressed
    	else if (func=="button-proceed")
    	{
    		hide_modal();
    		
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
				for (var ivar=0; ivar<VAREDIT_ctl.length; ivar++)
				{
					if (VAREDIT_ctl[ivar][VAREDIT_CHANGED_FLAG]==1)
					{
					   key_array.push(VAREDIT_ctl[ivar][VAREDIT_DBNAME]);
					   val_array.push(VAREDIT_ctl[ivar][VAREDIT_NEW_VALUE]);	   
					}
				}
    			do_update_where ("Settings", "ID", 1, key_array, val_array, proceed_settings_1);
    		}
    		
    		//else using sqL server
    		else
    		{
				var mysql = "UPDATE RRM_Settings SET "
				for (var ivar=0; ivar<VAREDIT_ctl.length; ivar++)
				{
					if (VAREDIT_ctl[ivar][VAREDIT_CHANGED_FLAG]==1)
					{
					   mysql = mysql + VAREDIT_ctl[ivar][VAREDIT_DBNAME] + "='" + VAREDIT_ctl[ivar][VAREDIT_NEW_VALUE] + "' ";   
					}
				}
				mysql = mysql + " WHERE ID=1"
				do_sql (mysql, proceed_settings_1, "")
			}
    		return;
    	}
		
		// settings restore original values button
		else if (func=="restore")
    	{
    		this.render(); 
		}	
		
		// else error undecoded function
		else			
		{
			alert ("Undecoded Settings Function " + func);	
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

// when settings update is complete  
function proceed_settings_1(response)  
{
	// get settings again
	G_settings_valid=0;
	load_settings (proceed_settings_2);
} 

// when settings read is complete  
function proceed_settings_2()
{
	G_SettingsView.render();	 
} 

//*************************************** 
// function to load settings from database
//*************************************** 

var G_load_settings_callback_save;   

function load_settings (callback)
{
	G_load_settings_callback_save = callback; 
	if (G_settings_valid==1) 
	{
		G_load_settings_callback_save();
	}
	
	// settings not valid
	else
	{
		// check if running on gas
	    if (G_running_on_gas==true)
	    {
	    	db_select_all ("Settings", load_settings_gas_callback);
	    }
	    
	    // else using SQL server
	    else
	    {    
			var mysql = "SELECT * from RRM_Settings";
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
						G_info_settings = response['data'];
						G_settings_valid = 1;
						G_load_settings_callback_save();
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

// callback from gas dbfuncs
function load_settings_gas_callback (d)
{
	G_info_settings = d;
	G_settings_valid = 1;
	G_load_settings_callback_save();    
} 
 










  

 
  