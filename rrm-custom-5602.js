"use strict";

//**************************
// CUSTOM FUNCTIONS TOP VIEW
//************************** 

G_CustomFunctions_Definition = Backbone.View.extend(
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
    	// setup the view
    	G_current_view = this;
    	setup_view ("U", "T-Main-Views", "T-Commands-Logoff", "T-CustomFuncs-Content");

    	// handle view button
    	if (G_selected_view_id!=null)
    	{
		   $(G_selected_view_id).addClass('nav-top-item').removeClass('nav-selected-item');
    	}
    	$("#id-custom-funcs").addClass('nav-selected-item').removeClass('nav-top-item');
		G_selected_view_id = "#id-custom-funcs";
	},
	
	// doCancel  
   	doCancel: function () 
    {	
    	alaert ("ERROR: G_CustomFunctions doCancel");
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
					
		// custom function 1
		else if (func=="custom-func-1")
    	{
			custom_function_1();	
		}	
		
		else if (func=="custom-func-2")
    	{
			custom_function_2();	
		}
			
		else if (func=="custom-func-3")
    	{
			custom_function_3();	
		}	
		
		else if (func=="custom-func-4")
    	{
			custom_function_4();	
		}	
		
		else if (func=="custom-func-5")
    	{
			custom_function_5();	
		}	
		
		else if (func=="custom-func-6")
    	{
			custom_function_6();	
		}	
		
		else if (func=="custom-func-7")
    	{
			custom_function_7();	
		}	
		
		else if (func=="custom-func-8")
    	{
			custom_function_8();	
		}	
		
		else if (func=="custom-func-9")
    	{
			custom_function_9();	
		}	
		
		// close modal
		else if (func=="button-close")
    	{
    		return;
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

// fields to be exported in custom functions 1-3
var db_custom1to3_csv = ["Team_Code",
                    "Team_Name",
                    "Team_Captain_First_Name",
                    "Team_Captain_Last_Name",
                    "Email",
                    "Tel_Mobile",
                    "Tel_Home"
                    ];
                    

// function to convert an array into csv                 
function custom_function_process_row (row) 
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

function custom_function_write_csv(team_index_list, filename)
{
	var csv = "";
	 
	write_modal ("Building csv data for " + filename + "...");
	$("#modal-cancel-button").hide();
	$("#modal-proceed-button").hide();
	
	// do headers
	var arr = [];
	for (var ifield=0; ifield<db_custom1to3_csv.length; ifield++)
   	{
		arr.push (db_custom1to3_csv[ifield].split("_").join(" "));
	}
	
	// process header row
	write_modal ("Writing header..");
	csv = csv + custom_function_process_row (arr);	

	// do rows
	for (var iteam=0; iteam<team_index_list.length; iteam++)
	{ 
		var arr = [];
		for (var ifield=0; ifield<db_custom1to3_csv.length; ifield++)
		{    
     		var val = G_team_database[team_index_list[iteam]][db_custom1to3_csv[ifield]];
     		if (val==null) val = "";
     		val = val.replace(/{SQUOTE}/g, "\'")
		    val = val.replace(/{DQUOTE}/g, '\"')
			arr.push (val.split("_").join(" "));	
		}
		csv = csv + custom_function_process_row (arr);
	}	
	
	write_modal ("writing " + csv.length + " bytes to file " + filename);
	var file = new File([csv], {});
	saveAs(file, filename);
}

//****************************************************************
// Custom Function 1 generate CSV for paid teams with runner names 
//****************************************************************

function custom_function_1()
{
	clear_and_display_modal();
	$("#modal-cancel-button").hide();
	$("#modal-proceed-button").hide();

	write_modal ("Checking database ...");
	
	var num_paidrunners = 0;
	var list_paidrunners = [];
	var num_paidnorunners = 0;
	var list_paidnorunners = [];
	var num_nopaidnorunners = 0;
	var list_nopaidnorunners = [];
	var num_other = 0;
	var list_other = [];
	
	for (var iteam=0; iteam<G_team_database.length; iteam++)
	{ 
		// paid and runners' names
		if ((G_team_database[iteam]["Payment_Status"]=="Paid") && (G_team_database[iteam]["Runner1"]!="None"))
		{
			num_paidrunners += 1;
			list_paidrunners.push (iteam);
		} 
		
		// paid and no runners' names
		else if ((G_team_database[iteam]["Payment_Status"]=="Paid") && (G_team_database[iteam]["Runner1"]=="None"))
		{
			num_paidnorunners += 1;
			list_paidnorunners.push (iteam);
		}
		 
		// paid and runners' names
		else if ((G_team_database[iteam]["Payment_Status"]!="Paid") && (G_team_database[iteam]["Runner1"]=="None"))
		{
			num_nopaidnorunners += 1;
			list_nopaidnorunners.push (iteam);
		}
		 
		// else not one of the above
		else
		{
			num_other += 1;
			list_other.push (iteam);
		}		
	}	
	
	write_modal ("Number paid with runners = " + num_paidrunners);	
	write_modal ("Number paid and no runners = " + num_paidnorunners);	
	write_modal ("Number not paid and no runners = " + num_nopaidnorunners);
	write_modal ("Number not paid with runners = " + num_other);

	custom_function_write_csv (list_paidrunners, "paidrunners.csv");
	show_modal_close();
}

//****************************************************************
// Custom function 2 generates a CSV for paid teams with no runners 
//****************************************************************

function custom_function_2()
{
	clear_and_display_modal();
	$("#modal-cancel-button").hide();
	$("#modal-proceed-button").hide();

	write_modal ("Checking database ...");
	
	var num_paidrunners = 0;
	var list_paidrunners = [];
	var num_paidnorunners = 0;
	var list_paidnorunners = [];
	var num_nopaidnorunners = 0;
	var list_nopaidnorunners = [];
	var num_other = 0;
	var list_other = [];
	
	for (var iteam=0; iteam<G_team_database.length; iteam++)
	{ 
		// paid and runners' names
		if ((G_team_database[iteam]["Payment_Status"]=="Paid") && (G_team_database[iteam]["Runner1"]!="None"))
		{
			num_paidrunners += 1;
			list_paidrunners.push (iteam);
		} 
		
		// paid and no runners' names
		else if ((G_team_database[iteam]["Payment_Status"]=="Paid") && (G_team_database[iteam]["Runner1"]=="None"))
		{
			num_paidnorunners += 1;
			list_paidnorunners.push (iteam);
		}
		 
		// paid and runners' names
		else if ((G_team_database[iteam]["Payment_Status"]!="Paid") && (G_team_database[iteam]["Runner1"]=="None"))
		{
			num_nopaidnorunners += 1;
			list_nopaidnorunners.push (iteam);
		} 	
		
		// else not one of the above
		else
		{
			num_other += 1;
			list_other.push (iteam);
		}	
	}	
	
	write_modal ("Number paid with runners = " + num_paidrunners);	
	write_modal ("Number paid and no runners = " + num_paidnorunners);	
	write_modal ("Number not paid and no runners = " + num_nopaidnorunners);
	write_modal ("Number not paid with runners = " + num_other);
	
	custom_function_write_csv (list_paidnorunners, "paidnorunners.csv");
	show_modal_close();
}

//*******************************************************************
// Custom function 3 generates a CSV for unpaid teams with no runners 
//*******************************************************************

function custom_function_3()
{
	clear_and_display_modal();
	$("#modal-cancel-button").hide();
	$("#modal-proceed-button").hide();

	write_modal ("Checking database ...");
	
	var num_paidrunners = 0;
	var list_paidrunners = [];
	var num_paidnorunners = 0;
	var list_paidnorunners = [];
	var num_nopaidnorunners = 0;
	var list_nopaidnorunners = [];
	var num_other = 0;
	var list_other = [];
	
	for (var iteam=0; iteam<G_team_database.length; iteam++)
	{ 
		// paid and runners' names
		if ((G_team_database[iteam]["Payment_Status"]=="Paid") && (G_team_database[iteam]["Runner1"]!="None"))
		{
			num_paidrunners += 1;
			list_paidrunners.push (iteam);
		} 
		
		// paid and no runners' names
		else if ((G_team_database[iteam]["Payment_Status"]=="Paid") && (G_team_database[iteam]["Runner1"]=="None"))
		{
			num_paidnorunners += 1;
			list_paidnorunners.push (iteam);
		}
		 
		// paid and runners' names
		else if ((G_team_database[iteam]["Payment_Status"]!="Paid") && (G_team_database[iteam]["Runner1"]=="None"))
		{
			num_nopaidnorunners += 1;
			list_nopaidnorunners.push (iteam);
		}
		 
		// else not one of the above
		else
		{
			num_other += 1;
			list_other.push (iteam);
		}		
	}	
	
	write_modal ("Number paid with runners = " + num_paidrunners);	
	write_modal ("Number paid and no runners = " + num_paidnorunners);	
	write_modal ("Number not paid and no runners = " + num_nopaidnorunners);
	write_modal ("Number not paid with runners = " + num_other);

	custom_function_write_csv (list_nopaidnorunners, "nopaidnorunners.csv");
	show_modal_close();
}

//**********************************************************
// Custom function 4 generates a CSV with useful information 
//**********************************************************

// custom function 4 fields
var db_custom4_csv = ["Team_Code",
					 "Team_Code_Num",
                     "Team_Name",
                     "Ordered_By",
                     "Team_Captain_First_Name",
                     "Team_Captain_Last_Name",
                     "Payment_Status",
                     "Email",
                     "Tel_Mobile",
                     "Which_Charities"
                     ];


// custom function 4 generate all teams csv file
function custom_function_4()
{
	clear_and_display_modal();
	$("#modal-cancel-button").hide();
	$("#modal-proceed-button").hide();

	write_modal ("Checking database ...");
	
	var list_allteams = [];
	var filename = "allteams.csv";
	
	for (var iteam=0; iteam<G_team_database.length; iteam++)
	{ 
		list_allteams.push (iteam);
	}	

	var csv = "";
	write_modal ("Building csv data for " + filename + "...");
	
	// do headers
	var arr = [];
	for (var ifield=0; ifield<db_custom4_csv.length; ifield++)
   	{
		arr.push (db_custom4_csv[ifield].split("_").join(" "));
	}
	
	// process header row
	write_modal ("Writing header..");
	csv = csv + process_row (arr);	

	// do rows
	for (var iteam=0; iteam<list_allteams.length; iteam++)
	{ 
		var arr = [];
		for (var ifield=0; ifield<db_custom4_csv.length; ifield++)
		{    
			if (db_custom4_csv[ifield]=="Team_Code_Num")
			{
				var val = G_team_database[list_allteams[iteam]]["Team_Code"];
				val = val.substr(4);
			}
			else
			{
	     		var val = G_team_database[list_allteams[iteam]][db_custom4_csv[ifield]];
     		}
     		if (val==null) val = "";
     		val = val.replace(/{SQUOTE}/g, "\'")
		    val = val.replace(/{DQUOTE}/g, '\"')
			arr.push (val.split("_").join(" "));	
		}
		csv = csv + process_row (arr);
	}	
	
	write_modal ("writing " + csv.length + " bytes to file " + filename);
	var file = new File([csv], {});
	saveAs(file, filename);
	show_modal_close();
}

//***************************************************
// Custom function 5 generates a CSV for E-mit timing  
//***************************************************

// custom function 5 fields
var db_custom5_csv = ["Team_Code",
					  "Team_Code_Num",
                      "Team_Name",
                      "Email",
                      "Tel_Mobile",
                     ];
                     
// custom function 5 generate csv file for E-MIT timing
function custom_function_5()
{
	clear_and_display_modal();
	$("#modal-cancel-button").hide();
	$("#modal-proceed-button").hide();

	write_modal ("Checking database ...");
	
	var filename = "emit.csv";
	var csv = "";
	write_modal ("Building csv data for " + filename + "...");
	
	// do headers
	var arr = [];
	for (var ifield=0; ifield<db_custom5_csv.length; ifield++)
   	{
		arr.push (db_custom5_csv[ifield].split("_").join(" "));
	}
	
	// process header row
	write_modal ("Writing header..");
	csv = csv + process_row (arr);	

	// do rows
	for (var iteam=0; iteam<G_team_database.length; iteam++)
	{ 
		var arr = [];
		for (var ifield=0; ifield<db_custom5_csv.length; ifield++)
		{    
			if (db_custom5_csv[ifield]=="Tel_Mobile")
			{
				var the_num = "";
     			var mobile_num = G_team_database[iteam]["Tel_Mobile"];
     			var home_num = G_team_database[iteam]["Tel_Home"];
     			var emit_num = G_team_database[iteam]["Tel_EMIT"];
     			if (emit_num!="") the_num = emit_num;
     			else if (mobile_num!="") the_num = mobile_num;
     			else if (home_num!="") the_num = home_num;
     			else 
     			{	
     				the_num = "";
     			}	
 				if (the_num!="")
 				{
 					if (the_num.substr(0,2)=="07")
 					{
 						the_num = "" + the_num;
 						 the_num = the_num.replace(/ /g, '');
 					}
 					else if (the_num.substr(0,1)=="7")
 					{
 						the_num = "0" + the_num;
 						the_num = the_num.replace(/ /g, '');
 					}
 					else
 					{
 						the_num = "NO MOBILE";
 					}
 				}    
 				else
 				{
 					the_num = "NO NUMBER";
 				}
 				arr.push (the_num.substr(0,5) + " " +  the_num.substr(5));	
			}
			
			// not mobile
			else
			{	
				if (db_custom5_csv[ifield]=="Team_Code_Num")
				{
     				var val = G_team_database[iteam]["Team_Code"];
     				console.log (val);
     				val = val.substr(4);
     			}
     			else
     			{
     				var val = G_team_database[iteam][db_custom5_csv[ifield]];
     			}
     			if (val==null) val = "";
     			val = val.replace(/{SQUOTE}/g, "\'")
				val = val.replace(/{DQUOTE}/g, '\"')
				arr.push (val.split("_").join(" "));	
			}
		}
		csv = csv + process_row (arr);
	}	
	
	write_modal ("writing " + csv.length + " bytes to file " + filename);
	var file = new File([csv], {});
	saveAs(file, filename);
	show_modal_close();
}

//******************************************************************
// Custom function 6 generates a CSV with runner names for programme 
//******************************************************************

function getval (iteam, field)
{
	var val = G_team_database[iteam][field];
	val = val.replace(/{SQUOTE}/g, "\'")
	val = val.replace(/{DQUOTE}/g, '\"')
	if (val.substr(0,1)==" ") val = val.substr(1);	
	return val;
}

function custom_function_6 ()
{
	var filename = "teams.txt";
	clear_and_display_modal();
	$("#modal-cancel-button").hide();
	$("#modal-proceed-button").hide();

	write_modal ("Custom function 7: create text file of team names for programme");
		
	L_docdata = "";
	
	L_docdata += "Team Listing\n\n"
	
	for (var iteam=0; iteam<G_team_database.length; iteam++)
    {
		L_docdata += G_team_database[iteam]["Team_Code"].substr(4) + " : " + getval(iteam, "Team_Name") + "\n";
    }
	L_docdata += "\n";
	
	L_docdata += "Team Details\n\n"
	
	for (var iteam=0; iteam<G_team_database.length; iteam++)
	{ 
		L_docdata += G_team_database[iteam]["Team_Code"].substr(4) + ". " + getval(iteam, "Team_Name") + "\n";
		L_docdata += 'Category: ' + G_team_database[iteam]["Team_Category"] + "\n";

		if (G_team_database[iteam]["Runner1"]=="None")
		{
			L_docdata += 'Team Captain: ' + getval(iteam, "Team_Captain_First_Name") + " " + getval(iteam, "Team_Captain_Last_Name") + "\n";
		}
		else
		{
			L_docdata += 'Team Captain: ' + getval (iteam, "Runner1") + "\n";
		}
		if (G_team_database[iteam]["Which_Charities"]!="")
		{
			L_docdata += 'Supporting ' + getval(iteam, "Which_Charities")  + "\n";
		}
		if (G_team_database[iteam]["Runner1"]=="None")
		{
			L_docdata += 'Team members\n';
			L_docdata += 'To be confirmed on Race Day\n';
		}
		else
		{
			L_docdata += 'Team members\n';
			L_docdata +=  getval(iteam, "Runner1") + '\n';
			if (G_team_database[iteam]["Runner2"]!="None")
			{
				L_docdata += getval(iteam, "Runner2") + '\n';
			}
			if (G_team_database[iteam]["Runner3"]!="None")
			{
				L_docdata += getval(iteam, "Runner3") + '\n';
			}
			if (G_team_database[iteam]["Runner4"]!="None")
			{
				L_docdata += getval(iteam, "Runner4") + '\n';
			}
			if (G_team_database[iteam]["Runner5"]!="None")
			{
				L_docdata += getval(iteam, "Runner5") + '\n';
			}
			if (G_team_database[iteam]["Runner6"]!="None")
			{
				L_docdata += getval(iteam, "Runner6") + '\n';
			}
			if (G_team_database[iteam]["Runner7"]!="None")
			{
				L_docdata += getval(iteam, "Runner7") + '\n';
			}
			if (G_team_database[iteam]["Runner8"]!="None")
			{
				L_docdata += getval(iteam, "Runner8") + '\n';
			}
			if (G_team_database[iteam]["Runner9"]!="None")
			{
				L_docdata += getval(iteam, "Runner9")+ '\n';
			}
			if (G_team_database[iteam]["Runner10"]!="None")
			{
				L_docdata += getval(iteam, "Runner10") + '\n';
			}
			if (G_team_database[iteam]["Reserve_Runners"]!="None")
			{
				L_docdata += getval(iteam, "Reserve_Runners") + ' (R)\n';
			}
		}
		L_docdata += '\n';
	}

	write_modal ("writing " + L_docdata.length + " bytes to file " + filename);
	var file = new File([L_docdata], {});
	saveAs(file, filename);
	show_modal_close();
}

//**********************************************************************
// Custom function 6 locates missing teams in the RCRT sequence (1..140)
//**********************************************************************
 
function custom_function_7()
{
	clear_and_display_modal();
	$("#modal-cancel-button").hide();
	$("#modal-proceed-button").hide();

	write_modal ("Custom function 7: Find missing teams in RCRT sequence  	 	 		 1..140)");
	
	for (var i=1; i<140; i++)
    {
    	var found = 0;
    	for (var iteam=0; iteam<G_team_database.length; iteam++)
    	{
    		var j = G_team_database[iteam]["Team_Code"].substr(4);
    		if (i==j)
    		{
    			found = 1;
    		}
		}
		if (found==0) 
    	{
			write_modal ("Team " + i + " not found");
    	}	
	}
	show_modal_close();
}

//***********************************************************
// Custom function 8 generates a CSV all teams and all fields 
//***********************************************************

// custom function 8 fields
var db_custom8_csv = ["Team_Code",
					 "Team_Code_Num",
                     "Team_Name",
                     "Team_Captain_First_Name",
                     "Team_Captain_Last_Name",
                     "Payment_Status",
                     "Email",
                     "Tel_Mobile",
                     "Tel_Home",
                     "Which_Charities",
                     "Team_Info"
                     ];


// custom function 8 generate all teams csv file
function custom_function_8()
{
	clear_and_display_modal();
	$("#modal-cancel-button").hide();
	$("#modal-proceed-button").hide();

	write_modal ("Checking database ...");
	
	var list_allteams = [];
	var filename = "alldata.csv";
	
	for (var iteam=0; iteam<G_team_database.length; iteam++)
	{ 
		list_allteams.push (iteam);
	}	

	var csv = "";
	write_modal ("Building csv data for " + filename + "...");
	
	// do headers
	var arr = [];
	for (var fieldName in G_team_database[0])
   	{
		arr.push (fieldName.split("_").join(" "));
	}
	
	// process header row
	write_modal ("Writing header..");
	csv = csv + process_row (arr);	

	// do rows
	for (var iteam=0; iteam<list_allteams.length; iteam++)
	{ 
		var arr = [];
		for (var fieldName in G_team_database[0])
		{    
			if (fieldName=="Team_Code_Num")
			{
				var val = G_team_database[list_allteams[iteam]]["Team_Code"];
				val = val.substr(4);
			}
			else
			{
	     		var val = G_team_database[list_allteams[iteam]][fieldName];
     		}
     		if (val==null) val = "";
     		console.log (fieldName);
			console.log (val);
			console.log (typeof(val));
			if (typeof(val)=="number") val = val.toString();
     		val = val.replace(/{SQUOTE}/g, "\'")
		    val = val.replace(/{DQUOTE}/g, '\"')
			arr.push (val.split("_").join(" "));	
		}
		csv = csv + process_row (arr);
	}	
	
	write_modal ("writing " + csv.length + " bytes to file " + filename);
	var file = new File([csv], {});
	saveAs(file, filename);
	show_modal_close();
}



//******************************************************************
// Custom function 9 generates a text file with useful info for PA  
//******************************************************************

function getval (iteam, field)
{
	var val = G_team_database[iteam][field];
	val = val.replace(/{SQUOTE}/g, "\'")
	val = val.replace(/{DQUOTE}/g, '\"')
	if (val.substr(0,1)==" ") val = val.substr(1);	
	return val;
}

function custom_function_9_old ()
{
	var filename = "teams.txt";
	clear_and_display_modal();
	$("#modal-cancel-button").hide();
	$("#modal-proceed-button").hide();

	write_modal ("Custom function 7: create text file of useful infor for PA");
		
	L_docdata = "";
	
	L_docdata += "Team Details\n\n"
	
	for (var iteam=0; iteam<G_team_database.length; iteam++)
	{ 
		
		L_docdata += "Team Running Number : " + G_team_database[iteam]["Team_Code"].substr(4) + "\n";
		L_docdata += "Team Name : " + getval(iteam, "Team_Name") + "\n";
		L_docdata += "Team Captain : " + G_team_database[iteam]["Ordered_By"] + "\n";
		L_docdata += "Team Info : " + getval(iteam, "Team_Info") + "\n";
		if (G_team_database[iteam]["Which_Charities"]!="")
		{
			L_docdata += "Supported Charity : "   + getval(iteam, "Which_Charities") + "\n";
		}
		if (G_team_database[iteam]["Charity_Info"]!="")
		{
			L_docdata += "Supported Charity Info : " + getval(iteam, "Charity_Info") + "\n";
		}
		L_docdata += '\n\n';
	}

	write_modal ("writing " + L_docdata.length + " bytes to file " + filename);
	var file = new File([L_docdata], {});
	saveAs(file, filename);
	show_modal_close();
}

//***********************************************************
// Custom function 9 generates a CSV file with team info 
//***********************************************************

// custom function 9 generate csv file with team info
function custom_function_9()
{
	clear_and_display_modal();
	$("#modal-cancel-button").hide();
	$("#modal-proceed-button").hide();

	write_modal ("Checking database ...");
	
	var list_allteams = [];
	var filename = "teaminfo.csv";
	
	for (var iteam=0; iteam<G_team_database.length; iteam++)
	{ 
		list_allteams.push (iteam);
	}	

	var csv = "";
	write_modal ("Building csv data for " + filename + "...");
	
	// do headers
	var arr = [];
	arr.push ("Running Number");
	arr.push ("Team Name");
	arr.push ("Team Captain");
	arr.push ("Team Info");
	arr.push ("Supported Charity");
	arr.push ("Supported Charity Info");
	
	// process header row
	write_modal ("Writing header..");
	csv = csv + process_row (arr);	

	// do rows
	for (var iteam=0; iteam<list_allteams.length; iteam++)
	{ 
		var arr = [];
		arr.push (G_team_database[iteam]["Team_Code"].substr(4));	
		arr.push (getval(iteam, "Team_Name"));
		arr.push (getval(iteam, "Ordered_By"));
		arr.push (getval(iteam, "Team_Info"));
		arr.push (getval(iteam, "Which_Charities"));
		arr.push (getval(iteam, "Charity_Info"));
		csv = csv + process_row (arr);
	}	
	
	write_modal ("writing " + csv.length + " bytes to file " + filename);
	var file = new File([csv], {});
	saveAs(file, filename);
	show_modal_close();
}




