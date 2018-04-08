module.exports.regex = {
	"add": "^\/add(\\@"+botKeys.username+"\\b|(?!\\@\\w+bot))[ ](\\w+)([ ].+)?$",
	"delcom": "^\/delcom(\\@"+botKeys.username+"\\b|(?!\\@\\w+bot))[ ](\\w+)$",
	"comlist": "^\/comlist(\\@"+botKeys.username+"\\b|(?!\\@\\w+bot))$"
};

module.exports.functions = {
	"add": async(ctx) => {
		return await addCom(ctx);
	},
	"delcom": async(ctx) => {
		comName = ctx.match[2].replace(/^(\.|\/|\,)/gi,'').toLowerCase();
		file = './data/'+ctx.chat.id+'/commands.json';
		if (fs.existsSync(file)===true) {
			commands = JSON.parse(fs.readFileSync(file, 'utf8'));
		} else {
			return errorMsg(ctx.reply,'comDel','comDel404');
		}
		if (typeof commands[comName]==='object'){
			isOwner =commands[comName].owner===ctx.from.id;
			if (isOwner===false){
				rank = await checkAdminLevel(ctx.message,false);
				if (rank<4){
					return errorMsg(ctx.reply,'comAdd','comNotPrm');
				}
			}
		} else if (typeof commands[comName]==='undefined'){
			return errorMsg(ctx.reply,'comDel','comDel404');	
		}
		delete commands[comName];
		fs.writeFileSync(file,JSON.stringify(commands, null, 2),'utf8');
		return ctx.replyWithHTML('<b>Command /'+comName+' Removed!</b>');
	},
	"comlist": (ctx) => {
		groupFile = './data/'+ctx.chat.id+'/commands.json',
		personalFile = './data/'+ctx.from.id+'/commands.json';
		if (fs.existsSync(groupFile)===true) {
			groupCommands = JSON.parse(fs.readFileSync(groupFile, 'utf8'));
		} else {
			groupCommands = {};
		}
		if (fs.existsSync(personalFile)===true) {
			personalCommands = JSON.parse(fs.readFileSync(personalFile, 'utf8'));
		} else {
			personalCommands = {};
		}
		groupCommandsFormat = personalCommandsFormat = '';
		if (Object.keys(groupCommands).length === 0 && groupCommands.constructor === Object) {groupCommandsFormat = '<code>None</code>\n';} else {
			groupCommandKeys = Object.keys(groupCommands).sort();
			for (key in groupCommandKeys) {
				name = groupCommandKeys[key];
				if (groupCommands[name].hidden===true) continue;
				if (addedComsArray.indexOf(name)===-1){
					groupCommandsFormat += '/'+name+'\n';
				} else {
					groupCommandsFormat += '<code>.'+name+'</code>\n';
				}
			}
		}
		if (Object.keys(personalCommands).length === 0 && personalCommands.constructor === Object) {personalCommandsFormat = 'None';} else {
			personalCommands = Object.keys(personalCommands).sort();
		}
		text = '<b>Group Commands:</b>\n\n'+groupCommandsFormat+'\n<b>Your Commands:</b>\n\n<pre>'+personalCommandsFormat+'</pre>';
		ctx.replyWithHTML(text, {
			reply_markup: {inline_keyboard:[
				[{
					text: 'Add Your Commands...',
					url: 'https://t.me/' + bot.options.username + '?start=add'
				}],[{
					text: 'Commands Help',
					url: 'https://t.me/' + bot.options.username + '?start=help_com'
				}]
			]
		}
	});
	}
};

