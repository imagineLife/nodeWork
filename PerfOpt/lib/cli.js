/*
 * CLI-related tasks
 *
 */

 // Dependencies
 /*
	READLINE
	https://nodejs.org/docs/latest-v9.x/api/readline.html
	The readline module provides an interface 
	for reading data from a Readable stream 
	(such as process.stdin) one line at a time. 
*/

const readline = require('readline');

/*
	OS
	https://nodejs.org/api/os.html#os_os_freemem
	The os module provides operating system-related
	 utility methods and properties.
*/
const os = require('os')

/*
	v8
	https://nodejs.org/api/v8.html
	The v8 module exposes APIs that are specific
	to the version of V8 built into the Node.js binary. 
*/
const v8 = require('v8');

/*
  Includes Child Process Spawn
  https://nodejs.org/api/child_process.html
  https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
*/
const { spawn } = require('child_process')

const util = require('util');
const debug = util.debuglog('cli');
const events = require('events');
class _events extends events{};
const e = new _events();
const dataLib = require('./data')
const logsLib = require('./logs')
const helpers = require('./helpers')

const makeHeader = (str) => {
	cli.horizontalLine();
  cli.centered(str);
  cli.horizontalLine();
  cli.verticalSpace(2);
}

const logTheData = obj => {
	for(var key in obj){
     if(obj.hasOwnProperty(key)){
        var value = obj[key];
        var line = '      \x1b[33m '+key+'      \x1b[0m';
        var padding = 60 - line.length;
        for (i = 0; i < padding; i++) {
            line+=' ';
        }
        line+=value;
        console.log(line);
        cli.verticalSpace();
     }
  }
}

const makeFooter = (spaceHeight) => {
	// Create a footer for the stats
  cli.verticalSpace(spaceHeight);
  cli.horizontalLine();
}

// Instantiate the cli module object
let cli = {};

// Input handlers
e.on('man',function(str){
  cli.responders.help();
});

e.on('help',function(str){
  cli.responders.help();
});

e.on('exit',function(str){
  cli.responders.exit();
});

e.on('stats',function(str){
  cli.responders.stats();
});

e.on('list users',function(str){
  cli.responders.listUsers();
});

e.on('more user info',function(str){
  cli.responders.moreUserInfo(str);
});

e.on('list checks',function(str){
  cli.responders.listChecks(str);
});

e.on('more check info',function(str){
  cli.responders.moreCheckInfo(str);
});

e.on('list logs',function(){
  cli.responders.listLogs();
});

e.on('more log info',function(str){
  cli.responders.moreLogInfo(str);
});


// Responders object
cli.responders = {};

// Help / Man
cli.responders.help = function(){
  // Codify the commands and their explanations
  var commands = {
    'exit' : 'Kill the CLI (and the rest of the application)',
    'man' : 'Show this help page',
    'help' : 'Alias of the "man" command',
    'stats' : 'Get statistics on the underlying operating system and resource utilization',
    'List users' : 'Show a list of all the registered (undeleted) users in the system',
    'More user info --{userId}' : 'Show details of a specified user',
    'List checks --up --down' : 'Show a list of all the active checks in the system, including their state. The "--up" and "--down flags are both optional."',
    'More check info --{checkId}' : 'Show details of a specified check',
    'List logs' : 'Show a list of all the log files available to be read (compressed and uncompressed)',
    'More log info --{logFileName}' : 'Show details of a specified log file',
  };

  // Show a header for the help page that is as wide as the screen
  makeHeader('CLI MANUAL')

  // Show each command, followed by its explanation, in white and yellow respectively
  logTheData(commands)

  makeFooter(1);
};

// Exit
cli.responders.exit = function(){
  process.exit(0);
};

