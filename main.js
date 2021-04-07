document.addEventListener("DOMContentLoaded", function (e) {
	const item_rows = document.querySelectorAll(".calculator .row:not(.total)");

	const reset_button = document.querySelector("#buttonReset");

	reset_button.addEventListener("click", function (e) {
		e.preventDefault();

		item_rows.forEach(function (row) {
			row.querySelector("input").value = 0;
			row.querySelector("input").dispatchEvent(new Event("change"));
			row.classList.remove("active");
		});
	});

	item_rows.forEach(function (row) {

		const qty_field = row.querySelector("input");
		qty_field.addEventListener("change", item_input_listener);
		qty_field.addEventListener("keyup", item_input_listener);
	});
}); //end DOM ready

function item_input_listener(e) {
	const this_input = e.target; //the input field that emitted the event
	const row = this_input.closest(".row"); // the row that contains the input field that emitted the event
	const qty = this_input.value; //the quantity

	const shops = row.querySelectorAll(".ctown, .keyfoods, .fairway, .gristedes")

	shops.forEach(function (shop) {
		let price = shop.dataset.price;

		price = parseFloat(price);

		const total = qty * price;

		shop.querySelector("span").innerHTML = round_number(total);
	});

	row.classList.add("active");
	calculate_totals();
}

function calculate_totals() {
	const item_rows = document.querySelectorAll(".calculator .row:not(.total)");

	let ctown = 0;
	let keyfoods = 0;
	let fairway = 0;
	let gristedes = 0;

	item_rows.forEach(function (row) {
		const qty_field = row.querySelector("input");
		let qty = qty_field.value;

		qty = parseFloat(qty);

		const shops = row.querySelectorAll(".ctown, .keyfoods, .fairway, .gristedes");
		shops.forEach(function (shop) {
			//this shop's price
			let price = shop.dataset.price;
			price = parseFloat(price);
			const total = qty * price;
			if (shop.classList.contains("ctown")) {
				ctown = ctown + total;
			}
			if (shop.classList.contains("keyfoods")) {
				keyfoods = keyfoods + total;
			}
			if (shop.classList.contains("fairway")) {
				fairway = fairway + total;
			}
			if (shop.classList.contains("gristedes")) {
				gristedes = gristedes + total;
			}
		});
	});

	const total_row = document.querySelector(".row.total");

	total_row.classList.add("active");

	total_row.querySelector(".ctown span").innerHTML = round_number(ctown);
	total_row.querySelector(".keyfoods span").innerHTML = round_number(keyfoods);
	total_row.querySelector(".fairway span").innerHTML = round_number(fairway);
	total_row.querySelector(".gristedes span").innerHTML = round_number(gristedes);

	let cheapest = false;

	if (ctown < keyfoods && ctown < fairway && ctown < gristedes) {
		cheapest = "ctown";
	}
	if (keyfoods < ctown && keyfoods < fairway && keyfoods < gristedes) {
		cheapest = "keyfoods";
	}
	if (fairway < ctown && fairway < keyfoods && fairway < gristedes) {
		cheapest = "fairway";
	}
	if (gristedes < ctown && gristedes < keyfoods && gristedes < fairway) {
		cheapest = "gristedes";
	}

	const cheapest_item = total_row.querySelector(".cheapest");

	if (cheapest_item) {
		cheapest_item.classList.remove("cheapest");
	}

	if (cheapest !== false) {
		total_row.querySelector(`.${cheapest}`).classList.add("cheapest")
	}

}

function round_number(num) {
	//first, move the decimal two places
	num = num * 100;

	//then, round the number to the nearest integer
	num = Math.round(num);

	//then move the decimal back two places
	num = num / 100;

	// handle trailing zeroes
	num = num.toFixed(2);

	return num;
}