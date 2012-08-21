function os_loadJSArray(pathArr,callback){
	var steps = 0,len = pathArr.length;			
	for(var i=0;i<len;i++){
		os_loadJS(pathArr[i],callbacks);
	}
	function callbacks(){
		steps += 1;
		if(steps == len){
			callback();
		}
	}
}


function os_loadJS(link,callback){
	var node = document.createElement("script");
	var _ua = navigator.userAgent.toLowerCase();
	if(/msie 7/i.test(_ua)){
		link+='?v='+Math.ceil(Math.random()*1000);
	}
	node.src = link;  
	document.getElementsByTagName('head')[0].appendChild(node); 
	if(!callback){return false;}
	if (navigator.userAgent.toLowerCase().indexOf('msie')>-1){	
		node.onreadystatechange = function(){
			if(this.readyState == "complete" || this.readyState == "loaded"){
				callback();
			}
		}
	} else {
		node.onload = function(){callback()};
	}
}

function RouterStart(level,callback){
	var l='';
	for(var i=0;i<level;i++){
		l+='../';
	}
	var jsarr=[l+'js/lib_o.js',l+'js/os.js',l+'js/pc.js'];
	os_loadJSArray(jsarr,function(){
		
		RouterConfig.portnum=$.cookie('router_portnum');
		RouterConfig.privilege=$.cookie('router_privilege')||'view';
		RouterConfig.user=$.cookie('router_user');
		RouterConfig.prefix=1;
		
		if(top.iframeSize){
			top.iframeSize();
		}	
		if(callback){
			callback();
			hidePageBtn();
			RouterConfig.clearBtnCount=0;
			RouterConfig.clearBtnInterval=setInterval(function(){
				hidePageBtn();
				if(RouterConfig.clearBtnCount>10)clearInterval(RouterConfig.clearBtnInterval);
				RouterConfig.clearBtnCount++;
			},500);
			
		};
	});
}

function manageResult(res){
	grepResult(res);
	var ret=$(res).find('ret-code').text();
	if(ret=='success'){
		window.location.reload();
	}else{
		alert($(res).find('msg').text());
		PM.enableButton();
	}
}

function grepResult(res){
	trace('grepResult');
	trace(res);
	if(typeof res=='string'){
		trace('string>>>>>>>>>');
		if($.browser.msie){
			xml = new ActiveXObject("Microsoft.XMLDOM");
			xml.async = false;
			xml.loadXML(res);
		}else{
			xml = new DOMParser().parseFromString(res, "text/xml");
		}
		res=xml;
	}
		
	trace($(res).find('ret-code').text());
	if($(res).find('ret-code').text()=='relogin'){
		$.cookie('router_user',null);
		$.cookie('router_portnum',null);
		$.cookie('router_privilege',null);
		if(top){
			var protocol=top.window.location.protocol;
			var host=top.window.location.host;
			var pathname =top.window.location.pathname;
			var url=protocol+"//"+host ;
			top.window.location.href=url;
		}
	}
	
}

function checkLoginStatus(){
	var protocol=top.window.location.protocol;
	var host=top.window.location.host;
	$.ajax({url:protocol+"//"+host+RouterConfig.check_login+'dispatch=checkcookie&r='+Math.random()}).done(function(res){
		grepResult(res);
	});
}

