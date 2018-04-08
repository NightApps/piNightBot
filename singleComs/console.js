module.exports = (ctx) => {
	console.log('match: \n', util.inspect(ctx.match, false, null));
	console.log('update: \n', util.inspect(ctx.update, false, null));
	return;
}