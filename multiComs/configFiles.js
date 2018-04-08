module.exports.regex = {
	"import": "^\/import\b(\@"+botKeys.username+"\b|(?!\@\w+bot))$",
	"export": "^\/export\b(\@"+botKeys.username+"\b|(?!\@\w+bot))$"
}


module.exports.functions = {
	"export": async({ message,replyWithDocument}) => {
	rank = await checkAdminLevel(message,false);
	if (rank>=6){
		zipdir('./data/'+message.chat.id+'/', function (err, buffer) {
			return replyWithDocument({source:buffer,filename: 'BotConfig'+message.chat.id+'.zip'});
			});
		}
	},
	
	"import": async({ message,replyWithHTML }) => {
	return;
	rank = await checkAdminLevel(message,false);
	if (rank>=6){
		//deleteFolderRecursive('./data/'+message.chat.id+'/');
		
	}
	}
}

function deleteFolderRecursive(path) {
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