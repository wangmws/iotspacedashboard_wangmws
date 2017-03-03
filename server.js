var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var iotf = require('ibmiotf');
var db = require("./routes/db.js");
var bodyParser = require('body-parser');
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
                io.emit("sensorObj", sensorObj);
                //console.log(sensorObj);
                
            } catch(err){
                console.log(err);
            }
<<<<<<< HEAD
<<<<<<< HEAD
        }

        if(deviceType == "MOD01"){
            
            try{
                sensorObj = JSON.parse(payload);
                io.emit("ModCam", sensorObj);
                console.log(sensorObj);
                
            } catch(err){
                console.log(err);
            }
        }

        if(deviceId == "IBM_Tag"){
            
            try{
                sensorObj = JSON.parse(payload);
                io.emit("IBM_Tag", sensorObj);
                console.log(sensorObj);
                
            } catch(err){
                console.log(err);
            }
        }
=======
 
>>>>>>> parent of 594f917... first version of live feed
=======
 
>>>>>>> parent of 594f917... first version of live feed
            

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
   
    db.HomeWeatherQuery(24, function(result){
        socket.emit("sensorObj_array", result);
        console.log(result);
    });

    socket.on('test', function (data) {  
    console.log(data);
    });
});

//continous transfer
io.on("connection", function () {

});


//HTTP Get Request
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Body parser use JSON data

app.get('/querysexfcount',function(req,res){
    try{
            db.querysexfcount(req.query,function(data){
                 res.send(data);
            });
        
    } catch (err) {
        console.log(err);
    }

});

app.get('/querysexmcount',function(req,res){
    console.log("querysexmcount here");
    try{
            db.querysexmcount(req.query,function(data){
                res.send(data);
            });
        
    } catch (err) {
        console.log(err);
    }

});

app.get('/queryagecount',function(req,res){
    console.log("queryagecount here");
    try{
            db.queryagecount(req.query,function(data){
                res.send(data);
            });
        
    } catch (err) {
        console.log(err);
    }

});

app.get('/querymoodcount',function(req,res){
    console.log("querymoodcount here");
    try{
            db.querymoodcount(req.query,function(data){
                res.send(data);
            });
        
    } catch (err) {
        console.log(err);
    }

});

app.get('/queryglassescount',function(req,res){
    console.log("queryglassescount here");
    try{
            db.queryglassescount(req.query,function(data){
                res.send(data);
            });
        
    } catch (err) {
        console.log(err);
    }

});

app.get('/queryusercountselection',function(req,res){
    console.log("queryusercountselection here");
    try{
            db.queryusercountselection(req.query,function(data){
                res.send(data);
            });
        
    } catch (err) {
        console.log(err);
    }

});

app.get('/queryusercounttotal',function(req,res){
    console.log("queryusercounttotal here");
    try{
            db.queryusercounttotal(req.query,function(data){
                res.send(data);
            });
        
    } catch (err) {
        console.log(err);
    }

});

