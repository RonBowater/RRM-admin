"use strict";

/********************/
/* Global variables */
/********************/

var G_liquid_engine;
var G_call_stack = [];
var G_current_view;
var G_xhr;  
var G_views_template=null; 
var G_commands_template=null;  
var G_content_template=null;
var G_db_access_code;  

/****************************************/
/* simple encrypt and decrypt functions */
/****************************************/

var key = "SXGWLZPDOKFIVUHJYTQBNMACERxswgzldpkoifuvjhtybqmncare";
// matches ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ

function encodeStr(uncoded) 
{
  	uncoded = uncoded.toUpperCase().replace(/^\s+|\s+$/g,"");
  	var coded = "";
  	var chr;
  	for (var i = uncoded.length - 1; i >= 0; i--) 
  	{
    	chr = uncoded.charCodeAt(i);
    	coded += (chr >= 65 && chr <= 90) ? key.charAt(chr - 65 + 26*Math.floor(Math.random()*2)) : String.fromCharCode(chr); 
	}
  	return encodeURIComponent(coded);  
}

function decodeStr(coded)
{
  	coded = decodeURIComponent(coded);  
  	var uncoded = "";
  	var chr;
  	for (var i = coded.length - 1; i >= 0; i--) 
  	{
    	chr = coded.charAt(i);
    	uncoded += (chr >= "a" && chr <= "z" || chr >= "A" && chr <= "Z") ? String.fromCharCode(65 + key.indexOf(chr) % 26) : chr; 
    }
  	return uncoded;   
}    

/********************/
/* cookie functions */
/********************/

function getCookie(name) 
{
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}

function setCookie(name, value, days) 
{
    var d = new Date;
    d.setTime(d.getTime() + 24*60*60*1000*days);
    document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
}

function deleteCookie(name) 
{ 
	setCookie(name, '', -1); 
}

/*********************/
/* clickit functions */
/*********************/

function view_clickit_cancel()    { if (G_current_view != null) G_current_view.trigger('doCancel',  ""); }
function view_clickit_proceed()   { if (G_current_view != null) G_current_view.trigger('doProceed', ""); }
function view_clickit_function(n) { if (G_current_view != null) G_current_view.trigger('doFunction', n); } 

//*****************************************************************
// do_logoff_request gets called when user clicks the logoff button
//*****************************************************************

// do_logoff called with val=0 ask before logoff, 1=definitely do logoff
// returns 1 if logged off or 0 if not 
function do_logoff (val)
{
	if (val==0)
	{
		if (confirm("Do you wish to continue with logoff")) 
    	{
        	val = 1;
        } 
	}
	if (val==1)
	{
		Cookies.remove("RRM-Admin");
          
		// clear the access cookie
		deleteCookie('RRM-Access-Date');	
	
		// call the login app
		location.href = "https://www.romseymarathon-admin.co.uk";
	      
		// and run the logon app
		CI.run();
		
		// and return
		return;
	}
	return val;
}

/*********************************************************************/
/* setup views for functions, commands and content view using Liquid */
/*********************************************************************/
var G_setup_view_type;       

function setup_content_html(html)
{		
	$("#content").html(html);	
	G_setup_view_type[1]();
}
       
function setup_view (type, views, commands, content)
{
	G_setup_view_type = type;
	
	// setup the views div (always underscore) 
	if (views!="")
	{
		var template = $("#" + views).html();
		$("#views-div").html(_.template(template,{}));
		$(".func-nav-list li a.current").parent().find("ul").slideToggle("slow");
		$(".func-nav-list li a.nav-top-item").click(function(){$(this).parent().siblings().find("ul").slideUp("normal");$(this).next().slideToggle("normal");return false;});
		$(".func-nav-list li a.no-submenu").click(function(){window.location.href=(this.href);return false;});
		$(".func-nav-list li .nav-top-item").hover(function(){$(this).stop().animate({paddingRight:"25px"},200);},function(){$(this).stop().animate({paddingRight:"15px"});});
	}

	// setup the commands div (always underscore)
	if (commands!="")
	{
		var template = $("#" + commands).html();
		$("#commands-div").html(_.template(template,{}));
		$(".cmd-nav-list li a.current").parent().find("ul").slideToggle("slow");
		$(".cmd-nav-list li a.nav-top-item").click(function(){$(this).parent().siblings().find("ul").slideUp("normal");$(this).next().slideToggle("normal");return false;});
		$(".cmd-nav-list li a.no-submenu").click(function(){window.location.href=(this.href);return false;});
		$(".cmd-nav-list li .nav-top-item").hover(function(){$(this).stop().animate({paddingRight:"25px"},200);},function(){$(this).stop().animate({paddingRight:"15px"});});
	}
	
	// setup the content div (underscore or liquid)
	if (content!="")
	{
		// do liquid if not underscore (async callback)
		if (type!="U")
		{
			G_content_template = content; 
			var template = document.querySelector("#" + content)
			
			var engine = new Liquid()
        	engine
	       		.parseAndRender(template.innerHTML, type[0])
		  		.then(setup_content_html)
		}
		
		// else underscore (synchronous return)
		else
		{
			var template = $("#" + content).html();
			$("#content").html(_.template(template,{}));	
		}
	}
}	

