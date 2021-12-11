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
	let $item_image = $item.find('.asset-image');
	$item_image.html(asset.media);

      
	asset.$dom = $item;
	


	_.each(['name','quantity','description'], (key) => {
		$item.find(`.asset-${key}`).html(asset[key])
	
	})


	$item.attr('id', `${asset.name}`)
	$item.attr('href', `#${asset.name}`)

    // $item.find('.asset-description').html(asset.description)

   $item.find('video').prop('muted', true)
    // if(settings.level === 0 && settings.groups ) {
    //     return $item
    // }
	$item.on('click', async  function(e) {
		// e.preventDefault();
    
        displayAsset(asset)
		// let $disp = await getDispensers(asset.asset)

		
		// $('#details .disp').html($disp)
		window.location.hash = $item.attr('id');

		$(window).scrollTop($item.offset().top -150)
		// window.location.href="https://xchain.io/asset/"+asset.asset
	});



	return $item
}



var displayAsset = async (asset) => {
    // $('body').css('overflow','hidden')
    
    // $('#details').html($($(`.collection-item[data-name="${asset.asset}"]`)[0]).clone());

    // $('#details').show();

    asset = {
    	... asset,
    	... await getAssetData(asset.asset)
    }
    console.log(asset)
    asset.date = new Date(asset.issuances.data.pop().timestamp * 1000);
    
    asset.$dom.find('.collection-item-date').html(`
    	Minted ${asset.date.toLocaleString('default', { month: 'long' }) } ${asset.date.getFullYear()}
    	(block #${asset.date.block})`);

    $('.block').removeClass('col-lg-3').addClass('col-lg-12');
    $('body').attr('mode','1xgrid');
}
var isSubasset = (asset) => {
    return asset.asset_longname.indexOf('.') !== -1
}



var timer = null;
var settings = {
    display : false,
    display_id : 0,
    groups : false,
    level : 0
}
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



var generateBlock = async (asset) => {

	let $block = $('#templates .block').clone();
    let count = $block.find('.collection-item').length;
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

var generateCollection = async function(data, dom_el) {

        if(!data.length) {
            dom_el.hide();
            return;
        } 

        let $grid = dom_el.find('.collection-display-grid');
        $grid.empty();
        dom_el.show();

        let assets = data.slice(10,20).
        	map( (d) => {
        		console.log(d)
       			return new Asset(d)
       		}).sort((a,b) => {
       			// console.log(a.name +'/'+b.name)
       			return a.name > b.name
       		})
       		
       	// console.log(assets)
        // Parsing DATA

        _.each(assets, async (asset)  => {
        	
       			
       		if(await asset.valid) {

       			let $block = await generateBlock(asset);

       			if($block) {
       				$block.appendTo($grid);
       			}
       		} else {
       			console.warn(`Invalid asset: ${asset.name}`)
       			console.warn(asset)

       		}
        })
       
		
		
        $("html, body").animate({scrollTop: 0}, 1);

                
}




var displayWallet = function(data) {

	generateCollection(data,$('#plebs-collection'));
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




var getAssetData = async function(asset_name, dom_cta) {
	
	let asset = await $.ajax({
		url: "https://xchain.io/api/asset/"+asset_name,
		method: "GET"
	})

	// let issuances  = ;


	asset = {
		...asset,
		... {
			issuances : await getAssetIssuanceData(asset_name)
		} 
	}

	return asset
	// }).done(function(data){
	// 	console.log('===========')
	// 	console.log(data)

	// })
}

var getAssetIssuanceData = async (asset_name) => {
	return await $.ajax({
		url: "https://xchain.io/api/issuances/"+asset_name,
		method: "GET"
	})
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

var displaySection = (section) => {
	states.section = section;
	$('body').attr('section',section)
}

window.addEventListener('load', (event) => {

	$('a.displayMode').on('click', (e) => {
    e.preventDefault();
    displayMode();
	})

    $('#collection .return').on('click', (e) => {
        e.preventDefault();
        displayWallet();
    })

	$('a.cta-explore').on('click', function(e) {
		
		access('collection');
		e.preventDefault();
	});

	var id = Number(getUrlParameter('artwork_id')) || null;

	if(id !== null) {

		displaySelectedItem(artworks[id]);
	} else {

		// displaySection('#splash');
	}

	$('.hero').on('click', function(e) {
		setState('splash', false);
	});

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
		localStorage.setItem('pleb_addresss', user.address);
		displaySection('wallet');
		setBreadcrumbs(user.address, (e) => {
			removeCrumb();
			displaySection('splash')
			e.preventDefault();
		});
		generateWallet(user.address);
		e.preventDefault();
	});

	user.address = localStorage.getItem('pleb_addresss');
	
	if(user.address === undefined) {
		displaySection('splash');
		setBreadcrumbs();
	} else {
		displaySection('wallet');
		setBreadcrumbs(user.address, (e) => {
			removeCrumb();
			displaySection('splash')

			e.preventDefault();
		});
		generateWallet(user.address);

	}


	if(states.mode === '1xgrid') {
		$('.block').addClass('col-lg-12');
	} else {
		$('.block').addClass('col-lg-3');
	}
	
});

    