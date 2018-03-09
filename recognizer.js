
bot.recognizer(new builder.RegExpRecognizer( "CancelIntent", { en_us: /^(cancel|nevermind)/i, ja_jp: /^(キャンセル)/ }));

module.exports = bot.recognizer;