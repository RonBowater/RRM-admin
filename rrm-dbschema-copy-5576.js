"use strict";


//******************//		
// Database fields  //		
//******************//

// masks to indicate which list set a field is in 
const GROUP_TEAM_STATUS             = 1;
const GROUP_REGISTRATION_INFO       = 3;
const GROUP_CONTACT_INFO            = 4;
const GROUP_TEAM_INFO               = 5;
const GROUP_CHARITY_INFO            = 6;
const GROUP_PAYMENT_INFO            = 7;
const GROUP_RUNNERS_INFO            = 8;

// database schema fields - static and initialized
const DB_SCHEMA_FIELD_NAME           = 0;  // Database field name
const DB_SCHEMA_ALL_GROUPS           = 1;  // field is in all groups if 1
const DB_SCHEMA_GROUP                = 2;  // which group a field is in 
const DB_SCHEMA_TYPE                 = 3;  // type of field CHAR, NUM, DATE
const DB_SCHEMA_ADMIN_HIDE_PROTECT   = 4;  // admin protect
const DB_SCHEMA_TEAM_HIDE_PROTECT    = 5;  // admin protect
const DB_SCHEMA_WIX_NAME             = 6;  // wix name
const DB_SCHEMA_VAREDIT_COLUMN       = 7;  // varedit column

// type field masks
var SCHEMA_TYPE_YESNO             = VAREDIT_TYPE_YESNO;
var SCHEMA_TYPE_TEXT              = VAREDIT_TYPE_TEXT;
var SCHEMA_TYPE_LONG_TEXT         = VAREDIT_TYPE_LONG_TEXT;
var SCHEMA_TYPE_DATE              = VAREDIT_TYPE_DATE;
var SCHEMA_TYPE_EMAIL             = VAREDIT_TYPE_EMAIL;

// schema itself - Team_Code must always be first entry
// note: numbering starts at zero so that subsequent fields
// have same number as wix fields

var DB_SCHEMA_WIX_FIRST_DB_NAME     = "Ticket_Number";  // wix first name into schema  
var DB_SCHEMA_WIX_LAST_DB_NAME      = "Gift_Aid";       // wix last name into schema  

