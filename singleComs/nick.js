
module.exports = (ctx) => {
	const { message: { chat: {id,type}}, from, replyWithHTML } = ctx;
	uid = ctx.from.id;
	if (typeof ctx.match[3]==='undefined') return;
	if (ctx.match[3].length>18) return errorMsg(replyWithHTML,'nickSet','nickLong');
	if (typeof nickNamesMemory[ctx.chat.id]==='undefined') getNick(ctx.chat.id,ctx.from.id);
	nickName = (nickNamesMemory[ctx.chat.id][ctx.from.id]);
	nickNamesMemory[ctx.chat.id][ctx.from.id] = ctx.match[3];
	saveNick(ctx.chat.id);
	return replyWithHTML('<b>Nickname set as: </b><i>'+ctx.match[3]+'</i>');
};
