"use strict";
 
 var L_trows;
 var L_column_names;
 var L_field_names;
 var L_sql_count
 var L_show_new_entries;
 var L_most_recent_last;
 var L_parse_data;
 var L_import_filename;
 
 var L_import_queue_sql;
 var L_import_queue_team;
 var L_import_count;


//********************
// IMPORT TEAMS VIEW
//******************** 

G_ImportTeamsView_Definition = Backbone.View.extend(
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
    	// setup the view 
    	setup_view ("U", "T-Import-Teams-Functions", "T-Import-Teams-Commands", "T-Import-Teams-Content"); 

		// main render function 
		import_teams();
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
		if (func=="import-add-to-db")
    	{
			import_add_to_db();	
		}	
	
		// error
		else			
		{
			alert ("Undecoded Import Teams Function " + func);	
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

// main import teams render function
function import_teams()
{
	// Hide the add button
	$("#import-add-to-db").hide();
	
	// trigger on file input
	$("#import-teams-file-input").change(function(evt)
	{
		// get the buttons
		L_show_new_entries = $("#show-new-entries").prop('checked');
		L_most_recent_last = $("#most-recent-last").prop('checked');
		

		// Retrieve the first (and only!) File from the FileList object
    	var file = evt.target.files[0]; 
    	L_import_filename = evt.target.files[0].name;

    	if (file=="") 
    	{	
    		clear_and_display_modal();
    		write_modal_error ("Cannot load file for some reason");
    		show_modal_close();
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
				clear_and_display_modal();
			    write_modal_error("File is not a WIX Guest List");
			    show_modal_close();
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
			  		process_csv_data(parse_data, L_show_new_entries, L_most_recent_last) 
			  	}
			});	
		} 
		
		// set a trigger for the show only new entries button
		$('#show-new-entries').click( function()
		{
			L_show_new_entries = $("#show-new-entries").prop('checked');
			process_csv_data(L_parse_data, L_show_new_entries) 
		}); 
		
		// set a trigger for the most recent last button
		$('#most-recent-last').click( function()
		{
			L_most_recent_last = $("#most-recent-last").prop('checked');
			process_csv_data(L_parse_data, L_show_new_entries, L_most_recent_last) 
		}); 
		
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
function process_csv_data (parse_data, show_new_entries, most_recent_last)
{
	var data = parse_data["data"];

	var scolumns = [];
	var srows = [];
	L_column_names = [];
	L_trows = [];
	L_field_names = [];

	// process all rows
	for (var row=0; row<data.length; row++) 
	{
		// first row is columns
		if (row==0)
		{
			// process all column headers
			for (var col=0; col<data[row].length; col++) 
			{
				var acolumn = [];
				var d = data[row][col];
				acolumn = {name:"c"+col, title:d};  
				scolumns.push (acolumn);  
				L_column_names.push (d); 
				L_field_names.push (d);  
			}
		}
	
		// else process the rows
		else
		{
			var arow = [];
			var trow = [];
			var s = "arow = {";
		
			var ticket_number = String(data[row][0]);	
			var order_number = String(data[row][1]);	
			
			// last row from wix is blank so ignore it
			if (ticket_number!="")
			{
				var do_row = 1;
				if (show_new_entries==true)
				{
					// see if we have this entry in the database
					for (var ix=0; ix<G_team_database.length; ix++)
					{    
						if ((G_team_database[ix]["Ticket_Number"]==ticket_number) && (G_team_database[ix]["Order_Number"]==order_number))
						{
							do_row = 0;
							break;
						}
					}
				}
			
				// process all columns for this row
				if (do_row==1)
				{
					for (var col=0; col<data[row].length; col++) 
					{								
						if (col!=0) s = s + ",";
						var d = String(data[row][col]);	
						d = d.replace(/"/gi, '{DQUOTE}');
						d = d.replace(/'/gi, '{SQUOTE}');
						d = d.replace(/\x0A/gi, ' ');
						s = s + 'c' + col + ':"' + d + '"';
						trow.push(d);
					}						
					s = s + "};";
					console.log (s);
					eval(s);
					srows.push (arow);
					L_trows.push (trow);
				}			
			}				 
		}
	}
	
	// reverse rows if most recent last
	if (most_recent_last==true)
	{	
		L_most_recent_last = true;
		srows = srows.reverse();
	}

	// display data
	jQuery(function($){
		$('.table').footable({
			"paging": {"size": 20},
			"toggleColumn": "first",
			"sorting": {"enabled": true},
			"columns": scolumns,
			"rows": srows
		});
	});

	// Hide the search button
	$("tr.footable-filtering").hide();

	// Show the add button
	$("#import-add-to-db").show();	
 
	// trigger on click on a row function 
	$('.table').find('tr').click( function(){
		G_selected_team = $(this).find('td:first').text();
		$("#import_teams_action_button").show();
		$("#imprt_teams_action_button" ).html("some action " + G_selected_team);
	});
}

// import add to database button clicked
function import_add_to_db()
{
	var ordered_by_name;
	var payment_status;

	clear_and_display_modal();
	
	// search in import map for WIX names, replace with DB name
	for (var icolumn=0; icolumn<L_column_names.length; icolumn++)
	{
		var found = 0;
		for (var imap=0; imap<db_import_map.length; imap++)
	 	{
	 		if (L_column_names[icolumn]===db_import_map[imap][DB_IMPORT_MAP_WIX_NAME])
	 		{
	 			found = 1;
	 			L_field_names[icolumn] = db_import_map[imap][DB_IMPORT_MAP_DB_NAME]; 
	 			break;
	 		}
	 	}

	 	if (found==0) 
	 	{
	 		write_modal_error ("WIX name " + L_column_names[icolumn] + " not found in map");
	 		return;
	 	}
	}
		
	if (L_column_names.length!=db_import_map.length)
	{
		write_modal_error ("Mismatch between WIX columns (" + L_column_names.length + ") and import map size )" + db_import_map.length + ")");
		return;
	}
	          
	// reverse the rows that that first registered are inserted first
	L_trows = L_trows.reverse();
	
	L_import_queue_sql = new Array();
	L_import_queue_team = new Array();
	L_import_count = 0;
	
	write_modal ("Building import queue");
	
	// process all rows in the imported WIX file	
	for (var row=0; row<L_trows.length; row++)
	{			
		// for all rows, ensure that an entry with the same Ticket Number is not already in DB 
		var tnum_import = get_row_val(row, "Ticket_Number");
		var found = 0;
		 
		for (var iteam=0; iteam<G_team_database.length; iteam++)
		{    
			var tnum_db = G_team_database[iteam]["Ticket_Number"]
		 	if (tnum_db==tnum_import)
		 	{
		 		found = 1;
		 		break;
		 	}	
		 }
		 
		 // take no further action if a duplicate is found
		 if (found==1)
		 {
		 	write_modal_error ("Ticket_Number " + tnum_import + " is already in database as team " + G_team_database[iteam]["Team_Code"])	
		 }
		 
		 // else ok to process this one
		 else
		 {
		 	// work through the database schema field by field
		 	for (var ischema=0; ischema<db_schema.length; ischema++)
 			{
 				// determine if this field has been imported from WIX
 				var found = 0;
 				for (var icolumn=0; icolumn<L_column_names.length; icolumn++)
 				{
 					if (L_field_names[icolumn]==db_schema[ischema][DB_SCHEMA_FIELD_NAME])	 
 					{
 						found = 1;
 						break;
 					}
 				}
 				
 				// get the field from WIX or default depending upon type
 				if (found==1)
 				{
 					// import from WIX
 					var val = get_row_val(row, db_schema[ischema][DB_SCHEMA_FIELD_NAME]); 
 					db_schema[ischema][DB_SCHEMA_SCRATCH_A] = val.replace ("'", "''");
 					
 					// if ordered by save name for first/last name split later
 					if (db_schema[ischema][DB_SCHEMA_FIELD_NAME]=="Ordered_By")
 					{
 						ordered_by_name = db_schema[ischema][DB_SCHEMA_SCRATCH_A];
 						
 						// remove any double spaces
 						ordered_by_name = ordered_by_name.replace("  ", " ");
 					}
 					
 					// if payment status save for later
 					if (db_schema[ischema][DB_SCHEMA_FIELD_NAME]=="Payment_Status")
 					{
 						payment_status = db_schema[ischema][DB_SCHEMA_SCRATCH_A];
 					}
 				}
 				
 				// else not found in WIX import
 				else
 				{
 					// if actual payment status, set as wix payment status
 					if (db_schema[ischema][DB_SCHEMA_FIELD_NAME]=="Actual_Payment_Status")
 					{
 						db_schema[ischema][DB_SCHEMA_SCRATCH_A] = payment_status;
 					}
 					// else not actual_payment_status
 					else
 					{
						// set to default date
						if (db_schema[ischema][DB_SCHEMA_TYPE]=="DATE")
						{
							db_schema[ischema][DB_SCHEMA_SCRATCH_A] = "0000-00-00 00:00:00";
						}
						// else just set to TBD
						else
						{
							db_schema[ischema][DB_SCHEMA_SCRATCH_A] = "TBD";
						}
					}
 				}
		 	}
		 	
		 	// get next unallocated team code
			var next_team_code = parseInt(G_team_code_order_max)+1;
			var team_code = G_TEAM_CODE_PREFIX + next_team_code.toString(); 

			// Increment next team code
			G_team_code_order_max = G_team_code_order_max + 1;

			// increment teams imported count
			L_import_count = L_import_count + 1

			// setup team_code in values array (Schema scratch A)
		 	db_schema[0][DB_SCHEMA_SCRATCH_A] = team_code;
		 	
		 	// build the SQL - names first
		 	var mysql = "INSERT INTO " + MAIN_DATA_TABLE + " ("; 
		 	for (var ischema=0; ischema<db_schema.length; ischema++)
 			{
		 		if (ischema!=0) mysql = mysql + ", ";	
		 		mysql = mysql + db_schema[ischema][DB_SCHEMA_FIELD_NAME];
			}
			
			// process values
			mysql = mysql + " ) VALUE ( ";
			for (var ischema=0; ischema<db_schema.length; ischema++)
 			{
		 		if (ischema!=0) mysql = mysql + ", ";	
		 		if (db_schema[ischema][DB_SCHEMA_FIELD_NAME]=="Team_Captain_First_Name")
				{
					var splitnames = ordered_by_name.split(" ");
					if (splitnames.length!=2)
					{
						write_modal_warning ("Warning : name " + ordered_by_name + " does not split in to two parts");
					}
					mysql = mysql + "'" + splitnames[0] + "'";
				}
				else if (db_schema[ischema][DB_SCHEMA_FIELD_NAME]=="Team_Captain_Last_Name")
				{
					var splitnames = ordered_by_name.split(" ");
					mysql = mysql + "'" + splitnames[1] + "'";
				}
				else
				{	
					mysql = mysql + "'" + db_schema[ischema][DB_SCHEMA_SCRATCH_A] + "'";
				}
			}
			mysql = mysql + " )";
					
			L_import_queue_sql.push(mysql);
			L_import_queue_team.push(team_code);					
		}
	}
	
	var team_code = L_import_queue_team.shift()
	var mysql = L_import_queue_sql.shift()	
	
	if (team_code!=undefined)
	{
		import_teams_1(mysql, team_code)
	}
	else
	{
		write_modal (L_import_count + " Teams imported...reloading database");
		import_teams_3();
	} 
}

function import_teams_1(mysql, team_code)
{
	write_modal ("Adding team " + team_code);
	do_sql (mysql, import_teams_2, team_code);
}

function import_teams_2(response)
{
	var team_code = L_import_queue_team.shift()
	var mysql = L_import_queue_sql.shift()
	if (team_code!=undefined)
	{
		import_teams_1(mysql, team_code)
	}
	else
	{
		write_modal (L_import_count + " Teams imported...reloading database");
		G_team_database_data_valid=0;
		load_team_database (import_teams_3);
	}
}

function import_teams_3() 
{
	var date;
	
	date = new Date();
	date = date.getUTCFullYear() + '-' +
    ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
    ('00' + date.getUTCDate()).slice(-2) + ' ' + 
    ('00' + date.getUTCHours()).slice(-2) + ':' + 
    ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
    ('00' + date.getUTCSeconds()).slice(-2);
    
	var mysql = "UPDATE RRM_Settings SET " 
	mysql = mysql + " Last_Update_DateTime" + " = '" + date + "' ,";
	mysql = mysql + " Last_Update_Wix_Filename" + " = '" + L_import_filename + "'";
	write_modal ("Updating Settings..");
	do_sql (mysql, import_teams_4, "")
}

function import_teams_4() 
{
	write_modal ("Import completed");
	show_modal_close();
}

