/*:
	@module-license:
		The MIT License (MIT)

		Copyright (c) 2014 Richeve Siodina Bebedor

		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.
	@end-module-license

	@module-configuration:
		{
			 "packageName": "class-cli",
			 "fileName": "class-cli.js",
			 "moduleName": "CLI",
			 "className": "CLI",
			 "authorName": "Richeve S. Bebedor",
			 "authorEMail": "richeve.bebedor@gmail.com",
			 "repository": "git@github.com:volkovasystems/class-cli.git",
			 "testCase": "class-cli-test.js",
			 "isGlobal": true
		}
	@end-module-configuration

	@module-documentation:

	@end-module-documentation

	@include:
		{
			"util@nodejs": "util",
			"readline@nodejs": "readline",
			"fs@nodejs": "fs",
			"path@nodejs": "path"
		}
	@end-include

	@class-constant:
		{
			"DEFAULT_PROMPT_STRING": ">",
			"DEFAULT_PROMPT_STRING_SEPARATOR": "",
			"DEFAULT_WORKING_DIRECTORY": "../../",
			"DEFAULT_ADAPT_LEVEL": 2,
			"CLI_INTERPRETER_NAMESPACE_PATTERN": /cli-((?:[a-z][a-z0-9]*-?)*[a-z][a-z0-9]*)$/,
			"EVENT": {
				"PROMPT_STRING_MODIFIED": "prompt-string-modified",
				"LINE_STRING_MODIFIED": "line-string-modified",
				"LINE_STRING_INJECTED": "line-string-injected",
				"LINE_STRING_FLOWED": "line-string-flowed",
				"FLOWING_LINE_STRING_STOPPED": "flowing-line-string-stopped",
				"WORKING_ENVIRONMENT_CHANGED": "working-environment-changed",
				"COMMAND_LINE_INTERFACE_ENDED": "command-line-interface-ended",
				"CLI_NAMESPACE_SET": "cli-namespace-set"
			}
		}
	@end-class-constant

	@class-constructor-configuration:
	@end-class-constructor-configuration

	@class-constructor-documentation:
	@end-class-constructor-documentation
*/
var CLI = function CLI( promptString, workingDirectory ){
	/*:
		@meta-configuration:
			{
				"promptString:optional": "string",
				"workingDirectory:optional": "string",
				"streamOption:optional": "object"
			}
		@end-meta-configuration
	*/

	this.initialize.call( this, promptString, workingDirectory );
	this.configure.call( this, promptString, workingDirectory );
};

/*:
	@class-property-configuration:
	@end-class-property-configuration

	@class-property-documentation:
	@end-class-property-documentation
*/
CLI.cliContextEnvironmentSet = { };

/*:
	@class-method-configuration:
	@end-class-method-configuration

	@class-method-documentation:
	@end-class-method-documentation
*/
CLI.addCLIContextEnvironment = function addCLIContextEnvironment( cliContextEnvironment ){
	/*:
		@meta-configuration:
			{
				"cliContextEnvironment:required": "CLI"
			}
		@end-meta-configuration
	*/

	if( cliContextEnvironment.cliNamespace &&
		cliContextEnvironment.cliNamespace in CLI.cliContextEnvironmentSet )
	{
		var error = new Error( "cli context environment already registered" );
		console.error( error );
		throw error;
	}

	if( cliContextEnvironment.cliNamespace ){
		CLI.cliContextEnvironmentSet[ cliContextEnvironment.cliNamespace ] = cliContextEnvironment;
	}
};

