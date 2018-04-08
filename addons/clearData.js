module.exports = async function(ctx){
	rank = await checkAdminLevel(ctx.update.callback_query,false);
	if (rank>=6){
		chatId = ctx.update.callback_query.message.chat.id;
		if (fs.existsSync('./data/'+chatId+'/config.json')) fs.unlinkSync('./data/'+chatId+'/config.json');
		if (fs.existsSync('./data/'+chatId+'/levels.json')) fs.unlinkSync('./data/'+chatId+'/levels.json');
		if (fs.existsSync('./data/'+chatId+'/warns.json')) fs.unlinkSync('./data/'+chatId+'/warns.json');
		if (fs.existsSync('./data/'+chatId+'/scoreboard/')) deleteFolderRecursive('./data/'+chatId+'/scoreboard/');
		return ctx.editMessageText('<b>All Configuration Data has been deleted.</b>\n\n<i>To wipe commands, use</i> /comwipe',{parse_mode:'html'});
		
	} else {
		return ctx.answerCbQuery(errorMessages.errDetails.userNotLvl, true);
	}
}

// from http://www.geedew.com/remove-a-directory-that-is-not-empty-in-nodejs/
var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};