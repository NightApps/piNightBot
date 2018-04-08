module.exports = (ctx) => {
	symbol = ctx.match[1],
	name = ctx.match[2];
	switch(symbol){
		case '/':
		case '/.':
		case '.':
		chatId = ctx.chat.id;
		break;
		
		case ',':
		case '/,':
		chatId = ctx.from.id;
		break;
	}
	file = './data/'+chatId+'/commands.json';
	if (fs.existsSync(file)===true) {
	commands = JSON.parse(fs.readFileSync(file, 'utf8'));
	} else {
		return;
	}
	if (typeof commands[name]==='object'){
		return sendCommand(ctx,commands[name]);
	} else return;

	function sendCommand(ctx,command){
		extra = {disable_notification:true};
		if (ctx.message.reply_to_message) extra.reply_to_message_id = ctx.message.reply_to_message.message_id;
		if (command.type.startsWith('string')){
			if (typeof ctx.match[4]==='string'){
				comText = command.data,
				variables = ctx.match[4].split(' ');
				for (i = 0; i < variables.length; i++) {
					v = variables[i].split('::', 2);
					if (v.length===1){
						num = i+1;
						comText = comText.replace(new RegExp('\%'+num+'\\b', 'gi'), v[0]);
					} else if (v.length===2){
						comText = comText.replace(v[0], v[1]);
					}
				}
			command.data = comText;
			}
			comType = command.type.split(':');
			if (comType.indexOf('html')!==-1) extra.parse_mode = 'html';
			if (comType.indexOf('markdown')!==-1) extra.parse_mode = 'markdown';
			if (comType.indexOf('array')!==-1) {
				comText = command.data;
				comTextArray = comText.replace(/^[ ]*?\[[ ]*?\'/gi,''),
				comTextArray = comTextArray.replace(/\'[ ]*?[\]]$/gi,''),
				comTextArray = comTextArray.split(/\'[ ]*?\,[ ]*?\'/gi);
				shuffle(comTextArray);
				command.data = comTextArray[0];
				if (new RegExp("^(\/|\.)", "gi").test(command.data[0])){
					name = command.data.replace(/^(\/|\.)/gi, '');
					if (typeof commands[name]==='object'){
						return sendCommand(ctx,commands[name]);
					} 
				}
			}
			command.data = botvars(command.data,(extra.parse_mode||'none'),ctx.message);
			return ctx.reply(command.data,extra);
		}
		if (command.type==='contact'){
			data = command.data.split(';');
			if (data[2]!=='undefined') extra.last_name = data[2];
			return ctx.replyWithContact(data[0], data[1], extra);
		} else if (command.type==='location'){
			data = command.data.split(';');
			return ctx.replyWithLocation(data[0], data[1], extra);
		} else {
			if (command.type==='video_note') command.type='VideoNote';
			command.type = command.type.charAt(0).toUpperCase() + command.type.slice(1);
			return eval("ctx.replyWith"+command.type+"(command.data, extra);");
		}
	}
}