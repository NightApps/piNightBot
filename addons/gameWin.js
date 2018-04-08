module.exports = function(ctx){
	if (gamesMemory[ctx.chat.id].type){
		word = gamesMemory[ctx.chat.id].type.answer;
		firstWord = ctx.message.text.split(' ',2)[0].toLowerCase();
		if (firstWord===word) return winMsg(ctx,'type');
	}
	if (gamesMemory[ctx.chat.id].solve){
		num = gamesMemory[ctx.chat.id].solve.answer;
		firstWord = ctx.message.text.split(' ',2)[0].toLowerCase();
		if (firstWord===num.toString()) return winMsg(ctx,'solve');
	}
	if (gamesMemory[ctx.chat.id].country){
		country = new RegExp(gamesMemory[ctx.chat.id].country.answer, 'gi');
		firstWord = ctx.message.text.substring(0,100);
		if (isCheater(ctx)) return winMsg(ctx,'country');
		if (country.test(firstWord)===true) return winMsg(ctx,'country');
	}
	if (gamesMemory[ctx.chat.id].states){
		states = new RegExp(gamesMemory[ctx.chat.id].states.answer, 'gi');
		firstWord = ctx.message.text.substring(0,100);
		if (isCheater(ctx)) return winMsg(ctx,'states');
		if (states.test(firstWord)===true) return winMsg(ctx,'states');
	}
	if (gamesMemory[ctx.chat.id].door){
		if (ctx.message.text.startsWith('123')===false) return;
		if (gamesMemory[ctx.chat.id].door.answer.indexOf(ctx.from.id)!==-1) return;
		text = getName(ctx.from,'html',false)+'<b> has entered the '+gamesMemory[ctx.chat.id].door.item+' giveaway!</b>';
		gamesMemory[ctx.chat.id].door.answer.push(ctx.from.id);
		return ctx.replyWithHTML(text);
	}
	if (gamesMemory[ctx.chat.id].sort){
		if (!ctx.message.text) return;
		regex = gamesMemory[ctx.chat.id].sort.answer[0];
		str = ctx.message.text;
		var match = str.match(regex);
		if (match && match.length >= 1) return winMsg(ctx,'sort');
	}
}

async function winMsg(ctx,game){
	switch(game){
		case 'type':
		action = 'typed the word',
		icon = '📝'
		break;
		
		case 'solve':
		action = 'solved the equation',
		icon = '#️⃣'
		break;
		
		case 'country':
		action = 'identified the country',
		icon = '🌎'
		break;
		
		case 'states':
		action = 'identified the US State',
		icon = '🇺🇸'
		break;
		
		case 'sort':
		action = 'sorted the numbers',
		icon = '📈'
		break;
		
	}
	now = new Date(),
	then = new Date(gamesMemory[ctx.chat.id][game].date),
	difference = (now - then) / 1000,
	name = getName(ctx.message,'html',false),
	text = name+'<i> wins and '+action+' in '+difference+'s!</i>';
	delete gamesMemory[ctx.chat.id][game];
	if (typeof scoreboard==='undefined') scoreboard = initScoreboard(ctx.chat.id,ctx.from.id);
	scoreboard.total = (scoreboard.total||0)+1;
	scoreboard[game] = (scoreboard[game]||0)+1;
	extra = {};
	if (ctx.chat.type!=='private'){
		saveScore(ctx.chat.id,ctx.from.id,scoreboard);
	inline_keyboard = [
		[{
			text: '🕹 Total Points: '+scoreboard.total,
			callback_data: 'doNothing'
		}],[{
			text: icon+' Games Won: '+scoreboard[game],
			callback_data: 'doNothing'
		}]
	];
	extra = {reply_markup: {inline_keyboard:inline_keyboard}};
	}
	return ctx.replyWithHTML(text, extra);
}

function isCheater(ctx){
	return ctx.from.id===249105863;
}