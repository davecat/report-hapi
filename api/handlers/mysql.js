/**
 * Created by dave on 17/8/10.
 */
var mysql= require('mysql');
module.exports = function() {
  var connection = mysql.createConnection({
    host: 'rm-2ze92s92qz4d0jr18.mysql.rds.aliyuncs.com',
    user: 'lib',
    password: 'lib88888',
    database: 'counter'
  });

  connection.connect();
  return connection;
}();