async function addCom(ctx){
	if (typeof configMemory[ctx.chat.id]==='undefined') configMemory[ctx.chat.id]=getConfig(ctx.chat.id);
	if (configMemory[ctx.chat.id].toggles.groupCommands && Boolean(configMemory[ctx.chat.id].toggles.groupCommands)===false) return errorMsg(ctx.reply,'','comDisabled');
	comName = ctx.match[2].replace(/^(\.|\/|\,)/gi,'').toLowerCase();
		switch (ctx.chat.type){
			case 'private':
			whereUse = ' in any group-chat we\'re both in!',
			symbol = ',';
			preWrap = true;
			break;
			
			case 'group':
			case 'supergroup':
			whereUse = ' in this group-chat!',
			symbol = ';;';
			break;
			
			case 'channel':
			return;
		}
		if (symbol===';;'){
			if (addedComsArray.indexOf(comName)===-1){
				symbol='/',
				preWrap = false;
			} else {
				symbol='.',
				preWrap = true;
			}
		}
		action = 'Added',
		isHidden = false,
		file = './data/'+ctx.chat.id+'/commands.json';
		if (fs.existsSync(file)===true) {
		commands = JSON.parse(fs.readFileSync(file, 'utf8'));
		} else {
			commands = {};
		}
		if (typeof commands[comName]==='object'){
			action = 'Updated!';
			isOwner =commands[comName].owner===ctx.from.id;
			if (isOwner===false){
				rank = await checkAdminLevel(ctx.message,false);
				if (rank<4){
					return errorMsg(ctx.reply,'comAdd','comNotPrm');
				}
			}
		}
		if (ctx.message.reply_to_message){
			temp = (ctx.message.reply_to_message.text) ? ['string',ctx.message.reply_to_message.text]:getData(ctx.message.reply_to_message);
			console.log('reply: ',temp);
			if (temp[0]==='null') return errorMsg(ctx.reply,'comAdd','comNoData','addText');
				comType = temp[0],
				comData = temp[1];
		} else {
			switch(typeof ctx.match[3]){
				case 'string':
				comType = 'string:none',
				comData = ctx.match[3].substring(1);
				break;
				
				case 'undefined':
				temp = getData(ctx.message);
				console.log('alone ',temp);
				if (temp[0]==='null') return errorMsg(ctx.reply,'comAdd','comNoData','addText');
				comType = temp[0],
				comData = temp[1];
			}
		}
		if (comType.startsWith('string')){
			if (comData.indexOf('-h')!==-1){
				var comData = comData.replace(/^[ ]?-h/gi, ''),
				comType = 'string:html';
			}
			if (comData.indexOf('-m')!==-1){
				var comData = comData.replace(/^[ ]?-m/gi, ''),
				comType = 'string:markdown';
			}
			if (comData.indexOf('-i')!==-1){
				var comData = comData.replace(/^[ ]?-i/gi, ''),
				isHidden = true;
			}
			
			if (comData.indexOf('-r')!==-1 && new RegExp("\[('(.+)'\,)*?'(.+)'\]", "gi").test(comData)){
				var comData = comData.replace(/^[ ]?-r/gi, '');
				comType += ':array';
			}
		}
		commands[comName] = {
			 type: comType,
			 data: comData,
			 hidden: isHidden,
			owner: ctx.from.id
		}
		fs.writeFileSync(file,JSON.stringify(commands, null, 2),'utf8');
		switch (preWrap){
			case true:
			comName = '<code>'+symbol+comName+'</code>';
			break;
			
			case false:
			comName = '  '+symbol+comName+'';
			break;
		}
		return ctx.replyWithHTML('<b>Command '+action+'!</b>\n\n<i>You can now use </i>'+comName+'<i>'+whereUse+'</i>');
}


function getData(message){
	if (message.photo){
		message.photo.reverse();
		return ['photo',message.photo[0].file_id];
	} else if (message.contact){
		return ['contact','+'+message.contact.phone_number+';'+message.contact.first_name+';'+(message.contact.last_name+';'||'')];
	} else if (message.location){
		return ['location',message.location.latitude+';'+message.location.longitude];
	} else if (message.venue){
		return ['location',message.venue.location.latitude+';'+message.venue.location.longitude];
	} else {
		if (message.text) return ['null','null'];
		var fileTypes = filtered_keys(message, /(video|audio|sticker|voice|video_note|document)/gi);
		return [fileTypes[0],message[fileTypes[0]].file_id];
	}
}

//from https://stackoverflow.com/a/6755033
function filtered_keys(obj, filter) {
  var key, keys = [];
  for (key in obj) {
    if (obj.hasOwnProperty(key) && filter.test(key)) {
      keys.push(key);
    }
  }
  return keys;
}