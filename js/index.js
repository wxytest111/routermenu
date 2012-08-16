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
	if(/msie 7/i.test(_ua)){ // ie7 mixi bug replace,because ie7's user is 0.4%,so use this method
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

var jsarr=['../js/lib_o.js','../js/os_o.js'];
os_loadJSArray(jsarr,function(){
	var orgData = {
			'System' : {
				'Management' : {
					'System Information' : 'system/system_information.html',
					'IP configuration' : 'system/ip_configuration.html',
					'Time' : {
						'SNTP Global Configuration' : '',
						'SNTP Server Configuration' : ''
					},
					'DNS' : {
						'DNS Configuration' : '',
						'Host Configuration' : ''
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
				},
				'DHCP' : ''
			},
			'Switching' : {
				'Ports' : {
					'Ports Basic' : 'switching/port_basic.html',
					'Port Flow Control' : '',
					'Power Saving' : ''
				},
				'LAG' : {
					'LAG Configuration' : '',
					'LAG Membership' : '',
					'LACP Configuration' : '',
					'LACP Port Configuration' : ''
				},
				'VLAN' : {
					'VLAN Configuration' : 'switching/vlan_configuration.html',
					'VLAN Membership' : '',
					'Port PVID Configuration' : 'switching/port_pvid_configuration.html',
					'Protocol Based VLAN Configuration' : '',
					'MAC Based VLAN Configuration' : ''
				},
				'Address Table' : {
					'Address Table' : 'switching/address_table.html',
					'Aging Time Configuration' : '',
					'Static MAC Address' : ''
				},
				'STP' : {
					'STP Configuration' : '',
					'Bridge Configuration' : '',
					'STP Port Configuration' : '',
					'STP Port Status' : '',
					'RSTP' : '',
					'STP Statistics' : ''
				},
				'Voice VLAN' : {
					'Properties' : '',
					'Port Settings' : '',
					'OUI' : ''
				},
				'Multicast' : {
					'IGMP Snooping' : {
						'IGMP Snooping Configuration' : '',
						'IGMP Snooping VLAN Configuration' : '',
						'IGMP Snooping Group' : ''
					},
					'IGMP Snooping Querier' : {
						'Querier Configuration' : '',
						'Querier VLAN Configuration' : '',
						'Querier VLAN Status' : ''
					}
				}
			},
			'QoS' : {
				'Bandwidth Control' : '',
				'Traffic Control' : '',
				'802.1p Default Priority' : '',
				'802.1p User Priority' : '',
				'QoS Scheduling Mechanism' : '',
				'Multi-Layer Cos Setting' : ''
			},
			'Security' : {
				'Management Security' : {
					'User Management' : {
						'User Add' : '',
						'User Modify' : ''
					},
					'RADIUS' : {
						'Global Configuration' : '',
						'Server Configuration' : '',
						'Accounting Server Configuration' : ''
					},
					'Authentication List' : ''
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
					'MAC Filter' : {
						'MAC Filter Configuration' : '',
						'MAC Filter Summary' : ''
					},
					'Storm Control' : '',
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
			'Monitering' : {
				'Port' : {
					'Switch Statistics' : '',
					'Port Statistics' : '',
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
					'Port Mirroring' : ''
				}
			},
			'Maintenance' : {
				'Reset' : {
					'Device Reboot' : '',
					'Factory Default' : ''
				},
				'Upload' : {
					'File Upload' : ''
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
					'Ping' : '',
					'Traceroute' : ''
				}
			}
		};

		var Rpm = {
			currentL1 : {
				id : '1',
				haschild : 1
			},
			currentL2 : {
				id : '1',
				haschild : 1
			},
			currentL3 : {
				id : '1',
				haschild : 1
			},
			currentL4 : {
				id : '1',
				haschild : 0
			}
		};
		function generateMenu(callback) {
			var countL1 = 0;
			var nav = HE.$('#nav');
			var nav2 = HE.$('#nav2');
			var nav3 = HE.$('#navcontainer');
			var navhtml = '<ul class="wd1046">';
			var nav2html = '';
			var nav3html = '';
			for ( var k in orgData) {
				var countL2 = 0;
				countL1++;
				navhtml += '<li><a href="javascript:;" _subid="' + countL1
						+ '" class="' + (countL1 == 1 ? 'current' : '') + '">' + k
						+ '</a></li>';
				nav2html += '<ul id="nav2_' + countL1 + '" class="wd1276 '
						+ (countL1 == 1 ? '' : 'hide') + '">';
				for ( var t in orgData[k]) {
					countL2++;
					nav2html += '<li><a href="javascript:void(0);" _subid="' + countL2
							+ '" class="'
							+ ((countL1 == 1 && countL2 == 1) ? 'current' : '')
							+ '" _haschild="'
							+ (typeof orgData[k][t] == 'object' ? 1 : 0) + '">' + t
							+ '</a></li>';
					if (typeof orgData[k][t] == 'object') {
						var countL3 = 0;
						nav3html += '<ul id="nav3_' + countL1 + '_' + countL2
								+ '" class="'
								+ ((countL1 == 1 && countL2 == 1) ? '' : 'hide') + '">';
						// <li><a href="javascript:void(0);" _haschild='0'
						// _href="system_information.html">System Infomation</a></li>
						for ( var m in orgData[k][t]) {
							countL3++;
							nav3html += '<li><a href="javascript:void(0);"  _subid="'
									+ countL3
									+ '" _haschild="'
									+ (typeof orgData[k][t][m] == 'object' ? 1 : 0)
									+ '" _href="'
									+ (typeof orgData[k][t][m] == 'string' ? orgData[k][t][m]
											: '') + '">' + m + '</a>';

							if (typeof orgData[k][t][m] == 'object') {
								var countL4 = 0;
								var nav4html = '';
								nav4html += '<ul class="hide">';
								for ( var n in orgData[k][t][m]) {
									countL4++;
									nav4html += '<li><a href="javascript:void(0);" _href="'
											+ orgData[k][t][m][n]
											+ '" _subid="'
											+ countL4 + '">' + n + '</a></li>'
								}
								nav4html += '</ul>';
								nav3html += nav4html;
							}
							nav3html += '</li>';
						}
						nav3html += '</ul>';
					} else {

					}

				}
				nav2html += '</ul>';
			}
			navhtml += '</ul>';
			nav.innerHTML = navhtml;
			nav2.innerHTML = nav2html;
			nav3.innerHTML = nav3html;
			if (callback)
				callback();
		}
		generateMenu(setEvent);

		function setEvent() {
			// Level controll Leve2
			var navs = HE.$('#nav a');
			var nav2list = HE.$('#nav2 ul');
			HE.array.forEach(navs, function(nav) {
				PM.addEvent(nav, function() {
					_subid = HE.getProp(this, '_subid');
					if (Rpm.currentL1.id == _subid)
						return;
					HE.array.forEach(navs, function(_item) {
						HE.removeClass(_item, 'current');
					});
					HE.addClass(this, 'current');
					HE.array.forEach(nav2list, function(_list) {
						HE.hide(_list);
					});
					HE.show(nav2list[(_subid - 1)]);
					Rpm.currentL1.id = _subid;
					var subnav2list = HE.$('a', HE.$('#nav2_' + _subid));
					if (subnav2list.length > 0) {
						HE.array.forEach(subnav2list, function(_item) {
							HE.removeClass(_item, 'current');
						});
						HE.addClass(subnav2list[0], 'current');
						var _subnav2id = HE.getProp(subnav2list[0], '_subid');
						if (HE.getProp(subnav2list[0], '_haschild') == '1') {
							var nav3lists = HE.$('#navcontainer ul');
							HE.array.forEach(nav3lists, function(_item) {
								HE.hide(_item);
							});
							var currentNav3 = HE
									.$('#nav3_' + _subid + '_' + _subnav2id);
							HE.show(currentNav3);
							if (HE.getProp(currentNav3, '_haschild') == '1') {
								var nav4lists = HE.$('ul li', currentNav3);
							} else {
								showPage(HE.$('a', currentNav3)[0]);
							}
						} else {
							showPage(subnav2list[0]);
						}
					}

				});
			});

			// Level2 controll level3
			var nav2s = HE.$('#nav2 a');
			var nav3list = HE.$('#navcontainer ul');
			HE.array.forEach(nav2s, function(nav) {
				PM.addEvent(nav, function() {
					HE.array.forEach(nav2s, function(_item) {
						HE.removeClass(_item, 'current');
					});
					HE.addClass(this, 'current');
					_subid = HE.getProp(this, '_subid');
					Rpm.currentL2.id = _subid;
					_current = HE.$('#nav3_' + Rpm.currentL1.id + '_'
							+ Rpm.currentL2.id);
					HE.array.forEach(nav3list, function(_list) {
						HE.hide(_list);
					});

					HE.show(_current);
				});
			});

			var navlists = HE.$('#navcontainer li a');
			HE.array.forEach(navlists, function(nav) {
				var _haschild = HE.getProp(nav, '_haschild');
				if (_haschild == 1) {
					HE.trace(nav.innerHTML);
					PM.addEvent(nav, function() {
						var navlists_ul = HE.$('ul', nav.parentNode.parentNode);
						HE.array.forEach(navlists_ul, function(_item) {
							HE.hide(_item);
						});
						HE.show(HE.$('ul', nav.parentNode)[0]);
						showPage(nav);
					});
				} else if (_haschild == 0) {
					PM.addEvent(nav, function() {
						var navlists_ul = HE.$('ul', nav.parentNode.parentNode);
						showPage(nav);
						HE.array.forEach(navlists_ul, function(_item) {
							HE.hide(_item);
						});

					});
				}
			});

			function showPage(obj) {
				var _href = HE.getProp(obj, '_href');
				if (_href == '' || _href == null) {
					HE.$('#cntIframe').src = 'maintance.html';
				} else {
					HE.$('#cntIframe').src = _href;
				}
			}
		}
});


function createButton(arr){
	
	var area=HE.$('#btnarea');
	area.innerHTML='';
	for(var i=0;i<arr.length;i++){
		switch(arr[i].id){
		case "ADD":
			var span=PM.$c('span');
			var a=PM.$c('a');
			a.href="javascript:;";
			a.id="btn_Add";
			a.innerHTML='ADD';
			a.className=arr[i].cls||'';
			//span.innerHTML='<a href="javascript:;" id="btn_Add">ADD</a>';
			PM.addEvent(a,arr[i].func);
			span.appendChild(a);
			area.appendChild(span);
			break;
		case "DELETE":
			var span=PM.$c('span');
			var a=PM.$c('a');
			a.href="javascript:;";
			a.id="btn_Delete";
			a.innerHTML='DELETE';
			a.className=arr[i].cls||'';
			//span.innerHTML='<a href="javascript:;" id="btn_Add">ADD</a>';
			PM.addEvent(a,arr[i].func);
			span.appendChild(a);
			area.appendChild(span);
			break;
		case "CANCEL":
			var span=PM.$c('span');
			var a=PM.$c('a');
			a.href="javascript:;";
			a.id="btn_Cancel";
			a.innerHTML='CANCEL';
			a.className=arr[i].cls||'';
			//span.innerHTML='<a href="javascript:;" id="btn_Add">ADD</a>';
			PM.addEvent(a,arr[i].func);
			span.appendChild(a);
			area.appendChild(span);
			break;
		case "APPLY":
			var span=PM.$c('span');
			var a=PM.$c('a');
			a.href="javascript:;";
			a.id="btn_Apply";
			a.innerHTML='APPLY';
			a.className=arr[i].cls||'';
			//span.innerHTML='<a href="javascript:;" id="btn_Add">ADD</a>';
			PM.addEvent(a,arr[i].func);
			span.appendChild(a);
			area.appendChild(span);
			break;
		case "REFRESH":
			var span=PM.$c('span');
			var a=PM.$c('a');
			a.href="javascript:;";
			a.id="btn_Refresh";
			a.innerHTML='REFRESH';
			a.className=arr[i].cls||'';
			//span.innerHTML='<a href="javascript:;" id="btn_Add">ADD</a>';
			PM.addEvent(a,arr[i].func);
			
			span.appendChild(a);
			area.appendChild(span);
			break;
		default:
			var span=PM.$c('span');
			var a=PM.$c('a');
			a.href="javascript:;";
			a.id="btn_"+arr[i].id;
			a.innerHTML=arr[i].id;
			a.className=arr[i].cls||'';
			//span.innerHTML='<a href="javascript:;" id="btn_Add">ADD</a>';
			PM.addEvent(a,arr[i].func);
			span.appendChild(a);
			area.appendChild(span);
			break;
		}
	}
	
}