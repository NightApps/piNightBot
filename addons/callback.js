inlineNames = require('./inlineNames.js'),
editConfig = require('./editConfig.js'),
undoModeration = require('./undoModeration.js'),
clearData = require('./clearData.js'),
clearCommands = require('./clearCommands.js');


module.exports = async(ctx) => {
	data = ctx.update.callback_query.data;
	if (data==='doNothing') return ctx.answerCbQuery();
	data = data.split(':');
	if (data.length===1){
			if (data[0]==='clearData') return clearData(ctx); 
			if (data[0]==='clearCommands') return clearCommands(ctx); 
	} else {
		if (data[0]==='moderation') return undoModeration(data,ctx);
		if (data[0]==='editConfig') return editConfig(data,ctx);
		if (data[0]==='gameName') return inlineNames(ctx.answerCbQuery,data,'gameName'); 
		if (data[0]==='showConfigHelp') return inlineNames(ctx.answerCbQuery,data,'configName'); 
	}
}