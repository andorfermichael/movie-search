/**
 * Created by Nico on 02.06.2016.
 */
var socket = io();

var detailShownAttributes = ['Title','Outline','Actor','Director','Year','Genre','Runtime'];

function buildHTMLforQuery(results){
	var html = $('#results').html('');
	var blocks = [];
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
	/* this is demo content of html if one entire row is built:
	 $('section .shelf').append($('div')).append($('div .row'))
	 .append($('div .col-xs-4 .col-md-2 .movie #' + item.id))
	 .append($('article.case'))
	 .append($('div'))
	 .append($('div .img'))
	 .append($('span'))
	 .append($('img').attr('src',item.image_url))

	 .append($('section .shelf .subshelf .hidden-md .hidden-lg'))
	 */
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
	console.log(item);
	var cell = $('<div>').addClass('col-xs-4 col-md-2 movie').attr('id',item.id)
		.append($('<article>').addClass('case')
			.append($('<div>')
				.append($('<div>').addClass('img')
					.append($('<span>')
						.append($('<img>').attr('src',item.image_url))))));
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
	var html = $('<div>').addClass('card col-xs-12').attr('id','movie-details')
		.append($('paper-ripple').addClass('recenteringTouch').attr('fit','fit'));
	for (var i = 0; i < detailShownAttributes.length; i++){
		html.append($('<div>').addClass('row')
			.append($('<div>').addClass('col-xs-3 movie-attr').text(detailShownAttributes[i] + ":"))
			.append($('<div>').addClass('col-xs-9 movie-val').text($(element).data("data-movie-" + detailShownAttributes[i].toLowerCase()))));
	}
	//var detailBox = $('<div class="card col-xs-12" id="movie-details"><paper-ripple class="recenteringTouch" fit></paper-ripple></div>');

	return html;
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
				//nerest shelf is main shelf (new row)
				console.log("Movie is on Subshelf - Index: " + $(this).index());
				document.styleSheets[0].addRule('.card:after, .card:before', 'left: ' + offsetLeft + 'px;' + '');
				$(this).siblings(".subshelf").toggleClass('shiftdown');
				$(this).parent().prepend(detailBox);
			}
			else {
				//nearest shelf is subshelf
				console.log("Movie is on Mainshelf - Index: " + $(this).index());
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
}
// Document on load:
$(function () {
	socket.on('getQueryObjects', function(obj){
		console.log(obj);
		buildHTMLforQuery(obj.response.docs);
	});
});
