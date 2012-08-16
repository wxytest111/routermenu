function $E(oID) {
	var node = typeof oID == "string"? document.getElementById(oID): oID;
	if (node != null) {
		return node;
	}
	else {
	}
	return null;
}

/**
 * 根据tagname创建制定类型的节点元素
 * @param {String} tagName 制定的节点类型
 */
function $C(tagName) { 
	return document.createElement(tagName);
}

/**
 * 根据Name来查找元素
 * @param {String} name 需要查找的name名称
 */
function $N(name){
	return document.getElementsByName(name);
}

/**
 * 根据TagName来查找元素
 * @param {Object} obj 需要在哪个节点下根据tagname查找
 * @param {String} tagName 需要查找的tag
 */
function $T(obj,tagName){
	return obj.getElementsByTagName(tagName);
}

/**
 * 继承
 * @param {Object}	destination 子类
 * @param {Object}	source		父类
 * @param {Boolean}	bForce		强制，只要是 null 就覆盖
 */
$extend = function(destination, source, bForce) {
	for (var property in source) {
		if(bForce != null){
			if (!destination[property]) {
				destination[property] = source[property];
			}
		}else{
			destination[property] = source[property];
		}
	}
	return destination;
};

var PM = {};
PM.create=function(){
	return function(){
		this.initialize.apply(this, arguments);
	}
};

PM.getPara=function(url,name){
	var str = '',_p = name + '=';
	if(url.indexOf("&"+_p)>-1) str = url.split("&"+_p)[1].split("&")[0];
	if(url.indexOf("?"+_p)>-1) str = url.split("?"+_p)[1].split("&")[0];
	return str;
};
PM.setPara = function(url,name,value){
	url = $.trim(url);
	var paras = name + "=" + value;
	url=PM.removePara(url,name);//这里会有个小小的问题，如果a=&b=1,此时在设置a为1则url会变成a=&b=1&a=1,所以要先移除原来的参数，当然，这只针对原来参数在url存在值却为空的情况
	var v = PM.getPara(url,name);
	
	return v == "" ? (url + ((url.indexOf("?")<0) ? "?" : "&") + paras) : url.replace("&"+name+"="+v,"&"+paras).replace("?"+name+"="+v,"?"+paras);
};
PM.removePara = function(url,name){
    if(!name){return url;}
	var v = PM.getPara(url,name);
    if(url.indexOf('&' + name + '=' + v)>-1){
        url = url.replace('&' + name + '=' + v,'');
    }else if(url.indexOf('?' + name + '=' + v + '&')>-1){
        url = url.replace(name + '=' + v + '&','');
    }else{
        url = url.replace('?' + name + '=' + v,'');        
    }
    return url;
};

(function(_s){
	var _ua = navigator.userAgent.toLowerCase();
	_s.$IE = /msie/.test(_ua);
	_s.$OPERA = /opera/.test(_ua);
	_s.$MOZ = /gecko/.test(_ua);
	_s.$IE5 = /msie 5 /.test(_ua);
	_s.$IE55 = /msie 5.5/.test(_ua);
	_s.$IE6 = /msie 6/.test(_ua);
	_s.$IE7 = /msie 7/.test(_ua);
	_s.$IE8 = /msie 8/.test(_ua);
	_s.$SAFARI = /safari/.test(_ua);
	_s.$FF2=/Firefox\/2/i.test(_ua);
	_s.$FF = /firefox/i.test(_ua);
	_s.$CHROME = /chrome/i.test(_ua);
	_s.$TT=/tencenttraveler/.test(_ua);
	_s.$360=/360se/.test(_ua);
	_s.$Maxthon=false;
	 try{
		 var t=window.external;
		_s.$Maxthon=t.max_version?true:false;
	 }catch(e){}
})(PM);

PM.$e=function(id) {
	return document.getElementById(id);
};
PM.$c=function(tag) {
	return document.createElement(tag);
};

PM.addEvent=function(elm, func, evType, useCapture) {
	var _el = typeof elm == 'string' ? PM.$e(elm) : elm;
	if (_el == null) {
		trace("addEvent can not find object：" + elm);
		return;
	}
	if (typeof useCapture == 'undefined') {
		useCapture = false;
	}
	if (typeof evType == 'undefined') {
		evType = 'click';
	}
	if (_el.addEventListener) {
		_el.addEventListener(evType, func, useCapture);
		return true;
	} else if (_el.attachEvent) {
		var r = _el.attachEvent('on' + evType, func);
		return true;
	} else {
		_el['on' + evType] = func;
	}
};
PM.removeEvent = function (elm, func, evType) {
	var _el = typeof elm == 'string' ? PM.$e(elm) : elm;
	if(_el == null){
		trace("removeEvent can not find object：" + oElement);return;
	}
	if (typeof func != "function") {
		return;
	}
	if (typeof evType == 'undefined') {
		evType = 'click';
	}
	if (_el.addEventListener) {
		_el.removeEventListener(evType, func, false);
	}
	else if (_el.attachEvent) {
		_el.detachEvent("on" + evType, func);
	}
	_el[evType] = null;
};
PM.bindFunc=function(func, obj) {
	var __method = func;
	return function() {
		return __method.apply(obj, arguments);
	};
};
PM.getLeft=function(el){
	var left = 0;
	if (typeof el.offsetParent !="unknown") {
		while (el.offsetParent) {
			left += el.offsetLeft;
			el = el.offsetParent;
		}
	}
	else 
		if (el.x) {
			left += el.x;
		}
	return left;
};
PM.getTop=function(el){
	var top = 0;
	if (typeof el.offsetParent !="unknown") {
		while (el.offsetParent) {
			top += el.offsetTop;
			el = el.offsetParent;
		}
	}
	else 
		if (el.y) {
			top += el.y;
		}
	return top;
};

