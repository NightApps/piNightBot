errorTitle = require('../errors.json').errorTitle,
errDetails = require('../errors.json').errDetails,
comExamples = require('../errors.json').comExamples;

module.exports = function(answerCbQuery,header,detail,example) {
	detailPrint = [];
	header = (errorTitle[header]||'Night Bot Error'),
	example = (comExamples[example]||'');
	if (typeof detail==='object'){
		for (i = 0; i < detail.length; i++) { 
			detailPrint[i] = '• '+errDetails[detail[i]]+'\n';
		}
	} else {
		detailPrint = '• '+errDetails[detail]+'\n';
	}
	text = header+'!\nYou\'re seeing this error due to the following issue(s):\n\n'+detailPrint+'\n'+example;
	return answerCbQuery(text,true);
}