var db_schema = [
/*
Database field name               All        Group                       Schema             Admin  Team  Wix field name        Display Column 
                                 groups                                   type              prot   prot  
*/
// following fields are in wix exported in this order

["Team_Code",                  	1, GROUP_REGISTRATION_INFO,       	SCHEMA_TYPE_TEXT,        "P",    "P", 	"Team code",             1 ],
["Ticket_Number",               0, GROUP_REGISTRATION_INFO,     	SCHEMA_TYPE_TEXT,        "P",    "P", 	"Ticket number",         1 ],
["Order_Number",                0, GROUP_REGISTRATION_INFO,     	SCHEMA_TYPE_TEXT,        "P",    "P", 	"Order number",          1 ],
["Ordered_By",                  1, GROUP_REGISTRATION_INFO,     	SCHEMA_TYPE_TEXT,        "P",    "P", 	"Ordered by",            1 ],
["Order_Date",                  0, GROUP_REGISTRATION_INFO,     	SCHEMA_TYPE_DATE,        "P",    "P", 	"Order date",            1 ],
["Payment_Status",              0, GROUP_PAYMENT_INFO,            	SCHEMA_TYPE_TEXT,        "P",    "P",   "Payment status",        1 ],
["Payment_Method",              0, GROUP_PAYMENT_INFO,            	SCHEMA_TYPE_TEXT,        "P",    "P",   "Payment method",        1 ],
["Ticket_Type",                 0, GROUP_REGISTRATION_INFO,         SCHEMA_TYPE_TEXT,        "P",    "P", 	"Ticket type",           2 ],
["Ticket_Price",                0, GROUP_REGISTRATION_INFO,    	    SCHEMA_TYPE_TEXT,        "P",    "P", 	"Ticket price",          2 ],
["Email",                       0, GROUP_CONTACT_INFO,      	  	SCHEMA_TYPE_EMAIL,       "",     "",    "Email",                 1 ],
["Checked_in",                  0, GROUP_CONTACT_INFO,      	  	SCHEMA_TYPE_TEXT,        "",     "H",   "Checked-in",            1 ],
["Tel_Mobile",                  0, GROUP_CONTACT_INFO,            	SCHEMA_TYPE_TEXT,        "",     "",    "Mobile Phone Number",   1 ],
["Tel_Landline",                0, GROUP_CONTACT_INFO,            	SCHEMA_TYPE_TEXT,        "",     "",    "Landline Phone Number", 1 ],
["Address",                     0, GROUP_CONTACT_INFO,            	SCHEMA_TYPE_TEXT,        "",     "",    "Address",               1 ],
["Team_Name",                   0, GROUP_TEAM_INFO,             	SCHEMA_TYPE_TEXT,        "",     "",    "Team Name",             1 ],
["Team_Info",                   0, GROUP_TEAM_INFO,               	SCHEMA_TYPE_LONG_TEXT,   "",     "",    "about your team?",      1 ],
["Entered_Before",              0, GROUP_REGISTRATION_INFO, 	  	SCHEMA_TYPE_TEXT,        "",     "",    "Marathon before?",      2 ],
["Team_Category",               0, GROUP_TEAM_INFO,         	  	SCHEMA_TYPE_TEXT,        "",     "",    "Team Category",         1 ],
["Decided_Charities",           0, GROUP_CHARITY_INFO,      	  	SCHEMA_TYPE_YESNO,       "",     "",    "which charities",       1 ],
["Which_Charities",             0, GROUP_CHARITY_INFO,      	  	SCHEMA_TYPE_TEXT,        "",     "",    "who they are?",         1 ], 
["Fundraising_Target",          0, GROUP_CHARITY_INFO,      	  	SCHEMA_TYPE_TEXT,        "",     "",    "fundraising target?",   1 ],
["Gift_Aid",                    0, GROUP_CHARITY_INFO,      	  	SCHEMA_TYPE_TEXT,        "",     "",    "Gift Aid",              1 ],
                 
// fields after this point are not in wix - additional in database
["Ordered_By_First_Name",       0, GROUP_REGISTRATION_INFO,     	SCHEMA_TYPE_TEXT,        "P",    "", 	"Ordered by",            1 ],
["Ordered_By_Last_Name",        0, GROUP_REGISTRATION_INFO,     	SCHEMA_TYPE_TEXT,        "P",    "", 	"Ordered by",            1 ],

["Charity_Info",      	        0, GROUP_CHARITY_INFO, 	 	        SCHEMA_TYPE_LONG_TEXT,   "",     "",    "Charity Info",          1 ],
["Tel_EMIT",                    0, GROUP_CONTACT_INFO,  	 	    SCHEMA_TYPE_TEXT,        "",     "",    "EMIT Notification Number",             1 ],
                 
// Grouping - 0 = single, 1 = first of multiple, 2 = rest of multiple
["Grouping",                    0, GROUP_REGISTRATION_INFO, 	    SCHEMA_TYPE_TEXT,        "",     "",    "Grouping",              2 ],  
                 	
// Special status e.g. Sponsor 	
["Special_Status",              0, 	GROUP_REGISTRATION_INFO, 	    SCHEMA_TYPE_TEXT,        "",    "",     "Special_Status",        2 ],
        
["Team_Captain_First_Name",     0, 	GROUP_TEAM_INFO,         	    SCHEMA_TYPE_TEXT,        "",    "",    "Team Captain First Name",             1 ],
["Team_Captain_Last_Name",      0, 	GROUP_TEAM_INFO,         	    SCHEMA_TYPE_TEXT,        "",    "",    "Team Captain Last Name",              1 ],

["Invoice_Number", 		        0, 	GROUP_PAYMENT_INFO,  		    SCHEMA_TYPE_TEXT,        "",    "",    "Invoice Number",              1 ],
["Date_Paid",                   0, 	GROUP_PAYMENT_INFO, 	        SCHEMA_TYPE_DATE,        "",    "",    "Date Paid",             1 ],
                 
// runners info
["Runner1", 					0, 	GROUP_RUNNERS_INFO, 		    SCHEMA_TYPE_TEXT,        "",    "",    "",              1 ],
["Runner2", 					0, 	GROUP_RUNNERS_INFO, 		    SCHEMA_TYPE_TEXT,        "",    "",    "",              1 ],
["Runner3", 					0, 	GROUP_RUNNERS_INFO, 		    SCHEMA_TYPE_TEXT,        "",    "",                   "",              1 ],
["Runner4", 					0, 	GROUP_RUNNERS_INFO, 		    SCHEMA_TYPE_TEXT,        "",    "",                   "",              1 ],
["Runner5", 					0, 	GROUP_RUNNERS_INFO, 		    SCHEMA_TYPE_TEXT,        "",    "",                   "",              1 ],
["Runner6", 					0, 	GROUP_RUNNERS_INFO, 		    SCHEMA_TYPE_TEXT,        "",    "",                   "",              2 ],
["Runner7", 					0, 	GROUP_RUNNERS_INFO, 		    SCHEMA_TYPE_TEXT,        "",    "",                   "",              2 ],
["Runner8", 					0, 	GROUP_RUNNERS_INFO, 		    SCHEMA_TYPE_TEXT,        "",    "",                   "",              2 ],
["Runner9", 					0, 	GROUP_RUNNERS_INFO, 		    SCHEMA_TYPE_TEXT,        "",    "",                  	"",              2 ],
["Runner10", 					0, 	GROUP_RUNNERS_INFO, 		    SCHEMA_TYPE_TEXT,        "",    "",                  	"",              2 ],
["Reserve_Runners", 			0, 	GROUP_RUNNERS_INFO, 		    SCHEMA_TYPE_TEXT,        "",    "",                  	"",              1 ]
				];                 
  
