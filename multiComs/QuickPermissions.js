module.exports.regex = {
	"quickpermissions": "^\/(up\\b|down\\b)(\\@"+botKeys.username+"\\b|(?!\\@\\w+bot))[ ]?(.+)?"
}

module.exports.functions = {
	"quickpermissions": async(ctx) => {
		action = ctx.match[1];
		try { newRank = parseInt(ctx.message.text.match(/\d+/)[0]); }catch(err){var newRank;};
		if (!ctx.message.reply_to_message) return errorMsg(ctx.reply,'user'+action.toUpperCase(),'userNotRply');
		newId = ctx.message.reply_to_message.from.id;
		rank = await checkAdminLevel(ctx.message,false);
		if (action==='up' && rank>=5 || action==='down' && rank>=6){
			//return console.log('BOOP',action,rank);
			otherRank = await checkAdminLevel(ctx.message,true,true);
			if (otherRank===6) return errorMsg(ctx.reply,'user'+action.toUpperCase(),'lvlCreator');
			if (otherRank===7) return errorMsg(ctx.reply,'user'+action.toUpperCase(),'lvlDev');
			if (typeof newRank==='undefined') {
				switch (action){
					case 'up':
					newRank = otherRank+1,
					msgAction = 'Leveled Up',
					userNow = 'now can do';
					break;
					
					case 'down':
					newRank = otherRank-1;
					msgAction = 'Leveled Down';
					break;
				}
			} else {
				switch (action){
					case 'up':
					msgAction = 'Leveled Up',
					userNow = 'now can do';
					break;
					
					case 'down':
					msgAction = 'Leveled Down';
					break;
				}
			}
			if (newRank>5) newRank=5;
			if (newRank===6) return errorMsg(ctx.reply,'user'+action.toUpperCase(),'lvlCeiling');
			if (newRank===0) return errorMsg(ctx.reply,'user'+action.toUpperCase(),'lvlFloor');
			extra = {
				can_delete_messages: false, //2
				can_change_info: false, //3
				can_pin_messages: false, //3
				can_restrict_members: false, //4
				can_promote_members: false //5
			}
			if (newRank>=2) extra.can_delete_messages=true;
			if (newRank>=3) {extra.can_change_info=true;extra.can_pin_messages=true;}
			if (newRank>=4) extra.can_restrict_members=true;
			if (newRank>=5) extra.can_promote_members=true;
			
			try {
				v = await bot.telegram.promoteChatMember(ctx.chat.id, newId, extra);
			} catch(error){
				console.log(error);
				err = error.response.description;
				if (err.search(" not enough rights")!==-1) return errorMsg(ctx.reply,'user'+action.toUpperCase(),'botNotAdmin');
				if (err.search("RIGHT_FORBIDDEN")!==-1) return errorMsg(ctx.reply,'user'+action.toUpperCase(),'botNotAdmin');
				console.log(error);
			}
			name = getName(ctx.message,'html',false);
			newb = getName(ctx.message,'html',true);
			stat=' Level '+newRank+'!';
			data = './data/'+ctx.chat.id+'/levels.json';
			if (fs.existsSync(data)) {
				lvlNames = JSON.parse(fs.readFileSync(data, 'utf8'));
				if (lvlNames['lvl'+rank]) stat = ':\n'+lvlNames['lvl'+rank]+'!';
			}
			text = newb+'<b> has '+msgAction+' to'+stat+'</b>';
			ctx.replyWithHTML(text);
			if (typeof configMemory[ctx.chat.id]==='undefined') configMemory[ctx.chat.id]=getConfig(ctx.chat.id);
			if (isConfigEnabled(ctx.chat.id,'modLog')) sendToLog(action,ctx.message,newb,msgAction,newRank);
			}
		}
		
	}