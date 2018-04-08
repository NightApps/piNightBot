module.exports.regex = {
	"pload": "^\/pload(\\@"+botKeys.username+"\\b|(?!\\@\\w+bot))[ ](s|single|singlecom|singlecoms|m|multi|multicom|multicoms|a|addon|addons)[ ](\\w+\\.\\w+)$",
	"plist": "^\/pList(\\@"+botKeys.username+"\\b|(?!\\@\\w+bot))[ ](s|single|singlecom|singlecoms|m|multi|multicom|multicoms|a|addon|addons)$"
};
module.exports.functions = {
	"plist": ({match,from,replyWithHTML}) => {
		if (IsDev(from.id) === false) return;
		if (typeof match[2] === 'undefined') return;
		dir = getDir(match[2])[0];
		msg = '<b>The Following files are loaded in '+dir+':</b>\n\n<pre>';
		count = 0;
		try {
			fs.readdirSync(dir).map(jsFile => ({
				name: jsFile.split('.').slice(0, -1).join('.')
			})).forEach(d => {
				msg+=d.name+'()\n';
				count++;
			});
		} catch (error) {
			console.log('Huston we have a problem:\n\n', error, '\n\n');
		}
		msg+='\n</pre>\n<i>Total of '+count+' files.</i>';
		return replyWithHTML(msg);
	}, 
	"pload": ({match,from,replyWithHTML}) => {
		console.log('game');
		if (IsDev(from.id) === false) return;
		if (typeof match[2] === 'undefined') return;
		if (typeof match[3] === 'undefined') return;
		dir = getDir(match[2]),
		file = match[3],
		data = './'+dir[0]+'/'+file;
		console.log(loadedFiles[dir[1]][file.split('.')[0]]);
		if (fs.existsSync(data)) {
			filename=data.split('.').slice(0, -1).join('.');
			delete loadedFiles[dir[1]][file.split('.')[0]];
			loadedFiles[dir[1]][file.split('.')[0]] = require('.'+data);
			bot.hears(regex, loadedFiles.single[file.split('.')[0]]).catch((error) => console.log('We have a spill on aisle '+sc.name+':\n\n',error,'\n\n'))
			
			msg = '<code>Updated '+file+'() !</code>';
		} else {
			msg = '<b>The File </b><code>'+file+'</code><b> not found in the </b><code>'+dir[0]+'</code><b> folder</b>.';
		}
		return replyWithHTML(msg);
	}, 
	
};

function getDir(d){
	switch(d){
		case 's':
		case 'single':
		case 'singlecom':
		case 'singlecoms':
		return ['singleComs','single'];
		
		case 'm':
		case 'multi':
		case 'multicom':
		case 'multicoms':
		return ['multiComs','multi'];
		
		case 'a':
		case 'addon':
		case 'addons':
		return ['addons','plugins'];
	}
}