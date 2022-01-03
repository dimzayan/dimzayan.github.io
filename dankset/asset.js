class Asset extends EventTarget {
	constructor(data, options) {
		super()
		
		this.data  = data;
		this.data  = {
			...PRESETS[this.name],
			...data
		}
		
		// this.template = options.template  ;
		this.loaded = false;
		this.history =  [];
		this.hodlers  =  [];
		this._media  =  [];
		this.blank  = false;
		this.media_error_count = 0;
		return this
		
	}

	async init(extra = false) {
		// console.log("loading "+this.data.asset)
		let 
			base = await Asset.find(this.data.asset),
			_this = this;

		if(this.data.description && (!this.data.description.length  || this.data.supply === 0) ) {

			this.blank  = true
		}
		

	
		this.data  = {
			...this.data,
			...base.data
		}

		
		
		this.valid = await this.normalize();
		this.fetch_market_info().then(  (d) => {
			
			_this.market_data = d.data
			_this.dispatchEvent(new Event('change'));
		})
		this.fetch_history(extra).then(  (d) => {
		
			_this.history = d.data
			_this.dispatchEvent(new Event('change'));
		})
		if(extra) {
	
			
			this.fetch_hodlers().then(  (d) => {
				
				_this.hodlers = d.data
				_this.dispatchEvent(new Event('change'));
			})

	
		}

	

		this.loaded  = true
		
		this.dispatchEvent(new Event('change'));
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
	        // this._description = this.data.description 
	        xchainFallBack();
    	}

    	// horrible hack  for rarepepes and older assets
    	let xchainFallBack = ()  => {
			if(this.image_url  === undefined ) {	
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
	    	this.json_url = this.data.description;
	    	
    		this._description = ''

	    	let resp = await this.fetch_json();

	    	if(resp) {

	    		format(resp);
	    		return;
	    	} 
	    	xchainFallBack();
	    	

	    }  else if(this.data.description.startsWith('imgur') ) {
	    		let chunks = this.data.description.split(';')
	    		this._description = chunks[1];
	        	this.data.image_url = 'https://i.imgur.com/'+ chunks[0].split('/')[1];
	        	return true
	    // } else if('YOU TUBE VIDEO') {
	    // 	// FAKASF VIDEO CARD
	    // }

	   	} else if(this.data.description.match(/(jpe?g|png|gif|bmp)$/)) {
	    	this.data.image_url = 'http://'+normalizeUrl(this.data.description);
	    	this._description = ''
	    	return true
	    }  else {
	    	// console.warn(data.description)
	    	// PLACEHOLDER FOR LOGIC WHEN ASSET WITH NO MEDIA CAN BE DISPLAYED
	    	xchainFallBack()
	    	return true
	    }
	}

	async fetch_json() {
    	
        try {
        	// normalize additional data and combine it with existing one.
        	// console.log(normalizeUrl(this.data.description))
        	let resp = await $.get('https://'+normalizeUrl(this.data.description))
        	
	        return resp
	            
        } catch(e) {
           
            try {

        		let resp = await $.get('http://'+normalizeUrl(this.data.description))
	        	return resp
	            
	        } catch(e) {
	        	
	            return null
	        }
            
        }
	}

	async fetch_history() {
		return await $.ajax({
			url: "https://xchain.io/api/issuances/"+this.name,
			method: "GET",
			timeout:21000,
			error: (e) => {  }
		})
	}

	async fetch_hodlers() {
		return await $.ajax({
			url: "https://xchain.io/api/holders/"+this.name,
			method: "GET",
			timeout: 21000,
			error: (e) => {  }

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

	fetch_media() {
		let 
			media = [],
			raw_description = document.createElement('span')
		
		raw_description.innerHTML = this.data.description;

		raw_description.querySelectorAll('img, video, iframe').forEach(item => {
			// if(item.nodeName === 'IFRAME') {
			// 	item.scrolling = 'no'

			// }

			// if(item.nodeName === 'VIDEO') {
			// 	item.muted = true;
			// 	item.style.zIndex = -2;
			if(!item.src && item.nodeName === 'VIDEO') {
				item.src = item.querySelector('source').src 
			}  
	
				
	

			// }

			
			media.push({
				type: item.nodeName,
				src: item.src,
				added:  false
			})
			
		})

		_.flatten([this.image_url]).forEach( (src) => {
			if(src === undefined) return
			// let img = new Image()
			// img.src = src;
			// console.warn(img)
	
			media.push({
				type: 'IMG',
				src: src,
				added:  false
			});
		});


		if(this.data.media) {
			
			_.each(this.data.media,(link) => {
				let type;
				if(link.endsWith('.mp4'))  {
					type = 'VIDEO' //document.createElement('video');
					// node.autoplay = true
					
				} else {
					type = 'IMG'
					// node = document.createElement('img');

				}

				
				media.push({
						type: type,
						src: link,
						added: false
					})
		
			})

			
		}
		
		return _.uniq(media)
	}

	get media() {


		
		// Adding only if not already present
		this.fetch_media().forEach( item => {
			if(this._media.map(m => m.src).includes(item.src)) return;
			this._media.push(item)
		});
		
		return this._media

	}



	get supply() {
		if(!this.data.supply) return []
		if(!this.hodlers.length ) return []

		return {
			total_issued:  this.data.supply,
			total_owned: this.quantity ,
			total_owned_percent:  parseFloat(((this.quantity/this.data.supply)*100).toFixed(2)),
			total_hodlers: this.hodlers.length
		}

		
	}


	get description() {

		
		let raw_description = document.createElement('span');
		raw_description.innerHTML = this.data.description;

		raw_description.querySelectorAll('img, video, iframe').forEach(item => {
			item.remove();
		})
		
		
		return raw_description.innerHTML
		
	}

	get mint_date() {
			
			try{
				let mint = this.history[this.history.length-1]
				
				let date = new Date(mint.timestamp * 1000);
			
				return `${date.toLocaleString('default', { month: 'long', year:'numeric' }) }\n`	
			} catch(e) {
				// console.warn(this)
				return null
			}

	}

	get block_index() {
		try{
			let mint = this.history[this.history.length-1]
			
		
		
			return mint.block_index
		} catch(e) {
			// console.warn(this)
			return null
		}
	
	}

	get artist()  {
		
		if(!this.data.issuer) {
			return new User({
				name: '---'
			})
		}
		this._artist  = User.find_by_address(this.data.issuer)

		if(!this._artist.name)
			this._artist.name= this.data.issuer
	
		return this._artist
		
	}


	get quantity() {
		return this.data.quantity || 0
	}


	get parentName() {
    	return this.isSubasset() ? this.name.split('.')[0] : null;    	
    }
    

	isSubasset() {
		try {
			return this.data.asset_longname.indexOf('.') !== -1
		} catch(e) {
			
			return false
		}
    	
	}

	async fetch_subassets() {
	
		let resp = await $.ajax({
			url: `https://xchain.io/api/issuances/${this.data.issuer}`,
			method: 'GET'
		})
		
		return _.filter(_.uniqBy(resp.data, 'asset'), (a) => {return  a.asset_longname.startsWith(`${this.name}.`)})

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

	async fetch_market_info(advanced =  false) {
		if(this.market_data) {
			return {data:this.market_data}
		}

		let market_data = {
			ask  : null,
			ask_tx_hash : null,
			total_sales :  null,
			total_gives : null,
			last_sale_price : null,
			last_sale_date: null,
			last_sale_quantity:null
		}
		let dispensers = await this.dispensers;
		
		market_data.total_sales =  parseFloat(dispensers.reduce((sum, n)  =>  {return sum  + ((n.escrow_quantity - n.give_remaining) * n.satoshirate)},  0).toFixed(7))
		market_data.total_gives = dispensers.reduce((sum, n)  =>  {return sum  + ((n.escrow_quantity - n.give_remaining) )},  0)
		market_data.aps  = parseFloat((market_data.total_sales/market_data.total_gives).toFixed(4))

		// Avail vs Used
		let available_dispensers = [];
		let used_dispensers = [];
		
		for(var i=0;i<dispensers.length;i++) {

			let dispenser = dispensers[i];

			if(dispenser.give_remaining > 0 && dispenser.status == 0) {
				available_dispensers.push(dispenser);
			}  else {
				used_dispensers.push(dispenser);
			}

			if(advanced && dispenser.give_remaining < dispenser.escrow_quantity)  {
						
				let dispenses = await $.get('https://xchain.io/api/dispenses/'+dispenser.tx_hash);
				// console.log(dispenses)
				market_data.last_sale_quantity = dispenses.data[0].quantity 
				market_data.last_sale_price = parseFloat(dispenser.satoshirate)
				market_data.last_sale_timestamp = dispenses.data[0].timestamp
				market_data.last_sale_date = new Date(market_data.last_sale_timestamp * 1000).toLocaleString('default', {year: 'numeric', month: 'long', day: 'numeric' })
				
				
				break;
			}
			
		}

		// ==================// ==================
		// REMINDER:!! Add calculations for give_quantity
		// Available and  best offer
		
		if(available_dispensers.length > 0) {
			market_data.ask = parseFloat(available_dispensers.sort((a,b) => {a.satoshirate  < b.satoshirate})[0].satoshirate);
			market_data.ask_tx_hash = available_dispensers[0].tx_hash
			// this.$dom.find('[data_asset_best_offer]').html(`<a href="https://xchain.io/tx/${available_dispensers[0].tx_hash}">${best_offer}BTC</a>`);
		
		}
		// } else  {
		// 	this.$dom.find('[data_asset_best_offer]').html(`---`);

		// }



		this.market_data  = market_data

		return {data:market_data}
	}





	render(options) {
			

		// console.log(this.media)
		let html = options.template.innerHTML;
		// console.log(`${this.name} : ${this.media.src}`)

		let data = {
			name: this.name,
			id:  this.data.asset,
			quantity: this.quantity,
			artist: this.artist.name ,
			mint_date: this.mint_date,
			block_index: this.block_index,
			description: this.description,
			parent: this.parentName,
			group: this.data.group,
			has_group: this.data.group !== undefined,
			issuer: this.data.issuer,
			has_ask: this.market_data !== undefined && this.market_data.ask != null,
			parented: (this.parentName !==  null)  || (this.group !== undefined),
			shell: this.data.supply ? false : true,
			current_supply: this.data.supply || '',
			series: this.data.series

		}

		data = {
			...data,
			...this.market_data,
			...this.supply
		}

		_.each(data, (val, key) => {
			// console.log(`${key}:${val}`)
			// if(val  === null)  {val = '---'}
			html = html.replaceAll(`{{${key}}}`,val)
		})


		

		return html


		
	}


	static async find(assetName) {

		let obj = await $.get(`https://xchain.io/api/asset/${assetName}`);
		if(obj.error) return null;

		return new Asset(obj);

	}



}

