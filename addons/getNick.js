module.exports = function(chatId,userId) {
	file = './data/'+chatId+'/nicknames.json';
	if (fs.existsSync(file)) {
		nickNamesMemory[chatId] = JSON.parse(fs.readFileSync(file, 'utf8'));
		nickname = (nickNamesMemory[chatId][userId]||null);
	} else {
		nickNamesMemory[chatId] = {};
		nickNamesMemory[chatId][userId]=null, nickname = null;
	}
	return nickname;
}