/****************************/  
/* Date conversion routines */
/****************************/  
 
var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// convert e.g. 2015-8-21 to 21 Aug 2015  
function format_y_m_d_to_d_mname_y (d) 
{
    d = d.split('-');
    return d[2] + ' ' + monthNames[d[1]-1] + ' ' + d[0];
};

// convert e.g. 2015-8-21 to 21/08/15  
function format_y_m_d_to_d_m_y (d) 
{
    d = d.split('-');
    return d[2] + '/' + d[1] + '/' + d[0];
};

// convert e.g. 21-8-2015 to 21 Aug 2015  
function format_d_m_y_to_d_mname_y (d) 
{
    d = d.split('-');
    return d[0] + ' ' + monthNames[d[1]-1] + ' ' + d[2];
};

// convert e.g. 21-8-2015 to 2015-08-21 
function format_d_m_y_to_y_m_d (d) 
{
    d = d.split('-');
    return d[2] + '-' + d[1] + '-' + d[0];
};

// format javascript date object to 21 Aug 2015  
function format_date_to_d_mname_y (d) 
{
    return d.getDate().toString() + ' ' + monthNames[d.getMonth()] + ' ' + d.getFullYear().toString();
};

// convert e.g. 21 Aug 2015 to 21-8-2105  
function format_d_mname_y_to_d_m_y (d) 
{
	MyDate = new Date(d)
	MyDateString = ('0' + MyDate.getDate()).slice(-2) + '-' + ('0' + (MyDate.getMonth()+1)).slice(-2) + '-' + MyDate.getFullYear();
    return MyDateString; 
};

// convert e.g. 21 Aug 2015 to 2015-8-21  
function format_d_mname_y_to_y_m_d (d) 
{
	MyDate = new Date(d);
	MyDateString = MyDate.getFullYear() + '-' + ('0' + (MyDate.getMonth()+1)).slice(-2) + '-' + ('0' + MyDate.getDate()).slice(-2);
	return MyDateString; 
}

// mysql to dd mname yyyy
function mysql_to_dd_mname_yyyy (mysql_string)
{ 
   var t, d, result = null;

   	if( typeof mysql_string == 'string' )
   	{
    	t = mysql_string.split(/[- :]/);
      	d = new Date(t[0], t[1]-1, t[2]); 
      	result = ('0' + d.getDate()).slice(-2) + ' ' + monthNames[d.getMonth()] + ' ' + d.getFullYear().toString();         
   	}
   	else
   	{
   		alert ("mysql_string is not string");
   	}

   return result;   
}

