"use strict";

//********************
// TEAM ACTIONS VIEW
//******************** 


G_TeamActionsView_Definition = Backbone.View.extend(
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
    	setup_view ("U", "", "T-Commands-Logoff", "T-Team-Actions-Content"); 
	
		team_actions();
	},
	
	// doCancel  
   	doCancel: function () 
    {	
    	alert ("ERROR : G_TeamActionsView doCancel");
    },
    
    // terminate  
   	terminate: function () 
    {	
    	// no action
    },
    
    
    // dofunction - mouse click entry point  
   	doFunction: function (func) 
    {
		// error			
		{
			alert ("Undecoded Team Actions Function " + func);	
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

// main function handler
function team_actions()
{

	var scolumns = [];
	var acolumn = 0;
	
	acolumn = {name:"Team_Code", title: "Team Code"};  
	scolumns.push (acolumn);
	acolumn = {name:"Action", title: "Action"};  
	scolumns.push (acolumn); 

	// loop all teams
	var srows = [];
	var arow = 0;
	for (var ix=0; ix<G_team_database.length; ix++)
	{    
		var team_code = G_team_database[ix]["Team_Code"];
		
		var actions="<ol style='padding:0px;margin:0px;'>";
		var num_actions = 0;
		
		// booking status depends upon 4 fields
		var vx = 0;
		if (G_team_database[ix]["Registered_Paid_Date"]!="0000-00-00 00:00:00") vx = vx + 1;
		if (G_team_database[ix]["Booking_UnPaid_Msg_Date"]!="0000-00-00 00:00:00") vx = vx + 2;
		if (G_team_database[ix]["Booking_Paid_Msg_Date"]!="0000-00-00 00:00:00") vx = vx + 4;
		if (G_team_database[ix]["Payment_Status"]=="Paid") vx = vx + 8;
		
		// decode the booking status
		switch (vx)
		{
			case 0: actions = actions + "<li style='padding:0px;margin:0px;color:red;'>Send booking paid confirmation email</li>"; break;
			case 8: actions = actions + "<li style='padding:0px;margin:0px;color:red;'>Send booking unpaid confirmation email</li>"; break;
		}
		
		// check if we have a team name
		if (G_team_database[ix]["Team_Name"]=="")
		{
			actions = actions + "<li style='padding:0px;margin:0px;'>Team Name missing</li>";
			num_actions = num_actions + 1;
		}	
		
		// check if we have supporting charities
		if (G_team_database[ix]["Which_Charities"]=="")
		{
			actions = actions + "<li style='padding:0px;margin:0px;'>Supported Charities Missing</li>";
			num_actions = num_actions + 1;
		}	
		actions = actions + "</ol>";
		
		if (num_actions==0)
		{
			var actions="<p style='padding:0px;margin:0px;'>No actions needed</p>";
		}
			
		var s = "arow = {";	 
		s = s + 'Team_Code :"' + team_code + '",'; 
		s = s + 'Action :"' + actions  + '",';
		s = s + "};";
		eval (s);
		srows.push (arow);
	}
	
	// display data
	jQuery(function($){
		$('#actions-table').footable({
			"paging": {"size": 20},
			"toggleColumn": "first",
			"columns": scolumns,
			"rows": srows
		});
	});	
	
	$(".footable-filtering-search").hide();
}