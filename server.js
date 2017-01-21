var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var iotf = require('ibmiotf');
var appConfig;

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

var serverPort = 0;
var serverHost = '';

if (process.env.VCAP_SERVICES) {
    var env = JSON.parse(process.env.VCAP_SERVICES);
    appConfig = {
                   'org' : env["iotf-service"][0].credentials.org,
                   'id' : 'DashboardIOTs',
                   'auth-key' : env["iotf-service"][0].credentials.apiKey,
                   'auth-token' : env["iotf-service"][0].credentials.apiToken
                  };
    serverPort = appEnv.port;
    serverHost = '0.0.0.0';
} else {
    appConfig = require('./application.json');
    serverPort = 8080;
    serverHost = 'localhost';
}


app.use(express.static(__dirname + '/public'));
app.use('/scripts', express.static(__dirname + '/node_modules/'));

var appClient = new iotf.IotfApplication(appConfig);
console.log(appConfig);

var sensorObj = {};
var sensorObj_array = new Array();

var recordCounter = 0;
server.listen(serverPort, serverHost, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening at http://%s:%s', host, port);
    appClient.connect();
    
    appClient.on('connect', function() {
        appClient.subscribeToDeviceEvents();
    });
    
    appClient.on('deviceEvent', function(deviceType, deviceId, eventType, format, payload) {
        //console.log("Device event at " + new Date().toString() + " from " + deviceType +
        //                  ":" + deviceId + "; event = "+ eventType +", payload = " + payload);

                        
        if(deviceId == "ESP8266_Device01"){
            
            try{
                sensorObj = JSON.parse(payload);
                
                //spread out the counter recording
                if(recordCounter == 0){
                    if(sensorObj_array.length < 100)
                    {
                        sensorObj_array.push(sensorObj);
                        console.log(sensorObj_array.length);
                    } else {
                        sensorObj_array.shift();
                        sensorObj_array.push(sensorObj);
                        console.log(sensorObj_array.length);
                    }
                }
            } catch(err){
                console.log(err);
            }
 
            recordCounter++;
            //reset counter
            if(recordCounter == 100)
                recordCounter = 0;

            /*
            var roomSensor = {};
            roomSensor.humid = sensorObj.d.Humidity;
            roomSensor.Light = sensorObj.d.Light;
            roomSensor.Motion = sensorObj.d.Motion;
            roomSensor.Temperature = sensorObj.d.Temperature;
            roomSensor.Timestamp = sensorObj.ts;
            //roomSensor
            console.log(roomSensor.humid);
            console.log(roomSensor.Temperature);
            */

        }
    });
});

//transfer one time
io.on("connection", function (socket) {
    socket.emit("sensorObj_array", sensorObj_array); 
});

//continous transfer
io.on("connection", function (socket) {
     // to make things interesting, have it send every second 
     
     var interval = setInterval(function () { 
            socket.emit("sensorObj", sensorObj); 
        }, 3000); 
            socket.on("disconnect", function () { 
             clearInterval(interval); 
        }); 
});