/*:
	@class-constant-configuration:
	@end-class-constant-configuration

	@class-constant-documentation:
	@end-class-constant-documentation
*/
CLI.EVENT = {
	/*:
		@class-event-constant-configuration:
		@end-class-constant-configuration

		@class-event-constant-documentation:
		@end-class-event-constant-documentation
	*/
	"PROMPT_STRING_MODIFIED": "prompt-string-modified",

	/*:
		@class-event-constant-configuration:
		@end-class-constant-configuration

		@class-event-constant-documentation:
		@end-class-event-constant-documentation
	*/
	"LINE_STRING_MODIFIED": "line-string-modified",

	/*:
		@class-event-constant-configuration:
		@end-class-constant-configuration

		@class-event-constant-documentation:
		@end-class-event-constant-documentation
	*/
	"LINE_STRING_INJECTED": "line-string-injected",

	/*:
		@class-event-constant-configuration:
		@end-class-constant-configuration

		@class-event-constant-documentation:
		@end-class-event-constant-documentation
	*/
	"LINE_STRING_FLOWED": "line-string-flowed",

	/*:
		@class-event-constant-configuration:
		@end-class-constant-configuration

		@class-event-constant-documentation:
		@end-class-event-constant-documentation
	*/
	"FLOWING_LINE_STRING_STOPPED": "flowing-line-string-stopped",

	/*:
		@class-event-constant-configuration:
		@end-class-constant-configuration

		@class-event-constant-documentation:
		@end-class-event-constant-documentation
	*/
	"WORKING_ENVIRONMENT_CHANGED": "working-environment-changed",

	/*:
		@class-event-constant-configuration:
		@end-class-constant-configuration

		@class-event-constant-documentation:
		@end-class-event-constant-documentation
	*/
	"COMMAND_LINE_INTERFACE_ENDED": "command-line-interface-ended",

	/*:
		@class-event-constant-configuration:
		@end-class-constant-configuration

		@class-event-constant-documentation:
		@end-class-event-constant-documentation
	*/
	"CLI_NAMESPACE_SET": "cli-namespace-set"
};

/*:
	@class-constant-configuration:
	@end-class-constant-configuration

	@class-constant-documentation:
	@end-class-constant-documentation
*/
CLI.DEFAULT_PROMPT_STRING_SEPARATOR = "";

/*:
	@class-constant-configuration:
	@end-class-constant-configuration

	@class-constant-documentation:
	@end-class-constant-documentation
*/
CLI.DEFAULT_PROMPT_STRING = ">";

/*:
	@class-constant-configuration:
	@end-class-constant-configuration

	@class-constant-documentation:
	@end-class-constant-documentation
*/
CLI.DEFAULT_WORKING_DIRECTORY = "../../";

/*:
	@class-constant-configuration:
	@end-class-constant-configuration

	@class-constant-documentation:
	@end-class-constant-documentation
*/
CLI.DEFAULT_ENVIRONMENT_ADAPT_LEVEL = 2;

/*:
	@class-constant-configuration:
	@end-class-constant-configuration

	@class-constant-documentation:
	@end-class-constant-documentation
*/
CLI.CLI_INTERPRETER_NAMESPACE_PATTERN = /cli-((?:[a-z][a-z0-9]*-?)*[a-z][a-z0-9]*)$/;

/*:
	@property-configuration:
		{
			"propertyNamespace": "promptStringSeparator",
			"propertyType": "string"
		}
	@end-property-configuration

	@property-documentation:
	@end-property-documentation
*/
CLI.prototype.promptStringSeparator = CLI.DEFAULT_PROMPT_STRING_SEPARATOR;

/*:
	@property-configuration:
		{
			"propertyNamespace": "promptString",
			"propertyType": "string",
			"hasDefaultValue": true
		}
	@end-property-configuration

	@property-documentation:
		This is the initial prompt string before any input.

		Changes made to this variable will fire PROMPT_STRING_MODIFIED event.

		@note: promptStringList is associated to this variable.
		@note: The value of this variable will always be place second to the last of the promptStringList.
		@note: All prompt string will be proceeded by a whitespace.
	@end-property-documentation
*/
CLI.prototype.promptString = CLI.DEFAULT_PROMPT_STRING;

/*:
	@property-configuration:
		{
			"propertyNamespace": "promptStringList",
			"propertyType": "List"
		}
	@end-property-configuration

	@property-documentation:
	@end-property-documentation
*/
CLI.prototype.promptStringList = [ ];

/*:
	@property-configuration:
		{
			"propertyNamespace": "workingDirectory",
			"propertyType": "string",
			"hasDefaultValue": true
		}
	@end-property-configuration

	@property-documentation:
	@end-property-documentation
*/
CLI.prototype.workingDirectory = CLI.DEFAULT_WORKING_DIRECTORY;

