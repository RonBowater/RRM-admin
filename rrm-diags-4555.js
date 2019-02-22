"use strict";



//-------------- 
// diagnostics
//------------

function run_diags()
{
	// check that all export fields are in the database schema
	for (var iexport=0; iexport<db_export.length; iexport++)
	{
		var found = 0
		for (var ischema=0; ischema<db_schema.length; ischema++)
		{
			if (db_export[iexport][DB_EXPORT_FIELD_NAME]==db_schema[ischema][DB_SCHEMA_FIELD_NAME])
			{
				found = 1;
				break;
			}
		}	
		if (found==0)
		{
			alert("ERROR: Export field " + db_export[iexport][DB_EXPORT_FIELD_NAME] + " is not in database");
		}
	}		
		
		
	/*	
	// check that all import fields are in the database schema
	for (var iimport=0; iimport<db_import_map.length; iimport++)
	{
		if (db_import_map[iimport][DB_IMPORT_MAP_DB_NAME]!="")
		{
			var found = 0
			for (var ischema=0; ischema<db_schema.length; ischema++)
			{
				if (db_import_map[iimport][DB_IMPORT_MAP_DB_NAME]==db_schema[ischema][DB_SCHEMA_FIELD_NAME])
				{
					found = 1;
					break;
				}
			}	
			if (found==0)
			{
				clear_and_display_modal();
				alert("ERROR: Import field " + db_import_map[iimport][DB_IMPORT_MAP_DB_NAME] + " is not in database");
			}
		}
	}
	*/
	
 	// check that all add default fields are in the database schema
	for (var iadd=0; iadd<db_add_defaults.length; iadd++)
	{
		var found = 0
		for (var ischema=0; ischema<db_schema.length; ischema++)
		{
			if (db_add_defaults[iadd][DB_DEFAULTS_DB_NAME]==db_schema[ischema][DB_SCHEMA_FIELD_NAME])
			{
				found = 1;
				break;
			}
		}	
		if (found==0)
		{
			clear_and_display_modal();
			alert("ERROR: Add default field " + db_add_defaults[iadd][DB_DEFAULTS_DB_NAME] + " is not in database");
		}
	}		
}






