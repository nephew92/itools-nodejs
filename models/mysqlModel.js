// Last modification: 23-08-2018 16:33:41

const mysql = require('mysql');
var settings = require('../configs');


const con = mysql.createConnection(settings.db);

con.connect(function(err) {
  if (err) throw err;
  console.log("Database connected!");
});

String.prototype.format = function(o){
	var r = this;
	Object.keys(o).forEach(d=>{
    	r = r.replace(`{${d}}`,o[d])
	})
	return r
}

function queryDatabase(query,callback){
	console.log(query)
	con.query(query, function (err, result, fields) {
		callback(result,err);
	});
}

const QUERIES = {
	allCustomers: "SELECT c.*,p.phones FROM customer c left join (SELECT customer_cpf,GROUP_CONCAT(type,':',phone_number) phones from phone group by customer_cpf) p on c.cpf=p.customer_cpf where c.cpf=p.customer_cpf",
	insertCustomer: "INSERT INTO customer (cpf,name,email,state) VALUES ('{cpf}','{name}','{email}','{state}')",
	insertPhoneNumber: "INSERT INTO phone (customer_cpf,phone_number,type) VALUES {0} ON DUPLICATE KEY UPDATE `type`=values(`type`);",
	insertUpdating:"INSERT INTO customer (cpf,name,email,state) VALUES ({cpf}, '{name}', '{email}', '{state}') ON DUPLICATE KEY UPDATE  name=values(name), email=values(email), state=values(state);",
	deleteCustomerByCPF:"DELETE FROM customer WHERE {cpfs};",
	deleteAllPhonesByCPF:"DELETE FROM phone WHERE {cpfs};",
	updateCustomerState:"UPDATE customer SET state = '{state}' WHERE cpf = '{cpf}';"
};

exports.createOrUpdateCustomer = (callback,data) =>{
	queryDatabase(QUERIES.insertUpdating.format(data),function(result,err){
		queryDatabase(QUERIES.insertPhoneNumber.format([data.phones.map(d=>`('${data.cpf}','${d.phone}','${d.type}')`).join(',')]),function(result,err){
			callback(result,err);
		})
	})
}
exports.updateCustomerState = (callback,data) => {
	queryDatabase(QUERIES.updateCustomerState.format(data),function(result,err){
		callback(result,err);
	})
}
/*exports.updateCustomerAndPhones = (callback,data)=>{

}*/

exports.deleCustomersAndAllPhones = (callback,cpfs)=>{
	queryDatabase(QUERIES.deleteCustomerByCPF.format({cpfs:cpfs.map(cpf=>`cpf='${cpf}'`).join(' OR ')}),(result,err)=>{
		queryDatabase(QUERIES.deleteAllPhonesByCPF.format({cpfs:cpfs.map(cpf=>`customer_cpf='${cpf}'`).join(' OR ')}),(result,err)=>{
			callback(result,err);
		});
	});
	
}

exports.getCustomerByCPF = (callback,cpf)=>{
	queryDatabase(`${QUERIES.allCustomers} and cpf='${cpf}'`,function(result,err){
		//Data Manipulation
		callback(result,err);
	});
}
exports.getAllCustomersAndPhones = (callback)=>{
	queryDatabase(QUERIES.allCustomers,function(result,err){
		//Data Manipulation
		result.forEach(d=>{
			d.phones = d.phones.split(',').map(c=>c.split(':'))
		});
		callback(result,err);
	});
}