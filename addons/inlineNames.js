

module.exports = function(reply,data,type){
	data.shift();
	dialog = false;
	switch(type){
		case 'gameName':
		text = gameName(data[0]);
		break;
		
		case 'configName':
		text = configName(data[0]);
		dialog = true;
		break;
	}
	return reply(text,dialog);
}

function configName(name){
	switch(name){
	case 'groupCommands':
	return 'Toggles the usage of Custom Commands, via the /add Command.';
	
	case 'welcomeMessage':
	return 'If Enabled, The Bot will display a message when new members join the group, set by the /sw Command.';
	
	case 'tripleGay':
	return 'If Enabled, the bot will send a humorous sticker at random invervals.';
	
	case 'hahaYeah':
	return 'If Enabled, the bot will send a humorous comment at random invervals.';
	
	case 'doorGame':
	return 'Toggles the Door Giveaway Game, started using the /123 Command.';
	
	case 'solveGame':
	return 'Toggles the Math Problem Game, started using the /solve Command.';
	
	case 'sortGame':
	return 'Toggles the Number Sorting Game, started using the /sort Command.';
	
	case 'typeGame':
	return 'Toggles the Typing Game, started using the /type Command.';
	
	case 'countryGame':
	return 'Toggles the Country/US State Guessing Games, started using the /country and /states Commands.';
	
	case 'modLog':
	return 'If Enabled, the bot will forward most moderation-related actions to a Channel set using the /setlog Command.';
	
	case 'titleLock':
	return 'If Enabled, the bot will prevent most Title Changes.';
	
	case 'pinLock':
	return 'If Enabled, the bot will prevent most Pin Changes.';
	
	case 'inviteLock':
	return 'If Enabled, the bot will prevent new users from joining the group.';
	}
}
function gameName(name){
	switch(name){
		case 'type':
		case 'solve':
		case 'sort':
		case 'states':
		case 'country':
		Name = name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1').trim();
		return 'Number of '+Name+' Games Won';
		
		case 'betMoney':
		return 'Schmeckles usable for Bet Bot';
		
		case 'total':
		return 'Total Points from All Games/Gifted';
		
		case 'sent':
		return 'Number of Points Sent to other Users';
		
		case 'gift':
		return 'Number of Points Sent/Given to/from other Users';
		
		case 'given':
		return 'Number of Points Gifted by other Users';
	}
}