/*:
	@property-configuration:
		{
			"propertyNamespace": "environmentAdaptLevel",
			"propertyType": "number",
			"hasDefaultValue": true
		}
	@end-property-configuration

	@property-documentation:
	@end-property-documentation
*/
CLI.prototype.environmentAdaptLevel = CLI.DEFAULT_ENVIRONMENT_ADAPT_LEVEL;

/*:
	@property-configuration:
		{
			"propertyNamespace": "cliInterpreterList",
			"propertyType": "List"
		}
	@end-property-configuration

	@property-documentation:
	@end-property-documentation
*/
CLI.prototype.cliInterpreterList = [ ];

/*:
	@property-configuration:
		{
			"propertyNamespace": "cliInterpreterEngineSet",
			"propertyType": "Set"
		}
	@end-property-configuration

	@property-documentation:
	@end-property-documentation
*/
CLI.prototype.cliInterpreterEngineSet = { };

/*:
	@property-configuration:
		{
			"propertyNamespace": "commandLineInterfaceSet",
			"propertyType": "Set"
		}
	@end-property-configuration

	@property-documentation:
	@end-property-documentation
*/
CLI.prototype.commandLineInterfaceSet = { };

/*:
	@property-configuration:
		{
			"propertyNamespace": "commandLineInterfaceList",
			"propertyType": "List"
		}
	@end-property-configuration

	@property-documentation:
	@end-property-documentation
*/
CLI.prototype.commandLineInterfaceList = [ ];

/*:
	@property-configuration:
		{
			"propertyNamespace": "injectedLineList",
			"propertyType": "List"
		}
	@end-property-configuration

	@property-documentation:
	@end-property-documentation
*/
CLI.prototype.injectedLineList = [ ];

/*:
	@property-configuration:
		{
			"propertyNamespace": "CLINamespace",
			"propertyType": "string"
		}
	@end-property-configuration

	@property-documentation:
	@end-property-documentation
*/
CLI.prototype.cliNamespace = "";

/*:
	@method-configuration:
		{

		}
	@end-method-configuration

	@method-documentation:
	@end-method-documentation
*/
CLI.prototype.initialize = function initialize( promptString, workingDirectory ){
	/*:
		@meta-configuration:
			{
				"promptString:optional": "string",
				"workingDirectory:optional": "string"
			}
		@end-meta-configuration
	*/

	this.setPromptString( promptString );

	this.setWorkingDirectory( workingDirectory );

	return this;
};

/*:
	@method-configuration:
		{

		}
	@end-method-configuration

	@method-documentation:
	@end-method-documentation
*/
CLI.prototype.configure = function configure( promptString, workingDirectory ){
	/*:
		@meta-configuration:
			{
				"promptString:optional": "string",
				"workingDirectory:optional": "string"
			}
		@end-meta-configuration
	*/

	this.setMaxListeners( 0 );

	this.searchAllCLIInterpreterEngine( );

	this.includeAllCLIInterpreterEngine( );

	this.bindAllCLIInterpreterEngine( );

	this.registerEventListener( );

	return this;
};

CLI.prototype.registerEventListener = function registerEventLister( ){
	var self = this;

	this.listenToEvent( EVENT.WORKING_ENVIRONMENT_CHANGED,
		function onWorkingEnvironmentChanged( ){
			self.searchAllCLIInterpreterEngine( );

			self.includeAllCLIInterpreterEngine( );

			self.bindAllCLIInterpreterEngine( );
		} );

	return this;
};

CLI.prototype.fireEvent = function fireEvent( eventName, specificNamespace, eventDataList ){
	eventDataList = Array.prototype.slice.call( arguments ).slice( 2 );

	var eventNamespace = this.resolveNamespace( eventName, specificNamespace );

	eventDataList.splice( 0, 0, eventNamespace );

	this.emit.apply( this, eventDataList );
};

