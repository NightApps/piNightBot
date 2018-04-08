module.exports.regex = {
	'config': '^\/(config|settings)(\d{1,2})?(\\@"+botKeys.username+"\\b|(?!\\@\\w+bot))?'
};

module.exports.functions = {
	"config": async(ctx) => {
		rank = await checkAdminLevel(ctx.message,false);
		if ((rank>=5)===false) return errorMsg(ctx.reply,'configEdit','userNotLvl');
		config = getConfig(ctx.chat.id);
		configMemory[ctx.chat.id] = config;
		configNum = ctx.message.text.match(/\d+/);
		if (configNum===null) {sendFullConfig = true;} else {configNum = configNum[0];sendFullConfig = false;}
		switch (sendFullConfig){
			
			// Send the Config with Button Toggles
			case true:
			inline_keyboard = [];
			i = 1;
			for (var key in config.toggles) {
				icon = (config.toggles[key]) ? '🔵' : '🔴';
				name = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()
				inline_keyboard.push([{
						text: i+'. '+name,
						callback_data:'showConfigHelp:'+key
					}, {
						text: icon,
						callback_data:'editConfig:'+key
					}]);
				i=i+1;
			}
			updateConfig(ctx.chat.id);
			return ctx.replyWithHTML('wow', {
			reply_markup: {inline_keyboard:inline_keyboard}});
			break;
			
			case false:
			configNum = configNum-1;
			if (configNum>=12||configNum<0) return errorMsg(ctx.reply,'configEdit','configNaN');
			key = Object.keys(config.toggles)[configNum];
			ConfigName = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim();
			configMemory[ctx.chat.id][key] = !configMemory[ctx.chat.id][key];
			status = (configMemory[ctx.chat.id][key]) ? 'disabled' : 'enabled';
			updateConfig(ctx.chat.id);
			if (isConfigEnabled(ctx.chat.id,'modLog')) sendToLog('configChange',ctx.message,ConfigName,status);
			return ctx.replyWithHTML('<b>'+ConfigName+' has been '+status+'!</b>');
		}
	}
};