module.exports.regex = {
	"t": "^\/t(\\@"+botKeys.username+"\\b|(?!\\@\\w+bot))[ ](.+)$",
	"dt": "^\/dt\\b(\\@"+botKeys.username+"\\b|(?!\\@\\w+bot))[ ]?(.+)?$",
	"sdt": "^^\/sdt\\b(\\@"+botKeys.username+"\\b|(?!\\@\\w+bot))[ ](.{0,25})$",
	"addt": "^\/addt\\b(\\@"+botKeys.username+"\\b|(?!\\@\\w+bot))[ ](.+)$"
}

module.exports.functions = {
	"t": async(ctx) => {
		if (ctx.chat.type.endsWith('group')===false) return;
		if (ctx.match[2]===ctx.chat.title) return;
		if (typeof configMemory[ctx.chat.id]==='undefined') configMemory[ctx.chat.id]=getConfig(ctx.chat.id);
		if (configMemory[ctx.chat.id].toggles.titleLock && Boolean(configMemory[ctx.chat.id].toggles.titleLock)===true) return errorMsg(ctx.reply,'titleChange','tLock');
		var title = ctx.match[2],
		title = botvars(title,'none',ctx.message),
		rank = await checkAdminLevel(ctx.message,false);
		if (rank>=3){
			try {
				await ctx.setChatTitle(title);
			}catch(err){
				err = err.response.description;
				if (err.search(" rights to change chat title")!==-1) return errorMsg(ctx.reply,'titleChange','botNotInfo');
			}
		} else {
			return errorMsg(ctx.reply,'titleChange','userNotLvl');
		}
		if (isConfigEnabled(ctx.chat.id,'modLog')) sendToLog('title',ctx.message,title);
	}, 
	"addt": async(ctx) => {
		if (ctx.chat.type.endsWith('group')===false) return;
		var addedTitle = ctx.match[2],
		addedTitle = botvars(addedTitle,'none',ctx.message);
		if (typeof configMemory[ctx.chat.id]==='undefined') configMemory[ctx.chat.id]=getConfig(ctx.chat.id);
		if (configMemory[ctx.chat.id].toggles.titleLock && Boolean(configMemory[ctx.chat.id].toggles.titleLock)===true) return errorMsg(ctx.reply,'titleChange','tLock');
		rank = await checkAdminLevel(ctx.message,false);
		if (ctx.match[2]===ctx.chat.title) return;
		if (rank>=3){
			try {
				title = ctx.chat.title;
				if ((title.length+addedTitle.length)>252) return errorMsg(ctx.reply,'titleChange','titleCeiling');
				title = title+' | '+addedTitle;
				await ctx.setChatTitle(title);
			}catch(err){
				err = err.response.description;
				if (err.search(" rights to change chat title")!==-1) return errorMsg(ctx.reply,'titleChange','botNotInfo');
			}
		} else {
			return errorMsg(ctx.reply,'titleChange','userNotLvl');
		}
		if (isConfigEnabled(ctx.chat.id,'modLog')) sendToLog('title',ctx.message,title);
	},
	"dt": async(ctx) => {
		if (ctx.chat.type.endsWith('group')===false) return;
		if (ctx.match[2]===ctx.chat.title) return;
		var title = ctx.match[2];
		if (typeof configMemory[ctx.chat.id]==='undefined') configMemory[ctx.chat.id]=getConfig(ctx.chat.id);
		if (configMemory[ctx.chat.id].toggles.titleLock && Boolean(configMemory[ctx.chat.id].toggles.titleLock)===true) return errorMsg(ctx.reply,'titleChange','tLock');
		rank = await checkAdminLevel(ctx.message,false);
		if (rank>=3){
			try {
				defTitle = (configMemory[ctx.chat.id].strings.defaultTitle||'Night Bot Group');
				if (typeof title!=='undefined') {defTitle = defTitle+' — '+title;title = botvars(title,'none',ctx.message);}
				await ctx.setChatTitle(defTitle);
			}catch(err){
				if (err.response){
				err = err.response.description;
				if (err.search(" rights to change chat title")!==-1) return errorMsg(ctx.reply,'titleChange','botNotInfo');
				} else {
					console.log(err);
				}
			}
		} else {
			return errorMsg(ctx.reply,'titleChange','userNotLvl');
		}
		if (isConfigEnabled(ctx.chat.id,'modLog')) sendToLog('title',ctx.message,defTitle);
	}, 
	"sdt": async(ctx) => {
		if (ctx.chat.type.endsWith('group')===false) return;
		var title = ctx.match[2],
		rank = await checkAdminLevel(ctx.message,false);
		if (rank>=5){
			if (typeof configMemory[ctx.chat.id]==='undefined') configMemory[ctx.chat.id]=getConfig(ctx.chat.id);
			configMemory[ctx.chat.id].strings.defaultTitle = title;
			updateConfig(ctx.chat.id);
			return ctx.replyWithHTML('<b>Default Title Updated!</b>\n\n<i>You can now use </i>  /dt<i> to revert the title to:</i>\n\n<code>'+title+'</code>');
			
		} else {
			return errorMsg(ctx.reply,'titleDefChange','userNotLvl');
		}
		if (isConfigEnabled(ctx.chat.id,'modLog')) sendToLog('defaultTitle',ctx.message,title);
	}
}