CLI.prototype.listenToEvent = function listenToEvent( eventName, specificNamespace, eventHandler ){
	var eventNamespace = this.resolveNamespace( eventName, specificNamespace );

	var self = this;
	var delegateHandler = function delegateHandler( ){
		eventHandler.apply( self, Array.prototype.slice.call( arguments ) );
	}

	this.on( eventNamespace, delegateHandler );
};

CLI.prototype.setCLINamespace = function setCLINamespace( cliNamespace ){
	if( this.cliNamespace &&
		typeof this.cliNamespace == "string" )
	{
		console.warn( "CLI namespace for this instance is already set" );
		console.warn( "it was designed that the namespace for any CLI instance not to change once set because it will have bubble effects in future implementations" );

	}else{
		this.cliNamespace = cliNamespace;

		CLI.addCLIContextEnvironment( this );

		this.fireEvent( EVENT.CLI_NAMESPACE_SET, null, this.cliNamespace );
	}

	return this;
};

CLI.prototype.resolveNamespace = function resolveNamespace( eventName, specificNamespace ){
	return [ 
		eventName,
		this.cliSessionNamespace || this.cliNamespace || "",
		specificNamespace || ""
	].join( ":" ).replace( /\:+/g, ":" );
};

CLI.prototype.checkIfCLISession = function checkIfCLISession( ){
	return ( typeof this.cliSessionNamespace == "string" && this.cliSessionNamespace );
};

CLI.prototype.transformAsCLISession = function transformAsCLISession( cliSessionNamespace ){
	if( this.checkIfCLISession( ) ){
		var error = new Error( "cli is already in session" );
		console.error( error );
		throws error;
	}

	this.cliSessionNamespace = cliSessionNamespace;

	this.fireEvent( EVENT.CLI_SESSION_NAMESPACE_SET, this.cliSessionNamespace );

	this.listenToEvent( EVENT.CLI_SESSION_ENDED,
		function onCLISessionEnded( ){
			this.cliSessionNamespace = "";
		} );

	return this;
};

CLI.prototype.cloneAsCLISession = function cloneAsCLISession( cliSessionNamespace ){

};

/*:
	@method-configuration:
		{

		}
	@end-method-configuration

	@method-documentation:
	@end-method-documentation
*/
CLI.prototype.setPromptString = function setPromptString( promptString, commandLineNamespace ){
	/*:
		@meta-configuration:
			{
				"promptString:optional": "string",
				"specificNamespace:optional": "string"
			}
		@end-meta-configuration
	*/

	this.promptString = promptString || this.promptString || DEFAULT_PROMPT_STRING;
	this.promptStringList.splice( 0, 2, this.promptString, " " );

	this.fireEvent( EVENT.PROMPT_STRING_MODIFIED, commandLineNamespace, this.buildPromptString( ) );

	return this;
};

/*:
	@method-configuration:
		{

		}
	@end-method-configuration

	@method-documentation:
	@end-method-documentation
*/
CLI.prototype.prependPromptString = function prependPromptString( promptString, commandLineNamespace ){
	/*:
		@meta-configuration:
			{
				"promptString:optional": "string",
				"commandLineNamespace:optional": "string"
			}
		@end-meta-configuration
	*/

	this.promptStringList.splice( 0, 0, promptString );

	this.fireEvent( EVENT.PROMPT_STRING_MODIFIED, commandLineNamespace, this.buildPromptString( ) );

	return this;
};

/*:
	@method-configuration:
		{

		}
	@end-method-configuration

	@method-documentation:
	@end-method-documentation
*/
CLI.prototype.clearPromptString = function clearPromptString( commandLineNamespace ){
	while( this.promptStringList.pop( ), this.promptStringList.length );

	this.fireEvent( EVENT.PROMPT_STRING_MODIFIED, commandLineNamespace, this.buildPromptString( ) );

	return this;
};

/*:
	@method-configuration:
		{

		}
	@end-method-configuration

	@method-documentation:
	@end-method-documentation
*/
CLI.prototype.clearPromptStringSilently = function clearPromptStringSilently( ){
	while( this.promptStringList.pop( ), this.promptStringList.length );

	return this;
};

