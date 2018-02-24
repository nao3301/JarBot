const restify = require('restify');
require('dotenv').config();
const bot = require('./bot.js');

const connector = new builder.ConsoleConnector().listen();
