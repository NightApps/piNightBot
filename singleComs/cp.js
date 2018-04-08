module.exports = (ctx) => {
	checkAdminLevel(ctx.message,false).then((rank) => {
		if (!ctx.message.reply_to_message) return;
		d = ctx.message.reply_to_message;
		if (rank>=3) {
			if (d.photo){
				d.photo.reverse();
				file_id = d.photo[0].file_id;
			} else if (d.sticker){
				file_id = d.sticker.file_id;
			} else {
				return;
			}
			setProfileImage(ctx.chat.id,file_id,ctx.reply);
		} else {
			
		}
	});
}

async function setProfileImage(chatId, file_id, reply) {
	bot.telegram.getFile(file_id).then((file) => {
			var url = 'https://api.telegram.org/file/bot' + botKeys.token + '/' + file.file_path;
			https.get(url, res => {
				var body=new Buffer(0);
		
				res.on('data', d => {
					body=Buffer.concat([body, d]);
				});
				res.on('end', () => {
					console.log(body);
					bot.telegram.setChatPhoto(chatId, {
					source: body
				}).catch(function(err) {
						if (err.response.description.search('rights to change chat photo') !== -1) return errorMsg(reply, 'picChng', 'botNotInfo');
						console.log(err);
				});
				});
			});
			//*/
		});
	}
