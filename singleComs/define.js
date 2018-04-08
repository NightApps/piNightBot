module.exports = ({ message,replyWithHTML,match }) => {
	if (typeof match[3]==='undefined') return;
	word = match[3].toLowerCase(),
	url = "https://en.oxforddictionaries.com/definition/"+encodeURIComponent(word);
	scrapeIt(url, {
		word: ".hw",
		parts:{
			listItem: 'section.gramb',
			data: {
				partOfSpeech: 'h3 .pos',
				definitions:{
					listItem: 'ul.semb',
					data: {
						definition: 'li .trg p .ind',
						example: {
							selector: 'li .exg .ex em',
							eq: 0
						}
					}
				}
				
			}
		}
	}, (err, page) => {
		//console.log(util.inspect(page, false, null));
		if (page.parts.length===0) return replyWithHTML('<b>No Results Found for: </b><code>'+word+'</code>');
		text = 'Definition of <i>'+word+'</i> in English:\n\n'
		for (i = 0; i < page.parts.length; i++) {
			if (page.parts[i].definitions.length===1){
				text+='<code>('+page.parts[i].partOfSpeech.toUpperCase()+')</code> '+page.parts[i].definitions[0].definition+'\n<i>'+page.parts[i].definitions[0].example+'</i>\n\n';
			}
			/*
			for (j = 0; i < page.parts[i].definitions.length; j++) {
				console.log(page.parts[i].definitions[j]);
				//text+='<code>('+page.parts[i].partOfSpeech.toUpperCase()+'</code>) '+page.parts[i].definitions[j].definition+'\n<i>'+page.parts[i].definitions[j].example+'</i>\n\n';
			}/*/
			
		}
		return replyWithHTML(text, {
			reply_to_message_id: message.message_id,
			reply_markup: {inline_keyboard:[
				[{
					text: 'View Full Page',
					url: url
				}]
			]
		}
	});
	});
}