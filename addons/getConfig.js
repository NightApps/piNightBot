defaultToggles= {
	groupCommands:true,
	welcomeMessage: true,
	tripleGay: false,
	hahaYeah: false,
	doorGame: true,
	solveGame: true,
	sortGame: true,
	typeGame: true,
	countryGame: true,
	modLog: false,
	titleLock: false,
	pinLock: false,
	inviteLock: false
}
const revision = 4;

module.exports = function(chatId) {
	//console.log(chatId);
	if (noConfig[chatId]) delete noConfig[chatId];
	file = './data/'+chatId+'/config.json';
	if (fs.existsSync(file)) {
		config = JSON.parse(fs.readFileSync(file, 'utf8'));
		//console.log(config.revision,revision,config.revision!==revision);
		if (config.revision!==revision) {config = updateConfigToggles(config,chatId);}
	} else {
		config = {toggles:defaultToggles,revision:revision,strings:{},temp:{}};
	}
	return config;
}

function updateConfigToggles(oldConfig,chatId){
	newConfig = {toggles:{},revision:revision,strings:{},temp:{}};
	newConfig.revision = revision,
	newConfig.strings = oldConfig.strings,
	newConfig.temp = oldConfig.temp;
	console.log('updating config to v'+revision);
	for (key in defaultToggles){
		newConfig.toggles[key] = (oldConfig.toggles[key]||defaultToggles[key]);
	}
	configMemory[chatId] = newConfig;
	updateConfig(chatId);
	bot.telegram.sendMessage(chatId,'#NoteToAdmins, the Night Bot Configuration has been updated to revision v'+revision+', so the Quick Toggle Numbers may have changed, please use /config to verify any changes.');
	return newConfig;
}