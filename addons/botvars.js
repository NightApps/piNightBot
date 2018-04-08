getName = require('./getName.js');

function getFileId(message){
	if (message.text) return 'na';
	if (message.game) return 'na';
	if (message.photo){
		message.photo.reverse();
		return message.photo[0].file_id;
	} else if (message.contact){
		return '+'+message.contact.phone_number;
	} else if (message.location){
		return message.location.latitude+','+message.location.longitude;
	} else if (message.venue){
		return message.venue.location.latitude+','+message.venue.location.longitude;
	} else {
		var fileTypes = filtered_keys(message, /(video|audio|sticker|voice|video_note|document)/gi);
		return message[fileTypes[0]].file_id;
	}
}

module.exports = function(text,format,message) {
	
	/*
	if (format==='html'){
		text = text.replace(/(<(?!(\/)?.>))/g, '&lt;');
		text = text.replace(/\B>\B/g, '&gt;');
	}
	*/
	
	if (message.reply_to_message){
		//messsage info
		var text = text.replace(/\$rmid/gi, message.reply_to_message.message_id),
		    text = text.replace(/\$rdate/gi, (message.reply_to_message.edit_date||message.reply_to_message.date)),
		    //text = text.replace(/\$rdate/gi, message.reply_to_message.date),
		    text = text.replace(/\$rfile/gi, getFileId(message.reply_to_message));
		if (message.reply_to_message.text) var text = text.replace(/\$rt/gi, message.reply_to_message.text);
		//user info
		var text = text.replace(/\$ru/gi, message.reply_to_message.from.username),
		    text = text.replace(/\$rf/gi, message.reply_to_message.from.first_name),
		    text = text.replace(/\$rl/gi, message.reply_to_message.from.last_name),
		    text = text.replace(/\$rc/gi, message.reply_to_message.from.language_code),
		    text = text.replace(/\$rid/gi, message.reply_to_message.from.id),
		    text = text.replace(/\$rn/gi, getName(message,'none',true));
		if (format!=='none') var text = text.replace(/\$rm/gi, getName(message,format,true));
	}
	//messsage info
	var text = text.replace(/\$mid/gi, message.message_id),
	    text = text.replace(/\$date/gi, (message.edit_date||message.date)),
	    text = text.replace(/\$file/gi, getFileId(message));
	//chat info
	if (message.chat.type!=='private'){
	var text = text.replace(/\$cn/gi, message.chat.title),
	    text = text.replace(/\$cid/gi, message.chat.id),
	    text = text.replace(/\$cty/gi, message.chat.type);
	if (message.chat.username) var text = text.replace(/\$cu/gi, message.chat.username);
	}
	//user info
	var text = text.replace(/\$u/gi, message.from.username),
		text = text.replace(/\$f/gi, message.from.first_name),
		text = text.replace(/\$l/gi, message.from.last_name),
		text = text.replace(/\$c/gi, message.from.language_code),
		text = text.replace(/\$id/gi, message.from.id),
		text = text.replace(/\$n/gi, getName(message,'none',false));
	if (format!=='none') var text = text.replace(/\$m/gi, getName(message,format,false));
	return text;
}

//from https://stackoverflow.com/a/6755033
function filtered_keys(obj, filter) {
  var key, keys = [];
  for (key in obj) {
    if (obj.hasOwnProperty(key) && filter.test(key)) {
      keys.push(key);
    }
  }
  return keys;
}