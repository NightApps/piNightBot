module.exports = async({ message,replyWithHTML }) => {
	rank = await checkAdminLevel(message,false);
	if (rank>=6){
	text = '<b>Are You Sure?</b>\n\n<i>Presing the below button will clear all saved data, including Configurations, Level Names, User Warns, and Scoreboards.</i>';
	text = botvars(text,'html',message);
	return replyWithHTML(text, {
	reply_markup: {inline_keyboard:[
				[{
					text: 'Yes, Delete Configuration',
					callback_data: 'clearData'
				}]
			]
		}
	});
	} else {return errorMsg(replyWithHTML,'configEdit','userNotLvl');}
}