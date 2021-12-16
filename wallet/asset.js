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


class Asset extends EventTarget {
	constructor(data, options) {
		super()
		this.data  = data;
		this.data  = {
			...PRESETS[this.name],
			...data
		}
		
		this.$dom = options.template.clone();
		this.loaded = false;
		return this
		
	}

	async init() {
		// console.log("loading "+this.data.asset)
		let extra= await getAssetData(this.data.asset)

		this.data  = {
			...this.data,
			...extra
		}
		this.valid = await this.normalize()
		try  {  
			this.history = await this.fetch_history();  
		} catch(e)  { this.history =  []; }
		try  { this.hodlers = await this.fetch_hodlers(); } catch(e) { this.hodlers  =  [];  }
		try { await this.fetch_market_info(); } catch(e) {}

		this.loaded  = true
		this.display()

		this.dispatchEvent(new Event('loaded'));
		// console.log(this.data.asset+'  loaded')
		return this
	}



	async normalize(data) {

		

		let resp;

		let format = (resp) => {
    		// console.log(JSON.parse(resp))
	      	try { 
	      		resp = JSON.parse(resp)  
      		} catch { 
      			// DO nothing
      		}

	        this.data = {
	                ...this.data,
	                ... resp
	                }
	        

	        // For further middleware formatting.
	        this._description = this.data.description 
	        xchainFallBack();
    	}

    	// horrible hack  for rarepepes and older assets
    	let xchainFallBack = ()  => {
			if(this.image_url  === undefined) {	
	        	this.data.image_url =  [
	        		`https://xchain.io/img/cards/${this.data.asset}.png`,
	        		`https://xchain.io/img/cards/${this.data.asset}.gif`,
	        		`https://xchain.io/img/cards/${this.data.asset}.jpg`,
	        		`https://xchain.io/img/cards/${this.data.asset}.jpeg`,
	        		]
	        	return true;


	        } else  {
	        	// console.log(this.image_url)
	        	return true;
	        }
    	}

	    if(this.data.description.endsWith('.json')) {

	    	
	    	
	    	
	        try {
	        	// normalize additional data and combine it with existing one.
	        	// console.log(normalizeUrl(this.data.description))
	        	resp = await $.get('https://'+normalizeUrl(this.data.description)).done((e) => {
		            	// console.log(e);
		            })

	        	format(resp)

		        return true
		            
	        } catch(e) {
	           
	            try {
	        	// normalize additional data and combine it with existing one.
	        	// console.log(normalizeUrl(this.data.description))
	        	resp = await $.get('http://'+normalizeUrl(this.data.description)).done((e) => {
		            	// console.log(e);
		            })

	        	format(resp)

		        return true
		            
		        } catch(e) {
		            // asset.success = false;
		            xchainFallBack()
		            return true
		            
		        }
	            
	        }
	    } else if(this.data.description.startsWith('imgur') ) {
	    		let chunks = this.data.description.split(';')
	    		this._description = chunks[1];
	        	this.data.image_url = 'https://i.imgur.com/'+ chunks[0].split('/')[1];
	        	return true
	    // } else if('YOU TUBE VIDEO') {
	    // 	// FAKASF VIDEO CARD
	    // }

	   	} else {
	    	// console.warn(data.description)
	    	// PLACEHOLDER FOR LOGIC WHEN ASSET WITH NO MEDIA CAN BE DISPLAYED
	    	xchainFallBack()
	    	return true
	    }
	}


	async fetch_history() {
		return await $.ajax({
			url: "https://xchain.io/api/issuances/"+this.name,
			method: "GET",
			timeout: 5000
		})
	}

	async fetch_hodlers() {
		return await $.ajax({
			url: "https://xchain.io/api/holders/"+this.name,
			method: "GET",
			timeout: 5000
		})
	}



	get name() {
    	return this.isSubasset() ? this.data.asset_longname : this.data.asset;
	}

	// get valid() {
	// 	return this._valid;
	// 	if(this.data.image_url === undefined && this.data.image_large === undefined) return false;
	// 	return true;
	// }

	get image_url() {
		return this.data.image_large ? this.data.image_large : (this.data.img_url ? this.data.img_url : this.data.image_url );
	}

	get media() {

		let img  = new Image();


		if( Array.isArray(this.image_url)) {

			this.media_id =  0;
			img.onerror = (e)  => {
				this.media_id += 1;

				e.target.src  = this.image_url[this.media_id]
				if(this.media_id  >=  this.image_url.length) {
					e.target.onerror = null;
					if(!this.$dom.parent().find('video,  iframe').length) {
						this.$dom.parent().addClass('blank')
					}
					
				}
				// console.error()
			}
			img.src = this.image_url[0]

			// img  = `<img src="${this.image_url[0]}" source_id="0" sources="${this.image_url.join(',')}" onerror="onImageError">`
		}   else {
			// img  = `<img src="${this.image_url}">`
			if(this.image_url === undefined) {
				return null
			}
			img.src = this.image_url
		}


		
		return img;
	}

	get supply() {
		if(!this.data.supply) return undefined
		if(!this.hodlers.data || !this.hodlers.data.length) return undefined

		return {
			total:  this.data.supply,
			owned: this.quantity,
			owned_percent:  parseFloat(((this.quantity/this.data.supply)*100).toFixed(2)),
			hodlers: this.hodlers.data.length
		}

		
	}


