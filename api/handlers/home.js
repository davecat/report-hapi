const mysql = require('./mysql.js');
const dateFns = require('date-fns');
const citys = require('../../static/city.json');
module.exports.hello = {
    handler: function (request, reply) {
        // 判断用户类型

        let staffType = `SELECT cs.type type FROM counter_staff cs WHERE cs.id = '${request.payload.id}'`;
        mysql.vkits.query(staffType, function (error, results, fields) {
            // var typea = results[0].type;
            var typea = 1;
            if (typea === 1) {
                let array = [];
                let parray = [];
                let all = `SELECT count(rla.id) amount ,rla.\`status\`,DATE(rla.apply_date) date FROM riskcontrol_lib_application rla
                            WHERE
                            DATE(rla.apply_date) BETWEEN '${request.payload.startDay}' AND '${request.payload.endDay}'
                            AND rla.\`status\` NOT IN (0,1)
                            GROUP BY DATE(rla.apply_date)`;
                parray.push(new Promise(function (resolve, reject) {
                    mysql.vkits.query(all, function (error, results, fields) {
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
                    mysql.vkits.query(accep, function (error, results, fields) {
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
                    mysql.vkits.query(notaccep, function (error, results, fields) {
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
            mysql.vkits.query(all, function (error, results, fields) {
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
            mysql.vkits.query(store, function (error, results, fields) {
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
            mysql.vkits.query(mapDetail, function (error, results, fields) {
                if (error) reject(error);
                resolve(results);
            });
        });
        a.then(function (item) {
            let totalItems = `SELECT FOUND_ROWS() totalItems`;
            mysql.vkits.query(totalItems, function (error, results, fields) {
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
                            WHERE ca.\`status\` NOT IN(0,-1,-2,19)
                            AND DATE(ca.apply_date) BETWEEN '${request.payload.startDay}'
                            AND '${request.payload.endDay}'`;
        let a = new Promise(function (resolve, reject) {
            mysql.management.query(totalAmount, function (error, results, fields) {
                if (error) reject(error);
                resolve(results);
            });
        });
        a.then(function (item) {
            let totalItems = `SELECT count(ca.id) amount FROM \`counter_request\` ca 
                    WHERE
		            ca.\`status\` NOT IN (0,-1,-2,19)
		            AND DATE(ca.apply_date) BETWEEN '${request.payload.startDay}'
                    AND '${request.payload.endDay}'`;
            mysql.management.query(totalItems, function (error, results, fields) {
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
                    WHERE ca.\`status\` NOT IN (0,-1,-2,19);`;
        let a = new Promise(function (resolve, reject) {
            mysql.management.query(totalAmount, function (error, results, fields) {
                if (error) reject(error);
                resolve(results);
            });
        });
        a.then(function (item) {
            let totalItems = `SELECT count(ca.id) amount,ca.\`status\` FROM \`counter_request\` ca 
                    WHERE
		            ca.\`status\` NOT IN (0,-1,-2,19)
                    GROUP BY ca.\`status\``;
            mysql.management.query(totalItems, function (error, results, fields) {
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
        mysql.management.query(staffType, function (error, results, fields) {
            // var typea = results[0].type;
            var typea = 1;
            if (typea === 1) {
                let array = [];
                let parray = [];
                let all = `SELECT count(rla.id) amount ,rla.\`status\`,DATE(rla.apply_date) date FROM counter_request rla
                            WHERE
                            DATE(rla.apply_date) BETWEEN '${request.payload.startDay}' AND '${request.payload.endDay}'
                            AND rla.\`status\` NOT IN (0,-1,-2,19)
                            GROUP BY DATE(rla.apply_date)`;
                parray.push(new Promise(function (resolve, reject) {
                    mysql.management.query(all, function (error, results, fields) {
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
                                rla.\`status\` >= 10
                                AND DATE(rla.apply_date) BETWEEN '${request.payload.startDay}' AND '${request.payload.endDay}'
                                GROUP BY DATE(rla.apply_date);`;
                parray.push(new Promise(function (resolve, reject) {
                    mysql.management.query(accep, function (error, results, fields) {
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
                    mysql.management.query(notaccep, function (error, results, fields) {
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
        let all = `SELECT count(ca.application_no) value,SUM(ca.total_amount) total,b.province FROM counter_request ca,counter_branch b 
                    WHERE
                    DATE(ca.apply_date) BETWEEN '${request.payload.startDay}' AND '${request.payload.endDay}' AND
                    ca.status NOT IN(0,-1,-2,19) AND ca.branch_id = b.id
                    GROUP BY b.province ORDER BY value desc`;
        parray.push(new Promise(function (resolve, reject) {
            mysql.management.query(all, function (error, results, fields) {
                if (error) reject(error);
                resolve(results);
            });
        }).then(function (results) {
            array.push(results);
        }).catch(function (error) {
            console.error(error);
        }));
        //门店查询
        let store = `SELECT count(ca.application_no) value,SUM(ca.total_amount) total,b.province,b.city,b.name as responsible_branch FROM counter_request ca,counter_branch b
                        WHERE
                        DATE(ca.created_date) BETWEEN '${request.payload.startDay}' AND '${request.payload.endDay}' AND
                        ca.status NOT IN(0,-1,-2,19) AND ca.branch_id = b.id
                        GROUP BY ca.branch_id ORDER BY value desc`;
        parray.push(new Promise(function (resolve, reject) {
            mysql.management.query(store, function (error, results, fields) {
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


//APP报表
//今日新增、本周新增、本月新增
module.exports.appAmount = {
    handler: function (request, reply) {
        let totalItems;
        if(request.payload.branchId.length > 0) {
            let str = '';
            request.payload.branchId.forEach(function (item) {
                str += `'${item}',`
            });
            str = str.substr(0,str.length-1);
            totalItems = `SELECT SUM(ca.total_amount) AS totalAmount,count(ca.id) AS amount FROM \`counter_request\` ca
                            WHERE ca.\`status\` NOT IN(0,-1,-2,19)
                            AND DATE(ca.apply_date) BETWEEN '${request.payload.startDay}' AND '${request.payload.endDay}'
                            AND ca.branch_id in (${str})`;
        } else {
            totalItems = `SELECT SUM(ca.total_amount) AS totalAmount,count(ca.id) AS amount FROM \`counter_request\` ca
                            WHERE ca.\`status\` NOT IN(0,-1,-2,19)
                            AND DATE(ca.apply_date) BETWEEN '${request.payload.startDay}' AND '${request.payload.endDay}'
                            AND ca.agent_id = '${request.payload.agentId}'`;
        }
        mysql.management.query(totalItems, function (error, results, fields) {
            if (error) throw error;
            return reply(results[0]);
        });
    }
};
//获取版本号
module.exports.appVersion = {
    handler: function (request, reply) {
        if(request.payload.appKey >= mysql.APPVERSION) {
            return reply({versionNo: 'http://testbk.wezebra.com/'});
        } else {
            return reply({versionNo: 'https://a.libfintech.com/'});
        }
    }
};



module.exports.notFound = {
    handler: function (request, reply) {
        return reply({result: 'Oops, 404 Page!'}).code(404);
    }
};

/**
 * guozheng 报表 app
 * @type {{handler: exports.getTotalAmountByDate.handler}}
 */
module.exports.getTotalAmountByDate = {
    handler: function (request, reply) {

        //console.log(citys);

        let parray = [];
        let object={
            totalAccount:'',
            totalAccountAndbillTotal:'',
            orderbycity:'',
            orderbybranch:'',
            flag:''
        };
        // const startDate = new Date(2017, 3, 27); // (April 27, 2017)
        // const endDate = new Date(2018, 3, 27); // (April 27, 2018)
        let sql;
        let datasub=dateFns.differenceInDays(request.payload.enddate,request.payload.startdate);
        if(datasub <= 31){
             sql = `SELECT sum(total_amount) as totalAmount,count(application_no) as orderNumber,DATE_FORMAT(created_date,'%Y-%m-%d') as startDate from datacleansing_data_warehouse
             where  status not in(0,-1,-2,19) AND  created_date BETWEEN '${request.payload.startdate} ' AND ' ${request.payload.enddate} 23:59:59' GROUP BY DATE_FORMAT(created_date,'%Y-%m-%d') 
             ORDER BY  DATE_FORMAT(created_date,'%Y-%m-%d')`;

             object.flag='days';
        }else if(datasub <= 80){
            sql = `SELECT sum(total_amount) AS totalAmount,
	count(application_no) as orderNumber,
	subdate(
		DATE_FORMAT(created_date, '%Y-%m-%d'),

	IF (
		date_format(
			DATE_FORMAT(created_date, '%Y-%m-%d'),
			'%w'
		) = 0,
		7,
		date_format(
			DATE_FORMAT(created_date, '%Y-%m-%d'),
			'%w'
		)
	) - 1
	) AS startDate,
	DATE_ADD(
	subdate(
		DATE_FORMAT(created_date, '%Y-%m-%d'),

	IF (
		date_format(
			DATE_FORMAT(created_date, '%Y-%m-%d'),
			'%w'
		) = 0,
		7,
		date_format(
			DATE_FORMAT(created_date, '%Y-%m-%d'),
			'%w'
		)
	) - 1
	),
		INTERVAL 6 DAY
	) AS  endDate
FROM
	datacleansing_data_warehouse
WHERE  status not in(0,-1,-2,19) AND
	created_date BETWEEN '${request.payload.startdate}'
AND ' ${request.payload.enddate} 23:59:59'
GROUP BY
	DATE_FORMAT(created_date, '%Y%u') ORDER BY DATE_FORMAT(created_date, '%Y%u')`;
            object.flag='weeks';
        }else {
            sql = `SELECT
	sum(total_amount) AS totalAmount,
	count(application_no) as orderNumber,
	CONCAT(DATE_FORMAT(created_date, '%Y-%m'),'-','01') AS startDate
FROM
	datacleansing_data_warehouse
WHERE status not in(0,-1,-2,19) AND
	created_date BETWEEN '${request.payload.startdate} '
AND ' ${request.payload.enddate} 23:59:59'
GROUP BY
	DATE_FORMAT(created_date, '%Y%M') ORDER BY DATE_FORMAT(created_date, '%Y-%m')`;
            object.flag = 'months';
        }

        parray.push(new Promise(function (resolve,reject) {
            mysql.guozheng.query(sql, function (error, results, fields) {
                if (error) throw reject(error);
                resolve(results);
            });
        }).then(function (results) {
            object.totalAccount=results;
        }).catch(function (error) {
            console.log(error)
        }));


        let sql1=`SELECT sum(total_amount) as totalAmount,count(application_no) as orderNumber FROM datacleansing_data_warehouse WHERE
	status not in(0,-1,-2,19) AND created_date BETWEEN '${request.payload.startdate} ' AND ' ${request.payload.enddate} 23:59:59'`;

        parray.push(new Promise(function (resolve,reject) {
            mysql.guozheng.query(sql1, function (error, results, fields) {
                if (error) throw reject(error);
                resolve(results);
            });
        }).then(function (results) {
            object.totalAccountAndbillTotal=results;
        }).catch(function (error) {
            console.log(error)
        }));


        let sql2=`SELECT
	sum(a.total_amount) AS totalAmount,
	count(a.application_no) AS orderNumber,
	CONCAT(
		ROUND(
			count(a.application_no)* 100 / (
				SELECT
				count(c.application_no)
				FROM
					counter_request c WHERE c.status not in(0,-1,-2,19) AND c.created_date  BETWEEN '${request.payload.startdate}' AND '${request.payload.enddate}'
			),
			2
		),
		'%'
	) AS percentage,
	b.city as name
FROM
	counter_request a,counter_branch b
WHERE
 a.status not in(0,-1,-2,19) AND
  a.created_date BETWEEN '${request.payload.startdate}' AND '${request.payload.enddate}'
AND a.branch_id = b.id
GROUP BY
	b.city
ORDER BY
 orderNumber desc`;
        parray.push(new Promise(function (resolve,reject) {
            mysql.guozheng.query(sql2, function (error, results, fields) {
                if (error) throw reject(error);
                resolve(results);
            });
        }).then(function (results) {
            citys.forEach(function (obj) {
                if(obj.children) {
                    obj.children.forEach(function (city) {
                        if(results.length !== 0) {
                            results.forEach(function (item) {
                                if(item.name === city.value) {
                                    item.name = city.label
                                }
                            })
                        }
                    })
                }
            });
            object.orderbycity=results;
        }).catch(function (error) {
            console.log(error)
        }));

        let sql3=`SELECT
	a.branch_name AS name,
	sum(a.total_amount) AS totalAmount,
	count(a.application_no) AS orderNumber,
	CONCAT(
		ROUND(
			count(a.application_no)* 100 / (
				SELECT
				count(c.application_no)
				FROM
					datacleansing_data_warehouse c WHERE a.status not in(0,-1,-2,19) AND c.created_date BETWEEN '${request.payload.startdate} '
AND ' ${request.payload.enddate} 23:59:59'
			),
			2
		),
		'%'
	) AS percentage
FROM
	datacleansing_data_warehouse a
WHERE
    a.status not in(0,-1,-2,19) AND
  a.created_date BETWEEN '${request.payload.startdate} '
AND ' ${request.payload.enddate} 23:59:59'
GROUP BY
	a.branch_name
ORDER BY
 orderNumber desc`;
        parray.push(new Promise(function (resolve,reject) {
            mysql.guozheng.query(sql3, function (error, results, fields) {
                if (error) throw reject(error);
                resolve(results);
            });
        }).then(function (results) {
            object.orderbybranch=results;
        }).catch(function (error) {
            console.log(error)
        }));

        Promise.all(parray).then(function (scuess) {
            return reply(object);
        });
    }
};

module.exports.ss = {

}