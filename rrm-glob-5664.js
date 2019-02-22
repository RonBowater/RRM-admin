"use strict";
 
var G_TEAM_CODE_PREFIX_LENGTH=4; 
var G_TEAM_CODE_PREFIX = "RCRT";
 
/* main database */
var G_team_database;            
var G_team_database_data_valid;

// booking state  
/*
var STATE_MASK_Registered_Paid_Date = 1;             // date that team was registered as paid by wix sync 
var STATE_MASK_Booking_UnPaid_Msg_Date = 2;          // date that booking confirm unpaid message was sent  
var STATE_MASK_Booking_Paid_Msg_Date = 4;            // date that booking confirm paid message was sent
var STATE_MASK_Payment_Status_Paid = 8;              // actual payment status 
var STATE_MASK_Offline_Paid_Confirmation_Date = 16;  // date that OPC message was sent
var STATE_MASK_Payment_Reminder_1_Date = 32;         // payment reminder 1 sent
var STATE_MASK_Payment_Reminder_2_Date = 64;         // payment reminder 2 sent
var STATE_MASK_Payment_Final_Reminder_Date = 128;    // final payment reminder sent 
 
// team booking states
var BSTATE_BOOKED_UNPAID_NO_MSG=0; // can send BCU
var BSTATE_BOOKED_UNPAID_BCU_SENT=2; // waiting for payment

var BSTATE_BOOKED_UNPAID_BCU_SENT_PAYR1_SENT=2+32; // waiting for payment, payment reminder 1 sent
var BSTATE_BOOKED_UNPAID_BCU_SENT_PAYR1_PAYR2_SENT=2+32+64; // waiting for payment, payment reminders 1 and 2 sent
var BSTATE_BOOKED_UNPAID_BCU_SENT_PAYR1_PAYR2_PAYRF_SENT=2+32+64+128; // waiting for payment, payment reminders 1, 2 and final sent

var BSTATE_BOOKED_UNPAID_BCU_SENT_PAID_OFFLINE=1+2+8; // can send OPC
var BSTATE_BOOKED_UNPAID_BCU_SENT_PAID_OFFLINE_OPC_SENT=1+2+8+16; // no more booking messages needed

var BSTATE_BOOKED_PAID_PAYPAL_NO_MSG=1+8; // can send BCP 
var BSTATE_BOOKED_PAID_PAYPAL_BCP_SENT=1+4+8; // no more booking messages needed

// following state switches change when offline payment is made to simplify  
var state_switch = [[BSTATE_BOOKED_UNPAID_BCU_SENT_PAYR1_SENT + BSTATE_BOOKED_UNPAID_BCU_SENT_PAID_OFFLINE,  BSTATE_BOOKED_UNPAID_BCU_SENT_PAID_OFFLINE],
 					[BSTATE_BOOKED_UNPAID_BCU_SENT_PAYR1_PAYR2_SENT + BSTATE_BOOKED_UNPAID_BCU_SENT_PAID_OFFLINE,  BSTATE_BOOKED_UNPAID_BCU_SENT_PAID_OFFLINE],
 					[BSTATE_BOOKED_UNPAID_BCU_SENT_PAYR1_PAYR2_PAYRF_SENT + BSTATE_BOOKED_UNPAID_BCU_SENT_PAID_OFFLINE,  BSTATE_BOOKED_UNPAID_BCU_SENT_PAID_OFFLINE]];
*/

var G_admin_mode;

var G_teams_paid;
var G_teams_unpaid;
var G_have_runners;
var G_total_entry_fees;

var G_xhr;  
var G_current_view;

var G_content_width;
var G_content_height;
var G_loading_in_progress;

var G_wix_data;

var G_info_settings; 
var G_settings_valid;
  
var G_functions_template=null; 
var G_commands_template=null;  
var G_content_template=null;  
  
var G_team_code_order_max;
var G_selected_team;
var G_selected_team_index;
var G_global_team_code;
var G_add_or_edit;

var G_filter_active = 0;
 
 // views themselves
var G_EditTeamView; 
var G_TeamsView;
var G_ListTeamsView;
var G_LoginView;
var G_DashboardView;
var G_DocumentsView;  
var G_EditMsgsView;
var G_EditSingleMsgView;
var G_SendMsgView;
var G_TestMsgView;
var G_MsgMultTeamsView;
var G_EditMultTeamsView;
var G_SettingsView;
var G_ExportTeamsView;
var G_ImportTeamsView;
var G_SyncTeamsView;
var G_TeamActionsView;
var G_CustomFuncsView;
var G_SendEmailView;

// view definitions
var G_EditTeamView_Definition; 
var G_TeamsView_Definition;
var G_ListTeamsView_Definition;
var G_LoginView_Definition;
var G_DashboardView_Definition; 
var G_DocumentsView_Definition; 
var G_EditMsgsView_Definition;
var G_EditSingleMsgView_Definition;
//var G_SendMsgView_Definition;
var G_MsgMultTeamsView_Definition;
var G_EditMultTeamsView_Definition;
var G_SettingsView_Definition;
var G_ExportTeamsView_Definition;
var G_ImportTeamsView_Definition;
var G_SyncTeamsView_Definition;
var G_TeamActionsView_Definition;
var G_CustomFunctions_Definition;
var G_SendEmailView_Definition;

// views in rrm_events.js
var G_EventsListView;
var G_EventEditView;
var G_EventsListView_Definition;
var G_EventEditView_Definition;

// message clipbaord
var G_clipboard_msg_id;  
var G_clipboard_msg_code; 
var G_clipboard_msg_html;  
var G_clipboard_msg_subject; 		
var G_clipboard_msg_description;  

