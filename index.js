
const express = require('express');
const parser = require('body-parser');
const app = express();
const EventEmitter = require("events");
const Stream = new EventEmitter();
var cors = require('cors')
app.use(cors())
app.set('port', process.env.PORT || 3000);
app.set('host', process.env.HOST || '0.0.0.0');
app.use(parser.json());
app.use(parser.urlencoded({
    extended: true,
}));
app.get('/sse', function (request, response) {
    const temp = (new Date()).getTime();
    response.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });

    // client closes connection
    response.on('close', function () {
        console.log('res close');
    });

    response.on('error', function () {
        console.log('res error');
    });

    // client closes connection
    request.on('close', function () {
        console.log('req close');
    });

    request.on('error', function () {
        console.log('req error');
    });

    const a = setInterval(function () {
        Stream.emit('push', 'message', { msg: 'it works!' }); 
    }, 5000);
    
    setTimeout(() => {
        clearInterval(a);
    }, 30000)

    Stream.on('push', function (event, data) {
        try {
            console.log('Event Sent');
            response.write('event: ' + String(event) + '\n' + 'data: ' + temp.toString() + ' ' + JSON.stringify(data) + '\n\n');
        } catch (err) {
            console.log(err);
        }
    });
});

app.listen(app.get('port'), app.get('host'), function () {
    console.log("Express server listening on port " + app.get('port'));
});