PM.insertHTML =function(el, html, where) {
	el = el || document.body;
	where = where.toLowerCase() || "beforeend";
	if (el.insertAdjacentHTML) {
		switch (where) {
		case "beforebegin":
			el.insertAdjacentHTML('BeforeBegin', html);
			return el.previousSibling;
		case "afterbegin":
			el.insertAdjacentHTML('AfterBegin', html);
			return el.firstChild;
		case "beforeend":
			el.insertAdjacentHTML('BeforeEnd', html);
			return el.lastChild;
		case "afterend":
			el.insertAdjacentHTML('AfterEnd', html);
			return el.nextSibling;
		}
	}
	var range = el.ownerDocument.createRange();
	var frag;
	switch (where) {
	case "beforebegin":
		range.setStartBefore(el);
		frag = range.createContextualFragment(html);
		el.parentNode.insertBefore(frag, el);
		return el.previousSibling;
	case "afterbegin":
		if (el.firstChild) {
			range.setStartBefore(el.firstChild);
			frag = range.createContextualFragment(html);
			el.insertBefore(frag, el.firstChild);
			return el.firstChild;
		} else {
			el.innerHTML = html;
			return el.firstChild;
		}
		break;
	case "beforeend":
		if (el.lastChild) {
			range.setStartAfter(el.lastChild);
			frag = range.createContextualFragment(html);
			el.appendChild(frag);
			return el.lastChild;
		} else {
			el.innerHTML = html;
			return el.lastChild;
		}
		break;
	case "afterend":
		range.setStartAfter(el);
		frag = range.createContextualFragment(html);
		el.parentNode.insertBefore(frag, el.nextSibling);
		return el.nextSibling;
	}
};
PM.setCookie = function (name, value, expire, path, domain, secure) {
	var cstr = [];
	cstr.push(name + '=' + escape(value));
	if(expire){
		var dd = new Date();
		var expires = dd.getTime() + expire * 3600000;
		dd.setTime(expires);
		cstr.push('expires=' + dd.toGMTString());
	}
	if (path) {
		cstr.push('path=' + path);
	}
	if (domain) {
		cstr.push('domain=' + domain);
	}
	if (secure) {
		cstr.push(secure);
	}
	document.cookie = cstr.join(';');
};
PM.getCookie = function (name) {
	name = name.replace(/([\.\[\]\$])/g,'\\\$1');
	var rep = new RegExp(name + '=([^;]*)?;','i'); 
	var co = document.cookie + ';';
	var res = co.match(rep);
	if (res) {
		return res[1] || "";
	}
	else {
		return "";
	}
};
PM.min=function(a,b){
	return a>b?b:a;
};
PM.max=function(a,b){
	return a>b?a:b;
}
//带checkbox的table,有翻页功能
PM.checkTable=PM.create();
PM.checkTable.prototype={
		data:{},
		cnt:null,
		checknum:0,
		pageable:false,
		pagesize:0,//每页显示数量
		total:0,//记录当前总条数
		page:1,//当前显示的是第几页
		initialize:function(param,cnt){
			if(typeof param =='string')param=$.parseJSON(param);
			this.data=param;
			this.pageabe=(this.data.pageable?true:false);
			this.total=this.data.body.length;
			this.pagesize=parseInt(this.data.pagesize?(this.data.pagesize>this.total?this.total:this.data.pagesize):this.total);
			this.totalpage=Math.ceil(this.total/this.pagesize);
			if(!cnt){
				return;
			}
			this.cnt=cnt;
			this.createTable();
			this.createHead();
			this.createBody(this.page);
			this.setEvent();
		},
		createTable:function(){
			_this=this;
			$(this.cnt).html('<table align="center" rules="groups" border="0" cellspacing="1" cellpadding="1"><thead></thead><tbody></tbody></table>');
			this.table=$(this.cnt).find('table:first');//HE.$('table',this.cnt)[0];
			trace($(this.table).html());
			this.thead=$(this.cnt).find('thead:first');//HE.$('thead',this.table)[0];
			this.tbody=$(this.cnt).find('tbody:first');//HE.$('tbody',this.table)[0];
		},
		createHead:function(){
			var tr=PM.$c('tr');
			var tr2=PM.$c('tr');
			tr2.className='normalfont';
			for(var i=0;i<this.data.head.length;i++){
				var o=this.data.head[i];
				
				if(!this.data.check&&o.type=='checkbox'){
					continue
				}else {
					var th=PM.$c('th');
					th.className=o.cls;
					th.innerHTML=o.value;
					tr.appendChild(th);
					if(!this.data.editable&&o.type=="checkbox"){
						var inp=PM.$c('input');
						inp.type='checkbox';
						inp.id=o.id||'allcheck';
						this.allcheck=inp;
						th.appendChild(inp);
					}
				}
				if(this.data.editable){//说明有checkbox,要增加第二行
					switch (o.type){
						case "checkbox":
							var th2=PM.$c('th');
							var inp=PM.$c('input');
							inp.type='checkbox';
							inp.id=o.id||'allcheck';
							this.allcheck=inp;
							th2.appendChild(inp);
							tr2.appendChild(th2);
							break;
						case "nochangetext":
							var th2=PM.$c('th');
							th2.innerHTML='';
							tr2.appendChild(th2);
							break;
						case "text":
							var th2=PM.$c('th');
							var inp=PM.$c('input');
							inp.type='text';
							inp.size=o.size||8;
							if(o.id)inp.id=o.id;
							th2.appendChild(inp);
							tr2.appendChild(th2);
							break;
						case "select":
							var th2=PM.$c('th');
							var str='<select';
							if(o.id)str+=' id="'+o.id+'" ';
							str+='>';
							for(var j=0;j<o.options.length;j++)str+='<option value="'+o.options[j].v+'">'+o.options[j].t+'</option>';
							str+='</select>';
							th2.innerHTML=str;
							tr2.appendChild(th2);
							break;
							default:;
					}
				}
			}
			$(this.thead).append($(tr));
			if(this.data.check){
				$(this.thead).append($(tr2));
			}
		},
		createBody:function(page){
			if(this.data.check)this.checklist=[];
			this.removeEvent();
			$(this.tbody).html('');
			for(var i=(page-1)*this.pagesize;i<PM.min(page*this.pagesize,this.total);i++){
				var o=this.data.body[i];
				trace(o);
				var tr=PM.$c('tr');
				if(i%2==0)
					tr.className='oddrows';
				$(tr).attr('_id',o.id||'');
				
				if(this.data.check){
					var td=PM.$c('td');
					tr.appendChild(td);
					var inp=PM.$c('input');
					inp.type='checkbox';
					inp.id='chk_'+o.id||'';
					if(!o.nocheck){
						this.checklist[this.checklist.length]=inp;
						td.appendChild(inp);
					}
				}
				
				for(var j=0;j<o.data.length;j++){
					var td=PM.$c('td');
					td.innerHTML=o.data[j]||'';
					tr.appendChild(td);
				}
				$(this.tbody).append($(tr));
			}
		},
		setEvent:function(){
			if(!this.data.editable&&!this.data.check)return;
			var _this=this;
			PM.addEvent(this.allcheck, PM.bindFunc(this.allCheckEvent, this));
			HE.array.forEach(this.checklist, function(check) {
				PM.addEvent(check, function() {
					PM.ChangeRowColor(check);
					if (check.checked) {
						_this.checknum++;
						HE.addClass(check.parentNode.parentNode,'selectRow');
						if(_this.checknum>1)
							_this.resetLine();
						else	
							_this.addDataToLine(check.parentNode.parentNode);
					} else {
						_this.checknum--;
						if(_this.checknum<1)_this.resetLine();
						else if(_this.checknum==1){
							var checkedone=_this.findCheckedOne();
							_this.addDataToLine(checkedone.parentNode.parentNode);
						}
						HE.removeClass(check.parentNode.parentNode,'selectRow');
						allcheck.checked = '';
					}
				});
			});
		},
		allCheckEvent:function(){
			trace('allCheckEvent');
			if (this.allcheck.checked) {
				HE.array.forEach(this.checklist, function(check) {
					check.checked = 'true';
					HE.addClass(check.parentNode.parentNode,'selectRow');
				});
				this.checknum=this.checklist.length;
				this.resetLine()
			} else {
				HE.array.forEach(this.checklist, function(check) {
					check.checked = '';
					HE.removeClass(check.parentNode.parentNode,'selectRow');
				});
				this.checknum=0;
			}
		},
		removeEvent:function(){
			if(!this.data.check)return;
			this.allcheck.checked=false;
			PM.removeEvent(this.allcheck,this.allCheckEvent);
		},
		nextPage:function(){
			if(this.data.end&&this.data.end<this.data.max&&this.page==this.totalpage){
				var url=window.location.href;
				var start=parseInt(this.data.end)+1;
				var end=Math.min((parseInt(this.data.end)+1000),this.data.max);
				url=PM.setPara(url,'from',start);
				url=PM.setPara(url,'to',end);
				window.location.href=url;
			}
			if(this.page==this.totalpage)return;
			this.page++;
			this.createBody(this.page);
		},
		prevPage:function(){
			if(this.data.start&&this.data.start>1&&this.page==1){
				var url=window.location.href;
				var start=Math.max((parseInt(this.data.start)-1000),1);
				var end=parseInt(this.data.start)-1;
				url=PM.setPara(url,'from',start);
				url=PM.setPara(url,'to',end);
				window.location.href=url;
			}
			if(this.page==1)return;
			this.page--;
			this.createBody(this.page);
		},
		findCheckedOne:function(){
			for(var i=0;i<this.checklist.length;i++){
				if(this.checklist[i].checked)
					return this.checklist[i];
			}
		},
		addDataToLine:function(obj){
			if(!this.data.editable)return;
			trace('add data to line');
			trace(obj);
			var tds = $(obj).find('td');
			var ths = $(this.thead).find('.normalfont th');
			for(var i=0;i<this.data.head.length;i++){
				var o=this.data.head[i];
					switch (o.type){
						case "checkbox":
							break;
						case "nochangetext":
							trace($(tds[i]).html())
							$(ths[i]).html($(tds[i]).html());
							break;
						case "text":
							trace($(tds[i]).html())
							$(ths[i]).find('input:first').val($(tds[i]).html());
							break;
						case "select":
							this.getSelectBox($(tds[i]).html(),$(ths[i]).find('select:first'));
							break;
							default:;
					}
			}
		},
		clearDataToLine:function(){
			if(!this.data.editable)return;
			var ths = $(this.thead).find('.normalfont th');
			for(var i=0;i<this.data.head.length;i++){
				var o=this.data.head[i];
					switch (o.type){
						case "checkbox":
							break;
						case "nochangetext":
							$(ths[i]).html('');
							break;
						case "text":
							$(ths[i]).find('input:first').val('');
							break;
						case "select":
							this.getSelectBox('None',$(ths[i]).find('select').first());
							break;
							default:;
					}
			}
		},
		resetLine:function(){
			if(!this.data.editable)return;
			var ths = $(this.thead).find('.normalfont th');
			for(var i=0;i<this.data.head.length;i++){
				var o=this.data.head[i];
					switch (o.type){
						case "checkbox":
							break;
						case "nochangetext":
							$(ths[i]).html('');
							break;
						case "text":
							$(ths[i]).find('input').first().val('');
							break;
						case "select":
							this.getSelectBox('None',$(ths[i]).find('select').first());
							break;
							default:;
					}
			}
		},
		getSelectBox:function(value, obj){
			obj.val(value);
			return;
		},
		getChecklist:function(){
			return this.checklist;
		},
		getPageInfo:function(){
			return {page:this.page,totalpage:this.totalpage};
		},
		needPaging:function(){
			trace(this.total);
			trace(this.pagesize);
			return this.total>this.pagesize;
		}
};
PM.normalTable=PM.create();
PM.normalTable.prototype={
		data:{},
		cnt:null,
		checknum:0,
		initialize:function(param,cnt){
			if(typeof param =='string')param=HE.json2Obj(param);
			this.data=param;
			trace('init');
			if(!cnt){
				return;
			}
			this.cnt=cnt;
			this.createTable();
			this.createBody();
			this.setEvent();
			
		},
		createTable:function(){;
			trace('go')
			_this=this;
			$(this.cnt).html('<table align="center" border="0" cellspacing="1" cellpadding="1" class="'+(this.data.cls||'')+'"></table>');
			this.table=HE.$('table',this.cnt)[0];
			this.thead=HE.$('thead',this.table)[0];
			this.tbody=HE.$('tbody',this.table)[0];
		},
		createHead:function(){
			var tr=PM.$c('tr');
			var tr2=PM.$c('tr');
			tr2.className='normalfont';
			for(var i=0;i<this.data.head.length;i++){
				var o=this.data.head[i];
				var th=PM.$c('th');
				th.className=o.cls;
				th.innerHTML=o.value;
				tr.appendChild(th);
					
			}
			this.table.appendChild(tr);
		},
		createBody:function(){
			for(var i=0;i<this.data.body.length;i++){
				var o=this.data.body[i];
				var tr=PM.$c('tr');
				for(var m=0;m<o.length;m++){
					var td=PM.$c('td');
					var el=o[m];
					
					td.className=el.cls||'';
					if(el.clospan)
						td.colSpan=el.clospan;
					trace(el.type)
					switch (el.type){
					case "checkbox":
						var inp=PM.$c('input');
						inp.type='checkbox';
						inp.id=el.id||'allcheck';
						td.appendChild(inp);
						//tr.appendChild(th);
						break;
					case "nochangetext":
						td.innerHTML=el.value;
						//tr.appendChild(td);
						break;
					case "button":
						var inp=PM.$c('input');
						inp.type='button';
						inp.value=el.value;
						if(el.funcs){
							for(var k in el.funcs){
								inp['on'+k]=el.funcs[k];
							}
						}
						td.appendChild(inp);
						//tr.appendChild(td);
						break;
					case "text":
						var inp=PM.$c('input');
						inp.type='text';
						inp.size=el.size||8;
						inp.value=el.value;
						td.appendChild(inp);
						//tr.appendChild(td);
						break;
					case "select":
						var str='<select>';
						for(var j=0;j<el.options.length;j++)str+='<option value="'+el.options[j].v+'">'+el.options[j].t+'</option>';
						str+='</select>';
						td.innerHTML=str;
						//tr.appendChild(td);
						break;
					}
					tr.appendChild(td);
				}
				this.table.appendChild(tr);
			}
		},
		setEvent:function(){
		},
		getSelectBox:function(value, obj){
			for ( var i = 0; i < obj.options.length; i++) {
				if (obj.options[i].value == value) {
					obj.selectedIndex = i;
				}
			}
		},
		getChecklist:function(){
			
		}
};
PM.checkRange=function(obj,rangefrom,rangeto){
	obj.value=obj.value.replace(/\D/gi,'');
	while(obj.value!=''&&(obj.value>rangeto||obj.value<rangefrom)){
		obj.value=obj.value.slice(0,-1);
	}
};
PM.checkRange2=function(value,rangefrom,rangeto){
	//value=value.replace(/\D/gi,'');
    if(!/^\-{0,1}\d+$/gi.test(value))
        return false;
	if(value>rangeto||value<rangefrom)
		return false;
	else
		return true;
}
PM.checkMACAddress=function(v){
	if(/^[\da-fA-F]{4}\.[\da-fA-F]{4}\.[\da-fA-F]{4}$/.test(v)&&!/^0{4}\.0{4}\.0{4}$/.test(v)&&/^[\da-fA-F]{1}[0|2|4|6|8|A|a|C|c|E|e]/.test(v)){
		return true;
	}
	return false;
};
PM.checkIPAddress=function(v){
	if(/^[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}$/.test(v)&&!/^0{1,3}\.0{1,3}\.0{1,3}\.0{1,3}$/.test(v)){
		return true;
	}
	return false;
};
PM.checkHostname=function(v){
    if(/^[\w|\d|\-|\.]{1,255}$/gi.test(v)&&!(/^\-/gi.test(v)||/\-$/gi.test(v)||/.*\-\-.*/gi.test(v))){
        return true;
    }
    return false;
};
PM.getUrl=function(s){
    var url=s+'r='+Math.random();
    return url;
}
PM.ChangeRowColor=function(obj){
	var myRow = obj.parentNode.parentNode; 
	if(HE.hasClass(myRow, 'selectRow')){
		HE.removeClass(myRow, 'selectRow');
	}else{
		HE.addClass(myRow, 'selectRow');
	}
};
PM.enableButton=function() {
	if(arguments.length==0){
		$.each(top.$('#btnarea a'),function(){
			$(this).removeClass('disable').attr('disabled',false);
		});
		return;
	}
	for(i=0;i<arguments.length;i++){
	    top.$('#'+arguments[i]).removeClass('disable').attr('disabled',false);

	}
};
PM.disableButton=function() {
	if(arguments.length==0){
		$.each(top.$('#btnarea a'),function(){
			$(this).addClass('disable').attr('disabled',true);
		});
		return;
	}
	for(i=0;i<arguments.length;i++){
	   top.$('#'+arguments[i]).addClass('disable').attr('disabled',true);
	}
};

