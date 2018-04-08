shuffle = require('shuffle-array');
timeOut = 30000;
//timeOut = 8000;

module.exports = (ctx) => {
	if (ctx.chat.type==='private') return;
	gamesMemory[ctx.chat.id] = (gamesMemory[ctx.chat.id]||{});
	if (gamesMemory[ctx.chat.id] && gamesMemory[ctx.chat.id].door) return;
	item = (ctx.match[3]||'door');
	gamesMemory[ctx.chat.id].door = {answer:[ctx.from.id],id:ctx.message.message_id,item:item};
	ctx.replyWithHTML('<b>A '+item+' giveaway has been started!</b>\n\n<i>Type 123 right now to enter a chance to win this '+item+'!</i>').then((msg) => {
		return delay(timeOut).then(function() {
			return endGame(ctx,item);
		});
	});
}

function endGame(ctx,item){
	if (gamesMemory[ctx.chat.id].door.id!==ctx.message.message_id) return;
	giveAway = gamesMemory[ctx.chat.id].door.answer;
	delete gamesMemory[ctx.chat.id].door;
	if (giveAway.length<=1) return ctx.replyWithHTML('<b>Not enough contestors, cancelling giveaway!</b>');
	shuffle(giveAway);
	ctx.telegram.getChatMember(ctx.chat.id, giveAway[0]).then((winnerUser) => {
		winnerUser = winnerUser.user;
		text = getName(winnerUser,'html',false)+'<b> has won the '+item+' giveaway!</b>';
		if (typeof scoreboard==='undefined') scoreboard = initScoreboard(ctx.chat.id,winnerUser.id);
		scoreboard.total = (scoreboard.total||0)+giveAway.length;
		scoreboard.door = (scoreboard.door||0)+1;
		inline_keyboard = [
			[{
				text: '🕹 Total Points: '+scoreboard.total,
				callback_data: 'doNothing'
			}],[{
				text: '🚪 Giveaways Won: '+scoreboard.door,
				callback_data: 'doNothing'
			}]
		];
		saveScore(ctx.chat.id,winnerUser.id,scoreboard);
		extra = {reply_markup: {inline_keyboard:inline_keyboard}};
		return ctx.replyWithHTML(text, extra);
	});
}

function delay(t) {
	return new Promise(function(resolve) {
		setTimeout(resolve, t)
	});
}