// Stats
cli.responders.stats = function(){
  
	//stats obj
	let dataToSee = {
		/*
			loadavg
			Returns an array containing the 1, 5,
			 and 15 minute load averages. The load
			 average is a measure of system activity 
			 calculated by the operating system and 
			 expressed as a fractional number. The 
			 load average is a Unix-specific concept. 
			 On Windows, the return value is
			  always [0, 0, 0].
		*/
		'Load Average': os.loadavg().join(' '),
		'CPU Count': os.cpus().length,
		'Free Memory': os.freemem(),
		'Current Malloced Memory' : v8.getHeapStatistics().malloced_memory,
		'Peak Malloced Memory' : v8.getHeapStatistics().peak_malloced_memory,
    'Allocated Heap Used (%)' : Math.round((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size) * 100),
    'Available Heap Allocated (%)' : Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) * 100),
    'Uptime' : os.uptime()+' Seconds'
	}

	makeHeader('CLI MANUAL')

	// Log out each stat
	logTheData(dataToSee)

	makeFooter();

};

// List Users
cli.responders.listUsers = function(){
  
	dataLib.listFiles('users', (err, userIds) => {
		if(!err && userIds && userIds.length > 0){

			cli.verticalSpace()

			userIds.forEach(userId => {
				dataLib.read('users',userId, (err,userData) => {
					if(!err && userData){
						let line = `Name: ${userData.firstName} ${userData.lastName}  Phone: ${userData.phone} Checks: `
						let checkCount = typeof(userData.checks) == 'object' && userData.checks instanceof Array && userData.checks.length > 0 ? userData.checks.length : 0;
						line += checkCount;
						console.log(line)
						cli.verticalSpace()
					}
				})
			})
		}
	})
};

// More user info
cli.responders.moreUserInfo = function(str){
  
  //get ID from string
  let strArr = str.split('--')
  let userID = typeof(strArr[1]) == 'string' && strArr[1].length > 0 ? strArr[1] : false;

  if(userID){
  	dataLib.read('users', userID, (err,userData) => {
  		if(!err && userData){
  			//remove password
  			delete userData.hashedPassword;

  			//print json with text highlighted
  			cli.verticalSpace()
  			console.dir(userData, {'colors': true});
  		}
  	})
  }
};

// List Checks
cli.responders.listChecks = function(str){
  dataLib.listFiles('checks', (err, checkIds) => {
  	if(!err && checkIds && checkIds.length > 0){
  		checkIds.forEach(thisCheck => {
  			dataLib.read('checks', thisCheck, (errTwo, checkData) => {
  				if(!errTwo && checkData){
  					const includeCheck = false;
  					const lowerString = str.toLowerCase()
  					const checkState = typeof(checkData.state) == 'string' ? checkData.state : 'down';
  					const stateOrUnknown = typeof(checkData.state) == 'string' ? checkData.state : 'unknown';
  					//if user SPECIFIED the state...
  					if(
  						(lowerString.indexOf(`--${checkState}`) > -1) 
  						||
  						(lowerString.indexOf('--down') == -1 && lowerString.indexOf('--up') == -1) 
  					){
  						const line = `ID: ${checkData.id} ${checkData.method.toUpperCase()} ${checkData.protocol}://${checkData.url} State: ${stateOrUnknown}`;
              console.log(line);
              cli.verticalSpace();
  					}
  				}
  			})
  		})
  	}
  })
};

// More check info
cli.responders.moreCheckInfo = function(str){
  //get check ID from input
  const checkIDS = str.split('--')
  let checkID = checkIDS[1]
  checkID = typeof(checkID) == 'string'
  	&& checkID.trim().length > 0 
  	? checkID.trim()
  	: false;

  if(checkID){
  	// look up user
  	dataLib.read('checks', checkID, (err, checkData) => {
  		if(!err && checkData){

  			cli.verticalSpace()
  			console.dir(checkData, {'colors': true});
  			cli.verticalSpace()  			
  		}
  	})
  }
};

// List Logs
cli.responders.listLogs = function(){
	cli.verticalSpace();

  //using child-process to get logs list
  const fileList = spawn('ls', ['./.logs/'])

  fileList.stdout.on('data', function(dataObj){
    const dataStr = dataObj.toString()
    const logFileNames = dataStr.split('\n')

    logFileNames.forEach(logName => {
      let isStr = typeof(logName) === 'string';
      let nameHasLength = logName.trim().length > 0;
      let hasDash = logName.indexOf('-') > -1
      if(
        isStr &&
        nameHasLength &&
        hasDash
      ){
        console.log(logName.trim().split('.')[0]);
        cli.verticalSpace()
      }
    })
  })
};

