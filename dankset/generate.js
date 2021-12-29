var generateCard = function(asset) {
	let $item = $('#templates .collection-item').clone();
	let $item_image = $item.find('.artwork-image')
	let img = new Image();
	img.src = asset.img_large ? asset.img_large : asset.img_url;

	$item_image.html(img);

	$item_image.clone().insertAfter($item_image);
	$item.find('.artwork-title').html(asset.title);
	$item.find('.artwork-quantity').html('x'+asset.quantity);

	$item.on('click', function(e) {
		window.location.href="https://xchain.io/asset/"+asset.asset
	});

	return $item
}

var generateCollection = function(assets, dom_el) {

		let grid = dom_el.find('.collection-display-grid');

		grid.empty();
		
		if(!items.length) {
			dom_el.hide();
			return;
		} 
		
		dom_el.show();


		$.each(assets, function(i, asset) {

			if(asset.quantity === 0 || asset.asset === 'XCP') {continue;}

			
			asset.id = i;
			asset.title = asset.asset

			if(asset.description.endsWith('.json')) {

				$.get(normalizeUrl(asset.description)).done(function(resp) {
					asset = {
						...asset,
						...resp
					}
				})
			} else {
				generateCard(asset).appendTo(grid)
			}


			
			// img.onerror = function() {

			// 	img.onerror = function() {
			// 		if(artwork.alt_url !== this.src) {
			// 			this.src = artwork.img_url.replace('.jpg','.gif');
			// 		}
			// 		img.onerror = function(){}
			// 	}
			// 	if(artwork.alt_url !== this.src) {
			// 		this.src = artwork.img_url.replace('.jpg','.png');
			// 	}
				
			// }
			// artwork_dom_item.addClass(artwork.klass)
			
		});
	}