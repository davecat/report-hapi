/**
 * Created by dave on 17/8/10.
 */
var mysql = require('mysql');
module.exports = function () {
    //远端库
    var connection = mysql.createConnection({
      host: 'rm-2ze0v70uggy83t5ago.mysql.rds.aliyuncs.com',
      user: 'lib',
      password: 'lib88888',
      database: 'test'
    });
    connection.connect();
    return connection;
}();

//老平台数据源
module.exports = function () {
    var oldConnection = mysql.createConnection({
        host: '192.168.0.190',
        user: 'admin',
        password: '123456',
        database: 'base2'
    });
    oldConnection.connect();
    return oldConnection;
}();

