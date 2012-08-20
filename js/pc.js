function jumboFrame (){
	top.iframeSize({height:'hg200'});
	HE.ajax({
		url:RouterConfig.jumbo_frame+'dispatch=show jumbo-frame&r='+Math.random(),
		method:'get',
		useXml:true
	},function(result){
		grepResult(result);
		var status=HE.trim.both($T(result,'jumbo-frame')[0].childNodes[0].nodeValue);
		if(status=='enable')$E('jumbo1').checked=true;
		else if(status == 'disable') $E('jumbo2').checked=true;
		
		top.createButton([{id:'APPLY',func:function(){
			var status='';
			if($E('jumbo1').checked)status=$E('jumbo1').value
			else if($E('jumbo2').checked)status=$E('jumbo2').value;
			HE.ajax({
				url:RouterConfig.jumbo_frame+'dispatch=cfg-jumbo&status='+status+'&r='+Math.random(),
				method:'get',
				useXml:true
			},function(res){
				var ret=$T(res,'ret-code')[0].childNodes[0].nodeValue;
				if(ret=='success'){
					window.location.reload();
				}else{
					alert($T(res,'msg')[0].childNodes[0].nodeValue);
				}
			});
		}},{id:'REFRESH',func:function(){window.location.reload();}}]);
	});
}
function vlanTable(){
	var from=PM.getPara(location.href,'from');
	var to=PM.getPara(location.href,'to');
	var url=RouterConfig.vlan_table+'dispatch=show vlan range ';
	from=(from==''?1:from)
	url+=from;
	to=(to==''?1000:to);
	url+=' '+to;
	$('#start_vlan').val(from);
	$('#end_vlan').val(to);
	url+='&r='+Math.random();
	
	HE.ajax({
		url:url,
		method:'get',
		useXml:true
	},function(result){
		grepResult(result);
		var port_data = {
				check : true,
				pageable:true,
				pagesize:100,
				head : [ {
					value : '',
					type : "checkbox",
					id:'allcheck',
					cls : 'wd15'
				}, {
					value : 'VLAN ID',
					type : 'nochangetext',
					cls : 'wd80'
				}, {
					value : 'VLAN Name',
					type : 'nochangetext',
					cls : 'wd90'
				},{
					value : 'Untag Ports',
					type : 'nochangetext',
					cls : 'wd90'
				},{
					value : 'Tag Ports',
					type : 'nochangetext',
					cls : 'wd90'
				},{
					value : '',
					type : 'nochangetext',
					cls : 'wd90'
					
				}
				],
				max:4094,
				start:from,
				end:to
		};
		port_data.body =[];
		var vl=result.getElementsByTagName('vl');
		if(vl.length!=0){
			for(var i=0;i<vl.length;i++){
				var node=vl[i];
				var o={};
				o.id=node.getElementsByTagName('id')[0].childNodes[0].nodeValue;
				if(parseInt(o.id)=='1')o.nocheck=true;
				o.data=[];
				o.data.push(o.id);
				o.data.push(node.getElementsByTagName('n')[0].childNodes[0].nodeValue);
				if(node.getElementsByTagName('u-port')[0].hasChildNodes()){
					o.data.push(node.getElementsByTagName('u-port')[0].childNodes[0].nodeValue);
				}else{
					o.data.push('');
				}
				if(node.getElementsByTagName('t-port')[0].hasChildNodes()){
					o.data.push(node.getElementsByTagName('t-port')[0].childNodes[0].nodeValue);
				}else{
					o.data.push('');
				}
				o.data.push('<input type="button" value="Modify" onclick="showVlan('+o.id+');" />');
				port_data.body.push(o);
			}
		}
		var tablecnt=HE.$('div.tablecontentbody')[1];
		var tb=new PM.checkTable(port_data,tablecnt);

		PM.addEvent(HE.$('#btn_search_vlan'),function(){
			var s=$('#start_vlan');
			var e=$('#end_vlan');
			if(!PM.checkRange2(s.val(),1,4094)||!PM.checkRange2(e.val(),1,4094)||parseInt(s.val())>parseInt(e.val())){
				alert($('#searcherror').val());
				return;
			}else if(e.val()-s.val()>1000){
				alert($('#rangeerror').val());
			}else{
				var loca=location.href;
				loca=PM.setPara(loca,'from',s.val());
				loca=PM.setPara(loca,'to',e.val());
				location.href=loca;
			}
		});
		PM.addEvent(HE.$('#btn_all_vlan'),function(){
			var loca=location.href;
			loca=HE.removePara(loca,'from');
			loca=HE.removePara(loca,'to');
			location.href=loca;
		});
		var btnarr=[];
		btnarr.push({id:'DELETE',func:function(){
						      var checklist=tb.getChecklist();
		                	  var list=[];
		                	  
		                	  HE.array.forEach(checklist,function(check){
		                		  if(check.checked)list.push(HE.getProp(check.parentNode.parentNode,'_id'));
		                	  });
		                	  list=list.join(',');
		                	  if(list==''&&$E('allcheck').checked){
		                		  alert(HE.$('#defaultvlandelete').value);
		                		  return;
		                	  }else if(list==''){
		                		  alert(HE.$('#novlanchecked').value);
		                		  return;
		                	  }
		                	  var url=RouterConfig.vlan_table;
		                	  url=HE.setPara(url,'dispatch','del-vlan');
		                	  url=HE.setPara(url,'id',list);
		                	  url=PM.setPara(url,'r',Math.random());
		                	  $.ajax({
		          				url:url
		          				}).done(function(res){
		          					manageResult(res);
		          			});
		                  }});
		if(tb.needPaging()){
			btnarr.push({id:'NEXT',func:function(){tb.nextPage();}});
			btnarr.push({id:'PREV',func:function(){tb.prevPage();}});
		}
		top.createButton(btnarr);
	});
}
function vlanConfiguration(){
	
	RouterConfig.vl={};
	function inital(){
		var radiomap2={'0':'ingress','1':'egress','2':'both','3':'none'};//
		var trArr=[$('table:eq(1) tr:eq(0)'),$('table:eq(1) tr:eq(1)'),$('table:eq(1) tr:eq(2)'),$('table:eq(1) tr:eq(3)')];
		for(var i=1;i<=RouterConfig.portnum;i++){
			trArr[0].append('<th class="wd25">'+i+'</th>');
			for(var j=1;j<trArr.length;j++){
				trArr[j].append('<th class="wd25"><input type="radio" class="taArr'+j+'" name="gressradio'+i+'" value="'+radiomap2[j-1]+'_'+i+'" /></th>');
			}
		}
		
		var untagarr=[];
		var tagarr=[];
		RouterConfig.vl.untagradio=[];
		RouterConfig.vl.tagradio=[];
		RouterConfig.vl.notmember=[];
		var radios=[];
		var trs=HE.$('tr',HE.$('#table2'));
		for(var i=1;i<=RouterConfig.portnum;i++){
			var g=document.getElementsByName('gressradio'+i);
			
			RouterConfig.vl.untagradio.push(g[0]);
			RouterConfig.vl.tagradio.push(g[1]);
			RouterConfig.vl.notmember.push(g[2]);
			g[2].checked=true;
		}
		radios.push(RouterConfig.vl.untagradio);
		radios.push(RouterConfig.vl.tagradio);
		radios.push(RouterConfig.vl.notmember);
		for(var i=0;i<radios.length;i++){
			var l=radios[i];
			HE.array.forEach(l,function(check){
				PM.addEvent(check,function(){
					var a=[];
					var b=[];
					HE.array.forEach(RouterConfig.vl.untagradio,function(u){
						if(u.checked)a.push(RouterConfig.prefix+'/'+u.value.split('_')[1]);
					});
					HE.array.forEach(RouterConfig.vl.tagradio,function(u){
						if(u.checked)b.push(RouterConfig.prefix+'/'+u.value.split('_')[1]);
					});
					HE.$('#untags_text').value=a.join(',');
					HE.$('#tags_text').value=b.join(',');
				});
			});
		}
	}
	
	inital();

	var id=HE.getPara(location.href,'id');
	if(id!=''){
		var url=RouterConfig.vlan_configuation+'dispatch=show vlan '+id+"&r="+Math.random();
		HE.$('#vlan_id').value=id;
		
		HE.ajax({
			url:url,
			method:'get',
			useXml:true
		},function(result){
			grepResult(result);
			var vl=result.getElementsByTagName('vl');
			if(vl.length!=0){
				var node=vl[0];
				HE.$('#vlan_name').value=HE.trim.both(node.getElementsByTagName('n')[0].childNodes[0].nodeValue);
				var tmp=[];
				if(node.getElementsByTagName('u-port')[0].hasChildNodes()){
					var v=HE.trim.both(node.getElementsByTagName('u-port')[0].childNodes[0].nodeValue);
					var vs=v.split(' ');
					HE.$('#untags_text').value=vs.join(',');
					for(var i=0;i<vs.length;i++){
						var id=vs[i].split('/')[1];
						RouterConfig.vl.untagradio[(id-1)].checked=true;
					}
				}
				if(node.getElementsByTagName('t-port')[0].hasChildNodes()){
					var v=HE.trim.both(node.getElementsByTagName('t-port')[0].childNodes[0].nodeValue);
					var vs=v.split(' ');
					HE.$('#tags_text').value=vs.join(',');
					for(var i=0;i<vs.length;i++){
						var id=vs[i].split('/')[1];
						RouterConfig.vl.tagradio[(id-1)].checked=true;
					}
				}
			}
		});
	}
	
	
	
	
	PM.addEvent(HE.$('#vlan_refresh'),function(){
		if(!PM.checkRange2($('#vlan_id').val(),1,4094)){
			alert($('#searcherror').val());
			return;
		}
		var loca=location.href;
		loca=HE.setPara(loca,'id',HE.$('#vlan_id').value);
		window.location.href=loca;
	});
	
	PM.addEvent(HE.$('#vlan_apply'),function(){
		
		if(!PM.checkRange2($('#vlan_id').val(),1,4094)){
			alert($('#searcherror').val());
			return;
		}
		if(!/^[\d|\w]{2,31}$|^( )*$/.test(HE.$('#vlan_name').value)){
			alert(HE.$('#nameerror').value);
			return;
		}
		var url=RouterConfig.vlan_configuation;
		url=HE.setPara(url,'dispatch','add-vlan');
		url=HE.setPara(url,'id',HE.$('#vlan_id').value);
		url=HE.setPara(url,'name',HE.$('#vlan_name').value);
		url=HE.setPara(url,'untag-port',HE.$('#untags_text').value);
		url=HE.setPara(url,'tag-port',HE.$('#tags_text').value);
		url=PM.setPara(url,'r',Math.random());
		HE.ajax({
				url:url,
				method:'get',
				useXml:true
				},function(res){
					grepResult(res);
				var ret=res.getElementsByTagName('ret-code')[0].childNodes[0].nodeValue;
				if(ret=='success'){
					var loca=location.href;
					loca=HE.setPara(loca,'id',HE.$('#vlan_id').value);
					location.href=loca;
				}else{
					alert(res.getElementsByTagName('msg')[0].childNodes[0].nodeValue);
				}
			});
		
	});
	
	PM.addEvent(HE.$('#untag_all'),function(){
		var tmp=[];
		for(var i=0;i<RouterConfig.vl.untagradio.length;i++){
			var o=RouterConfig.vl.untagradio[i];
			o.checked=true;
			tmp.push(RouterConfig.prefix+'/'+o.value.split('_')[1]);
		}
		HE.$('#untags_text').value=tmp.join(',');
		HE.$('#tags_text').value='';
	});
	PM.addEvent(HE.$('#tag_all'),function(){
		var tmp=[];
		for(var i=0;i<RouterConfig.vl.tagradio.length;i++){
			var o=RouterConfig.vl.tagradio[i];
			o.checked=true;
			tmp.push(RouterConfig.prefix+'/'+o.value.split('_')[1]);
		}
		HE.$('#tags_text').value=tmp.join(',');
		HE.$('#untags_text').value='';
	});
	PM.addEvent(HE.$('#notmember_all'),function(){
		for(var i=0;i<RouterConfig.vl.notmember.length;i++){
			var o=RouterConfig.vl.notmember[i];
			o.checked=true;
		}
		HE.$('#tags_text').value='';
		HE.$('#untags_text').value='';
	});
	
	var btnarr=[];
	top.createButton(btnarr);
}
function  macBasedVlan(){
	top.createButton({});
	
	var port_data = {
			check : true,
			pageable:true,
			pagesize:100,
			head : [ {
				value : '',
				type : "checkbox",
				id:'allcheck',
				cls : 'wd15'
			}, {
				value : 'MAC Address',
				type : 'nochangetext',
				cls : 'wd180'
			}, {
				value : 'VLAN ID(1-4094)',
				type : 'nochangetext',
				cls : 'wd180'
			} ],
			body:[]
		};
	
	var loca=location.href;
	var type=PM.getPara(location.href,'type');
	var url=RouterConfig.mac_based_vlan+'dispatch=show mac-vlan&r='+Math.random();

	switch(type){
		case 'all':
		case '':
			break;
		case 'vlan_id':
			var id=HE.getPara(location.href,'id');
			url+=' vlan '+id;
			break;
		case 'mac_address':
			var address=HE.getPara(location.href,'address');
			url+=' mac-address '+address;
			break;
	}
	showMacTable(url,$('div.tablecontentbody:eq(2)'));

	//new PM.checkTable(port_data,HE.$('div.tablecontentbody')[2]);
	
	
	
	PM.addEvent($E('btn_add'),function(){
		var id=$('#add_vlan_id').val();
		var address=$('#add_mac_address').val();
		if(!PM.checkRange2(id,1,4094)){
			alert($('#adderror').val());
			return;
		}
		if(!PM.checkMACAddress(address)){
			alert($('#searcherroraddress').val());
			return;
		}
		var url=RouterConfig.mac_based_vlan+'dispatch=add-mac-vlan';
		url=HE.setPara(url,'vlan-id',id);
		url=HE.setPara(url,'mac_address',address);
		url=PM.setPara(url,'r',Math.random());
		HE.ajax({
			url:url,
			method:'get',
			useXml:true
			},function(res){
				manageResult(res);
		});
		
	});
	PM.addEvent($E('btn_search'),function(){
		var loca=location.href;
		var type=$('#search_type').val();
		var search_value=$('#search_value').val();
		switch(type){
			case '':
				alert($('#searchnone').val());
				return;
			case 'vlan_id':
				if(!PM.checkRange2(search_value,1,4094)){
					alert($('#searcherrorid').val());
					return;
				}
				loca=HE.setPara(loca,'type','vlan_id');
				loca=HE.setPara(loca,'id',search_value);
				location.href=loca;
				break;
			case 'mac_address':
				if(search_value==''){
					alert($('#searcherroraddress').val());
					return;
				}
				if(!PM.checkMACAddress(search_value)){
					alert($('#searcherroraddress').val());
					return;
				}
				loca=HE.setPara(loca,'type','mac_address');
				loca=HE.setPara(loca,'address',search_value)
				location.href=loca;
				break;
		}
	});
	
	PM.addEvent($E('btn_all'),function(){
		var loca=location.href;
		loca=HE.setPara(loca,'type','all');
		location.href=loca;
	});
	
	
	
	function showMacTable(url,cnt){
		HE.ajax({
			url:url,
			method:'get',
			useXml:true
			},function(result){
				grepResult(result);
			var root=$T(result,'mac-vlan-list')[0];
			var btnarr=[];
			if(root.hasChildNodes()){
				var vl=$T(root,'m-vl');
				for(var i=0;i<vl.length;i++){
					var node=vl[i];
					var o={};
					o.id=HE.trim.both(node.getElementsByTagName('m')[0].childNodes[0].nodeValue);
					o.data=[];
					o.data.push(o.id);
					o.data.push(HE.trim.both(node.getElementsByTagName('vid')[0].childNodes[0].nodeValue));
					port_data.body.push(o);
				}
				var tb=new PM.checkTable(port_data,cnt);
				btnarr.push({id:'DELETE',func:function(){
				      var checklist=tb.getChecklist();
	              	  var list=[];
	              	  HE.array.forEach(checklist,function(check){
	              		  if(check.checked)list.push(HE.getProp(check.parentNode.parentNode,'_id'));
	              	  });
	              	  list=list.join(',');
	              	  if(list==''){
	              		  alert(HE.$('#novlanchecked').value);
	              		  return;
	              	  }
	              	  var url=RouterConfig.vlan_table;
	              	  url=HE.setPara(url,'dispatch','del-mac-vlan');
	              	  url=HE.setPara(url,'mac-address-list',list);
	              	  url=PM.setPara(url,'r',Math.random());
	              	  HE.ajax({
	        				url:url,
	        				method:'get',
	        				useXml:true
	        				},function(res){
	        					manageResult(res);
	        			});
	                }},{id:'REFRESH',func:function(){window.location.reload();}});
				if(tb.needPaging()){
					btnarr.push({id:'NEXT',func:function(){tb.nextPage();}});
					btnarr.push({id:'PREV',func:function(){tb.prevPage();}});
				}
			}else{
				var tb=new PM.checkTable(port_data,cnt);
			};
			top.createButton(btnarr);
		});
	}
}