/*:
	@method-configuration:
		{

		}
	@end-method-configuration

	@method-documentation:
	@end-method-documentation
*/
CLI.prototype.resetPromptString = function resetPromptString( ){
	this.clearPromptStringSilently( );

	this.setPromptString( this.promptString );

	return this;
};

/*:
	@method-configuration:
		{

		}
	@end-method-configuration

	@method-documentation:
	@end-method-documentation
*/
CLI.prototype.formatPromptString = function formatPromptString( commandLineNamespace ){
	var formatArgumentList = [ 0, 0 ].concat( Array.prototype.slice.call( arguments ) );

	this.clearPromptStringSilently( );

	Array.prototype.splice.apply( this.promptStringList, formatArgumentList );

	this.fireEvent( EVENT.PROMPT_STRING_MODIFIED, commandLineNamespace, this.buildPromptString( ) );

	return this;
};

/*:
	 @method-configuration:
		{

		}
	@end-method-configuration

	@method-documentation:
	@end-method-documentation
*/
CLI.prototype.setPromptStringSeparator = function setPromptStringSeparator( promptStringSeparator, commandLineNamespace ){
	if( promptStringSeparator != this.promptStringSeparator ){
		this.promptStringSeparator = promptStringSeparator;

		this.fireEvent( EVENT.PROMPT_STRING_MODIFIED, commandLineNamespace, this.buildPromptString( ) );
	}

	return this;
};

/*:
	@method-configuration:
		{

		}
	@end-method-configuration

	@method-documentation:
	@end-method-documentation
*/
CLI.prototype.buildPromptString = function buildPromptString( promptStringSeparator ){
	/*:
		@meta-configuration:
			{
				"promptStringSeparator:optional": "string"
			}
		@end-meta-configuration
	*/

	if( typeof promptStringSeparator == "string" ){
		this.setPromptStringSeparator( promptStringSeparator );
	}

	return this.promptStringList.join( this.promptStringSeparator );
};

/*:
	@method-configuration:
		{

		}
	@end-method-configuration

	@method-documentation:
	@end-method-documentation
*/
CLI.prototype.setWorkingDirectory = function setWorkingDirectory( workingDirectory ){
	/*:
		@meta-configuration:
			{
				"workingDirectory:optional": "string"
			}
		@end-meta-configuration
	*/

	workingDirectory = workingDirectory || this.workingDirectory || DEFAULT_WORKING_DIRECTORY;

	if( fs.existsSync( workingDirectory ) &&
		fs.statSync( workingDirectory ).isDirectory( ) )
	{
		var previousWorkingDirectory = this.workingDirectory;

		this.workingDirectory = workingDirectory;

		process.chdir( this.workingDirectory );

		if( this.workingDirectory != previousWorkingDirectory ){
			this.fireEvent( EVENT.WORKING_ENVIRONMENT_CHANGED );
		}

	}else{
		var error = new Error( "fatal:given working directory is not existing" );
		console.error( error );
		throw error;
	}

	return this;
};

/*:
	@method-configuration:
		{

		}
	@end-method-configuration

	@method-documentation:
	@end-method-documentation
*/
CLI.prototype.setEnvironmentAdaptationLevel = function setEnvironmentAdaptationLevel( environmentAdaptLevel ){
	/*:
		@meta-configuration:
			{
				"level:optional": "number"
			}
		@end-meta-configuration
	*/

	this.environmentAdaptLevel = environmentAdaptLevel || this.environmentAdaptLevel || DEFAULT_ENVIRONMENT_ADAPT_LEVEL;

	return this;
};

/*:
	@method-configuration:
		{

		}
	@end-method-configuration

	@method-documentation:
	@end-method-documentation
*/
CLI.prototype.adaptWorkingEnvironment = function adaptWorkingEnvironment( environmentAdaptLevel ){
	/*:
		@meta-configuration:
			{
				"environmentAdaptLevel:optional": "number"
			}
		@end-meta-configuration
	*/

	this.setEnvironmentAdaptationLevel( environmentAdaptLevel );

	this.adaptedWorkingEnvironment = module.filename.split( path.sep ).reverse( ).slice( this.environmentAdaptLevel ).reverse( ).join( path.sep );

	this.setWorkingDirectory( this.adaptedWorkingEnvironment );

	return this;
};

