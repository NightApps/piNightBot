checkAdminLevel = require('../addons/checkAdminLevel.js'),
getName = require('../addons/getName.js');
	
module.exports = async({ message,replyWithHTML }) => {
	if (message.reply_to_message){
		rank = await checkAdminLevel(message,true),
		name = getName(message,'none',true);
	} else {rank = await checkAdminLevel(message,false),name = getName(message,'none',false);}
	var list='';
	stat=' is Level '+rank+'\n';
	data = './data/'+message.chat.id+'/levels.json';
	if (fs.existsSync(data)) {
		lvlNames = JSON.parse(fs.readFileSync(data, 'utf8'));
		if (lvlNames['lvl'+rank]) stat = ' is part of:\n'+lvlNames['lvl'+rank];
	}
	if (rank>=1) list += '• Add Users\n';
	if (rank>=2) list += '• Delete Messages\n';
	if (rank>=3) list += '• Pin Messages\n• Change Group Info\n';
	if (rank>=4) list += '• Kick Users\n• Ban Users\n• Warn Users\n• Modify All Group Commands\n';
	if (rank>=5) list += '• Add Admins\n';
	if (rank>=6) list += '• Remove Admins\n';
	if (rank>=7) list += '• Use Developer Commands\n';
	text = '<b>'+name+stat+'</b>\n<i>This user can:</i>\n\n<b>'+list+'</b>';
	replyWithHTML(text);
};