function flowControl(){
	//top.iframeSize({height:'hg400'});
	trace(RouterConfig.privilege+'>>>>>>>>>>');
	$.ajax({
		url:RouterConfig.flow_control+'dispatch=show flow-control&r='+Math.random(),
		type:'GET',
		dataType:'xml'
	}).done(function(result){
		grepResult(result);
		var root=$T(result,'flow-control-list');
		var port_data = {
				editable:true,
				check : true,
				head : [{
					value : '',
					type : "checkbox",
					id:'allcheck',
					cls : 'wd15'
				},{
					value : 'Port',
					type : 'nochangetext',
					cls : 'wd54'
				},{
					value : 'Flow Control',
					type : 'select',
					options:[{v:'Enable',t:'Enable'},{v:'Disable',t:'Disable'}],
					cls : 'wd90'
				}
				],
				body : [
						]
			};
		$(result).find('port').each(function(){
			var o={};
			o.id=$.trim($(this).find('id').text());
			o.data=[];
			o.data.push(o.id);
			o.data.push($.trim($(this).find('status').text()));
			port_data.body.push(o);
		});
		
		var tb=new PM.checkTable(port_data,$('div.tablecontentbody:eq(0)'));
		top.createButton([
		                  {id:'REFRESH',func:function(){window.location.reload();}},
		                  {id:"APPLY",func:function(){
		                	 var checklist=tb.getChecklist();
		                	 var list=[];
		                	 $.each(checklist,function(){
		                		 if($(this).attr('checked')=='checked'){
		                			 list.push($(this).parent().parent().attr('_id'));
		                		 }
		                	  });
		                	 if(list.length==0){
		                		 alert(HE.$('#novlanchecked').value);
		                		 return;
		                	 }
		                	 var url=RouterConfig.flow_control;
		                	 url+=decodeURIComponent($.param({"dispatch":'cfg-flow-control','port-list':list.join(','),"status":$("select").val(),'r':Math.random()}));
		                	 $.ajax({url:url,dataType:'xml'}).done(function(res){
		                		 manageResult(res);
		                	 });
						  }}]);
		
	});
}

function powerSaving(){
	//top.iframeSize({height:'hg550'});
	$.ajax({
		url:RouterConfig.power_saving+'dispatch=show dot3az&r='+Math.random(),
		type:'GET',
		dataType:'xml'
	}).done(function(result){
		grepResult(result);
		var port_data = {
				editable:true,
				check : true,
				head : [{
					value : '',
					type : "checkbox",
					id:'allcheck',
					cls : 'wd15'
				},{
					value : 'Port',
					type : 'nochangetext',
					cls : 'wd54'
				},{
					value : 'Auto Power Down Mode',
					type : 'nochangetext',
					cls : 'wd140'
				},{
					value : 'Short Cable Mode',
					type : 'nochangetext',
					cls : 'wd140'
				},{
					value : 'EEE',
					type : 'select',
					options:[{v:'Enable',t:'Enable'},{v:'Disable',t:'Disable'}],
					cls : 'wd90'
				}
				],
				body : [
						]
			};
			
			$(result).find('port').each(function(){
				var port=$(this);
				var o={};
				o.id=$.trim(port.find('id').text());
				o.data=[];
				o.data.push(o.id);
				o.data.push($.trim(port.find('apdm').text()));
				o.data.push($.trim(port.find('scm').text()));
				o.data.push($.trim(port.find('eee').text()));
				port_data.body.push(o);

			});
		
		var tb=new PM.checkTable(port_data,HE.$('div.tablecontentbody')[0]);
		
		top.createButton([
		                  {id:'REFRESH',func:function(){window.location.reload();}},
		                  {id:"APPLY",func:function(){
		                	 var checklist=tb.getChecklist();
		                	 var list=[];
		                	 $.each(checklist,function(){
		                		 if($(this).attr('checked')=='checked'){
		                			 list.push($(this).parent().parent().attr('_id'));
		                		 }
		                	  });
		                	 if(list.length==0){
		                		 alert(HE.$('#novlanchecked').value);
		                		 return;
		                	 }
		                	 var url=RouterConfig.flow_control;
		                	 url+=decodeURIComponent($.param({"dispatch":'cfg-dot3az','port-list':list.join(','),"status":$("select").val(),"r":Math.random()}));
		                	 $.ajax({url:url,dataType:'xml'}).done(function(res){
		                		 manageResult(res);
		                	 });
						  }}]);
		
	});
}

function  protocolBasedVlanConfiguration(){
top.createButton({});
	
	var port_data = {
			check : true,
			pagesize:100,
			head : [ {
				value : '',
				type : "checkbox",
				id:'allcheck',
				cls : 'wd15'
			}, {
				value : 'VLAN ID(1-4094)',
				type : 'nochangetext',
				cls : 'wd180'
			}, {
				value : 'Profile ID(0-7)',
				type : 'nochangetext',
				cls : 'wd180'
			} ],
			body:[]
		};
	
	var portid=$.url().param('portid');
	portid=portid||'1/1';
	$('#port_id').val(portid);
	var url=RouterConfig.protocol_based_vlan_configuratioin;

	url+='dispatch=show interface ethernet '+portid+' protocol-vlan&r='+Math.random();
	
	showMacTable(url,$('div.tablecontentbody')[1]);
	
	
	$('#btn_add').click(function(){
		var vlan_id=$('#vlan_id').val();
		if(!PM.checkRange2(vlan_id,1,4094)){
			alert($('#adderror').val());
			return;
		}
		var url=RouterConfig.protocol_based_vlan_configuratioin+decodeURIComponent($.param({'dispatch':'add-protocol-based-vlan','port':$('#port_id').val(),'vid':$('#vlan_id').val(),'profile':$('#profile_id').val(),'r':Math.random()}));
		PM.disableButton();
		$.ajax({
			url:url,
			type:'GET',
			dataType:'xml'
			}).done(function(res){
				manageResult(res);
		});
	});
	$('#port_id').change(function(){
		 var url=$.url();
		 var loca=url.attr('base')+url.attr('path')+"?";
     	 loca+=decodeURIComponent($.param({'portid':$('#port_id').val()}))
     	 window.location.href=loca;
	});

	function showMacTable(url,cnt){
		$.ajax({
			url:url,
			type:'GET',
			dataType:'xml'
			}).done(function(result){
				grepResult(result);
			var btnarr=[];
			$(result).find('protocol-vlan').each(function(){
				var p=$(this);
				var o={};
				o.id=$.trim(p.find('profile').text());
				o.data=[];
				o.data.push($.trim(p.find('vid').text()));
				o.data.push(o.id);
				port_data.body.push(o);
			});
			
			var tb=new PM.checkTable(port_data,cnt);
			btnarr.push({id:'DELETE',func:function(){
				if($(this).attr('disabled'))return;
			      var checklist=tb.getChecklist();
              	  var list=[];
              	 $.each(checklist,function(){
              		 if($(this).attr('checked')=='checked')
              			 list.push($(this).parent().parent().attr('_id'));
              	  });
              	  
              	  if(list.length==0){
              		  alert($('#novlanchecked').val());
              		  return;
              	  }
              	  var url=RouterConfig.protocol_based_vlan_configuratioin+decodeURIComponent($.param({'dispatch':'del-protocol-based-vlan','profile-list':list.join(','),'port':$('#port_id').val(),'r':Math.random()}));
              	  PM.disableButton();
              	  $.ajax({
        				url:url,
        				type:'GET',
        				dataType:'xml'
        				}).done(function(res){
        					manageResult(res);
        			});
                }},{id:'REFRESH',func:function(){if($(this).attr('disabled'))return;window.location.reload();}});
			top.createButton(btnarr);
		});
	}
}

function portPvidConfiguration(){
	//top.iframeSize({height:'hg550'});
	$.ajax({
		url:RouterConfig.port_pvid_configuration+'dispatch=show interface ethernet vlan-scheme&r='+Math.random(),
		type:'GET',
		dataType:'xml'
	}).done(function(result){
		grepResult(result);
		var port_data = {
				editable:true,
				check : true,
				head : [{
					value : '',
					type : "checkbox",
					id:'allcheck',
					cls : 'wd15'
				},{
					value : 'Port ID',
					type : 'nochangetext',
					cls : 'wd54'
				},{
					value : 'Port PVID(1-4094)',
					type : 'text',
					id:'port_pvid',
					cls : 'wd140'
				},{
					value : 'MAC Based VLAN',
					type : 'select',
					id:'mac_based_vlan',
					options:[{v:'',t:''},{v:'Disable',t:'Disable'},{v:'Enable',t:'Enable'}],
					cls : 'wd140'
				},{
					value : 'Portocol Based VLAN',
					type : 'nochangetext',
					cls : 'wd140'
				}
				],
				body : [
						]
			};
			
			$(result).find('port').each(function(){
				var port=$(this);
				var o={};
				o.id=$.trim(port.find('id').text());
				o.data=[];
				o.data.push(o.id);
				o.data.push($.trim(port.find('pvid').text()));
				o.data.push($.trim(port.find('mac-based').text()));
				o.data.push($.trim(port.find('protocol-based').text()));
				port_data.body.push(o);
			});
		
		var tb=new PM.checkTable(port_data,$('div.tablecontentbody')[0]);
		
		top.createButton([
		                  {id:'REFRESH',func:function(){if($(this).attr('disabled'))return;window.location.reload();}},
		                  {id:"APPLY",func:function(){
		                	 if($(this).attr('disabled'))return;
		                	 if($('#port_pvid').val()!=''&&!PM.checkRange2($('#port_pvid').val(),1,4094)){
		                		 alert($('#applyerror').val());
		                		 return;
		                	 }
		                	 var checklist=tb.getChecklist();
		                	 var list=[];
		                	 $.each(checklist,function(){
		                		 if($(this).attr('checked')=='checked'){
		                			 list.push($(this).parent().parent().attr('_id'));
		                		 }
		                	  });
		                	 if(list.length==0){
		                		 alert($('#novlanchecked').val());
		                		 return;
		                	 }
		                	 var url=RouterConfig.port_pvid_configuration;
		                	 url=PM.setPara(url,'dispatch','cfg-port-pvid');
		                	 url=PM.setPara(url,'port-list',list.join(','));
		                	 
		                	 if($('#port_pvid').val()!=''){
		                		 url=PM.setPara(url,'pvid',$('#port_pvid').val());
		                	 }
		                	 if($("#mac_based_vlan").val()!=''){
		                		 url=PM.setPara(url,'mac_vlan_status',$("#mac_based_vlan").val());
		                	 }
		                	 url=PM.setPara(url,'r',Math.random());
		                	 
		                	 PM.disableButton();
		                	 $.ajax({url:url,dataType:'xml'}).done(function(res){
		                		 manageResult(res);
		                	 });
						  }}]);
		
	});
}

