var normalizeUrl = function(str) {
	return str.replace(/(http(s?)):\/\//i, '' ).split(';')[0]
}

var getAssetData = async function(asset_name) {
	
	let asset = await $.get("https://xchain.io/api/asset/"+asset_name);
	
	
	return asset
}



class Asset extends EventTarget {
	constructor(data) {
		super()
		this.data  = data;

		return this
		
	}

	async init() {

		let extra= await getAssetData(this.data.asset)

		this.data  = {
			...this.data,
			...extra
		}
		this.valid = await this.normalize()
		this.history = await this.fetch_history();

		this.dispatchEvent(new Event('loaded'));
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
			url: "https://xchain.io/api/issuances/"+this.data.asset,
			method: "GET"
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
					e.target.onerror = null
					this.$dom.parent().addClass('blank')
				}
				// console.error()
			}
			img.src = this.image_url[0]

			// img  = `<img src="${this.image_url[0]}" source_id="0" sources="${this.image_url.join(',')}" onerror="onImageError">`
		}   else {
			// img  = `<img src="${this.image_url}">`
			img.src = this.image_url
		}
		
		return img;
	}


	get description() {
		// console.log(this)
		let mint = this.history.data.pop();
		let date = new Date(this.history.data.pop().timestamp * 1000);
		let copy = `Minted ${date.toLocaleString('default', { month: 'long' }) } ${date.getFullYear()} (block #${mint.block_index})\n
		Total Supply:  ${this.data.supply}\n

		`
		
		copy += this.data.description
		if(this.isSubasset()) {
			copy += `
			\nSubasset of <a href="https://xchain.io/asset/${this.parentName}">${this.parentName}</a>\n
			`
		}
		
		return copy
		return ""
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


}

