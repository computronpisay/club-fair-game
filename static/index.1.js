var laserCount = 0;
var score = 0;
var seconds = 60;
var laserspawner;
var gamecountdown;
var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

// Gets the name of high scorer and sends it and the score
socket.on('get score', function () {
	var name = prompt("You got a high score! Please enter your name:", "Name");
	socket.emit('add score', {'name': name, 'score': score});
});

// Makes a laser appear
function laserAppear(){

	var laser = {
		color: ""
	};

	//Sets color of laser
	var rand = Math.floor((Math.random() * 99) + 1);
	if(rand <= 90){
		laser.color = "red";
	}else if (rand <= 95){
		laser.color = "blue";
	}else{
		laser.color = "green";
	}

	//Sets other properties of laser
	var laserDiv = document.createElement("div");
	laserDiv.className = "laser";
	laserDiv.style.height = "128px";
	laserDiv.style.width = "128px";
	laserDiv.style.marginLeft = Math.floor((Math.random() * 90) + 1) + "%";
	laserDiv.style.marginTop = Math.floor((Math.random() * 70) + 1) + "vh";
	laserDiv.style.position = "absolute";

	//Changes image to corresponding color
	if(laser.color == "red"){
		laserDiv.style.backgroundImage = "url('laser_red.png')";
	}else if(laser.color == "blue"){
		laserDiv.style.backgroundImage = "url('laser_blue.png')";
	}else if(laser.color == "green"){
		laserDiv.style.backgroundImage =  "url('laser_green.png')";
	}

	//Adds points then calls laserDisappear on hovered laser
	laserDiv.onmouseover = function(){
		laserHoveredOn(laser.color, laserDiv);
	};

	//Adds to number of lasers then makes it appear
	laserCount += 1;
	document.querySelector("#game").appendChild(laserDiv);

	//Lasers start timing out when 3 have appeared
	if(laserCount >= 3){
		setTimeout(timeout, 600, laserDiv);
	}

	console.log("laser appended! laser count: " + laserCount); //development code
}

//Removes selected laser then subtracts from number of lasers
function laserDisappear(laser){
	document.querySelector("#game").removeChild(laser);
	laserCount -=1;
}

//Adds points then makes hovered laser disappear, then makes another laser appear
function laserHoveredOn(color, laser){
	if (color == "red"){
		score += 1;
	}else if(color == "blue"){
		score += 1;
		seconds += 1;
	}else if(color == "green"){
		score += 3;
	}
	document.getElementById("score").innerHTML = "Score: " + score;
	laserDisappear(laser);
	laserAppear();
}

//Times out a laser, ##i feel something has to change here but wait lang
function timeout(laser){
	laserDisappear(laser);
	while(laserCount < 3 && seconds >0){
		laserAppear();
	}
}

//Game countdown
function countdown(){
	seconds -= 1;
	console.log(seconds); //dev code
	document.getElementById("time").innerHTML = seconds + " seconds";
	if(seconds <= 0){
		end();
	}
}

function start(){
	laserCount = 0;
	score = 0;
	seconds = 60;
	document.getElementById("title").style.display = "none";
	document.getElementById("startBtn").style.display = "none";
	document.getElementById("againBtn").style.display = "none";
	document.getElementById("bg").style.filter = "brightness(100%)";
	laserspawner = setInterval(laserAppear, 600);
	gamecountdown = setInterval(countdown, 1000);
}

function end(){
	clearInterval(laserspawner);
	clearInterval(gamecountdown);

	var lasersleft = document.querySelectorAll(".laser");
	var i = lasersleft.length;
	while (i > 0){
		document.querySelector("#game").removeChild(lasersleft[i-1]);
		i -= 1;
		console.log(i);
	}

	document.getElementById("againBtn").style.display = "block";
	document.getElementById("bg").style.filter = "brightness(50%)";
	socket.emit('check score', {'score': score});
}

var again = function(){
	window.location.reload();
}

var replay = function(){
	document.getElementById("music").play();
}

document.getElementById("startBtn").addEventListener("click", start);
document.getElementById("againBtn").addEventListener("click", again);
