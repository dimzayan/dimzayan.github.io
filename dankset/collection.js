
class Collection {
	constructor(params) {
		  
		this.address = params.address;
		this.data =  params.data;
		this.assets = this.data.map( asset =>  {
			
			return  new Asset(asset)
		})
		this.page = 0
		this.per_page = 30
	}


	get(page = 0) {
		this.page = page

		// let $container = document.createElement('div');
		


		// let html  =  '';
		let range_start =  page * 30
		let range_end = range_start + 30

		return this.assets
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
			.slice(range_start, range_end )

		// _.each(
		// 	, 
		// 	(asset)  => {
		// 		asset.init();
		// 		$container.append(generateBlock(asset))
				
		// 	}
		// )


		// $container.innerHTML = html
		return $container
	}


}