//dd mname yyyy to mysql
function dd_mname_yyyy_to_mysql (date_string)
{	
	var d = new Date(date_string);
	d = d.getFullYear() + '-' + ('0' + (d.getMonth()+1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2) + " 00:00:00";
	return d;
}
 
// get current date in SQL format 
function get_current_sql_date()
{ 
	var date;	
	date = new Date();
	date = date.getUTCFullYear() + '-' +
    ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
    ('00' + date.getUTCDate()).slice(-2) + ' ' + 
    ('00' + date.getUTCHours()).slice(-2) + ':' + 
    ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
    ('00' + date.getUTCSeconds()).slice(-2); 
 	return (date);
 }
 
// get days two dates are apart 
function get_days_apart_text (newer, older) 
{
 	let a = moment(newer);
	a.set({hour:0,minute:0,second:0,millisecond:0});
	let b = moment(older);
	b.set({hour:0,minute:0,second:0,millisecond:0});
	let diff = a.diff(b, 'days');
	let difftext = diff + " days ago";

	if (diff==0)
	{
		difftext = "Today";
	}

	else if (diff==1)
	{
		difftext = "Yesterday";
	}
 	return (difftext);
 }
 
/********************/ 
/* email validation */
/********************/
  
function validateEmail(email) 
{
  var re = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
  return re.test(email);
} 

/*************************/
/* convert string to hex */
/*************************/

function toHex(str)
{
	var hex = '';
	for(var i=0;i<str.length;i++) {
		hex += ''+str.charCodeAt(i).toString(16);
	}
	return hex;
}

/***************************************************/  
/*  Run SQL on the database and return to callback */
/***************************************************/

function do_sql (mysql, callback, parm)
{
	if (G_running_on_gas==true)
	{
		alert ("do_sql not allowed .. running on gas\n" + mysql);
		return
	}

	if (G_admin_mode=="RO")
	{
		if ((mysql.substr(0,6)=="UPDATE") || (mysql.substr(0,6)=="INSERT") || (mysql.substr(0,6)=="DELETE"))
		{
			alert ("Cannot update database .. admin is in read only mode\nClick OK to continue");
			callback("ERROR");
		}
	}

	//mysql = json_encode(mysql);
	G_xhr = $.ajax(
	{
		dataType: 'json',
		timeout: 0,
		url: '../wp-json/doSQL', 
		data: 
		{
			db_parm: parm,
			db_sql : mysql,
			db_key : G_db_access_code
		}, 
		success: function (response) 
		{	
			if (response['success'] == true)
			{
				if (callback != undefined)
				{
					callback (response);
				}
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
	return 0;
}

//*************************************************************** 
// Function: send_generic message
//
// Sends a message in one of a number of ways  
//*************************************************************** 

function send_generic_message (name_values, callback)
{
	var resp;
	
	if (G_running_on_gas==true)
	{
		alert ("send_generic_message not possible .. running on gas");
		return
	}
	
	if (G_admin_mode=="RO")
	{
		if ((mysql.substr(0,6)=="UPDATE") || (mysql.substr(0,6)=="INSERT") || (mysql.substr(0,6)=="DELETE"))
		{
			alert ("Cannot send messages .. admin is in read only mode\nClick OK to continue");
			callback("ERROR");
		}
	}

	G_xhr = $.ajax(
	{
		dataType: 'json',
		timeout: 12000,
		url: '../wp-json/send_generic_message', 
		data: 
		{
			db_name_values : JSON.stringify(name_values),
			db_key         : G_db_access_code 
		}, 
		success: function (response) 
		{	
			if (response['success'] == true)
			{
				resp = "send_generic_message success=true msg = " + response['msg'];
				console.log (resp);
			} 
			else if (response['success'] == false)
			{
				resp = "send_generic_message success=false msg = " + response['msg'];
				console.log (resp);
				alert (resp);
			}
			else  
			{
				resp = "send_generic_message " + response['success'] + " false msg = " + response['msg'];
				console.log (resp);
			} 
			if (callback != undefined)
			{
			    console.log (resp);
				callback (response['msg']);
			}
		},
		error: function (response)
		{
			resp = "send_generic_message Error returned";
			console.log (resp);
			console.log (response);
			if (callback != undefined)
			{
				callback (response['msg']);
			}
		}
	});
	return 0;
}


/*************************/
/* common initialization */
/*************************/

function CommonInit()
{
	// create the liquid engine
	var G_liquid_engine = new Liquid()
	
	G_current_view = null;
	
	G_db_access_code = btoa("020380");
}

var L_modal_text;

/****************************/  
/* Modal routines           */
/****************************/  
 
function clear_and_display_modal ()
{
	$("#myModal").modal();
	$("#modal-text" ).html("");
	L_modal_text = "";
	$("#modal-close-button").hide();
}

function write_modal (text)
{
	L_modal_text = L_modal_text + "<p style='padding:0px; font-size:16px;'>" + text + "</p>"  ;
	$("#modal-text" ).html(L_modal_text);
}

function write_modal_error (text)
{
	L_modal_text = L_modal_text + "<p style='color:red; padding:0px; font-size:16px;'>" + text + "</p>"  ;
	$("#modal-text" ).html(L_modal_text);
}

function write_modal_warning (text)
{
	L_modal_text = L_modal_text + "<p style='color:orange; padding:0px; font-size:16px;'>" + text + "</p>"  ;
	$("#modal-text" ).html(L_modal_text);
}

function show_modal_close ()
{
	$("#modal-close-button").show();
	write_modal ("Click close to continue");
}

function hide_modal ()
{
	$("#myModal").modal('hide');
}

function close_modal ()
{
	$("#myModal").modal('hide');
}

//*******************
// password generator
//*******************

var randomseed;

function get_xxx (teamnum)
{
	var alpha = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
	var numeric = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    randomseed = teamnum;
	var d1 = parseInt(seededRandom (25, 0));
	var d2 = parseInt(seededRandom (9, 0));
	var d3 = parseInt(seededRandom (25, 0));
	var d4 = parseInt(seededRandom (9, 0));
	var xxx = alpha[d1]+numeric[d2]+alpha[d3]+numeric[d4];
    console.log (teamnum + " " + xxx);
    return xxx;
}
 
// generate a random number 
function seededRandom(max, min) 
{
    max = max || 1;
    min = min || 0;
 
    randomseed = (randomseed * 9301 + 49297) % 233280;
    var rnd = randomseed / 233280;
 
    return min + rnd * (max - min);
}

/**
 * Displays overlay with "Please wait" text. Based on bootstrap modal. Contains animated progress bar.
 */
function showPleaseWait(text) 
{
    var modalLoading = '<div class="modal" id="pleaseWaitDialog" data-backdrop="static" data-keyboard="false role="dialog">\
        <div class="modal-dialog">\
            <div class="modal-content">\
                <div class="modal-header">\
                    <h4 class="modal-title">' + text + '</h4>\
                </div>\
                <div class="modal-body">\
                    <div class="progress">\
                      <div class="progress-bar progress-bar-success progress-bar-striped active" role="progressbar"\
                      aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width:100%; height: 40px">\
                      </div>\
                    </div>\
                </div>\
            </div>\
        </div>\
    </div>';
    $(document.body).append(modalLoading);
    $("#pleaseWaitDialog").modal("show");
}

/**
 * Hides "Please wait" overlay. See function showPleaseWait().
 */
function hidePleaseWait() 
{
    $("#pleaseWaitDialog").modal("hide");
}

