module.exports = (ctx) => {
	if (gamesMemory[ctx.chat.id] && Object.keys(gamesMemory[ctx.chat.id]).length!==0) {
		return gameWin(ctx);
	}
	if (!fs.existsSync('./data/'+ctx.chat.id)){
		fs.mkdirSync('./data/'+ctx.chat.id);
	} else {
	}
	if (ctx.message.caption){
		txt = ctx.message.caption,
		regex = new RegExp('^\/(\w{1,25})(\@'+bot.options.username+')?[ ].+$', 'gmi');
		if (true){
			if (true) return;
		}
	}
	if (configMemory[ctx.chat.id]){
		if (configMemory[ctx.chat.id].toggles.tripleGay===true){
			tripleGayMemory[ctx.chat.id] = (tripleGayMemory[ctx.chat.id]||(Math.floor(Math.random() * (150 - 50 + 1)) + 50));
			tripleGayMemory[ctx.chat.id] = (tripleGayMemory[ctx.chat.id])-1;
			if (tripleGayMemory[ctx.chat.id]===0){
				ctx.replyWithSticker('CAADAQADKAAD6YncGIvDID9GaOzgAg');
				delete tripleGayMemory[ctx.chat.id];
			}
		}
		
		if (configMemory[ctx.chat.id].toggles.hahaYeah===true){
			hahaMemory[ctx.chat.id] = (hahaMemory[ctx.chat.id]||(Math.floor(Math.random() * (199 - 100 + 1)) + 100));
			hahaMemory[ctx.chat.id] = (hahaMemory[ctx.chat.id])-1;
			if (hahaMemory[ctx.chat.id]===0){
				reply('haha yeah',{reply_to_message_id:ctx.message.message_id});
				delete hahaMemory[ctx.chat.id];
			}
		}
		
		if (configMemory[ctx.chat.id].toggles.modLog===true){
			if (ctx.from.username === bot.options.username) return;
			if (ctx.message.new_chat_title) sendToLog('title',ctx.message,ctx.message.new_chat_title)
			if (ctx.message.new_chat_photo) sendToLog('photo',ctx.message)
			if (ctx.message.left_chat_member) sendToLog('left',ctx.message)
			if (ctx.message.new_chat_members) sendToLog('join',ctx.message)
			if (ctx.message.pinned_message) sendToLog('pin_ro',ctx.message)
		}
	} else {
		if (noConfig && typeof noConfig[ctx.chat.id]==='undefined'||noConfig[ctx.chat.id]===false){
			if (fs.existsSync('./data/'+ctx.chat.id+'/config.json')) {
			configMemory[ctx.chat.id] = JSON.parse(fs.readFileSync('./data/'+ctx.chat.id+'/config.json', 'utf8'));
			} else {
				noConfig[ctx.chat.id] = true;
			}
		}
		
	}
}