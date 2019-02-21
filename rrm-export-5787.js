"use strict";

var L_export_model;

//********************
// EXPORT TEAMS VEIW
//******************** 


G_ExportTeamsView_Definition = Backbone.View.extend(
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
    	// setup the views
    	setup_view ("U", "T-Main-Views", "T-Commands-Logoff-Export", "T-Team-Content-Export"); 
    	G_current_view = this;

        // handle view button
    	if (G_selected_view_id!=null)
    	{
		   $(G_selected_view_id).addClass('nav-top-item').removeClass('nav-selected-item');
    	}    	
		$("#id-export-teams").addClass('nav-selected-item').removeClass('nav-top-item');
		G_selected_view_id = "#id-export-teams";
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
    
		// logoff requeted
		else if (func=="logoff")
    	{
    		// check for logoff
           	var ret = do_logoff(0)
           		
           	// zero means logoff not done so just return
           	if (ret==0)
           	{
               	return (0);
           	}
		}
				
		// export to csv
		else if (func=="export")
    	{
			export_to_csv();	
		}	
		
		// close modal
		else if (func=="button-close")
    	{
    		close_modal();
    		return;
    	}
	
		// error
		else			
		{
			alert ("Undecoded Export Teams Function " + func);	
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

// come here when export button is clicked
function export_to_csv()
{
	var csv = "";
	
	clear_and_display_modal();
	
	$("#modal-close-button").show();
	$("#modal-cancel-button").hide();
	$("#modal-proceed-button").hide();

	write_modal ("Building csv data ...");
	
	// get column tick boxes
	var exp_all_info      = $('#exp-all-info').prop('checked');
	var exp_reg_info      = $('#exp-reg-info').prop('checked');
	var exp_contact_info  = $('#exp-contact-info').prop('checked');
	var exp_team_info     = $('#exp-team-info').prop('checked');
	var exp_charity_info  = $('#exp-charity-info').prop('checked');
	var exp_payment_info  = $('#exp-payment-info').prop('checked');
	var exp_runners_info  = $('#exp-runners-info').prop('checked');
	var exp_dates_info    = $('#exp-dates-info').prop('checked');
	
	// if all selected, pre-select all groups
	if (exp_all_info==true)
	{
		exp_reg_info=true;
		exp_contact_info=true;
		exp_team_info=true;
		exp_charity_info=true;
		exp_payment_info=true;
		exp_runners_info=true;		
		exp_dates_info=true;
	}
	
	// get row tick boxes
	var exp_all_rows     = $('#exp-all-rows').prop('checked');
	var exp_unpaid_rows  = $('#exp-unpaid-rows').prop('checked');
	var exp_paid_rows    = $('#exp-paid-rows').prop('checked');
	var exp_no_runners   = $('#exp-no-runners').prop('checked');
	
	console.log (exp_all_rows);
	console.log (exp_unpaid_rows);
	
	// create a subset team database depending upon rows selected
	var dbsubset = [];
	for (var iteam=0; iteam<G_team_database.length; iteam++)
	{
		console.log(G_team_database[iteam]["Payment_Status"]);
		if (exp_all_rows==true)
		{
			dbsubset.push(G_team_database[iteam]);
		}
		else if ((exp_unpaid_rows==true) && (G_team_database[iteam]["Payment_Status"]=="Unpaid"))
		{
			console.log ("push");
			dbsubset.push(G_team_database[iteam]);
		}
		else if ((exp_paid_rows==true) && (G_team_database[iteam]["Payment_Status"]=="Paid"))
		{
			dbsubset.push(G_team_database[iteam]);
		}
		else if (exp_no_runners==true)
		{
			dbsubset.push(G_team_database[iteam]);
		}
	}
	
	// do header row
	var arr = [];
	
	// team code header
	arr.push ("Team_Code".split("_").join(" ")); 
	
	// other headers
	for (var ischema=0; ischema<db_schema.length; ischema++)
	{
		if (db_schema[ischema][DB_SCHEMA_FIELD_NAME]!="Team_Code")
		{
			if (((exp_reg_info==true) && (db_schema[ischema][DB_SCHEMA_GROUP]==GROUP_REGISTRATION_INFO))
			 || ((exp_contact_info==true) && (db_schema[ischema][DB_SCHEMA_GROUP]==GROUP_CONTACT_INFO))
			 || ((exp_team_info==true) && (db_schema[ischema][DB_SCHEMA_GROUP]==GROUP_TEAM_INFO))
			 || ((exp_charity_info==true) && (db_schema[ischema][DB_SCHEMA_GROUP]==GROUP_CHARITY_INFO))
			 || ((exp_payment_info==true) && (db_schema[ischema][DB_SCHEMA_GROUP]==GROUP_PAYMENT_INFO))
			 || ((exp_runners_info==true) && (db_schema[ischema][DB_SCHEMA_GROUP]==GROUP_RUNNERS_INFO)))
			 {
				arr.push (db_schema[ischema][DB_SCHEMA_FIELD_NAME].split("_").join(" "));
			 }
		}
	}
	
	write_modal (arr.length + " column(s) selected for export");
	write_modal (dbsubset.length + " row(s) selected for export");
	// output header row
	write_modal ("Writing header..");
	csv = csv + process_row (arr);

	// write the data
	var row_count = 0;
	var col_count = 0;

	for (var iteam=0; iteam<dbsubset.length; iteam++)
	{
		var arr = [];  
		
		// do team code as first column 
		var val = dbsubset[iteam]["Team_Code"];
     	val = val.replace(/{SQUOTE}/g, "'")
		val = val.replace(/{DQUOTE}/g, '"')
     	if (val==null) val = "";
		arr.push (val.split("_").join(" "));
		
		// do header 
		for (var ischema=0; ischema<db_schema.length; ischema++)
		{
			if (db_schema[ischema][DB_SCHEMA_FIELD_NAME]!="Team_Code")
			{
				if (((exp_reg_info==true) && (db_schema[ischema][DB_SCHEMA_GROUP]==GROUP_REGISTRATION_INFO))
				 || ((exp_contact_info==true) && (db_schema[ischema][DB_SCHEMA_GROUP]==GROUP_CONTACT_INFO))
				 || ((exp_team_info==true) && (db_schema[ischema][DB_SCHEMA_GROUP]==GROUP_TEAM_INFO))
				 || ((exp_charity_info==true) && (db_schema[ischema][DB_SCHEMA_GROUP]==GROUP_CHARITY_INFO))
				 || ((exp_payment_info==true) && (db_schema[ischema][DB_SCHEMA_GROUP]==GROUP_PAYMENT_INFO))
				 || ((exp_runners_info==true) && (db_schema[ischema][DB_SCHEMA_GROUP]==GROUP_RUNNERS_INFO)))
				 {
				 	var val = dbsubset[iteam][db_schema[ischema][DB_SCHEMA_FIELD_NAME]];
					val = val.replace(/{SQUOTE}/g, "'")
					val = val.replace(/{DQUOTE}/g, '"')
					if (val==null) val = "";
					arr.push (val.split("_").join(" "));
				 }
			}
		}
		
		csv = csv + process_row (arr);	
		row_count = row_count + 1;  
	}

	// write the file
	write_modal ("writing " + csv.length + " bytes to file " + " test.csv");
	var file = new File([csv], {type: "image/jpeg"});
	
	var d = new Date();
	var s = "RRM-Team-Export-" + ('0' + d.getDate()).slice(-2) + '-' + ('0' + (d.getMonth()+1)).slice(-2) + '-' + d.getFullYear() + ".csv";
	saveAs(file, s);
	
	write_modal ("Writing file " + s);
	write_modal ("File is located in downloads on Mac");
	write_modal ("CSV write completed");
	return;
}

// function to convert an array into csv                 
function process_row (row) 
{
	var finalVal = '';
	for (var j = 0; j < row.length; j++) 
	{
		var innerValue = row[j] === null ? '' : row[j].toString();
		if (row[j] instanceof Date) 
		{
			innerValue = row[j].toLocaleString();
		};
		var result = innerValue.replace(/"/g, '""');
		if (result.search(/("|,|\n)/g) >= 0)
			result = '"' + result + '"';
		if (j > 0)
			finalVal += ',';
		finalVal += result;
	}
	return finalVal + '\n';
}