function hidePageBtn(){
	trace('hidePageBtn');
	if(RouterConfig.privilege=='view'){
		$('input[type=button]').attr('disabled',true).hide();
	}
}
function changeMenu(str){
	var nav3ul=$('#navcontainer ul');
	var nav3list=$('#navcontainer ul li a');
	nav3ul.each(function(){
		$(this).hide();
	});
	nav3list.each(function(){
		$(this).removeClass('current');
		if($(this).html()==str){
			$(this).addClass('current');
			$(this).parent().parent().show();
		}
	});
	
}
var RouterConfig={
	'logout':'/cig-bin/logout.xml?',
	'save':'/cig-bin/save.xml?',
	'check_login':'/cig-bin/check_login.xml?',//静态页面如菜单页进行登录检测的地址
	'check_url':'/cig-bin/check.xml?',
	'port_mirror':'/cig-bin/port_mirroring.xml?',
	'commit':'/cig-bin/port_mirroring_commit.xml?',
	'vlan_table':'/cig-bin/vlan_table.xml?',
	'vlan_configuation':'/cig-bin/vlan_configuration.xml?',
	'port_isolation':'/cig-bin/port_isolation.xml?',
	'jumbo_frame':'/cig-bin/jumbo_frame.xml?',
	'mac_based_vlan':'/cig-bin/mac_based_vlan.xml?',
	'flow_control':'/cig-bin/flow_control.xml?',
	'power_saving':'/cig-bin/power_saving.xml?',
	'port_pvid_configuration':'/cig-bin/port_pvid_configuration.xml?',
	'protocol_based_vlan_configuratioin':'/cig-bin/protocol_based_vlan_configuration.xml?',
	'storm_control':'/cig-bin/storm_control.xml?',
	'protocol_profile':'/cig-bin/protocol_profile.xml?',
	'ip_configuration':'/cig-bin/ip_configuration.xml?',
	'stp_statistics':'/cig-bin/stp_statistics.xml?',
	'stp_port_status':'/cig-bin/stp_port_status.xml?',
	'port_statistics':'/cig-bin/port_statistics.xml?',
	'stp_port_configuration':'/cig-bin/stp_port_configuration.xml?',
	'tftp_upgrade':'/cig-bin/tftp_upgrade.xml?',
	'device_reboot':'/cig-bin/device_reboot.xml?',
	'login':'/cig-bin/login.xml?',
	'system_information':'/cig-bin/system_information.xml?',
	'stp_global_configuration':'/cig-bin/stp_global_configuration.xml?',
	'static_mac_address':'/cig-bin/static_mac_address.xml?',
	'mac_table':'/cig-bin/mac_table.xml?',
	'port_basic':'/cig-bin/port_basic.xml?',
	'ping':'/cig-bin/ping.xml?',
	'traceroute':'/cig-bin/traceroute.xml?',
	'global_mac_settings':'/cig-bin/global_mac_settings.xml?',
	'user_management':'/cig-bin/user_management.xml?',
//    second period
	'igmp_querier':'/cig-bin/igmp_querier.xml?',
	'igmp_snooping':'/cig-bin/igmp_snooping.xml?',
	'igmp_snooping_table':'/cig-bin/igmp_snooping_table.xml?',
	'igmp_snooping_configuration':'/cig-bin/igmp_snooping_configuration.xml?',
	'dns_server_configuration':'/cig-bin/dns_server_configuration.xml?',
	'dns_host_configuration':'/cig-bin/dns_host_configuration.xml?',
	'lacp_configuration':'/cig-bin/lacp_configuration.xml?',
    'lacp_port_configuration':'/cig-bin/LACP_Port_Configuration.xml?',
    'lag_group_table':'/cig-bin/LAG_Group_Table.xml?',
    'advanced_shaping_configuration':'/cig-bin/Advanced_shaping_configuration.xml?'
};
RouterConfig.orgData = {
		'System' : {
			'Management' : {
				'System Information' : 'system/system_information.html',
				'IP Configuration' : 'system/ip_configuration.html',
				'Time' : {
					'SNTP Global Configuration' : '',
					'SNTP Server Configuration' : ''
				},
				'DNS' : {
					'DNS Configuration' : 'system/dns_server_configuration.html',
					'Host Configuration' : 'system/dns_host_configuration.html'
				}
			},
			'License' : {
				'N/A' : ''
			},
			'SNMP' : {
				'SNMP V1/V2' : {
					'Community Configuration' : '',
					'Trap Configuration' : '',
					'Trap Flags' : ''
				}
			}
		},
		'Switching' : {
			'Ports' : {
				'Port Basic' : 'switching/port_basic.html',
				'Port Flow Control' : 'switching/flow_control.html',
				'Power Saving' : 'switching/power_saving.html',
				'Jumbo Frame':'switching/jumbo_frame.html'
			},
			'LAG' : {
				'LAG Configuration' : '',
				'LAG Membership' : '',
				'LAG Group Table' : 'switching/lag_group_table.html',
				'LACP Configuration' : 'switching/lacp_configuration.html',
				'LACP Port Configuration' : 'switching/lacp_port_configuration.html'
			},
			'VLAN' : {
				'VLAN Table' : 'switching/vlan_table.html',
				'VLAN Configuration' : 'switching/vlan_configuration.html',
				'Port PVID Configuration' : 'switching/port_pvid_configuration.html',
				'Protocol Based VLAN Configuration' : 'switching/protocol_based_vlan_configuration.html',
				'MAC Based VLAN Configuration' : 'switching/mac_based_vlan.html'
			},
			'Address Table' : {
				'Address Table' : 'switching/address_table.html',
				'Global MAC Settings' : 'switching/global_mac_settings.html'
				
			},
			'MAC Table':{
				'Global MAC Settings' : 'switching/global_mac_settings.html',
				'Static MAC Address' : 'switching/static_mac_address.html',
				'MAC Table':'switching/mac_table.html'
			},
			'STP' : {
				'STP Global Configuration' : 'switching/stp_global_configuration.html',
				'STP Port Configuration' : 'switching/stp_port_configuration.html',
				'STP Port Status' : 'switching/stp_port_status.html',
				'STP Statistics' : 'switching/stp_statistics.html'
			},
			'Voice VLAN' : {
				'Properties' : '',
				'Port Settings' : '',
				'OUI' : ''
			},
			'Multicast' : {
				'IGMP Snooping VLAN Configuration' : 'switching/igmp_snooping_vlan_configuration.html',
				'IGMP Querier VLAN Configuration' : 'switching/igmp_querier_vlan_configuration.html',
				'IGMP Snooping Configuration' : 'switching/igmp_snooping_configuration.html',
                'IGMP Snooping Table':'switching/igmp_snooping_table.html'
			},
            'QoS':{
                'Advanced Shaping Configuration':'switching/advanced_shaping_configuration.html'
            }
		},
		
		'Security' : {
			'Management':{
				'User Management':'security/user_management.html'
			},
			'Access' : {
				'HTTP' : {
					'HTTP Configuraton' : ''
				},
				'Access Control' : {
					'Access Profile' : '',
					'Access Rule' : ''
				}
			},
			'Port Authentication' : {
				'Basic' : {
					'802.1X Configuration' : ''
				},
				'Advanced' : {
					'802.1X Configuration' : '',
					'Port Authentication' : '',
					'Port Summary' : ''
				}
			},
			'Traffic Control' : {
				'Port Isolation':'security/port_isolation.html',
				'MAC Filter' : {
					'MAC Filter Configuration' : '',
					'MAC Filter Summary' : ''
				},
				'Storm Control' : 'security/storm_control.html',
				'Port Security' : {
					'Port Security Configuration' : '',
					'Interface Configuration' : '',
					'Security MAC Address' : ''
				},
				'Protected Ports' : ''
			},
			'ACL' : {
				'Basic' : {
					'MAC ACL' : '',
					'MAC Rules' : '',
					'MAC Binding Configuration' : '',
					'Binding Table' : ''
				},
				'Advanced' : {
					'IP ACL' : '',
					'IP Rules' : '',
					'IP Extended Rules' : '',
					'IP Binding Configuration' : '',
					'Binding Table' : ''
				}
			}
		},
		'Monitoring' : {
			'Port' : {
				'Switch Statistics' : '',
				'Port Statistics' : 'monitoring/port_statistics.html',
				'EAP Statistics' : ''
			},
			'Logs' : {
				'Memory Log' : '',
				'FLASH Log' : '',
				'Server Log' : '',
				'Trap Logs' : '',
				'Event Logs' : ''
			},
			'Mirroring' : {
				'Port Mirroring' : 'monitoring/port_mirroring.html'
			}
		},
		'Maintenance' : {
			'Reset' : {
				'Device Reboot' : 'maintenance/device_reboot.html',
				'Factory Default' : ''
			},
			'Upgrade' : {
				'TFTP Upgrade' : 'maintenance/tftp_upgrade.html'
			},
			'Download' : {
				'TFTP File Download' : ''
			},
			'File Management' : {
				'Dual Image' : {
					'Dual Image Configuration' : '',
					'Dual Image Status' : ''
				}
			},
			'Diagnosis' : {
				'Ping' : 'maintenance/ping.html',
				'Traceroute' : 'maintenance/traceroute.html'
			}
		},
		'QoS':{
			'Bandwidth Control' : '',
			'802.1p Default Priority' : '',
			'802.1p User Priority' : '',
			'QoS Scheduling Mechanism' : '',
			'Profile':'qos/protocol_profile.html'
		}
	};
RouterConfig.error={
		'iperror':'Please input right ipaddress!',
		'wait_tips':'This may take few minutes,please wait!'
};
