module.exports = async function(data,ctx){
	rank = await checkAdminLevel(ctx.update.callback_query,false);
	chatId = ctx.update.callback_query.message.chat.id;
	if (rank>=5){
		data.shift();
		key = data[0];
		if (typeof configMemory[chatId]==='undefined') configMemory[chatId] = getConfig(chatId);
		configMemory[chatId].toggles[key] = (!configMemory[chatId].toggles[key]),
		config = configMemory[chatId],
		name = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim(),
		status = (configMemory[chatId].toggles[key]) ? 'enabled':'disabled',
		inline_keyboard = [],
		i = 1,
		msg = name+' is now '+status+'!';
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
		updateConfig(chatId);
		ctx.editMessageReplyMarkup({inline_keyboard:inline_keyboard});
		if (isConfigEnabled(chatId,'modLog')) sendToLog('configChange',{chat:chatId},name,status);
		return ctx.answerCbQuery(msg);
	}
}