function stormControl(){
	$.ajax({
		url:RouterConfig.storm_control+'dispatch=show storm-control&r='+Math.random(),
		type:'GET',
		dataType:'xml'
	}).done(function(result){
		grepResult(result);
		var port_data = {
				editable:true,
				check : true,
				head : [{
					value : '',
					type : "checkbox",
					id:'allcheck',
					cls : 'wd15'
				},{
					value : 'Port',
					type : 'nochangetext',
					cls : 'wd54'
				},{
					value : 'Unknown Unicast',
					type : 'select',
					id:'status_select1',
					options:[{v:'',t:''},{v:'Enable',t:'Enable'},{v:'Disable',t:'Disable'}],
					cls : 'wd140'
				},{
					value : 'Unit',
					type : 'select',
					id:'unit_select1',
					options:[{v:'',t:''},{v:'kbps',t:'kbps'},{v:'pps',t:'pps'}],
					cls : 'wd90'
				},{
					value : 'Threshold',
					type : 'text',
					id : 'text1',
					cls : 'wd80'
				},
				{
					value : 'Broadcast',
					type : 'select',
					id:'status_select2',
					options:[{v:'',t:''},{v:'Enable',t:'Enable'},{v:'Disable',t:'Disable'}],
					cls : 'wd140'
				},{
					value : 'Unit',
					type : 'select',
					id:'unit_select2',
					options:[{v:'',t:''},{v:'kbps',t:'kbps'},{v:'pps',t:'pps'}],
					cls : 'wd90'
				},{
					value : 'Threshold',
					type : 'text',
					id : 'text2',
					cls : 'wd80'
				},
				{
					value : 'Multicast',
					type : 'select',
					id:'status_select3',
					options:[{v:'',t:''},{v:'Enable',t:'Enable'},{v:'Disable',t:'Disable'}],
					cls : 'wd140'
				},{
					value : 'Unit',
					type : 'select',
					id:'unit_select3',
					options:[{v:'',t:''},{v:'kbps',t:'kbps'},{v:'pps',t:'pps'}],
					cls : 'wd90'
				},{
					value : 'Threshold',
					type : 'text',
					id : 'text3',
					cls : 'wd80'
				}
				],
				body : [
						]
			};
			
			$(result).find('port').each(function(){
				var port=$(this);
				var o={};
				o.id=$.trim(port.find('id').text());
				o.data=[];
				o.data.push(o.id);
				o.data.push($.trim(port.find('uuc-status').text()));
				o.data.push($.trim(port.find('uuc-unit').text()));
				o.data.push($.trim(port.find('uuc-threshold').text()));
				
				o.data.push($.trim(port.find('bc-status').text()));
				o.data.push($.trim(port.find('bc-unit').text()));
				o.data.push($.trim(port.find('bc-threshold').text()));
				
				o.data.push($.trim(port.find('mc-status').text()));
				o.data.push($.trim(port.find('mc-unit').text()));
				o.data.push($.trim(port.find('mc-threshold').text()));
				port_data.body.push(o);

			});
		
		var tb=new PM.checkTable(port_data,$('div.tablecontentbody')[0]);
		
		top.createButton([
		                  {id:'REFRESH',func:function(){if($(this).attr('disabled'))return;window.location.reload();}},
		                  {id:"APPLY",func:function(){
		                	 if($(this).attr('disabled'))return;
		                	 var status=[];
		                	 var unit=[];
		                	 var threshold=[];
		                	 for(var i=1;i<=3;i++){
		                		 status.push($('#status_select'+i));
		                		 unit.push($('#unit_select'+i));
		                		 threshold.push($('#text'+i));
		                		 if($('#status_select'+i).val()=='Enable'){
		                			 var tflag=true;
		                			 if($('#unit_select'+i).val()=='kbps'){
		                				 tflag=PM.checkRange2($('#text'+i).val(),1,1024000);
		                			 }else if($('#unit_select'+i).val()=='pps'){
		                				 tflag=PM.checkRange2($('#text'+i).val(),1,1488100); 
		                			 }else{
		                				 alert($('#uniterror').val());
		                				 return;
		                			 }
		                			 if(!tflag){
		                				 alert($('#thrror').val());
		                				 return;
		                			 }
		                		 }
		                	 }
		                	 
		                	 var checklist=tb.getChecklist();
		                	 var list=[];
		                	 $.each(checklist,function(){
		                		 if($(this).attr('checked')=='checked'){
		                			 list.push($(this).parent().parent().attr('_id'));
		                		 }
		                	  });
		                	 if(list.length==0){
		                		 alert($('#novlanchecked').val());
		                		 return;
		                	 }
		                	 var url=RouterConfig.port_pvid_configuration;
		                	 var param={"dispatch":'cfg-storm-control','port-list':list.join(','),'r':Math.random()};
		                	 //url+=decodeURIComponent($.param({"dispatch":'cfg-storm-control','port-list':list.join(',')}));
		                	 var map=['uuc_','bc_','mc_'];
		                	 for(var i=0;i<status.length;i++){
		                		 if(status[i].val()=='Enable'){
		                			 param[map[i]+'status']=status[i].val();
		                			 param[map[i]+'unit']=unit[i].val();
		                			 param[map[i]+'threshold']=threshold[i].val();
		                		 }else if(status[i].val()=='Disable'){
		                			 param[map[i]+'status']=status[i].val();
		                		 }
		                	 }
		                	 url+=decodeURIComponent($.param(param));
		                	 PM.disableButton();
		                	 $.ajax({url:url,dataType:'xml'}).done(function(res){
		                		 manageResult(res);
		                	 });
						  }}]);
		
	});
}

function protocolProfile(){
	
	var port_data = {
			check : true,
			pagesize:100,
			head : [ {
				value : '',
				type : "checkbox",
				id:'allcheck',
				cls : 'wd15'
			}, {
				value : 'ID',
				type : 'nochangetext',
				cls : 'wd54'
			}, {
				value : 'Encapsulation',
				type : 'nochangetext',
				cls : 'wd90'
			},
			{
				value : 'Protocol',
				type : 'nochangetext',
				cls : 'wd80'
			},
			{
				value : 'Ether Type',
				type : 'nochangetext',
				cls : 'wd80'
			},
			{
				value : 'DSAP',
				type : 'nochangetext',
				cls : 'wd80'
			},
			{
				value : 'SSAP',
				type : 'nochangetext',
				cls : 'wd80'
			}],
			body:[]
		};
	
	$.ajax({
		url:RouterConfig.protocol_profile+'dispatch=show protocol-profile&r='+Math.random(),
		type:'GET',
		dataType:'xml'
	}).done(function(res){
		grepResult(res);
		$(res).find('profile').each(function(){
			var p=$(this);
			var o={};
			o.id=$.trim(p.find('id').text());
			o.data=[];
			o.data.push(o.id);
			o.data.push($.trim(p.find('encapsulation').text()));
			o.data.push($.trim(p.find('protocol').text()));
			o.data.push($.trim(p.find('ethernet-type').text()));
			o.data.push($.trim(p.find('dsap').text()));
			o.data.push($.trim(p.find('ssap').text()));
			port_data.body.push(o);
		});
		var tb=new PM.checkTable(port_data,$('div.tablecontentbody')[1]);
		var btnarr=[{id:'REFRESH',func:function(){if($(this).attr('disabled'))return;window.location.reload();}}];
		if(tb.getChecklist().length>0){
			btnarr.push({id:'DELETE',func:function(){
				if($(this).attr('disabled'))return;
			     var checklist=tb.getChecklist();
            	 var list=[];
            	 $.each(checklist,function(){
            		 if($(this).attr('checked')=='checked')
            			 list.push($(this).parent().parent().attr('_id'));
            	  });
            	  
            	  if(list.length==0){
            		  alert($('#novlanchecked').val());
            		  return;
            	  }
            	  var url=RouterConfig.protocol_profile+decodeURIComponent($.param({'dispatch':'del-protocol-profile','profile-list':list.join(','),'r':Math.random()}));
            	  PM.disableButton();
            	  $.ajax({
      				url:url,
      				type:'GET',
      				dataType:'xml'
      				}).done(function(res){
      					manageResult(res);
      			});
              }});
		}
		top.createButton(btnarr);
	});
	
	//bind add event and validate
	
	
	ProfileModel=Backbone.Model.extend({
		initialize:function(){
			this.sel_id=$('#sel_id');
			this.sel_enc=$('#sel_enc');
			this.sel_pro=$('#sel_pro');
			this.eth_type=$('#eth_type');
			this.dsap=$('#dsap');
			this.ssap=$('#ssap');
		},
		validate2:function(){
			if(this.sel_id.val()==''){
				alert($('#iderror').val());
				return false;
			}
			if(this.sel_enc.val()==''){
				alert($('#encerror').val());
				return false;
			}
			if(!this.sel_pro.attr('disabled')&&this.sel_pro.val()==''){
				alert($('#proerror').val());
				return false;
			}
			if(!this.eth_type.attr('disabled')&&!/^0x[\d|a-f|A-F]{4}$/.test(this.eth_type.val())){
				
				alert($('#ethtypeerror').val());
				this.eth_type.val('0x');
				return false;
			}
			
			if(!this.dsap.attr('disabled')&&!/^0x[\d|a-f|A-F]{2}$/.test(this.dsap.val())){
				
				alert($('#dsaperror').val());
				this.dsap.val('0x');
				return false;
			}
			if(!this.ssap.attr('disabled')&&!/^0x[\d|a-f|A-F]{2}$/.test(this.ssap.val())){
				
				alert($('#ssaperror').val());
				this.ssap.val('0x');
				return false;
			}
			return true;
		}
	});
	
	
	ProfileView=Backbone.View.extend({
		initialize:function(obj){
			this.el=obj.el;
			this.render();
		},
		events:{
			'click input[type=button]':'add',
			'change #sel_enc':'encapsulation',
			'change #sel_pro':'protocol'
		},
		render:function(){
			this.sel_id=$('#sel_id');
			this.sel_enc=$('#sel_enc');
			this.sel_pro=$('#sel_pro');
			this.sel_pro.attr('disabled',true);
			this.eth_type=$('#eth_type');
			this.eth_type.attr('disabled',true);
			this.dsap=$('#dsap');
			this.dsap.attr('disabled',true);
			this.ssap=$('#ssap');
			this.ssap.attr('disabled',true);
			this.btn=$('#pro_add');
		},
		encapsulation:function(){
			
			if(this.sel_enc.val()=='LLC'){
				this.sel_pro.attr('disabled',true);
				this.eth_type.attr('disabled',true);
				this.dsap.removeAttr('disabled');
				this.ssap.removeAttr('disabled');
			}else if(this.sel_enc.val()=='ETHERNET II'||this.sel_enc.val()=='RFC1042'){
				this.sel_pro.removeAttr('disabled');
				if(this.sel_pro.val()=='Other')this.eth_type.attr('disabled',false);
				this.dsap.attr('disabled',true);
				this.ssap.attr('disabled',true);
			}else{
				this.eth_type.attr('disabled',true);
				this.sel_pro.attr('disabled',true);
				this.dsap.attr('disabled',true);
				this.ssap.attr('disabled',true);
			}
		},
		protocol:function(){
			switch(this.sel_pro.val()){
			case '':
				this.eth_type.attr('disabled',true);
				break;
			case "ARP":
				this.eth_type.val('0x0806');
				this.eth_type.attr('disabled',true);
				break;
			case "IPv4":
				this.eth_type.val('0x0800');
				this.eth_type.attr('disabled',true);
				break;
			case "IPv6":
				this.eth_type.val('0x86DD');
				this.eth_type.attr('disabled',true);
				break;
			case "IPX":
				this.eth_type.val('0x8137');
				this.eth_type.attr('disabled',true);
				break;
			default:
				this.eth_type.val('0x');
				this.eth_type.attr('disabled',false);
			}
		},
		add:function(){
			var p=new ProfileModel();
			var flag=p.validate2();//isValid();
			//p.on('error',function(){alert(2);});// 发现用起来和想的不一样
			trace('flag='+flag);
			if(flag){
			 PM.disableButton();
			 $('#pro_add').attr('disabled',true);
			 var param={'dispatch':'cfg-protocol-profile','id':this.sel_id.val(),'encapsulation':this.sel_enc.val(),'r':Math.random()};
			 if(!this.sel_pro.attr('disabled')){
				 param['protocol']=this.sel_pro.val();
			 }
				
			 if(!this.eth_type.attr('disabled')){
				 param['ethernet-type']=this.eth_type.val();
			 }
			 if(!this.dsap.attr('disabled')){
				 param['dsap']=this.dsap.val();
			 }
			 if(!this.ssap.attr('disabled')){
				 param['ssap']=this.ssap.val();
			 }
			 var url=RouterConfig.protocol_profile+decodeURIComponent($.param(param));
           	  $.ajax({
     				url:url,
     				type:'GET',
     				dataType:'xml'
     				}).done(function(res){
     					manageResult(res);
     					$('#pro_add').attr('disabled',false);
     			});
			}
		}
	});
	
	var pv=new ProfileView({el:$('div.tablecontentbody')[0]});
}


