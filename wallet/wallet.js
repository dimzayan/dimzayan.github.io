// import {} from './asset.js'

var getUrlParameter = function getUrlParameter(sParam) {

var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};



var hash = window.location.hash.substr(1);

var settings = {
    display : false,
    display_id : 0,
    groups : false,
    level : 0,
    blank_assets: false
}



var getPrevId = function(artwork) {
	let new_id = artwork.id-1;
	return new_id < 0 ? artworks.length+new_id : new_id
};

var getNextId = function(artwork) {
	let new_id = artwork.id+1;
	return new_id % (artworks.length );
};

var setBreadcrumbs = function(label, onClickEvent) {
	// Set breadcrumbs

	if($('#breadcrumbs a').length >2) {
		$('#breadcrumbs a')[2].remove();
	}

	if(label !== undefined) {
		let $crumb = $('<a href="#" class="active">'+label+'</a>');
		$crumb.on('click', onClickEvent)
		$('#breadcrumbs').append($crumb);
	}
	
};

var removeCrumb = () => {
	$('#breadcrumbs a')[2].remove();
}






var generateCard = function(asset) {
		
	let $item = $('#templates .collection-item').clone();
	$item.attr('data-name',asset.data.asset)
	

      
	asset.$dom = $item;
	
	asset.addEventListener('loaded', (e)  => {

		_.each(['name','quantity','description'], (key) => {
			$item.find(`.asset-${key}`).html(asset[key])
		});

		

		let $item_image = $item.find('.asset-image');
		
		$video = $item.find('.asset-description video, .asset-description iframe')
		if($video.length) {
			
			$video.prop('muted') ;
			$item_image.append($video)

		} 
$item_image.html(asset.media);
		$item.on('click', function(e) {
			e.preventDefault();
    
        	setDisplayMode('1xgrid')
		// let $disp = await getDispensers(asset.asset)

		
		// $('#details .disp').html($disp)
			window.location.hash = $item.attr('id');

			$(window).scrollTop($item.offset().top - 100)
		// window.location.href="https://xchain.io/asset/"+asset.asset
		});

	})
	





	$item.attr('id', `${asset.name}`)
	$item.attr('href', `#${asset.name}`)

    // $item.find('.asset-description').html(asset.description)

   $item.find('video').prop('muted', true)
    // if(settings.level === 0 && settings.groups ) {
    //     return $item
    // }



	return $item
}

var toggleSettings = () => {
	
	$('#settings-nav').toggleClass('active')
}



var toggleBlankAssets = () => {

	settings.blank_assets = !settings.blank_assets;
	$('body').attr('blank_assets',  settings.blank_assets)
}



var isSubasset = (asset) => {
    return asset.asset_longname.indexOf('.') !== -1
}



var timer = null;

var assets = [];

    $('#details').on('click', () => {
        $('body').css('overflow','auto');
        $('body').removeClass('display');
        clearTimeout(timer);
        $('#details').hide();
    })

var setLevel = (l) => {
    settings.level = l;
    $('body').attr('level',l);
} 


var displayMode = () => {
    clearTimeout(timer);
    $('body').addClass('display')
    
    displayAsset(assets[settings.display_id])

    settings.display_id = (settings.display_id+1)%assets.length;
    timer = setTimeout(displayMode, 10000);
}

var presetGroupName = (cardName) => {
    return PRESETS[cardName] !== undefined && PRESETS[cardName].group !== undefined ? PRESETS[cardName].group : null;
}



var generateBlock =  (asset) => {

	let $block = $('#templates .block').clone();
    let count = $block.find('.collection-item').length;
    $block.attr('id',asset.name)
    let $card = generateCard(asset);

    if($card !== undefined && !$card.is(':empty')) {
    	
        $card.appendTo($block);
        $card.css({
            'transform':`translate(${count*6}px,${count*8}px)`,
            'z-index':1
        });
    } else {
    	console.warn(`ERROR WITH GENERATING BLOCK FOR ${asset.name}`)
    	return null
    }

    return $block
}

var generateCollection = async function(data) {

     

       return await Promise.all(_.map(data, async (d)  => {
        	let asset = new Asset(d)
       		await asset.init();

       		if(asset.valid) {

       			return asset
       		} else {
       			console.warn(`Invalid asset: ${asset.name}`)
       			console.warn(asset)
       			return null
       		}
        }))

                
}


var generateAsset  = (asset_data) => {
	let asset = new Asset(asset_data);
	asset.init();
	return asset;
}




