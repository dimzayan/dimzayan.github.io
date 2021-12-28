var hash = window.location.hash.substr(1);
var user = {}
var states = {
	splash : true,
	section: 'splash'
}

var settings = {
    blank_assets: false,
    per_page: 30
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

const validateAddress = (address) => {
	if(address.length < 24 ) return false;

}

var Breadcrumbs = {
	remove : ()  => {
		$('#breadcrumbs a')[2].remove();
	},

	add: (label, onClickEvent) =>  {
		if($('#breadcrumbs a').length >2) {
		// this.remove();
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

	user.preferences.blank_assets = !user.preferences.blank_assets;
	$('body').attr('blank_assets',  user.preferences.blank_assets);
	localStorage.setItem('preferences', user.preferences)
}










var displayMode = () => {
    clearTimeout(timer);
    $('body').addClass('display')
    
    displayAsset(assets[settings.display_id])

    settings.display_id = (settings.display_id+1)%assets.length;
    timer = setTimeout(displayMode, 10000);
}

var setMode =  (mode) => {
	states.mode = mode;
	$('.block').removeClass('col-lg-12 col-lg-3');
	if(states.mode === 'focus') {
		$('.block').addClass('col-lg-12');
	} else {
		$('.block').addClass('col-lg-3');
	}


    $('body').attr('mode',states.mode  );
    
}





const setState = (state, toggle) =>  {
	toggle = Boolean(toggle);
	states[state] = toggle;
	
	$('body').attr('data-state', states.splash ? 'splash' : '');
	return states;
}

var current_collection = []

const showCollection = function(collection , params ) {
	
	console.log(collection)

	let 
		$focus = document.getElementById('focus'),
		$collection =  document.getElementById('assets-container'),
		options = {
			page: 0,
			...params
		}

	collection = collection || current_collection
	
	current_collection = collection;
	$('#asset-viewer-loader').show();
	$focus.innerHTML = ``

    if(options.page === 0) {
    	$("html, body").animate({scrollTop: 0}, 1);
    	$collection.innerHTML = ''
    }

    if(options.title) {
    	$collection.innerHTML += `<h4 class="collection-title">${options.title}</h4>`
   	}


   	$collection.innerHTML += collection.render(options.page, {max: settings.per_page})
   	console.log(options.page)
	$('#asset-viewer-loader').hide();

        
    
}



const observer = new IntersectionObserver( (entries, observer) => {
	entries.forEach( e=> {
		// console.log(e)
	})
}, {
	root: document.getElementById('#wallets'),
	rootMargin: '0px',
	treshold: 1.0
})





const generateBlock =  (asset) => {

	let $block = document.querySelector('#block-template .block').cloneNode();
    // let count = $block.find('.collection-item').length;
    // $block.attr('id',`${asset.name}-block`);
    $block.innerHTML = asset.render()

    if(asset.blank ) {
    	
    	$block.classList.add('blank')
    }

    
    asset.addEventListener('mediaError', (e) =>  {

    	let $asset  =  document.getElementById(asset.data.asset_longname);
    	
    	$asset.parentElement.classList.add('blank')
    })
    asset.addEventListener('change', () => {


    	// REPLACE ONLY CONTENT THAT HAS CHANGED TO AVOID FLICKERING
    	let $updated_content = document.createElement('div');
    	$updated_content.innerHTML =  asset.render()
    	
    	let $card  =  document.getElementById(asset.data.asset)
    	// console.log(asset)
    	if($card === null) {
    		$block.innerHTML =  $updated_content.outerHTML; 
    		return;
    	}


		$updated_content.querySelector(`#${asset.data.asset}`).childNodes.forEach( (node, i) => {
			if(node.isEqualNode($card.childNodes[i])) {return }
			$card.childNodes[i].innerHTML = node.innerHTML
		})


    	   if(asset.data.supply === 0) {
    
    	$card.parentElement.classList.add('blank')
    }
    	
		if(asset.data.group  && asset.data.group.length) {
	    	let group  = GROUPS[asset.data.group.replace(' ','_')]

		    if(group.image_url) {
		    	
		    	$card.querySelector('.icon').innerHTML = `<img src="${group.image_url}">`
		    }
	    }

		
	})

    
    

    
    
    return $block
}

var normalizeUrl = function(str) {
	return str.replace(/(http(s?)):\/\//i, '' ).split(';')[0]
}

var getAssetData = async function(asset_name) {
	
	let asset = await $.get("https://xchain.io/api/asset/"+asset_name);
	
	
	return asset
}


	var getMarketInfo = async function(callback) {
		// Retrieve BTC price before getting dispensers
		let mkt = await $.ajax({
			url: "https://xchain.io/api/network",
			method:"GET"
		})

		return mkt
	};

var presetGroupName = (cardName) => {
    return PRESETS[cardName] !== undefined && PRESETS[cardName].group !== undefined ? PRESETS[cardName].group : null;
}



const generateWallet = async (address) => {
    
    let obj= await $.ajax({
			url: "https://xchain.io/api/balances/"+address,
			method: "GET"
		});

	user.wallet = new Collection({
		address: address,
		data :  obj.data,
		asset_template: document.getElementById('asset-template').cloneNode(true)
	})

	
   
    showCollection(user.wallet)
}

const getArtistAssets  = async (address)  => {
	setMode('grid')
	let obj = await $.get(`https://xchain.io/api/issuances/${address}`);
	for(var i=1; i<Math.ceil(obj.total/100);i++){
		let add = await $.get(`https://xchain.io/api/issuances/${address}?page=${i+1}`);
		obj.data = [
		...obj.data,
		...add.data
		]
	}

	let collection = new Collection({
		data : _.values(_.keyBy(obj.data, 'asset')),
		asset_template: document.getElementById('asset-template').cloneNode(true)
	})

	showCollection(collection)
}


const showAssetDetails  = async (assetName) =>  {

	if(states.mode === 'focus') return 
	
	let 
		$focus = document.getElementById('focus'),
		$collection_container = document.getElementById('assets-container')

	$collection_container.innerHTML  = ""
	$focus.innerHTML  =  $focus.cloneNode(true).innerHTML
	let obj = await $.get(`https://xchain.io/api/asset/${assetName}`);
	if(obj.error) {
		return {
			success: false,
			error: 'Asset not found'
		}
	}


	let asset = new Asset(obj,  {
		template: document.getElementById('asset-template').cloneNode(true) //$('#templates .collection-item-template')
	});
	asset.init(true)


	$focus.innerHTML =  asset.render();

	//showCollection(collection);
	// setMode('focus');
	asset.addEventListener('change', () => {

		$focus.innerHTML =  asset.render();
		if(asset.data.group.length) {

	    	let group  = GROUPS[asset.data.group.replace(' ','_')]

		    if(group.image_url) {
		    	
		    	$focus.querySelector('.asset-details .icon').innerHTML = `<img src="${group.image_url}">`
		    }
	    }


	    $focus.querySelector('.asset-media-container').addEventListener('click', (e) => {
	    	e.preventDefault();
	    })

		
	})

	$("html, body").animate({scrollTop: 0}, 1);

	let subassets = await asset.fetch_subassets();
	
	if(subassets.length) {

		let subasset_collection  = new Collection({
			data:subassets,
			asset_template: document.getElementById('asset-template').cloneNode(true)
		});
		
		

		showCollection(subasset_collection, {title: 'Subassets'})
	}
	return {
		success:  true
	}
	
	

	
} 


const  search  = async (input) => {

	
		if(bitcoinAddressValidation.validate(input)) {
			// user.address = input;
			// localStorage.setItem('address', user.address);
			window.location.href=`index.html?at=${input}`
			// setMode('grid');
			// generateWallet(user.address);
			return
		}  else {
			window.location.href=`index.html?asset=${input}`
			// return await showAssetDetails(input)
			return
		}

		
		
		// Breadcrumbs.add(input, (e) => {
		// 	setMode('grid');
		// 	$("html, body").animate({scrollTop: 0}, 1);
			
		// 	e.preventDefault();
		// });

		// generateWallet(user.address);
		
		return true

}


const getSet=  (setName)  =>  {

	let group_assets = _.filter(PRESETS, (v,k) => {
		v.asset =  k;  
		v.asset_longname = k;
		return v.group ===  setName
	})
	// console.log(group_assets)
	let group_collection  = new Collection({
		data: group_assets,
		asset_template: document.getElementById('asset-template').cloneNode(true)
	})

	showCollection(group_collection)
	

}



window.addEventListener('load', async (event) => {

	$('a.cta-wallet').on('click',  (e) => {
		e.preventDefault()
		localStorage.removeItem('address');
		setMode('splash');

	});


	$('a.cta-settings').on('click', (e) =>  {
		e.preventDefault();
		toggleSettings()
	})

	$('a.cta-toggle-blank-assets').on('click', (e)=> {

		e.preventDefault();
		toggleBlankAssets();
	})


  // $('#search-input').on('keyup', _.throttle((e) => {
        
            
  //           let search = new RegExp($('#search-input').val(), 'gi')
            
  //       let data = user.wallet.data.filter(e => {
            
  //           return [e.asset, e.asset_longname].join(' ').match(search)
  //       });
        
  //       showCollection(data)
       
        
  //    }, 250))


	$('#search-form').submit(async (e) =>  {
		e.preventDefault();

		let rst  = await  search($("#search-input").val());

		if(!rst.success) {
			$("#search-error").html(rst.error)
		}  else  {
			setMode('grid');
		}
		
	});

	user.address = localStorage.getItem('address');

	user.preferences  = {
		...settings,
		...localStorage.getItem('settings')
	}

	if(getUrlParameter('by')) {
		getArtistAssets(getUrlParameter('by'));
		Breadcrumbs.add(`By ${getUrlParameter('by')}`, (e) => {
			window.location.href =  `?set=${getUrlParameter('by')}`
			e.preventDefault();
		});
		return ;
	}

	if(getUrlParameter('asset')) {
		showAssetDetails(getUrlParameter('asset'))
		return ;
	}
	
	if(getUrlParameter('at')) {
		generateWallet(getUrlParameter('at'));
		Breadcrumbs.add(`${getUrlParameter('at')}`, (e) => {
			window.location.href =  `?set=${getUrlParameter('at')}`
			e.preventDefault();
		});
		return ;
	}

	if(getUrlParameter('set')) {
		getSet(getUrlParameter('set'));
		Breadcrumbs.add(getUrlParameter('set'), (e) => {
			window.location.href =  `?set=${getUrlParameter('set')}`
			e.preventDefault();
		});
		return;
	}
	
	// if(window.location.hash){
		
	// 	let rst  = await  search(window.location.hash.substr(1));

	// 	if(!rst.success) {
	// 		setMode('splash')
	// 		$("#search-error").html(rst.error)
	// 	}  else  {
	// 		setMode('grid');
	// 	}
		
	// 	return
	// }
	if(user.address === null) {
		setMode('splash')
		Breadcrumbs.add();
	} else {
		setMode('grid');
		Breadcrumbs.add(user.address, (e) => {
			setMode('grid');
			generateWallet(user.address);
			$("html, body").animate({scrollTop: 0}, 1);
			e.preventDefault();
		});
		generateWallet(user.address);

	}

	document.getElementById('cta-next').addEventListener('click', (e) => {
		console.log(this);
		console.log(e)
		showAssetDetails() 
		return false;
	})



	
});


window.addEventListener("scroll", () => {
	if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {

       	if(current_collection.assets.length> (current_collection.page+1) *settings.per_page) {
			showCollection(current_collection,{page:current_collection.page+1});
    	}
    }
});