function ipConfiguration(){
	IPView=Backbone.View.extend({
		events:{
			'change input[type=radio]:eq(0)':'enable',
			'change input[type=radio]:eq(1)':'disable'
		},
		initialize:function(obj){
			this.el=obj.el;
			this.render();
		},
		render:function(){
			var _this=this;
			$.ajax({
				url:RouterConfig.ip_configuration+'dispatch=show ip-cfg&r='+Math.random(),
				type:'GET',
				dataType:'xml'
			}).done(function(res){
				grepResult(res);
				trace($.trim($(res).find('type').text()));
				var root=$(res);
				if($.trim(root.find('type').text())=='Static')
					$("input[type=radio]:eq(0)").attr('checked',true);
				else{
					_this.disable();
					$("input[type=radio]:eq(1)").attr('checked',true);
				}
				$('#ipaddr').val($.trim(root.find('ip-addr').text()));
				$('#subnet').val($.trim(root.find('sub-mask').text()));
				$('#gateway').val($.trim(root.find('default-gw').text()));
				$('#vlan_id').val($.trim(root.find('manager-vid').text()));
			});
			
		},
		enable:function(){
			$('#ipaddr').attr('disabled',false);
			$('#subnet').attr('disabled',false);
			$('#gateway').attr('disabled',false);
		},
		disable:function(){
			$('#ipaddr').attr('disabled',true);
			$('#subnet').attr('disabled',true);
			$('#gateway').attr('disabled',true);
		}
	});
	var ipview =new IPView({el:document.body});
	
	var btnarr=[{id:'REFRESH',func:function(){if($(this).attr('disabled'))return;window.location.reload();}}];

	btnarr.push({id:'APPLY',func:function(){
		if($(this).attr('disabled'))return;
		
		 if($('input[type=radio]:eq(0)').attr('checked')){
			 if(!PM.checkIPAddress($('#ipaddr').val())){
				  $('#ipaddr').val('');
				  alert($('#ip_error').val());
				  return;
			  }
			  if(!PM.checkIPAddress($('#subnet').val())){
				  $('#subnet').val('');
				  alert($('#ip_error').val());
				  return;
			  }
			  if(!PM.checkIPAddress($('#gateway').val())){
				  $('#gateway').val('');
				  alert($('#ip_error').val());
				  return;
			  }
		 }
		  
	   	  if(!PM.checkRange2($('#vlan_id').val(),1,4094)){
	   		  alert($('#id_error').val());
	   		  return;
	   	  }
			top.popUp({title:'',height:150,width:240,type:'confirm',content:$('#apply_tips').val(),confirmfunc:function(){
				var type=$('input[type=radio]:eq(0)').attr('checked')?$('input[type=radio]:eq(0)').val():$('input[type=radio]:eq(1)').val();
			   	  var url=RouterConfig.ip_configuration+decodeURIComponent($.param({'dispatch':'cfg-ip','type':type,'ip-addr':$('#ipaddr').val(),'sub-mask':$("#subnet").val(),'default-gw':$('#gateway').val(),'manager-vid':$('#vlan_id').val(),'r':Math.random()}));
			   	  PM.disableButton();
			   	  $.ajax({
					url:url,
					type:'GET',
					dataType:'xml'
					}).done(function(res){
						grepResult(res);
						var ret=$(res).find('ret-code').text();
						if(ret=='success'){
							top.location.href="http://"+$('#ipaddr').val();
						}else{
							alert($(res).find('msg').text());
							PM.enableButton();
						}
					});
			}});
	   	
	   	  
	   }});

	top.createButton(btnarr);
}

function STPStatistics(){
	//top.iframeSize({height:'hg400'});
	$.ajax({
		url:RouterConfig.stp_statistics+'dispatch=show stp port statistics-for-web&r='+Math.random(),
		type:'GET',
		dataType:'xml'
	}).done(function(result){
		grepResult(result);
		var port_data = {
				head : [{
					value : 'Port',
					type : 'nochangetext',
					cls : 'wd54'
				},{
					value : 'STP BPDUs Received',
					type : 'nochangetext',
					cls : 'wd80'
				},{
					value : 'STP BPDUs Transmitted',
					type : 'nochangetext',
					cls : 'wd80'
				},{
					value : 'RSTP BPDUs Received',
					type : 'nochangetext',
					cls : 'wd80'
				},{
					value : 'RSTP BPDUs Transmitted',
					type : 'nochangetext',
					cls : 'wd80'
				}
				],
				body : [
						]
			};
			trace(result);
			$(result).find('port').each(function(){
				var port=$(this);
				var o={};
				o.id=$.trim(port.find('id').text());
				o.data=[];
				o.data.push(o.id);
				o.data.push($.trim(port.find('stp-bpdu-recv').text()));
				o.data.push($.trim(port.find('stp-bpdu-trans').text()));
				o.data.push($.trim(port.find('rstp-bpdu-recv').text()));
				o.data.push($.trim(port.find('rstp-bpdu-trans').text()));
				port_data.body.push(o);

			});
		var tb=new PM.checkTable(port_data,$('div.tablecontentbody')[0]);
		top.createButton([
		                  {id:'REFRESH',func:function(){window.location.reload();}}
		            	]);
		
	});
}

function STPPortStatus(){
	//top.iframeSize({height:'hg400'});
	$.ajax({
		url:RouterConfig.stp_port_status+'dispatch=show stp port status-for-web&r='+Math.random(),
		type:'GET',
		dataType:'xml'
	}).done(function(result){
		grepResult(result);
		var port_data = {
				head : [{
					value : 'Port',
					type : 'nochangetext',
					cls : 'wd54'
				},{
					value : 'Port Protocol',
					type : 'nochangetext',
					cls : 'wd80'
				},{
					value : 'Port Role',
					type : 'nochangetext',
					cls : 'wd80'
				},{
					value : 'Port Status',
					type : 'nochangetext',
					cls : 'wd80'
				},{
					value : 'P2P Admin/Oper',
					type : 'nochangetext',
					cls : 'wd80'
				},{
					value : 'Edge Admin/Oper',
					type : 'nochangetext',
					cls : 'wd80'
				}
				],
				body : [
						]
			};
			trace(result);
			$(result).find('port').each(function(){
				var port=$(this);
				var o={};
				o.id=$.trim(port.find('id').text());
				o.data=[];
				o.data.push(o.id);
				o.data.push($.trim(port.find('port-protocol').text()));
				o.data.push($.trim(port.find('port-role').text()));
				o.data.push($.trim(port.find('port-status').text()));
				o.data.push($.trim(port.find('p2p').text()));
				o.data.push($.trim(port.find('edge').text()));
				port_data.body.push(o);

			});
		var tb=new PM.checkTable(port_data,$('div.tablecontentbody')[0]);
		top.createButton([
		                  {id:'REFRESH',func:function(){window.location.reload();}}
		            	]);
		
	});
}

function portStatistics(){
	$.ajax({
		url:RouterConfig.port_statistics+'dispatch=show port-statistic&r='+Math.random(),
		type:'GET',
		dataType:'xml'
	}).done(function(result){
		grepResult(result);
		var port_data = {
				check:true,
				head : [{
					value : '',
					type : "checkbox",
					id:'allcheck',
					cls : 'wd15'
				},{
					value : 'Port',
					type : 'nochangetext',
					cls : 'wd54'
				},{
					value : 'InOctets',
					type : 'nochangetext',
					cls : 'wd80'
				},{
					value : 'InUcastPkts',
					type : 'nochangetext',
					cls : 'wd80'
				},{
					value : 'InNUcastPkts',
					type : 'nochangetext',
					cls : 'wd80'
				},{
					value : 'InDiscard',
					type : 'nochangetext',
					cls : 'wd80'
				},{
					value : 'InError',
					type : 'nochangetext',
					cls : 'wd80'
				},{
					value : 'OutOctets',
					type : 'nochangetext',
					cls : 'wd80'
				},{
					value : 'OutUcastPkts',
					type : 'nochangetext',
					cls : 'wd80'
				},{
					value : 'OutNUcastPkts',
					type : 'nochangetext',
					cls : 'wd80'
				},{
					value : 'OutDiscard',
					type : 'nochangetext',
					cls : 'wd80'
				},{
					value : 'OutError',
					type : 'nochangetext',
					cls : 'wd80'
				}
				],
				body : [
						]
			};
			trace(result);
			$(result).find('port').each(function(){
				var port=$(this);
				var o={};
				o.id=$.trim(port.find('id').text());
				o.data=[];
				o.data.push(o.id);
				o.data.push($.trim(port.find('inoctets').text()));
				o.data.push($.trim(port.find('inucastpkts').text()));
				o.data.push($.trim(port.find('innucastpkts').text()));
				o.data.push($.trim(port.find('indiscards').text()));
				o.data.push($.trim(port.find('inerrors').text()));
				o.data.push($.trim(port.find('outoctets').text()));
				o.data.push($.trim(port.find('outucastpkts').text()));
				o.data.push($.trim(port.find('outnucastpkts').text()));
				o.data.push($.trim(port.find('outdiscards').text()));
				o.data.push($.trim(port.find('outerrors').text()));
				port_data.body.push(o);

			});
		var tb=new PM.checkTable(port_data,$('div.tablecontentbody')[0]);
		top.createButton([
		                  {id:'REFRESH',func:function(){window.location.reload();}},
		                  {id:"CLEAR",func:function(){
		                	  if($(this).attr('disabled'))return;
			                	 var checklist=tb.getChecklist();
			                	 var list=[];
			                	 $.each(checklist,function(){
			                		 if($(this).attr('checked')=='checked'){
			                			 list.push($(this).parent().parent().attr('_id'));
			                		 }
			                	  });
			                	 if(list.length==0){
			                		 alert($('#novlanchecked').val());
			                		 return;
			                	 }
			                	 var url=RouterConfig.port_statistics;
			                	 url=PM.setPara(url,'dispatch','clear-port-stats');
			                	 url=PM.setPara(url,'port-list',list.join(','));
			                	 url=PM.setPara(url,'r',Math.random());
			                	 $.ajax({
			          				url:url,
			          				type:'GET',
			          				dataType:'xml'
			          				}).done(function(res){
			          					$(this).attr('disabled',false);
			          					manageResult(res);
			          			});
			                	
			                	 
		                  }
		                  }
		            	]);
		
	});
}
function deviceReboot(){
	checkLoginStatus();
	top.createButton(
			[{id:'APPLY',func:function(){
		if($('#reboot_check').attr('checked')){
			top.popUp({title:'',height:90,width:240,type:'confirm',content:$('#tips').val(),confirmfunc:function(){
				
				var url=RouterConfig.device_reboot+'dispatch=cfg-reboot&r='+Math.random();
				$.ajax({url:url,dataType:'xml',timeout:10*1000}).done(function(res){
					PM.tmpflag=true;
					grepResult(res);
					if($(res).find('ret-code').text()=='error'){
						alert($(res).find('msg').text());
					}else{
						top.checkServer(function(){
							top.window.location.href=$.url().attr('base');
						});
						top.watisTips();
					}
				});
				setTimeout(function(){
					if(PM.tmpflag)return;
					top.checkServer(function(){
						top.window.location.href=$.url().attr('base');
					});
					top.watisTips();
				},1000*10);
			}});
		}
		else {
			alert($('#nocheck_tips').val());
		}
	}},{id:'CLEAR',func:function(){$('#reboot_check').attr('checked',false);}}]);
}
function STPPortConfiguration(){
	$.ajax({
		url:RouterConfig.stp_port_configuration+'dispatch=show-stp-port&r='+Math.random(),
		type:'GET',
		dataType:'xml'
	}).done(function(result){
		grepResult(result);
		var port_data = {
				editable:true,
				check : true,
				head : [{
					value : '',
					type : "checkbox",
					id:'allcheck',
					cls : 'wd15'
				},{
					value : 'Port',
					type : 'nochangetext',
					cls : 'wd54'
				},{
					value : 'Port Priority',
					type : 'text',
					id : 'port-priority',
					cls : 'wd120'
				},{
					value : 'Path Cost (0=auto)',
					type : 'text',
					id : 'path-cost',
					cls : 'wd120'
				},{
					value : 'Port Role',
					type : 'nochangetext',
					cls : 'wd120'
				},{
					value : 'Port State',
					type : 'nochangetext',
					cls : 'wd140'
				},{
					value : 'NonSTP',
					type : 'select',
					id:'nonstp',
					options:[{v:'',t:''},{v:'Y',t:'Y'},{v:'N',t:'N'}],
					cls : 'wd90'
				},{
					value : 'P2P',
					type : 'select',
					id:'p2p',
					options:[{v:'',t:''},{v:'Y',t:'Y'},{v:'N',t:'N'}],
					cls : 'wd90'
				},{
					value : 'Edge',
					type : 'select',
					id:'edge',
					options:[{v:'',t:''},{v:'Y',t:'Y'},{v:'N',t:'N'}],
					cls : 'wd90'
				},{
					value : 'Designated Bridge',
					type : 'nochangetext',
					cls : 'wd200'
				},{
					value : 'Designated Port',
					type : 'nochangetext',
					cls : 'wd200'
				}
				],
				body : [
						]
			};
			
		$(result).find('port').each(function(){
			var port=$(this);
			var o={};
			o.id=$.trim(port.find('id').text());
			o.data=[];
			o.data.push(o.id);
			o.data.push($.trim(port.find('port-priority').text()));
			o.data.push($.trim(port.find('path-cost').text()));
			o.data.push($.trim(port.find('port-role').text()));
			o.data.push($.trim(port.find('port-state').text()));
			o.data.push($.trim(port.find('nonstp').text()));
			o.data.push($.trim(port.find('p2p').text()));
			o.data.push($.trim(port.find('edge').text()));
			o.data.push($.trim(port.find('designated-bridge').text()));
			o.data.push($.trim(port.find('designated-port').text()));
			port_data.body.push(o);

		});
		var tb=new PM.checkTable(port_data,HE.$('div.tablecontentbody')[0]);
		
		top.createButton([
		                  {id:'REFRESH',func:function(){
		                	  if($(this).attr('disabled'))return;
		                	  	 window.location.reload();
		                	  }
		                  },
		                  {id:"APPLY",func:function(){
		                	  if($(this).attr('disabled'))return;
		                	 var checklist=tb.getChecklist();
		                	 var list=[];
		                	 $.each(checklist,function(){
		                		 if($(this).attr('checked')=='checked'){
		                			 list.push($(this).parent().parent().attr('_id'));
		                		 }
		                	  });
		                	 if(list.length==0){
		                		 alert($('#novlanchecked').val());
		                		 return;
		                	 }
		                	 var port_priority = $('#port-priority').val();
		                	 if(port_priority!=''&&(!PM.checkRange2(port_priority,0,240)||port_priority%16!=0)){
		                		 alert($('#port_priority_error').val());
		                		 return;
		                	 }
		                	 var path_cost=$('#path-cost').val();
		                	 if(path_cost!=''&&!PM.checkRange2(path_cost,0,20000000)){
		                		 alert($('#port_cost_error').val());
		                		 return ;
		                	 }
		                	 var url=RouterConfig.stp_port_configuration;
		                	 url=PM.setPara(url,'dispatch','cfg-stp-port');
		                	 url=PM.setPara(url,'port-list',list.join(','));
		                	 var tarr=['port-priority','path-cost','nonstp','p2p','edge'];
		                	 for(var i=0;i<tarr.length;i++){
		                		 if($('#'+tarr[i]).val()!=''){
		                			 url=PM.setPara(url,tarr[i],$('#'+tarr[i]).val());
		                		 }
		                	 }
		                	 url=PM.setPara(url,'r',Math.random());
		                	 top.popUp({height:140,width:280,content:$('#confirm_tips').val(),type:'confirm',confirmfunc:function(){
		                		 PM.disableButton();
		                		 top.watisTips();
		                		 setInterval(function(){
		                			 $.ajax({url:url,dataType:'xml',timeout:3*1000}).done(function(res){
		                				 window.location.reload();
		                				 top.closeTips();
		                			 });
		                		 },4*1000);
		                	 }});
						  }}]);
		
	});
}

