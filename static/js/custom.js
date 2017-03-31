$(document).ready(f => {

	// Fixes the social media icons and scrollspy to the screen after user scrolls past header
	$(window).bind('scroll', f => {
		var header = $('.header').height()
		if ($(window).scrollTop() > header) {
			$('.socialmedia').css({'position':'fixed','top':'163px'})
			$('#scrollspy').css({'position':'fixed', 'top':'209px'})
		}
		else {
			$('.socialmedia').css({'position':'relative','top':'80px'})
			$('#scrollspy').css({'position':'relative','top': '125px', 'right': '2px'})
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
		e.preventDefault()
		if (user.type == 'individual') {
			$.post('/newindividual', {result: user}, res => {
				window.location = '/'
			})
		}
		else if (user.category == 'collective') {
			$.post('/newcollective', {result: user}, res => {
				window.location = '/'
			})
		}
		else {
			$.post('/newnonprofit', {result: user}, res => {
				window.location = '/'
			})
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



	$('#ojtitle').keyup( f => {
		var ojtitleinput = $('#ojtitle').val()
		$('.ojtitle').html(ojtitleinput)
	})

	$('#ojdescription').keyup( f => {
		var ojdescriptioninput = $('#ojdescription').val()
		$('.ojdescription').html(ojdescriptioninput)
	})

	$('#cjtitle').keyup( f => {
		var cjtitleinput = $('#cjtitle').val()
		$('.cjtitle').html(cjtitleinput)
	})

	$('#cjdescription').keyup( f => {
		var cjdescriptioninput = $('#cjdescription').val()
		$('.cjdescription').html(cjdescriptioninput)
	})

	$('#npjtitle').keyup( f => {
		var npjtitleinput = $('#npjtitle').val()
		$('.npjtitle').html(npjtitleinput)
	})

	$('#npjdescription').keyup( f => {
		var npjdescriptioninput = $('#npjdescription').val()
		$('.npjdescription').html(npjdescriptioninput)
	})

	$('#inittitle').keyup( f => {
		var inittitleinput = $('#inittitle').val()
		$('.inittitle').html(inittitleinput)
	})

	$('#initdescription').keyup( f => {
		var initdescriptioninput = $('#initdescription').val()
		$('.initdescription').html(initdescriptioninput)
	})


	var picinput = $('#changepic').val()
	$('.changepic').click( f => {
		var picinput = $('#changepic').val()
	})

	if ($('#changeprofilepic .file-field input').text().length == 0) {
		$('#changeprofilepic button').hide()
		$('#changeprofilepic .file-field a').show()
	}
	else {
		$('#changeprofilepic .file-field a').hide()
		$('#changeprofilepic button').show()
	}

	$('#changeprofilepic').click( f => {
		console.log($('#changeprofilepic .file-field input').val())
	})

	$('#changeprofilepic').hover(
		() => {
			$('#changeprofilepic .file-field').fadeIn(700)
		},
		() => {
			$('#changeprofilepic .file-field').fadeOut(700)
		}
	)
		
















})
