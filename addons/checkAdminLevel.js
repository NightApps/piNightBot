module.exports = async function(data, isReply,skipDev) {
	if (data.chat && data.from){
		chatId = data.chat.id,
		userId = data.from.id;
		if (isReply){
			userId = data.reply_to_message.from.id;	
		}
	} else if (data.chat_instance){
		userId = data.from.id,
		chatId = data.message.chat.id;
		if (isReply){
			userId = data.message.from.id;	
		}
	}
	if (!skipDev) {if (developers.indexOf(userId)!==-1) return 7;}
	chatMember = await bot.telegram.getChatMember(chatId, userId);
		if (chatMember.status == "kicked" || chatMember.status == "left") return 0;
		if (chatMember.status == "creator") return 6;
		if (chatMember.status == "member"||chatMember.status == "restricted") return 1;
		if (chatMember.status == "administrator") {
		if (chatMember.can_promote_members === true) return 5;
		if (chatMember.can_restrict_members === true) return 4;
		if (chatMember.can_pin_messages === true) return 3;
		if (chatMember.can_change_info === true) return 3;
		if (chatMember.can_delete_messages === true) return 2;
	}
	//});
}