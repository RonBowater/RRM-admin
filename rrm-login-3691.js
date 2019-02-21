"use strict";

var L_username;
var L_password;

//=============================================================
//   LOGIN VIEW 
//=============================================================

G_LoginView_Definition = Backbone.View.extend(
{
    // initialize
    initialize: function () 
    {
        _.bindAll(this, 'render', 'doProceed', 'doProceed1', 'doCancel', 'doFunction'); 
        this.on('doProceed1', this.doProceed1, this);
        this.on('doProceed', this.doProceed, this);
        this.on('doFunction', this.doFunction, this);
        this.on('doCancel', this.doCancel, this);
        this.on('escKey', this.doCancel, this);
    }, 
      
    // render   
   	render: function () 
    {	
    	// activate the login body
		document.getElementsByTagName('body')[0].style = 
		"color: #fff;" +  
		"background: #222 url('wp-content/themes/Relay_Marathon_Theme/images/bg-login.gif');";
	
		// activate the template
		var template = $("#T-login-structure").html();
		$("div.root-div").html(_.template(template,{}))
	
		loginFormModel.set('username',  "");
		loginFormModel.set('password',  "");
	
		// output the form 
		var myform1 = new loginForm({ el: $("#loginForm") });
		myform1.render();
    },
    
    // doProceed
   	doProceed: function () 
    {	
		L_username = loginFormModel.get('username');
		L_password = loginFormModel.get('password');

		if (L_username==undefined) L_username="";
		if (L_password==undefined) L_password="";
		if (L_username.length==0) { loginFormModel.errorModel.set({'username': "Username is missing"}); return;}
		if (L_password.length==0) { loginFormModel.errorModel.set({'password': "Password is missing"}); return;}
	 
		do_check_pw (L_username, L_password, this.doProceed1);    	
    },
    
     // doProceed1
   	doProceed1: function (data) 
    {
		if (data=="NU")
		{
			loginFormModel.errorModel.set({'username': "Username is not in database"}); 
			return; 
		}
		else if (data=="NP")
		{
			loginFormModel.errorModel.set({'password': "incorrect password for user"}); 
			return; 
		}
		else
		{
			// check if database is currently locked
			var mysql = "SELECT * from RRM_Lock";
			do_sql (mysql, proceed_after_get_lock, "");
		}	
    },  

    // doCancel  
   	doCancel: function () 
    {	
    	// not used
    },
    
    // dofunction  
   	doFunction: function (n) 
    {	
    	// not used
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

// go here after get lock 
function proceed_after_get_lock (response) 
{	
	var lockval = response['data'];	
	var lockedUser = lockval[0].LockedUser;

	// if unlocked, get lock
	if (lockedUser=="None") 
	{
		// lock the database with this user id
		var mysql = "UPDATE RRM_Lock SET " 
		mysql = mysql + "LockedUser" + "='" + L_username + "'";
		mysql = mysql + " WHERE ID=1";
		do_sql (mysql, proceed_lock_1, "");	 
		return;
	}
	
	// else check for locked by a different user
	else if (lockedUser!=L_username) 
	{
		alert ("Database is locked by a different user " + lockedUser);
		return;
	}
	
	// else locked by this same user
	else
	{
		Cookies.set('RRM-Admin', '1', { expires: 7 });
		CI.run() 
		return;	
	}
}

// go here after lock got for this user
function proceed_lock_1 (response) 
{
	Cookies.set('RRM-Admin', '1', { expires: 7 });
	CI.run() 
}

// function to call server to check userid and password */
function do_check_pw (username, password, callback)
{
	G_xhr = $.ajax(
	{
		dataType: 'json',
		url: '../wp-json/check_pw', 
		data: 
		{
			db_key : G_db_access_code,
			db_username : username,
			db_password : password
		}, 
		success: function (response) 
		{	
			if (response['success'] == true)
			{
				callback(response['data']);
			} 
			else if (response['success'] == false)
			{
				alert ("Select success false msg = " + response['msg']);
			}
			else  
			{
				alert ("Select " + response['success'] + " false msg = " + response['msg']);
			} 
		},
		error: function (data)
		{
			alert ("Error running do_rest function");
		}
	});	
	return 0;
}
 
// called on logoff request
function logoff ()
{
	// unlock the database  
	var mysql = "UPDATE RRM_Lock SET " 
	mysql = mysql + "LockedUser" + "='" + "None" + "'";
	mysql = mysql + " WHERE ID=1";
	do_sql (mysql, proceed_unlock, "");	 	
}  

// called when DB unlocked
function proceed_unlock ()
{
	Cookies.remove("RRM-Admin");
	CI.run();
}
 
/**************/
/* login form */
/**************/

/* settings form model definition */
var d_loginForm = Backbone.Model.extend({});

/* settings form model instance */
var loginFormModel = new d_loginForm({});
   	
/* login form  */
var loginForm = Backform.Form.extend
({
  	model: 	loginFormModel,
  	fields: 
  	[
		{name: "username", label: "Username", control: "input"},
		{name: "password", label: "Password", control: "input"}
	]
});
