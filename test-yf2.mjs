import yahooFinance from 'yahoo-finance2';
yahooFinance.chart('RELIANCE.NS', {range:'1mo', interval:'1d'}).then(res => console.log(res.quotes[0]));
