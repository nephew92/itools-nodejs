// Last modification: 23-08-2018 18:27:37
/* este arquivo pode ser substituido caso queira mudar o SGBD ou utilizar um ORM, basta reescrever as funções atribuidas ao 'exports' */

/* carrega o MySQL connector */
const mysql = require('mysql');

/* carrega as cofigurações locais do banco */
var settings = require('../configs');

/* Inicia a conexão com o banco */
const con = mysql.createConnection(settings.db);
con.connect(function(err) {
  if (err) throw err;
  console.log("Database connected!");
});

/* Funções e constantes utilizadas somente neste script */
String.prototype.format = function(o){//Função que formata uma string similarmente ao str.format do python, o argumento pode ser um objeto ou um array
	var r = this;
	Object.keys(o).forEach(d=>{
    	r = r.replace(`{${d}}`,o[d])
	})
	return r
	}
function queryDatabase(query,callback){ //Esta função global faz as queries no banco, requer um string contendo o SQL e um calback que é chamado ao final da execução da query
	console.log(query)
	con.query(query, function (err, result, fields) {
		callback(result,err); //sempre retorna o resultado (caso seja uma seleção) e o erro (caso haja)
	});
	}
const QUERIES = { //Constante incluindo todos as queries disponíveis, as SQL com {} serão formatadas antes de seram executadas
	allCustomers: "SELECT c.*,p.phones FROM customer c left join (SELECT customer_cpf,GROUP_CONCAT(type,':',phone_number) phones from phone group by customer_cpf) p on c.cpf=p.customer_cpf where c.cpf=p.customer_cpf",
	// insertCustomer: "INSERT INTO customer (cpf,name,email,state) VALUES ('{cpf}','{name}','{email}','{state}')", //Não Utilizado
	insertPhoneNumber: "INSERT INTO phone (customer_cpf,phone_number,type) VALUES {0} ON DUPLICATE KEY UPDATE `type`=values(`type`);",
	insertUpdating:"INSERT INTO customer (cpf,name,email,state) VALUES ({cpf}, '{name}', '{email}', '{state}') ON DUPLICATE KEY UPDATE  name=values(name), email=values(email), state=values(state);",
	deleteCustomerByCPF:"DELETE FROM customer WHERE {cpfs};",
	deleteAllPhonesByCPF:"DELETE FROM phone WHERE {cpfs};",
	updateCustomerState:"UPDATE customer SET state = '{state}' WHERE cpf = '{cpf}';"
	};

exports.createOrUpdateCustomer = (callback,data) =>{
	queryDatabase(
		QUERIES.insertUpdating.format(data),//Aqui a query é formatada com os valores passados na chamada do método
		function(result,err){
			if(err){
				callback(result,err);
			}else{//Se não houver nenhum erro na inserção/atualização do cliente, os respectivos telefones serão inseridos/atualizados
				queryDatabase(
					QUERIES.insertPhoneNumber.format([data.phones.map(d=>`('${data.cpf}','${d.phone}','${d.type}')`).join(',')]),//Como pode haver mais de um telefone por cliente, aqui eles são incluidos em uma única query
					function(result,err){ //o mesmo que passar o callback diretamente
						callback(result,err);
					})
			}
		})
	}

/* As demais funções são similares */

exports.updateCustomerState = (callback,data) => {
	queryDatabase(
		QUERIES.updateCustomerState.format(data),
		function(result,err){
			callback(result,err);
		})
	}

/*exports.updateCustomerAndPhones = (callback,data)=>{ //Desnecessário

	}*/

exports.deleCustomersAndAllPhones = (callback,cpfs)=>{
	queryDatabase(
		QUERIES.deleteCustomerByCPF.format({cpfs:cpfs.map(cpf=>`cpf='${cpf}'`).join(' OR ')}),				//Como pode ser deletado um ou mais clientes por requisição, aqui todos os CPFs são concatenados em uma única query. De modo similar serã apagados os telefones
		(result,err)=>{
			queryDatabase(
				QUERIES.deleteAllPhonesByCPF.format({cpfs:cpfs.map(cpf=>`customer_cpf='${cpf}'`).join(' OR ')}),
				(result,err)=>{
					callback(result,err);
				});
			}
		);
	}

exports.getCustomerByCPF = (callback,cpf)=>{
	queryDatabase(
		`${QUERIES.allCustomers} and cpf='${cpf}'`,
		function(result,err){
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