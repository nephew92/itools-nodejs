// Last modification: 24-08-2018 01:17:30

/* Carrega as funções de manipulação do banco de dados, caso seja preferido utilizar ORM basta mudar as funções importadas aqui */
const model = require('../models/mysqlModel');

/* módulo que fornece a validação dos parâmetros da requisição HTTP */
const { check,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

/*
	Checa a validade do CPF
	from: http://www.receita.fazenda.gov.br/aplicacoes/atcta/cpf/funcoes.js
*/
function checkCPF(strCPF) {
	var Soma;
	var Resto;
	Soma = 0;
	if (strCPF == "00000000000"){
		return false;
	}
	for (i=1; i<=9; i++) {
		Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
	}
	Resto = (Soma * 10) % 11;
	if ((Resto == 10) || (Resto == 11)){
		Resto = 0;
	}
	if (Resto != parseInt(strCPF.substring(9, 10))){
		return false;
	}
	Soma = 0;
	for (i = 1; i <= 10; i++){
		Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
	}
	Resto = (Soma * 10) % 11;
	if ((Resto == 10) || (Resto == 11)){
		Resto = 0;
	}
	if (Resto != parseInt(strCPF.substring(10, 11) ) ){
		return false;
	}
	return true;
}

//Descontinuado
/*exports.updateCustomer = (req, res, next) => {
	model.updateCustomerAndPhones((result,err)=>{
		res.status(200).end(`Customer ${req.params.cid} updated`);
	},{cpf:req.params.cid,toUpdate:req.query})	
	// next();
};*/

exports.createCustomer = [
	/*funções de validação e sanitização implementadas */
	check('name')
		.isLength({ min: 1 }).withMessage("Name can't be empty.")
		// .trim().custom(value=>value.match(/[A-Za-z\s]/g).length == value.length)
    		// .withMessage('Name must be include just alphabet letters.')
    	,
    check('cpf').isLength({ min: 1 }).withMessage("CPF can't be empty.").trim()
    	.custom(checkCPF).withMessage('CPF is not valid')
    	,
    check('email').isLength({ min: 1 }).withMessage("E-mail can't be empty.").trim()
    	.isEmail().withMessage('This is not a valid e-mail')
    	,
    check('phones').custom(value=>JSON.parse(value).length>0).withMessage("It's neccessary at least one phone number")
    ,
    sanitizeBody('name').trim().escape(),
    sanitizeBody('email').trim().escape(),
    sanitizeBody('phones').trim().escape(),
    sanitizeBody('cpf').trim().escape()
    ,
	(req, res, next) => {
		//Veridfica se há erros nos parâmetros da requisição
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			//Se houverem erros restorna um objeto que contem os erros identificados
            res.status(201).send({result:req.query,errors:errors.array()});
            return;
        }
        else {
			//Senão, faz o CRUD no banco de dados
        	
        	req.query.phones = JSON.parse(req.query.phones);//como pode haver mais de um telefone por cliente é esperado que na requisição HTTP venha um parametro que passa um JSON contendo um array de telefones e tipos, aqui o JSON é carregado.

        	model.createOrUpdateCustomer((result,databaserror)=>{//Chama o método do modelo de dados, passando os dados para serem inseridos e um callback 
        		if (databaserror){//caso haja algum erro na query manda este erro
            		res.status(201).send({result:req.query,errors:[{msg:'Sorry, internal database error',param:'database'}]});
            		console.log(JSON.stringify(databaserror,null,2))
        		}else{
            		res.status(201).send({result:req.query});
        		}
        	},req.query)
		}
	}
]

// as demais funções são parecidas

exports.setCustomerState = (req, res, next) => {
	model.updateCustomerState((result,err)=>{
	    res.status(200).end(err?'0':'1');//1: Deu certo! 2: não deu!
	},{cpf:req.params.cid,state:req.query.state})
};
exports.deleteCustomer = (req, res, next) => {
	model.deleCustomersAndAllPhones((result,err)=>{
	    res.status(200).end(err?'0':'1');
	},[req.params.cid]); //este parâmetro é passado diretamente na URL, é sinônimo para :cid do arquivo customerRoute.js
};

exports.deleteCustomers = [
	check('cpfs').custom(value=>value.split(',').length>0).withMessage("It's neccessary at least one cpf to delete"),
	(req, res, next) => {
		model.deleCustomersAndAllPhones((result,err)=>{
		    res.status(200).end(err?'0':'1');
		},req.query.cpfs.split(','));//é esperado que os cpfs para serem apagados sejam separados por virgula
	}
];

exports.getCustomer = (req, res, next) => {
	model.getCustomerByCPF((result,err)=>{
		res.status(200).send(result);
	},req.params.cid);
};
exports.getCustomers = (req, res, next) => {
	model.getAllCustomersAndPhones((result,err)=>{
		res.status(200).send(result);
	});
	// next();
};
