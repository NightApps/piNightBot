module.exports = ({ message,replyWithHTML }) => {
	kat = [303893144, 113603941,249105863];
	if (kat.indexOf(message.from.id)===-1) return;
	file = './data/dumbs.txt';
	if (fs.existsSync(file)===true) {
		dumbs = parseInt(fs.readFileSync(file, 'utf8'));
		} else {
			dumbs = 0;
		}
	dumbs = dumbs-1;
	fs.writeFileSync(file,dumbs.toString(),'utf8');
	sads = dumbs.toString().split('').pop();
	sads = parseInt(sads);
	sads = Array(sads).join(")");
	replyWithHTML('<b>Leah has undone a dumb! There are now only '+dumbs+' dumbs.\n:)'+sads+' </b>@SicilianSlut  ',{
		disable_notification: true,
		reply_to_message_id: message.message_id
	});
}