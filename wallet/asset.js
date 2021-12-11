var normalizeUrl = function(str) {
	return str.replace(/(http(s?)):\/\//i,'').split(';')[0]
}

class Asset  {
	constructor(data) {
		// super();
		this.valid = this.normalize(data);

		return this
	}


	async normalize(data) {

		this.data = data;

	    if(data.description.endsWith('.json')) {
	    	
	        try {
	        	// normalize additional data and combine it with existing one.
	        	// console.log(normalizeUrl(this.data.description))
	        	let resp = await $.get('http://'+ normalizeUrl(this.data.description)).done((e) => {
		            	console.log(e);
		            })
		      

	         	console.log("Passed")
	            console.log(resp)
		       	// console.log(JSON.parse(resp))
		      	try { 
		      			resp = JSON.parse(resp)  
		      		} catch { 
		      			// DO nothing
		      		}

		        this.data = {
		                ...data,
		                ... resp
		                }
		        

		        // For further middleware formatting.
		        this._description = this.data.description 
		        

		        if(this.data.image_large  === undefined) {
		        	console.log(this)
		        	return false;
		        }

		        return true
		            
	        } catch(e) {
	            // asset.success = false;
	            console.warn(e)

	            return false
	            
	        }
	    } else if(this.data.description.startsWith('imgur') ) {
	    		let chunks = this.data.description.split(';')
	    		this._description = chunks[1];
	        	this.data.image_large = 'https://i.imgur.com/'+ chunks[0].split('/')[1];
	        	return true
	    // } else if('YOU TUBE VIDEO') {
	    // 	// FAKASF VIDEO CARD
	    // }

	   	} else {
	    	console.warn(data.description)
	    	// PLACEHOLDER FOR LOGIC WHEN ASSET WITH NO MEDIA CAN BE DISPLAYED
	    	return false
	    }
	}

	get name() {
    	return this.isSubasset() ? this.data.asset_longname : this.data.asset;
	}

	// get valid() {
	// 	return this._valid;
	// 	if(this.data.image_url === undefined && this.data.image_large === undefined) return false;
	// 	return true;
	// }

	get media() {

		let img = new Image();

		img.src = this.data.image_large ? this.data.image_large : this.data.img_url;
		return img;
	}


	get description() {
		let copy = this.data.description
		if(this.isSubasset()) {
			copy += `
			Subasset of <a href="#">${this.parentName}</a>`
		}
		return copy
	}


	get quantity() {
		return this.data.quantity
	}


	get parentName() {

    	this.isSubasset() ? this.name.split('.')[0] : null;    	

    }
    

	isSubasset() {
    	return this.data.asset_longname.indexOf('.') !== -1
	}


}

