module.exports = async({ message,replyWithHTML }) => {
	params = message.text.split(' ');
	//console.log(params);
	if (message.chat.type==='private'){name = '$n';}else{name='$cn';}
	text = '<b>Greetings '+name+', I am</b> @'+bot.options.username+'<b>!</b>\n\nI am an Open-Source Telegram Bot built using Node.js v9.x, with Privacy and Efficency in mind.';
	text = botvars(text,'html',message);
	return replyWithHTML(text, {
	reply_markup: {inline_keyboard:[
				[{
					text: 'Source Code',
					url: 'https://github.com/NightApps/piNightBot'
				}, {
					text: 'Commands',
					url: 'https://t.me/' + bot.options.username + '?start=help'
				}]
			]
		}
	});
}