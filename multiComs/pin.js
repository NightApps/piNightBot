module.exports.regex = {
	'pin': '^\/(p\\b|pin\\b)(\\@"+botKeys.username+"\\b|(?!\\@\\w+bot))?[ ]?(([^]+))?'
};

module.exports.functions = {
	"pin": async(ctx) => {
		if (typeof configMemory[ctx.chat.id]==='undefined') configMemory[ctx.chat.id]=getConfig(ctx.chat.id);
		if (configMemory[ctx.chat.id].toggles.pinLock && Boolean(configMemory[ctx.chat.id].toggles.pinLock)===true) return errorMsg(ctx.reply,'msgPin','pLock');
		rank = await checkAdminLevel(ctx.message,false);
		if (rank>=3){
			if (ctx.message.reply_to_message){
				pinId = ctx.message.reply_to_message.message_id;
				logAction = 'pin_rc';
			} else if (typeof ctx.match[3]==='string') {
				let msg = await ctx.reply(ctx.match[3]);
				pinId = msg.message_id;
				logAction = 'pin_t';
			} else {
				return errorMsg(ctx.reply,'','userNotRply');
			}
			try {
				await bot.telegram.pinChatMessage(ctx.chat.id, pinId, {disable_notification:true});
			}catch(err){
				err = err.response.description;
				if (err.search(" rights to pin")!==-1) return errorMsg(ctx.reply,'msgPin','botNotPin');
			}
			configMemory[ctx.chat.id].strings.pinId = pinId;
			updateConfig(ctx.chat.id);
			if (isConfigEnabled(ctx.chat.id,'modLog')) sendToLog(logAction,ctx.message,ctx.match[3]);
			return;
		}
	}
};