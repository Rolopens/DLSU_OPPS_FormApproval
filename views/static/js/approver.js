// javascript for approver dashboard

$(document).ready(function(){
	$('#secondary-nav .filter-wrapper input[type="checkbox"]').prop('checked', true);
	//var offsetHeight = ($(window).innerHeight() - $('#sidebar').offset().top) / $(window).innerHeight();
//	$('#sidebar').css("height", (offsetHeight * 100) + "%");
//	$('#main-content .content-feed').css("max-height", ($(window).innerHeight() - $('#main-content .content-feed').offset().top));

	$('#main-content .content-wrapper').click(function(){
		$('#main-content .content-wrapper').removeClass('active');
		$(this).addClass('active');
	});

	$('#select-all').click(function(){
		if($('#select-all input').is(':checked'))
			$('#main-content .content-feed .content-wrapper label input').prop('checked', true);

		else $('#main-content .content-feed .content-wrapper label input').prop('checked', false);
	});

	$('#acts-nav ul li').click(function(){
		$('#acts-nav ul li').removeClass('active');
		$(this).addClass('active');
	});
});

$(window).resize(function(){
	var offsetHeight = ($(window).innerHeight() - $('#sidebar').offset().top) / $(window).innerHeight();
	$('#sidebar').css("height", (offsetHeight * 100) + "%");
	$('#main-content .content-feed').css("max-height", ($(window).innerHeight() - $('#main-content .content-feed').offset().top));
});