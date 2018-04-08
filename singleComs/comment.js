module.exports = ({ deleteMessage,reply,message }) => {
	deleteMessage();
	extra = {};
	if (message.reply_to_message) extra.reply_to_message_id=message.reply_to_message.message_id;
	reply('haha yeah',extra);
};
