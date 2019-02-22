"use strict";
 
var L_wix_rows;
var L_wix_column_names;
var L_wix_database_field_names;
var L_sql_count
var L_parse_data;
var L_sync_filename;
 
var L_sync_queue_sql;
var L_sync_queue_team;
var L_sync_queue_type;
var L_sync_count;
var L_paid_count;
var L_new_count;
var L_email_html;
var L_new_teams; 
var L_paid_teams; 

var L_queued_events;

var L_html;
 
//*************************
// SYNC TEAMS WITH WIX VIEW
//************************* 

G_SyncTeamsView_Definition = Backbone.View.extend(
{   
    // initialize
    initialize: function () 
    {
        _.bindAll(this, 'render', 'doCancel', 'doFunction', 'terminate'); 
        this.on('doCancel', this.doCancel, this);
        this.on('doFunction', this.doFunction, this);
        this.on('escKey', this.doCancel, this);
    }, 
      
    // render   
   	render: function () 
    {
    	// handle view button
    	if (G_selected_view_id!=null)
    	{
		   $(G_selected_view_id).addClass('nav-top-item').removeClass('nav-selected-item');
    	}
    	$("#id-sync-teams").addClass('nav-selected-item').removeClass('nav-top-item');
		G_selected_view_id = "#id-sync-teams";

    	// setup the view 
    	G_current_view = this;
    	setup_view ("U", "", "T-Commands-Logoff", "T-Sync-Teams-Content"); 

		// clear the report
		write_html_clear ();

		// main render function 
		sync_teams();
	},
	
	// doCancel  
   	doCancel: function () 
    {	
    	Xreturn();
    },
    
    // terminate  
   	terminate: function () 
    {	
    	// no action
    },
    
    // dofunction - mouse click entry point  
   	doFunction: function (func) 
    {	
    	// switch view requested
        if (func=="switch_view_request")
        { 
    		return "OK_TO_SWITCH";
        }
    
		// logoff requested
		else if (func=="logoff")
    	{
    		var ret = do_logoff(0);
		}	
    	
		// import teams
		else if (func=="sync-add-to-db")
    	{
			sync_add_to_db();	
		}	
	
		// error
		else			
		{
			alert ("Undecoded Sync Teams Function " + func);	
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


// add details of paid teams to notification email
function paid_teams_notification ()
{
	var arrayLength = L_paid_teams.length;
	if (arrayLength==0)
	{
		L_email_html += "<b>No teams updated in database paid</b><br><br>";
	}
	
	// else output the paid teams info
	else
	{
		for (var i=0; i< arrayLength; i++) 
		{
			// get team code
			var team_code = L_paid_teams[i]; 
	
			// find the team in the database 
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
				alert ("Bad error .. new_team_notification - team not found in database");
				Xreturn();
				return;
			}
			var team_index = iteam;
	
			L_email_html += "<b>" + "Team " + team_code + " updated in database as paid" + "</b><br><br>";
			L_email_html += " Team Name: " + G_team_database[team_index]["Team_Name"] + "<br>";
			L_email_html += " Ordered By Name: " + G_team_database[team_index]["Ordered_By"] + "<br>";
			L_email_html += " Email: " + G_team_database[team_index]["Email"] + "<br>";
			L_email_html += " Address: " + G_team_database[team_index]["Address"] + "<br>";
			L_email_html += " Mobile Phone: " + G_team_database[team_index]["Tel_Mobile"] + "<br>";
			L_email_html += " Landline Phone: " + G_team_database[team_index]["Tel_Landline"] + "<br><br>";
		}
	}
}

// add details of new teams to notification email
function new_teams_notification ()
{
	var arrayLength = L_new_teams.length;
	if (arrayLength==0)
	{
		L_email_html += "<b>No new teams added to database</b><br><br>";
	}
	
	// else output the new teams info
	else
	{
		for (var i=0; i<arrayLength; i++) 
		{
			// get team code
			var team_code = L_new_teams[i];	 
	 
			// find the team in the database 
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
				alert ("Bad error .. new_team_notification - team not found in database");
				Xreturn();
				return;
			}
			var team_index = iteam;
	
			if (G_team_database[team_index]["Payment_Status"]=="Paid") 
			{
				L_email_html = L_email_html + "<b>" + "New Team " + team_code + " added to database as Paid" + "</b><br><br>";
			}
			else
			{
				L_email_html = L_email_html + "<b>" + "New Team " + team_code + " added to database as Unpaid" + "</b><br><br>";
			}
			L_email_html += "  Team Name: " + G_team_database[team_index]["Team_Name"] + "<br>";
			L_email_html += "  Ordered By Name: " + G_team_database[team_index]["Ordered_By"] + "<br>";
			L_email_html += "  Email: " + G_team_database[team_index]["Email"] + "<br>";
			L_email_html += "  Address: " + G_team_database[team_index]["Address"] + "<br>";
			L_email_html += "  Mobile Phone: " + G_team_database[team_index]["Tel_Mobile"] + "<br>";
			L_email_html += "  Landline Phone: " + G_team_database[team_index]["Tel_Landline"] + "<br><br>"
		}
	}
}

// clear the screen html
function write_html_clear()
{
	L_html = "";
	$("#sync_report").html(L_html);	
}

// open screen html
function write_html_open()
{
	L_html = "<span><b>" + "START PROCESSING" + "</b></span></br>";
	$("#sync_report").html(L_html);	
}

// write error to screen html 
function write_html_error(text)
{
	L_html = L_html + "<span style='color:red'>" + "ERROR : " + text + "</span></br>";
	$("#sync_report").html(L_html);	
}

// write warning to screen html
function write_html_warning(text)
{
	L_html = L_html + "<span style='color:darkorange'>" + "WARNING : " + text + "</span></br>";
	$("#sync_report").html(L_html);	
}

// write to screen html
function write_html(text)
{
	L_html = L_html + "<span>" + text + "</span></br>";
	$("#sync_report").html(L_html);	
}

// close the screen html
function write_html_close()
{
	L_html = L_html + "<span><b>" + "END OF PROCESSING" + "</b></span></br>";
	$("#sync_report").html(L_html);	
}

// main sync teams render function
function sync_teams()
{
	// Hide the update button
	$("#sync-update-db").hide();
	
	// trigger on file input
	$("#sync-teams-file-input").click(function(evt)
	{
		write_html_clear ();	
	});
	
	// trigger on file input
	$("#sync-teams-file-input").change(function(evt)
	{
		write_html_clear ();
		write_html_open();
		
		// Retrieve the first (and only!) File from the FileList object
    	var file = evt.target.files[0]; 
    	L_sync_filename = evt.target.files[0].name;

    	if (file=="") 
    	{	
    		write_html_error ("Cannot load file for some unknown reason");
    		write_close();
    		return;
    	}
     
		// open file
		var r = new FileReader();
		r.readAsText(file);

		// function called when file loaded
		r.onload = function(e) 
		{ 
			// check that we have a valid WIX guest list
			var contents = e.target.result;
			
			if (contents.substr(0, 13)!="Ticket number")
			{
			    write_html_error("File is not a WIX Guest List");
			    write_html_close();
			    return;
			}   
			
			// parse the csv
			Papa.parse(file, 
			{
			  	quoteChar: '"',	
			  	header: false,
			  	dynamicTyping: true,
			  
			  	// parsing complete function
			  	complete: function (parse_data)
			  	{ 
			  		L_parse_data = parse_data;
			  		process_csv_data(parse_data) 
			  	}
			});	
		} 
	});
}

// get a row value based on row and column name
function get_row_val(row, colname)
{
	var found = 0;
	var numcols = L_column_names.length;
	for (var col=0; col<numcols; col++)
	{
		if (L_field_names[col]==colname)
		{
			return L_trows[row][col]; 
		}
	}
	return null;
}

// process csv data - called by PapaParse
function process_csv_data (parse_data)
{
	var data = parse_data["data"];

	L_new_teams = [];
	L_paid_teams = [];
	L_email_html = "<!DOCTYPE html><html><body><pre>";
	L_wix_column_names = [];
	L_wix_rows = [];
	L_wix_database_field_names = [];

	// generate date header
	var thedatetime = moment().format('dddd MMMM Do YYYY, HH:mm:ss');
    L_email_html += "<b>Notification sent " + thedatetime + "</b><br><br>";
	
	write_html ("Processing wix file...");
	
	// find first and last wix field indexes
	var db_schema_wix_first_index = 0;
	var db_schema_wix_last_index = 0;
	for (var ischema=0; ischema<db_schema.length; ischema++)
	{
		if (db_schema[ischema][DB_SCHEMA_FIELD_NAME]==DB_SCHEMA_WIX_FIRST_DB_NAME)
		{
			db_schema_wix_first_index = ischema;
		}
		if (db_schema[ischema][DB_SCHEMA_FIELD_NAME]==DB_SCHEMA_WIX_LAST_DB_NAME)
		{
			db_schema_wix_last_index = ischema;
		}
	}

	// process all rows in the wix file
	// convert csv into L_wix_column_names and L_wix_rows
	for (var row=0; row<data.length; row++) 
	{
		// first row is columns - check that column headers match database import map
		if (row==0)
		{
			// process all column headers
			for (var col=0; col<data[row].length; col++) 
			{
			    var a = db_schema[col+db_schema_wix_first_index][DB_SCHEMA_WIX_NAME];
				if (data[row][col].indexOf(a)==-1)
				{	
					write_html_error ("Mismatch between name in wix file (" + data[row][col] + ") and import map key (" + db_schema[col+db_schema_wix_first_index][DB_SCHEMA_WIX_NAME] + ")");
					write_html_close();
					return; 
				}
				L_wix_database_field_names.push(db_schema[col+db_schema_wix_first_index][DB_SCHEMA_FIELD_NAME]);
				L_wix_column_names.push (data[row][col]); 
			}
		}
	
		// else process the row
		else
		{
			var ticket_number = String(data[row][0]);	
			var order_number = String(data[row][1]);	
			
			// last row from wix is blank so ignore it
			if (ticket_number!="")
			{
				// process all columns for this row
				var arow = [];
				for (var col=0; col<data[row].length; col++) 
				{								
					var d = String(data[row][col]);	
					d = d.replace(/"/gi, '{DQUOTE}');
					d = d.replace(/'/gi, '{SQUOTE}');
					d = d.replace(/’/gi, '{SQUOTE}');
					d = d.replace(/\x0A/gi, ' ');
					arow.push(d);
				}						
				L_wix_rows.push (arow);
			}				 
		}
	}

	// check that number of colmuns in wix file and DB import size are same   
	if (L_wix_database_field_names.length!=(db_schema_wix_last_index-db_schema_wix_first_index+1))
	{
		write_html_error ("Length mismatch between file columns (" + L_wix_database_field_names.length + ") and import map length ("  + (db_schema_wix_last_index-DB_SCHEMA_WIX_FIRST_INDEX+1) + ")");
		write_html_close();
		return; 
	}
	
	// reverse the order of wix rows
	L_wix_rows = L_wix_rows.reverse();
	
	write_html ("Syncing teams..");
	write_html (L_wix_rows.length + " Teams in Wix, " + G_team_database.length + " in database"); 
	
	var num_wix_teams = L_wix_rows.length;
	var num_db_teams = G_team_database.length;
	var num_new_teams = 0;
	var num_existing_teams = G_team_database.length;

	// check for no change .. number of teams same in wix and DB 
	if (num_wix_teams==num_db_teams)
	{
		write_html ("No new teams detected");
	}
	
	// else cannot be more teams in db than wix
	else if (num_wix_teams<num_db_teams)
	{
		write_html_error ("something has gone wrong .. more teams in db than in wix .. please investigate and fix");
		write_html_close();
		return;
	}
	
	// else new teams in WIX 
	else
	{
		num_new_teams = num_wix_teams-num_db_teams;
		write_html (num_new_teams + " new team(s) detected .. will be added to database after updates");
	}	 
	
	// adjust wix values
	for (var row=0; row<num_wix_teams ; row++)
	{		
		for (var col=0; col<L_wix_database_field_names.length; col++)
		{
			// check that we have a team name team name
			if (L_wix_rows[row][col]=="") L_wix_rows[row][col] = "**None**";
		
			// adjust mobile phone number
			if (L_wix_database_field_names[col]=="Tel_Mobile")
			{
				if (L_wix_rows[row][col][0]=="7") L_wix_rows[row][col] = "0" + L_wix_rows[row][col];
				if (L_wix_rows[row][col][5]!= " ") L_wix_rows[row][col] = L_wix_rows[row][col].substring(0,5) + " " + L_wix_rows[row][col].substring(5)
			}
		}
	}
	
	write_html ("Looking for team updates..");
	
	// clear out sql queue for updates 
	L_sync_queue_sql = new Array();
	L_sync_queue_team = new Array();
	L_sync_queue_type = new Array();
	L_paid_count = 0;
	
	// work through existing teams ... must be in same order after sorting on RCRT number
	for (var row=0; row<num_existing_teams; row++)
	{		 
		// do for all columns
		for (var col=0; col<L_wix_database_field_names.length; col++)
		{
			// check for columns different
			if (L_wix_rows[row][col]!=G_team_database[row][L_wix_database_field_names[col]])
			{
				// check payment status n.b. payment status (Unpaid to Paid is the only field for
				// existing team that can be updated
				if (L_wix_database_field_names[col]=="Payment_Status")
				{
					// ERROR: payment went from Paid to Unpaid !
					if ((G_team_database[row][L_wix_database_field_names[col]]=="Paid") && (L_wix_rows[row][col]=="UnPaid")) 
					{
					   write_html_error (G_team_database[row]["Team_Code"] + " Invalid Payment Status differs. Database:" + G_team_database[row][L_wix_database_field_names[col]] + " Wix:" + L_wix_rows[row][col]);
					   write_html_close();
					   return;
					}
					
					// payment must have gone unpaid to paid 
					write_html (G_team_database[row]["Team_Code"] + " Payment Status differs. Database:" + G_team_database[row][L_wix_database_field_names[col]] + " Wix:" + L_wix_rows[row][col] + " Database will be updated to WIX value");
					var date = get_current_sql_date();
					
					// queue a database update for Unpaid to paid
					var mysql = "UPDATE " + MAIN_DATA_TABLE + " SET "; 
					mysql = mysql + 'Payment_Status = "' + L_wix_rows[row][col] + '"';  
					mysql = mysql + ', Registered_Paid_Date = "' + date + '"';  
					mysql = mysql + ' WHERE Team_Code = "' + G_team_database[row]["Team_Code"] + '"';
					L_sync_queue_sql.push(mysql);
					L_sync_queue_team.push(G_team_database[row]["Team_Code"]);	
					L_sync_queue_type.push("Updating team " + G_team_database[row]["Team_Code"]);
					
					L_paid_count = L_paid_count + 1;
					L_paid_teams.push (G_team_database[row]["Team_Code"]);	
					
					event_wix_payment_changed (G_team_database[row]["Team_Code"])
					
				}
				
				// else column other than payment status different for some reason 
				else
				{
					var s = G_team_database[row]["Team_Code"] + " Field " + L_wix_database_field_names[col] + " differs (manual editing of Wix or database required). Database: >>" + G_team_database[row][L_wix_database_field_names[col]] + "<<   Wix: >>" + L_wix_rows[row][col] + "<<"
					write_html_warning (s)					
				}
			}
		}	
			
		// update ordered by first and last names if not already setup
		if (G_team_database[row]["Ordered_By_First_Name"].trim()=="")
		{
			// split the name into team captain first and last name
			ordered_by_name = G_team_database[row]["Ordered_By"].trim();
			ordered_by_name = ordered_by_name.replace(/ +/g," ");
			var splitnames = ordered_by_name.split(" ");
			if (splitnames.length!=2)
			{
				write_html_warning ("Warning : name " + ordered_by_name + " does not split in to two parts");
			}
			
			var mysql = "UPDATE " + MAIN_DATA_TABLE + " SET "; 
			mysql = mysql + 'Ordered_By_First_Name = "' + splitnames[0] + '"'; 
			mysql = mysql + ', Ordered_By_Last_Name = "' + splitnames[1] + '"';  
			mysql = mysql + ' WHERE Team_Code = "' + G_team_database[row]["Team_Code"] + '"';
			L_sync_queue_sql.push(mysql);
			L_sync_queue_team.push(G_team_database[row]["Team_Code"]);	
			L_sync_queue_type.push("Updating Ordered by names for " + G_team_database[row]["Team_Code"]);
		 }							
	}
	
	// check for any paid updates
	if (L_paid_count==0)
	{
		write_html ("No updates found");
	}
	else
	{
		write_html (L_paid_count + " update(s) found and added to SQL queue");
	}
	
	// test for any new teams 
	if (num_new_teams==0)
	{
		write_html ("No new teams to be added to DB");
	}
	
	// else we have some new teams
	else
	{
		// add a new team
		L_new_count = 1;
		var ordered_by_name = "";
		var payment_status = "";
		
		write_html ("Adding " + num_new_teams + " new team(s) to DB...");
		
		// process all new teams
		var team_count = 0;
		for (var row=num_wix_teams-num_new_teams; row<num_wix_teams ; row++)
		{		
			// get next unallocated team code
			var next_team_code = parseInt(G_team_code_order_max)+1;
			var new_team_code = G_TEAM_CODE_PREFIX + next_team_code.toString(); 

			console.log ("new_team_code = " + new_team_code);

			// Increment next team code
			G_team_code_order_max = G_team_code_order_max + 1;
		 	
			// build the SQL - names first
			write_html ("Building SQL for new team " + new_team_code);
		 	var mysql = "INSERT INTO " + MAIN_DATA_TABLE + "  ("; 
		 	mysql = mysql +  " Team_Code ";
		 	 
		 	// database names for wix fields   
			for (var col=0; col<L_wix_database_field_names.length; col++)
 			{
		 		mysql = mysql + ", " + L_wix_database_field_names[col];
			}
			
			// additional database fields
			mysql = mysql +  " , Grouping ";
			mysql = mysql +  " , Special_Status ";
			mysql = mysql +  " , Team_Captain_First_Name ";
			mysql = mysql +  " , Team_Captain_Last_Name ";
			mysql = mysql +  " , Ordered_By_First_Name ";
			mysql = mysql +  " , Ordered_By_Last_Name ";
			
			// adjust wix values
			for (var col=0; col<L_wix_database_field_names.length; col++)
 			{
 				// save name for later
 				if (L_wix_database_field_names[col]=="Ordered_By")
 				{	
 					ordered_by_name	= L_wix_rows[row][col];
 				}
 				
 				// save payment status for later
 				if (L_wix_database_field_names[col]=="Payment_Status")
 				{	
 					payment_status	= L_wix_rows[row][col];
 				}
 			}	
			
			
			// add wix values to sql
			mysql = mysql + " ) VALUE ( ";
		 	mysql = mysql + '"' + new_team_code + '"';
			for (var col=0; col<L_wix_database_field_names.length; col++)
 			{
				// copy adjusted value
 				mysql = mysql + ' , "' + L_wix_rows[row][col] + '"';
 			}
 			
 			// no grouping 
 			mysql = mysql + ' , "' + "0" + '"';
 			
 			// no special status
 			mysql = mysql + ' , "' + "None" + '"';
 			
 			// split the name into team captain first and last name
 			ordered_by_name = ordered_by_name.trim();
 			ordered_by_name = ordered_by_name.replace(/ +/g," ");
 			var splitnames = ordered_by_name.split(" ");
			if (splitnames.length!=2)
			{
				write_html_warning ("Warning : name " + ordered_by_name + " does not split in to two parts");
			}

			// team captain names
 			mysql = mysql + ' , "' + splitnames[0] + '"';
 			mysql = mysql + ' , "' + splitnames[1] + '"';
 			
 			// ordered by names
 			mysql = mysql + ' , "' + splitnames[0] + '"';
 			mysql = mysql + ' , "' + splitnames[1] + '"';
 			 			
 			mysql = mysql + " )";
 			
 			// change microsoft single and double quotes
 			mysql = mysql.replace(/[\u2018\u2019​]/g,'{SQUOTE}')
 			mysql = mysql.replace(/[\u201c\u201d]/g,'{DQUOTE}')

			console.log (mysql);
			console.log (dohex(mysql));


			L_sync_queue_sql.push(mysql);
			L_sync_queue_team.push(new_team_code);	
			L_sync_queue_type.push("Adding new team " + new_team_code);
			L_new_count = L_new_count + 1;
			L_new_teams.push (new_team_code);
			
			event_new_wix_registration (new_team_code, payment_status)
		}
	}
	
	// run updates and new entries on database
	var team_code = L_sync_queue_team.shift()
	var mysql = L_sync_queue_sql.shift()	
	var mytype = L_sync_queue_type.shift()
		
	L_sync_count = 0;

	// update if something to do	
	if (team_code!=undefined)
	{
		sync_teams_1(mysql, mytype)
	}
	else
	{
		write_html ("Nothing to do in SQL queue");
		sync_teams_4();
	} 
} 

// come here to run some sql on the database
function sync_teams_1 (mysql, mytype)
{
	write_html (mytype);
	L_sync_count = L_sync_count + 1;
	do_sql (mysql, sync_teams_2, mytype);
}

function sync_teams_2 (response)
{
	var team_code = L_sync_queue_team.shift()
	var mysql = L_sync_queue_sql.shift()
	var mytype = L_sync_queue_type.shift()

	if (team_code!=undefined)
	{
		sync_teams_1 (mysql, mytype)
	}
	else
	{
		write_html (L_sync_count + " SQL queue processed...reloading database");
		G_team_database_data_valid=0;
		load_team_database (sync_teams_3);
	}
}

// come here to log time of last update to settings and then send notification report
function sync_teams_3() 
{
	var date = get_current_sql_date();

    G_info_settings[0]["Last_Update_DateTime"] = date;
    G_info_settings[0]["Last_Update_Wix_Filename"] = L_sync_filename;
    
	var mysql = "UPDATE RRM_Settings SET "; 
	mysql = mysql + " Last_Update_DateTime" + " = '" + date + "' ,";
	mysql = mysql + " Last_Update_Wix_Filename" + " = '" + L_sync_filename + "'";
	write_html ("Updating Settings..");
	do_sql (mysql, sync_teams_4, "")
}

// add a field to the notification report
function write_notification_report_field (s, len)
{
	var slen = s.length; 
	L_email_html = L_email_html + s;
	for (var i=0; i<(len-slen); i++)
	{
		L_email_html = L_email_html + " ";
	}
}

// come here after settings updated with last file name processed
function sync_teams_4() 
{
	// add statistics
	L_email_html += "<b>Team stats as follows:</b><br><br>";
	L_email_html += "   Total number of teams = " + G_team_database.length + "<br>";
	L_email_html += "   Teams paid = " + G_teams_paid  + "<br>";
	L_email_html += "   Teams unpaid = " + G_teams_unpaid  + "<br>";
	L_email_html += "   Teams with runner names = " + G_have_runners  + "<br><br>";
	
	// generate notification text for new and paid teams
    new_teams_notification ();	 
    paid_teams_notification (); 
    
	L_email_html += "<b>Following " + G_teams_unpaid + " teams are still unpaid:</b><br><br>";
	
	// loop for all database rows i.e. registered teams
	var n = 1;
	for (var iteam=0; iteam<G_team_database.length; iteam++)
	{ 
		if (G_team_database[iteam]["Payment_Status"] == "Unpaid")
		{	
			write_notification_report_field (n.toString(), 4);
			write_notification_report_field (G_team_database[iteam]["Team_Code"], 10);
			var val = G_team_database[iteam]["Team_Name"];
			write_notification_report_field (G_team_database[iteam]["Ordered_By"] + " (" + val + ")", 25);

	        L_email_html += "<br>";
			n = n + 1;
		}
	}
	
	L_email_html += "<br><p>*** END OF MESSAGE ***</p>";
	L_email_html += "</pre></body></html>";
	
	// no notification email if no changes
	/*
	if ((L_paid_count==0) && (L_new_count==0))
	{
		write_html ("No need to send notification email");   
		sync_teams_5();	
		return;
	}
	*/

	var thedatetime = moment().format('dddd MMMM Do YYYY, HH:mm:ss');
	
	// create send array
	var name_values = new Array();
    name_values.push(
    {
    	Parm_email_sms			: "email",
    	Parm_html_text			: "text",
    	Parm_sib_server		    : "server",
    	Parm_simple_templated	: "simple",
    	
        Parm_email_to_address   : "Ron.Bowater@gmail.com",
        Parm_email_to_name      : "Ron",
        Parm_email_from_address : "Info@romseymarathon.co.uk",
        Parm_email_from_name    : "Romsey Marathon",
        Parm_email_cc_address	: "",
        Parm_email_cc_name		: "",
        Parm_email_bcc_address  : "",
        Parm_email_bcc_name	    : "",
        Parm_email_subject      : "Romsey Marathon Teams Status on " + thedatetime,
        Parm_msg_body           : L_email_html
    });
    
    send_generic_message (name_values, sync_teams_5);
}

// notification email sent
function sync_teams_5(resp) 
{
	write_html (resp)
	
	// update events and state for new team
	write_html ("Updating events and state");
	process_events_queue(sync_teams_6);	
}

function sync_teams_6(resp)
{
	write_html ("Sync completed");
	write_html_close();
}

// get a row value based on row and column name
function get_row_val(row, colname)
{
	var found = 0;
	var numcols = L_column_names.length;
	for (var col=0; col<numcols; col++)
	{
		if (L_field_names[col]==colname)
		{
			return L_trows[row][col]; 
		}
	}
	return null;
}

function dohex(str)
  {
	var arr1 = [];
	for (var n = 0, l = str.length; n < l; n ++) 
     {
		var hex = Number(str.charCodeAt(n)).toString(16);
		arr1.push(str[n]);
		arr1.push(hex);
	 }
	return arr1.join(' ');
   }

