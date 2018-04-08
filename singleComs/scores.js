icons = {total:'🕹',type:'✏️',sort:'📈',door:'🚪',solve:'#️⃣',states:'🇺🇸', country:'🌎',betMoney:'💰',sent:'📫',given:'📬'};

skipKeys = ['revision', 'sent', 'given'];

module.exports = ({ message,replyWithHTML }) => {
	name = getName(message,'html',false),
	scoreboard = initScoreboard(message.chat.id,message.from.id);
	inlineKeyboard = [];
	for (key in scoreboard){
		if (skipKeys.indexOf(key)!==-1) continue;
		inlineKeyboard.push(Markup.callbackButton(icons[key]+' '+scoreboard[key], 'gameName:'+key),);
	}
	if (isEven(inlineKeyboard.length)===true){
		inlineKeyboard.push(Markup.callbackButton(icons.sent+' '+scoreboard.sent, 'gameName:sent'),Markup.callbackButton(icons.given+' '+scoreboard.given, 'gameName:given'),);
	} else {
		inlineKeyboard.push(Markup.callbackButton(icons['sent']+' '+scoreboard['sent']+'                  '+icons['given']+' '+scoreboard['given'], 'gameName:gift'),);
	}
	return replyWithHTML(name+'\'s Scores:',
    Extra.HTML().markup(Markup.inlineKeyboard(inlineKeyboard, {
		columns: 2
	}).resize()));
}

function isEven(n) {
   return n % 2 == 0;
}

function isOdd(n) {
   return Math.abs(n % 2) == 1;
}