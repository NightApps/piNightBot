module.exports.regex = {
	"setrank": "^\/setlvl[1-6](\\@"+botKeys.username+"\\b|(?!\\@\\w+bot))[ ](.+)$"
};

module.exports.functions = {
	"setrank": async(ctx) => {
		rank = await checkAdminLevel(ctx.message,false);
		if (rank>=6){
			regex = module.exports.regex.setrank,
		regex = regex.substring(0, regex.length-5),
		regex = new RegExp(regex,'gi');
		rankName = ctx.message.text.replace(regex, ''),
		rank = ctx.message.text.match(/\d+/)[0],
		data = './data/'+ctx.chat.id+'/levels.json';
		if (fs.existsSync(file)===true) {
		lvlNames = JSON.parse(fs.readFileSync(data, 'utf8'));
		} else {
			lvlNames = {};
		}
		lvlNames['lvl'+rank] = rankName;
		fs.writeFileSync(data,JSON.stringify(lvlNames, null, 2),'utf8');
		return ctx.replyWithHTML('<b>Level '+rank+' has been renamed to: '+rankName+'</b>');
		}
		
	}
};