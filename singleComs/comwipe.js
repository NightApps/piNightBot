module.exports = async({ message,replyWithHTML }) => {
	rank = await checkAdminLevel(message,false);
	if (rank>=6){
	text = '<b>Are You Sure?</b>\n\n<i>Presing the below button will clear all saved Group Commands.</i>';
	text = botvars(text,'html',message);
	return replyWithHTML(text, {
	reply_markup: {inline_keyboard:[
				[{
					text: 'Yes, Delete Commands',
					callback_data: 'clearCommands'
				}]
			]
		}
	});
	} else {return errorMsg(replyWithHTML,'configEdit','userNotLvl');}
}