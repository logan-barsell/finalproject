$(document).ready(f => {

	// Fixes the social media icons and scrollspy to the screen after user scrolls past header
	$(window).bind('scroll', f => {
		var header = $('.header').height()
		if ($(window).scrollTop() > header) {
			$('.socialmedia').css({'position':'fixed','top':'163px'})
			$('#scrollspy').css({'position':'fixed', 'top':'209px'})
			$('#orgprofile').css({'position':'fixed','top':'0px'})
			$('#indprofile').css({'position':'fixed','top':'0px'})
		}
		else {
			$('.socialmedia').css({'position':'relative','top':'80px'})
			$('#scrollspy').css({'position':'relative','top': '-100px', 'right': '2px'})
			$('#orgprofile').css({'position':'static'})
			$('#indprofile').css({'position':'static'})
		}
	})

	// When user clicks the 'individual' option, the class pick me is added
	// to it and removed from the 'organization' option
	$('#individual').click( f => {
		$('#individual').addClass('pickme')
		if ($('#organization').hasClass('pickme')){
			$('#organization').removeClass('pickme')
		}
	})
	// When user clicks the 'organization' option, the class pick me is added
	// to it and removed from the 'individal' option
	$('#organization').click( f => {
		$('#organization').addClass('pickme')
		if ($('#individual').hasClass('pickme')){
			$('#individual').removeClass('pickme')
		}
	})

	//Event handler for "who are you" section in registering
	const user = {}
	$('#iaman').submit( e => {
		e.preventDefault()
		user.type = $('.pickme').val()
		$('#whoareyou').hide()
		$('.whoareyou').css({'font-weight':'200'}).addClass('hide-on-small-only')
		$('.basicinfo').css({'font-weight':'bold'}).removeClass('hide-on-small-only')
		if(user.type == 'individual') {
			$('#basicinfo1').fadeIn()
		}
		if(user.type == 'organization') {
			$('#basicinfo2').fadeIn()
		}
	})

	$('#basicinfo1').submit( e => {
		e.preventDefault()
		user.firstname = $('.firstname').val()
		user.lastname = $('.lastname').val()
		user.email = $('.email').val()
		user.password = $('.password').val()
		$('#basicinfo1').hide()
		$('.basicinfo').css({'font-weight':'200'}).addClass('hide-on-small-only')
		$('.finish').css({'font-weight':'bold'}).removeClass('hide-on-small-only')
		$('#finish').fadeIn()
		$('.overview span:nth-child(1)').show().append(user.firstname + ' ' + user.lastname).append(' <i class="material-icons">done</i>')
		$('.overview span:nth-child(2)').show().append(user.email).append(' <i class="material-icons">done</i>')
	})

	$('#basicinfo2').submit( e => {
		e.preventDefault()
		user.orgname = $('.orgname').val()
		user.category = $('.selected').text()
		user.email = $('.orgemail').val()
		user.password = $('.orgpassword').val()
		$('#basicinfo2').hide()
		$('.basicinfo').css({'font-weight':'200'}).addClass('hide-on-small-only')
		$('.finish').css({'font-weight':'bold'}).removeClass('hide-on-small-only')
		$('#finish').fadeIn()
		$('.overview span:nth-child(3)').show().append(user.orgname).append(' <i class="material-icons">done</i>')
		$('.overview span:nth-child(4)').show().append(user.category).append(' <i class="material-icons">done</i>')
		$('.overview span:nth-child(5)').show().append(user.email).append(' <i class="material-icons">done</i>')
	})

	$('#finish').submit(e => {
		if (user.type == 'individual'){
			$.post('/newindividual', {result: user})
		}
		else {
			$.post('/neworganization', {result: user})
		}
	})


	// Enables slides
	$('.slider').slider()
	// Enables modals
	$('.modal').modal()
	// Enables dropdown material select
	$('select').material_select()
	// Enables scrollspy
	$('.scrollspy').scrollSpy()
	// Enables sideNav for profile
	$(".button-collapse").sideNav()

	// Enables Slick Carousel and desired options
	$('.recentslides').slick({
		centerMode: true,
		centerPadding: '60px',
    	slidesToShow: 3,
    	variableWidth: true,
    	focusOnSelect: true,
    	responsive: [
     	  {
        	breakpoint: 768,
       		settings: {
        		arrows: false,
        		centerMode: true,
        		centerPadding: '40px',
        		slidesToShow: 3
     		}
    	  },
		  {
		    breakpoint: 480,
		    settings: {
		        arrows: false,
		        centerMode: true,
		        centerPadding: '40px',
		        slidesToShow: 1
		    }
		  }
		]
	})

})