/*:
	@method-configuration:
		{

		}
	@end-method-configuration

	@method-documentation:
	@end-method-documentation
*/
CLI.prototype.setCLIInterpreterList = function setCLIIntepreterList( cliInterpreterList ){
	while(
		this.cliInterpreterList.pop( ),
		this.cliInterpreterList.length
	);

	while(
		this.cliInterpreterList.push( cliInterpreterList.pop( ) ),
		cliInterpreterList.length
	);

	return this;
};

/*:
	@method-configuration:
		{

		}
	@end-method-configuration

	@method-documentation:
	@end-method-documentation
*/
CLI.prototype.searchAllCLIInterpreterEngine = function searchAllCLIInterpreterEngine( ){
	//: Since we are now inside the working directory, we will assume other cli modules reside on this directory.
	var workingDirectory = process.cwd( );

	var directoryList = fs.readdirSync( workingDirectory );

	var directoryPath = null;
	var cliInterpreterList = [ ];
	var cliInterpreterNamespace = null;
	var cliInterpreterEngineFilePath = null;

	//: We will read any modules that pass the cli interpreter namespace pattern.
	var directoryListLength = directoryList.length;
	for( var index = 0; index < directoryListLength; index++ ){
		directoryPath = directoryList[ index ];

		if( fs.statSync( directoryPath ).isDirectory( ) &&
			CLI_INTERPRETER_NAMESPACE_PATTERN.test( directoryPath ) )
		{
			cliInterpreterNamespace = directoryPath.match( CLI_INTERPRETER_NAMESPACE_PATTERN )[ 0 ];
			cliInterpreterEngineFilePath = [ workingDirectory, directoryPath, cliInterpreterNamespace + ".js" ].join( path.sep );
			cliInterpreterList.push( cliInterpreterEngineFilePath );
		}
	}

	if( cliInterpreterList.length > 0 ){
		this.setCLIInterpreterList( cliInterpreterList );	
	}

	return this;
};

/*:
	@method-configuration:
		{

		}
	@end-method-configuration

	@method-documentation:
	@end-method-documentation
*/
CLI.prototype.setCLIInterpreterEngineSet = function setCLIInterpreterEngineSet( cliInterpreterEngineSet ){
	/*:
		@meta-configuration:
			{
				"cliInterpreterEngineSet": "Set"
			}
		@end-meta-configuration
	*/

	for( var cliInterpreterName in cliInterpreterEngineSet ){
		this.cliInterpreterEngineSet[ cliInterpreterName ] = cliInterpreterEngineSet[ cliInterpreterName ];
	}

	return this;
};

/*:
	@method-configuration:
		{

		}
	@end-method-configuration

	@method-documentation:
	@end-method-documentation
*/
CLI.prototype.includeAllCLIInterpreterEngine = function includeAllCLIInterpreterEngine( ){
	var cliInterpreterEngineSet = { };
	var cliInterpreterEngineNamespace = null;
	var cliInterpreterEngineFilePath = null;

	var cliInterpreterList = this.cliInterpreterList;

	//: All passed cli interpreter modules will then be required.
	var cliInterpreterListLength = cliInterpreterList.length;
	for( var index = 0; index < cliInterpreterListLength; index++ ){
		cliInterpreterEngineFilePath = cliInterpreterList[ index ];

		cliInterpreterEngineNamespace = cliInterpreterEngineFilePath.split( ".js" )[ 0 ].match( CLI_INTERPRETER_NAMESPACE_PATTERN )[ 1 ];

		if( fs.existsSync( cliInterpreterEngineFilePath ) &&
			fs.statSync( cliInterpreterEngineFilePath ).isFile( ) )
		{
			try{
				cliInterpreterEngineSet[ cliInterpreterEngineNamespace ] = require( cliInterpreterEngineFilePath );

			}catch( error ){
				console.warn( "error encountered during CLI interpreter engine inclusion" );
				console.warn( "please check each CLI interpreter module for possible cause of error" );
				console.error( error );
			}
		}
	}

	this.setCLIInterpreterEngineSet( cliInterpreterEngineSet );

	return this;
};

