module.exports.regex = {
	"moderation": "^\/(kick\\b|ban\\b|warn\\b|k\\b|b\\b|w\\b)(\\@"+botKeys.username+"\\b|(?!\\@\\w+bot))[ ]?(.+)?"
}

module.exports.functions = {
	"moderation": async(ctx) => {
		if (ctx.message.forward_date) return;
		warnLimit = false,
		extra = {},
		action = ctx.match[1][0],
		reason = '';
		if (!ctx.message.reply_to_message) return errorMsg(ctx.reply,'user'+action.toUpperCase(),'userNotRply',action);
		rank = await checkAdminLevel(ctx.message,false);
		otherRank = await checkAdminLevel(ctx.message,true);
		user = ctx.message.reply_to_message.from.id;
		if (rank<4) return errorMsg(ctx.reply,'user'+action.toUpperCase(),'userNotLvl');
		if (otherRank===0) return errorMsg(ctx.reply,'user'+action.toUpperCase(),'userAbsnt');
		if (otherRank!==1) return errorMsg(ctx.reply,'user'+action.toUpperCase(),'userNotLvl');
		admin = getName(ctx.message,'html',false),
		replied = getName(ctx.message,'html',true);
		if (typeof ctx.match[3]!=='undefined') reason = '<b>Reason: </b><code>'+ctx.match[3]+'</code>';
		if (action==='w'){
			tag = '#Warn';
			warnData = './data/'+ctx.chat.id+'/warns.json';
			if (fs.existsSync(warnData)) {
				warns = JSON.parse(fs.readFileSync(warnData, 'utf8'));
				warns[user] = (warns[user]||0);
			} else {
				warns = {};
				warns[user] = 0;
			}
			if (typeof configMemory[ctx.chat.id]==='undefined') configMemory[ctx.chat.id]=getConfig(ctx.chat.id);
			warnsMax = (configMemory[ctx.chat.id].strings.warnsMax||3);
			reply_markup = {   inline_keyboard: [
					[{
						text: 'Remove Warn',
						callback_data: 'moderation:warn:'+ctx.message.reply_to_message.from.id+':'+ctx.chat.id
					}]
				]
			};
			warns[user] = warns[user]+1;
			warnCount = '<i>Warn Count: '+warns[user]+'/'+warnsMax+'</i>';
			fs.writeFileSync('./data/'+chatId+'/warns.json',JSON.stringify(warns, null, 2),'utf8');
			if (warns[user]>=warnsMax) {warnLimit=true;msg = 'has been hit his/her warn limit ('+warns[user]+'/'+warnsMax+'), and was banned';} else {
				text = replied+'<b> has been warned by </b>'+admin+'\n\n'+warnCount+'\n\n'+reason;
				addBtn = await ctx.replyWithHTML(text,{disable_notification:true});
				if (isConfigEnabled(ctx.chat.id,'modLog')) sendToLog('warn',ctx.message,text,tag);
				return bot.telegram.editMessageReplyMarkup(ctx.chat.id, addBtn.message_id,'',reply_markup);
			}
		}
		//now the fun stuff
		if (action==='k') userStats = await bot.telegram.getChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id);
		if (action==='b') msg = 'has been banned';tag = '#Banned';
		if (action==='b'||warnLimit===true){
			reply_markup = {   inline_keyboard: [
					[{
						text: 'Unban user',
						callback_data: 'moderation:ban:'+ctx.message.reply_to_message.from.id+':'+ctx.chat.id
					}]
				]
			};
		}
		try {
			await bot.telegram.kickChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id);
		} catch (err){
			err = err.response.description;
			if (err.search(" rights to restrict")!==-1) return errorMsg(ctx.reply,'user'+action.toUpperCase(),'botNotBan');
		}
		if (action==='k'){
			msg = 'has been kicked',
			tag = '#Kicked';
			if (userStats.status==='restricted'||userStats.status==='kicked'&&typeof userStats.until_date==='undefined'){
				restrict = {
					can_send_messages: userStats.can_send_messages,
					can_send_media_messages: userStats.can_send_media_messages,
					can_send_other_messages: userStats.can_send_other_messages,
					can_add_web_page_previews: userStats.can_add_web_page_previews
				};
				await bot.telegram.restrictChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id,restrict);
			} else await bot.telegram.unbanChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id);
		}
		if (warnLimit===true){
			warns[user] = 0;
			fs.writeFileSync('./data/'+chatId+'/warns.json',JSON.stringify(warns, null, 2),'utf8');
		}
		text = replied+'<b> '+msg+' by </b>'+admin+'\n\n'+reason;
		addBtn = await ctx.replyWithHTML(text,{disable_notification:true,reply_to_message_id: ctx.message.message_id});
		if (typeof reply_markup!=='undefined') return bot.telegram.editMessageReplyMarkup(ctx.chat.id, addBtn.message_id,'',reply_markup);
		if (isConfigEnabled(ctx.chat.id,'modLog')) sendToLog(action,ctx.message,text,tag);
		return;
	}
}