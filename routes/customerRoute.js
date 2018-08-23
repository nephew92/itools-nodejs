// Last modification: 23-08-2018 17:36:24

const express = require('express');
const router = express.Router();

/* Importa os controles para clientes */
const customerController = require('./customerController')

/* Definição das rotas para API do prefixo customers/ */

/* Rotas gerais para clientes */
router.get('/', customerController.getCustomers); //retorna um JSON com todos os clientes cadastrados
router.post('/', customerController.createCustomer); //cadastra novos clientes ou altera existentes
router.post('/delete', customerController.deleteCustomers);//apaga vários clientes

/* Rotas para clientes específicos */
router.get('/:cid', customerController.getCustomer); //retorna um cliente 
// router.post('/:cid', customerController.updateCustomer); //decontinuado

router.get('/:cid/delete', customerController.deleteCustomer); //Apaga um cliente
router.post('/:cid/setstate', customerController.setCustomerState); //Altera o estado de um cliente

module.exports = router;
