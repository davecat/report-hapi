/**
 * Created by dave on 17/8/10.
 */
var mysql = require('mysql');

module.exports.management = function () {
    var connection = mysql.createPool({
        connectionLimit: 10,
        host: 'rm-2zehe086blavu68a2o.mysql.rds.aliyuncs.com',
        user: 'lib',
        password: 'lib88888',
        database: 'instanment'
    });
    return connection;
}();

//老平台数据源
module.exports.vkits = function () {
    var oldConnection = mysql.createPool({
        connectionLimit: 10,
        host: 'rm-2zehe086blavu68a2o.mysql.rds.aliyuncs.com',
        user: 'lib',
        password: 'lib88888',
        database: 'lib'
    });
    return oldConnection;
}();

module.exports.guozheng = function () {
    var oldConnection = mysql.createPool({
        connectionLimit: 10,
        host:'rm-2zehe086blavu68a2o.mysql.rds.aliyuncs.com',
        user:'lib',
        password:'lib88888',
        database:'instanment'
    });
    return oldConnection;
}();
/**
 * 快速配置APP版本在这里~
 * @type {string}
 */
module.exports.APPVERSION = 102;