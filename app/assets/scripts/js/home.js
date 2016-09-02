var socket = io();

var detailShownAttributes = ['Title','Outline','Actor','Director','Year','Genre','Runtime'];

function buildHTMLforQuery(results){
	var html = $('#results').html('');
	var blocks = [];
	if (results.length == 0)
		$('#results').append('<h3>').text('0 results for: "' + $('#searchValue').val() + '"');
	else {
		for (var i = 0; i < results.length; i++){
			blocks.push(results[i]);
			if (blocks.length == 6) {
				html.append(buildRow(blocks));
				blocks = [];
			}
			else if (i == results.length - 1) {
				html.append(buildRow(blocks));
			}
		}
		createEventListener();
	}
	scrollDownToResults();
}
function buildRow(results){
	var row = $('<div>').addClass('row');
	for (var i = 1; i <= results.length; i++){
		row.append(buildRowCell(results[i-1]));
		if (i % 3 == 0 && i != results.length)
			row.append($('<section>').addClass('shelf subshelf hidden-md hidden-lg')
				.append($('<div>')));
	}
	var output = $('<section>').addClass('shelf')
		.append($('<div>')
			.append($(row)));
	return output;
}

function buildRowCell(item){
	var cell = $('<div>').addClass('col-xs-4 col-md-2 movie').attr('id',item.id)
		.append($('<article>').addClass('case')
			.append($('<div>')
				.append($('<div>').addClass('img')
					.append($('<span>')
						.append($('<img>').attr('src',item.image_url).addClass('movieCover'))))));
	return generateDataAttr(cell,item);
}

function generateDataAttr(cell,data){
	cell.data('data-movie-title',data.title)
		.data('data-movie-outline',data.outline)
		.data('data-movie-actor',data.actor)
		.data('data-movie-director',data.director)
		.data('data-movie-certification',data.certification)
		.data('data-movie-image',data.image_url)
		.data('data-movie-year',data.year)
		.data('data-movie-genre',data.genre)
		.data('data-movie-runtime',data.runtime)
		.data('data-movie-id',data.id)
		.data('data-movie-score',data.score)
	return cell;
}

function generateMovieDetailsBox(element) {
	var html = $('<div>').addClass('card col-xs-12').attr('id','movie-details');
	html.append($('<div>').addClass('col-xs-12 movie-val')
				.append($('<h2>').text($(element).data("data-movie-title"))))
	.append($('<div>').addClass('row')
		.append($('<div>').addClass('col-xs-12 movie-val')
			.append($('<p>').addClass('outline').text($(element).data("data-movie-outline")))))
	.append($('<div>').addClass('row')
		.append($('<div>').addClass('col-xs-2 movie-attr')
			.append($('<h5>').text('Actor:')))
		.append($('<div>').addClass('col-xs-4 movie-val')
			.append($('<p>').text($(element).data("data-movie-actor"))))
		.append($('<div>').addClass('col-xs-2 movie-attr')
			.append($('<h5>').text('Director:')))
		.append($('<div>').addClass('col-xs-4 movie-val')
			.append($('<p>').text($(element).data("data-movie-director")))))
	.append($('<div>').addClass('row')
		.append($('<div>').addClass('col-xs-2 movie-attr')
			.append($('<h5>').text('Year:')))
		.append($('<div>').addClass('col-xs-4 movie-val')
			.append($('<p>').text($(element).data("data-movie-year"))))
		.append($('<div>').addClass('col-xs-2 movie-attr')
			.append($('<h5>').text('Genre:')))
		.append($('<div>').addClass('col-xs-4 movie-val')
			.append($('<p>').text($(element).data("data-movie-genre")))))
	.append($('<div>').addClass('row')
		.append($('<div>').addClass('col-xs-2 movie-attr')
			.append($('<h5>').text('Runtime:')))
		.append($('<div>').addClass('col-xs-4 movie-val')
			.append($('<p>').text($(element).data("data-movie-runtime")))));
	return html;
}

function scrollDownToResults() {
	$('html, body').animate({
		scrollTop: $("#results").offset().top - ($("#searchValue").offset().top / 2)
	}, 2000);
}

function createEventListener() {
	$('.movie').on('click',function(){
		var detailBox = generateMovieDetailsBox($(this));
		var offsetLeft = $(this).offset().left - $(this).parent().offset().left + ($(this).innerWidth() / 2);

		if ($('#movie-details').length > 0) {
			$('#movie-details').remove();
			$('.subshelf').removeClass('shiftdown');
		}
		if (window.innerWidth >= 991) {
			document.styleSheets[0].addRule('.card:after, .card:before', 'left: ' + offsetLeft + 'px;' + '');
			$(this).parent().prepend(detailBox);
		}
		else {
			if ($(this).index() < 3) {
				document.styleSheets[0].addRule('.card:after, .card:before', 'left: ' + offsetLeft + 'px;' + '');
				$(this).siblings(".subshelf").toggleClass('shiftdown');
				$(this).parent().prepend(detailBox);
			}
			else {
				document.styleSheets[0].addRule('.card:after, .card:before', 'left: ' + offsetLeft + 'px;' + '');
				$(this).parent().find('section').after(detailBox); //toggleClass('shiftdown');
			}
		}
	});
	$(document).on('click', function(event) {
		if (!$(event.target).closest('.movie').length) {
			if ($('#movie-details').length > 0) {
				$('#movie-details').remove();
				$('.subshelf').removeClass('shiftdown');
			}
		}
	});
	$('img.movieCover')
		.on('error',function(){
			console.log("Cover not found! Using placeholder!");
			$(this).attr('src','assets/images/nocoverimage.png');
		});
}
// Document on load:
$(function () {
	socket.on('getQueryObjects', function(obj){
		buildHTMLforQuery(obj.response.docs);
	});
	$("#searchValue").focus();
});
