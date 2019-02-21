"use strict";

var L_group_changed;
var L_selected_group;
var L_selected_tab;
var L_edit_team_index;
var L_edit_model;
var G_theschema;
var G_timer_var;
var G_timer_count;
var G_last_commands;

//********************
// EDIT TEAMS VIEW
//******************** 

G_EditTeamView_Definition = Backbone.View.extend(
{   
    // initialize
    initialize: function () 
    {
        _.bindAll(this, 'render', 'doFunction', 'terminate'); 
        this.on('doFunction', this.doFunction, this);
        this.on('escKey', this.doCancel, this);
    }, 
      
    // render initial call  
   	render: function () 
    {
    	// setup the views into the three main screen areas
		setup_view ("U", "T-Edit-Team-Functions", "T-Edit-Commands-Return", "T-Edit-Team-Content");
		$('#id-edit-team').addClass('current');
		
		// initially no group changed 
		L_group_changed = false;
		
		do_edit_team_initial_call();
	},
	    
    // dofunction - mouse click entry point  
   	doFunction: function (func) 
    {	
    	do_edit_function_call (func);	
	},
    
    terminate: function()
    {
    	// no action
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


//************************************* 
// Function : edit team
//************************************* 

// called from list sub-menu to edit a team
function do_edit_team_initial_call()
{
	$("#edit-team-details").html("Edit Team " + G_selected_team + " Details");

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
		alert ("In list_teams_edit: team not found");
		return;
	}	
	L_edit_team_index = iteam; 

	// create the model
	L_edit_model = new Backbone.Model({});
	
	// show the view
	render_edit_info(GROUP_REGISTRATION_INFO, db_schema);	
}

function do_edit_function_call(func)
{
	// edit team update
	if (func=="edit-team-update")
	{
		edit_team_update();	
	}	
	
	// edit team restore
	if (func=="edit-team-restore")
	{
		render_edit_info(L_selected_group, db_schema);	
		return;
	}	

	// edit team return
	if (func=="edit-team-return")
	{
		return_to_list();		
		return;
	}	
	
	// registration info 
	if (func=="func-edit-registration-info")
	{
		render_edit_info(GROUP_REGISTRATION_INFO, db_schema);
		return;
	}	
	
	// contact info 
	if (func=="func-edit-contact-info")
	{
		render_edit_info(GROUP_CONTACT_INFO, db_schema);	
		return;
	}	
	
	// contact info 
	if (func=="func-edit-team-info")
	{
		render_edit_info(GROUP_TEAM_INFO, db_schema);	
		return;
	}
				
	// charity info 
	if (func=="func-edit-charity-info")
	{
		render_edit_info(GROUP_CHARITY_INFO, db_schema);	
		return;
	}			
	
	// payment info 
	if (func=="func-edit-payment-info")
	{
		render_edit_info(GROUP_PAYMENT_INFO, db_schema);	
		return;
	}			
	
	// runners info 
	if (func=="func-edit-runners-info")
	{
		render_edit_info(GROUP_RUNNERS_INFO, db_schema);	
		return;
	}	
	
	// dates info 
	if (func=="func-edit-dates-info")
	{
		render_edit_info(GROUP_DATES_INFO, db_schema);	
		return;
	}	
	
	// error
	else			
	{
		alert ("Undecoded Team Edit Function " + func);	
	}
}

function capitalize(s)
{
    return s[0].toUpperCase() + s.slice(1);
}

function render_edit_info (group_to_render, theschema)
{
	// check if anything has been changed
	if (L_group_changed==true)
	{
		var r = confirm ("Your changes will be lost if you proceed without updating database");
		if (r==false) return;
		L_group_changed = false;
	}

	// deselect tab if any
	if (L_selected_tab!="")
	{
		$(L_selected_tab).removeClass('current');
		L_selected_tab = "";
	}
	
	
	// return only
	setup_view ("U", "", "T-Edit-Commands-Return", "");	
	G_last_commands = "Return";
	
	// decode group 
	var group_name;
	if      (group_to_render==GROUP_REGISTRATION_INFO) group_name = "registration";
	else if (group_to_render==GROUP_CONTACT_INFO)      group_name = "contact";
	else if (group_to_render==GROUP_TEAM_INFO)         group_name = "team";
	else if (group_to_render==GROUP_CHARITY_INFO)      group_name = "charity";
	else if (group_to_render==GROUP_PAYMENT_INFO)      group_name = "payment";
	else if (group_to_render==GROUP_RUNNERS_INFO)      group_name = "runners";
	else if (group_to_render==GROUP_DATES_INFO)        group_name = "dates";
	else
	{
		alert ("Invalid group_to_render");
		return; 
	}
	
	// select tab and write header
	L_selected_group = group_to_render;
	L_selected_tab =  "#id-edit-" + group_name + "-info";
	$(L_selected_tab).addClass('current');
	$('#listing-header').html("Editing " + capitalize(group_name) + " Info for team " + G_team_database[L_edit_team_index]["Team_Code"]); 	

	// init 3 fields (5 items per field
	var my_info_fields1 = [];
	var my_info_fields2 = [];
	var my_info_fields3 = [];
	var num_fields_displayed = 0;
	
	// build the fields from the schema
	for (var ischema=0; ischema<theschema.length; ischema++)
	{
		if (theschema[ischema][DB_SCHEMA_GROUP]==group_to_render) 
		{
			if ((theschema[ischema][DB_SCHEMA_TYPE]&SCHEMA_TYPE_PROT)!=0)
			{		 
				var myobj = {name: theschema[ischema][DB_SCHEMA_FIELD_NAME], label: theschema[ischema][DB_SCHEMA_FIELD_NAME].split("_").join(" ") + " <span style='color:red'>(Cannot be modified)</span>", control: "uneditable-input"};
			}		 
			else
			{
				if ((theschema[ischema][DB_SCHEMA_TYPE]&SCHEMA_TYPE_DATE)!=0)
				{	
					var myobj = {name: theschema[ischema][DB_SCHEMA_FIELD_NAME], label: theschema[ischema][DB_SCHEMA_FIELD_NAME].split("_").join(" "), control: "datepicker"};
				}
				else if ((theschema[ischema][DB_SCHEMA_TYPE]&SCHEMA_TYPE_LONG_TEXT)!=0)
				{	
					var myobj = {name: theschema[ischema][DB_SCHEMA_FIELD_NAME], label: theschema[ischema][DB_SCHEMA_FIELD_NAME].split("_").join(" "), control: "textarea"};
				}
				else if ((theschema[ischema][DB_SCHEMA_TYPE]&SCHEMA_TYPE_TEXT)!=0)
				{
					var myobj = {name: theschema[ischema][DB_SCHEMA_FIELD_NAME], label: theschema[ischema][DB_SCHEMA_FIELD_NAME].split("_").join(" "), control: "input"};
				}
				else
				{
					alert ("Unrecognised Type A " + theschema[ischema][DB_SCHEMA_TYPE]);
					return;
				}
			}

			if (num_fields_displayed < 5) my_info_fields1.push(myobj);
			else if (num_fields_displayed < 10) my_info_fields2.push(myobj);
			else my_info_fields3.push(myobj);
			num_fields_displayed++;
		}
	}

	// create the forms (one per column)
	var my_info_form1  = new Backform.Form({el: "#my-info-edit-form1", model: L_edit_model, fields: my_info_fields1});
	var my_info_form2  = new Backform.Form({el: "#my-info-edit-form2", model: L_edit_model, fields: my_info_fields2});
	var my_info_form3  = new Backform.Form({el: "#my-info-edit-form3", model: L_edit_model, fields: my_info_fields3});

	// render them to the screen
	my_info_form1.render();
	my_info_form2.render();
	my_info_form3.render();

	// initialize the fields from the database
	for (var ischema=0; ischema<theschema.length; ischema++)
	{
		if (theschema[ischema][DB_SCHEMA_GROUP]==group_to_render) 
		{
			var val = G_team_database[L_edit_team_index][theschema[ischema][DB_SCHEMA_FIELD_NAME]];
			if ((theschema[ischema][DB_SCHEMA_TYPE]&SCHEMA_TYPE_DATE)!=0)
			{
				var dateval = "None";
				if (((typeof val!="object") || (val!=null)) && (val!="0000-00-00 00:00:00")) 
				{
					dateval = mysql_to_dd_mname_yyyy (val);
				}
				val = dateval;
			}
			else
			{
				val = val.replace(/{SQUOTE}/g, "'")
				val = val.replace(/{DQUOTE}/g, '"')
			}
			L_edit_model.set(theschema[ischema][DB_SCHEMA_FIELD_NAME], val );	
		}
	}  
	
	// start the timer to scan for changes	
	G_theschema = theschema;
	start_change_timer();  
}

// start the change timer
function start_change_timer()
{ 
	G_timer_var = -1;
	G_timer_var = setTimeout (change_timer_handler, 250);
	G_timer_count = 0;
}

// stop the change timer
function stop_change_timer()
{ 
	if (G_timer_var!=-1) 
	{
		clearTimeout(G_timer_var);
		G_timer_var = -1;
	}
}

// timer handler - scan for changes
function change_timer_handler()
{
	var theschema = G_theschema;
	
	for (var ischema=0; ischema<theschema.length; ischema++)
	{
		if (theschema[ischema][DB_SCHEMA_GROUP]==L_selected_group) 
		{
			var datetest = 0;

			var classname = "form-group " + theschema[ischema][DB_SCHEMA_FIELD_NAME];
			var oldval = G_team_database[L_edit_team_index][theschema[ischema][DB_SCHEMA_FIELD_NAME]];

			if ((theschema[ischema][DB_SCHEMA_TYPE]&SCHEMA_TYPE_PROT)!=0)
			{
				newval = oldval;
			}
			else
			{
				if ((theschema[ischema][DB_SCHEMA_TYPE]&SCHEMA_TYPE_YESNO)!=0)
				{
					var newval = G_edit_model.get(theschema[ischema][ DB_SCHEMA_FIELD_NAME  ]);
				}
		
				else if ((theschema[ischema][DB_SCHEMA_TYPE]&SCHEMA_TYPE_LONG_TEXT)!=0)
				{
					var newval = $('[class="' + classname + '"] textarea.form-control').val();
				}

				else if ((theschema[ischema][DB_SCHEMA_TYPE]&SCHEMA_TYPE_TEXT)!=0)
				{
					var newval = $('[class="' + classname + '"] input.form-control').val();
				}
		
				else if ((theschema[ischema][DB_SCHEMA_TYPE]&SCHEMA_TYPE_DATE)!=0)
				{
					var newval = $('[class="' + classname + '"] input.form-control').val();
					datetest = 1;
					if (newval=="None") newval = "0000-00-00 00:00:00";
					else
					{
						newval = dd_mname_yyyy_to_mysql (newval);							
					}		
				}
			  
				else
				{
					alert ("Unrecognised Type B" + theschema[ischema][DB_SCHEMA_TYPE]);
					return;
				}
			
				newval = newval.replace("'", /{SQUOTE}/g)
				newval = newval.replace('"', /{DQUOTE}/g)
			}
		
			if ((theschema[ischema][DB_SCHEMA_TYPE]&SCHEMA_TYPE_PROT)!=0)
			{
				theschema[ischema][SCHEMA_CHANGED_FLAG]=0;
			}
			else
			{	 
				if (newval!=oldval)
				{
					console.log (newval);
					console.log (oldval);
				
				
					$('[class="' + classname + '"] > label.control-label').html(theschema[ischema][SCHEMA_DISPLAY_NAME] + "<span style='color:red'> (modified)</span>");
					theschema[ischema][SCHEMA_CHANGED_FLAG]=1;
					theschema[ischema][SCHEMA_NEW_VALUE]=newval;
				}
				else
				{
					$('[class="' + classname + '"] > label.control-label').html(theschema[ischema][SCHEMA_DISPLAY_NAME]);
					theschema[ischema][SCHEMA_CHANGED_FLAG]=0;
				}
			}
		}
	}

	var anychange = 0;
	for (var ischema=0; ischema<theschema.length; ischema++)
	{
		if (theschema[ischema][SCHEMA_CHANGED_FLAG]==1) anychange=1;
	}
	if (anychange==1)
	{
		L_group_changed = true;
		if (G_last_commands != "Update")
		{
			setup_view ("U", "", "T-Edit-Commands-Return-Restore-Update", "");	
			G_last_commands = "Update";
		}
	}
	else
	{
		L_group_changed = false;
		if (G_last_commands != "Return")
		{
			setup_view ("U", "", "T-Edit-Commands-Return", "");	
			G_last_commands = "Return";
		}
	}
	 
	G_timer_var = setTimeout (change_timer_handler, 250);
}

// proceed button hit to update database
function edit_team_update () 
{
	// make sure the timer is stopped
	stop_change_timer();

	// clear any errors
	L_edit_model.errorModel.clear();

	clear_and_display_modal();
    write_modal ("Creating SQL...");

	// get all fields from the form and build sql
	var mysql = "UPDATE " + MAIN_DATA_TABLE + " SET "
	var errors = 0;
	var update_count = 0;
	for (var ischema=0; ischema<db_schema.length; ischema++)
	{
		var val = L_edit_model.get(db_schema[ischema][DB_SCHEMA_FIELD_NAME]);	 		
		if (db_schema[ischema][DB_SCHEMA_TYPE]=="DATE")
		{
			var dateval;
			if (val.toUpperCase()=="NONE")
			{	
				dateval = "0000-00-00 00:00:00";
			}
			else
			{
				dateval = dd_mname_yyyy_to_mysql (val);							
			}
			val = dateval; 
		}
		if (val!=G_team_database[L_edit_team_index][db_schema[ischema][DB_SCHEMA_FIELD_NAME]])
		{
			console.log (val);
			console.log (G_team_database[L_edit_team_index][db_schema[ischema][DB_SCHEMA_FIELD_NAME]]);
			
			if (update_count!=0) mysql = mysql + ", ";
			
			val = val.replace(/'/g, "{SQUOTE}")
			val = val.replace(/"/g, "{DQUOTE}")
			
			mysql = mysql + db_schema[ischema][DB_SCHEMA_FIELD_NAME] + "='" + val + "'";
			write_modal ("Field " + db_schema[ischema][DB_SCHEMA_FIELD_NAME] + " will be updated");	
			update_count = update_count + 1;
		}
	}   
	mysql = mysql + " WHERE Team_Code='" + G_selected_team + "';";

	if (update_count ==0)
	{
		write_modal_error ("No Updates Found .. no point in updating database");
		return;
	}
	else
	{
		write_modal (update_count + " Updates Found.");
	}
	
	write_modal ("Updating database.. ");
	do_sql (mysql, proceed_edit_team1, "");
	return; 	
}

// update completed
function proceed_edit_team1 (response) 
{
	write_modal ("Refreshing local database copy.. ");
	
	// reload team data
	G_team_database_data_valid=0;
	load_team_database (proceed_edit_team2);
}

// refresh completed
function proceed_edit_team2 () 
{
	write_modal ("update completed. ");
	show_modal_close();
	
	// re-create the table
	create_team_table();
	
	// refresh the screen
	Xrefresh();
}

function list_teams_email()
{
	console.log ("list_teams_email");
	send_email ("items", "values", list_teams_email1);
}

function list_teams_email1()
{
	console.log ("done");
}



 










  

 
  