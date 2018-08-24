// Last modification: 24-08-2018 02:08:47

/*
	Author: Francisco Sobrinho
	E-mail: francicsobrinho@gmail.com
	Description: Client-side da aplicação iTools
	URL: https://github.com/nephew92/itools-nodejs
	Obs: Neste script são utilizando tanto jQuery.js quanto D3.js para manipulação de elementos HTML, algumas coisas são mais intuitivas com D3.js
*/

$(document).ready(function(){
	///**** Funções que são chamadas em mais de um lugar ****////
	/* 

		Função genérica para capitalizar strings.
	*/
	String.prototype.capitalize = function(){ return this.charAt(0).toUpperCase() + this.slice(1)};
	
	/* 
		Preenche os dados de um cliente nos campos do formulário no modal para edição. 
		Esta função pode ser chamada tanto para edição de um cliente existente quanto para um novo. 
		Se for passado um objeto vazio os valores dos campos serão setados com vazio 
	*/
	function customerToForm(d){
		/** Preparação do formulário **/
		d3.selectAll('.phone.input-group').remove();//Apaga os campos de telefones rema
		removeErrors();//Remove as mensagens de erro remanescentes
		if (d.cpf){//Se a função foi chamada para um cliente existente
			d3.select(`#chk-customer-${d.cpf}`).property('checked',true); //Seta o checkbox de seleção na tabela como 'checado', útil para quando a intenção é apagar o cliente
		} 
		enableDeleteButton();

		/** Adição dos dados do cliente, se for o caso **/
		$('#label-customer-active-form').text((d3.select('#chk-customer-active-form').node().checked = eval(d.state))?"Active":"Inactive"); //Atualiza o checkbox no formulário, referente à situação do cliente

		d3.selectAll("input.customer")
			.property('value',function(){return d[this.name] || ''});//Atualiza os inputs do formulário com os dados do cliente sendo editado, ou vazio se é um novo cliente

		$('input.customer.cpf').unmask();//aplica a mascara para o cpf, devido a um erro no plugin jQuery Mask
		
		if(d.phones){
			d.phones.forEach(p=>{
				addPhoneInput(...p);//Adiciona cada um dos telefones cadastrados ao formulário
			});
		}
		
		}

	/*
		Adiciona um telefone ao formulário de edição
		Esta função pode ser chamada tanta para adição ao formulário de um número existente de um cliente, no qual é passado os respectivo valores para o tipo de telefone e o número, quanto um novo numero de telefone, quando é clicado no menu drop-down e selecionado um novo tipo de telefone para ser adicionado.
	*/	
	function addPhoneInput(typ,phone){
		var typ = typeof(typ)=='string'?typ:$(this).attr('name');//se o typ é uma string, quer dizer que a função foi chamada para incluir um telefone existente ao formulário, senão é um novo campo de telefone a ser criado, neste caso o typ é de acodo com o que foi selecionado no menu drop-down.

		d3.select("#phones-container")
			.append('div')
			.attr('id',`${typ}-phone-group`)
			.attr('class','input-group mb-3 phone').call(sel=>{//Esta função call do D3.js é útil para fazer modificações em uma seleção sem a necessidade de criar variáveis auxiliares, realizando inserções de elementos 'siblings' em uma mesma linha;
				sel.append('div')
					.attr('class','input-group-prepend')
					.append('span')
					.attr('class','input-group-text')
					.text(typ.capitalize());
				sel.append('input')
					.attr('type','text')
					.attr('name',`${typ}-phone`)
					.attr('placeholder',`Enter the ${typ} phone`)
					.attr('class','form-control phone')
					.property('value',phone || '')
					;
			});
		}
	
	/*
		Atualiza a tabela de cliente, eviando uma requisição AJAX GET para a API
	*/
	function refreshCustomersList(){
		$("#btn-refresh").attr('disabled',true);//Desabilita o botão refresh até que a resposta do servidor seja recebida
		$.get('/customers',function(result,s){
			$("#btn-refresh").attr('disabled',false);//Habilita novamente o botão refresh

			d3.selectAll("tr.customer").remove()//Remove todas as linhas da tabela
			
			d3.select(".table.customer > tbody")//Preenche a tabela com os dados dos clientes recebidos
				.selectAll("tr.customer")
				.data(result)
				.enter()
				.append('tr')
					.attr('id',d=>`uid${d.cpf}`)
					.attr('class','customer')
					.call(tr=>{
						tr.append('td').append('div')
							.attr('class','d-flex align-items-baseline custom-control custom-checkbox mb-3')
							.call(sel=>{
								sel.append('input')
									.attr('type','checkbox')
									.attr('class','custom-control-input chk-customer')
									.attr('id',d=>`chk-customer-${d.cpf}`)
									.on('change',enableDeleteButton)
									;
								sel.append('label')
									.attr('class','custom-control-label')
									.attr('for',d=>`chk-customer-${d.cpf}`)
									;
								});
						tr.append('td')
							.append('button')
							.attr('class','btn-edit btn btn-link')
							.attr("data-toggle","modal" )
							.attr("data-target","#customer-modal-form")
							.on('click',customerToForm)
							;
						tr.append('td').text(d=>$("input.cpf").masked(d.cpf));
						tr.append('td').text(d=>d.name);
						tr.append('td').text(d=>d.email);
						tr.append('td').html(d=>d.phones.map(d=>`${d[0].capitalize()}: ${$("input.phone").masked(d[1])}`).join('</br>')); //Concatena todos os telefones em um unica célula, numeros formatados e tipos capitalizados
						tr.append('td').append('label').attr('class','switch')
							.call(sel=>{
								sel.append('input')//Este checkbox é o referente à situação do cliente
									.attr('type','checkbox')
									.on('change',function(d){//Ao ser alternado executa algumas ações
										d.state = (this.checked+0);//atualiza o 'estado' no objeto no DOM
										$.post(`/customers/${d.cpf}/setstate?state=${d.state}`,(result,s)=>{//Envia uma requisição para atualizar o novo valor do 'estado' na base de dados
											if(eval(result)){//Caso o retorno positivo: 1
												d3.select(`#uid${d.cpf}`)
													//Atualiza a cor da linha
													.classed('table-success',d.state)
													.classed('table-active',!d.state);
											}else{//Caso o retorno negativo: 0
												//Desfaz a mudança
												this.checked = !this.checked;
												d.state = (this.checked+0);
												console.error("Internal database error")
											}
											})
										})
									.property('checked',d=>Boolean(eval(d.state)))//Atualiza o interruptor no momemto da construção, de acordo com o 'estado'
								sel.append('span').attr('class','slider round')
								})
							;
						})
					//Atualiza a cor da linha no momemto da construção, de acordo com o 'estado'
					.classed('table-success',d=>eval(d.state))
					.classed('table-active',d=>!eval(d.state))
					;
			});
		}
	
	/*

		Remove as mensagens de erro do formulário
	*/
	function removeErrors(){

		d3.selectAll("#erros-container div.alert").remove(); 
		}

	/*

		Desabilita os botões deletar
	*/
	function enableDeleteButton(){
		$('.delete-customer').attr('disabled',d3.select('.chk-customer:checked').empty())//Desabilita se não houver nenhuma linha selecionada
		}


	///**** Atribui as máscaras para telefones e CPF ****////

	$('input.cpf').mask('000.000.000-00');
	$("input.phone").mask('(00) 0 0000-0000');

	///**** Atribui funções aos eventos dos elementos ****////

	$("#customer-modal-form").on('hidden.bs.modal',()=>{//Evento ao sair do modal
		d3.selectAll('.chk-customer:checked').property('checked',false);//Deseleciona as linhas selecionadas
		customerToForm({});//Limpa o formulário.
		});
	
	$("input.search-customer").on("keyup", function() {//Ao pressionar um tecla na busca
	    var value = $(this).val().toLowerCase();//Recupera o valor digitado
	    $(".table.customer > tbody tr").get().forEach(e=>{//para cada linha da tabela
	      $(e).toggle($(e).text().includes(value));//verifica se possui o valor digitado e mantém na tabela
	    });
		});

	$('#table-check-all').change(function(){//Selecionar tudo
		d3.selectAll('.chk-customer').property('checked',this.checked); //seleciona todas as linhas
		enableDeleteButton();//habilita o botão delete
		});

	$('#chk-customer-active-form').change(function(){//ao clicar no checkbox da 'situação' do cliente no formulário
		$('#label-customer-active-form').text(this.checked?"Active":"Inactive");//Altera o label de acordo com o valor checado
		})

	$(".dropdown-item.phone-type").click(addPhoneInput); //Ao selecionar uma opção de telefone no menu dropdown
	
	$("#btn-refresh").click(refreshCustomersList)//Botão de atualizar lista de clientes
	
	$('th.sortable').click(function(){//Ao clicar no cabeçalho de uma coluna da tabela que pode ser ordenada
		var key = $(this).attr('name');//Recupera o nome da coluna, pode ser diferente do alias
		var order = d3.select(this).classed('ordered'); //controla o critério da ordenação, se não está classificada como ordered então o critério será ascendente, caso contrário será descendente
		d3.selectAll('tr.customer').sort((a,b)=>d3[`${order?'de':'a'}scending`](a[key],b[key]));//Utiliza uma função do D3.js para ordenar
		d3.select(this).classed('ordered',!order);
		});
	
	/*

		Envia os dados do formulário para inserção/alteração de clientes
	*/
	$('#btn-send-customer').click(function(){//aqui não foi utilizado o método padrão de submissão de formulário, ao invés disso os valores são recuperados, pré-processados e enviados manualmente

		/**** Recuperação dos valores informado no formulário ****/

		var data = $('input.customer').get().reduce((p,c)=>{//Guarda todos os valores dos campos em um único objetos, onde as keys são os 'names' dos campos
		    try{
		    	p[c.name] = $(c).cleanVal();//valor sem a máscara para campos que possem máscara, se o campo não posssuir máscara essa linha vai resultar em um erro
		    }catch(err){
		    	p[c.name] = c.value;//valor original
		    }
			return p;
		},{});

		data.phones = JSON.stringify($('input.phone:not(.hidden)').get().map(d=>({//mapeia todos os telefones com seus tipos e retorna JSON contendo um array de obejtos com os atributos a seguir
			type:d.name.replace('-phone',''),
			phone:$(d).cleanVal()
		}))); 

		data.state  = d3.select('#chk-customer-active-form').property('checked')+0;	//Valor do 'estado'	

		/**** Envio da requisição ****/

		$.post(`/customers?${$.param(data)}`,function(result,s){
			removeErrors();//Remove erros remanescentes de outras tentativas
			var {result,errors} = result;
			if (errors){//Se algum erro foi identificado na validação da requisição
				d3.select("#erros-container").selectAll("div.alert")//Mostra os erros
					.data(errors).enter()
					.append('div')
					.attr('class',"alert alert-danger alert-dismissible mb-1")
					.call(sel=>{
						sel.append('button')
							.attr('class','close')
							.attr('data-dismiss',"alert")
							.html('&times;');
						// sel.append('strong').text("Error ");
						sel.append('span').html(d=>d.msg.replace(new RegExp(`(.*)(${d.param.replace('email','e-mail')})(.*)`,'ig'),"$1<strong>$2</strong>$3" ));//Adiciona o texto da mensagem como o 'name' do campo em negrito
					});
			}else{//caso não haja erros
				$("#customer-modal-form").modal('hide');//fecha o modal
				refreshCustomersList();//Atualiza a lista de clientes
			}
		});
		});

	$('.delete-customer').click(()=>{//Apagar todos os cliente selecionados
		var todel = $('tr:has(.chk-customer:checked)').get()//Recupera todos as linhas da tabela selecionadas
		if(todel.length>0){
			todel = todel.map(d=>d3.select(d).datum().cpf);//mapea pelo cpf as linhas selecionadas 
			$.post(`/customers/delete?cpfs=${todel.join(',')}`,function(result,s){//Envia a requisição para apagar os respectivos clientes pelo cpf
				if(eval(result)){//Se OK
					refreshCustomersList();//Atualiza a lista de clientes
					$("#customer-modal-form").modal('hide');//fecha o modal, caso esteja aberto
				}else{
					console.error("Internal database error")
				}
				});
			}
		});
	
	refreshCustomersList();//Atualiza a lista de clientes ao carregar a página
});
