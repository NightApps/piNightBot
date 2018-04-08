module.exports = function(data, format,isReply) {
		if (isReply && data.reply_to_message) {data = data.reply_to_message.from;}
		if (data.user) {data = data.user;} else if (data.from) {data = data.from;}
		name = data.first_name;
		if (data.last_name) name = name+' '+data.last_name;
		id = data.id;
	if (name.length>32) name = name.substring(0,29)+'...';
	switch(format){
		case 'html':
		var name = name.replace(/&/gi, "&amp;"),
		name = name.replace(/</gi, "&lt;"),
		name = name.replace(/>/gi, "&gt;");
		name = '<a href="tg://user?id='+id+'">'+name+'</a>'
		break;
	
		case 'markdown':
		name = '['+name+'](tg://user?id='+id+')';
		break;
	}
	return name;
}