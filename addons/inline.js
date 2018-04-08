module.exports = (ctx) => {
	extra = {is_personal:true,cache_time:1};
	results = [];
	offset = 0;
	from = ctx.update.inline_query.from;
	query = ctx.update.inline_query.query;
	console.log(query);
	//if (!query || query.length===0){
		extra.switch_pm_text = 'Message Night Bot',
		extra.switch_pm_parameter = 'start';
		results.push({
			title: 'Night Bot v3.0',
			type: 'article',
			id: offset.toString(),
			description: 'Visit @PiNight for updates',
			input_message_content: {
				message_text: 'https://t.me/PiNight'
			},
			thumb_url: 'https://i.imgur.com/83svNGj.png',
			thumb_width: 1000,
			thumb_height: 1000
		});
	//}
	return ctx.answerInlineQuery(results,extra);
}