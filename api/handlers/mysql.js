/**
 * Created by dave on 17/8/10.
 */
var mysql= require('mysql');
module.exports = function() {
  var connection = mysql.createConnection({
    host: 'rm-2ze0v70uggy83t5ago.mysql.rds.aliyuncs.com',
    user: 'lib',
    password: 'lib88888',
    database: 'lib'
  });

  connection.connect();
  return connection;
}();

