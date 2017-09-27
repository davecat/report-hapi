const connection = require('./mysql.js');
const dateFns = require('date-fns');

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
                            AND rla.\`status\` NOT IN (0,1)
                            GROUP BY DATE(rla.apply_date)`;
                parray.push(new Promise(function (resolve, reject) {
                    connection.query(all, function (error, results, fields) {
                        if (error) reject(error);
                        resolve(results);
                    });
                }).then(function (results) {
                    //处理返回的数据
                    let weekStart1 = dateFns.format(request.payload.startDay,'YYYY-MM-DD');
                    let weekEnd1 = dateFns.format(request.payload.endDay,'YYYY-MM-DD');
                    let myArray = [];
                    let myMap = new Map();
                    results.forEach(item => {
                        myMap.set(dateFns.format(item.date,'YYYY-MM-DD'),item.amount)
                    });
                    while(weekStart1 < weekEnd1) {
                        if(myMap.get(weekStart1) === undefined) {
                            myArray.push(0);
                        } else {
                            myArray.push(myMap.get(weekStart1));
                        }
                        weekStart1 = dateFns.format(dateFns.addDays(weekStart1,1),'YYYY-MM-DD');
                    }
                    array.push(myArray);
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
                    //处理返回的数据
                    let weekStart1 = dateFns.format(request.payload.startDay,'YYYY-MM-DD');
                    let weekEnd1 = dateFns.format(request.payload.endDay,'YYYY-MM-DD');
                    let myArray = [];
                    let myMap = new Map();
                    results.forEach(item => {
                        myMap.set(dateFns.format(item.date,'YYYY-MM-DD'),item.amount)
                    });
                    while(weekStart1 < weekEnd1) {
                        if(myMap.get(weekStart1) === undefined) {
                            myArray.push(0);
                        } else {
                            myArray.push(myMap.get(weekStart1));
                        }
                        weekStart1 = dateFns.format(dateFns.addDays(weekStart1,1),'YYYY-MM-DD');
                    }
                    array.push(myArray);
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
                    //处理返回的数据
                    let weekStart1 = dateFns.format(request.payload.startDay,'YYYY-MM-DD');
                    let weekEnd1 = dateFns.format(request.payload.endDay,'YYYY-MM-DD');
                    let myArray = [];
                    let myMap = new Map();
                    results.forEach(item => {
                        myMap.set(dateFns.format(item.date,'YYYY-MM-DD'),item.amount)
                    });
                    while(weekStart1 < weekEnd1) {
                        if(myMap.get(weekStart1) === undefined) {
                            myArray.push(0);
                        } else {
                            myArray.push(myMap.get(weekStart1));
                        }
                        weekStart1 = dateFns.format(dateFns.addDays(weekStart1,1),'YYYY-MM-DD');
                    }
                    array.push(myArray);
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
        //门店查询
        let store = `SELECT count(ca.contract_no) value,SUM(ca.total_amount) total,ca.province,ca.city,ca.responsible_branch FROM postlending_contract ca 
                        WHERE
                        DATE(ca.created_date) BETWEEN '${request.payload.startDay}' AND '${request.payload.endDay}'
                        GROUP BY ca.branch_id`;
        parray.push(new Promise(function (resolve, reject) {
            connection.query(store, function (error, results, fields) {
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

// 经纪人端报表
//今日新增、本周新增、本月新增
module.exports.agencyAmount = {
    handler: function (request, reply) {
        let dataObj = {};
        let totalAmount = `SELECT SUM(ca.total_amount) AS totalAmount FROM \`counter_request\` ca
                            WHERE ca.\`status\` IN(1,2,3,4,-2)
                            AND DATE(ca.apply_date) BETWEEN '${request.payload.startDay}'
                            AND '${request.payload.endDay}'`;
        let a = new Promise(function (resolve, reject) {
            connection.query(totalAmount, function (error, results, fields) {
                if (error) reject(error);
                resolve(results);
            });
        });
        a.then(function (item) {
            let totalItems = `SELECT count(ca.id) amount FROM \`counter_request\` ca 
                    WHERE
		            ca.\`status\` IN (1,2,3,4,-2)
		            AND DATE(ca.apply_date) BETWEEN '${request.payload.startDay}'
                    AND '${request.payload.endDay}'`;
            connection.query(totalItems, function (error, results, fields) {
                if (error) throw error;
                dataObj.totalAmount = item[0].totalAmount;
                dataObj.billAmount = results[0].amount;
                return reply(dataObj);
            });
        });
    }
};
//申请总数
module.exports.agencyTotalAmount = {
    handler: function (request, reply) {
        let dataObj = {};
        let totalAmount = `SELECT count(ca.id) amount FROM \`counter_request\` ca 
                    WHERE ca.\`status\` IN (1,2,3,4,-2);`;
        let a = new Promise(function (resolve, reject) {
            connection.query(totalAmount, function (error, results, fields) {
                if (error) reject(error);
                resolve(results);
            });
        });
        a.then(function (item) {
            let totalItems = `SELECT count(ca.id) amount,ca.\`status\` FROM \`counter_request\` ca 
                    WHERE
		            ca.\`status\` IN (1,2,3,4,-2)
                    GROUP BY ca.\`status\``;
            connection.query(totalItems, function (error, results, fields) {
                if (error) throw error;
                dataObj.totalAmount = item[0].amount;
                results.forEach(a => {
                    //待审核
                    if(a.status === 2) {
                        dataObj.pendingAmount=a.amount
                    } else {
                        dataObj.pendingAmount=0
                    }
                    //审核不通过
                    if(a.status === -2) {
                        dataObj.notPendingAmount=a.amount
                    } else {
                        dataObj.pendingAmount=0
                    }
                });
                return reply(dataObj);
            });
        });
    }
};
//line
module.exports.getLine = {
    handler: function (request, reply) {
        // 判断用户类型

        let staffType = `SELECT cs.type type FROM counter_staff cs WHERE cs.id = '${request.payload.id}'`;
        connection.query(staffType, function (error, results, fields) {
            // var typea = results[0].type;
            var typea = 1;
            if (typea === 1) {
                let array = [];
                let parray = [];
                let all = `SELECT count(rla.id) amount ,rla.\`status\`,DATE(rla.apply_date) date FROM counter_request rla
                            WHERE
                            DATE(rla.apply_date) BETWEEN '${request.payload.startDay}' AND '${request.payload.endDay}'
                            AND rla.\`status\` IN (1,2,3,4,-2)
                            GROUP BY DATE(rla.apply_date)`;
                parray.push(new Promise(function (resolve, reject) {
                    connection.query(all, function (error, results, fields) {
                        if (error) reject(error);
                        resolve(results);
                    });
                }).then(function (results) {
                    //处理返回的数据
                    let weekStart1 = dateFns.format(request.payload.startDay,'YYYY-MM-DD');
                    let weekEnd1 = dateFns.format(request.payload.endDay,'YYYY-MM-DD');
                    let myArray = [];
                    let myMap = new Map();
                    results.forEach(item => {
                        myMap.set(dateFns.format(item.date,'YYYY-MM-DD'),item.amount)
                    });
                    while(weekStart1 < weekEnd1) {
                        if(myMap.get(weekStart1) === undefined) {
                            myArray.push(0);
                        } else {
                            myArray.push(myMap.get(weekStart1));
                        }
                        weekStart1 = dateFns.format(dateFns.addDays(weekStart1,1),'YYYY-MM-DD');
                    }
                    array.push(myArray);
                }).catch(function (error) {
                    console.error(error);
                }));
                //审批通过
                let accep = `SELECT count(rla.id) amount,DATE(rla.apply_date) date FROM counter_request rla
                                WHERE
                                rla.\`status\` = 2
                                AND DATE(rla.apply_date) BETWEEN '${request.payload.startDay}' AND '${request.payload.endDay}'
                                GROUP BY DATE(rla.apply_date);`;
                parray.push(new Promise(function (resolve, reject) {
                    connection.query(accep, function (error, results, fields) {
                        if (error) reject(error);
                        resolve(results);
                    });
                }).then(function (results) {
                    //处理返回的数据
                    let weekStart1 = dateFns.format(request.payload.startDay,'YYYY-MM-DD');
                    let weekEnd1 = dateFns.format(request.payload.endDay,'YYYY-MM-DD');
                    let myArray = [];
                    let myMap = new Map();
                    results.forEach(item => {
                        myMap.set(dateFns.format(item.date,'YYYY-MM-DD'),item.amount)
                    });
                    while(weekStart1 < weekEnd1) {
                        if(myMap.get(weekStart1) === undefined) {
                            myArray.push(0);
                        } else {
                            myArray.push(myMap.get(weekStart1));
                        }
                        weekStart1 = dateFns.format(dateFns.addDays(weekStart1,1),'YYYY-MM-DD');
                    }
                    array.push(myArray);
                }).catch(function (error) {
                    console.error(error);
                }));
                //审批不通过
                let notaccep = `SELECT count(rla.id) amount,DATE(rla.apply_date) date FROM counter_request rla
                                    WHERE
                                    rla.\`status\` = -2
                                    AND DATE(rla.apply_date) BETWEEN '${request.payload.startDay}' AND '${request.payload.endDay}'
                                    GROUP BY DATE(rla.apply_date)`;
                parray.push(new Promise(function (resolve, reject) {
                    connection.query(notaccep, function (error, results, fields) {
                        if (error) reject(error);
                        resolve(results);
                    });
                }).then(function (results) {
                    //处理返回的数据
                    let weekStart1 = dateFns.format(request.payload.startDay,'YYYY-MM-DD');
                    let weekEnd1 = dateFns.format(request.payload.endDay,'YYYY-MM-DD');
                    let myArray = [];
                    let myMap = new Map();
                    results.forEach(item => {
                        myMap.set(dateFns.format(item.date,'YYYY-MM-DD'),item.amount)
                    });
                    while(weekStart1 < weekEnd1) {
                        if(myMap.get(weekStart1) === undefined) {
                            myArray.push(0);
                        } else {
                            myArray.push(myMap.get(weekStart1));
                        }
                        weekStart1 = dateFns.format(dateFns.addDays(weekStart1,1),'YYYY-MM-DD');
                    }
                    array.push(myArray);
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
//map
module.exports.getMap = {
    handler: function (request, reply) {
        let array = [];
        let parray = [];
        let all = `SELECT count(ca.contract_no) value,SUM(ca.total_amount) total,ca.province FROM counter_request ca 
                    WHERE
                    DATE(ca.apply_date) BETWEEN '${request.payload.startDay}' AND '${request.payload.endDay}'
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
        //门店查询
        let store = `SELECT count(ca.contract_no) value,SUM(ca.total_amount) total,ca.province,ca.city,ca.responsible_branch FROM counter_request ca 
                        WHERE
                        DATE(ca.created_date) BETWEEN '${request.payload.startDay}' AND '${request.payload.endDay}'
                        GROUP BY ca.branch_id`;
        parray.push(new Promise(function (resolve, reject) {
            connection.query(store, function (error, results, fields) {
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




module.exports.notFound = {
    handler: function (request, reply) {
        return reply({result: 'Oops, 404 Page!'}).code(404);
    }
};