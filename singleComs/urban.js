module.exports = ({	message,replyWithHTML,match}) => {
	if (typeof match[3] === 'undefined') return;
	word = match[3].toLowerCase(),
	url = "https://api.urbandictionary.com/v0/define?page=undefined&term=" + encodeURIComponent(word);
	https.get(url, res => {
		res.setEncoding('utf8');
		let page = '';
		
		res.on('data', data => {
			page += data;
		});
		res.on('end', () => {
			page = JSON.parse(page);
			//console.log(page);
			if (page.result_type==='no_results') return replyWithHTML('<b>No Results Found for: </b><code>'+word+'</code>');
			text = 'Definitions of <i>'+word+'</i> on Urban Dictionary:\n\n';
			shuffle(page.list);
			definitionOne = page.list[0],
			definitionTwo = page.list[1];
			text += definitionOne.definition+'\n<i>'+definitionOne.example+'</i>\n<code>👍🏻 '+definitionOne.thumbs_up+'   👎🏿 '+definitionOne.thumbs_down+'</code>'
			if (definitionTwo) text+='\n\n\n'+definitionTwo.definition+'\n<i>'+definitionTwo.example+'</i>\n<code>👍🏻 '+definitionTwo.thumbs_up+'   👎🏿 '+definitionTwo.thumbs_down+'</code>';
			//text = text.replace(/\[(\w+)\]/gi,'<a href="http://$1.urbanup.com">$1</a>');
			return replyWithHTML(text,{reply_to_message_id: message.message_id,disable_web_page_preview:true});
		});
	});
}