	get description() {
		// console.log(this)
		let copy  =  '';
		if(this.loaded) {
			try{
				let mint = this.history.data.pop();
			
				let date = new Date(mint.timestamp * 1000);
			
				copy += `Minted ${date.toLocaleString('default', { month: 'long', year:'numeric' }) }(block #${mint.block_index})\n`	
			} catch(e) {
				console.warn(this)
			}
			
		

		}
		

		copy += this._description
		if(this.isSubasset()) {
			copy += `
			\nSubasset of <a href="https://xchain.io/asset/${this.parentName}">${this.parentName}</a>\n
			`
		}


		
		return copy
		
	}

	get artist()  {
		return this.data.artist 
	}


	get quantity() {
		return this.data.quantity
	}


	get parentName() {
    	return this.isSubasset() ? this.name.split('.')[0] : null;    	
    }
    

	isSubasset() {
    	return this.data.asset_longname.indexOf('.') !== -1
	}

	get dispensers() {
		return ( 
			async () =>  {
				if(this._dispensers)  return  this._dispensers;
				let d = await $.ajax({
					url: "https://xchain.io/api/dispensers/"+this.name,
					method: "GET"
				})
				this._dispensers =  d.data
				return this._dispensers;
			}
		)();
	}

	get market() {
		return (
			async () =>  {
					let dispensers 	=  await this.dispensers 
					let total_sales =  parseFloat(dispensers.reduce((sum, n)  =>  {return sum  + ((n.escrow_quantity - n.give_remaining) * n.satoshirate)},  0).toFixed(7))
					let total_gives = dispensers.reduce((sum, n)  =>  {return sum  + ((n.escrow_quantity - n.give_remaining) )},  0)
					
				return {
					total_sales: total_sales,
					total_gives: total_gives,
					aps: (total_sales/total_gives).toFixed(4)	
				}
			}
		)();

	}

	async fetch_market_info() {
		// let marketObj = await getMarketInfo()
		
		// if(dispReq !== undefined && dispReq.abort !== undefined) { dispReq.abort();}

		// let dispReq = await $.ajax({
		// 	url: "https://xchain.io/api/dispensers/"+this.name,
		// 	method: "GET"
		// })

		let dispensers = await this.dispensers;
		
		let $disp = this.$dom.find('.asset-price-info')	

		
		let available_dispensers = [];
		let used_dispensers = [];



		// Avail vs Used
		for(var i=0;i<dispensers.length;i++) {

			if(dispensers[i].give_remaining > 0 && dispensers[i].status == 0) {
				available_dispensers.push(dispensers[i]);
			}  else {
				used_dispensers.push(dispensers[i]);
			}
			
		}

		// ==================// ==================
		// REMINDER:!! Add calculations for give_quantity
		// Available and  best offer
		let  best_offer = null
		if(available_dispensers.length > 0) {
			best_offer = parseFloat(available_dispensers.sort((a,b) => {a.satoshirate  < b.satoshirate})[0].satoshirate);
			this.$dom.find('[data_asset_best_offer]').html(`<a href="https://xchain.io/tx/${available_dispensers[0].tx_hash}">${best_offer}BTC</a>`);
		

		} else  {
			this.$dom.find('[data_asset_best_offer]').html(`---`);

		}


		

	
		


		// ==================
		// Last Sale
		let last_sale = {
			price: null,
			date: null,
			quantity: null
		}

		for(var  i=0; i< dispensers.length;i++) {
			let dispenser  = dispensers[i];
			
			if(dispenser.give_remaining < dispenser.escrow_quantity)  {
				
				let dispenses = await $.get('https://xchain.io/api/dispenses/'+dispenser.tx_hash);
				// console.log(dispenses)
				last_sale.quantity = dispenses.data[0].quantity 
				last_sale.price = parseFloat(dispenser.satoshirate)
				last_sale.timestamp = dispenses.data[0].timestamp
				
				
				break;
			}
		}


		if(last_sale.price  !==  null)  {
			this.$dom.find('[data_asset_last_sale]').html(
				`<a>${last_sale.quantity} @ ${last_sale.price}BTC on ${new Date(last_sale.timestamp * 1000).toLocaleString('default', {year: 'numeric', month: 'long', day: 'numeric' })}</a>`
				)
		}
			
	
		$disp.find('a').on('click', (e) =>  {
			e.stopPropagation();
		})



			return true
	}


	display() {
		

		this.$dom.attr('data-name',this.data.asset)
		this.$dom.find(`.asset-name`).html(this.name)
		this.$dom.attr('id', `${this.name}`)
		this.$dom.attr('href', `#${this.name}`)

		_.each(['name','quantity','description','media', 'artist'], (key) => {
			this.$dom.find(`.asset-${key}`).html(this[key])
		});

		_.each(this.supply,  (val,key)  => {

			this.$dom.find(`.asset-supply-${key}`).html(val)
		})


		_.each(this.market,  (val,key)  => {

			this.$dom.find(`#asset-market-${key}`).html(val)
		})

		this.group_name = presetGroupName(this.name)
		if(this.group_name !==  null) {
			this.$dom.find(`.asset-group`).html(`This is an official ${this.group_name} asset.`)

			if(GROUPS[this.group_name.replace('', '_')])  {

				this.$dom.find('.asset-group-icon').html(`<img src="${GROUPS[this.group_name.replace('', '_')].image_url}">`) 
			}
			
		}  
		

		let $item_image = this.$dom.find('.asset-image');
		
		let $video = this.$dom.find('.asset-description video, .asset-description iframe')
		
		if($video.length) {
			
			$video.prop('muted', true) ;
			$item_image.append($video)

		} 
		
		this.$dom.on('click', function(e) {
			e.preventDefault();
 
        	setDisplayMode('1xgrid');
		
			window.location.hash = $(this).attr('id');

			$(window).scrollTop($(this).offset().top - 100);

		});



	// this.$dom.find('video').prop('muted', true)




	return this.$dom
	}


}