var displayWallet = async function(data) {

	let $collection = $('#collection');
	let $grid = $collection.find('.collection-display-grid');
	$grid.empty();
	$('#wallet-loader').show();
    $collection.show();

	// let assets = await generateCollection(data);

	
	_.each(
		data.sort(
			(a,b) => {
				return a.asset > b.asset
			}
		), 
		(a)  => {
			let asset =  generateAsset(a)
			let $block = generateBlock(asset);
			
			$block.appendTo($grid);
		}
	)
	 
	$('#wallet-loader').hide();

        
    $("html, body").animate({scrollTop: 0}, 1);
}



var states = {
	splash : true
}
var setState = function(state, toggle) {
	toggle = Boolean(toggle);
	states[state] = toggle;
	
	$('body').attr('data-state', states.splash ? 'splash' : '');
	return states;
}






	
	var user = {}


	var generateWallet = async function(address) {

        let obj = await $.ajax({
			url: "https://xchain.io/api/balances/"+address,
			method: "GET"
		});
        user.collection_data = obj.data;
        displayWallet(obj.data)
	}

	var getMarketInfo = async function(callback) {
		// Retrieve BTC price before getting dispensers
		let mkt = await $.ajax({
			url: "https://xchain.io/api/network",
			method:"GET"
		})

		return mkt
	};

	var dispReq;


	var getDispensers = async function(asset) {
		

		let marketObj = await getMarketInfo()
		// async function(marketObj) {
			if(dispReq !== undefined && dispReq.abort !== undefined) { dispReq.abort();}
			dispReq = await $.ajax({
				url: "https://xchain.io/api/dispensers/"+asset,
				method: "GET"
			})


		
			$disp = $('#dispenser-template').clone();
		
			let available_dispensers = [];
			for(var i=0;i<dispReq.data.length;i++) {

				if(dispReq.data[i].give_remaining > 0 && obj.data[i].status == 0) {
					available_dispensers.push(dispReq.data[i]);
				}
				
			}

			
				
			if(available_dispensers.length > 0) {
				$disp.find('.price').attr('href', "https://xchain.io/tx/"+available_dispensers[0].tx_hash)
				$disp.find('.price').html(parseFloat(available_dispensers[0].satoshirate)+' BTC / $'+(available_dispensers[0].satoshirate * marketObj.currency_info[0].price_usd).toFixed(0))
				
				$disp.find('.xchain').attr('href',`https://xchain.io/asset/${asset}` );

				$disp.find('a').on('click', (e) => {
					e.stopPropagation();
				}
				)
				
				
			}  

		

			return $disp;
			
	

		
}

var states = {
	section: 'splash'
}

var setDisplayMode =  (mode) => {
	states.mode = mode;
	$('.block').removeClass('col-lg-12 col-lg-3');
	if(states.mode === '1xgrid') {
		$('.block').addClass('col-lg-12');
	} else {
		$('.block').addClass('col-lg-3');
	}


    $('body').attr('mode',states.mode  );
}

var displaySection = (section) => {
	states.section = section;
	$('body').attr('section',section)
}


window.addEventListener('load', (event) => {

	$('a.cta-wallet').on('click',  (e) => {
		localStorage.removeItem('address');
		displaySection('splash');

	});


	$('a.cta-settings').on('click', (e) =>  {
		e.preventDefault();
		toggleSettings()
	})

	$('a.cta-toggle-blank-assets').on('click', (e)=> {

		e.preventDefault();
		toggleBlankAssets();
	})

	setLevel(0);

  $('#search-input').on('keyup', _.throttle((e) => {
        
            
            let search = new RegExp($('#search-input').val(), 'gi')
            
        let data = user.collection_data.filter(e => {
            
            return [e.asset, e.asset_longname].join(' ').match(search)
        });
        
        displayWallet(data)
       
        
     }, 250))


	$('#wallet-address-form').submit(function(e) {
	
		var data = $("#address-input").val();
		user.address = data;
		localStorage.setItem('address', user.address);
		displaySection('wallet');
		setBreadcrumbs(user.address, (e) => {
			// removeCrumb();
			// generateWallet(user.address);
			setDisplayMode('4xgrid');
			$("html, body").animate({scrollTop: 0}, 1);
			e.preventDefault();
		});
		generateWallet(user.address);
		e.preventDefault();
	});

	user.address = localStorage.getItem('address');
	
	
	if(user.address === null) {
		displaySection('splash');
		setBreadcrumbs();
	} else {
		displaySection('wallet');
		setBreadcrumbs(user.address, (e) => {
			setDisplayMode('4xgrid')
			$("html, body").animate({scrollTop: 0}, 1);
			e.preventDefault();
		});
		generateWallet(user.address);

	}


	setDisplayMode('4xgrid')
	
	
});

    