/*:
	@method-configuration:
		{

		}
	@end-method-configuration

	@method-documentation:
	@end-method-documentation
*/
CLI.prototype.bindAllCLIInterpreterEngine = function bindAllCLIInterpreterEngine( ){
	var cliInterpreterEngineSet = this.cliInterpreterEngineSet;

	var cliInterpreterEngine = null;
	for( var cliInterpreterName in cliInterpreterEngineSet ){
		cliInterpreterEngine = cliInterpreterEngineSet[ cliInterpreterName ];

		cliInterpreterEngine.call( this, CLI );
	}

	return this;
};

/*:
	@method-configuration:
		{

		}
	@end-method-configuration

	@method-documentation:
	@end-method-documentation
*/
CLI.prototype.constructCommandLineInterface = function constructCommandLineInterface( commandLineNamespace ){
	/*:
		@meta-configuration:
			{
				"commandLineNamespace:optional": "string"
			}
		@end-meta-configuration
	*/

	var commandLineInterface = readline.createInterface( {
		"input": process.stdin,
		"output": process.stdout,
		"terminal": true
	} );

	commandLineInterface.setPrompt( this.buildPromptString( ) );

	if( typeof commandLineNamespace == "string" &&
		commandLineNamespace )
	{
		this.constructSpecificCommandLineInterface( commandLineNamespace, commandLineInterface );

	}else{
		this.constructDisposableCommandLineInterface( commandLineInterface );
	}

	return this;
};

/*:
	@method-configuration:
		{

		}
	@end-method-configuration

	@method-documentation:
	@end-method-documentation
*/
CLI.prototype.constructSpecificCommandLineInterface = function constructSpecificCommandLineInterface( commandLineNamespace, commandLineInterface ){
	/*:
		@meta-configuration:
			{
				"commandLineInterface:required": "readline.Interface"
				"commandLineNamespace:required": "string"
			}
		@end-meta-configuration
	*/

	if( !( commandLineInterface instanceof readline.Interface ) ){
		this.constructCommandLineInterface( commandLineNamespace );

	}else{
		this.commandLineInterfaceSet[ commandLineNamespace ] = commandLineInterface;

		this.configureCommandLineInterface( commandLineInterface, commandLineNamespace );
	}

	return this;
};

/*:
	@method-configuration:
		{

		}
	@end-method-configuration

	@method-documentation:
	@end-method-documentation
*/
CLI.prototype.constructDisposableCommandLineInterface = function constructDisposableCommandLineInterface( commandLineInterface ){
	/*:
		@meta-configuration:
			{
				"commandLineInterface:required": "readline.Interface"
			}
		@end-meta-configuration
	*/

	if( !( commandLineInterface instanceof readline.Interface ) ){
		this.constructCommandLineInterface( commandLineNamespace );

	}else{
		this.commandLineInterfaceList.push( commandLineInterface );

		this.configureCommandLineInterface( commandLineInterface );
	}

	return this;
};

/*:
	@method-configuration:
		{

		}
	@end-method-configuration

	@method-documentation:
	@end-method-documentation
*/
CLI.prototype.configureCommandLineInterface = function configureCommandLineInterface( commandLineInterface, commandLineNamespace ){
	/*:
		@meta-configuration:
			{
				"commandLineInterface:required": "readline.Interface"
				"commandLineNamespace:optional": "string"
			}
		@end-meta-configuration
	*/

	var self = this;

	commandLineNamespace = commandLineNamespace || "";

	this.listenToEvent( EVENT.PROMPT_STRING_MODIFIED, commandLineNamespace,
		function onPromptStringModified( promptString ){
			commandLineInterface.setPrompt( promptString );
		} );

	commandLineInterface.on( "line",
		function onLine( line ){
			self.fireEvent( EVENT.LINE_STRING_MODIFIED, commandLineNamespace, line, commandLineInterface );

			commandLineInterface.prompt( );
		} );

	commandLineInterface.input.on( "data",
		function onData( data ){
			self.fireEvent( EVENT.LINE_STRING_FLOWED, commandLineNamespace, data );
		} );

	commandLineInterface.input.on( "end",
		function onEnd( ){
			self.fireEvent( EVENT.FLOWING_LINE_STRING_STOPPED, commandLineNamespace );
		} );

	this.listenToEvent( EVENT.LINE_STRING_INJECTED, commandLineNamespace,
		function onLineStringInjected( chunk, encoding, callback ){
			commandLineInterface.output.end( chunk, encoding, callback )
		} );

	this.listenToEvent( EVENT.COMMAND_LINE_INTERFACE_ENDED, commandLineNamespace,
		function onCommandLineInterfaceEnded( ){
			commandLineInterface.close( );
		} );

	return this;
};

