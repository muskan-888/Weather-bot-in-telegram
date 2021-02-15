// Requiring modules 
var TelegramBot = require('node-telegram-bot-api') 
var request = require('request') 

// Token obtained from bot father 
var token = "Token"

var bot = new TelegramBot(token, { polling: true }); 
const Promise = require('bluebird');
Promise.config({
  cancellation: true
});
// Create a bot that uses 'polling' to 
// fetch new updates 
bot.on("polling_error", (err) => console.log(err)); 

// The 'msg' is the received Message from user and 
// 'match' is the result of execution above 
// on the text content 
bot.onText(/\/city (.+)/, function (msg, match) { 

	// Getting the name of movie  from the message 
	// sent to bot 
	var city = match[1]; 
	var chatId = msg.chat.id 
	var query = 
'http://api.openweathermap.org/data/2.5/weather?q='
		+ city + '&appid=Add_your_api_id'

	// Key obtained from openweathermap API 
	request(query, function (error, response, body) { 

		if (!error && response.statusCode == 200) { 

			bot.sendMessage(chatId, 
				'_Looking for details of_ ' + city 
				+ '...', { parse_mode: "Markdown" }) 
                .then(msg) 
                { 
				res = JSON.parse(body) 
				var temp = Math.round((parseInt( 
					res.main.temp_min) - 273.15), 2) 

				// Kelvin to celsius and then round 
				// off and conversion to atm 
				var pressure = Math.round(parseInt( 
						res.main.pressure) - 1013.15) 

				var rise = new Date(parseInt( 
						res.sys.sunrise) * 1000); 

				var set = new Date(parseInt( 
						res.sys.sunset) * 1000); 
				// Unix time to IST time conversion 

				bot.sendMessage(chatId, '**** '
					+ res.name + ' ****\nTemperature: '
					+ String(temp) + '°C\nHumidity: ' + 
					res.main.humidity + ' %\nWeather: '
					+ res.weather[0].description + 
					'\nPressure: ' + String(pressure) 
					+ ' atm\nSunrise: ' + 
					rise.toLocaleTimeString() + 
					' \nSunset: ' + 
					set.toLocaleTimeString() + 
					'\nCountry: ' + res.sys.country) 
			} 

			// Sending back the response from 
			// the bot to user. The response 
			// has many other details also 
			// which can be used or sent as 
			// per requirement 
		} 
	}) 
}) 
