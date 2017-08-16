const connection = require('./mysql.js')

module.exports.hello = {
    handler: function (request, reply) {
        // 判断用户类型

        let staffType = `SELECT cs.type type FROM counter_staff cs WHERE cs.id = '${request.payload.id}'`;
        connection.query(staffType, function (error, results, fields) {
            // var typea = results[0].type;
            var typea = 1;
            if (typea === 1) {
                var ss = [3, 2, 4, -2];
                let array = [];
                let parray = [];
                let all = `SELECT count(rla.id) amount ,rla.\`status\`,DATE(rla.apply_date) date FROM counter_application rla
                            WHERE
                            DATE(rla.apply_date) BETWEEN '${request.payload.startDay}' AND '${request.payload.endDay}'
                            GROUP BY DATE(rla.apply_date) HAVING rla.\`status\` NOT IN (0,1)`;
                parray.push(new Promise(function (resolve, reject) {
                    connection.query(all, function (error, results, fields) {
                        if (error) reject(error);
                        resolve(results);
                    });
                }).then(function (results) {
                    array.push(results);
                }).catch(function (error) {
                    console.error(error);
                }));
                //审批通过
                let accep = `SELECT count(rla.id) amount,DATE(rla.eod_date) date FROM riskcontrol_loaner_application rla
                                WHERE
                                rla.\`status\` = 6
                                AND DATE(rla.eod_date) BETWEEN '${request.payload.startDay}' AND '${request.payload.endDay}'
                                GROUP BY DATE(rla.eod_date);`;
                parray.push(new Promise(function (resolve, reject) {
                    connection.query(accep, function (error, results, fields) {
                        if (error) reject(error);
                        resolve(results);
                    });
                }).then(function (results) {
                    array.push(results);
                }).catch(function (error) {
                    console.error(error);
                }));
                //审批不通过
                let notaccep = `SELECT count(rla.id) amount,DATE(rla.lib_approval_date) date FROM riskcontrol_lib_application rla
                                    WHERE
                                    rla.\`status\` = 2
                                    AND DATE(rla.lib_approval_date) BETWEEN '${request.payload.startDay}' AND '${request.payload.endDay}'
                                    GROUP BY DATE(rla.lib_approval_date)`;
                parray.push(new Promise(function (resolve, reject) {
                    connection.query(notaccep, function (error, results, fields) {
                        if (error) reject(error);
                        resolve(results);
                    });
                }).then(function (results) {
                    array.push(results);
                }).catch(function (error) {
                    console.error(error);
                }));

                Promise.all(parray).then(function (scuess) {
                    return reply(array);
                });
            }
        });

    }
};

module.exports.restricted = {
    auth: 'jwt',
    handler: function (request, reply) {
        return reply({result: 'Restricted!'});
    }
};

module.exports.notFound = {
    handler: function (request, reply) {
        return reply({result: 'Oops, 404 Page!'}).code(404);
    }
};