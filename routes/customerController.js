// Last modification: 23-08-2018 12:01:30

const model = require('../models/mysqlModel');
const { check,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

function checkCPF(strCPF) {
	/*
		from: http://www.receita.fazenda.gov.br/aplicacoes/atcta/cpf/funcoes.js
	*/
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

exports.updateCustomer = (req, res, next) => {
	model.updateCustomerAndPhones((result,err)=>{
		res.status(200).end(`Customer ${req.params.cid} updated`);
	},{cpf:req.params.cid,toUpdate:req.query})	
	// next();
};

exports.createCustomer = [
	check('name')
		.isLength({ min: 1 }).withMessage("Name can't be empty.")
		// .trim().custom(value=>value.match(/[A-Za-z\s]/g).length == value.length)
    		// .withMessage('Name must be include just alphabet letters.')
    	,
    check('cpf').isLength({ min: 1 }).withMessage("CPF can't be empty.").trim()
    	.custom(checkCPF).withMessage('CPF is not valid'),
    check('email').isLength({ min: 1 }).withMessage("E-mail can't be empty.").trim()
    	.isEmail().withMessage('This is not a valid e-mail'),
    check('phones').custom(value=>JSON.parse(value).length>0).withMessage("It's neccessary at least one phone number"),

    sanitizeBody('name').trim().escape(),
    sanitizeBody('email').trim().escape(),
    sanitizeBody('phones').trim().escape(),
    sanitizeBody('cpf').trim().escape(),
	// body('age', 'Invalid age')
		// .optional({ checkFalsy: true })
		// .isISO8601()
		// ,

	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.status(201).send({result:req.query,errors:errors.array()});
            return;
        }
        else {
        	req.query.phones = JSON.parse(req.query.phones);
        	console.log(req.query)
        	model.createOrUpdateCustomer((result,databaserror)=>{
        		if (databaserror){
            		res.status(201).send({result:req.query,errors:[{msg:'Sorry, internal database error',param:'database'}]});
            		console.log(JSON.stringify(databaserror,null,2))
        		}else{
            		res.status(201).send({result:req.query});
        		}
        	},req.query)
		}
	}
]

exports.setCustomerState = (req, res, next) => {
	model.updateCustomerState((result,err)=>{
	    res.status(200).end(err?'0':'1');
	},{cpf:req.params.cid,state:req.query.state})
};
exports.deleteCustomer = (req, res, next) => {
	model.deleCustomersAndAllPhones((result,err)=>{
	    res.status(200).end(err?'0':'1');
	},req.params.cid);
	// next();
};

exports.deleteCustomers = [
	check('cpfs').custom(value=>value.split(',').length>0).withMessage("It's neccessary at least one cpf to delete"),
	(req, res, next) => {
		model.deleCustomersAndAllPhones((result,err)=>{
		    res.status(200).end(err?'0':'1');
		},req.query.cpfs.split(','));
		// next();
	}
];

exports.getCustomer = (req, res, next) => {
	model.getCustomerByCPF((result,err)=>{
		res.status(200).send(result);
	},req.params.cid,);
	// next();
};
exports.getCustomers = (req, res, next) => {
	model.getAllCustomersAndPhones((result,err)=>{
		res.status(200).send(result);
	});
	// next();
};
