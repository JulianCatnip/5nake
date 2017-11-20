function grid(){
	var canvas = document.getElementById("snake");
	var ctx = canvas.getContext("2d");

	var einheitX = canvas.width / 15;	//60px
	var einheitY = canvas.height / 10; 	//60px

	ctx.beginPath();
	ctx.strokeStyle = "#fff";
	var x = einheitX;

	while(x < canvas.width) {
		ctx.moveTo(x, 0);
		ctx.lineTo(x, canvas.height);
		ctx.stroke();
		x += einheitX;
	}

	var y = einheitY;
	while(y < canvas.height) {
		ctx.moveTo(0, y);
		ctx.lineTo(canvas.width, y);
		ctx.stroke();
		y += einheitY;
	}
}