revision = 1,
defaultScoreboard = {total:0,sent:0,given:0,revision:revision};

module.exports = function(chatId,userId) {
	if (chatId!==userId){
	console.log(chatId,userId);
	if (!fs.existsSync('./data/'+chatId+'/scoreboard/')){
		fs.mkdirSync('./data/'+chatId+'/scoreboard/');
	}
	file = './data/'+chatId+'/scoreboard/'+userId+'.json';
	} else {
	file = './data/'+chatId+'/scoreboard.json';
	}
	if (fs.existsSync(file)) {
		scoreboard = JSON.parse(fs.readFileSync(file, 'utf8'));
		if (scoreboard.revision!==revision) scoreboard = updateScoreboard(scoreboard);
	} else {
		scoreboard = defaultScoreboard
	}
	return scoreboard;
}

function updateScoreboard(old){
	newScoreboard = defaultScoreboard;
	for (key in defaultScoreboard){
		defaultScoreboard[key] = (old[key]||defaultScoreboard[key]);
	}
	return newScoreboard;
}