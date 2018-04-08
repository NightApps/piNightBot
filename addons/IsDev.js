module.exports = function(data, isReply) {
	if (data.from|| data.chat && data.from){
		userId = data.from.id;
		if (isReply){
			userId = data.reply_to_message.from.id;	
		}
	} else if (data.chat_instance){
		userId = data.from.id;
		if (isReply){
			userId = data.message.from.id;	
		}
	} else if (data.id) {
		userId = data.id;
	} else if (typeof data==='number'){
		userId=data;
	}
	if (developers.indexOf(userId)!==-1) return true;
	return false;
}