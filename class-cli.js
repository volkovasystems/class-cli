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
			"DEFAULT_WORKING_DIRECTORY": "../../",
			"DEFAULT_ADAPT_LEVEL": 2,
			"CLI_INTERPRETER_NAMESPACE_PATTERN": /cli-((?:[a-z][a-z0-9]*-?)*[a-z][a-z0-9]*)$/,
			"EVENT": {
				"PROMPT_STRING_MODIFIED": "prompt-string-modified",
				"LINE_STRING_MODIFIED": "line-string-modified",
				"LINE_STRING_INJECTED": "line-string-injected",
				"LINE_STRING_FLOWED": "line-string-flowed"
			}
		}
	@end-class-constant

	@class-constructor-configuration:
	@end-class-constructor-configuration

	@class-constructor-documentation:
	@end-class-constructor-documentation
*/
var CLI = function CLI( promptString, workingDirectory, streamOption ){
	/*:
		@meta-configuration:
			{
				"promptString:optional": "string",
				"workingDirectory:optional": "string",
				"streamOption:optional": "object"
			}
		@end-meta-configuration
	*/
	if( typeof streamOption != "object" ){
		streamOption = { };
	}

	stream.Duplex.call( this, streamOption );
	
	this.initialize.call( this, promptString, workingDirectory );
	this.configure.call( this, promptString, workingDirectory );
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
	"LINE_STRING_FLOWED": "line-string-flowed"
};

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

	this.setMaxListeners( 0 );

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

	this.searchAllCLIInterpreterEngine( );

	this.includeAllCLIInterpreterEngine( );

	this.bindAllCLIInterpreterEngine( );

	process.stdin.pipe( this, { "end": false } );

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
CLI.prototype.setPromptString = function setPromptString( promptString ){
	/*:
		@meta-configuration:
			{
				"promptString:optional": "string",
				"workingDirectory:optional": "string"
			}
		@end-meta-configuration
	*/

	this.promptString = promptString || this.promptString || DEFAULT_PROMPT_STRING;
	this.promptStringList.splice( 0, 2, this.promptString, " " );

	this.emit( EVENT.PROMPT_STRING_MODIFIED, this );

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
CLI.prototype.prependPromptString = function prependPromptString( promptString ){
	/*:
		@meta-configuration:
			{
				"promptString:optional": "string"
			}
		@end-meta-configuration
	*/

	this.promptStringList.splice( 0, 0, promptString );

	this.emit( EVENT.PROMPT_STRING_MODIFIED, this );

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
CLI.prototype.clearPromptString = function clearPromptString( ){
	while( this.promptStringList.pop( ), this.promptStringList.length );

	this.emit( EVENT.PROMPT_STRING_MODIFIED, this );

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
CLI.prototype.formatPromptString = function formatPromptString( ){
	var formatArgumentList = [ 0, 0 ].concat( Array.prototype.slice.call( arguments ) );

	this.clearPromptStringSilently( );

	Array.prototype.splice.apply( this.promptStringList, formatArgumentList );

	this.emit( EVENT.PROMPT_STRING_MODIFIED );

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
		this.workingDirectory = workingDirectory;

		process.chdir( this.workingDirectory );

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
CLI.prototype.setEnvironmentAdaptationLevel = function setEnvironmentAdaptationLevel( level ){
	/*:
		@meta-configuration:
			{
				"level:optional": "number"
			}
		@end-meta-configuration
	*/

	this.environmentAdaptLevel = level || this.environmentAdaptLevel || DEFAULT_ENVIRONMENT_ADAPT_LEVEL;

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

		console.log( cliInterpreterEngineFilePath );

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

		cliInterpreterEngine.call( this );
	}
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

	var self = this;

	var commandLineInterface = readline.createInterface( {
		"input": this,
		"output": this,
		"terminal": true
	} );

	commandLineInterface.setPrompt( this.promptStringList.join( "" ) );

	this.on( EVENT.PROMPT_STRING_MODIFIED,
		function onPromptStringModified( ){
			commandLineInterface.setPrompt( self.promptStringList.join( "" ) );
		} );

	commandLineInterface.on( "line",
		function onLine( line ){
			self.currentLine = line;

			self.emit( EVENT.LINE_STRING_MODIFIED, self );

			if( typeof commandLineNamespace == "string" ){
				var eventNamespace = [ EVENT.LINE_STRING_MODIFIED, commandLineNamespace ].join( ":" );
				self.emit( eventNamespace, self );
			}

			commandLineInterface.prompt( );
		} );

	if( typeof commandLineNamespace == "string" ){
		this.commandLineInterfaceSet[ commandLineNamespace ] = commandLineInterface;
	}else{
		this.commandLineInterfaceList.push( commandLineInterface );
	}

	return commandLineInterface;
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
CLI.prototype._read = function read( size ){
	/*:
		@meta-configuration:
			{
				"size": "number"
			}
		@end-meta-configuration
	*/

	var self = this;

	this.on( EVENT.LINE_STRING_INJECTED,
		function onLineStringInjected( injectedLine ){
			self.push( injectedLine );
			self.push( null );
		} );
};

/*:
	@method-configuration:
		{

		}
	@end-method-configuration

	@method-documentation:
	@end-method-documentation
*/
CLI.prototype._write = function write( chunk, encoding, callback ){
	/*:
		@meta-configuration:
			{
				"chunk": "string",
				"encoding": "string",
				"callback": "function"
			}
		@end-meta-configuration
	*/

	this.currentChunk = chunk;
	this.currentEncoding = encoding;
	this.currentWriteCallback = callback;

	this.emit( EVENT.LINE_STRING_FLOWED, this );

	var self = this;
	setTimeout( function onTimeout( ){
		if( typeof callback == "function" && 
			!callback.hasCalled )
		{	
			callback.call( self );
		}
	}, 0 );
};

var util = require( "util" );
var readline = require( "readline" );
var fs = require( "fs" );
var path = require( "path" );
var stream = require( "stream" );

const DEFAULT_PROMPT_STRING = ">";
const DEFAULT_WORKING_DIRECTORY = "../../";
const DEFAULT_ENVIRONMENT_ADAPT_LEVEL = 2;
const CLI_INTERPRETER_NAMESPACE_PATTERN = /cli-((?:[a-z][a-z0-9]*-?)*[a-z][a-z0-9]*)$/;
const EVENT = {
	"PROMPT_STRING_MODIFIED": "prompt-string-modified",
	"LINE_STRING_MODIFIED": "line-string-modified",
	"LINE_STRING_INJECTED": "line-string-injected",
	"LINE_STRING_FLOWED": "line-string-flowed"
};

var prototypeSet = { };
for( var key in CLI.prototype ){
	prototypeSet[ key ] = CLI.prototype[ key ];
}

util.inherits( CLI, stream.Duplex );

for( var key in prototypeSet ){
	CLI.prototype[ key ] = prototypeSet[ key ];
}

module.exports = CLI;

var cli = new CLI( );
cli.constructCommandLineInterface( );
cli.startCommandLine( );
/*cli.on( EVENT.LINE_STRING_FLOWED,
	function onLineStringFlowed( cli ){
		cli.emit( EVENT.LINE_STRING_INJECTED, cli.currentChunk.toString( ) );
	} );*/