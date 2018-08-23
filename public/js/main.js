// Last modification: 23-08-2018 20:03:01

$(document).ready(function(){

	/* Função genérica para capitalizar strings */
	String.prototype.capitalize = function(){ return this.charAt(0).toUpperCase() + this.slice(1)};
	
	function customerToForm(d){
		if (d.cpf){
			$('#btn-delete-customer-form').attr('disabled',false);
			d3.select(`#chk-customer-${d.cpf}`).property('checked',true)
		} 
		$('#label-customer-active-form').text((d3.select('#chk-customer-active-form').node().checked = eval(d.state))?"Active":"Inactive");

		d3.selectAll("input.customer").data([d.cpf,d.name,d.email,d.state])
			.property('value',function(){return d[this.name] || ''});
		if(d.phones){
			d.phones.forEach(p=>{
				addPhoneInput(...p)
			});
		}
	}
	function addPhoneInput(typ,phone){
		var typ = typeof(typ)=='string'?typ:$(this).attr('name');

		d3.select("#phones-container")
			.append('div')
			.attr('id',`${typ}-phone-group`)
			.attr('class','input-group mb-3 phone').call(sel=>{
				sel.append('div')
					.attr('class','input-group-prepend')
					.append('span')
					.attr('class','input-group-text')
					.text(typ.capitalize());
				sel.append('input')
					.attr('type','text')
					.attr('id',`${typ}-phone`)
					.attr('name',`${typ}-phone`)
					.attr('placeholder',`Enter the ${typ} phone`)
					.attr('class','form-control phone')
					.property('value',phone || '')
					;
			})

		/*$("#phones-container").parent().append($("#mobile-phone-group")[0].outerHTML
			.replace('default','')
			.replace(/mobile/g,typ)
			.replace(/Mobile/g,typ.replace(/^\w/, c => c.toUpperCase())));*/
	}
	function updateCustomers(){
		$("#btn-refresh").attr('disabled',true)
		$.get('/customers',function(result,s){
			console.log(result)
			d3.selectAll("tr.customer").remove()
			
			d3.select(".table.customer > tbody")
				.selectAll("tr.customer")
				.data(result)
				.enter()
				.append('tr')
				.attr('id',d=>`uid${d.cpf}`)
				.attr('class','customer')
				.call(tr=>{
					/*<div class="custom-control custom-checkbox mb-3">
						<input type="checkbox" class="" id="check-all" name="example1">
						<label class="custom-control-label" for="check-all"/>
					</div>*/
					tr.append('td').append('div').attr('class','d-flex align-items-baseline custom-control custom-checkbox mb-3').call(sel=>{
						sel.append('input')
							.attr('type','checkbox')
							.attr('class','custom-control-input chk-customer')
							.attr('id',d=>`chk-customer-${d.cpf}`)
							.on('change',d3.select('#table-check-all').on('change'))
							;
						sel.append('label')
							.attr('class','custom-control-label')
							.attr('for',d=>`chk-customer-${d.cpf}`);
					});
					tr.append('td')
						.append('button')
						.attr('class','btn-edit btn btn-link')
						.attr("data-toggle","modal" )
						.attr("data-target","#customer-modal-form")
						.on('click',customerToForm)
						;
					tr.append('td').text(d=>d.cpf);
					tr.append('td').text(d=>d.name);
					tr.append('td').text(d=>d.email);
					tr.append('td').html(d=>d.phones.map(d=>`${d[0].capitalize()}: ${$("input.phone").masked(d[1])}`,'').join('</br>'));
					tr.append('td').append('label').attr('class','switch').call(sel=>{
						sel.append('input').attr('type','checkbox').on('change',function(d){
							d.state = (this.checked+0);
							$.post(`/customers/${d.cpf}/setstate?state=${d.state}`,function(result,s){
								if(eval(result)){
									console.log(result)
									d3.select(`#uid${d.cpf}`)
										.classed('table-success',d.state)
										.classed('table-active',!d.state)
								}else{
									this.checked = !this.checked;
								}
							})

						}).property('checked',d=>Boolean(eval(d.state)))
						sel.append('span').attr('class','slider round')
					})
					;
				})
				.classed('table-success',d=>eval(d.state))
				.classed('table-active',d=>!eval(d.state))
				;
			$("#btn-refresh").attr('disabled',false)
		});
	}
	function deleteCustomers(callback){
		var todel = $('tr:has(.chk-customer:checked)').get()
		if(todel.length>0){
			todel = todel.map(d=>d3.select(d).datum().cpf);
			$.post(`/customers/delete?cpfs=${todel.join(',')}`,function(result,s){
				updateCustomers()
				callback()
			});
		}
	}
	var removeErrors = ()=>d3.select("#erros-container").selectAll("div.alert").remove();
	// $('.toggle-content').click(toggleContent)
	$(".dropdown-item.phone-type").click(addPhoneInput)
	$("#btn-refresh").click(updateCustomers)
	$("#customer-modal-form").on('hidden.bs.modal',()=>{
		customerToForm({});
		d3.selectAll('.phone.input-group').remove();
		removeErrors();
		$('#btn-delete-customer-form').attr('disabled',true)
		});
	$('#btn-send-customer').click(function(){
		var data = $('input.customer').get().reduce((p,c)=>{
		    try{
		    	p[c.name] = $(c).cleanVal();
		    }catch(err){
		    	p[c.name] = c.value;
		    }
			return p;
		},{});
		data.phones = JSON.stringify($('input.phone:not(.hidden)').toArray().map(d=>({
			type:d.name.replace('-phone',''),
			phone:$(d).cleanVal()
		}))); 

		data.state  = d3.select('#chk-customer-active-form').property('checked')+0;		

		console.log(data)
		$.post(`/customers?${$.param(data)}`,function(result,s){
			var {result,errors} = result;
			removeErrors();
			if (errors){
				d3.select("#erros-container").selectAll("div.alert")
					.data(errors).enter()
					.append('div')
					.attr('class',"alert alert-danger alert-dismissible mb-1")
					.call(sel=>{
						sel.append('button')
							.attr('class','close')
							.attr('data-dismiss',"alert")
							.html('&times;');
						// sel.append('strong').text("Error ");
						sel.append('span').html(d=>{
							var rg =  new RegExp(`(.*)(${d.param.replace('email','e-mail')})(.*)`,'ig')
							console.log(rg,d);
							var r = d.msg.replace(rg,"$1<strong>$2</strong>$3" )
							return r
						});
					});
			}else{
				$("#customer-modal-form").modal('toggle');
				updateCustomers();
			}
		});
		});
	$("input.search-customer").on("keyup", function() {
	    var value = $(this).val().toLowerCase();
	    $(".table.customer > tbody tr").filter(function() {
	      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
	    });
		});
	$('th.sortable').click(function(){
		var key = $(this).attr('name');
		console.log(d3.selectAll('tr.customer'));
		var order = d3.select(this).classed('ordered');
		d3.selectAll('tr.customer').sort((a,b)=>d3[`${order?'de':'a'}scending`](a[key],b[key]));
		d3.select(this).classed('ordered',!order);
		});
	$('input.cpf').mask('000.000.000-00');
	$("input.phone").mask('(00) 9 0000-0000');
	$('#table-check-all').click(function(){
		d3.selectAll('.chk-customer').property('checked',this.checked)
		});
	$('.delete-customer').click(deleteCustomers)
	$('#btn-delete-customer-form').click(()=>$("#customer-modal-form").modal('hide'));
	d3.select('#table-check-all').on('change',function(){
		console.log('aqui')
		$('#btn-delete-customer-selected')
			.attr('disabled',d3.select('.chk-customer:checked').empty())
	})
	$('#chk-customer-active-form').change(function(){
		$('#label-customer-active-form').text(this.checked?"Active":"Inactive")
	})
	updateCustomers();
});
