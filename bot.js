const  { isNullOrUndefined } = require('util');

//system commands
const { exec } = require('child_process');

// file reading
var fs = require('fs');
var usobj;

fs.readFile('data/ud.json', 'utf8', function (err, data) {
    if (err) {
        throw err;
    } 
    usobj = JSON.parse(data);
  });


// bot stuff
const builder = require('botbuilder');

//bot consts
const botName = 'Build Dialogs Bot';
const description = `A sample bot to demonstrate dialog management`;

// const recognizer = require('./recognizer.js');

const connector = new builder.ConsoleConnector().listen();

const bot = new builder.UniversalBot(connector, [
    (session, args, next) => {

        console.log(!isNullOrUndefined(usobj.name));
        console.log(usobj.name);
        
          if ( !isNullOrUndefined(usobj.name)) {
            console.log(usobj.name);
            session.endConversation(`Welcome, ${usobj.name}`);

          }
          else {
              console.log('else');
             session.beginDialog('init');
          }
        }
]);

bot.dialog('init',(session,args,next) => {
    session.send(`Hi there! I'm ${botName}`);
    session.send(`In a nutshell, here's what I can do:\n\n${description}`);
    builder.Prompts.text(session, `What's your name?`);
},

(session, results, next) => {
        const name = results.response;
        console.log('halloooiihhggttgghu' + usobj);
    session.endDialogWithResult({response: name});
        // session.endConversation(`Welcome, ${results.response}`);
    usobj.name = results.response;
    
}
);

bot.dialog('help', (session) => {
    session.endDialog('This is a simple demo bot for a sample conference.');
     runCommand('ls');
}).triggerAction({
    matches: /help/i,
    onSelectAction: (session, args) => {
        session.beginDialog(args.action, args);
    }
});

bot.dialog('register', [
    (session, args, next) => {
        session.beginDialog('getAttendeeInfo');
        // pass control to getAttendeeInfo
        // when new dialog completes, returns control to here
    },
    (session, results, next) => {
        session.endConversation(`You said: ${results.response}`);
    },
]).triggerAction({matches: /register/i});

bot.dialog('getAttendeeInfo', [
    (session, args, next) => {
        builder.Prompts.text(session, `Do you have any dietary restrictions?`);
    },
    (session, results, next) => {
        console.log(session.dialogStack());
        const dietary = results.response;
        session.endDialogWithResult({response: dietary});
    },
]);

bot.dialog('Learn', [
    (session, args, next) => {
        session.beginDialog('getCommand');
        // pass control to getAttendeeInfo
        // when new dialog completes, returns control to here
    },
    (session, results, next) => {
        session.endConversation(`I learned: ${results.response}⁄n To use the new function type run ${results.response}`);
    },
]).triggerAction({matches: /learn/i});

bot.dialog('getCommand', [
    (session, args, next) => {
        builder.Prompts.text(session, `What command should i learn?`);
    },
    (session, results, next) => {
        console.log(session.dialogStack());
        const command = results.response;
        
        session.endDialogWithResult({response: command});
    },
]);

bot.dialog('Exit', function (session) {
    session.endConversation("Okay then, see you later.");
    process.exit();
}).triggerAction({ matches: 'CancelIntent' });

////////////// functions ///////////////////////////

function runCommand(command) {
    exec(command, (err, stdout, stderr) => {
        if (err) {
          // node couldn't execute the command
          console.log(`Error: ${stderr}`);
          return;
        }
        else {
            console.log(`Output:: ${stdout}`);
        }
      });
}

////////////////////// recognizer ///////////////////

bot.recognizer(new builder.RegExpRecognizer( "CancelIntent", /exit/i ));// de_de: /^(exit|ende)/i, en_us: /^(cancel|nevermind)/i, ja_jp: /^(キャンセル)/ }));


///////////////////// exports //////////////////////

module.exports = bot;
