// Last modification: 23-08-2018 12:01:56

/*
	// var models = require('../models/models')
	var Sequelize = require('sequelize');

	var sequelize = new Sequelize('itools', 'francisco', '5172', {
	    host: 'localhost',
	    port: 3306,
	    dialect: 'mysql'
	});

	sequelize.authenticate().then(function (err) {
	 if (err) {
	    console.log('There is connection in ERROR');
	 } else {
	    console.log('Connection has been established successfully');
		var Phone = sequelize.define('phone', {
		    customer_cpf: {
		      type: Sequelize.STRING(11),
		      allowNull: false,
		      primaryKey: true,
		      references: {
		        model: 'customer',
		        key: 'cpf'
		      }
		    },
		    phone_number: {
		      type: Sequelize.STRING(12),
		      allowNull: false,
		      primaryKey: true
		    },
		    // Timestamps
	      createdAt: Sequelize.DATE,
	      updatedAt: Sequelize.DATE,
		  }, {
		    tableName: 'phone'
		});
		var Customer = sequelize.define('customer', {
		    cpf: {
		      type: Sequelize.STRING(11),
		      allowNull: false,
		      primaryKey: true
		    },
		    name: {
		      type: Sequelize.STRING(150),
		      allowNull: false
		    },
		    email: {
		      type: Sequelize.STRING(100),
		      allowNull: false
		    },
		    state: {
		      type: Sequelize.STRING(1),
		      allowNull: false
		    },
		    // Timestamps
	      createdAt: Sequelize.DATE,
	      updatedAt: Sequelize.DATE,
		  }, {
		    tableName: 'customer'
		  });
		
		Customer.sync().then(function () {
		    console.log('Connection has been sync');
			Customer.findAll().then(users => {
			  console.log(users[0])
			})
		});
	}
	});
*/

const mysql = require('mysql');

const con = mysql.createConnection({
  host: "localhost",
  user: "francisco",
  password: "5172",
  database: "titools"
});

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
	updateCustomerState:"UPDATE titools.customer SET state = '{state}' WHERE cpf = '{cpf}';"
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