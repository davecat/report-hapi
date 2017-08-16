const connection = require('./mysql.js')

module.exports.hello = {
    handler: function (request, reply) {
        // 判断用户类型

        let staffType = `SELECT cs.type type FROM counter_staff cs WHERE cs.id = '${request.payload.id}'`;
        connection.query(staffType, function (error, results, fields) {
            // var typea = results[0].type;
            var typea = 1;
            if (typea === 1) {
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
    handler: function (request, reply) {
        let array = [];
        let parray = [];
        let all = `SELECT count(ca.contract_no) value,SUM(ca.total_amount) total,ca.province FROM postlending_contract ca 
                    WHERE
                    DATE(ca.created_date) BETWEEN '${request.payload.startDay}' AND '${request.payload.endDay}'
                    GROUP BY ca.province`;
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


        Promise.all(parray).then(function (scuess) {
            return reply(array);
        });
    }
};

module.exports.details = {
    handler: function (request, reply) {
        let dataObj = {};
        let mapDetail = `SELECT * FROM postlending_contract pc
                    WHERE
                    pc.province = '${request.payload.province}'
                    AND DATE(pc.created_date) BETWEEN '${request.payload.startDay}' AND '${request.payload.endDay}'
                    LIMIT ${request.payload.page},${request.payload.size}`;
        let a = new Promise(function (resolve, reject) {
            connection.query(mapDetail, function (error, results, fields) {
                if (error) reject(error);
                resolve(results);
            });
        });
        a.then(function (item) {
            let totalItems = `SELECT FOUND_ROWS() totalItems`;
            connection.query(totalItems, function (error, results, fields) {
                if (error) throw error;
                dataObj.detail = item;
                dataObj.totalItems = results[0].totalItems;
                return reply(dataObj);
            });
        });
    }
};

module.exports.notFound = {
    handler: function (request, reply) {
        return reply({result: 'Oops, 404 Page!'}).code(404);
    }
};