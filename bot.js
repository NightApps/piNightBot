//AdmZip = require('adm-zip'),
botKeys = require('./config.json'),
fs = require("fs"),
http = require("http"),
util = require('util'),
LocalSession = require('telegraf-session-local'),
https = require("https"),
safeEval = require('safe-eval'),
scrapeIt = require("scrape-it"),
shuffle = require('shuffle-array'),
request = require('request'),
Telegraf = require('telegraf'),
{	Extra,
	Markup,
	session,
	reply
} = require('telegraf'),
webdict = require('webdict'),
zipdir = require('zip-dir'),
errorMessages = require('./errors.json'),
developers = require('./developers.json').devs,
dev_chat_id = parseInt(botKeys.dev_chat_id);
addedComsArray = [],
configMemory = {},
nickNamesMemory = {},
gamesMemory = {},
noConfig = {},
tripleGayMemory = {},
hahaMemory = {},
loadedFiles = {single: {}, multi: {}},
bot = new Telegraf(botKeys.token);

updateConfig = chatId => {fs.writeFileSync('./data/'+chatId+'/config.json',JSON.stringify(configMemory[chatId], null, 2),'utf8');console.log('updated config for ',chatId);}
saveNick = chatId => {fs.writeFileSync('./data/'+chatId+'/nicknames.json',JSON.stringify(nickNamesMemory[chatId], null, 2),'utf8');console.log('updated nicknames for ',chatId);}
saveScore = (chatId,userId,scoreboard) => fs.writeFileSync('./data/'+chatId+'/scoreboard/'+userId+'.json',JSON.stringify(scoreboard, null, 2),'utf8');
isTrue = v => (typeof v!=='undefined' && Boolean(v)===true);
isConfigEnabled = (chatId,v) => isTrue(configMemory[chatId].toggles[v]);


bot.telegram.getMe().then((botInfo) => {
	bot.options.id = botInfo.id,
	bot.options.username = botInfo.username;
});

// add the add-ons
try{
	fs.readdirSync('addons')
	.map(jsFile => ({
		file: './addons/' + jsFile,
		name: jsFile.split('.').slice(0, -1).join('.')
	})).forEach(a =>{
		eval(a.name+'=require(a.file)');
		console.log('loaded plugin',a.name+'()');
	});
} catch (error){
	console.log('Huston we have a problem:\n\n',error,'\n\n');
}


// add single commands
try{
	fs.readdirSync('singleComs')
	.map(jsFile => ({
		file: './singleComs/' + jsFile,
		name: jsFile.split('.').slice(0, -1).join('.')
	})).forEach(sc =>{
		addedComsArray.push(sc.name);
		regex = new RegExp('^(\/'+sc.name+'\\b)(\\@'+botKeys.username+'\\b|(?!\\@\\w+bot))[ ]?(([^]+))?$','gmi');
		loadedFiles.single[sc.name] = require(sc.file);
		bot.hears(regex, loadedFiles.single[sc.name]).catch((error) => console.log('We have a spill on aisle '+sc.name+':\n\n',error,'\n\n'))
		console.log('loaded single command',sc.name);
	});
} catch (error){
	console.log('Huston we have a problem:\n\n',error,'\n\n');
}

// add multi commands
try{
	fs.readdirSync('multiComs')
	.map(jsFile => ({
		file: './multiComs/' + jsFile,
		name: jsFile.split('.').slice(0, -1).join('.')
	})).forEach(mc =>{
		loadedFiles.multi[mc.name] = {};
		commands = require(mc.file).regex;
		for (var key in commands) {
			addedComsArray.push(key);
			regex = new RegExp(commands[key],'gmi');
			loadedFiles.multi[mc.name][key] = require(mc.file).functions[key];
			bot.hears(regex, loadedFiles.multi[mc.name][key]).catch((error) => console.log('We have a spill on aisle '+regex+':\n\n',error,'\n\n'))
			console.log('loaded multi  command',key);
		}
	});
} catch (error){
	console.log('Huston we have a problem:\n\n',error,'\n\n');
}

bot.hears(new RegExp('^(\\/\\.|\\/,|[\\/.,])(\\w+)(\@'+botKeys.username+'\\b|\\b)([ ](([^]+)))?$', 'gi'), require('./addons/sendCustomCommands.js')).catch((error) => console.log('We have a spill on aisle '+regex+':\n\n',error,'\n\n'))


//bot.action(/.+/, require('./addons/callback.js'));


bot.on('callback_query', require('./addons/callback.js'));
bot.on('inline_query', require('./addons/inline.js'));
bot.on('message', require('./addons/middleware.js'));

//bot.use(require('./addons/middleware.js')); 
bot.startPolling();
console.log('online ', '['+addedComsArray.sort().toString()+']');


process.on('unhandledRejection', (reason, p) => {
	console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

bot.catch((err) => {
	console.log('CONDUCTOR WE HAVE A PROBLEM: \n\n', err, '\n\n');
});