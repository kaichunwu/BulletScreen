var video = {
	onload: function() {
		var player = document.getElementById("player");
		var button = document.getElementById('video-btn');
		var curtime = document.getElementById('curtime');
		var duration = document.getElementById('duration');
		var full = document.getElementById('fullscreen');
		var point = document.getElementsByClassName('imgBox')[0];
		point.style.left = 0;
		var box = document.getElementsByClassName('progressBox')[0];
		var pointwidth = parseInt(document.defaultView.getComputedStyle(point.children[0]).width);
		var passed = document.getElementById('passed');
		var submitBarrager = document.getElementById('submitbarrager');
		duration.innerHTML = timeFormat(0);
		player.addEventListener('canplay',function(){
			duration.innerHTML = timeFormat(player.duration);
		});
		curtime.innerHTML = timeFormat(0);
		player.addEventListener('pause',function(){
			clearInterval(inter);
		});
		addHandler(button,"click",function(event){
			if(player.paused){
				player.play();
				button.value = "Pause";
				button.innerHTML = "Pause";
				clearAll();
				inter = setInterval(function(){
					curtime.innerHTML=timeFormat(player.currentTime);
					point.style.left = ((player.width-pointwidth)*player.currentTime/player.duration)+"px";
					passed.width = ((player.width-pointwidth)*player.currentTime/player.duration);
					barragerMove(player.width);
					barragerStart(player.currentTime,document.defaultView.getComputedStyle(player).height);
					if(killbarrager) clearAll();				
				},250);
			}
			else{
				player.pause();
				button.value = "Play";
				button.innerHTML = "Play";
				clearInterval(inter);
			}		
		});
		addHandler(player,"click",function(event){
			if(player.paused){
				player.play();
				button.value = "Pause";
				button.innerHTML = "Pause";
				clearAll();
				inter = setInterval(function(){
					curtime.innerHTML=timeFormat(player.currentTime);
					point.style.left = ((player.width-pointwidth)*player.currentTime/player.duration)+"px";
					passed.width = ((player.width-pointwidth)*player.currentTime/player.duration);
					barragerMove(player.width);
					barragerStart(player.currentTime,document.defaultView.getComputedStyle(player).height);
					if(killbarrager) clearAll();				
				},250);
			}
			else{
				player.pause();
				button.value = "Play";
				button.innerHTML = "Play";
				clearInterval(inter);
			}
		});
		var muted = document.getElementById('muted');
		var fulldiv = document.getElementsByClassName('fullscreendiv');
		var kill = document.getElementById('kill');
		addHandler(muted,"click",function(event){
			player.muted = !player.muted;
			muted.innerHTML = player.muted ? 'Sound' : 'Muted';
		});
		addHandler(kill,"click",function(event){
			if(kill.value == 'false'){
				kill.value = 'true';
				kill.innerHTML = 'Recover';
				killbarrager = true;
			}else{
				kill.value = 'false';
				kill.innerHTML = 'Kill Barrager';
				killbarrager = false;
			}
		})
		addHandler(full,"click",function(event){
			player.webkitRequestFullScreen();			
			// fulldiv.style.display = 'block';
			// fulldiv.style.backgroundColor = 'yellow';
			// fulldiv.webkitRequestFullScreen();
		});
		addHandler(box,"click",function(event){
			var leftside = parseInt(point.style.left.replace("px",""))
					+(event.clientX+document.body.scrollLeft) - getOffsetLeft(point);
			player.currentTime = leftside/player.width*player.duration;
			curtime.innerHTML=timeFormat(player.currentTime);
			point.style.left = ((player.width-pointwidth)*player.currentTime/player.duration)+"px";
			passed.width = ((player.width-pointwidth)*player.currentTime/player.duration);	
		});
		addHandler(submitBarrager,"click",function(){
			var text = document.getElementsByName('danmu')[0];
			var color = document.getElementsByName('color')[0];
			var barrager = {
				text: text.value,
				color: color.value,
				time: player.currentTime + 1,
				location: 0,
			};
			Barragers.push(barrager);
			// console.log(Barragers);
			for(var b in Barragers){
				console.log(Barragers[b]);
			}
		});
	}
}

var killbarrager = false;
var inter = 0;
var Barragers = [];

function timeFormat(time){
	var sec = parseInt(time%60);
	var min = parseInt(time/60);
	var hr = parseInt(min/60);
	if(sec<10){
		sec = "0"+sec;
	}
	if(min==0){
		return "00:"+sec;
	}
	if(hr>0){
		min = parseInt(min%60);
	}
	if(min<10&&min>0){
		min = "0"+min;
	}
	if(hr==0){
		return min+":"+sec;
	}
	if(hr<10&&hr>0){
		hr = "0"+hr;
	}
	return hr+":"+min+":"+sec;
}

function addHandler(element, type, handler){
    if (element.addEventListener){
        element.addEventListener(type, handler, false);
    } else if (element.attachEvent){
        element.attachEvent("on" + type, handler);
    } else {
        element["on" + type] = handler;
    }
}

function getOffsetTop(el){
	return el.offsetParent
		? el.offsetTop + getOffsetTop(el.offsetParent)
		: el.offsetTop;
}

function getOffsetLeft(el){
	return el.offsetParent
		? el.offsetLeft + getOffsetLeft(el.offsetParent)
		: el.offsetLeft;
}

function barragerStart(curtime,height){
	var hi = parseInt(height);
	var container = document.getElementsByClassName('video')[0];
	for(var i in Barragers){
		if(Barragers[i].time - curtime > -0.125 && Barragers[i].time - curtime < 0.125){
			// emission
			var node = document.createElement('div');
			var textnode = document.createTextNode(Barragers[i].text);
			node.appendChild(textnode);
			node.style.position = 'absolute';
			node.style.top = Math.ceil(Math.random() * (hi - 20)) + "px";
			node.style.right = 0;
			node.style.color = Barragers[i].color;
			container.appendChild(node);
		}
	}
}

function barragerMove(width){
	var container = document.getElementsByClassName('video')[0];	
	for(var i = 1;i < container.children.length;i++){
		if(i>0){
			var children = container.children[i];
			var childwidth = (document.defaultView.getComputedStyle(children)).width;
			if(parseInt(children.style.right) + parseInt(childwidth) > width - 20){
				container.removeChild(children);
				i--;
			}else{
				children.style.right = (parseInt(children.style.right) + 20) + "px";
			}
		}
	}
}

function clearAll(){
	var container = document.getElementsByClassName('video')[0];
	for(var i = 1;i < container.children.length;i++){
		if(i>0){
			container.removeChild(container.children[i]);
			i--;
		}
	}
}