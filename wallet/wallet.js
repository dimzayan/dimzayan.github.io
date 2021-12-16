var hash = window.location.hash.substr(1);
var user = {}
var states = {
	splash : true,
	section: 'splash'
}

var settings = {
    display : false,
    display_id : 0,
    groups : false,
    level : 0,
    blank_assets: false
}

var focus = null;
var timer = null;
var assets = [];

const getUrlParameter = function getUrlParameter(sParam) {

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









// var getPrevId = function(artwork) {
// 	let new_id = artwork.id-1;
// 	return new_id < 0 ? artworks.length+new_id : new_id
// };

// var getNextId = function(artwork) {
// 	let new_id = artwork.id+1;
// 	return new_id % (artworks.length );
// };


var Breadcrumbs = {
	remove : ()  => {
		$('#breadcrumbs a')[2].remove();
	},

	add: (label, onClickEvent) =>  {
		if($('#breadcrumbs a').length >2) {
		this.remove();
		}

		if(label !== undefined) {
			let $crumb = $('<a href="#" class="active">'+label+'</a>');
			$crumb.on('click', onClickEvent)
			$('#breadcrumbs').append($crumb);
		}
	}
}











var toggleSettings = () => {
	
	$('#settings-nav').toggleClass('active')
}



var toggleBlankAssets = () => {

	settings.blank_assets = !settings.blank_assets;
	$('body').attr('blank_assets',  settings.blank_assets)
}








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

var setDisplayMode =  (mode) => {
	states.mode = mode;
	$('.block').removeClass('col-lg-12 col-lg-3');
	if(states.mode === '1xgrid') {
		$('.block').addClass('col-lg-12');
	} else {
		$('.block').addClass('col-lg-3');
	}


    $('body').attr('mode',states.mode  );
    Waypoint.Context.refreshAll()
}

var displaySection = (section) => {
	states.section = section;
	$('body').attr('section',section)
}




const generateBlock =  (asset) => {

	let $block = $('#templates .block').clone();
    let count = $block.find('.collection-item').length;
    $block.attr('id',`${asset.name}-block`);
    let $card = asset.display();

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



const generateAsset  = (asset_data) => {
	let asset = new Asset(asset_data,  {
		template: $('#templates .collection-item')
	});
	asset.init();
	return asset;
}

const generateWallet = async (address) => {
    
	user.wallet = new Wallet(address)
    await user.wallet.fetch()
    displayWallet(user.wallet)
}


class  Wallet {
	constructor(address) {
		this.address = address
	}

	async fetch() {
		let obj= await $.ajax({
			url: "https://xchain.io/api/balances/"+this.address,
			method: "GET"
		});

		this.data = obj.data

		return this.data
	}

	render() {
		this.$dom  =  $('<div>',  { id: `wallet-${this.address}`, class: 'wallet'});
		let $container = $('<div>', {id: `wallet-${this.address}-collection`, class:  'row collection'})


		_.each(
			this.data.sort(
				(a,b) => {
					return a.asset > b.asset
				}
			)
			.slice(0,20), 
			(a)  => {
				let asset =  generateAsset(a)
				let $block = generateBlock(asset);
				
				$block.appendTo($container);
				var waypoint = new Waypoint({
	  				element: $block,
		  			handler: async function(direction) {
		  				if(states.mode === '1xgrid') {
		  					if(focus !== null)  {
		  					focus.$dom.find('video').prop('muted', true);
		  
		  				}
		  				focus = asset;
		  				history.pushState(null,null,`#${asset.name}`);
		  				}
		  				
		    			
		  			},
		  			offset:300
				})
			}
		)

		$container.appendTo(this.$dom);
		console.log(this.$dom)
		return this.$dom
	}


}

var displayWallet = async function(wallet) {
	// let data = wallet.data
	// let $collection = $('#collection');
	// let $grid = $collection.find('.collection-display-grid');
	// $grid.empty();
	$('#wallets').show()
	$('#wallet-loader').show();
    
    $('#wallets-container').html(wallet.render())

	 
	$('#wallet-loader').hide();

        
    $("html, body").animate({scrollTop: 0}, 1);
}



const setState = (state, toggle) =>  {
	toggle = Boolean(toggle);
	states[state] = toggle;
	
	$('body').attr('data-state', states.splash ? 'splash' : '');
	return states;
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
            
        let data = user.wallet.data.filter(e => {
            
            return [e.asset, e.asset_longname].join(' ').match(search)
        });
        
        displayWallet(data)
       
        
     }, 250))


	$('#wallet-address-form').submit(function(e) {
	
		var data = $("#address-input").val();
		user.address = data;
		localStorage.setItem('address', user.address);
		displaySection('wallet');
		Breadcrumbs.drop(user.address, (e) => {
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
		Breadcrumbs.add();
	} else {
		displaySection('wallet');
		Breadcrumbs.add(user.address, (e) => {
			setDisplayMode('4xgrid')
			$("html, body").animate({scrollTop: 0}, 1);
			e.preventDefault();
		});
		generateWallet(user.address);

	}


	setDisplayMode('4xgrid')
	
	
});

    