module.exports = ({	message,replyWithHTML,match}) => {
	if (typeof match[3] === 'undefined') return;
	loc = match[3].toLowerCase(),
	searchtext = "select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='" + loc + "')",
	url = "https://query.yahooapis.com/v1/public/yql?q="+searchtext+"&format=json";
	https.get(url, res => {
		res.setEncoding('utf8');
		let page = '';
		
		res.on('data', data => {
			page += data;
		});
		res.on('end', () => {
			page = JSON.parse(page);
			if (page.query.count===0) return replyWithHTML('<b>No Results Found for: </b><code>'+loc+'</code>');
			w = page.query.results.channel;
			title = w.item.title.replace(/at \d{1,2}\:\d{1,2} (AM|PM)\b \w{3}[ ]?$/g,'');
			text = '<i>'+title+':</i>\n\n<b>'+w.item.condition.temp+'°'+w.units.temperature+' and '+w.item.condition.text+'</b> '+emojis[w.item.condition.code]+'\n\n<code>Wind Speeds of '+w.wind.speed+w.units.speed+' and Chill of '+w.wind.chill+'°</code>\n\n<code>'+w.atmosphere.humidity+'% Humidity and '+w.atmosphere.visibility+w.units.distance+' Visibility</code>\n\n<pre>Day       Hi/Lo Cond.\n';
			for (i = 0; i < 5; i++) {
				itm = w.item.forecast[i]
				text +=itm.day+' | '+itm.high+'/'+itm.low+' '+itm.text+' '+emojis[itm.code]+'\n';
			}
			text+='</pre>';
			return replyWithHTML(text,{reply_to_message_id: message.message_id,disable_web_page_preview:true});
		});
	});
}

emojis  = ['🌪️ ', '🌀️ ', '🌀💨', '⛈⚡', '🌩️ ️', '🌧🌨', '🌨💦', '🌨❄', '❄🌧', '🌧💧', '🌧❄', '🌦️ ️', '🌦️ ️', '🌦❄', '🌦❄', '❄💨', '🌨🌨', '💦💨', '❄💦', '🌫💨', '🌫🌫', '🌫🌫', '💨💨', '💨💨', '💨💨', '☃❄', '☁☁', '⛅🌕', '⛅☁', '✨☁', '🌤️ ️', '🌕✨', '☀️ ️', '🌕✨', '☀️ ️', '🌧❗', '☀☀', '🌩️ ️', '🌩️ ️', '🌩️ ️', '🌦️ ️', '🌨🌨', '🌦❄', '🌨🌨', '🌤️ ️', '⛈🌦', '🌤🌨', '️ ️🌩', '❓❓', ];