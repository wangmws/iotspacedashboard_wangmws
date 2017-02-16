module.exports = {
  HomeWeatherQuery: function(hours, callback) {
      var ibmdb = require('ibm_db');
      var ret ;

      if (process.env.VCAP_SERVICES) {
        var env = JSON.parse(process.env.VCAP_SERVICES);
	    
        hasConnect = true;
        if (env['dashDB']) {
            db2 = env['dashDB'][0].credentials;
	    } else {
            console.log("dashDB credentials not found")
        }
      } else
        db2 = require('../db.json');


        console.log(db2);
        var connString = "DRIVER={DB2};DATABASE=" + db2.db + ";UID=" + db2.username + ";PWD=" + db2.password + ";HOSTNAME=" + db2.hostname + ";port=" + db2.port;

        ibmdb.open(connString,function (err,conn) {
            if (err) return console.log(err);
            var offset_hours = (parseInt(hours) - 8); //off +8 due to US Timezone
            conn.query('select * from homeweatherdata_0 where (cast(payload_ts as timestamp) >= CURRENT_TIMESTAMP - ' + offset_hours  + ' HOUR) order by cast(payload_ts as timestamp) ASC', function (err, data) {
                if (err) {
                    console.log(err);
                    return callback(err);
                } else {
                    //console.log(typeof data);
                   return callback(data);
                }

                conn.close(function () {
                    console.log('done');
                });
            });
        });
   
  },
       
  querysexfcount: function(req, callback) {
      var ibmdb = require('ibm_db');
      
      if (process.env.VCAP_SERVICES) {
        var env = JSON.parse(process.env.VCAP_SERVICES);
	    
        hasConnect = true;
        if (env['dashDB']) {
            db2 = env['dashDB'][0].credentials;
	    } else {
            console.log("dashDB credentials not found")
        }
      } else
        db2 = require('../db.json');

        var connString = "DRIVER={DB2};DATABASE=" + db2.db + ";UID=" + db2.username + ";PWD=" + db2.password + ";HOSTNAME=" + db2.hostname + ";port=" + db2.port;

        try{
            ibmdb.open(connString,function (err,conn) {
                if (err) return console.log(err);
                var query = "select  count(payload_sex) as headcount, hour(payload_time)  as ihour from modcam where cast(payload_time as date) = '" +
                                req.date +
                                "' and payload_sex = 'f' group by hour(payload_time) order by hour(payload_time)";
                conn.query(query, function (err, data) {
                    if (err) {
                        console.log(err);
                        return err;
                    } else {
                        //console.log(typeof data);
                    return callback(data);
                    }

                    conn.close(function () {
                        console.log('query done');
                    });
                });
            });
        } catch(err) {
            console.log(err);
            return callback();
        }
    },

    querysexmcount: function(req, callback) {
      var ibmdb = require('ibm_db');
      
      if (process.env.VCAP_SERVICES) {
        var env = JSON.parse(process.env.VCAP_SERVICES);
	    
        hasConnect = true;
        if (env['dashDB']) {
            db2 = env['dashDB'][0].credentials;
	    } else {
            console.log("dashDB credentials not found")
        }
      } else
        db2 = require('../db.json');

        var connString = "DRIVER={DB2};DATABASE=" + db2.db + ";UID=" + db2.username + ";PWD=" + db2.password + ";HOSTNAME=" + db2.hostname + ";port=" + db2.port;

        try{
            ibmdb.open(connString,function (err,conn) {
                if (err) return console.log(err);
                var query = "select  count(payload_sex) as headcount, hour(payload_time)  as ihour  from modcam where cast(payload_time as date) = '" +
                                req.date +
                                "' and payload_sex = 'm' group by hour(payload_time) order by hour(payload_time)";
                conn.query(query, function (err, data) {
                    if (err) {
                        console.log(err);
                        return err;
                    } else {
                        //console.log(typeof data);
                    return callback(data);
                    }

                    conn.close(function () {
                        console.log('query done');
                    });
                });
            });
        } catch(err) {
            console.log(err);
            return callback();
        }
    },

    
    queryagecount: function(req, callback) {
      var ibmdb = require('ibm_db');
      
      if (process.env.VCAP_SERVICES) {
        var env = JSON.parse(process.env.VCAP_SERVICES);
	    
        hasConnect = true;
        if (env['dashDB']) {
            db2 = env['dashDB'][0].credentials;
	    } else {
            console.log("dashDB credentials not found")
        }
      } else
        db2 = require('../db.json');

        var connString = "DRIVER={DB2};DATABASE=" + db2.db + ";UID=" + db2.username + ";PWD=" + db2.password + ";HOSTNAME=" + db2.hostname + ";port=" + db2.port;

        try{
            ibmdb.open(connString,function (err,conn) {
                if (err) return console.log(err);
                var query = "select  round(payload_age) as age,  payload_sex as sex from modcam " +
                            "where cast(payload_time as date)   = '" + req.date + 
                            "' and hour(payload_time) >= '" + req.startTime + "' and hour(payload_time) <= '" + req.endTime +
                            "' order by hour(payload_time)";
                conn.query(query, function (err, data) {
                    if (err) {
                        console.log(err);
                        return err;
                    } else {
                        //console.log(typeof data);
                    return callback(data);
                    }

                    conn.close(function () {
                        console.log('query done');
                    });
                });
            });
        } catch(err) {
            console.log(err);
            return callback();
        }
    },

    querymoodcount: function(req, callback) {
      var ibmdb = require('ibm_db');
      
      if (process.env.VCAP_SERVICES) {
        var env = JSON.parse(process.env.VCAP_SERVICES);
	    
        hasConnect = true;
        if (env['dashDB']) {
            db2 = env['dashDB'][0].credentials;
	    } else {
            console.log("dashDB credentials not found")
        }
      } else
        db2 = require('../db.json');

        var connString = "DRIVER={DB2};DATABASE=" + db2.db + ";UID=" + db2.username + ";PWD=" + db2.password + ";HOSTNAME=" + db2.hostname + ";port=" + db2.port;

        try{
            ibmdb.open(connString,function (err,conn) {
                if (err) return console.log(err);
                var query = "select  round(payload_age) as age, round(payload_mood) as mood, payload_sex as sex, hour(payload_time)  as ihour from modcam " +
                            "where cast(payload_time as date) = '" + req.date + 
                            "' and hour(payload_time) >= '" + req.startTime + 
                            "' and hour(payload_time) <= '" + req.endTime +
                            "' order by hour(payload_time)";
                conn.query(query, function (err, data) {
                    if (err) {
                        console.log(err);
                        return err;
                    } else {
                        //console.log(typeof data);
                    return callback(data);
                    }

                    conn.close(function () {
                        console.log('query done');
                    });
                });
            });
        } catch(err) {
            console.log(err);
            return callback();
        }
    },

    queryglassescount: function(req, callback) {
      var ibmdb = require('ibm_db');
      
      if (process.env.VCAP_SERVICES) {
        var env = JSON.parse(process.env.VCAP_SERVICES);
	    
        hasConnect = true;
        if (env['dashDB']) {
            db2 = env['dashDB'][0].credentials;
	    } else {
            console.log("dashDB credentials not found")
        }
      } else
        db2 = require('../db.json');

        var connString = "DRIVER={DB2};DATABASE=" + db2.db + ";UID=" + db2.username + ";PWD=" + db2.password + ";HOSTNAME=" + db2.hostname + ";port=" + db2.port;

        try{
            ibmdb.open(connString,function (err,conn) {
                if (err) return console.log(err);
                var query = "select sum(payload_glasses) as Total_Glasses, count(payload_glasses)  as Total_Count from modcam " +
                            " where cast(payload_time as date) = '" + req.date + 
                            "' and hour(payload_time) >= '" + req.startTime + 
                            "' and hour(payload_time) <= '" + req.endTime + 
                            "'";
                conn.query(query, function (err, data) {
                    if (err) {
                        console.log(err);
                        return err;
                    } else {
                        //console.log(typeof data);
                    return callback(data);
                    }

                    conn.close(function () {
                        console.log('query done');
                    });
                });
            });
        } catch(err) {
            console.log(err);
            return callback();
        }
    },

    queryusercountselection: function(req, callback) {
      var ibmdb = require('ibm_db');
      
      if (process.env.VCAP_SERVICES) {
        var env = JSON.parse(process.env.VCAP_SERVICES);
	    
        hasConnect = true;
        if (env['dashDB']) {
            db2 = env['dashDB'][0].credentials;
	    } else {
            console.log("dashDB credentials not found")
        }
      } else
        db2 = require('../db.json');

        var connString = "DRIVER={DB2};DATABASE=" + db2.db + ";UID=" + db2.username + ";PWD=" + db2.password + ";HOSTNAME=" + db2.hostname + ";port=" + db2.port;

        try{
            ibmdb.open(connString,function (err,conn) {
                if (err) return console.log(err);
                var query = "select count(*) as alltotal from modcam " +
                            " where cast(payload_time as date) = '" + req.date +
                            "' and hour(payload_time) >= '" + req.startTime +
                            "' and hour(payload_time) <= '" + req.endTime +
                            "'";
                conn.query(query, function (err, data) {
                    if (err) {
                        console.log(err);
                        return err;
                    } else {
                        //console.log(typeof data);
                    return callback(data);
                    }

                    conn.close(function () {
                        console.log('query done');
                    });
                });
            });
        } catch(err) {
            console.log(err);
            return callback();
        }
    },

    queryusercounttotal: function(req, callback) {
      var ibmdb = require('ibm_db');
      
      if (process.env.VCAP_SERVICES) {
        var env = JSON.parse(process.env.VCAP_SERVICES);
	    
        hasConnect = true;
        if (env['dashDB']) {
            db2 = env['dashDB'][0].credentials;
	    } else {
            console.log("dashDB credentials not found")
        }
      } else
        db2 = require('../db.json');

        var connString = "DRIVER={DB2};DATABASE=" + db2.db + ";UID=" + db2.username + ";PWD=" + db2.password + ";HOSTNAME=" + db2.hostname + ";port=" + db2.port;

        try{
            ibmdb.open(connString,function (err,conn) {
                if (err) return console.log(err);
                var query = "select count(*) as alltotal from modcam where cast(payload_time as date) <= '" + req.date +
                            "'";
                conn.query(query, function (err, data) {
                    if (err) {
                        console.log(err);
                        return err;
                    } else {
                        //console.log(typeof data);
                    return callback(data);
                    }

                    conn.close(function () {
                        console.log('query done');
                    });
                });
            });
        } catch(err) {
            console.log(err);
            return callback();
        }
    },
};



