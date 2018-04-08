module.exports = ({message,match,reply}) => {
	if (IsDev(message.from.id) === false) return;
	var text;
	if (match[4]) text=match[4];
	if (!match[4] && message.reply_to_message && message.reply_to_message.text) text = message.reply_to_message.text;
	if (typeof text==='undefined') return;
	extra = {disable_notification:true,disable_web_page_preview:true},
	vars = true;
	if (match[4]){
		//html or markdown encoding
		if (match[4].indexOf('-h')!==-1){
			text = text.replace(/^[ ]?-h/gi, ''),
			extra.parse_mode = 'html';
		}
		if (match[4].indexOf('-m')!==-1){
			text = text.replace(/^[ ]?-m/gi, ''),
			extra.parse_mode = 'markdown';
		}
		
		// toggle link preview and notification
		if (match[4].indexOf('-pr')!==-1){
			text = text.replace(/^[ ]?-pr/gi, ''),
			extra.disable_web_page_preview = false;
		}
		
		if (match[4].indexOf('-n')!==-1){
			text = text.replace(/^[ ]?-n/gi, ''),
			extra.disable_notification = false;
		}
		
		// disable botvars
		if (match[4].indexOf('-b')!==-1){
			text = text.replace(/^[ ]?-b/gi, ''),
			vars = false;
		}
		
		// custom arrays
		if (match[4].indexOf('-r')!==-1 && new RegExp("\[('(.+)'\,)*?'(.+)'\]", "gi").test(text)){
			text = text.replace(/^[ ]?-r/gi, '');
			TextArray = text.replace(/^[ ]*?\[[ ]*?\'/gi,''),
			TextArray = TextArray.replace(/\'[ ]*?[\]]$/gi,''),
			TextArray = TextArray.split(/\'[ ]*?\,[ ]*?\'/gi);
			shuffle(TextArray);
			text = TextArray[0];
		}
		
		//duplicating
		if (match[4].indexOf('-+')!==-1){
			number = parseInt(text.split(new RegExp(/[ ]?-\+(\d+)/gi))[1]);
			if (!isNaN(number)){
				text = text.replace(/[ ]?-\+(\d+)/gi, '');
				addText = text;
				for (i = 0; i < number; i++) { 
					text += addText;
					if (text.length>4093){
						text = text.substring(0, 4093)+'...';
						break;
					}
				}
			}
		}
		
		if (match[4].indexOf('-x')!==-1){
			number = parseInt(text.split(new RegExp(/[ ]?-\x(\d+)/gi))[1]);
			if (!isNaN(number)){
				text = text.replace(/[ ]?-\x(\d+)/gi, '');
				for (i = 0; i < number; i++) { 
					text += text;
					if (text.length>4093){
						text = text.substring(0, 4093)+'...';
						break;
					}
				}
			}
		}
		
		
	
	if (text.length===0 && message.reply_to_message && message.reply_to_message.text) text = message.reply_to_message.text;
	}
	if (vars===true) text = botvars(text,(extra.parse_mode||'none'),message);
	cmd = new RegExp(/^[ ]?(\/\.|\/\,|\/|\.|\,)/gi);
	if (cmd.test(text)){
		d = text.split(cmd);
		switch(d[1]){
			case '/':
			case '/.':
			case '.':
			type = message.chat.id;
			break;
			
			case ',':
			case '/,':
			type = message.from.id;
			break;
		}
		if (fs.existsSync('./data/'+type+'/commands.json')===true) {
			commands = JSON.parse(fs.readFileSync('./data/'+type+'/commands.json', 'utf8'));
			if (typeof commands[d[2]]==='object' && commands[d[2]].type.startsWith('string')){
				text = commands[d[2]].data;
			}
		}
	}
	if (message.reply_to_message) extra.reply_to_message_id = message.reply_to_message.message_id;
	return send();
	async function send(){
		try {
		await bot.telegram.sendMessage(-1001097772093,text,extra);
		} catch(err){
			if (err.response.description.search(" tag corresponding")!==-1) return errorMsg(reply,'msgSent','msgFormatted');
			if (err.response.description.search("Expected end tag")!==-1) return errorMsg(reply,'msgSent','msgFormatted');
			if (err.response.description.search("Unsupported start tag")!==-1) return errorMsg(reply,'msgSent','msgBadTag');
			console.log(err);
		}
	}
};