function TFTPUpgrade(){
	//top.iframeSize({height:'hg400'});	
	checkLoginStatus();
	top.createButton([
                  {id:'CLEAR',func:function(){
                	  	 $('#tftp_server').val('');
                	  	 $('#file_name').val('');
                	  	 $('#file_type').val('Application');
                	  }
                  },
                  {id:"APPLY",func:function(){
                	
                	 var tftp_server = $('#tftp_server').val();
                	 if(!PM.checkIPAddress(tftp_server)){
                		 alert(RouterConfig.error.iperror);
                		 return;
                	 }
                	 var file_name=$('#file_name').val();
                	 if(file_name==''||/(\\|\/|\:|\*|<|>|\||\"|\?| )/.test(file_name)||file_name.length<1||file_name.length>64){
                		 alert($('#nameerror').val());
                		 return ;
                	 }
                	 var url=RouterConfig.tftp_upgrade;
                	 url+=decodeURIComponent($.param({"dispatch":'cfg-tftp',"server-ip":tftp_server,"file-type":$('#file_type').val(),"file-name":file_name,'r':Math.random()}));
                	 top.popUp({height:120,width:260,textOk:'Sure',textCancel:'Cancel',content:$('#confirm_tips').val(),type:'confirm',confirmfunc:function(){
                		 top.watisTips();
               			 $.ajax({url:url,dataType:'xml',timeout:180*1000}).done(function(res){
               				grepResult(res);
               				top.closeTips();
               				var ret=$(res).find('ret-code').text();
               				if(ret=='success'){
               					top.popUp({height:120,width:260,textOk:'Yes',textCancel:'No',content:$('#jump_tips').val(),type:'confirm',confirmfunc:function(){
               							window.location.href=RouterConfig.orgData.Maintenance.Reset['Device Reboot'];
               						}
               					});
               				}else{
               					alert($(res).find('msg').text());
               				}
               			 });
                	 }});
				  }}]);
		
	
}

function systemInformation(){
	$.ajax({
		url:RouterConfig.system_information+'dispatch=show sys-info&r='+Math.random(),
		type:'GET',
		dataType:'xml'
	}).done(function(result){
		grepResult(result);
		var o={},o2={};
		//原来模版中不能定义xxx-xx，必须是xx_xx
		o['sys_name']=$.trim($(result).find('sys-name').text());
		o['sys_location']=$.trim($(result).find('sys-location').text());
		o['sys_contact']=$.trim($(result).find('sys-contact').text());
		o['serial_number']=$.trim($(result).find('serial-number').text());
		o['sys_obj_id']=$.trim($(result).find('sys-obj-id').text());
		o['date_time']=$.trim($(result).find('date-time').text());
		o['sys_up_time']=$.trim($(result).find('sys-up-time').text());
		o['base_mac_addr']=$.trim($(result).find('base-mac-addr').text());
		trace(o);
		o2['model_name']=$.trim($(result).find('model-name').text());
		o2['boot_version']=$.trim($(result).find('boot-version').text());
		o2['soft_version']=$.trim($(result).find('soft-version').text());
		
		$('div.tablecontentbody:eq(0)').html(_.template($('#infos').html(),o));
		$('div.tablecontentbody:eq(1)').html(_.template($('#vers').html(),o2));
		top.createButton([
		                  {id:'REFRESH',func:function(){
		                	 if($(this).attr('disabled'))return;
		                	  	 window.location.reload();
		                	 }
		                  },
		                  {id:"APPLY",func:function(){
		                	 if($(this).attr('disabled'))return;
		                	 var re=/^[a-zA-Z0-9_]{1,19}$/;
		                	 if(!re.test($('input:eq(0)').val())){
		                		 alert($('#nameerr').val());
		                		 return;
		                	 }
		                	 if(!re.test($('input:eq(1)').val())){
		                		 alert($('#locaerr').val());
		                		 return;
		                	 }
		                	 if(!re.test($('input:eq(2)').val())){
		                		 alert($('#conterr').val());
		                		 return;
		                	 }
		                	 var url=RouterConfig.system_information;
		                	 //url+='dispatch=cfg-sysinfo&name='+$('input:eq(0)').val()+'&location='+$('input:eq(1)').val()+'&Contact='+$('input:eq(2)').val();
		                	 url+=decodeURIComponent($.param({
		                		 dispatch:'cfg-sysinfo',
		                		 name:$('input:eq(0)').val(),
		                		 location:$('input:eq(1)').val(),
		                		 Contact:$('input:eq(2)').val(),
		                		 r:Math.random()
		                	 }));
						  	 $.ajax({url:url}).done(function(res){
						  		manageResult(res);
						  	 });
		                  }}]);
		
	});
}

function STPGlobalConfiguration(){
	$.ajax({
		url:RouterConfig.stp_global_configuration+'dispatch=show-stp-global&r='+Math.random()
	}).done(function(res){
		grepResult(res);
		var o={};
		o['identifier']=$.trim($(res).find('bridge-identifier').text());
		o['time_since']=$.trim($(res).find('time-sin-last-topology-change').text());
		o['desginated_root']=$.trim($(res).find('designated-root').text());
		o['root_port']=$.trim($(res).find('root-port').text());
		o['root_path_cost']=$.trim($(res).find('root-path-cost').text());
		o['max_age']=$.trim($(res).find('root-max-age').text());
		o['forward_delay']=$.trim($(res).find('root-forward-delay').text());
		o['hello_time']=$.trim($(res).find('root-hello-time').text());
		$('div.tablecontentbody:eq(1)').html(_.template($('#stp_status').html(),o));
		
		var o2={};
		o2['pri']=$.trim($(res).find('bridge-pri').text());
		o2['max_age']=$.trim($(res).find('bridge-max-age').text());
		o2['hello_time']=$.trim($(res).find('bridge-hello-time').text());
		o2['forward_delay']=$.trim($(res).find('bridge-forward-delay').text());
		o2['trans_limit']=$.trim($(res).find('trans-limit').text());
		$('div.tablecontentbody:eq(0)').html(_.template($('#global_setting').html(),o2));
		
		$('select:eq(0)').val($.trim($(res).find('status').text()));
		$('select:eq(1)').val($.trim($(res).find('mode').text()));
		
		top.createButton([
		                  {id:'REFRESH',func:function(){
		                	 if($(this).attr('disabled'))return;
		                	  	 window.location.reload();
		                	 }
		                  },
		                  {id:"APPLY",func:function(){
		                	 if($(this).attr('disabled'))return;
		                	 if(!PM.checkRange2($('input:eq(0)').val(),0,61440)||$('input:eq(0)').val()%4096!=0||!PM.checkRange2($('input:eq(1)').val(),6,40)||!PM.checkRange2($('input:eq(2)').val(),1,10)||!PM.checkRange2($('input:eq(3)').val(),4,30)){
		                		 alert($('#numerror').val())
		  						 return;
		                	 }
		                	 if(2*(parseInt($('input:eq(3)').val())-1)<$('input:eq(1)').val()||$('input:eq(1)').val()<2*(parseInt($('input:eq(2)').val())+1)){
		                		 alert($('#relationerr').val());
		                		 return;
		                	 }
		                	 var url=RouterConfig.stp_global_configuration;
		                	 url+=decodeURIComponent($.param({'dispatch':'cfg-stp-global','sts':$('select:eq(0)').val(),'stm':$('select:eq(1)').val(),'bp':$('input:eq(0)').val(),'bma':$('input:eq(1)').val(),'bht':$('input:eq(2)').val(),'bfd':$('input:eq(3)').val(),'r':Math.random()}));
		                	 top.popUp({height:120,width:260,textOk:'Sure',textCancel:'Cancel',content:$('#confirm_tips').val(),type:'confirm',confirmfunc:function(){
		                		 top.watisTips();
		                		 $.ajax({url:url}).done(function(res){
		                			 top.closeTips();
		                			    if($(res).find('ret-code').text()!='success'){
		                			    	alert($(res).find('msg').text());
		                			    }
							  	 }); 
		                		 setInterval(function(){
		                			 $.ajax({
		                					url:RouterConfig.stp_global_configuration+'dispatch=show-stp-global'
		                				}).done(function(res){
		                					grepResult(res);
		                					top.closeTips();
		                					if($(res).find('bridge-identifier').length>0){
		                						window.location.reload();	
		                					}
		                		 		});
		                		},5*1000);
		                	 }});
		                	
		                 			
		                  }}]);
		
	});
}


function staticMacAddress(){
	var ports=$('select:eq(0)');
	for(var i=1;i<=RouterConfig.portnum;i++){
		ports.append('<option value="'+RouterConfig.prefix+'/'+i+'">'+RouterConfig.prefix+'/'+i+'</option>');
	}
	var port_data = {
			check:true,
			pagesize:100,
			head : [ {
				value : '',
				type : "checkbox",
				id:'allcheck',
				cls : 'wd15'
			}, {
				value : 'MAC Address',
				type : 'nochangetext',
				cls : 'wd120'
			}, {
				value : 'VLAN ID(1-4094)',
				type : 'nochangetext',
				cls : 'wd90'
			},
			{
				value : 'Port',
				type : 'nochangetext',
				cls : 'wd80'
			},
			{
				value : 'Type',
				type : 'nochangetext',
				cls : 'wd80'
			}],
			body:[]
		};
	$.ajax({
		url:RouterConfig.static_mac_address+'dispatch=show fdb static&r='+Math.random(),
		type:'GET',
		dataType:'xml'
	}).done(function(res){
		grepResult(res);
		$(res).find('r').each(function(){
			var p=$(this);
			var o={};
			o.id=$.trim(p.find('mc').text());
			o.data=[];
			o.data.push(o.id);
			o.data.push($.trim(p.find('vid').text()));
			o.data.push($.trim(p.find('p').text()));
			o.data.push($.trim(p.find('t').text()));
			port_data.body.push(o);
		});
		var tb=new PM.checkTable(port_data,$('div.tablecontentbody')[1]);
		
		var btnarr=[{id:'REFRESH',func:function(){if($(this).attr('disabled'))return;window.location.reload();}}];
		if(tb.getChecklist().length>0){
			btnarr.push({id:'DELETE',func:function(){
				if($(this).attr('disabled'))return;
			     var checklist=tb.getChecklist();
            	 var list=[];
            	 var vidlist=[];
            	 $.each(checklist,function(){
            		 if($(this).attr('checked')=='checked'){
            			 list.push($(this).parent().parent().attr('_id'));
            			 vidlist.push($(this).parent().next().next().html());
            		 }
            			 
            	  });
            	  
            	  if(list.length==0){
            		  alert($('#novlanchecked').val());
            		  return;
            	  }
            	  
            	  var url=RouterConfig.static_mac_address+decodeURIComponent($.param({'dispatch':'del-static-mac','mac-addr-list':list.join(','),'vid-list':vidlist.join(',')}));
            	  PM.disableButton();
            	  $.ajax({
      				url:url,
      				type:'GET',
      				dataType:'xml'
      				}).done(function(res){
      					manageResult(res);
      			});
              }});
		}
		if(tb.needPaging()){
			btnarr.push({id:'NEXT',func:function(){tb.nextPage();}});
			btnarr.push({id:'PREV',func:function(){tb.prevPage();}});
		}
		
		top.createButton(btnarr);
	});
	
	//bind add event and validate
	
	
	StaticMACModel=Backbone.Model.extend({
		initialize:function(){
			this.port=$('select:eq(0)');
			this.type=$('select:eq(1)');
			this.address=$('input:eq(0)');
			this.vid=$('input:eq(1)');
		},
		validate2:function(){
			if(!PM.checkMACAddress(this.address.val())){
				alert($('#addresserror').val());
				return false;
			}
			if(!PM.checkRange2(this.vid.val(),1,4094)){
				alert($('#viderror').val());
				return false;
			}
			return true;
		}
	});
	
	
	StaticMACView=Backbone.View.extend({
		initialize:function(){
		},
		events:{
			'click input[type=button]':'add',
			'change select:eq(1)':'change'
		},
		add:function(){
			var p=new StaticMACModel();
			var flag=p.validate2();//isValid();
			//p.on('error',function(){alert(2);});// 发现用起来和想的不一样
			if(flag){
			 PM.disableButton();
			 $('#pro_add').attr('disabled',true);
			  var param={'dispatch':'add-static-mac','mac-addr':p.address.val(),'vid':p.vid.val(),'port':p.port.val(),'type':p.type.val(),'r':Math.random()};
			 var url=RouterConfig.static_mac_address+decodeURIComponent($.param(param));
           	  $.ajax({
     				url:url,
     				type:'GET',
     				dataType:'xml'
     				}).done(function(res){
     					manageResult(res);
     					$('#pro_add').attr('disabled',false);
     			});
			}
		},
		change:function(){
			if($(this.el).find('select:eq(1)').val()=='Blackhole'){
				$(this.el).find('select:eq(0)').attr('disabled',true);
			}else{
				$(this.el).find('select:eq(0)').attr('disabled',false);
			}
		}
	});
	
	var pv=new StaticMACView({el:$('div.tablecontentbody:eq(0)')});
}


function macTable(){
	var port_data = {
			pagesize:100,
			head : [  {
				value : 'VLAN ID',
				type : 'nochangetext',
				cls : 'wd90'
			},{
				value : 'MAC Address',
				type : 'nochangetext',
				cls : 'wd120'
			},
			{
				value : 'Port',
				type : 'nochangetext',
				cls : 'wd80'
			},
			{
				value : 'Type',
				type : 'nochangetext',
				cls : 'wd80'
			}],
			body:[]
		};
	var url=RouterConfig.mac_table+'dispatch=show fdb';
	var loca=window.location.href;
	var type=PM.getPara(loca,'type');//是vlan ,port,mac-address中的一个
	var value=PM.getPara(loca,'value');
	if(type!=''){
		url+=' '+type+' '+value;
		$('select').val(type);
		$('input[type=text]').val(value);
	}
	url+='&r='+Math.random();
	$.ajax({
		url:url,
		type:'GET',
		dataType:'xml'
	}).done(function(res){
		grepResult(res);
		$(res).find('r').each(function(){
			var p=$(this);
			var o={};
			o.id=$.trim(p.find('vid').text());
			o.data=[];
			o.data.push(o.id);
			o.data.push($.trim(p.find('mc').text()));
			o.data.push($.trim(p.find('p').text()));
			o.data.push($.trim(p.find('t').text()));
			port_data.body.push(o);
		});
		var tb=new PM.checkTable(port_data,$('div.tablecontentbody')[1]);
		
		var btnarr=[{id:'REFRESH',func:function(){if($(this).attr('disabled'))return;window.location.reload();}}];
		if(tb.needPaging()){
			btnarr.push({id:'NEXT',func:function(){tb.nextPage();}});
			btnarr.push({id:'PREV',func:function(){tb.prevPage();}});
		}
		
		top.createButton(btnarr);
	});
	//bind add event and validate
	MACTableModel=Backbone.Model.extend({
		initialize:function(){
			this.type=$('select');
			this.value=$('input[type=text]');
		},
		validate2:function(){
			switch(this.type.val()){
			case "vlan":
				if(!PM.checkRange2(this.value.val(),1,4094)){
					alert($('#viderror').val());
					return false;
				}
				break;
			case "mac-address":
				if(!PM.checkMACAddress(this.value.val())){
					alert($('#addresserror').val());
					return false;
				}
				break;
			case "port":
				if(!/^1\/[\d]{1,2}$/.test(this.value.val())||!PM.checkRange2(this.value.val().split('/')[1],1,RouterConfig.portnum)){
					alert($('#porterror').val());
					return false;	
				}
				break;
			default:
				alert($('#filtertype').val());
				return false;
			}
			return true;
			
		}
	});
	MACTableView=Backbone.View.extend({
		initialize:function(){
			this.render();
		},
		render:function(){
			this.model=new MACTableModel();
		},
		events:{
			'click input[type=button]:eq(0)':'doFilter',
			'click input[type=button]:eq(1)':'doClear'
		},
		doFilter:function(){
			var flag=this.model.validate2();//isValid();
			//p.on('error',function(){alert(2);});// 发现用起来和想的不一样
			if(flag){
			 PM.disableButton();
			 $('#pro_add').attr('disabled',true);
			 $('#pro_clear').attr('disabled',true);
			 trace($.url());
			// return;
			 var loca=window.location.href;
			 loca=PM.setPara(loca,'type',this.model.type.val());
			 loca=PM.setPara(loca,'value',this.model.value.val());
			 window.location.href=loca;
			
			}
		},
		doClear:function(){
			var _this=this;
			var flag=this.model.validate2();//isValid();
			var tmp='';
			if(flag){
				switch(this.model.type.val()){
				case "vlan":
					tmp="in VLAN ";
					break;
				case "port":
					tmp='on port ';
					break;
				}
				tmp+=this.model.value.val();
				top.popUp({height:120,width:260,textOk:'Sure',textCancel:'Cancel',content:_.template($('#confirm_tips').html(),{variable:tmp}),type:'confirm',confirmfunc:function(){
					PM.disableButton();
					$('#pro_add').attr('disabled',true);
					$('#pro_clear').attr('disabled',true);
					var url=RouterConfig.mac_table+decodeURIComponent($.param({'dispatch':'clear-fdb',type:_this.model.type.val(),value:_this.model.value.val(),'r':Math.random()}));
            		$.ajax({url:url}).done(function(res){
            			grepResult(res);
            			
            			if($(res).find('ret-code').text()=='success'){
            				var loca=window.location.href;
            				loca=PM.removePara(loca,'type');
            				loca=PM.removePara(loca,'value');
            				window.location.href=loca;
            				
            			}else{
            				alert($(res).find('msg').text());
            				$('#pro_add').attr('disabled',false);
    						$('#pro_clear').attr('disabled',false);
    						PM.enableButton();
            			}
					}); 
            	 }});
			}
		}
	});
	
	var pv=new MACTableView({el:$('div.tablecontentbody:eq(0)')});
}

function portBasic(){
	var url=RouterConfig.port_basic+'dispatch=show port basic&r='+Math.random();
	$.ajax({
		url:url
	}).done(function(res){
		grepResult(res);
		var port_data = {
				editable:true,
				check : true,
				head : [ {
					value : '',
					type : "checkbox",
					id:'allcheck',
					cls : 'wd15'
				}, {
					value : 'Port',
					type : 'nochangetext',
					cls : 'wd54'
				}, {
					value : 'Admin Mode',
					type : 'select',
					options:[{v:'',t:''},{v:'Enable',t:'Enable'},{v:'Disable',t:'Disable'}],
					cls : 'wd90'
				},{
					value : 'Port Speed',
					type : 'select',
					options:[
					         {v:'',t:''},
					         {v:'Auto',t:'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Auto'},
					         {v:'10Mbps Half Duplex',t:'10Mbps Half Duplex'},
					         {v:'10Mbps Full Duplex',t:'10Mbps Full Duplex'},
					         {v:'100Mbps Half Duplex',t:'100Mbps Half Duplex'},
					         {v:'100Mbps Full Duplex',t:'100Mbps Full Duplex'},
					         {v:'1000Mbps Full Duplex',t:'1000Mbps Full Duplex'}
					         ],
					cls : 'wd90'
				},{
					value:'Physical Status',
					type : 'nochangetext',
					cls : 'wd90'
				},{
					value:'Link Status',
					type : 'nochangetext',
					cls : 'wd90'
				},{
					value:'Maximum Frame Length',
					type:'nochangetext',
					size:'6',
					cls:'wd140'
				},{
					value:'PVID',
					type : 'nochangetext',
					cls : 'wd54'
				}
				],
				body : [
					
						]
			};
			
		$(res).find('interface').each(function(){
			var node=$(this);
			var o={};
			o.id=$.trim(node.find('ifname').text());
			o.data=[];
			o.data.push(o.id);
			o.data.push($.trim(node.find('adm-mode').text()));
			o.data.push($.trim(node.find('port-speed').text()));
			o.data.push($.trim(node.find('phy-st').text()));
			o.data.push($.trim(node.find('link-st').text()));
			o.data.push($.trim(node.find('mtu').text()));
			o.data.push($.trim(node.find('pvid').text()));
			port_data.body.push(o);
		});
		trace(port_data);
		var tb=new PM.checkTable(port_data,$('div.tablecontentbody:eq(0)'));
		top.createButton(
				[
				 {
					 id:'REFRESH',
					 func:function(){if($(this).attr('disabled'))return;window.location.reload();}
				 },
				 {
					 id:"APPLY",
					 func:function(){
						 if($(this).attr('disabled'))return;
						 var checklist=tb.getChecklist();
	                	 var list=[];
	                	 $.each(checklist,function(){
	                		 if($(this).attr('checked')=='checked'){
	                			 list.push($(this).parent().parent().attr('_id'));
	                		 }
	                	  });
	                	 if(list.length==0){
	                		 alert($('#novlanchecked').val());
	                		 return;
	                	 }	
						
					   	  var param={'dispatch':'cfg-port-basic','port-list':list.join(','),'r':Math.random()};
					   	  var cnt=$('div.tablecontentbody:eq(0)');
					   	  if(cnt.find('select:eq(0)').val()!=''){
					   		  param['admin-mode']=cnt.find('select:eq(0)').val();
					   	  }
					      var url=RouterConfig.port_basic+decodeURIComponent($.param(param));
					   	  if(cnt.find('select:eq(1)').val()!=''){
					   		  url+='&speed='+cnt.find('select:eq(1)').val();
					   		  //param['speed']=cnt.find('select:eq(1)').val();
					   	  }
					   	  //var url=RouterConfig.port_basic+decodeURIComponent($.param(param));
					   	  PM.disableButton();
					   	  $.ajax({
							url:url,
							type:'GET',
							dataType:'xml'
							}).done(function(res){
								setTimeout(function(){
									//alert($(res).text());
									manageResult(res);
								},2*1000);
								
							});
					 }
				 }]);
	});
	
}

function globalMacSettings(){
	var url=RouterConfig.global_mac_settings+"dispatch=show fdb-aging-learning&r="+Math.random();
	$.ajax({url:url}).done(function(res){
		grepResult(res);
		$('#ag_time').val($.trim($(res).find('aging-time').text()));
		$('select').val($.trim($(res).find('mac-learning').text()));
		$('#time_apply').click(function(){
			if(!PM.checkRange2($('#ag_time').val(),10,1000000)){
				alert($('#timeerr').val());
				return;
			}
			var url=RouterConfig.global_mac_settings+'dispatch=cfg-fdb-aging&aging-time='+$('#ag_time').val()+'&r='+Math.random();
			$.ajax({url:url}).done(function(res){
				manageResult(res);
			});
		});
		$('#learning_apply').click(function(){
			if($('select').val()==''){
				alert($('#learningerr').val());
				return;
			}
			var url=RouterConfig.global_mac_settings+'dispatch=cfg-fdb-learnig&status='+$('select').val()+"&r="+Math.random();
			$.ajax({url:url}).done(function(res){
				manageResult(res);
			});
		});
		
	});
	top.createButton([{id:'REFRESH',func:function(){window.location.reload();}}]);
}
function Ping(){
	checkLoginStatus();
	top.createButton([{id:'APPLY',func:function(){
			if(!PM.checkIPAddress($('#ip_address').val())&&!PM.checkHostname($('#ip_address').val())){
				alert($('#chkip_host_err').val());
				return;
			}
			if(!PM.checkRange2($('#count').val(),1,15)){
				alert($('#counterror').val());
				return;
			}
			if(!PM.checkRange2($('#size').val(),8,12000)){
				alert($('#sizeerror').val());
				return;
			}
			$('textarea').val('');
			var url=RouterConfig.ping+decodeURIComponent($.param({'dispatch':'cfg-ping','ip':$('#ip_address').val(),'count':$('#count').val(),'size':$('#size').val(),'r':Math.random()}));
			top.watisTips();
			$.ajax({url:url}).done(function(res){
				top.closeTips();
				grepResult(res);
				if($(res).find('ret-code').text()=='error'){
					alert($(res).find('msg').text());
				}else{
					$('textarea').val($(res).find('msg').text());
					$('#ip_address').val('');
				}
			});
		}}]);
}
function traceRoute(){
	checkLoginStatus();
	top.createButton([{id:'APPLY',func:function(){
			if(!PM.checkIPAddress($('#ip_address').val())&&!PM.checkHostname($('#ip_address').val())){
                alert($('#chkip_host_err').val());
				return;
			}
			if(!PM.checkRange2($('#probe').val(),1,10)){
				alert($('#probeerr').val());
				return;
			}
			if(!PM.checkRange2($('#ttl').val(),1,30)){
				alert($('#ttlerr').val());
				return;
			}
			if(!PM.checkRange2($('#udp').val(),1,65535)){
				alert($('#udperr').val());
				return;
			}
			if(!PM.checkRange2($('#interv').val(),1,10)){
				alert($('#inteverr').val());
				return;
			}
			$('textarea').val('');
			var url=RouterConfig.traceroute+decodeURIComponent($.param({'dispatch':'cfg-traceroute','ip':$('#ip_address').val(),'probe':$('#probe').val(),'maxttl':$('#ttl').val(),'port':$('#udp').val(),'interval':$('#interv').val(),'r':Math.random()}));
			top.watisTips();
			$.ajax({url:url}).done(function(res){
				grepResult(res);
				top.closeTips();
				if($(res).find('ret-code').text()=='error'){
					alert($(res).find('msg').text());
				}else{
					$('textarea').val($(res).find('msg').text());
					$('#ip_address').val('');
				}
			});
		}}]);
}

function userManagement() {
	var url = RouterConfig.user_management + 'dispatch=show all-userinfo&r='+Math.random();
	$.ajax({
				url : url
			}).done(
					function(res) {
						grepResult(res);
						$('#btn_add').click(
								function() {
									if (!/[\d|\w]{1,31}/.test($('#user_name').val())) {
										alert($('#nameerr').val());
										return;
									}
									if (!/\S{1,20}/.test($('#pwd').val())) {
										alert($('#pwderr').val());
										return;
									}
									var url = RouterConfig.user_management
											+ 'dispatch=add-userinfo';
									url = PM.setPara(url, 'name', $('#user_name').val());
									url = PM.setPara(url, 'pwd', $('#pwd').val());
									url = PM.setPara(url, 'privilege', $('select').val());
									url = PM.setPara(url,'r',Math.random());
									$.ajax({
										url : url
									}).done(function(res) {
										manageResult(res);
									});
								});
						var port_data = {
							check : true,
							head : [ {
								value : '',
								type : "checkbox",
								id : 'allcheck',
								cls : 'wd15'
							}, {
								value : 'User Name',
								type : 'nochangetext',
								cls : 'wd300'
							}, {
								value : 'Privilege',
								type : 'nochangetext',
								cls : 'wd120'
							} ],
							body : [ {
								id : 'admin',
								data : [ 'admin', 'Configure' ],
								nocheck : true
							} ]
						};
						$(res).find('user-info').each(
								function() {
									var id = $.trim($(this).find('name').text());
									if (id != 'admin'){
										var o = {};
										o.id = id;
										o.data = [
												o.id,
												$.trim($(this).find('privilege').text()) 
												];
										port_data.body.push(o);
									}
								});
						var tb = new PM.checkTable(port_data,$('div.tablecontentbody')[1]);

						top.createButton([
										{
											id : 'DELETE',
											func : function() {
												var checklist = tb.getChecklist();
												var list = [];
												$.each(checklist,function() {
																	if ($(this).attr('checked') == 'checked')
																		list.push($(this).parent().parent().attr('_id'));
																});

												if (list.length == 0
														&& $('#allcheck').attr('checked') == 'checked') {
													alert($('#defaultvlandelete').val());
													return;
												} else if (list.length == 0) {
													alert($('#nochecked').val());
													return;
												}

												var url = RouterConfig.user_management;
												url = PM.setPara(url,'dispatch','del-userinfo');
												url = PM.setPara(url,'name-list', list.join(','));
												url = PM.setPara(url,'r',Math.random());
												$.ajax({
													url : url
												}).done(function(res) {
													manageResult(res);
												});
											}
										},
										{
											id : 'REFRESH',
											func : function() {
												if ($(this).attr('disabled'))
													return;
												window.location.reload();
											}
										} ]);

					});
}

function portIsolation(){
	var radiomap2={'0':'ingress','1':'egress','2':'both','3':'none'};//
	var trArr=[$('table:eq(1) tr:eq(0)'),$('table:eq(1) tr:eq(1)'),$('table:eq(1) tr:eq(2)'),$('table:eq(1) tr:eq(3)'),$('table:eq(1) tr:eq(4)')];
	for(var i=1;i<=RouterConfig.portnum;i++){
		trArr[0].append('<th class="wd25">'+i+'</th>');
		for(var j=1;j<trArr.length;j++){
			trArr[j].append('<th class="wd25"><input type="radio" class="taArr'+j+'" name="gressradio'+i+'" value="'+radiomap2[j-1]+'_'+i+'" /></th>');
		}
	}
	
	var defgroup=PM.getPara(location.href,'group');
	if(defgroup!=''){
		$.ajax({
			url:RouterConfig.port_isolation+'dispatch=show isol-group '+defgroup+'&r='+Math.random()
		}).done(function(result){
			var pmo=new PortIsolation(result,{'group':defgroup,'table1':$('#table1'),'table2':$('#table2'),'table3':$('#table3')});
			top.createButton([{id:'APPLY',func:function(){
				pmo.submit();
			}},{id:'REFRESH',func:function(){window.location.reload();}}]);
		});
	}else{
		var sel_group=$('#sel_group').change(function(){
			var group=$(this).val();
			var url=location.href;
			if(group!=''){
				url=PM.setPara(url,'group',group);
			}else{
				url=PM.removePara(url,'group');
			}
			window.location.href=url;
		});
		top.createButton([{id:'APPLY',func:function(){},cls:'disable'},{id:'REFRESH',func:function(){},cls:'disable'}]);
	}
}

function DNSHostConfiguration(){
    $.ajax({
        url:RouterConfig.dns_host_configuration+'dispatch=how-dns-host-config&r='+Math.random(),
        type:'GET',
        dataType:'xml'
    }).done(function(result){
            grepResult(result);
            var port_data = {
                check : true,
                pageable:true,
                pagesize:100,
                head : [{
                    value : '',
                    type : "checkbox",
                    id:'allcheck',
                    cls : 'wd15'
                },{
                    value : 'Host Name',
                    type : 'nochangetext',
                    cls : 'wd300'
                },{
                    value : 'Host IP',
                    type : 'nochangetext',
                    cls : 'wd180'
                }
                ],
                body : [
                ]
            };
            $(result).find('r').each(function(){
                var o={};
                o.id=$.trim($(this).find('host-name').text());
                o.data=[];
                o.data.push(o.id);
                o.data.push($.trim($(this).find('host-ip').text()));
                port_data.body.push(o);
            });

            var tb=new PM.checkTable(port_data,$('div.tablecontentbody:eq(1)'));
            var btnarr=[
                {id:'REFRESH',func:function(){window.location.reload();}},
                {id:"ADD",func:function(){
                    var host_name=$('#host_name').val();
                    var host_ip=$('#host_ip').val();
                    if(!host_name.match(/^[\w|\d|\-|\.]{1,255}$/ig)){
                        alert($('#host_name_err').val());
                        return;
                    }
                    if(!PM.checkIPAddress(host_ip)){
                        alert($('#host_ip_err').val());
                        return
                    }
                    var url=url=RouterConfig.dns_server_configuration;
                    url=PM.setPara(url,"dispatch",'add-dns-hostconfig');
                    url=PM.setPara(url,'host-name',host_name);
                    url=PM.setPara(url,'host-ip',host_ip);
                    url=PM.setPara(url,'r',Math.random());
                    $.ajax({url:url,dataType:'xml'}).done(function(res){
                        manageResult(res);
                    });
                }},{id:"DELETE",func:function(){
                    var cnt=$('div.tablecontentbody:eq(1)');
                    var checklist=tb.getChecklist();
                    var list=[];
                    var list_ip=[];
                    $.each(checklist,function(){
                        if($(this).attr('checked')=='checked'){
                            var items = $(this).parent().parent();
                            list.push(items.attr('_id'));
                            list_ip.push(items.find(':last-child').text());
                        }
                    });
                    if(list.length==0){
                        alert($('#novlanchecked').val());
                        return;
                    }
                    var url=RouterConfig.dns_host_configuration;
                    url=PM.setPara(url,"dispatch",'del-dns-hostconfig');
                    url=PM.setPara(url,'host-name-list',list.join(','));
                    url=PM.setPara(url,'host-ip-list',list_ip.join(','));
                    url=PM.setPara(url,'r',Math.random());
                    $.ajax({url:url,dataType:'xml'}).done(function(res){
                        manageResult(res);
                    });
                }
                }];
            if(tb.needPaging()){
                btnarr.push({id:'NEXT',func:function(){tb.nextPage();}});
                btnarr.push({id:'PREV',func:function(){tb.prevPage();}});
            }
            top.createButton(btnarr);

        });

}

function DNSServerConfiguration(){
    $.ajax({
        url:RouterConfig.dns_server_configuration+'dispatch=show-dns-server-config&r='+Math.random(),
        type:'GET',
        dataType:'xml'
    }).done(function(result){
            grepResult(result);
            var port_data = {
                check : true,
                pageable:true,
                pagesize:100,
                head : [{
                    value : '',
                    type : "checkbox",
                    id:'allcheck',
                    cls : 'wd15'
                },{
                    value : 'DNS Server IP',
                    type : 'nochangetext',
                    cls : 'wd180'
                }],
                body : [
                ]
            };
            $(result).find('server-ip').each(function(){
                var o={};
                o.id=$.trim($(this).text());
                o.data=[];
                o.data.push(o.id);
                port_data.body.push(o);
            });

            var tb=new PM.checkTable(port_data,$('div.tablecontentbody:eq(1)'));
            var btnarr=[
                {id:'REFRESH',func:function(){window.location.reload();}},
                {id:"ADD",func:function(){
                    var dns_id=$('#dns_id').val();
                    if(!PM.checkIPAddress(dns_id)){
                        alert($('#dns_id_err').val());
                        return
                    }
                    var url=url=RouterConfig.dns_server_configuration;
                    url=PM.setPara(url,"dispatch",'add-dns-server');
                    url=PM.setPara(url,'dns-server-ip',dns_id);
                    url=PM.setPara(url,'r',Math.random());
                    $.ajax({url:url,dataType:'xml'}).done(function(res){
                        manageResult(res);
                    });
                }},{id:"DELETE",func:function(){
                    var cnt=$('div.tablecontentbody:eq(1)');
                    var checklist=tb.getChecklist();
                    var list=[];
                    $.each(checklist,function(){
                        if($(this).attr('checked')=='checked'){
                            list.push($(this).parent().parent().attr('_id'));
                        }
                    });
                    if(list.length==0){
                        alert($('#novlanchecked').val());
                        return;
                    }
                    var url=RouterConfig.dns_server_configuration;
                    url=PM.setPara(url,"dispatch",'del-dns-server');
                    url=PM.setPara(url,'dns-server-ip-list',list.join(','));
                    url=PM.setPara(url,'r',Math.random());
                    $.ajax({url:url,dataType:'xml'}).done(function(res){
                        manageResult(res);
                    });
                }
                }];
            if(tb.needPaging()){
                btnarr.push({id:'NEXT',func:function(){tb.nextPage();}});
                btnarr.push({id:'PREV',func:function(){tb.prevPage();}});
            }
            top.createButton(btnarr);

        });

}

function IGMPQuerierVLANConfiguration(){

    $.ajax({
        url:RouterConfig.igmp_querier+'dispatch=show igmp-querier-vlan-cfg&r='+Math.random(),
        type:'GET',
        dataType:'xml'
    }).done(function(result){
            grepResult(result);
            var port_data = {
                editable:true,
                check : true,
                pageable:true,
                pagesize:50,
                head : [{
                    value : '',
                    type : "checkbox",
                    id:'allcheck',
                    cls : 'wd15'
                },{
                    value : 'VLAN ID',
                    type : 'nochangetext',
                    cls : 'wd54'
                },{
                    value : 'Query Mode',
                    type : 'select',
                    options:[{v:'',t:''},{v:'Enable',t:'Enable'},{v:'Disable',t:'Disable'}],
                    cls : 'wd90'
                },{
                    value:'Query Interval',
                    type:'text',
                    cls:'wd90'
                },{
                    value:'Maximum Response Time',
                    type:'text',
                    cls:'wd120'
                },{
                    value:'Last Member Query Interval',
                    type:'text',
                    cls:'wd140'
                },{
                    value:'Snooping Querier SIP',
                    type:'text',
                    cls:'wd180'
                }
                ],
                body : [
                ]
            };
            $(result).find('vlan').each(function(){
                var o={};
                o.id=$.trim($(this).find('vid').text());
                o.data=[];
                o.data.push(o.id);
                o.data.push($.trim($(this).find('mode').text()));
                o.data.push($.trim($(this).find('query-inval').text()));
                o.data.push($.trim($(this).find('max-response-time').text()));
                o.data.push($.trim($(this).find('last-member-query-inval').text()));
                o.data.push($.trim($(this).find('sip').text()));
                port_data.body.push(o);
            });

            var tb=new PM.checkTable(port_data,$('div.tablecontentbody:eq(0)'));
            var btnarr=[
                {id:'REFRESH',func:function(){window.location.reload();}},
                {id:"APPLY",func:function(){
                    var cnt=$('div.tablecontentbody:eq(0)');
                    var checklist=tb.getChecklist();
                    var list=[];
                    $.each(checklist,function(){
                        if($(this).attr('checked')=='checked'){
                            list.push($(this).parent().parent().attr('_id'));
                        }
                    });
                    if(list.length==0){
                        alert($('#novlanchecked').val());
                        return;
                    }
                    var qintv=cnt.find('input[type=text]:eq(0)').val();
                    if(qintv!=''&&!PM.checkRange2(qintv,2,300)){
                        //alert(cnt.find('input:eq(0)').val())
                        alert($('#querierintervalerr').val());
                        return;
                    }

                    var mrt=cnt.find('input[type=text]:eq(1)').val();
                    if(mrt!=''&&!PM.checkRange2(mrt,1,25)){
                        //alert(cnt.find('input:eq(0)').val())
                        alert($('#mrterr').val());
                        return;
                    }

                    var lmqi=cnt.find('input[type=text]:eq(2)').val();
                    if(lmqi!=''&&!PM.checkRange2(lmqi,1,5)){
                        //alert(cnt.find('input:eq(0)').val())
                        alert($('#lmqierr').val());
                        return;
                    }
                    var sqs=cnt.find('input[type=text]:eq(3)').val();
                    if(sqs!=''&&!PM.checkIPAddress(sqs)){
                        //alert(cnt.find('input:eq(0)').val())
                        alert($('#sqserr').val());
                        return;
                    }

                    var url=RouterConfig.igmp_querier;
                    url=PM.setPara(url,"dispatch",'cfg-vlan-igmp-querier');
                    // url+=decodeURIComponent($.param({"dispatch":'cfg-vlan-igmp-querier','port-list':list.join(','),"status":$("select").val(),'r':Math.random()}));
                    url=PM.setPara(url,'vid',list.join(','));
                    url=PM.setPara(url,'r',Math.random());
                    if(cnt.find('select:eq(0)').val()!=''){
                        url=PM.setPara(url,'mode',cnt.find('select:eq(0)').val());
                    }
                    var ar=['query-inval','max-response-time','last-member-query-inval','sip'];
                    $.each(ar,function(i){
                        var v=cnt.find('input[type=text]:eq('+i+')').val();
                        if(v!=''){
                            url=PM.setPara(url,ar[i],v);
                        }
                    });
                    $.ajax({url:url,dataType:'xml'}).done(function(res){
                        manageResult(res);
                    });
                }}];
            if(tb.needPaging()){
                btnarr.push({id:'NEXT',func:function(){tb.nextPage();}});
                btnarr.push({id:'PREV',func:function(){tb.prevPage();}});
            }
            top.createButton(btnarr);

        });

}

function IGMPSnoopingVLANConfiguration(){
    $('#add_vlan').click(function(){
        var vlan_id=$('#vlan_id').val();
        if(!PM.checkRange2(vlan_id,1,4094)){
            alert($('#vlan_id_err').val());
            return
        }
        var url=url=RouterConfig.igmp_snooping;
        url=PM.setPara(url,"dispatch",'igmp-vlan-add');
        url=PM.setPara(url,'vid',vlan_id);
        url=PM.setPara(url,'r',Math.random());
        $.ajax({url:url,dataType:'xml'}).done(function(res){
            manageResult(res);
        });
    });
    $.ajax({
        url:RouterConfig.igmp_snooping+'dispatch=show igmp-vlan-cfg&r='+Math.random(),
        type:'GET',
        dataType:'xml'
    }).done(function(result){
            grepResult(result);

            var port_data = {
                editable:true,
                check : true,
                pageable:true,
                pagesize:50,
                head : [{
                    value : '',
                    type : "checkbox",
                    id:'allcheck',
                    cls : 'wd15'
                },{
                    value : 'VLAN ID',
                    type : 'nochangetext',
                    cls : 'wd54'
                },{
                    value : 'Host Timeout',
                    type : 'text',
                    cls : 'wd90'
                },{
                    value:'MRouter Timeout',
                    type:'text',
                    cls:'wd90'
                },{
                    value:'Drop Unknown Multicast',
                    type:'select',
                    options:[{v:'',t:''},{v:'Enable',t:'Enable'},{v:'Disable',t:'Disable'}],
                    cls:'wd120'
                },{
                    value:'IGMP Version',
                    type:'select',
                    options:[{v:'',t:''},{v:'1',t:'1'},{v:'2',t:'2'}],
                    cls:'wd140'
                }],
                body : [
                ]
            };
            $(result).find('vlan').each(function(){
                var o={};
                o.id=$.trim($(this).find('vid').text());
                o.data=[];
                o.data.push(o.id);
                o.data.push($.trim($(this).find('host-time').text()));
                o.data.push($.trim($(this).find('mrouter-time').text()));
                o.data.push($.trim($(this).find('drop-unknow').text()));
                o.data.push($.trim($(this).find('version').text()));
                port_data.body.push(o);
            });

            var tb=new PM.checkTable(port_data,$('div.tablecontentbody:eq(1)'));
            var btnarr=[
                {id:'REFRESH',func:function(){window.location.reload();}},
                {id:"APPLY",func:function(){
                    var cnt=$('div.tablecontentbody:eq(1)');
                    var checklist=tb.getChecklist();
                    var list=[];
                    $.each(checklist,function(){
                        if($(this).attr('checked')=='checked'){
                            list.push($(this).parent().parent().attr('_id'));
                        }
                    });
                    if(list.length==0){
                        alert($('#novlanchecked').val());
                        return;
                    }
                    var qintv=cnt.find('input[type=text]:eq(0)').val();
                    if(qintv!=''&&!PM.checkRange2(qintv,200,1000)){
                        alert($('#host_timeout_err').val());
                        return;
                    }

                    var mrt=cnt.find('input[type=text]:eq(1)').val();
                    if(mrt!=''&&!PM.checkRange2(mrt,1,1000)){
                        alert($('#mrouter_timeout_err').val());
                        return;
                    }

                    var url=RouterConfig.igmp_snooping;
                    url=PM.setPara(url,"dispatch",'cfg-igmp-vlan');
                    url=PM.setPara(url,'vid',list.join(','));
                    var select_arr=['drop-unknown','version'];
                    $.each(select_arr,function(i){
                        var val = cnt.find('select:eq('+i+')').val();
                        if(val!=''){
                            url=PM.setPara(url,select_arr[i],val);
                        }
                    });

                    var text_arr=['host-time','mroute-time'];
                    $.each(text_arr,function(i){
                        var v=cnt.find('input[type=text]:eq('+i+')').val();
                        if(v!=''){
                            url=PM.setPara(url,text_arr[i],v);
                        }
                    });
                    url=PM.setPara(url,'r',Math.random());
                    $.ajax({url:url,dataType:'xml'}).done(function(res){
                        manageResult(res);
                    });
                }},{id:"DELETE",func:function(){
                    var cnt=$('div.tablecontentbody:eq(1)');
                    var checklist=tb.getChecklist();
                    var list=[];
                    $.each(checklist,function(){
                        if($(this).attr('checked')=='checked'){
                            list.push($(this).parent().parent().attr('_id'));
                        }
                    });
                    if(list.length==0){
                        alert($('#novlanchecked').val());
                        return;
                    }
                    var url=url=RouterConfig.igmp_snooping;
                    url=PM.setPara(url,"dispatch",'igmp-vlan-del');
                    url=PM.setPara(url,'vid-list',list.join(','));
                    $.ajax({url:url,dataType:'xml'}).done(function(res){
                        manageResult(res);
                    });
                }
                }];
            if(tb.needPaging()){
                btnarr.push({id:'NEXT',func:function(){tb.nextPage();}});
                btnarr.push({id:'PREV',func:function(){tb.prevPage();}});
            }
            top.createButton(btnarr);

        });

}

function IGMPSnoopingConfiguration(){
    $.ajax({
        url:RouterConfig.igmp_snooping_configuration+'dispatch=show-igmp-cfg&r='+Math.random()
    }).done(function(res){
            grepResult(res);
            var o={};
            o['status']=$.trim($(res).find('status').text());
            o['rev_gen_queries']= $.trim($(res).find('rev-gen-queries').text());
            o['rev_igmpv2_report']=$.trim($(res).find('rev-igmpv2-report').text());
            o['rev_igmpv1_report']=$.trim($(res).find('rev-igmpv1-report').text());
            o['sent_gen_queries']=$.trim($(res).find('sent-gen-queries').text());
            o['sent_grp_spe_queries']=$.trim($(res).find('sent-grp-spe-queries').text());
            o['rev_igmp_leaves']=$.trim($(res).find('rev-igmp-leaves').text());
            o['rev_grp_spe_queries']=$.trim($(res).find('rev-grp-spe-queries').text());
            o['cur_igmp_grp']=$.trim($(res).find('cur-igmp-grp').text());
            o['cur_igmp_vlan']=$.trim($(res).find('cur-igmp-vlan').text());
            $('div.tablecontentbody:eq(0)').html(_.template($('#igmp_snooping_configuration').html(),o));

            $('div.tablecontentbody:eq(1)').html(_.template($('#igmp_statistics_tmpl').html(),o));
            $('div.tablecontentbody:eq(2)').html(_.template($('#igmp_snooping_capacity_tmpl').html(),o));

            top.createButton([
                {id:'REFRESH',func:function(){
                    if($(this).attr('disabled'))return;
                    window.location.reload();
                }
                },
                {id:"APPLY",func:function(){
                    if($(this).attr('disabled'))return;
                    var url=RouterConfig.igmp_snooping_configuration;
                    url=PM.setPara(url,'dispatch','cfg-igmp-global');
                    url=PM.setPara(url,'igmp-sts',$('input[name="igmp_status"]:checked').val());
                    var clear_status = $('input[name="clear_sts"]:checked').val();
                    clear_status=='Yes'?url=PM.setPara(url,'clear-sts',clear_status):'';
                    url=PM.setPara(url,'r',Math.random());
                    $.ajax({url:url}).done(function(res){
                        grepResult(res);
                    });
                }}]);

        });
}

function IGMPSnoopingTable(){
    var port_data = {
        pagesize:50,
        head : [  {
            value : 'VLAN ID',
            type : 'nochangetext',
            cls : 'wd90'
        },{
            value : 'Group MAC Address',
            type : 'nochangetext',
            cls : 'wd170'
        },
            {
                value : 'Group IP Address',
                type : 'nochangetext',
                cls : 'wd140'
            },
            {
                value : 'Router Port(s)',
                type : 'nochangetext',
                cls : 'wd140'
            },{
                value : 'Member Port(s)',
                type : 'nochangetext',
                cls : 'wd140'
            }],
        body:[]
    };
    var url=PM.getUrl(RouterConfig.igmp_snooping_table)+'?dispatch=how igmp-table';

    $.ajax({
        url:url,
        type:'GET',
        dataType:'xml'
    }).done(function(res){
            grepResult(res);
            $(res).find('r').each(function(){
                var p=$(this);
                var o={};
                o.id=$.trim(p.find('vid').text());
                o.data=[];
                o.data.push(o.id);
                o.data.push($.trim(p.find('grp-mac').text()));
                o.data.push($.trim(p.find('grp-ip').text()));
                o.data.push($.trim(p.find('router-ports').text()));
                o.data.push($.trim(p.find('member-ports').text()));
                port_data.body.push(o);
            });
            var tb=new PM.checkTable(port_data,$('div.tablecontentbody:eq(0)'));

            var btnarr=[{id:'REFRESH',func:function(){if($(this).attr('disabled'))return;window.location.reload();}}];
            if(tb.needPaging()){
                btnarr.push({id:'NEXT',func:function(){tb.nextPage();}});
                btnarr.push({id:'PREV',func:function(){tb.prevPage();}});
            }

            top.createButton(btnarr);
        });
}

function LACPConfiguration() {
    var btnarr = [
        {id:'REFRESH', func:function () {
            if ($(this).attr('disabled'))return;
            PM.disableButton();
            var prioriy = $('.tablecontentbody input:eq(0)');
            if(!PM.checkRange2(prioriy.val(),0,65536)){
                alert($('#err').val());
                PM.enableButton();
                return;
            }
            var url = PM.getUrl(RouterConfig.lacp_configuration) + '?dispatch=show lacp priority load';
            url=PM.setPara(url,'priority',prioriy.val())
            $.ajax({
                url:url,
                type:'GET',
                dataType:'xml'
            }).done(function (res) {
                    grepResult(res);
                    if($(res).find('ret-code').length>0){
                        alert($(res).find('msg').text());
                    }else{
                        $('.tablecontentbody input:eq(0)').val($.trim($(res).find('lacp-sys-priority').text()));
                        $('.tablecontentbody select:eq(0)').val($.trim($(res).find('lacp-load-balance').text()));
                    }
                    PM.enableButton();
                });
        }},
        {id:'APPLY', func:function () {
            if ($(this).attr('disabled'))return;
            PM.disableButton();
            var priority = $('.tablecontentbody input:eq(0)');
            if(!PM.checkRange2(priority.val(),0,65536)){
                alert($('#err').val());
                PM.enableButton();
                return;
            }
            var url = PM.getUrl(RouterConfig.lacp_configuration) + '?dispatch=cfg-lag-sys-priority';
            url=PM.setPara(url,'priority',priority.val());
            url=PM.setPara(url,'sys-load-balance',$('.tablecontentbody select:eq(0)').val());
            $.ajax({
                url:url,
                type:'GET',
                dataType:'xml'
            }).done(function (res) {
                    manageResult(res);

                });

        }}
    ];
    top.createButton(btnarr);
}

function lacpPortConfigruation() {

    var url = RouterConfig.lacp_port_configuration + 'dispatch=show lacp-port-priority&r=' + Math.random();
    $.ajax({
        url:url
    }).done(function (res) {
            grepResult(res);
            var port_data = {
                editable:true,
                check:true,
                head:[
                    {
                        value:'',
                        type:"checkbox",
                        id:'allcheck',
                        cls:'wd15'
                    },
                    {
                        value:'Port ID',
                        type:'nochangetext',
                        cls:'wd54'
                    },
                    {
                        value:'LACP Priority (0-255)',
                        type:'text',
                        cls:'wd120'
                    },
                    {
                        value:'Time',
                        type:'select',
                        options:[
                            {v:'', t:''},
                            {v:'Long', t:'Long'},
                            {v:'Short', t:'Short'}
                        ],
                        cls:'wd90'
                    }
                ],
                body:[

                ]
            };

            $(res).find('port').each(function () {
                var node = $(this);
                var o = {};
                o.id = $.trim(node.find('id').text());
                o.data = [];
                o.data.push(o.id);
                o.data.push($.trim(node.find('priority').text()));
                o.data.push($.trim(node.find('time-out').text()));
                port_data.body.push(o);
            });
            var tb = new PM.checkTable(port_data, $('div.tablecontentbody:eq(0)'));
            top.createButton(
                [
                    {
                        id:'REFRESH',
                        func:function () {
                            if ($(this).attr('disabled'))return;
                            window.location.reload();
                        }
                    },
                    {
                        id:"APPLY",
                        func:function () {
                            if ($(this).attr('disabled'))return;
                            var checklist = tb.getChecklist();
                            var list = [];
                            $.each(checklist, function () {
                                if ($(this).attr('checked') == 'checked') {
                                    list.push($(this).parent().parent().attr('_id'));
                                }
                            });
                            if (list.length == 0) {
                                alert($('#novlanchecked').val());
                                return;
                            }
                            var url = RouterConfig.port_basic;
                            url = PM.setPara(url, "dispatch", 'cfg-lag-priority');
                            url = PM.setPara(url, 'port-list', list.join(','));
                            var cnt = $('div.tablecontentbody:eq(0)');
                            var priority = cnt.find('input[type=text]:eq(0)').val();
                            if (priority != '') {
                                url = PM.setPara(url, 'priority', priority);
                            }
                            var timeout = cnt.find('select:eq(0)').val();
                            if (timeout != '') {
                                url = PM.setPara(url, 'timeout', timeout);
                            }
                            PM.disableButton();
                            $.ajax({
                                url:url,
                                type:'GET',
                                dataType:'xml'
                            }).done(function (res) {
                                    manageResult(res);

                                });
                        }
                    }
                ]);
        });

}

function LAGGroupTable(){
    var url=RouterConfig.lag_group_table+'dispatch=show lag-group-table';
    url+='&r='+Math.random();

    HE.ajax({
        url:url,
        method:'get',
        useXml:true
    },function(result){
        grepResult(result);
        var port_data = {
            check : true,
            pageable:true,
            head : [ {
                value : '',
                type : "checkbox",
                id:'allcheck',
                cls : 'wd15'
            }, {
                value : 'Group ID',
                type : 'nochangetext',
                cls : 'wd80'
            }, {
                value : 'LAG Mode',
                type : 'nochangetext',
                cls : 'wd90'
            },{
                value : 'Loadsharing Type',
                type : 'nochangetext',
                cls : 'wd90'
            },{
                value : 'Selected Port(s)',
                type : 'nochangetext',
                cls : 'wd90'
            },{
                value : 'Unselected Port(s)',
                type : 'nochangetext',
                cls : 'wd90'

            },{
                value:'',
                type:'nochangetext',
                cls:'wd90'
            }
            ]
        };
        port_data.body =[];
        var btnarr=[];
        if($(result).find('grp').length>0){
            $(result).find('grp').each(function(){
                var port=$(this);
                var o={};
                o.id=$.trim(port.find('grp-id').text());
                o.data=[];
                o.data.push(o.id);
                o.data.push($.trim(port.find('mod').text()));
                o.data.push($.trim(port.find('loadsharing-type').text()));
                o.data.push($.trim(port.find('sel-port-list').text()));
                o.data.push($.trim(port.find('unsel-port-list').text()));
                port_data.body.push(o);

                o.data.push('<input type="button" value="Modify" onclick="ModifyLAG('+o.id+');" />');
                port_data.body.push(o);
            });

        }
        var tablecnt=$('div.tablecontentbody')[0];
        var tb=new PM.checkTable(port_data,tablecnt);

        btnarr.push(
            {id:'REFRESH',func:function(){if($(this).attr('disabled'))return;window.location.reload();}},
            {id:"DELETE",func:function(){
                if($(this).attr('disabled'))return;

                var checklist=tb.getChecklist();
                var list=[];
                $.each(checklist,function(){
                    if($(this).attr('checked')=='checked'){
                        list.push($(this).parent().parent().attr('_id'));
                    }
                });
                if(list.length==0){
                    alert($('#novlanchecked').val());
                    return;
                }
                var url=RouterConfig.lag_group_table;
                url=PM.setPara(url,'dispatch','del-lag');
                url=PM.setPara(url,'group-list',list.join(','));
                url=PM.setPara(url,'r',Math.random());

                PM.disableButton();
                $.ajax({url:url,dataType:'xml'}).done(function(res){
                    manageResult(res);
                });
            }}
        );

        top.createButton(btnarr);
    });
}
