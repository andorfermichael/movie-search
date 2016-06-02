var socket = io();

$(document).ready(function() {
	$('.form-subscribe').on('click', '.btn-primary', function() {
		var searchValue = $('#searchValue').val();
		socket.emit('searchValue', searchValue)
	});

	socket.on('getQueryObjects', function(obj){
		console.log(obj);
	});

	

});