/*:
	@method-configuration:
		{

		}
	@end-method-configuration

	@method-documentation:
	@end-method-documentation
*/
CLI.prototype.startCommandLine = function startCommandLine( commandLineNamespace ){
	/*:
		@meta-configuration:
			{
				"commandLineNamespace:optional": "string"
			}
		@end-meta-configuration
	*/

	if( typeof commandLineNamespace == "string" &&
		commandLineNamespace in this.commandLineInterfaceSet )
	{
		this.commandLineInterfaceSet[ commandLineNamespace ].prompt( );

	}else{
		this.commandLineInterfaceList.splice( 0, 1 ).pop( ).prompt( );
	}

	return this;
};

/*:
	@method-configuration:
		{

		}
	@end-method-configuration

	@method-documentation:
	@end-method-documentation
*/
CLI.prototype.endCommandLine = function endCommandLine( commandLineNamespace ){
	/*:
		@meta-configuration:
			{
				"commandLineNamespace:optional": "string"
			}
		@end-meta-configuration
	*/

	this.fireEvent( EVENT.COMMAND_LINE_INTERFACE_ENDED, commandLineNamespace );

	return this;
};

/*:
	@method-configuration:
		{

		}
	@end-method-configuration

	@method-documentation:
	@end-method-documentation
*/
CLI.prototype.destroyCLIContextEnvironment = function destroyCLIContextEnvironment( ){

};

var util = require( "util" );
var readline = require( "readline" );
var fs = require( "fs" );
var path = require( "path" );
var events = require( "events" );

const DEFAULT_PROMPT_STRING_SEPARATOR = "";
const DEFAULT_PROMPT_STRING = ">";
const DEFAULT_WORKING_DIRECTORY = "../../";
const DEFAULT_ENVIRONMENT_ADAPT_LEVEL = 2;
const CLI_INTERPRETER_NAMESPACE_PATTERN = /cli-((?:[a-z][a-z0-9]*-?)*[a-z][a-z0-9]*)$/;
const EVENT = {
	"PROMPT_STRING_MODIFIED": "prompt-string-modified",
	"LINE_STRING_MODIFIED": "line-string-modified",
	"LINE_STRING_INJECTED": "line-string-injected",
	"LINE_STRING_FLOWED": "line-string-flowed",
	"FLOWING_LINE_STRING_STOPPED": "flowing-line-string-stopped",
	"WORKING_ENVIRONMENT_CHANGED": "working-environment-changed",
	"COMMAND_LINE_INTERFACE_ENDED": "command-line-interface-ended",
	"CLI_NAMESPACE_SET": "cli-namespace-set",
	"CLI_SESSION_NAMESPACE_SET": "cli-session-namespace-set",
	"CLI_SESSION_ENDED": "cli-session-ended"
};

var prototypeSet = { };
for( var key in CLI.prototype ){
	prototypeSet[ key ] = CLI.prototype[ key ];
}

util.inherits( CLI, events.EventEmitter );

for( var key in prototypeSet ){
	CLI.prototype[ key ] = prototypeSet[ key ];
}

module.exports = CLI;

var cli = new CLI( );
cli
	.adaptWorkingEnvironment( )
	.constructCommandLineInterface( )
	.startCommandLine( );