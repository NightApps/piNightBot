countries = country.array;
stArray = states.array;
const randomWord = require('random-word');

module.exports.regex = {
	"games": "^\/(type|solve|sort|country|states|rgame)(\\@"+botKeys.username+"\\b|(?!\\@\\w+bot))([ ].+)?"
};

module.exports.functions = {
	"games": (ctx) => {
		if (typeof msgData==='undefined') msgData = {};
		game = ctx.match[1].toLowerCase();
		if (typeof configMemory[ctx.chat.id]==='undefined') configMemory[ctx.chat.id]=getConfig(ctx.chat.id);
		if (configMemory[ctx.chat.id].toggles[game+'Game'] && Boolean(configMemory[ctx.chat.id].toggles[game+'Game'] )===false) return errorMsg(ctx.reply,'gameStart','gameDsbled');
		gamesMemory[ctx.chat.id] = (gamesMemory[ctx.chat.id]||{});
		//console.log(gamesMemory[ctx.chat.id]);
		if (gamesMemory[ctx.chat.id][game]) return;
		id = ctx.message.message_id;
		switch(game){
			case 'type':
			answer = randomWord(),
			msgData[id] = {
				header :'Please Type:',
				game: game,
				time: 15,
				question: answer,
				hint: 'Word Will Appear Shortly...',
			}
			break;
			
			case 'solve':
			operators = ['+', '-', '+', '-', '*', '+', '-', '*', '*', '+', '-'],
			operator = operators[Math.floor(Math.random() * operators.length)],
			maxValue = 100,
		    minValue = 0;
			if (operator === '*' || operator === '/') var maxValue = 12;
			var num1 = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue,
			num2 = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
			eval('var answer = ' + num1 + operator + num2);
			if (operator == '*') var operator = '×';
			msgData[id] = {
				header :'Please Solve:',
				time: 15,
				game: game,
				question: num1 +' '+ operator +' '+ num2,
				hint: 'Equation Will Appear Shortly...',
			}
			break;
			
			case 'sort':
			correctArray = [],
			array = [];
			for (i = 0; i < 6; i++) {
				num = Math.floor(Math.random() * (10 - -10 + 1)) + -10;
				correctArray[i] = num,
				array[i] = num;
			}
			correctArray.sort(sortNumber);
			array = shuffle(array);
			msgData[id] = {
				header :'Please Sort the Following from Lowest to Highest:',
				time: 30,
				game: game,
				question: array.join(', '),
				hint: 'Word Will Appear Shortly...'
			},
			answer = [new RegExp('^(' + correctArray[0] + ')(,)?( )?(' + correctArray[1] + ')(,)?( )?(' + correctArray[2] + ')(,)?( )?(' + correctArray[3] + ')(,)?( )?(' + correctArray[4] + ')(,)?( )?(' + correctArray[5] + ')$','gi'),correctArray.join(', ')];
			break;
			
			case 'country':
			shuffle(countries);
			item = countries[0];
			msgData[id] = {
				header :'Please Name This Country:',
				time: 15,
				game: game,
				question: item[0]
			}
			answer = item[1];
			break;
			
			case 'states':
			shuffle(stArray);
			item = stArray[0];
			msgData[id] = {
				header :'Please Name This US State:',
				time: 15,
				game: game,
				question: item[0]
			}
			answer = item[1];
			break;
			
			
		}
		gamesMemory[ctx.chat.id][game] = {answer:answer,id:id};
		//return;
		if (msgData[id].game==='country'||msgData[id].game==='states'){
			ctx.replyWithSticker(msgData[id].question,{
				caption: msgData[id].header
			}).then(() => {
				timeOut = msgData[id].time*1000;
				gamesMemory[ctx.chat.id][msgData[id].game].date=new Date();
				return delay(timeOut).then(function() {
					return endGame(ctx,msgData[ctx.message.message_id].game);
				});
			});
		} else {
		msgData[id].hintText = '<code>'+msgData[id].header+'</code>\n\n<i>'+msgData[id].hint+'</i>',
		msgData[id].askText = '<code>'+msgData[id].header+'</code>\n\n<b>'+msgData[id].question+'</b>';
		ctx.replyWithHTML(msgData[id].hintText).then((msg) => {
				var prep = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;
				delay(prep).then(function() {
					bot.telegram.editMessageText(ctx.message.chat.id, msg.message_id, '', msgData[id].askText, Extra.HTML()).then(() => {
						timeOut = msgData[id].time*1000;
						console.log(timeOut);
						gamesMemory[ctx.chat.id][msgData[id].game].date=new Date();
						return delay(timeOut).then(function() {
							return endGame(ctx,msgData[ctx.message.message_id].game);
						});
					});
				});
			});
		}
	}
};

function sortNumber(a, b) {
	return a - b;
}

function delay(t) {
	return new Promise(function(resolve) {
		setTimeout(resolve, t)
	});
}

function endGame(ctx,game){
	if (typeof gamesMemory[ctx.chat.id][game]==='undefined') return;
	if (gamesMemory[ctx.chat.id][game].id!==ctx.message.message_id) return;
	if (game==='sort'){ answer = '\n'+gamesMemory[ctx.chat.id][game].answer[1]; } else { answer = gamesMemory[ctx.chat.id][game].answer; }
	gameType =  game.charAt(0).toUpperCase() + game.slice(1);
	text = '<b>'+gameType+' Game Reset!</b>\n\n<i>The Answer was:   </i><code>'+answer+'</code>';
	delete gamesMemory[ctx.chat.id][game];
	return ctx.replyWithHTML(text);
}

/*
process.on('unhandledRejection', (reason, p) => {
	return;
});
*/