// More logs info
cli.responders.moreLogInfo = function(str){
  
	//get log name
  const inputVals = str.split('--')
  let logName = inputVals[1]
  logName = (typeof(logName) == 'string' && logName.trim().length > 0 ? logName : false)

  if(logName){
  	cli.verticalSpace()

  	//de-compress log
  	logsLib.decompress(logName, (err,logString) => {
  		if(!err && logString){

  			const strArr = logString.split('\n')
  			strArr.forEach(str => {
  				let log = helpers.parseJsonToObject(str)
  				console.dir(log, {'colors': true});
  				cli.verticalSpace()
  			})

  		}
  	})
  }
};

// Input processor
cli.processInput = function(str){
  str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : false;
  // Only process the input if the user actually wrote something, otherwise ignore it
  if(str){
    // Codify the unique strings that identify the different unique questions allowed be the asked
    let uniqueInputs = [
      'man',
      'help',
      'exit',
      'stats',
      'list users',
      'more user info',
      'list checks',
      'more check info',
      'list logs',
      'more log info'
    ];

    // Go through the possible inputs, emit event when a match is found
    let matchFound = false;
    let counter = 0;
    uniqueInputs.some(function(input){
      if(str.toLowerCase().indexOf(input) > -1){
        matchFound = true;
        // Emit event matching the unique input, and include the full string given
        e.emit(input,str);
        return true;
      }
    });

    // If no match is found, tell the user to try again
    if(!matchFound){
      console.log("Sorry, try again");
    }

  }
};

// Init script
cli.init = function(){

	//start the cli interface
	/*
		Instances of the readline.Interface class are constructed
		 using the readline.createInterface() method. Every instance
		 is associated with a single input Readable stream and
		 a single output Writable stream. The output stream is used 
		 to print prompts for user input that arrives on, 
		 and is read from, the input stream.
	*/
  // Send to console, in dark blue
  console.log('\x1b[34m%s\x1b[0m','The CLI is running');

  // Start the interface
  let cliInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: ''
  });

  // Create an initial prompt
  cliInterface.prompt();

  // Handle each line of input separately
  cliInterface.on('line', function(str){
    // Send to the input processor
    cli.processInput(str);

    // Re-initialize the prompt afterwards
    /*
		The rl.prompt() method writes the readline.Interface 
		instances configured prompt to a new line in output in order to 
		provide a user with a new location at which to provide input.
			When called, rl.prompt() will resume the input stream if 
		it has been paused.
			If the readline.Interface was created with output set 
			to null or undefined the prompt is not written.
	*/
    cliInterface.prompt();
  });

  // If the user stops the CLI, kill the associated process
  cliInterface.on('close', function(){
    process.exit(0);
  });

};

// Create a horizontal line across the screen
cli.horizontalLine = function(){

  // Get the available screen size
  var width = process.stdout.columns;

  // Put in enough dashes to go across the screen
  var line = '';
  for (i = 0; i < width; i++) {
      line+='-';
  }
  console.log(line);


};

// Create centered text on the screen
cli.centered = function(str){
  str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : '';

  // Get the available screen size
  var width = process.stdout.columns;

  // Calculate the left padding there should be
  var leftPadding = Math.floor((width - str.length) / 2);

  // Put in left padded spaces before the string itself
  var line = '';
  for (i = 0; i < leftPadding; i++) {
      line+=' ';
  }
  line+= str;
  console.log(line);
};

// Create a vertical space
cli.verticalSpace = function(lines){
  lines = typeof(lines) == 'number' && lines > 0 ? lines : 1;
  for (i = 0; i < lines; i++) {
      console.log('');
  }
};

 // Export the module
 module.exports = cli;