PortMirror=PM.create();
PortMirror.prototype={
		initialize:function(result,cntlist){
			var _this=this;
			this.radiomap={'ingress':0,'egress':1,'both':2,'none':3};//映射关系，映射到ingress_str，因此不用大写
			this.radiomap2={'0':'ingress','1':'egress','2':'both','3':'none'};//
			this.group=cntlist.group;
			this.table1=cntlist.table1;
			this.table2=cntlist.table2;
			this.table3=cntlist.table3;
			this.result=result;
			this.prefix=RouterConfig.prefix;
			this.length=RouterConfig.portnum;
			this.ingress_str='';
			this.egress_str='';
			this.both_str='';
			this.ingress_text=$('#ingress_text');
			this.egress_text=$('#egress_text');
			this.both_text=$('#both_text');
			
			this.sel_group=$('#sel_group');
			this.sel_status=$('#sel_status');
			this.sel_analy_port1=$('#sel_analy_port1');
			this.sel_analy_port2=$('#sel_analy_port2');
			
			this.sel_analy_dir1=$('#sel_analy_dir1');
			this.sel_analy_dir2=$('#sel_analy_dir2');
			this.trArr=[$('table:eq(1) tr:eq(0)'),$('table:eq(1) tr:eq(1)'),$('table:eq(1) tr:eq(2)'),$('table:eq(1) tr:eq(3)'),$('table:eq(1) tr:eq(4)')];
			this.genreateDOM();
			this.analyarr=new Array(3);
			this.gressarr=[new Array((this.length+1)),new Array((this.length+1)),new Array((this.length+1)),new Array((this.length+1))];
			for(var i=0;i<this.gressarr[3].length;i++){
				this.gressarr[3][i]=1;
			}

			var analyzerport=$(result).find('analyzer-port');//this.result.getElementsByTagName('analyzer-port');
			if(analyzerport.length==0){this.status='Disable';}else{this.status='Enable';}

			
			this.sel_group.change(function(){
				_this.changeGroup();
			})
			
			this.sel_status.change(function(){
				if(_this.sel_status.val()=='Enable'){
					_this.enableAll();
				}else{
					_this.disableAll();	
				}
			});
			
			this.createTable1();
			
			var mirroredport=$(result).find('mirrored-port:first');
			if(mirroredport.length>0&&mirroredport.children().length>0){
				var _this=this;
				var ports=mirroredport.find('port');
				ports.each(function(){
					var id=$.trim($(this).find('id').text());
					var num=id.split('/')[1];
					trace('num='+num+',id='+id);
					var direction=$.trim($(this).find('direction').text());
					trace('direction='+direction);
					switch(direction){
					case "Ingress":
						_this.ingress_str+=id+',';
						_this.gressarr[0][num]=1;
						_this.gressarr[3][num]=0;
						break;
					case "Egress":
						_this.egress_str+=id+',';
						_this.gressarr[1][num]=1;
						_this.gressarr[3][num]=0;
						break;
					case "Both":
						_this.both_str+=id+',';
						_this.gressarr[2][num]=1;
						_this.gressarr[3][num]=0;
						break;
					}
				});
			}
			
			this.createTable2();

			this.createTable3();
			if(this.status=='Disable'){
				this.disableAll();
			}
		},
		genreateDOM:function(){
			for(var i=1;i<=RouterConfig.portnum;i++){
				this.sel_analy_port1.append('<option value="'+i+'">'+RouterConfig.prefix+'/'+i+'</option>');
				this.sel_analy_port2.append('<option value="'+i+'">'+RouterConfig.prefix+'/'+i+'</option>');
				this.trArr[0].append('<th class="wd25">'+i+'</th>');
				for(var j=1;j<this.trArr.length;j++){
					this.trArr[j].append('<th class="wd25"><input type="radio" class="taArr'+j+'" name="gressradio'+i+'" value="'+this.radiomap2[j-1]+'_'+i+'" /></th>');
				}
			}
		},
		createTable1:function(){
			var _this=this;
			this.makeSelect(this.sel_group,this.group);
			this.makeSelect(this.sel_status,this.status);
			var analyzerport=$(this.result).find('analyzer-port:first');
			if(analyzerport.length>0&&analyzerport.children().length>0){
				var ports=$(analyzerport).find('port');
				ports.each(function(i){
					
					var id=$.trim($(this).find('id').text()).split('/')[1];
					var directions=$.trim($(this).find('direction').text());
					_this.analyarr[(i+1)]=id;
					_this.analyPort((i+1),id);
					_this.direction((i+1),directions);
				});
			}
			this.sel_analy_port1.change(function(){
				var id=_this.sel_analy_port1.val();
				_this.analyPort(1,id);
			});
			this.sel_analy_port2.change(function(){
				var id=_this.sel_analy_port2.val();
				_this.analyPort(2,id);
			});
			this.sel_analy_dir1.change(function(){
				var value=_this.sel_analy_dir1.val();
				_this.direction(1,value);
			});
			this.sel_analy_dir2.change(function(){
				var value=_this.sel_analy_dir2.val();
				_this.direction(2,value);
			});
		},
		analyPort:function(num,id){
			var n=(num==1?2:1);
			if(id!=''&&id==this.analyarr[n]){
				alert('analyzer-port must different!');
				this.makeSelect(this['sel_analy_port'+num],'');
				return;
			}
			this.makeSelect(this['sel_analy_port'+num],id);
			
			if(this.analyarr[num]!=''&&this.analyarr[1]!=this.analyarr[2]){
				this.enableRadio(this.analyarr[num]);
			}
			this.analyarr[num]=id;
			if(id==''){
				this.direction(num,id);
			}else{
				this.disableRadio(this.analyarr[num]);
			}
			this.makeText();
		},
		direction:function(num,value){
			this.makeSelect(this['sel_analy_dir'+num],value);
			var n=(num==1?2:1);
			if(value=='Both'){
				this['sel_analy_port'+n].attr('disabled',true).val('');
				this['sel_analy_dir'+n].attr('disabled',true).val('');
				this.enableRadio(this.analyarr[n]);
			}else{
				this['sel_analy_port'+n].removeAttr('disabled');
				this['sel_analy_dir'+n].removeAttr('disabled');
				this.disableRadio(this.analyarr[n]);
			}
			this.makeText();
		},
		enableRadio:function(num){
			var radios=document.getElementsByName('gressradio'+num);
			for(var j=0;j<radios.length;j++){
				$(radios[j]).removeAttr('disabled');
				$(radios[j]).attr('checked')?this.gressarr[j][num]=1:this.gressarr[j][num]=0;
			}
		},
		disableRadio:function(num){
			var radios=document.getElementsByName('gressradio'+num);
			for(var j=0;j<radios.length;j++){
				$(radios[j]).attr('disabled',true);
				j==3?this.gressarr[j][num]=1:this.gressarr[j][num]=0;
				j==3?$(radios[j]).attr('checked',true):'';
			}
		},
		createTable2:function(){
			trace('createTable2');
			trace(this.gressarr);
			var _this=this;
			
			for(var i=0;i<this.gressarr.length;i++){
				var radios=$('input.taArr'+(i+1));
				for(var j=0;j<radios.length;j++){
					if(_this.gressarr[i][j+1]==1){
						$(radios[j]).attr('checked',true);
						
					}
				}
				radios.each(function(){
					$(this).click(function(){
						var v=$(this).val();
						var type=v.split('_')[0];
						var num=v.split('_')[1];
						for(var k=0;k<_this.gressarr.length;k++)_this.gressarr[k][num]=0;
						_this.gressarr[_this.radiomap[type]][num]=1;
						_this.makeText();
					});
				})
			}
		},
		makeText:function(){
			for(var k in this.radiomap2){
				this[this.radiomap2[k]+'_str']='';
			}
			trace(this.gressarr)
			for(var i=0;i<this.gressarr.length;i++){
				var a=this.gressarr[i];
				for(var j=0;j<a.length;j++){
					if(a[j]==1)this[this.radiomap2[i]+'_str']+=this.prefix+'/'+j+',';
				}
			}
			this.createTable3();
		},
		createTable3:function(){	
			this.ingress_text.val(this.ingress_str.replace(/,$/i,''));
			this.egress_text.val(this.egress_str.replace(/,$/i,''));
			this.both_text.val(this.both_str.replace(/,$/i,''));
		},
		
		makeSelect:function(obj,value){
			$(obj).val(value);
		},
		changeGroup:function(){
			var group=$('#sel_group').val();
			var url=location.href;
			if(group!=''){
				url=PM.setPara(url,'group',group);
			}else{
				url=PM.removePara(url,'group');
			}
			window.location.href=url;
		},
		disableAll:function(){
			for(var i=1;i<3;i++){
				this['sel_analy_port'+i].val('');
				this['sel_analy_dir'+i].val('');
				this['sel_analy_port'+i].attr('disabled',true);
				this['sel_analy_dir'+i].attr('disabled',true);
			}
			for(var i=1;i<=this.length;i++){
				this.disableRadio(i);
			}
			
			this.makeText();
			return;
		},
		enableAll:function(){
			$('input').each(function(){
				$(this).removeAttr('disabled');
			});
			
			$('select').each(function(){
				$(this).removeAttr('disabled');
			});
			
		},
		submit:function(){
			var url=RouterConfig.commit;

			url+=decodeURIComponent($.param({dispatch:'cfg-mirror',group:this.sel_group.val(),status:this.sel_status.val(),r:Math.random()}));
			if(this.sel_status.val()=='disable'){
				this.commit(url);
				return;
			}
			var tmpdir1='';
			if(!this.sel_analy_port1.attr('disabled')&&this.sel_analy_port1.val()!=''){
//				url=HE.setPara(url,'analyzer_port1',this.prefix+'/'+this.sel_analy_port1.value);
				url+="&"+decodeURIComponent($.param({analyzer_port1:this.prefix+'/'+this.sel_analy_port1.val()}));
				if(this.sel_analy_dir1.val()==''){
					alert($('#dir_tips').val());
					return;
				}
				tmpdir1=this.sel_analy_dir1.val();
				url+="&"+decodeURIComponent($.param({direction1:this.sel_analy_dir1.val()}));
			}
			if(!this.sel_analy_port2.attr('disabled')&&this.sel_analy_port2.val()!=''){
				url+="&"+decodeURIComponent($.param({analyzer_port2:this.prefix+'/'+this.sel_analy_port2.val()}));
				if(this.sel_analy_dir2.val()==''||tmpdir1==this.sel_analy_dir2.val()){
					alert($('#dir_tips').val());
					return;
				}
				url+="&"+decodeURIComponent($.param({direction2:this.sel_analy_dir2.val()}));
			}

			url+="&"+decodeURIComponent($.param({ingress_mirrored_port:this.ingress_text.val(),egress_mirrored_port:this.egress_text.val(),both_mirrored_port:this.both_text.val()}));
			PM.disableButton();
			this.commit(url);
		},
		commit:function(url){
			$.ajax({
				url:url,
				type:'GET',
				dataType:'xml'
			}).done(function(res){
				manageResult(res);
			});
		}
};


