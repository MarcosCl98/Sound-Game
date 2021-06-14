/*
	Event codes:	
0 onMouseMove
1 onClick
2 onDoubleClick
3 onMouseDown
4 onMouseUp
5 onWheel
6 ContextMenu
11 Window scroll
12 Window resize
100 InitTracking
200 TrackingEnd

TOP_LIMIT It's the max size of an event package to be sent.
*/

//var url='http://156.35.81.55/RESTServiceTest.php';
var url = 'http://localhost:8080/data';
var urlRegisterComponent = 'http://156.35.81.55/TrackerServer/restws/registerComponent';
var urlRegisterUserData = 'http://156.35.81.55/TrackerServer/restws/registerUserData';

var list = [];
var sceneId = 0;
var eventCounter = 0;
var trackingOn = false;
var TOP_LIMIT = 500;
var sentRequest = 0;
var pendingRequest = 0;
var timeStart = null;
var timeOpened = null;
var urlPlayer = window.location.href;
var scene = null;
var game = null;
var numberOfClicks = null;
var maxSpeedData = null;
var maxAcelerationData = null;
//NewPage stores the next destination so we can control the moment we leave the page, waiting for every request to be processed in the server
var newPage = null;

var prevEvent, currentEvent;

document.documentElement.onmousemove=function(event){
  currentEvent=event;
}

var maxSpeed=0,prevSpeed=0,maxPositiveAcc=0,maxNegativeAcc=0;
setInterval(function(){
  if(prevEvent && currentEvent){
    var movementX=Math.abs(currentEvent.screenX-prevEvent.screenX);
    var movementY=Math.abs(currentEvent.screenY-prevEvent.screenY);
    var movement=Math.sqrt(movementX*movementX+movementY*movementY);
    
    
    var speed=10*movement;//current speed
    

	if(speed>maxSpeed){
		maxSpeed = speed;
		maxSpeedData = Math.round(maxSpeed);
	}
    
    var acceleration=10*(speed-prevSpeed);
	if(acceleration>maxPositiveAcc){
		maxPositiveAcc = acceleration;
		maxAcelerationData = Math.round(maxPositiveAcc);
	}
   
  }
  
  prevEvent=currentEvent;
  prevSpeed=speed;
},100);

function calculateTimeOpened() {
	var now = new Date();
	var diffMs = (now - timeStart); 
	var diffSec = diffMs / 1000;
	var diffMin = Math.floor(diffSec / 60);
	var secRestantes = Math.floor(diffSec % 60);
	if (secRestantes < 10) {
		var segundos = 0 + secRestantes;
	}
	timeOpened = diffSec/60;
}
function registerUserData(numberOfErrors) {
	calculateTimeOpened();
	list.forEach(element => {
		if (element.eventType == 1) {
			numberOfClicks = element.number;
		}

	});
	var parametros = {
		"timeOpened": timeOpened,
		"urlPlayer": urlPlayer,
		"scene": scene,
		"game": game,
		"numberOfClicks": numberOfClicks,
		"maxSpeed": maxSpeedData,
		"maxAceleration":maxAcelerationData,
		"numberOfErrors":numberOfErrors
	};

	console.log('Registrando user data!!: ' + JSON.stringify(parametros));

	$.ajax({
		data: JSON.stringify(parametros),
		url: url,
		type: 'post',
		contentType: 'application/json;charset=utf-8',
		async: false,    
		cache: false,     
		processData: false,
		beforeSend: function () {
			$("#resultado").html("Registering user data...");
		},
		success: function (response) {
			$("#result").html(response);

		},
		async: false
	});
}

var elements = [];
class Element {
	constructor(id, x, y, xF, yF) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.xF = xF;
		this.yF = yF;
	}

	isOver(mX, mY) {
		if (this.x < mX && mX < this.xF && this.y < mY && mY < this.yF) {
			return true;
		}
		else {
			return false;
		}
	}
}


function trackEvent(eventType) {
	if (trackingOn) {
		trackEventOverElement(eventType, -1)
	}
}


