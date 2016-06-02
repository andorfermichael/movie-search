/**
 * Created by Nico on 02.06.2016.
 */
import $ from 'jquery';

function buildHTMLforQuery(results){
	var html = $('');
	var blocks = [];
	results.each(function(index) {
		blocks.push($(this));
		if (index % 5 == 0) {
			html.append(buildRow(blocks));
			blocks = [];
		}
	})
	$('#results').html(html);

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
	var row = $('section .shelf').append($('div')).append($('div .row'))
	results.each(function(index) {
		row.append(buildRowCell($(this)))
	})
	return row;
}

function buildRowCell(item){
	var cell = $('div .col-xs-4 .col-md-2 .movie #' + item.id)
		.append($('article.case'))
		.append($('div'))
		.append($('div .img'))
		.append($('span'))
		.append($('img').attr('src',item.image_url));
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

// Document on load:
$(function () {
	$('.movie').on('click',function(){
		var detailBox = $('<div class="card col-xs-12" id="movie-details"><paper-ripple class="recenteringTouch" fit></paper-ripple></div>');
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
});