PortIsolation=PM.create();
PortIsolation.prototype={
		initialize:function(result,cntlist){
			var _this=this;
			this.radiomap={'ingress':0,'egress':1,'both':2,'none':3};//映射关系，映射到ingress_str，因此不用大写
			this.radiomap2={'0':'ingress','1':'egress','2':'both'};//
			this.group=cntlist.group;
			this.table1=cntlist.table1;
			this.table2=cntlist.table2;
			this.table3=cntlist.table3;
			this.result=result;
			this.prefix=RouterConfig.prefix;
			this.length=RouterConfig.portnum;
			
			this.ingress_str='';
			this.egress_str='';
			this.both_str='';
			this.ingress_text=$('#ingress_text');
			this.egress_text=$('#egress_text');
			this.both_text=$('#both_text');

			this.analyarr=new Array(3);
			this.gressarr=[new Array((this.length+1)),new Array((this.length+1)),new Array((this.length+1)),new Array((this.length+1))];
			for(var i=0;i<this.gressarr[3].length;i++){
				this.gressarr[3][i]=1;
			}
			var grouplist=$(result).find('group');//this.result.getElementsByTagName('analyzer-port');
			if(grouplist.length==0){this.status='Disable';}else{this.status='Enable';}

			this.sel_group=$('#sel_group');
			this.sel_group.change(function(){
				_this.changeGroup();
			});
			
			this.sel_status=$('#sel_status');
			this.sel_status.change(function(){
				if(_this.sel_status.val()=='Enable'){
					_this.enableAll();
				}else{
					_this.disableAll();	
				}
			});
			if(this.status=='Disable'){
				this.disableAll();
			}
			this.sel_analy_port1=$('#sel_analy_port1');
			this.sel_analy_port2=$('#sel_analy_port2');
			
			this.sel_analy_dir1=$('#sel_analy_dir1');
			this.sel_analy_dir2=$('#sel_analy_dir2');
			
			this.createTable1();
			$(this.result).find('group').each(function(){
				var ids=$(this).find('id');
				var upports=$(this).find('uplink-port-list');
				var isports=$(this).find('isol-port-list');
				upports.each(function(){
					$(this).find('port').each(function(){
						var id=$.trim($(this).text());
						var num=id.split('/')[1];
						_this.ingress_str+=id+',';
						_this.gressarr[0][num]=1;
						_this.gressarr[3][num]=0;
					});
				});			
				isports.each(function(){
					$(this).find('port').each(function(){
						var id=$.trim($(this).text());
						var num=id.split('/')[1];
						_this.egress_str+=id+',';
						_this.gressarr[1][num]=1;
						_this.gressarr[3][num]=0;
					});
				});
			});
			trace('this.ingress_str='+this.ingress_str);
			trace('this.egress_str='+this.egress_str);
			this.createTable2();

			this.createTable3();

		},
		createTable1:function(){
			var _this=this;
			trace('this.group='+this.group);
			this.makeSelect(this.sel_group,this.group);
			this.makeSelect(this.sel_status,this.status);

		},
		analyPort:function(num,id){
		},
		direction:function(num,value){
		},
		disableAll:function(){
			for(var i=1;i<=this.length;i++){
				this.disableRadio(i);
			}
		},
		enableAll:function(){
			$('input').each(function(){
				$(this).removeAttr('disabled');
			});
			$('select').each(function(){
				$(this).removeAttr('disabled');
			});
		},
		submit:function(){
			var url=RouterConfig.port_isolation;
			url=PM.setPara(url,'dispatch','cfg-isol');
			url=PM.setPara(url,'group',this.sel_group.val());
			url=PM.setPara(url,'status',this.sel_status.val());
			url=PM.setPara(url,'r',Math.random());
			if(this.sel_status.val()=='Disable'){
				this.commit(url);
				return;
			}else if(this.sel_status.val()==''){
				alert($('#statuserr').val());
				return;
			}
			url=PM.setPara(url,'uplink-port-list',this.ingress_text.val());
			url=PM.setPara(url,'isol-port-list',this.egress_text.val());
			this.commit(url);
		},
		commit:function(url){
			$.ajax({
				url:url
			}).done(function(res){
				manageResult(res);
			});
		}
};
$extend(PortIsolation.prototype,PortMirror.prototype,true);


