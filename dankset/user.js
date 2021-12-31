class User {
	constructor(params)  {
		this.name =  params.name ||  null;
		this.about = params.about || "";
		this.addresses =  _.flatten([params.addresses || []]);

		return this;
	}

	async issuances () {

		return _.flatten(
			await Promise.all(
				_.map(
					this.addresses,  
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

							if(add.data.length< 100) {
								incomplete = false
							}
						}
						
						return obj.data
					}
				)
			)
		)
		
	}

	static find_by_name(name) {
		let u = _.find(this.data, (u) => {return  u.name.toLowerCase() === name.toLowerCase() }) || {name: name}
		return new User(u)

	}

	static find_by_address(address) {
		let u = _.find(this.data, {addresses: [address]}) ||  {addresses: [address]}
		return new User(u)
	}

	static data  = []
	static async fetch() {
		this.data = await $.get('https://battle-safe-pixie.glitch.me/users')
	}
}