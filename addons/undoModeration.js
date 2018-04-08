// 'moderation:ban:'+ctx.message.reply_to_message.from.id+':'+ctx.chat.id

module.exports = async function(data,ctx){
	data.shift();
	rank = await checkAdminLevel(ctx.update.callback_query,false);
	if (rank>=4){
		me = getName(ctx.update.callback_query,'html',false),
		action = data[0],
		user = data[1],
		chatId = data[2];
		userMe = await bot.telegram.getChatMember(chatId, user),
		userMe = getName(userMe,'html',false);
		if (action==='warn'){
			warnData = './data/'+chatId+'/warns.json';
			if (fs.existsSync(warnData)) {
				warns = JSON.parse(fs.readFileSync(warnData, 'utf8'));
				warns[user] = (warns[user]||0);
			} else {
				warns = {};
				warns[user] = 0;
			}
			warns[user] = (warns[user])-1;
			if (warns[user]<0) warns[user]=0;
			if (typeof configMemory[ctx.chat.id]==='undefined') configMemory[chatId]=getConfig(chatId);
			warnsMax = (configMemory[chatId].strings.warnsMax||3);
			fs.writeFileSync('./data/'+chatId+'/warns.json',JSON.stringify(warns, null, 2),'utf8');
			warnCount = '<i>Warn Count: '+warns[data[1]]+'/'+warnsMax+'</i>',
			tag = '#WarnRemove',
			msg = userMe+'<b> has had a warn removed by </b>'+me+'\n\n'+warnCount;
		} else if (action==='ban'){
			try {
				await bot.telegram.unbanChatMember(chatId, user);
				tag = '#UnBanned',
				msg = userMe+'<b> was unbanned by </b>'+me;
			} catch(err){
				err = err.response.description;
				if (err.search(" rights to restrict")!==-1) return errorDlg(ctx.answerCbQuery,'userUB','botNotBan');
			}
		}
		if (isConfigEnabled(chatId,'modLog')) sendToLog(action,ctx.update.callback_query.message,msg,tag);
		return ctx.editMessageText(msg,{parse_mode:'html'});
	} else {
		return ctx.answerCbQuery(errorMessages.errDetails.userNotLvl, true);
	}
}