var Dialog = PM.create();

Dialog.prototype = {
	_template : {
		'default' : [
		            '<table id="dialog_table_{id}" class="CP_w" style="display:none;left: {left}px; top: {top}px; z-index: 1024; position: absolute; opacity: 1;">',
							'<thead style=" -moz-user-select: none;">',
							'<tr>',
								'<th class="tLeft"><span></span></th>',
								'<th class="tMid">',
									'<div class="bLyTop">',
										'<strong>{title}</strong>',
										'<cite><a id="btnClose_{id}" href="#" onclick="return false;" class="CP_w_shut" title="关闭">关闭</a></cite></cite>',
									'</div>',
								'</th>',
								'<th class="tRight"><span></span></th>',
							'</tr>',
						'</thead>',
						'<tfoot>',
							'<tr>',
								'<td class="tLeft"><span></span></td>',
								'<td class="tMid"><span></span></td>',
								'<td class="tRight"><span></span></td>',
							'</tr>',
						'</tfoot>',
						'<tbody>',
							'<tr>',
								'<td class="tLeft"><span></span></td>',
								'<td class="tMid">',
									'<div id="content_{id}" class="CP_layercon2" style="width:{width}px; height:{height}px;">',
										'{content}',
									'</div>',
								'</td>',
								'<td class="tRight"><span></span>',
								'</td>',
							'</tr>',
						'</tbody>',
					'</table>'].join(""),
		'confirm' : [
		 			'<table id="dialog_table_{id}" class="CP_w" style="display:none;left: {left}px; top: {top}px; z-index: 1024; position: absolute; opacity: 1;">',
						'<thead id="titleBar_{id}">',
							'<tr>',
								'<th class="tLeft"><span></span></th>',
								'<th class="tMid"><div class="bLyTop"><strong id="titleName_{id}">{title}</strong><cite><a id="btnClose_{id}" href="#" onclick="return false;" class="CP_w_shut" title="关闭">关闭</a></cite></div></th>',
								'<th class="tRight"><span></span></th>',
							'</tr>',
						'</thead>',
						'<tfoot>',
							'<tr>',
								'<td class="tLeft"><span></span></td>',
								'<td class="tMid"><span></span></td>',
								'<td class="tRight"><span></span></td>',
							'</tr>',
						'</tfoot>',
						'<tbody>',
							'<tr>',
								'<td class="tLeft"><span></span></td>',
								'<td class="tMid">',
								'<div id="content_{id}" class="CP_layercon1" style="width:{width}px; height:{height}px;" >',	
									'<div class="CP_prompt">',
									'<cite id="icon_{id}" class="SG_icon SG_icon2{icon}" style="width:50px;height:50px"></cite>',
									'<table class="CP_w_ttl"><tr><td id="text_{id}">{content}</td></tr></table>',
									'<div id="subText_{id}" class="CP_w_cnt SG_txtb">{subContent}</div>',
									'<p class="CP_w_btns">',
										'<a  id="linkOk_{id}" class="SG_aBtn SG_aBtnB" href="#" onclick="return false;"><cite id="btnOk_{id}">{textOk}</cite></a>',
										'<a  style="margin-left:15px;" id="linkCancel_{id}" class="SG_aBtn {cancelStyle}" href="#" onclick="return false;"><cite id="btnCancel_{id}">{textCancel}</cite></a></p>',
									'</div>',
								'</div>',
								'</td>',
								'<td class="tRight"><span></span></td>',
							'</tr>',
						'</tbody>',
					'</table>'].join(""),
		'alert' : [
		          '<table id="dialog_table_{id}" class="CP_w" style="display:none;left: {left}px; top: {top}px; z-index: 1024; position: absolute; opacity: 1;">',
						'<thead id="titleBar_{id}">',
						'<tr>',
							'<th class="tLeft"><span></span></th>',
							'<th class="tMid"><div class="bLyTop"><strong id="titleName_{id}">{title}</strong><cite><a id="btnClose_{id}" href="#" onclick="return false;" class="CP_w_shut" title="关闭">关闭</a></cite></div></th>',
							'<th class="tRight"><span></span></th>',
						'</tr>',
					'</thead>',
					'<tfoot>',
						'<tr>',
							'<td class="tLeft"><span></span></td>',
							'<td class="tMid"><span></span></td>',
							'<td class="tRight"><span></span></td>',
						'</tr>',
					'</tfoot>',
					'<tbody>',
						'<tr>',
							'<td class="tLeft"><span></span></td>',
							'<td class="tMid">',
							'<div id="content_{id}" class="CP_layercon1">',	
								'<div class="CP_prompt">',
								'<cite id="icon_{id}" class="SG_icon SG_icon2{icon}" style="width:50px;height:50px"></cite>',
								'<table class="CP_w_ttl"><tr><td id="text_{id}">{content}</td></tr></table>',
								'<div id="subText_{id}" class="CP_w_cnt SG_txtb">{subContent}</div>',
								'<p class="CP_w_btns_Mid"><a id="linkOk_{id}" class="SG_aBtn SG_aBtnB" href="#" onclick="return false;"><cite id="btnOk_{id}">{textOk}</cite></a></p>',
								'</div>',
							'</div>',
							'</td>',
							'<td class="tRight"><span></span></td>',
						'</tr>',
					'</tbody>',
				'</table>'].join(""),
			'nobtn' : [
			          	'<table id="dialog_table_{id}" class="CP_w" style="display:none;left: {left}px; top: {top}px; z-index: 1024; position: absolute; opacity: 1;">',
							'<thead id="titleBar_{id}">',
							'<tr>',
								'<th class="tLeft"><span></span></th>',
								'<th class="tMid"><div class="bLyTop"><strong id="titleName_{id}">{title}</strong></div></th>',
								'<th class="tRight"><span></span></th>',
							'</tr>',
						'</thead>',
						'<tfoot>',
							'<tr>',
								'<td class="tLeft"><span></span></td>',
								'<td class="tMid"><span></span></td>',
								'<td class="tRight"><span></span></td>',
							'</tr>',
						'</tfoot>',
						'<tbody>',
							'<tr>',
								'<td class="tLeft"><span></span></td>',
								'<td class="tMid">',
								'<div id="content_{id}" class="CP_layercon1">',	
									'<div class="CP_prompt">',
									'<cite id="icon_{id}" class="SG_icon SG_icon2{icon}" style="width:50px;height:50px"></cite>',
									'<table class="CP_w_ttl"><tr><td id="text_{id}">{content}</td></tr></table>',
									'<div id="subText_{id}" class="CP_w_cnt SG_txtb">{subContent}</div>',
									'</div>',
								'</div>',
								'</td>',
								'<td class="tRight"><span></span></td>',
							'</tr>',
						'</tbody>',
					'</table>'].join(""),
		'custom' : [
		            '<table id="dialog_table_{id}" class="CP_w" style="display:none;left: {left}px; top: {top}px; z-index: 1024; position: absolute; opacity: 1;">',
			            '<tr>',
							'<td id="dialog_container_{id}">',
									'{content}',
							'</td>',
						'</tr>',
					'</table>'].join(""),
		'iframe' : [
					'<table id="dialog_table_{id}" class="CP_w" style="display:none;left: {left}px; top: {top}px; z-index: 1024; position: absolute; opacity: 1;">',
						'<thead style=" -moz-user-select: none;">',
						'<tr>',
							'<th class="tLeft"><span></span></th>',
							'<th class="tMid">',
								'<div class="bLyTop">',
									'<strong>{title}</strong>',
									'<cite><a id="btnClose_{id}" href="#" onclick="return false;" class="CP_w_shut" title="关闭">关闭</a></cite></cite>',
								'</div>',
							'</th>',
							'<th class="tRight"><span></span></th>',
						'</tr>',
						'</thead>',
						'<tfoot>',
						'<tr>',
							'<td class="tLeft"><span></span></td>',
							'<td class="tMid"><span></span></td>',
							'<td class="tRight"><span></span></td>',
						'</tr>',
						'</tfoot>',
						'<tbody>',
						'<tr>',
							'<td class="tLeft"><span></span></td>',
							'<td class="tMid">',
								'<div id="content_{id}" style="width:{width}px; height:{height}px;">',
									'{content}',
								'</div>',
							'</td>',
							'<td class="tRight"><span></span>',
							'</td>',
						'</tr>',
						'</tbody>',
					'</table>'].join("")
	},
	initialize : function(args) {
		if (this.created == true) {
			this.show();
		}
		this.created = true;
		this.createMask();
		this.createDialog(args);
		
	},
	$c : function(tag) {
		return document.createElement(tag);
	},
	$e : function(id) {
		return document.getElementById(id);
	},
	createMask : function() {
		this._id =new Date().getTime();
		var mask = this.$c('div');
		mask.className = 'dialog_mask';
		mask.id = 'dialog_mask_' + this.getId();
		document.body.appendChild(mask);
	},
	createDialog : function(args) {
		var param = args || {};
		param.title = param.title || "";
		this._closeFunc = param.closeFunc || function() {};
		this._confirmFunc=param.confirmFunc||function(){};
		this._cancelFunc=param.cancelFunc||function(){};
		param.width = param.width || "600";
		param.height = param.height || "300";
		param.left = param.left || "50";
		param.top = param.top || "200";
		param.content = param.content|| '';
		param.type = param.type || 'default';
		param.id = this.getId();
		this.isDestory=param.isDestory||false;
		if(param.type=='confirm'||param.type=='alert'){
			param.icon=args.icon||"01";//should be 01,02,03,04
			param.textOk=args.textOk||"OK";
			param.textCancel=args.textCancel||"CANCAL";
			param.cancelStyle=args.cancelStyle||"SG_aBtn";
		}
		if(param.content){
			param.content=this.substitute(param.content,{id:this.getId()});
		}
		var template = this.getTemplate(param.type);
		var html = this.substitute(template, param);
		this.insertHTML(document.body, html, 'BeforeEnd');

		this.bindEvent();

		
	},
	bindEvent : function() {
		var id=this.getId();
		this.mask = this.$e('dialog_mask_'+id);
		this.dialog = this.$e('dialog_table_'+id);
		this.closeBtn = this.$e('btnClose_'+id);
		this.linkOk = this.$e('linkOk_'+id);
		this.linkCancel = this.$e('linkCancel_'+id);
		
		if(this.closeBtn){
			this.addEvent(this.closeBtn,this._closeFunc);
			this.addEvent(this.closeBtn,this.bindFunc(this.hide,this));
		}
		if(this.linkOk){
			this.addEvent(this.linkOk,this.bindFunc(this.hide,this));
			this.addEvent(this.linkOk,this._confirmFunc);
		}
		if(this.linkCancel){
			this.addEvent(this.linkCancel,this.bindFunc(this.hide,this));
			//this.addEvent(this.linkCancel,this._closeFunc);
			this.addEvent(this.linkCancel,this._cancelFunc);
		}
		
	},
	bindFunc : function(func, obj) {
		var __method = func;
		return function() {
			return __method.apply(obj, arguments);
		};
	},
	addEvent : function(elm, func, evType, useCapture) {
		var _el = typeof elm == 'string' ? this.$e(elm) : elm;
		if (_el == null) {
			trace("addEvent 找不到对象：" + elm);
			return;
		}
		if (typeof useCapture == 'undefined') {
			useCapture = false;
		}
		if (typeof evType == 'undefined') {
			evType = 'click';
		}
		if (_el.addEventListener) {
			_el.addEventListener(evType, func, useCapture);
			return true;
		} else if (_el.attachEvent) {
			var r = _el.attachEvent('on' + evType, func);
			return true;
		} else {
			_el['on' + evType] = func;
		}
	},
	getId : function() {
		return this._id;
	},
	getTemplate : function(type) {
		return this._template[type];
	},
	setContainer : function(inner){
		var id=this.getId();
		this.container = this.$e('dialog_container_'+id);
		if(this.container){
			this.container.innerHTML=inner;
		}
	},
	show : function() {
		this.mask.style.display = "block";
		this.dialog.style.display = "block";
		return this;
	},
	hide : function() {
		if(this.isDestory){
			this.destroy();
		}else{
			this.mask.style.display = "none";
			this.dialog.style.display = "none";
		}
	},
	destroy : function(){
		this.dialog.parentNode.removeChild(this.dialog);
		this.mask.parentNode.removeChild(this.mask);
	},
	insertHTML : function(el, html, where) {
		el = el || document.body;
		where = where.toLowerCase() || "beforeend";
		if (el.insertAdjacentHTML) {
			switch (where) {
			case "beforebegin":
				el.insertAdjacentHTML('BeforeBegin', html);
				return el.previousSibling;
			case "afterbegin":
				el.insertAdjacentHTML('AfterBegin', html);
				return el.firstChild;
			case "beforeend":
				el.insertAdjacentHTML('BeforeEnd', html);
				return el.lastChild;
			case "afterend":
				el.insertAdjacentHTML('AfterEnd', html);
				return el.nextSibling;
			}
		}
		var range = el.ownerDocument.createRange();
		var frag;
		switch (where) {
		case "beforebegin":
			range.setStartBefore(el);
			frag = range.createContextualFragment(html);
			el.parentNode.insertBefore(frag, el);
			return el.previousSibling;
		case "afterbegin":
			if (el.firstChild) {
				range.setStartBefore(el.firstChild);
				frag = range.createContextualFragment(html);
				el.insertBefore(frag, el.firstChild);
				return el.firstChild;
			} else {
				el.innerHTML = html;
				return el.firstChild;
			}
			break;
		case "beforeend":
			if (el.lastChild) {
				range.setStartAfter(el.lastChild);
				frag = range.createContextualFragment(html);
				el.appendChild(frag);
				return el.lastChild;
			} else {
				el.innerHTML = html;
				return el.lastChild;
			}
			break;
		case "afterend":
			range.setStartAfter(el);
			frag = range.createContextualFragment(html);
			el.parentNode.insertBefore(frag, el.nextSibling);
			return el.nextSibling;
		}
	},
	substitute : function(temp, data, regexp) {// copy form lib_0_2
		if (!(Object.prototype.toString.call(data) === "[object Array]"))
			data = [ data ];
		var ret = [];
		for ( var i = 0, j = data.length; i < j; i++) {
			ret.push(replaceAction(data[i]));
		}
		return ret.join("");
		function replaceAction(object) {
			return temp.replace(regexp || (/\\?\{([^}]+)\}/g), function(match,
					name) {
				if (match.charAt(0) == '\\')
					return match.slice(1);
				return (object[name] != undefined) ? object[name] : '';
			});
		}
	}
}
