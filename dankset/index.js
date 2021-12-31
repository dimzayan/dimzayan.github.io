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
			let crumb = document.createElement('span');
			crumb.innerHTML = '<a href="#" class="active">'+label+'</a>';
			document.querySelector('#breadcrumbs').append(crumb)
			crumb.querySelector('a').addEventListener('click',  onClickEvent);
			
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
	// $focus.innerHTML = ``

    if(options.page === 0) {
    	$("html, body").animate({scrollTop: 0}, 1);
    	$collection.innerHTML = ''
    }

    if(options.title) {
    	let $title = document.createElement('h4')
    	$title.classList.add('collection-title');
    	$title.innerHTML = options.title;
    	$collection.append($title)
   	}


	_.each(
		collection.get(options.page), 
		(asset)  => {
			asset.init();
			$collection.append(generateBlock(asset))
			
		}
	)

	console.log(collection)
   	

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


    asset.addEventListener('change', () => {

    	
    	// REPLACE ONLY CONTENT THAT HAS CHANGED TO AVOID FLICKERING
    	// let $updated_content = document.createElement('div');
    	// $updated_content.innerHTML =  asset.render()
    	// 
    	// let $card  =  document.getElementById(asset.data.asset)
    	// // console.log(asset)
    	// if($card === null) {
    	// 	$block.innerHTML =  $updated_content.outerHTML; 
    	// 	return;
    	// }


    	refreshAsset(asset,$block)
		// $updated_content.querySelector(`#${asset.data.asset}`).childNodes.forEach( (node, i) => {
		// 	if(node.isEqualNode($card.childNodes[i])) {return }
		// 	$card.childNodes[i].innerHTML = node.innerHTML
		// })


		// if(asset.media !== $card.querySelector('.asset-media').innerHTML) {
		// 	$card.querySelector('.asset-media') = asset.media
		// }

    	if(asset.data.supply === 0) {
    
    		$block.classList.add('blank')
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

const getUserAssets  = async (user)  => {

	setMode('grid');

	var issuances = _.flatten(await Promise.all(_.map(
		user.addresses,  
		async (address) => {
			let  
				obj = {data:[]},
				incomplete = true,
				page = 1;
			
			while(incomplete)  {
				let add = await $.get(`https://xchain.io/api/issuances/${address}?page=${page}`);
				page += 1;
				
				obj.data = [
				...obj.data,
				...add.data
				]

				if(obj.data.length >=  add.total) {
					incomplete = false
				}
				
			}
			

			
			return obj.data
		}
	)))
	


	let collection = new Collection({
		data : _.values(_.keyBy(issuances, 'asset')),
		asset_template: document.getElementById('asset-template').cloneNode(true)
	})

	document.getElementById('focus').innerHTML = `<h1>${user.name  ? user.name  : user.addresses[0]}</h1>`
	showCollection(collection)
}


const refreshAsset = (asset, container) => {

	update = document.createElement('div')
	update.innerHTML = asset.render();


	container.querySelector('.asset-meta').innerHTML = update.querySelector('.asset-meta').innerHTML
	container.querySelector('.asset-details').outerHTML = update.querySelector('.asset-details').outerHTML

	// RENDER SETS & PARENTS ICONS 
	try {
			if(asset.data.group && asset.data.group.length) {

	    	let group  = GROUPS[asset.data.group.replace(' ','_')]

		    if(group.image_url) {
		    	
		    	container.querySelectorAll('.icon').forEach(item => {item.innerHTML = `<img src="${group.image_url}">`})
		    }
    	}	
	}  catch(e) {

		//console.warn(asset.data.group.replace(' ','_'))
	}	


    // RENDER MEDIA
    asset.media.forEach( medium => {
    	if(medium.added) return
    	medium.added = true
		let
			media_container = container.querySelector('.asset-media-container'),
			media = document.createElement('div'),
			element = medium.node

		media.classList.add('asset-media')
		
		media.append(element)
		media_container.append(media);
		media.classList.add(element.nodeName)
		element.muted = true;
		// element.style.maxHeight =  '100%';

		element.addEventListener('load', (e) =>  {
			

			
			// media_container.style.height = Math.max(media_container.clientHeight, e.target.height)
			e.target.parentNode.classList.add('loaded');
			media_container.classList.add('loaded');
			//element.style.width = media_container.width;
			if(e.target.height > 560) {
				e.target.height = 560
			}
			//element.style.height = e.target.height;
			let loaded_count = media_container.querySelectorAll('.asset-media.loaded').length
			let error_count = media_container.querySelectorAll('.asset-media.error').length
			if( loaded_count === 1 && error_count === asset.media.length - 1) {
				media_container.classList.add('single_load')
			}
		})
		element.addEventListener('loadstart', (e) =>  {
			
			e.target.parentNode.classList.add('loaded');
			media_container.classList.add('loaded');
		
		})
		element.addEventListener('error',(e) => {
			e.target.parentNode.classList.add('error');

			if(!e.target.error) {
				
				asset.media_error_count +=  1;
			}
			e.target.error =  true
			
			if(asset.media_error_count >= asset.media.length) {
				
				container.classList.add('blank');
				media_container.querySelector('.asset-media-loader').innerHTML = 'No Media'
			}
			// this.dispatchEvent(new Event('mediaError'))
		})
	});

	
	


}


const showAssetDetails  = async (assetName) =>  {

	if(states.mode === 'focus') return 
	
	let 
		$focus = document.getElementById('focus'),
		$collection_container = document.getElementById('assets-container')

	$collection_container.innerHTML  = "";
	$focus.innerHTML  =  $focus.cloneNode(true).innerHTML;

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

	
	   refreshAsset(asset, $focus);

	    // refreshAsset(asset, $focus);
		$focus.querySelector('.asset-media-container').addEventListener('click', (e) => {
	    	e.preventDefault();
	    });

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
			
			return {
				success: true
			}
		}  else {
			let a = User.find_by_name(input)
			
			if(a.addresses.length) {
				
				window.location.href=`index.html?by=${a.name}`
				return {
					success: true
				}
			}
			let resp = await getAssetData(input);

			if(resp.error) {
				
				return {
					error: 'Asset not found',
					success:  false
				}
			} else {
				window.location.href=`index.html?asset=${input}`
				
				return {
					success: true
				}
			}
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

	document.getElementById('focus').innerHTML = `<h1>${setName}</h1>`
	showCollection(group_collection)
	

}

const openSearchForm  = (e) => {

	if(e.target.parentNode.classList.contains('toggled')) return;
	e.target.parentNode.classList.add('toggled')

	let 
		crumb = document.querySelector('#breadcrumbs a.active'),
		form = document.querySelector('#splash .search-form').cloneNode(true),
		input =  form.querySelector('.search-input')

	input.value  =  crumb.innerHTML.replace('By ','').replace('at ','')

	
	crumb.parentNode.append(form);
	input.select()

	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		

		let rst  = await  search(e.target.querySelector('.search-input').value);
		
		if(!rst.success) {
			
			e.target.querySelector('.error-message').innerHTML  = rst.error;
		}  else  {
			setMode('grid');
		}
	})


}


window.addEventListener('load', async (event) => {

	await User.fetch()

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


	$('.search-form').submit(async (e) =>  {
		e.preventDefault();


		let rst  = await  search(e.target.querySelector('.search-input').value);
		
		if(!rst.success) {
			e.target.querySelector('.error-message').innerHTML  = rst.error;
		}  else  {
			setMode('grid');
		}
		
	});

	// user.address = localStorage.getItem('address');

	user.preferences  = {
		...settings,
		...localStorage.getItem('settings')
	}

	if(getUrlParameter('by')) {
		
		let 
			user_data = _.find(User.data, (u) => {return  u.name.toLowerCase() === getUrlParameter('by').toLowerCase() }),
			user = user_data ? new User(user_data) :  new User({addresses:  getUrlParameter('by')})
			
			
		getUserAssets(user);
		Breadcrumbs.add(`by ${user.name ? user.name :  user.addresses[0]}`, (e) => {
			
			openSearchForm(e);
			// window.location.href =  `?by=${getUrlParameter('by')}`
			e.preventDefault();
		});
		return ;
	}

	if(getUrlParameter('asset')) {

		showAssetDetails(getUrlParameter('asset'));
		Breadcrumbs.add(getUrlParameter('asset'), (e) => {
			
			openSearchForm(e);
			// window.location.href =  `?by=${getUrlParameter('by')}`
			e.preventDefault();
		});
		return ;
	}
	
	if(getUrlParameter('at')) {
		generateWallet(getUrlParameter('at'));
		Breadcrumbs.add(`at ${getUrlParameter('at')}`, (e) => {
			openSearchForm(e);
			e.preventDefault();
		});
		return ;
	}

	if(getUrlParameter('set')) {
		getSet(getUrlParameter('set'));
		Breadcrumbs.add(getUrlParameter('set'), (e) => {
			openSearchForm()
			// window.location.href =  `?set=${getUrlParameter('set')}`
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
	// if(user.address === null) {

	// }
			setMode('splash')
		Breadcrumbs.add();
	// } else {
	// 	setMode('grid');
	// 	Breadcrumbs.add(user.address, (e) => {
	// 		setMode('grid');
	// 		generateWallet(user.address);
	// 		$("html, body").animate({scrollTop: 0}, 1);
	// 		e.preventDefault();
	// 	});
	// 	generateWallet(user.address);

	// }

	document.getElementById('cta-next').addEventListener('click', (e) => {

		showAssetDetails() 
		return false;
	})



	
});


window.addEventListener("scroll", () => {
	if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight-400)) {

       	if(current_collection  && current_collection.assets && current_collection.assets.length> (current_collection.page+1) *settings.per_page) {
			showCollection(current_collection,{page:current_collection.page+1});
    	}
    }
});
