class User {
	constructor(params)  {
		this.name =  params.name ||  null;
		this.about = params.about || "";
		this.addresses =  _.flatten([params.addresses || []]);

		return this;
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