// categories
var CAT_TEAM_ALL   = 0; 
var CAT_TEAM_UNCAT = 1;

// event types
var EVENT_TYPE_ADD_WIX_TO_DB      = 1;
var EVENT_TYPE_ADD_MANUALLY_TO_DB = 2;
var EVENT_TYPE_DELETE_FROM_DB     = 3;
var EVENT_TYPE_MESSAGE_SENT       = 4;

//********************//		
// Filterable fields  //		
//********************//  
  
// filter fields
var DB_FILTER_FIELD_NAME          = 0;  // Database field name
var DB_FILTER_TEXT                = 1;	// text for filter
var DB_FILTER_OPTION_1_LABEL      = 2;	// option 1 label
var DB_FILTER_OPTION_1_VALUE      = 3;	// option 1 value
var DB_FILTER_OPTION_2_LABEL      = 4;	// option 1 label
var DB_FILTER_OPTION_2_VALUE      = 5;	// option 1 value
var DB_FILTER_VALUE               = 6;	// filter value "" if not in filter else match value to allow through

// filter controls
var db_filter = [["Entered_Before", "Team have entered before", "Have Entered Before", "Yes", "Have Not Entered Before", "No", ""],
                 ["Payment_Status", "Payment Status",          "Have Paid",           "Paid", "Have Not Paid",          "Unpaid", ""],
                 ["Runner1",        "Runners Names",           "Provided",           "!None", "Have Not Provided",      "None", ""],  
                 ["Tel_Mobile",     "Mobile or Emit Phone Number",     "Provided",           "#MOB",  "Have Not Provided",      "!#MOB", ""]                                 
                ];              
                
//********************//		
// Exportable fields  //		
//********************//	                  
                 
// export fields
var DB_EXPORT_FIELD_NAME          = 0;  // Database field name
var DB_EXPORT_TEXT                = 1;  // Text
var DB_EXPORT_ALWAYS_IN_EXPORT    = 2;	// always in export if 1

// export controls
var db_export = [["Team_Code", "Team Code", 1],
                 ["Team_Name", "Team Name", 0],
                 ["Team_Captain_First_Name", "Team Captain First Name", 0],
                 ["Team_Captain_Last_Name", "Team Captain Last Name", 0],
                 ["Email", "Email", 0],
                 ["Tel_Mobile", "Mobile Phone", 0],
                 ["Tel_Landline", "Landline Phone", 0],
                 ["Address", "Address", 0]
                ];
     
		  
//******************************//		
// Defaults for add to database //		
//******************************//		
					
// defaults used for add to datab
var DB_DEFAULTS_DB_NAME           = 0;  // DB Field name
var DB_DEFAULTS_INIT_VALUE        = 1;  // init value
                
// inport mapping (WIX to database)
var db_add_defaults =  [["Ticket_Number", "Manually Added"],
						["Order_Number", "Manually Added"],
						["Ordered_By", "Ron Bowater"],
						["Order_Date", "DATE"],
						["Payment_Status", "Unpaid"],
						["Entered_Before","No"] 
						];
						
//*****************//		
// Settings values //		
//*****************//						
						
// settings database definition fields
var DB_SETTINGS_DB_NAME           = 0;  // DB Field name
var DB_SETTINGS_TITLE             = 1;  // title
var DB_SETTINGS_TYPE              = 2;  // type
var DB_SETTINGS_CHANGED           = 3;  // changed flag
var DB_SETTINGS_NEWVAL            = 4;  // new value (on screen)

// settings in DB
var db_settings =  [["Test_Email_Address", "Test Email Address", VAREDIT_TYPE_TEXT],
					["Test_Email_Name", "Test Email Name", VAREDIT_TYPE_TEXT],
					["Test_SMS_Number", "Test SMS Number", VAREDIT_TYPE_TEXT],
					["Test_First_Name", "Test First Name", VAREDIT_TYPE_TEXT],
					["Test_Last_Name", "Test Last Name", VAREDIT_TYPE_TEXT],
					["Test_Team_Code", "Test Team Code", VAREDIT_TYPE_TEXT],
					["Test_Team_Name", "Test Team Name", VAREDIT_TYPE_TEXT], 
					["Wix_Update_Notification_Email", "Wix Update Notification Email", VAREDIT_TYPE_TEXT], 
					["Wix_Update_Notification_Name", "Wix Update Notification Name", VAREDIT_TYPE_TEXT] 
				   ];
					
//*******************//		
// Events Log values //		
//*******************//						
						
// events database definition fields
var DB_EVENTS_DB_NAME           = 0;  // DB Field name
var DB_EVENTS_TITLE             = 1;  // title
var DB_EVENTS_TYPE              = 2;  // type
                
// events in DB
var db_events =  [["Team_Code", "Team Code", ""],
				  ["Date_Time", "Date/Time Event Logged", "DATETIME"],
				  ["Event_Type", "Event Type", "EVENTTYPE"],
				  ["Info", "Additional Info", ""]
				 ];
				 
//**********//		
// Messages //		
//**********//						
						
// messages definition fields
var DB_MESSAGE_CODE             = 0;  // Message code
var DB_MESSAGE_DESCRIPTION      = 1;  // Description
var DB_MESSAGE_DB_FIELD         = 2;  // DB field name
var DB_MESSAGE_STATE_ALLOWED    = 3;  // DB state validity

// events in DB
var db_messages = 
[
["BCP", "Booking Confirmation Paid", "Booking_Paid_Msg_Date", 0],
["BCU", "Booking Confirmation Unpaid", "Booking_UnPaid_Msg_Date", 0],
["OPC", "Offline Paid Confirmation", "Offline_Paid_Confirmation_Date", 0]
];				 
					
					
