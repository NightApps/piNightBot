module.exports = function(type,msg){
	console.log(msg);
	try {name = getName(msg,'html',false);}catch(err){};
	if (msg.chat) chatId = msg.chat.id;
	FromId = ' #u'+msg.from.id;
	switch(type.toLowerCase()){
		case 'initial':
		text = '<b>Messages from </b><code>'+msg.chat.title+'</code><b> ('+msg.chat.id+') will be posted here.</b>\n\n#BotConfig';
		break;
		
		case 'setlog':
		text = name+'<b> has changed the Log Channel to: </b><code>'+msg.forward_from_chat.id+'</code>\n\n#BotConfig';
		break;
		
		case 'title':
		text = name+'<b> has changed the Group Title to: </b><i>'+arguments[2]+'</i>\n\n#Title';
		break;
		
		case 'photo':
		text = name+'<b> has changed the Group Photo</b>\n\n#Photo';
		break;
		
		case 'join':
		text = getJoinText(msg);
		break;
		
		case 'left':
		text = getLeftText(msg);
		break;
		
		case 'pin_t':
		text = getPinText(name,arguments[2]);
		break;
		
		case 'pin_ro':
		text = getPinText(name,msg.pinned_message);
		break;
		
		case 'pin_rc':
		text = getPinText(name,msg.reply_to_message);
		break;
		
		

		case 'kick':
		case 'warn':
		case 'ban':
		case 'k':
		case 'b':
		case 'w':
		text = arguments[2]+'\n\n'+arguments[3];
		break;
		
		case 'up':
		case 'down':
		text = name+'<b> has '+arguments[3]+' </b>'+arguments[2]+'<b> to Level '+arguments[4]+'</b>\n\n#Level'+type.charAt(0).toUpperCase()+type.slice(1).replace(/([A-Z])/g, ' $1').trim();
		break;
		
		case 'configChange':
		text = name+'<b> has '+arguments[3]+' '+arguments[2]+'</b>\n\n#BotConfig';
		break;
		
		
		
	}
	channelId = parseInt(configMemory[chatId].strings.modLog);
	async function send(){
		try {
			post = await bot.telegram.sendMessage(channelId,text+FromId,Extra.HTML());
		} catch(error){
			err = error.response.description;
			if (err.search("need administrator rights in the channel")!==-1||err.search("chat not found")!==-1) {bot.telegram.sendMessage(chatId,'#NoteToAdmins, Moderation Log is enabled in the Group Configuration, but Night Bot currently does not have permission to posts messages in the Log Channel. Please enable the "Post messages" permission for @'+bot.options.username+' in the channel.');} else {
				console.log('log error: ',err);
			}
		}
	}
	
	send();
}

function getJoinText(msg){
	if (msg.new_chat_members.length===1 && msg.new_chat_members[0].id===msg.from.id){
		name = getName(msg.new_chat_members[0],'html');
		return name+'<b> has joined the group.</b>\n\n#NewMember';
	} else if (msg.new_chat_members.length===1 && msg.new_chat_members[0].id!==msg.from.id) {
		name2 = getName(msg.new_chat_members[0],'html');
		return name+'<b> has added </b>'+name2+'\n\n#NewMember';
	} else {
		text = name+'<b> has added </b>';
		for (i = 0; i < msg.new_chat_members.length; i++) {
			name = getName(msg.new_chat_members[i],'html');
			text += name+', ';
		}
		return text+'\n\n#NewMember';
	}
}

function getLeftText(msg){
	if (msg.left_chat_member.id===msg.from.id){
		return name+'<b> has left the group.</b>\n\n#LeftMember';
	} else if (msg.left_chat_member.id!==msg.from.id) {
		name2 = getName(msg.left_chat_member,'html');
		return name+'<b> has manually removed </b>'+name2+'\n\n#Banned';
	}
}

function getPinText(name, data){
	if (typeof data==='string'){
		return name+'<b> has pinned a text message: </b><i>'+data+'</i>\n\n#Pinned';
	} else if (data.text){
			return name+'<b> has pinned a text message: </b><i>'+data.text+'</i>\n\n#Pinned';
	} else {
		var fileTypes = filtered_keys(data, /(photo|contact|location|venue|video|audio|sticker|voice|video_note|document)/gi);
		return name+'<b> has pinned a '+fileTypes[0]+'.</b>\n\n#Pinned';
	}
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