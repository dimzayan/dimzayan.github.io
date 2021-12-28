
class Collection {
	constructor(params) {
		  
		this.address = params.address;
		this.data =  params.data;
		this.assets = this.data.map( asset =>  {
			return  new Asset(asset,{

				template: params.asset_template
			})
		})
	}


	render(page) {
		this.page = page

		let $container = $('<div>', {class:  'row collection'})

		let html  =  '';
		let range_start =  page * 30
		let range_end = range_start + 30

		_.each(
			this.assets
			.filter(
				(a) => {
					
					return  a.data.supply  !== 0
				}
			)
			.sort(
				(a,b) => {
					return a.name > b.name
				}
			)
			.slice(range_start, range_end ), 
			(asset)  => {
				asset.init();
				html  +=  generateBlock(asset).outerHTML
				
			}
		)


		
		return html
	}


}


