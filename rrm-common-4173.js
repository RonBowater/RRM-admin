"use strict";

/********************/
/* Global variables */
/********************/

var G_liquid_engine;
var G_call_stack = [];
var G_current_view;
var G_xhr;  
var G_functions_template=null; 
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

/************************/
/* call stack functions */
/************************/

function Xcall (view)
{
	G_call_stack.push(view);
	G_current_view = view;
	view.render();
} 

function Xgoto (view)
{
	G_current_view = view;
	view.render();
} 
 
function Xreturn ()
{
	G_call_stack.pop()
	var view = G_call_stack[G_call_stack.length-1];
	G_current_view = view;
	view.render();
} 

function Xrefresh ()
{
	G_call_stack[G_call_stack.length-1].render();
} 

/*********************/
/* clickit functions */
/*********************/

window.clickit_cancel = function ()    { if (G_current_view != null) G_current_view.trigger('doCancel',  ""); }
window.clickit_proceed = function ()   { if (G_current_view != null) G_current_view.trigger('doProceed', ""); }
window.clickit_function = function (n) { if (G_current_view != null) G_current_view.trigger('doFunction', n); } 

/*********************************************************************/
/* setup views for functions, commands and content view using Liquid */
/*********************************************************************/
var G_setup_view_type;       

function setup_content_html(html)
{		
	$("#content").html(html);	
	G_setup_view_type[1]();
}
       
function setup_view (type, functions, commands, content)
{
	G_setup_view_type = type;
	
	// setup the functions div (always underscore) 
	if (functions!="")
	{
		var template = $("#" + functions).html();
		$("#functions-div").html(_.template(template,{}));
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
 
/*****************************/ 
/* email validation function */
/*****************************/
  
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
	//mysql = json_encode(mysql);
	G_xhr = $.ajax(
	{
		dataType: 'json',
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



/*************************/
/* common initialization */
/*************************/

function CommonInit()
{
	// create the liquid engine
	var G_liquid_engine = new Liquid()
	
	G_current_view = null;
	
	G_db_access_code = "020380";
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