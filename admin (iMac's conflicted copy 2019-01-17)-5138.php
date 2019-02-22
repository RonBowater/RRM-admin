<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    
    <title>Romsey Relay Marathon Admin</title>

    <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">
	<link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css" rel="stylesheet">
	
	<link rel="stylesheet" href="<?php get_site_url(); ?>/wp-content/plugins/Marathon-Apps/admin/css/%%style.css%%"> 

    <!--
	<link href="https://cdn.quilljs.com/1.3.4/quill.snow.css" rel="stylesheet">
	-->
	
    <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css"> 
    <link rel="stylesheet" href="<?php get_site_url(); ?>/wp-content/plugins/Marathon-Apps/admin/css/lib/footable.bootstrap.min.css">
    
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
    
    <style>
 	.mybox 
 	{
		display: inline;
		width: 100%;
		height: auto;
		padding: 6px 12px;
		font-size: 14px;
		line-height: 1.42857143;
		color: #555;
		background-color: #fff;
		background-image: none;
		border: 1px solid #ccc;
		border-radius: 4px;
		-webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
		box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
		-webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
		-o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
		transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
	}

	</style>
    
    
    
  </head>
<body>
 
<header>  
</header>

<!-----------------------> 
<!-- Default template  -->  
<!-----------------------> 

<div class="root-div" id="root-div">
	<h2 id="init_msg">Loading Javascript Components ...</h2>
</div> 

<!---------------------> 
<!-- Loading Template  -->  
<!---------------------> 
               
<script type='text/template' id='T-Loading-Content'>
	<h2 id="init_msg">Loading...</h2>
</script>

<!---------------------> 
<!-- Empty Template  -->  
<!---------------------> 
          
<script type='text/template' id='T-Empty'>
</script>
 
<!-------------------------> 
<!-- Main Root Structure -->
<!------------------------->  
 
<script type='text/template' id='T-root-structure'>
	<!-- Sidebar -->
	<div id="sidebar" class="sidebar"> 
		<div id="sidebar-wrapper" class="sidebar-wrapper">
			<div id="views-div" class="views-div">
				<!-- Views inserted here -->
			</div>
			<!-- Commands -->
			<div id="commands-div" class="commands-div">
				<!-- commands inserted here -->
			</div>    
		</div> 
	</div>		
	<div id="main-content" class="main-content">
		<div id="content" class="content">	
			<!-- content inserted here -->
		</div>
	</div>
	 
   <!-- Modal -->
   <div class="modal fade" id="myModal" role="dialog">
     <div class="modal-dialog"> 
       <!-- Modal content-->
       <div class="modal-content">
         <div class="modal-header">
           <button type="button" class="close" data-dismiss="modal">&times;</button>
           <h4 class="modal-title">Messages</h4>
         </div>
         <div class="modal-body" id="modal-text" style="font-size:10px">
          <p>Some text in the modal.</p>
         </div>
         <div class="modal-footer">
        	<button onclick="view_clickit_function('button-close')" id="modal-close-button" type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            <button onclick="view_clickit_function('button-cancel')" id="modal-cancel-button" type="button" class="btn btn-default"  >Cancel</button>
            <button onclick="view_clickit_function('button-proceed')" id="modal-proceed-button" type="button" class="btn btn-default" >Proceed</button>
         </div>
       </div>
     </div>
   </div> 
</script> 
 
<!------------------------------> 
<!-- VIEWS SELECTION TEMPLATE -->  
<!------------------------------> 

<script type='text/template' id='T-Main-Views'>
<h3>Views</h3>
<ul class="func-nav-list">
	<li><a onclick="view_change_request('dashboard')" id="id-dashboard" class="nav-top-item">Dashboard</a> </li>
	<li><a onclick="view_change_request('settings')" id="id-settings" class="nav-top-item">Settings</a></li>
	<li><a onclick="view_change_request('sync-teams')" id="id-sync-teams" class="nav-top-item">Sync Teams with WIX</a></li>
	<li><a onclick="view_change_request('list-teams')" id="id-list-teams" class="nav-top-item">List Teams</a></li>
	<li>
		<a onclick="window.clickit_function('testing')" id="testing-view" class="nav-top-item">Testing</a>
		<ul>
			<li><a href="*" >Option 1</a></li>
			<li><a href="*" >Option 2</a></li>
			<li><a href="*" >Option 3</a></li>
			<li><a href="*" class="current">Option 4</a></li>
		</ul>
	</li>
	<li><a onclick="view_change_request('export-teams')" id="id-export-teams" class="nav-top-item">Export Teams</a></li>
	<li><a onclick="view_change_request('messages')" id="id-messages" class="nav-top-item">Messages</a></li>
	<li><a onclick="view_change_request('custom-funcs')" id="id-custom-funcs" class="nav-top-item">Custom Functions</a></li>
</ul>
</script>

<!-------------------------> 
<!-- COMMANDS TEMPLATES  -->  
<!------------------------->  

<!-- logoff only -->
<script type='text/template' id='T-Commands-Logoff'>
<h3>Commands</h3>
<div>
<ul class="cmd-nav-list">   
<li>
	<a onclick="view_clickit_function('logoff')" id="Logoff" class="nav-top-item">Logoff</a>
</li>
</ul>
</div>
</script> 

<!-- logoff, restore and update -->
<script type='text/template' id='T-Commands-Logoff-Restore-Update'>
<h3>Commands</h3>
<div>
<ul class="cmd-nav-list">   
<li>
	<a onclick="view_clickit_function('logoff')" id="Logoff" class="nav-top-item">Logoff</a>
</li>
<li>
	<a onclick="view_clickit_function('restore')" id="Restore" class="nav-top-item">Restore to original values</a>
</li>
<li>
	<a onclick="view_clickit_function('update')" id="Update" class="nav-top-item">Update database</a>
</li>
</ul>
</div>
</script> 

<!-------------------------------->
<!-- DASHBOARD CONTENT TEMPLATE -->
<!-------------------------------->  

<script type='text/template' id='T-Dashboard-Content'>
<h2>Dashboard</h2>
<div id="content-box" class="content-box">        
	<div class="content-box-header">            
         <h3 style="margin-top:0px;font-size:17px;">Team statistics</h3>                 
    </div>   
    <div class="content-box-content">  
    	<p>{{ title }}</p>
        <ul>
			<li>Registered Teams :<strong>{{ num_teams }}</strong></li>
			<li>Paid : <strong>{{ paid_teams }}</strong></li>
			<li>Unpaid : <strong>{{ unpaid_teams }}</strong></li>
			<li>Registration Fees Paid : <strong>£{{ fees_paid }}</strong></li>
			<li>Last Update On : <strong>{{ last_update_on }}</strong></li>
			<li>Last Update File : <strong>{{ last_update_file }}</strong></li>
			<li><strong>{{ num_days_to_event }} days left to event</strong></li>
			<li style="color:#006600"><strong>{{ status }}</strong></li> 
    </div>  
</div>
</script>

<!------------------------------->
<!-- SETTINGS CONTENT TEMPLATE -->
<!------------------------------->

<script type='text/template' id='T-Settings-Content'>
<h2>Settings</h2>
<div id="content-box" class="content-box">        
	<div class="content-box-header">
		<h3 style="margin-top:3px;font-size:17px;">Modify Settings as required</h3>
	</div>  
	<div class="content-box-content" id="the_team_content">
		<h3>Settings</h3>
		<div class="row rb-row-1">
			<div class="col-md-4" style="padding-left: 0px">
				<form id="VAREDIT_FormCol1" autocomplete="new-password"></form>
			</div>
			<div class="col-md-4" style="padding-left: 0px">
				<form id="VAREDIT_FormCol2" autocomplete="new-password></form>
			</div>
		</div>	
		<div class="row rb-row-1">
			<div class="col-md-8" style="padding-left: 0px">
				<form id="VAREDIT_FormCol3" autocomplete="new-passord"></form>
			</div>
		</div>  
	</div>
</div>	
</script>

<!---------------------------------------> 
<!-- CUSTOM FUNCTIONS CONTENT TEMPLATE -->  
<!---------------------------------------> 

<script type='text/template' id='T-CustomFuncs-Content'>
<div id="content-box" class="content-box">        
<h2>Custom Function</h2>
<div class="content-box-header">
	<h3 style="margin-top:0px;font-size:17px;">Select custom function</h3>
</div>  
<div class="content-box-content" id="the_team_content">
<h3>Please click a custom function:</h3>
<a href="www.romseymarathon-adminco.uk/logintest">logintest</a>
<a onclick="view_clickit_function('custom-func-1')" id="func1" class="nav-top-item"><h4>Custom Function 1 - Generate CSV file for teams who HAVE paid and for whom we DO have runners names </h4></a>
<p>This function creates and downloads a single CSV file (paidrunners.csv) listing Teams who HAVE paid and for whom we DO have runners' names.<br>
CSV has the following fields: Team code, team captain first and last name (person who registered the team), Team Name, email and phone numbers.<br>
File can be found in your downloads folder</p>
<a onclick="view_clickit_function('custom-func-2')" id="func2" class="nav-top-item"><h4>Custom Function 2 - Generate CSV file for teams who HAVE paid and for whom we DON'T have runners names</h4></a>
<p>This function creates and downloads a single CSV file (paidnorunners.csv) listing Teams who HAVE paid and for whom we DON'T have runners' names.<br>
For other details, see Custom Function 1</p>
<a onclick="view_clickit_function('custom-func-3')" id="func3" class="nav-top-item"><h4>Custom Function 3 - Generate CSV file for teams who have NOT paid and for whom we DON'T have runners names</h4></a> 
<p>This function creates and downloads a single CSV file (nopaidnorunners.csv) listing Teams who Hhave NOT paid and for whom we DON'T have runners' names.<br>
For other details, see Custom Function 1</p>
<a onclick="view_clickit_function('custom-func-4')" id="func4" class="nav-top-item"><h4>Custom Function 4 - Generate All Teams CSV file</h4></a> 
<p>This function creates and downloads a single CSV file (allteams.csv) containing all useful team info for import into excel and other processing.</p>
<a onclick="view_clickit_function('custom-func-5')" id="func5" class="nav-top-item"><h4>Custom Function 5 - Generate EMIT Timing CSV FIle</h4></a> 
<p>This function creates and downloads a single CSV file (teamfinance.csv) containing financial information for teams.</p>
<a onclick="view_clickit_function('custom-func-6')" id="func6" class="nav-top-item"><h4>Custom Function 6 - Create text file of team names for programme</h4></a> 
<p>This function creates and downloads a single txt file (teams.txt) containing team/runner information for inclusion in the programme.</p>
<a onclick="view_clickit_function('custom-func-7')" id="func7" class="nav-top-item"><h4>Custom Function 7 - Find missing teams</h4></a> 
<p>This function list teams for which there is a gap in the RCRT numbering system.</p>
<a onclick="view_clickit_function('custom-func-8')" id="func8" class="nav-top-item"><h4>Custom Function 8 - Generate CSV containing all data for all teams</h4></a> 
<p>This function creates a CSV (alldata.csv) containing all data for all teams</p>
<a onclick="view_clickit_function('custom-func-9')" id="func9" class="nav-top-item"><h4>Custom Function 9 - Generate CSV file with team info for PA</h4></a> 
<p>This function creates a CSV file containing team info</p>
</div>
</div>
</script>

<!--------------------------------->
<!-- LIST TEAMS CONTENT TEMPLATE -->  
<!--------------------------------->

<script type='text/template' id='T-List-Teams-Content'>
<h2 id="testing">List Teams</h2>
<div class="content-box"> 
	<div class="content-box-header">            
        <h3 style="margin-top:0px;"><span>Team Filter : Click <a id="click-team-filter" >HERE</a></span><span id="filter-header"></span></h3> 
    </div>  
	<div id="filter-settings" class="content-box-content">
		<form>
			<fieldset id="filter-andorfieldset"></fieldset>
			<fieldset id="filter-fieldset"></fieldset>
		</form>
	</div>
</div>

<div class="content-box" id="team-listing"> 
	<div class="content-box-header">            
        <h3 style="margin-top:5px;">Team Listing : </a><span id="listing-header"></span></h3>
    </div>  
    <div class="clear"></div>      
	<div class="content-box-header">            
		<ul class="content-box-tabs" style="float:left">
			<li>
				<a onclick="view_clickit_function('func-show-team-status')" id="id-show-team-status" >Team Status</a>
			</li>
			<li>
				<a onclick="view_clickit_function('func-show-registration-info')" id="id-show-registration-info">Registration Info</a>
			</li>
			<li>
				<a onclick="view_clickit_function('func-show-contact-info')" id="id-show-contact-info">Contact Info</a>
			</li>
			<li>
				<a onclick="view_clickit_function('func-show-team-info')" id="id-show-team-info">Team Info</a>
			</li>
			<li>
				<a onclick="view_clickit_function('func-show-charity-info')" id="id-show-charity-info">Charity Info</a>
			</li>
			<li>
				<a onclick="view_clickit_function('func-show-payment-info')" id="id-show-payment-info">Payment Info</a>
			</li>
			<li>
				<a onclick="view_clickit_function('func-show-runners-info')" id="id-show-runners-info">Runners Info</a>
			</li>
		</ul>
		</p>  
		<div class="clear"></div>      
    </div>  
	<div class="content-box-content">
		<h3>Click on any team to show available commands</h3>
		<table id="team-table" class="table hover-yellow" data-filtering="true"></table>
	</div>
</div>

</script>

<!-------------------------> 
<!-- EDIT MESSAGES VIEW  -->  
<!-------------------------> 

<!-- Edit Msgs Functions template --> 

<script type='text/template' id='T-Edit-Msgs-Functions'>
<h3>Functions</h3>
<ul class="func-nav-list">
	<li>
		<a id="edit-msgs" class="nav-top-item">Edit Msgs</a> 
	</li>
</ul>
</script>

<!-- Edit Msgs Content template --> 

<script type='text/template' id='T-Edit-Msgs-Content'>
<h2>List Messages</h2>
<h3>Please select the message you wish to edit or add new one</h3>
<h3 style="color:green" id="list-msg-loading">*** Fetching messages from database ***</h3>
<table style="font-size:16px;" id="msgs-table" data-filtering="true" class="table hover-yellow"></table>
</script>

<!-- Edit Msgs Commands Template  -->  

<script type='text/template' id='T-Edit-Msgs-Commands'>
<h3>Commands</h3>
<ul class="cmd-nav-list"> 
<li>
	<a onclick="view_clickit_function('logoff')" id="settings-logoff" class="nav-top-item">Logoff</a>
</li>
<li>
	<a onclick="view_clickit_function('add-msg')" id="add-msg" class="nav-top-item">Add Message</a>
</li>
<li>
	<a onclick="view_clickit_function('delete-msg')" id="delete-msg" class="nav-top-item">Delete Message ID XX</a>
</li>
<li>
	<a onclick="view_clickit_function('edit-msg')" id="edit-msg" class="nav-top-item">Edit Message ID XX</a>
</li>
<li>
	<a onclick="view_clickit_function('test-msg')" id="test-msg" class="nav-top-item">Test Message ID XX</a>
</li>
</ul>  
</script>

<!-------------------------------> 
<!-- EDIT SINGLE MESSAGE VIEW  -->  
<!-------------------------------> 

<!-- Test Single Message commands Template  -->  

<script type='text/template' id='T-Edit-Single-Msg-Commands'>
<h3>Commands</h3>
<ul class="cmd-nav-list">  
<li>
	<a onclick="view_clickit_function('return')" id="msg-edit-cancel" class="nav-top-item">Return</a>
</li>
<li>
	<a onclick="view_clickit_function('update')" id="msg-edit-cancel" class="nav-top-item">Update Database</a>
</li>
<li>
	<a onclick="view_clickit_function('test-msg')" id="msg-edit-cancel" class="nav-top-item">Test Message</a>
</li>
</ul>  
</script>

<!-- Edit Single Message content template  -->  

<script type='text/template' id='T-Edit-Single-Msg-Content'>
<h2 id="edit-msg-text">Text to be supplied by Javascript</h1>
<div class="content-box"> 
	<div class="content-box-header">            
        <h3 style="margin-top:0px;"><span>Edit Message : Click <a id="click-team-filter" >HERE</a></span><span id="filter-header"></span></h3> 
    </div>  
	<div id="filter-settings" class="content-box-content">
		<div class="row rb-row-1">
			<div class="col-md-12" style="padding-left:0px; font-size:14px; font-weight: Bold; color: rgb(34,34,34)">
				<form id="MsgForm"></form>
			</div>
		</div>
		<h2>Variable substitution</h2>
		<div class="row rb-row-1">
			<div class="col-md-4">
				<p>{{ FIRSTNAME }} - first name</p>
				<p>{{ LASTNAME }} - last name</p>
				<p>{{ FULLNAME }} - full name</p>
			</div>
			<div class="col-md-4">
				<p>{{ NUMTEAMS }} - number of teams</p>
				<p>{{ TEAMCODE }} - team code</p>
				<p>{{ TEAMNAME }} - team name</p>
			</div>
		</div>
	</div>
</div>
</script>	

<!------------------------>
<!--  TEST MESSAGE VIEW -->
<!------------------------>

<!-- Test Message commands Template  -->  

<script type='text/template' id='T-Test-Msg-Commands'>
<h3>Commands</h3>
<ul class="cmd-nav-list">  
<li>
	<a onclick="view_clickit_function('return')" id="msg-test-cancel" class="nav-top-item">Return</a>
</li>
<li>
	<a onclick="view_clickit_function('send-test-msg')" id="msg-test-send" class="nav-top-item">Send Message</a>
</li>
</ul>  
</script>

<!-- Test Message content Template  -->  

<script type='text/template' id='T-Test-Msg-Content'>
<h2>Dashboard</h2>
<h2>Send test message</h2>
<div class="content-box"> 
	<div class="content-box-header">            
        <h3 id="send-team-name-text" style="margin-top:0px;">Send test message</h3> 
    </div> 
	<div id="filter-settings" class="content-box-content">
		<h3 id="send-team-name-text">How do you want to send the message ?</h3> 
		<div id="howsend">
			<div class="radio-inline">
			  <label><input type="radio" checked="checked" name="howsend" value="html">HTML Email with banner</label><span id="html-email-address"></span>
			</div>
			<div class="radio-inline">
			  <label><input type="radio" name="howsend" value="simple">Simple E-mail</label><span id="simple-email-address"></span>
			</div>
			<div class="radio-inline">
			  <label><input type="radio" name="howsend" value="text">SMS Texts</label><span id="text-number"></span>
			</div>
		</div>  
		<h3 id="send-team-name-text">Email or SMS ?</h3> 
		<div id="email_sms">
			<div class="radio-inline">
			  <label><input type="radio" checked="checked" name="email_sms" value="email">Email</label><span id="type-email"></span>
			</div>
			<div class="radio-inline">
			  <label><input type="radio" name="email_sms" value="sms">SMS</label><span id="type-sms"></span>
			</div>
		</div>  
		<h3 id="send-team-name-text">HTML or text ?</h3> 
		<div id="html_text">
			<div class="radio-inline">
			  <label><input type="radio" checked="checked" name="html_text" value="html">HTML</label><span id="type-html"></span>
			</div>
			<div class="radio-inline">
			  <label><input type="radio" name="html_text" value="text">Text</label><span id="type-text"></span>
			</div>
		</div>  
		<h3 id="send-team-name-text">Via SiB or server ?</h3> 
		<div id="sib_server">
			<div class="radio-inline">
			  <label><input type="radio" checked="checked" name="sib_server" value="sib">SiB</label><span id="type-sib"></span>
			</div>
			<div class="radio-inline">
			  <label><input type="radio" name="sib_server" value="server">Server</label><span id="type-server"></span>
			</div>
		</div>  
		<h3 id="send-team-name-text">Simple or Templated ?</h3> 
		<div id="simple_templated">
			<div class="radio-inline">
			  <label><input type="radio" checked="checked" name="simple_templated" value="simple">Simple</label><span id="type-simple"></span>
			</div>
			<div class="radio-inline">
			  <label><input type="radio" name="msgtype" value="templated">Templated</label><span id="type-templated"></span>
			</div>
		</div>  
		<h3 id="send-team-name-text">This is how the message will appear ?</h3> 
		<div>
			 <span id="htmltext" style="border-style:solid;border-width:1pxwidth:auto;height:300px"></span>
		</div>
	</div>
	<div id="xxx">
	</div>    
</div>
</script>


<!------------------------>
<!--  IMPORT TEAMS VIEW -->
<!------------------------>

<script type='text/template' id='T-Import-Teams-Functions'>
<h3>Functions</h3>
<ul class="func-nav-list">
	<li>
		<a id="import-teams" class="nav-top-item">Import Teams</a> 
	</li>
</ul>
</script>

<!-- Import Teams Content Template -->  

<script type='text/template' id='T-Import-Teams-Content'>
<h2>Import Teams</h2>
<h3>Please select the file containing the WIX event guest list</h3>
<input type="file" id="import-teams-file-input" </input>
<input id="show-new-entries" type="checkbox" value="">  Show only entries not already in database</input></br>
<input id="most-recent-last" type="checkbox" value="">  Most recent last</input>
<table class="table hover-yellow" data-filtering="true"></table>
</script>

<!--Import Teams Commands Templates -->  

<script type='text/template' id='T-Import-Teams-Commands'>
<h3>Commands</h3>
<ul class="cmd-nav-list">  
	<li>
		<a onclick="view_clickit_cancel()" id="exit-import" class="nav-top-item">Return</a>
	</li> 
	<li>
		<a onclick="view_clickit_function('import-add-to-db')" id="import-add-to-db" class="nav-top-item">Add all to database</a>
	</li>
</ul>  
</script>

<!---------------------->
<!--  SYNC TEAMS VIEW -->
<!---------------------->

<script type='text/template' id='T-Sync-Teams-Functions'>
<h3>Functions</h3>
<ul class="func-nav-list">
	<li>
		<a id="import-teams" class="nav-top-item">Sync Teams with WIX</a> 
	</li>
</ul>
</script>

<!-- Sync Teams Content Template -->  

<script type='text/template' id='T-Sync-Teams-Content'>
<h2>Sync Teams</h2>
<h3>Please select the file containing the WIX event guest list</h3>
<input type="file" id="sync-teams-file-input" </input>
<h3>Progress report follows:</h3>
<span id="sync_report"></span>
</script>

<!--Sync Teams Commands Templates -->  

<script type='text/template' id='T-Sync-Teams-Commands'>
<h3>Commands</h3>
<ul class="cmd-nav-list">  
	<li>
		<a onclick="view_clickit_cancel()" id="exit-import" class="nav-top-item">Return</a>
	</li> 
	<li>
		<a onclick="view_clickit_function('sync-update-db')" id="sync-update-db" class="nav-top-item">Sync database</a>
	</li>
</ul>  
</script>

<!------------------------>
<!--  EXPORT TEAMS VIEW -->
<!------------------------>
 
<!-- Export function template -->  

<script type='text/template' id='T-Export-Teams-Functions'>
<h3>Functions</h3>
<ul class="func-nav-list">
	<li>
		<a id="export-teams" class="nav-top-item">Export Teams</a> 
	</li>
</ul>
</script>

<!--Export Commands Template -->  

<script type='text/template' id='T-Commands-Export'>
<h3>Commands</h3>
<ul class="cmd-nav-list">  
	<li>
		<a onclick="view_clickit_function('export-to-csv')" id="export-to-csv" class="nav-top-item">Export to CSV</a>
	</li>
</ul>  
</script>

<!-- Export content template -->  

<script type='text/template' id='T-Team-Content-Export'>
<h2>Export database to CSV file</h2>
<div class="content-box-header">
	<h3 style="cursor:s-resize; margin-top:0px;">Team Database Export</h3>
</div>
<div class="content-box-content" id="export_content">
	<h4>This function generates a CSV file export from the team database.</h4><p>The first column will always be the Team Code (e.g. RCRT1).</br>You can then select the other columns by group below.</br>
	There will always be a header row containing the database field name.</br>The exported file will be named 'RRM-Team-Export-ddmmyy.csv' (where ddmmyy is the date)</p>
	<p>Please select the column groups to be exported:</p>
	<div class="form-check">
		<label>
			<input id="exp-reg-info" type="checkbox" name="check"> <span class="label-text">WIX Registration Info</span>
		</label>
	</div>
	<div class="form-check">
		<label>
			<input id="exp-contact-info" type="checkbox" name="check"> <span class="label-text">Contact Info</span>
		</label>
	</div> 
	<div class="form-check">
		<label>
			<input id="exp-team-info" type="checkbox" name="check"> <span class="label-text">Team Info</span>
		</label>
	</div> 
	<div class="form-check">
		<label>
			<input id="exp-charity-info" type="checkbox" name="check"> <span class="label-text">Charity Info</span>
		</label>
	</div> 
	<div class="form-check">
		<label>
			<input id="exp-payment-info" type="checkbox" name="check"> <span class="label-text">Payment Info</span>
		</label>
	</div> 
	<div class="form-check">
		<label>
			<input id="exp-runners-info" type="checkbox" name="check"> <span class="label-text">Runners Info</span>
		</label>
	</div> 
	
	</br>
	<p>You can select the rows to be exported based on a number of fixed criteria as follows:</p>
	<div class="form-check">
		<label>
			<input type="radio" name="optradio" checked> <span class="label-text">All Teams</span>
		</label>
	</div>
	<div class="form-check">
		<label>
			<input type="radio" name="optradio"> <span class="label-text">Unpaid teams</span>
		</label>
	</div> 
	<div class="form-check">
		<label>
			<input type="radio" name="optradio"> <span class="label-text">Paid teams</span>
		</label>
	</div> 

	<div class="form-check">
		<label>
			<input type="radio" name="optradio"> <span class="label-text">Teams with no runners specified</span>
		</label>
	</div> 
	<p>When you are ready, please click the Export button on the left to create the csv file</p> 
	
</div>
	
<!--	
	<h3 style="cursor:s-resize; margin-top:0px;">Select fields for export</h3>
</div>  
<div class="content-box-content" id="export_content">
	<div id="exportDetails">
		<div class="row rb-row-1">
			<div class="col-md-3" style="padding-left: 0px">
				<form id="export-info-col1"></form>
			</div>
			<div class="col-md-3" style="padding-left: 0px">
				<form id="export-info-col2"></form>
			</div>
			<div class="col-md-3" style="padding-left: 0px">
				<form id="export-info-col3"></form>
			</div>
			<div class="col-md-3" style="padding-left: 0px">
				<form id="export-info-col4"></form>
			</div>

		</div>
	</div>
</div>
00>
</script>

<!--
<!---------------------->
<!-- SETTINGS CONTENT -->
<!---------------------->

<!-- Settings Content Template -->  

<script type='text/template' id='T-Settings-Content'>
<div id="content-box" class="content-box">        
	<h2>Settings</h2>
	<div class="content-box-header">
		<h3 style="cursor:s-resize; margin-top:0px;">Modify Settings as required</h3>
	</div>  
	<div class="content-box-content" id="the_team_content">
		<div id="settingsDetails">
			<div class="row rb-row-1">
				<div class="col-md-4" style="padding-left: 0px">
					<form id="frmSettings"></form>
				</div>
			</div>
		</div>
	</div>
</div>	
</script>

<!-- Settings Commands Template     -->  

<script type='text/template' id='T-Settings-Commands'>
<h3>Commands</h3>
<ul class="cmd-nav-list"> 
<li>
	<a onclick="view_clickit_function('settings-cancel')" id="settings-cancel" class="nav-top-item">Return</a>
</li>
<li>
	<a onclick="view_clickit_function('settings-update')" id="settings_update" class="nav-top-item">Update Settings</a>
</li> 
</ul>  
</script>
-->

<!------------------------>
<!--  FILTER TEAMS VIEW -->
<!------------------------>

<!-- filter function template -->  

<script type='text/template' id='T-Filter-Functions'>
<h3>Functions</h3>
<ul class="func-nav-list">
	<li>
		<a onclick="view_clickit_function('filter-teams')" id="filter-teams" class="nav-top-item">Filter Teams</a> 
	</li>
</ul>
</script>

<!-- Filter Content template  -->  

<script type='text/template' id='T-Filter-Content'>
<h2>Define team filter</h2>
<div class="content-box-header">
	<h3 style="cursor:s-resize; margin-top:0px;">Select Filter items</h3>
</div>  
<div class="content-box-content" id="filter_content">
	<div id="filterDetails">
		<div class="row rb-row-1">
			<div class="col-md-3" style="padding-left: 0px">
				<form id="filterForm"></form>
			</div>
		</div>
	</div>
</div>
</script

<!-- Filter Commands template with exit set/reset filter -->  

<script type='text/template' id='T-Filter-Commands'>
<h3>Commands</h3>
<ul class="cmd-nav-list">  
	<li>
		<a onclick="view_clickit_cancel()" id="exit-filter" class="nav-top-item">Return</a>
	</li> 
	<li>
		<a onclick="view_clickit_function('set-filter')" id="set-filter" class="nav-top-item">Set Filter</a>
	</li>
	<li>
		<a onclick="view_clickit_function('reset-filter')" id="set-filter" class="nav-top-item">Reset Filter</a>
	</li>
</ul> 
</script>

<!---------------------------> 
<!-- Team Functions View   -->  
<!---------------------------> 

<!-- Team Functions template -->

<script type='text/template' id='T-Team-Functions'>
<h3>Team Functions</h3>
<ul class="func-nav-list">  
	<!--
	<li>
		<a onclick="view_clickit_function('import-teams')" id="import-teams" class="nav-top-item">Import Teams from WIX</a>
	</li>
	-->
	<li>
		<a onclick="view_clickit_function('sync-teams')" id="sync-teams" class="nav-top-item">Sync Teams with WIX</a>
	</li>
	<li>
		<a onclick="view_clickit_function('list-teams')" id="list-teams" class="nav-top-item">List Teams</a>
	</li> 
	<li>
		<a onclick="view_clickit_function('export-teams')" id="export-teams" class="nav-top-item">Export Teams</a>
	</li>

</ul> 
</script>

<!-- Team Commands template -->

<script type='text/template' id='T-Team-Commands'>
<h3>Commands</h3>
<ul class="cmd-nav-list">  
	<li>
		<a onclick="view_clickit_cancel()" class="nav-top-item">Return</a>
	</li>
</ul> 
</script>

<!-- Team Content template -->

<script type='text/template' id='T-Team-Functions-Content'>
<h2>Please select a team function on the left</h2>
</script>

<!----------------------> 
<!-- List Team View   -->  
<!----------------------> 

<!-- List Team Functions template -->

<script type='text/template' id='T-List-Teams-Functions'>
<h3>Team Functions</h3>
<ul class="func-nav-list">  
	<li>
		<a id="list-teams" class="nav-top-item">List Teams</a>
		<ul>
			<li><a onclick="view_clickit_function('list-teams-status')" id="list-teams-status">Team Status</a></li>
			<li><a onclick="view_clickit_function('list-teams-group-1')" id="list-teams-group-1">Info Group 1 (WIX 1)</a></li>
			<li><a onclick="view_clickit_function('list-teams-group-2')" id="list-teams-group-2">Info Group 2 (WIX 2)</a></li>
			<li><a onclick="view_clickit_function('list-teams-group-3')" id="list-teams-group-3">Info Group 3 (WIX 3)</a></li>
			<li><a onclick="view_clickit_function('list-teams-group-4')" id="list-teams-group-4">Info Group 4 (DB Additional Info)</a></li>
			<li><a onclick="view_clickit_function('list-teams-group-5')" id="list-teams-group-5">Info Group 5 (Message Dates)</a></li>
			<li><a onclick="view_clickit_function('list-teams-group-6')" id="list-teams-group-6">Info Group 6 (Runner's Names)</a></li>
			<li><a onclick="view_clickit_function('list-teams-group-7')" id="list-teams-group-6">Info Group 7 (Dates)</a></li>
		</ul>
	</li> 
</ul> 
</script>

<!-- List Team Commands template no selected team -->

<script type='text/template' id='T-List-Team-No-Selected-Commands'>
<h3>Commands</h3>
<div>
<ul class="cmd-nav-list">  
	<li>
		<a onclick="view_clickit_cancel()" id="list-exit-team-functions" class="nav-top-item">Return</a>
	</li> 
	<li>
		<a onclick="view_clickit_function('add-team')" id="add-team" class="nav-top-item">Manually Add New Team</a>
	</li>
	<li>
		<a onclick="view_clickit_function('report-teams')" id="report-teams" class="nav-top-item">Teams Report</a>
	</li>

</ul>
</div>  
</script>

<!-- List Team Commands template single selected team -->

<script type='text/template' id='T-List-Team-Single-Selected-Commands'>
<h3>Commands</h3>
<div>
<ul class="cmd-nav-list">  
	<li>
		<a onclick="view_clickit_cancel()" id="list-exit-team-functions" class="nav-top-item">Logoff</a>
	</li>
	<li>
		<a onclick="view_clickit_function('add-team')" id="add-team" class="nav-top-item">Add New Team</a>
	</li>
	<li>
		<a onclick="view_clickit_function('team-events-actions')" id="team-events-actions" class="nav-top-item">Text to be modifed</a>
	</li>
	<li>
		<a onclick="view_clickit_function('info-team')" id="info-team" class="nav-top-item">Text to be modifed</a>
	</li>
	<li>
		<a onclick="view_clickit_function('paypal-info-team')" id="paypal-info-team" class="nav-top-item">Text to be modifed</a>
	</li>
	<li>
		<a onclick="view_clickit_function('edit-team')" id="edit-team" class="nav-top-item">Text to be modifed</a>
	</li>
	<li>
		<a onclick="view_clickit_function('delete-team')" id="delete-team" class="nav-top-item">Text to be modifed</a>
	</li>
	<li>
		<a onclick="view_clickit_function('msg-team')" id="msg-team" class="nav-top-item">Text to be modifed</a>
	</li>
	<li>
		<a onclick="view_clickit_function('email-team')" id="email-team" class="nav-top-item">Text to be modifed</a>

	</li>
</ul>
</div>  
</script>

<!-- List Team Commands template all selected teams -->

<script type='text/template' id='T-List-Team-All-Selected-Commands'>
<h3>Commands</h3>
<div>
<ul class="cmd-nav-list">  
	<!--
	<li>
		<a onclick="view_clickit_cancel()" id="list-exit-team-functions" class="nav-top-item">Return</a>
	</li>
	--> 
	<li>
		<a onclick="view_clickit_function('add-team')" id="add-team" class="nav-top-item">Add New Team</a>
	</li>
	<li>
		<a onclick="view_clickit_function('report-teams')" id="report-teams" class="nav-top-item">Teams Report</a>
	</li>
	<li>
		<a onclick="view_clickit_function('delete-all-teams')" id="delete-all-teams" class="nav-top-item">Delete All Listed Teams</a>
	</li>
</ul>
</div>  
</script>



<!----------------------> 
<!-- Edit Team View   -->  
<!----------------------> 

<!-- Edit Team Functions template -->

<script type='text/template' id='T-Edit-Team-Functions'>
<h3>Functions</h3>
<ul class="func-nav-list">
	<li>
		<a id="id-edit-team" class="nav-top-item">Edit Team</a> 
	</li>
</ul>
</script>

<!-- Edit Team Commands templates -->

<script type='text/template' id='T-Edit-Commands-Return'>
<h3>Commands</h3>
<ul class="cmd-nav-list"> 
<li>
	<a onclick="view_clickit_function('edit-team-return')" id="edit-team-cancel" class="nav-top-item">Return</a>
</li>
</ul>
</script>

<script type='text/template' id='T-Edit-Commands-Return-Restore-Update'>
<h3>Commands</h3>
<ul class="cmd-nav-list"> 
<li>
	<a onclick="view_clickit_function('edit-team-return')" id="edit-team-return" class="nav-top-item">Return</a>
</li>
<li>
	<a onclick="view_clickit_function('edit-team-restore')" id="edit-team-restore" class="nav-top-item">Restore database values</a>
</li> 
<li>
	<a onclick="view_clickit_function('edit-team-update')" id="edit-team-update" class="nav-top-item">Update Database</a>
</li> 

</ul>
</script>

<!--
<script type='text/template' id='T-Settings-Commands-Return-Restore-Update'>
<h3>Commands</h3>
<ul class="cmd-nav-list"> 
<li>
	<a onclick="view_clickit_function('logoff')" id="settings-logoff" class="nav-top-item">Logoff</a>
</li>
<li>
	<a onclick="view_clickit_function('edit-team-restore')" id="edit-team-restore" class="nav-top-item">Restore database values</a>
</li> 
<li>
	<a onclick="view_clickit_function('edit-team-update')" id="edit-team-update" class="nav-top-item">Update Database</a>
</li> 

</ul>
</script>
-->


<!-- Edit Team Content template -->

<script type='text/template' id='T-Edit-Team-Content'>
<h2>Edit Team Details</h2>
<div class="content-box" id="team-listing"> 
	<div class="content-box-header">            
        <h3 style="margin-top:0px;"></a><span id="listing-header"></span></h3>
			<ul class="content-box-tabs">
			<li>
				<a onclick="view_clickit_function('func-edit-registration-info')" id="id-edit-registration-info">Registration Info</a>
			</li>
			<li>
				<a onclick="view_clickit_function('func-edit-contact-info')" id="id-edit-contact-info">Contact Info</a>
			</li>
			<li>
				<a onclick="view_clickit_function('func-edit-team-info')" id="id-edit-team-info">Team Info</a>
			</li>
			<li>
				<a onclick="view_clickit_function('func-edit-charity-info')" id="id-edit-charity-info">Charity Info</a>
			</li>
			<li>
				<a onclick="view_clickit_function('func-edit-payment-info')" id="id-edit-payment-info">Payment Info</a>
			</li>
			<li>
				<a onclick="view_clickit_function('func-edit-runners-info')" id="id-edit-runners-info">Runners Info</a>
			</li>
		</ul>  
		<div class="clear"></div>      
    </div>  
	<div class="content-box-content">
		<div id="teamDetails">
			<div class="row rb-row-1">
				<div class="col-md-4" style="padding-left: 0px">
					<form id="my-info-edit-form1"></form>
				</div>
				<div class="col-md-4" style="padding-left: 0px">
					<form id="my-info-edit-form2"></form>
				</div>
				<div class="col-md-4" style="padding-left: 0px">
					<form id="my-info-edit-form3"></form>
				</div>
			</div>
		</div>
	</div>
</div>
</script>

<!-------------------------> 
<!-- Send Message View   -->  
<!-------------------------> 

<!-- Send Message Functions template -->

<script type='text/template' id='T-Send-Msg-Functions'>
<h3>Functions</h3>
<ul class="func-nav-list">
	<li>
		<a id="send-msg" class="nav-top-item">Send Message</a> 
	</li>
</ul>
</script>

<!-- Send Msg Commands template -->

<script type='text/template' id='T-Send-Msg-Commands'>
<h3>Commands</h3>
<ul class="cmd-nav-list"> 
<li>
	<a onclick="view_clickit_cancel()" id="send-msg-cancel" class="nav-top-item">Cancel</a>
</li>
<li>
	<a onclick="view_clickit_function('do-send-msg')" id="do-send-msg" class="nav-top-item">Send Message</a>
</li> 
</ul>
</script>

<!-- Send Msg Content template -->

<script type='text/template' id='T-Send-Msg-Content'>
<h2>Send message to single team contact</h2>
<div class="content-box"> 
	<div class="content-box-header">            
        <h3 id="send-team-name-text" style="margin-top:0px;">Select the message you wish to send to team BLAH</h3> 
    </div> 
	<div id="filter-settings" class="content-box-content">
		<h3>Team info as follows:</h3>
		<span id="msgs_info">TBD</span>
		<h3 id="send-team-name-select-message">The following messages can be sent to this team:</h3> 
		<div style="width:800px;">
			<table id="msgs-table" data-filtering="true" class="table hover-yellow"></table>
		</div>
		<h3 id="send-team-name-text">How do you want to send the message ?</h3> 
		<div id="howtosend">
			<div class="radio">
			  <label><input type="radio" checked="checked" name="howsend" value="html">HTML Email with banner</label><span id="html-email-address"></span>
			</div>
			<div class="radio">
			  <label><input type="radio" name="howsend" value="simple">Simple E-mail</label><span id="simple-email-address"></span>
			</div>
			<div class="radio">
			  <label><input type="radio" name="howsend" value="text">SMS Texts</label><span id="text-number"></span>
			</div>
		</div>  
		<h3 id="send-team-name-text">Test or send to team ?</h3> 
 		<div id="testorsend">
			<div class="radio">
			  <label id=test-label><input type="radio" checked="checked" name="testorsend" value="test">Test</label><span id="test-address-number"></span>
			</div>
			<div class="radio">
			  <label><input type="radio" name="testorsend" value="send">Send to team (see above for details)</label>
			</div>
		</div>
	</div>    
</div>
</script>

<!----------------------------------> 
<!-- Send Multiple Message View   -->  
<!----------------------------------> 

<!-- Send Multiple Message Functions template -->

<script type='text/template' id='T-msg-mult-teams-Functions'>
<h3>Functions</h3>
<ul class="func-nav-list">
	<li>
		<a id="send-msg" class="nav-top-item">Send Message</a> 
	</li>
</ul>
</script>

<!-- Send Multiple Msg Commands template -->

<script type='text/template' id='T-msg-mult-teams-Commands'>
<h3>Commands</h3>
<ul class="cmd-nav-list"> 
<li>
	<a onclick="view_clickit_cancel()" id="send-msg-cancel" class="nav-top-item">Cancel</a>
</li>
<li>
	<a onclick="view_clickit_function('do-send-msg')" id="do-send-msg" class="nav-top-item">Send Message</a>
</li> 
<li>
	<a onclick="view_clickit_function('do-edit-list')" id="do-edit-list" class="nav-top-item">Edit Team List</a>
</li> 
</ul>
</script>

<!-- Send Multiple Msg Content template -->

<script type='text/template' id='T-msg-mult-teams-Content'>
<h2>Send message to multiple teams </h2>
<div class="content-box"> 
	<div class="content-box-header">   
		<h3 id="edit-team-details" style="cursor:s-resize; margin-top:0px;">Send message to multiple teams</h3>
    </div> 
	<div id="filter-settings" class="content-box-content">
		<span id="send-teams-text">TBD</span>
		<h3 id="send-team-name-select-message">The following messages can be sent to all teams: </h3> 
		<div style="width:800px;">
			<table id="msgs-table" data-filtering="true" class="table hover-yellow"></table>
		</div>
		<h3 id="send-team-name-text">How do you want to send the message ?</h3> 
		<div id="howtosend">
			<div class="radio">
			  <label><input type="radio" checked="checked" name="howsend" value="html">HTML Email with banner</label><span id="html-email-address"></span>
			</div>
			<div class="radio">
			  <label><input type="radio" name="howsend" value="simple">Simple E-mail</label><span id="simple-email-address"></span>
			</div>
			<div class="radio">
			  <label><input type="radio" name="howsend" value="text">SMS Texts</label><span id="text-number"></span>
			</div>
		</div>  
		<h3 id="send-team-name-text">Test or send to teams ?</h3> 
 		<div id="testorsend">
			<div class="radio">
			  <label id=test-label><input type="radio" checked="checked" name="testorsend" value="test">Test</label><span id="test-address-number"></span>
			</div>
			<div class="radio">
			  <label><input type="radio" name="testorsend" value="send">Send to team (see above for details)</label>
			</div>
		</div>
	</div>    
</div>
</script>

<!--------------------------------------------------> 
<!-- Send Multiple Messages - Edit team List view -->  
<!--------------------------------------------------> 

<!-- Edit team List view template -->

<script type='text/template' id='T-Edit-Team-List-Functions'>
<h3>Functions</h3>
<ul class="func-nav-list">
	<li>
		<a id="edit-team-list" class="nav-top-item">Edit Team List</a> 
	</li>
</ul>
</script>

<!-- Edit team List Commands template -->

<script type='text/template' id='T-Edit-Team-List-Commands'>
<h3>Commands</h3>
<ul class="cmd-nav-list"> 
<li>
	<a onclick="view_clickit_cancel()" id="send-msg-cancel" class="nav-top-item">Return</a>
</li>
</ul>
</script>

<!-- Edit team List Content template -->

<script type='text/template' id='T-Edit-Team-List-Content'>
<h2>Edit List of Teams to be send message</h2>
<div class="content-box"> 
	<div class="content-box-header">            
        <h3 id="edit-team-list-text" style="margin-top:0px;">Please edit team list</h3> 
        <table style="width:400px;font-size:16px;" id="msgs-table" data-filtering="true" class="table hover-yellow"></table>s
    </div> 
</div>
</script>


<!-------------------------------> 
<!-- TEAM EVENTS/ACTIONS VIEW  -->  
<!-------------------------------> 

<!-- Team Events Actions Functions template --> 

<script type='text/template' id='T-Events-Actions-Functions'>
<h3>Functions</h3>
<ul class="func-nav-list">
	<li>
		<a id="events-log" class="nav-top-item">Events Log</a> 
	</li>
</ul>
</script>

<!-- Team Actions Content template --> 

<script type='text/template' id='T-Events-Actions-Content'>
<h2>Events Log</h2>
<h3 id="events-log-hdr">Events for Team</h3>
<h3 style="color:green" id="events-loading">*** Fetching events from database ***</h3>
<table style="width:600px;" id="events-table" data-filtering="true" class="table hover-yellow"></table>
<div class="row rb-row-1">
	<div class="col-md-12" style="padding-left:0px; font-size:14px; font-weight: Bold; color: rgb(34,34,34)">
		<form id="event-form"></form>
	</div>
</div>
<div id="event-button"></div>
</script>

<!-- Team Actions Commands Template  -->  

<script type='text/template' id='T-Events-Actions-Commands'>
<h3>Commands</h3>
<ul class="cmd-nav-list"> 
<li>
	<a onclick="view_clickit_cancel()" id="exit-event-log" class="nav-top-item">Return</a>
</li>  
</ul>  
</script>

<!----------------------> 
<!-- Send team email  -->  
<!----------------------> 

<!-- Send Email Functions template --> 

<script type='text/template' id='T-Send-Email-Functions'>
<h3>Functions</h3>
<ul class="func-nav-list">
	<li>
		<a id="events-log" class="nav-top-item">Send Team Email</a> 
	</li>
</ul>
</script>

<!-- Send Email Content template --> 

<script type='text/template' id='T-Send-Email-Content'>
<h2>Send Team Email</h2>
<div class="row rb-row-1">
	<div class="col-md-6" style="padding-left:0px; font-size:14px; font-weight: Bold; color: rgb(34,34,34)">
		<form id="email-form1"></form>
	</div>
	<div class="col-md-6" style="padding-left:0px; font-size:14px; font-weight: Bold; color: rgb(34,34,34)">
		<form id="email-form2"></form>
	</div>
<div>
	<h3>Email after variable subsitution and html formatting</h3>
	<hr>
	<div class="form-group team_code>
		<div class="rjb-form-adjust2">
			<div contenteditable="true" id="formatted-html">
			</div>
		</div>
	</div>
	<hr>
	<div id="email-button"></div>
</div>

</script>

<!-- Send Email Commands Template  -->  

<script type='text/template' id='T-Send-Email-Commands'>
<h3>Commands</h3>
<ul class="cmd-nav-list"> 
<li>
	<a onclick="view_clickit_cancel()" id="exit-event-log" class="nav-top-item">Return</a>
</li>  
</ul>  
</script>

<!-------------------------------------------> 
<!-- Team Commands template with exit only -->  
<!-------------------------------------------> 

<!--
<script type='text/template' id='T-Team-Commands-Exit-Only'>
<h3>Commands</h3>
<ul class="cmd-nav-list">  
	<li>
		<a onclick="view_clickit_function('exit-team-functions')" id="exit-team-functions" class="nav-top-item">Return</a>
	</li>
</ul> 
</script>
-->

<!-------------------------------------------------------> 
<!-- Team Commands template with exit set/reset filter -->  
<!-------------------------------------------------------> 

<!--
<script type='text/template' id='T-Team-Commands-Exit-Set-Filter'>
<h3>Commands</h3>
<ul class="cmd-nav-list">  
	<li>
		<a onclick="view_clickit_function('exit-team-functions')" id="exit-team-functions" class="nav-top-item">Return</a>
	</li> 
	<li>
		<a onclick="view_clickit_function('set-filter')" id="set-filter" class="nav-top-item">Set Filter</a>
	</li>
	<li>
		<a onclick="view_clickit_function('reset-filter')" id="set-filter" class="nav-top-item">Reset Filter</a>
	</li>
</ul> 
</script>
-->

<!-----------------------------------> 
<!-- Import Teams Content Template -->  
<!-----------------------------------> 

<!--
<script type='text/template' id='T-Import-Teams-Content'>
<h2>Import Teams</h2>
<h3>Please select the file containing the WIX event guest list</h3>
<input type="file" id="import-teams-file-input" />
<table class="table hover-yellow" data-filtering="true"></table>
</script>
-->

<!------------------------------------> 
<!--Import Teams Commands Templates -->  
<!------------------------------------> 

<!--
<script type='text/template' id='T-Import-Teams-Commands'>
<h3>Commands</h3>
<ul class="cmd-nav-list">  
	<li>
		<a onclick="view_clickit_function('exit-team-functions')" id="exit-team-functions" class="nav-top-item">Return</a>
	</li> 
	<li>
		<a onclick="view_clickit_function('import-add-to-db')" id="import-add-to-db" class="nav-top-item">Add all to database</a>
	</li>
</ul>  
</script>
-->

<!------------------------------> 
<!-- Utilities Template       -->  
<!------------------------------> 

<!--
<script type='text/template' id='T-Utilities'>
<h2>Select a utility function</h2>
</script>
-->

<!------------------------------> 
<!-- Export Template          -->  
<!------------------------------> 

<!--
<script type='text/template' id='T-Export'>
<h2>Export database to csv file</h2>
<div class="content-box-header">
	<h3 style="cursor:s-resize; margin-top:0px;">Select columns to be exported as csv</h3>
</div>  
<div class="content-box-content" id="column_select_content">
	<div id="colSelectDetails">
		<div class="row rb-row-1">
			<div class="col-md-3" style="padding-left: 0px">
			    <button onclick="export_set_clearset(1,1)" type="button" class="btn-small btn-primary">Set all items</button>
			    <button onclick="export_set_clearset(1,0)" type="button" class="btn-small btn-primary">Clear all items</button>
				<form id="formset1">
				</form>
			</div>
			<div class="col-md-3" style="padding-left: 0px">
			    <button onclick="export_set_clearset(2,1)" type="button" class="btn-small btn-primary">Set all items</button>
			    <button onclick="export_set_clearset(2,0)" type="button" class="btn-small btn-primary">Clear all items</button>
				<form id="formset2"></form>
			</div>
			<div class="col-md-3" style="padding-left: 0px">
			    <button onclick="export_set_clearset(3,1)" type="button" class="btn-small btn-primary">Set all items</button>
			    <button onclick="export_set_clearset(3,0)" type="button" class="btn-small btn-primary">Clear all items</button>
				<form id="formset3"></form>
			</div>
		</div>
	</div>
</div>
<div class="content-box-header">
	<h3 style="cursor:s-resize; margin-top:0px;">Select rows to be exported as csv</h3>
</div>  
<h4>Row selection criteria to be added ... will process all rows</h4>
<div class="content-box-content" id="column_select_content">
	<div id="colSelectDetails">	
		<div class="row rb-row-1">
			<div class="col-md-2" style="padding-left: 0px">
				<button onclick="do_export()" type="button" class="btn btn-primary">Export</button>
			</div>
		</div>
	</div>
</div> 
</script>
-->

<!--
<script type='text/template' id='T-Send-Email-Commands'>
<h3>Commands</h3>
<ul class="cmd-nav-list">  
<li>
	<a onclick="view_clickit_function('email-send-cancel')" id="email-send-cancel" class="nav-top-item">Cancel</a>
</li>
</ul>  
</script>
-->
 

<!-------------------------> 
<!-- Edit Text template  -->  
<!-------------------------> 

<!--
<script type='text/template' id='T-Edit-Text'>
<h2 id="edit-email-text">Text to be supplied by Javascript</h1>
<div class="row rb-row-1">
	<div class="col-md-12" style="padding-left:0px; font-size:14px; font-weight: Bold; color: rgb(34,34,34)">
		<form id="TextForm"></form>
	</div>
</div>
</script>	
-->

<!-----------------------------------> 
<!-- Edit text commands Templates  -->  
<!-----------------------------------> 

<!--
<script type='text/template' id='T-Edit-Text-Commands'>
<h3>Commands</h3>
<ul class="cmd-nav-list">  
<li>
	<a onclick="view_clickit_function('edit-text-cancel')" id="edit-text-cancel" class="nav-top-item">Cancel</a>
</li>
<li>
	<a onclick="view_clickit_function('edit-text-update')" id="edit-text-update" class="nav-top-item">Update Database</a>
</li>
</ul>  
</script>
-->

<!-------------------------> 
<!-- Send Text Template  -->  
<!-------------------------> 

<!--
<script type='text/template' id='T-Send-Text'>
<h2>Send text to single team contact</h2>
<h3 id="send-team-name-text"></h3>
<table id="texts-table" data-filtering="true" class="hover-yellow"></table>
</script>

-->
<!-----------------------------------> 
<!-- Send text commands Templates  -->  
<!-----------------------------------> 

<!--
<script type='text/template' id='T-Send-Text-Commands'>
<h3>Commands</h3>
<ul class="cmd-nav-list">  
<li>
	<a onclick="view_clickit_function('text-send-cancel')" id="text-send-cancel" class="nav-top-item">Cancel</a>
</li>
</ul>  
</script>
-->

<!-------------------------------> 
<!-- Function select template  -->  
<!-------------------------------> 
  
<!--         
<script type='text/template' id='T-SelectView'>
<div class="row rb-row-1">
	<button type="button" class="btn  btn-success btn-block">Romsey Relay Marathon - Select Function (Level 1)</butto
</div>
<h3>Booking Status:</h3>
<div class="row rb-row-1" style="margin-bottom:0px;margin-top:0px;padding:0px">
<button onclick="view_clickit_top_function('list_all_teams')" style="float:left;margin-top:7px;margin-right:10px" type="button" class="btn-sm btn-primary">List</button>
<h4 style="float:left" >  <%-all_count%>   Teams total in Database</h4>
</div> 
-->

<!--==============================================-->
<!-- Start of Templates for Team Edit (TE) module -->     
<!--==============================================-->

<!-- this code is copied from team.php and must be the same -->

<!------------------------------> 
<!-- COMMON VIEWS TEMPLATE    -->  
<!------------------------------> 

<script type='text/template' id='TE-Common-Views'>
<h3>Views</h3>
<ul class="func-nav-list">
	<li>
		<a onclick="view_change_request('edit-overview')" id="overview-view" class="nav-top-item">Overview</a>
	</li>
	<li>
		<a onclick="view_change_request('edit-registration-info')" id="registration-info-view" class="nav-top-item">Registration</a> 
	</li>
	<li>
		<a onclick="view_change_request('edit-contact-info')" id="contact-info-view" class="nav-top-item">Contact Info</a>
	</li>
	<li>
		<a onclick="view_change_request('edit-team-info')" id="team-info-view" class="nav-top-item">Team Info</a>
	</li>
	<li>
		<a onclick="view_change_request('edit-charity-info')" id="charity-info-view" class="nav-top-item">Charity Info</a>
	</li>
	<li>
		<a onclick="view_change_request('edit-payment-info')" id="payment-info-view" class="nav-top-item">Payment Info</a>
	</li>
	<li>
		<a onclick="view_change_request('edit-charity-info')" id="charity-info-view" class="nav-top-item">Charity Info</a>
	</li>
	<li>
		<a onclick="view_change_request('edit-runners-info')" id="runners-info-view" class="nav-top-item">Runners Info</a>
	</li>
	<!--
	<li>
		<a onclick="view_clickit_function('testing')" id="testing-view" class="nav-top-item">Testing</a>
		<ul>
			<li><a href="*" >Option 1</a></li>
			<li><a href="*" >Option 2</a></li>
			<li><a href="*" >Option 3</a></li>
			<li><a href="*" class="current">Option 4</a></li>
		</ul>
	</li>
	-->
</ul>
</script>

<!---------------------> 
<!-- CONTENT VIEWS   -->  
<!--------------------->  

<!-- Overview -->
<script type='text/template' id='TE-Overview-Content'>
<h2>{{ title }}</h2>
<div id="content-box" class="content-box">        
	<div class="content-box-header">            
        <h3 style="margin-top:0px;font-size:17px;">{{ subtitle }}</h3>            
    </div>   
    <div class="content-box-content">  
    	<p>Dear {{ firstname }},</p> 
    	<p>Welcome to the database for the 2019 Romsey Relay Marathon showing your team information:</p>
    	<p>Your registration information (which cannot be changed) is as follows:</p>
    	<ul>
    	<li>Team Code :  <b>{{ Team_Code }}</b></li>
    	<li>WIX Ticket Number : <b>{{ Ticket_Number }}</b></li>
    	<li>WIX Registration Number : <b>{{ Order_Number }}</b></li>
    	<li>Registered By : <b>{{ Ordered_By }}</b></li>
    	<li>Registration Date : <b>{{ Order_Date }}</b></li>
    	</ul>
    	<p>Your team name is <b>{{ Team_Name }}</b></p>
    	<p>Your admin login ID is <b>{{ Login_id }}</b> and password is <b>{{ Login_pw }}</b></p>
    </div>  
</div
</script>

<!-- Generic template-->
<script type='text/template' id='TE-Generic-Content'>
<h2>{{ text1 }}</h2>
<div id="content-box" class="content-box">        
	<div class="content-box-header">            
        <h3 style="margin-top:0px;font-size:17px;">{{ text1 }}</h3>            
    </div>   
    <div class="content-box-content">
      	<h3>{{ text1 }}</h3>
		<div class="row rb-row-1">
			<div class="col-md-4" style="padding-left: 0px">
				<form id="VAREDIT_FormCol1" autocomplete="off"></form>
			</div>
			<div class="col-md-4" style="padding-left: 0px">
				<form id="VAREDIT_FormCol2" autocomplete="off"></form>
			</div>
		</div>	
		<div class="row rb-row-1">
			<div class="col-md-8" style="padding-left: 0px">
				<form id="VAREDIT_FormCol3" autocomplete="off"></form>
			</div>
		</div>  
    </div>	
</div
</script>

<!--============================================-->
<!-- END of Templates for Team Edit (TE) module -->     
<!--============================================-->
 
<!----------------------------------> 
<!-- Javascript stuff starts here -->
<!---------------------------------->   

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
<script src="https://cdn.quilljs.com/1.3.4/quill.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>
<script src="<?php get_site_url(); ?>/wp-content/plugins/Marathon-Apps/admin/js/libs/underscore-1.6.0.js"></script> 
<script src="<?php get_site_url(); ?>/wp-content/plugins/Marathon-Apps/admin/js/libs/backbone-1.1.2.js"></script>
<script src="<?php get_site_url(); ?>/wp-content/plugins/Marathon-Apps/admin/js/libs/backform.js"></script>
<script src="<?php get_site_url(); ?>/wp-content/plugins/Marathon-Apps/admin/js/libs/moment.min.js"></script>
<script src="<?php get_site_url(); ?>/wp-content/plugins/Marathon-Apps/admin/js/libs/footable.min.js"></script>
<script src="<?php get_site_url(); ?>/wp-content/plugins/Marathon-Apps/admin/js/libs/papaparse.min.js"></script>
<script src="<?php get_site_url(); ?>/wp-content/plugins/Marathon-Apps/admin/js/libs/FileSaver.min.js"></script>
<script src="<?php get_site_url(); ?>/wp-content/plugins/Marathon-Apps/admin/js/libs/js.cookie.js"></script> 
<script src="<?php get_site_url(); ?>/wp-content/plugins/Marathon-Apps/common/libs/liquid.js"></script>
<script src="<?php get_site_url(); ?>/wp-content/plugins/Marathon-Apps/admin/js/%%rrm-const-copy.js%%"></script>
<script src="<?php get_site_url(); ?>/wp-content/plugins/Marathon-Apps/admin/js/%%rrm-varedit.js%%"></script>
<script src="<?php get_site_url(); ?>/wp-content/plugins/Marathon-Apps/admin/js/%%rrm-glob.js%%"></script>
<script src="<?php get_site_url(); ?>/wp-content/plugins/Marathon-Apps/admin/js/%%rrm-funcs.js%%"></script>
<script src="<?php get_site_url(); ?>/wp-content/plugins/Marathon-Apps/admin/js/%%rrm-settings.js%%"></script>
<script src="<?php get_site_url(); ?>/wp-content/plugins/Marathon-Apps/admin/js/%%rrm-teams.js%%"></script>
<script src="<?php get_site_url(); ?>/wp-content/plugins/Marathon-Apps/admin/js/%%rrm-import.js%%"></script>
<script src="<?php get_site_url(); ?>/wp-content/plugins/Marathon-Apps/admin/js/%%rrm-sync.js%%"></script>
<script src="<?php get_site_url(); ?>/wp-content/plugins/Marathon-Apps/admin/js/%%rrm-export.js%%"></script>
<script src="<?php get_site_url(); ?>/wp-content/plugins/Marathon-Apps/admin/js/%%rrm-msgs.js%%"></script>
<script src="<?php get_site_url(); ?>/wp-content/plugins/Marathon-Apps/admin/js/%%rrm-main.js%%"></script>
<script src="<?php get_site_url(); ?>/wp-content/plugins/Marathon-Apps/admin/js/%%rrm-events.js%%"></script>
<script src="<?php get_site_url(); ?>/wp-content/plugins/Marathon-Apps/admin/js/%%rrm-custom.js%%"></script>
<script src="<?php get_site_url(); ?>/wp-content/plugins/Marathon-Apps/admin/js/%%rrm-diags.js%%"></script>
<script src="<?php get_site_url(); ?>/wp-content/plugins/Marathon-Apps/admin/js/%%rrm-common-copy.js%%"></script>
<script src="<?php get_site_url(); ?>/wp-content/plugins/Marathon-Apps/admin/js/%%rrm-team-edit.js%%"></script>
<script>
$(function () 
{
    start_admin();
});
</script>

<!--------------------------------> 
<!-- Javascript stuff ends here -->
<!-------------------------------->   

</body>
</html>
