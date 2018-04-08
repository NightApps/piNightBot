module.exports = async({ message,replyWithHTML }) => {
	if (!message.forward_date) return;
	chatId = message.chat.id;
	rank = await checkAdminLevel(message,false);
	if (rank>=6){
		isEnabled = false;
		if (typeof configMemory[chatId]==='undefined') configMemory[chatId]=getConfig(chatId);
		if (configMemory[chatId].toggles.modLog && Boolean(configMemory[chatId].toggles.modLog)===true) isEnabled=true; 
		if (isEnabled===true) sendToLog('setlog',message);
		configMemory[chatId].strings.modLog = message.forward_from_chat.id;
		updateConfig(chatId);
		sendToLog('initial',message);
		text = '<b>Log Channel set to:</b><code> '+message.forward_from_chat.id+'</code>';
		if (isEnabled===false) text+='\n\n<i>NOTE: Moderation Log is currently not enabled, please enable it using </i> /config';
		replyWithHTML(text);
	} else {return errorMsg(replyWithHTML,'configEdit','userNotLvl');}
}