function trackEventOverElement(eventType, elementId) {
	var item = new Object();
	item.id = eventCounter++;
	item.sceneId = sceneId;
	item.eventType = eventType;
	item.timeStamp = Date.now();
	item.number = 1;
	if (window.event !== undefined) {
		item.x = window.event.clientX;
		item.y = window.event.clientY;
	}
	else {
		item.x = 0;
		item.y = 0;
		//console.log('event is null');
	}
	if (item.x == null) {
		item.x = -1;
	}
	if (item.y == null) {
		item.y = -1;
	}
	//item.elementId = detectElement(item.x, item.y);

	//console.log('ITEM: '+JSON.stringify(item));
	var existe = false;
	list.forEach(element => {
		if (element.eventType == eventType) {
			existe = true;
			if(element.maxAcelerationData < item.maxAcelerationData){
				element.maxAcelerationData = item.maxAcelerationData;
			}
			if(element.maxSpeedData < item.maxSpeedData){
				element.maxSpeedData = item.maxSpeedData;
			}
			element.number++;
		}

	});
	if (!existe) {
		list[list.length] = item;
	}
	if (list.length >= TOP_LIMIT) {
		var deliverPackage = list;
		list = [];
		deliverData(deliverPackage);
		//console.log("\n\nJUMP\n\n");
	}
}

// InitTrakcing function
function initTracking(_sceneId) {
	
	trackingOn = true;
	sceneId = _sceneId;

	// We start tracking the mouse movements
	trackEvent(100);
	timeStart = new Date();

	var scena = parent;
	scena.addEventListener('click', function () {
		trackClick();
	});

}


function finishTracking(_newPage, sceneParam, gameParam, numberOfErrors) {

	game = gameParam;
	scene = sceneParam;
	trackEvent(200);
	trackingOn = false;
	registerUserData(numberOfErrors);
}

function deliverChunk(chunk) {
	// alert('deliver chunk');
	var parametros = {
		"timezone": (new Date()).getTimezoneOffset() / 60 * (-1),
		"list": chunk
	};


	alert('Enviando sessionId: ' + parametros['sessionId']);
	console.log('Enviando chunk: ' + JSON.stringify(parametros));

	$.ajax({
		data: JSON.stringify(parametros),
		url: url,
		type: 'post',
		beforeSend: function () {
			// $("#resultado").html("Procesando, espere por favor...");
			//console.log('Procesando, espere por favor...');
			pendingRequest++;
			sentRequest++;
			console.log("Sending request. Pending requests: " + pendingRequest + "/" + sentRequest);

		},
		success: function (response) {
			// $("#result").html(response);
			console.log('Result: ' + response);
			//pendingRequest--;
			console.log("Pending Requests: " + pendingRequest + "/" + sentRequest);
		},
		complete: function (jqXHR, textStatus) {
			pendingRequest--;
			console.log("Call completed. Status: " + textStatus + ", Pending Requests: " + pendingRequest + "/" + sentRequest);
			//We check of we should leave the page.
			checkReadyToLeave();
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			alert("Status: " + textStatus); alert("Error: " + errorThrown);
			//console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nERRORRRRRRRRR!!!!\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
			console.log("Status: " + textStatus);
			console.log("Error: " + errorThrown);
			//pendingRequest--;
		}
		/*
		$.ajax({
url: remoteURL,
type: 'GET',
error: function (err) {
	console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
}
})
		,
		async: false
		 */
	}).always(function (jqXHR, textStatus) {
		if (textStatus != "success") {
			alert("ERROR: " + jqXHR.statusText);
		}
	});;
}

function deliverData(list) {
	// alert("Delivering data to Server");
	//console.log('Delivering list: '+JSON.stringify(list)); 
	var i = 0;
	chunk = [];
	var chunkCounter = 0;
	list.forEach(myFunction);
	function myFunction(item, index) {
		chunk[i] = item;
		i++;
		if (i >= TOP_LIMIT) {
			i = 0;
			// //console.log(JSON.stringify(chunk));
			// alert(JSON.stringify(chunk));
			deliverChunk(chunk);
			chunkCounter++;
			// alert("Delivered "+chunkCounter+" chunks");

			chunk = [];
		}
	}
	// //console.log(JSON.stringify(chunk));
	// alert(JSON.stringify(chunk));
	deliverChunk(chunk);
	chunkCounter++;
	// alert("Delivered "+chunkCounter+" chunks");
	chunk = [];
}

function trackClick()	
{
		trackEvent(1);
}	



