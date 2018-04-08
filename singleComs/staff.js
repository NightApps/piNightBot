checkAdminLevel = require('../addons/checkAdminLevel.js'),
getName = require('../addons/getName.js');

lvlNamesDefault = {
	lvl2: 'Level 2',
	lvl3: 'Level 3',
	lvl4: 'Level 4',
	lvl5: 'Level 5',
	lvl6: 'Level 6'
}

module.exports = async({ message,replyWithHTML }) => {
	chatId = message.chat.id,
	total = await bot.telegram.getChatMembersCount(chatId)
	admins = await bot.telegram.getChatAdministrators(chatId),
	total = total-admins.length;
	lists = {
		lvl2: '',
		lvl3: '',
		lvl4: '',
		lvl5: '',
		lvl6: ''
	}
	for (i = 0; i < admins.length; i++) { 
		message = {
			from: admins[i].user,
			chat: {
				id: chatId
			}
		};
		rank = await checkAdminLevel(message,false,true);
		name = getName(message,'none',false),
		lists['lvl'+rank] += name+'\n';
	}
	text = '';
	data = './data/'+message.chat.id+'/levels.json';
	if (fs.existsSync(data)) {
		lvlNames = JSON.parse(fs.readFileSync(data, 'utf8'));
		if (lvlNames['lvl'+rank]) stat = ' is part of:\n'+lvlNames['lvl'+rank];
	} else {lvlNames = lvlNamesDefault}
	for (i = 6; i > 1; i--) {
		text+='<i>'+(lvlNames['lvl'+i]||lvlNamesDefault['lvl'+i])+':</i>\n<b>'+(lists['lvl'+i]||'None\n')+'</b>\n';
	}
	text = '<i>'+admins.length+' Admins:</i>\n\n'+text+'<i>'+(lvlNames.lvl1||'Level 1')+':</i>\n<b>'+total+' Members</b>'
	replyWithHTML(text);
};
