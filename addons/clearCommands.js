module.exports = async function(ctx){
	rank = await checkAdminLevel(ctx.update.callback_query,false);
	if (rank>=6){
		chatId = ctx.update.callback_query.message.chat.id;
		if (fs.existsSync('./data/'+chatId+'/commands.json')) fs.unlinkSync('./data/'+chatId+'/commands.json');
		return ctx.editMessageText('<b>All Group Commands has been deleted.</b>\n\n<i>To wipe Configuration Data, use</i> /wipe',{parse_mode:'html'});
	} else {
		return ctx.answerCbQuery(errorMessages.errDetails.userNotLvl, true);
	}
}