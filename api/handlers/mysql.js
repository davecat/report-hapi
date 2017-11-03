/**
 * Created by dave on 17/8/10.
 */
var mysql = require('mysql');

module.exports.management = function handleDisconnect() {
    var connection = mysql.createConnection({
        host: 'rm-2ze0v70uggy83t5ago.mysql.rds.aliyuncs.com',
        user: 'lib',
        password: 'lib88888',
        database: 'test'
    }); // Recreate the connection, since
                                                    // the old one cannot be reused.

    connection.connect(function(err) {              // The server is either down
        if(err) {                                     // or restarting (takes a while sometimes).
            console.log('error when connecting to MSQ:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
    return connection;
}();

//老平台数据源
module.exports.vkits = function handleDisconnect1() {
    var oldConnection = mysql.createConnection({
        host: '192.168.0.99',
        user: 'admin',
        password: '123456',
        database: 'base2'
    }); // Recreate the connection, since
    // the old one cannot be reused.

    oldConnection.connect(function(err) {              // The server is either down
        if(err) {                                     // or restarting (takes a while sometimes).
            console.log('error when connecting to MSQ:', err);
            setTimeout(handleDisconnect1, 2000); // We introduce a delay before attempting to reconnect,
        }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    oldConnection.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect1();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
    return oldConnection;
}();

module.exports.guozheng = function connectguozheng() {
    var oldConnection = mysql.createConnection({
        host:'rm-2ze92s92qz4d0jr18.mysql.rds.aliyuncs.com',
        user:'lib',
        password:'lib88888',
        database:'counter'
    });

    oldConnection.connect(function (err) {
        if(err){
            console.log('error when connecting to MSQ:',err);
            setTimeout(connectguozheng,2000);
        }
    });

    oldConnection.on('error',function (err) {
        console.log('db error',err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            connectguozheng();
        } else {
            throw err;
        }
    });
    return oldConnection;
}();