import { map } from "./basemaps.js";

// const urlMap =
// 		"https://raw.githubusercontent.com/GreatwoodSRG/superretro/master/regions.geojson",
// 	urlDepartments =
// 		"https://raw.githubusercontent.com/GreatwoodSRG/superretro/master/departements.geojson";

const urlMap = "./reg.geojson",
	urlDepartments = "./map2.geojson";

const searchDatas = document.querySelector("#search"),
	searchUserVal = document.querySelector(".search-user-val"),
	submitBtn = document.querySelector("#submit");

let shopMax = [],
	dataItems = [],
	deptsData = [],
	users = [],
	datasShopCode = [],
	newData = [],
	selectData = [],
	nums = [],
	names = [],
	data = [],
	outputShops = "",
	layerActived = false,
	countLayer = 0;

//Fetch initialMap
const fetchInitialMap = () => {
	fetch(urlMap)
		.then((res) => {
			res
				.json()
				.then((res) => {
					//My users array = now to my object of all users
					users = res;
					//Sort alphabetically
					// users.sort((a,b) => a.login.localeCompare(b.login));
					//Show all user inside my function showUsers

					const filterPointValues = users.features.filter((datas) => {
						return datas.geometry.type === "Point";
					});

					const Dataproperties = filterPointValues.map((datas) => {
						return datas.properties;
					});

					datasShopCode.push(Dataproperties);

					const allDatas = datasShopCode[0].sort((a, b) => {
						return a.shopCode - b.shopCode;
					});

					showUsers(allDatas);
				})
				.catch((err) => console.log(err));
		})
		.catch((err) => console.log(err));
};

//Show initial map
var counties = $.ajax({
	url: urlMap,
	dataType: "json",
	success: console.log("County data successfully loaded."),
	error: function (xhr) {
		alert(xhr.statusText);
	}
});

$.when(counties).done(function () {
	function zoomToFeature(e) {
		map.fitBounds(e.target.getBounds(209));
	}

	function openLayer(e) {
		layerActived = true;
		var layers = e.target;

		var output = "";
		var outputsData = "";
		$(".controls").css({
			opacity: 1
		});

		$(".controls").click(() => {
			return onEachFeature();
		});

		// Return 1 specific data onclick marker
		dataItems.filter((data, index) => {
			const shopCodeShort = data.shopCode;
			let newShop = shopCodeShort.toString();
			newShop = newShop.substring(0, 2);
			return data.shop === layers.feature.properties.shop
				? $(".grid-content .info-panel .marker-rich-infos")
						.html(` <div class="map-item">
							<a href="${data.url}" class="title" target="_blank">${data.shop} (${newShop})</a><br/>
							<i class="qualification">${data.qualification}</i>
							<p class="adress">${data.adress}</p>
							<a href="${data.url}" target="_blank" class="see-shop">Page infos <i class="fa-solid fa-chevron-right fa-size"></i></a>
					 <i class="fa-solid fa-chevron-"></i>	  </div>
				  `)
				: "";
		});

		if (
			layers.feature.geometry.type === "Polygon" ||
			layers.feature.geometry.type === "MultiPolygon" ||
			layers.feature.geometry.type === "Point"
		) {
			dataItems.filter((datas) => {
				return datas.nom === layers.feature.properties.nom;
			});
			output = dataItems.map((el) => {
				return el.nom === layers.feature.properties.nom
					? layers.feature.properties
					: "";
			});
		}
		const newDistributeursLength = output.filter((data) => {
			return data !== "";
		});

		$(".grid-content .info-panel .context").html(
			`<h4>${layers.feature.properties.nom} (${newDistributeursLength.length} Distributeur(s))</h4>`
		);


		if (
			layers.feature.geometry.type === "Polygon" ||
			layers.feature.geometry.type === "MultiPolygon"
		) {

		//Return datas by layer name
		dataItems.forEach((data,index) => {
			var {nom, shop, shopCode, adress, url, qualification} = data;
			const shopCodeShort = shopCode;
			let newShop = shopCodeShort.toString();
			newShop = newShop.substring(0, 2)
			if(nom === layers.feature.properties.nom) {
				outputsData += `
						<div class="map-item">
						<a href="${url}" class="title" target="_blank">${shop}(${newShop})</a><br/>
						<i class="qualification">${qualification}</i>
						<p class="adress">${adress}</p>
						<a href="${url}" target="_blank" class="see-shop"> Page infos <i class="fa-solid fa-chevron-right fa-size"></i></a>
					  </div>
					  `;

				return $(".grid-content .info-panel .marker-rich-infos").html(
					outputsData
				);
			}
		})
		}

		map.removeLayer(kyCounties);
		$("#box").css({
			zIndex: 2000
		});

		// Counties with all departments
		var countiesDepartments = $.ajax({
			url: urlDepartments,
			dataType: "json",
			success: console.log("County Regions data successfully loaded."),
			error: function (xhr) {
				alert(xhr.statusText);
			}
		});

		$.when(countiesDepartments).done(function () {
			var base = {
				Empty: L.tileLayer(""),
				OpenStreetMap: L.tileLayer(
					"http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
					{
						attribution: "Map data &copy; OpenStreetMap contributors"
					}
				)
			};

			const { nom } = e.target.feature.properties;

			var box = L.map("box", {
				center: [47.91166975698412, 2.48291015625],
				zoom: 7,
				maxZoom: 92,
				scrollWheelZoom: false,
				doubleClickZoom: false,
				tap: false,
				dragging: false,
				touchZoom: false,
				boxZoom: false,
				grab: false,
				keyboard: false,
				layers: [base.Empty]
			});

			function onEachFeature(feature, layer) {
				const coords = [];
				const { shop, shopCode, adress, url, nom, region } = feature.properties;
				var popupContent = `<h3>${shop}</h3>`;

				if (
					feature.geometry.type &&
					feature.properties.region === e.target.feature.properties.nom
				) {
					popupContent += feature.properties.popupContent;
					//  coords.push(feature.geometry.coordinates)
					//   L.Polygon(coords).addTo(box),
					// layer.bindPopup('<pre>'+JSON.stringify(feature.properties,null,' ').replace(/[\{\}"]/g,'')+'</pre>')
				} else {
					console.log("sorry");
				}
				layer.on({
					click: openLayer,
					zoomToFeature: zoomToFeature
				});

				if (
					feature.geometry.type === "Polygon" ||
					feature.geometry.type === "MultiPolygon" ||
					feature.geometry.type === "Point"
				) {
					layer.on("mouseover", function (e) {
						feature.properties.isActived === 1
							? layer.setStyle({
									fillColor: "#003455"
							  })
							: "";
					});

					layer.on("click", function () {
						box.fitBounds(e.target.getBounds(49));
					});

					layer.on("mouseout", function (e) {
						feature.properties.isActived === 1
							? layer.setStyle({
									fillColor: "#ffc023"
							  })
							: "";
					});
				}
				if (feature.geometry.type === "Point") {
					deptsData.push(feature.properties);

					layer.bindPopup(`<h3>${shop}</h3>`, {
						closeButton: false,
						offset: L.point(0, -5)
					});
					layer.on("mouseover", function (e) {
						layer.openPopup();
					});
					layer.on("mouseout", function () {
						layer.closePopup();
					});
				} else {
					feature.properties.isActived === 1
						? layer.setStyle({
								fillColor: "#ffc023"
						  })
						: "";
					feature.properties.isActived === 1
						? layer.on("click")
						: layer.off("click");
				}
				//   if (feature.geometry.type === "Polygon" || feature.geometry.type === "MultiPolygon") {
				//     layer.bindPopup(`<h3>${nom}</h3>`, { closeButton: false, offset: L.point(0, -5) });
				//  }
			}
			var departments = L.geoJSON(countiesDepartments.responseJSON, {
				filter: function (feature, layer) {
					var output = "";
					if (
						feature.geometry.type === "Point" &&
						feature.properties.region === e.target.feature.properties.nom
					) {
						dataItems.push(feature.properties);

						function removeDuplicates(arr) {
							return arr.filter((item, index) => arr.indexOf(item) === index);
						}
						removeDuplicates(dataItems)


						dataItems.map(function (data) {
							dataItems.sort((a, b) => {
								return a.shopCode - b.shopCode;
							});
							return data;
						});

						dataItems.forEach((items) => {
							const { shop, shopCode, adress, url, qualification } = items;

							const shopCodeShort = shopCode;
							let newShop = shopCodeShort.toString();
							newShop = newShop.substring(0, 2);

							output += `
								<div class="map-item">
								<a href="${url}" class="title target="_blank">${shop} (${newShop})</a><br/>
								<i class="qualification">${qualification}</i>
								<p class="adress">${adress}</p>
								<a href="${url}" target="_blank" class="see-shop">Page infos<i class="fa-solid fa-chevron-right fa-size"></i></a>
					 			</div>`;
							$(".grid-content .info-panel .marker-rich-infos").html(output);
						});

					}
					if (
						feature.geometry &&
						feature.properties.region === e.target.feature.properties.nom
					) {
						// If the property "underConstruction" exists and is true, return false (don't render features under construction)
						const num = 0;
						var output = "";
						newData.push(feature.geometry.type);
						// console.log(newData)
						dataItems.push(feature.properties.region);

						newData.filter((datas) => {
							if (
								datas === "Polygon" ||
								datas === "Point" ||
								datas === "MultiPolygon"
							) {
								newData.pop();
								dataItems.pop();
								$(".grid-content .info-panel .context").html(
									`<h4>${feature.properties.region} (${
										feature.geometry.type === "Point"
											? `${dataItems.length} Distributeur(s)`
											: `${dataItems.length} Distributeur`
									})</h4>`
								);
							} else {
								return "";
							}
						});

						return feature.properties.underConstruction !== undefined
							? !feature.properties.underConstruction
							: true;
					} else {
						return null;
					}
				},
				style: style,
				click: zoomToFeature,
				onEachFeature: onEachFeature
			}).addTo(
				box.flyTo(
					nom === "Île-de-France"
						? new L.LatLng(48.6485, 2.5755)
						: "" || nom === "Centre-Val de Loire"
						? L.LatLng(48.0497, 2.1018)
						: "" || nom === "Bourgogne-Franche-Comté"
						? new L.LatLng(47.280513, 4.999437)
						: "" || nom === "Auvergne-Rhône-Alpes"
						? new L.LatLng(45.56342, 4.834277)
						: "" || nom === "Hauts-de-France"
						? new L.LatLng(50.0925, 3.037256)
						: "" || nom === "Grand Est"
						? new L.LatLng(48.9575, 6.365)
						: "" || nom === "Nouvelle-Aquitaine"
						? new L.LatLng(45.8353, 1.2625)
						: "" || nom === "Occitanie"
						? new L.LatLng(43.704, 2.44305)
						: "" || nom === "Provence-Alpes-Côte d'Azur" || nom === "Normandie"
						? new L.LatLng(43.99471817979828, 7.007371525764465)
						: ""
						? new L.LatLng(43.8408, 6.27178)
						: "" || nom === "Pays de la Loire"
						? new L.LatLng(47.7632836, -0.3299687)
						: "" || nom === "Bretagne"
						? new L.LatLng(48.202, -2.9326)
						: "" || nom === "Bretagne"
						? new L.LatLng(48.202, -2.9326)
						: "",
					nom === "Île-de-France" ? 8.5 : 7.5
				)
			);
		});
	}

	function style(feature) {
		return {
			fillColor: feature.properties.isActived === 1 ? "#ffc023" : "#f9dd81",
			weight: 3,
			color: "#fff",
			dashArray: "2",
			fillOpacity: 1,
			strokeOpacity: 1
		};
	}

	function onEachFeature(feature, layer) {
		const shopName = $("#shop_name");
		const { shop, shopCode, adress, url, nom, region, shops } =
			feature.properties;

		data.push(feature.geometry.type);

		data.filter((datas) => {
			if (
				datas === "Polygon" ||
				datas === "Point" ||
				datas === "MultiPolygon"
			) {
				feature.properties.url ? shopMax.push(feature.properties) : shopMax;

				data.pop();
			}
		});

		shopMax.sort((a, b) => {
			return a.shopCode - b.shopCode;
		});

		var popupContent = `<h3>${nom}</h3>`;

		if (shopCode && shop) {
			data.push(shop);
			const shopLength = data.length;

			outputShops += `<option value="${url}">Greatwood ${shop}</option>
        `;
			$("#shop_name").html(outputShops);
		}
		if (feature.properties && feature.properties.popupContent) {
			popupContent += feature.properties.popupContent;
		}
		layer.on({
			click: openLayer
		});

		if (feature.geometry.type === "Point") {
			const nameData = [
				"Île-de-France",
				"Bourgogne-Franche-Comté",
				"Hauts-de-France"
			];
			// console.log(layer);
			for (var i = 0; i <= nameData.length; i++) {
				feature.properties.region.includes(nameData[i])
					? names.push(feature.properties.region)
					: "";
			}
			layer.off("click");
		} else {
			feature.properties.isActived === 1
				? console.log(feature.properties.nom)
				: "";
			feature.properties.isActived === 1
				? layer.bindPopup(
						`<div class="pink-color"><h3>${nom}</h3><p style="margin-top: -15px; font-size: 1.1em;">${
							shops <= 1 ? `${shops} Distributeur` : `${shops} Distributeurs`
						}</div>`,
						{
							closeButton: false,
							offset: L.point(30, -5)
						}
				  )
				: layer.off("click");
			layer.on("mouseover", function (e) {
				layer.openPopup();
				feature.properties.isActived === 1
					? layer.setStyle({
							fillColor: "#003455"
					  })
					: "";
			});
			layer.on("mouseout", function (e) {
				layer.closePopup();
				feature.properties.isActived === 1
					? layer.setStyle({
							fillColor: "#ffc023"
					  })
					: "";
			});
		}
	}

	var kyCounties = L.geoJSON(counties.responseJSON, {
		filter: function (feature, layer) {
			if (feature.properties) {
				// If the property "underConstruction" exists and is true, return false (don't render features under construction)
				// console.log(feature.properties.shopCode);
				return feature.properties.underConstruction !== undefined
					? !feature.properties.underConstruction
					: true;
			}
			return false;
		},

		style: style,
		pointToLayer: function (feature, latlng) {
			return new L.CircleMarker(
				latlng,
				{
					radius: 4,
					opacity: 0,
					className: "circleMarker"
				},
				{ draggable: false }
			);
		},
		onEachFeature: onEachFeature
	}).addTo(map);
	map.fitBounds(kyCounties.getBounds());
	map.fitBounds(departments.getBounds());
});

// ShowUsers
const showUsers = (arr) => {
	let output = "";

	arr.map((datas) => {
		const { shop, shopCode, adress, url, qualification } = datas;

		const shopCodeShort = shopCode;
		let newShop = shopCodeShort.toString();
		newShop = newShop.substring(0, 2);
		output += `
					<div class="map-item">
						<a href="${url}" class="title target="_blank">${shop}(${newShop})</a><br/>
						<i class="qualification">${qualification}</i>
						<p class="adress">${adress}</p>
						<a href="${url}" target="_blank" class="see-shop">Page infos <i class="fa-solid fa-chevron-right"></i> </a>
					</div>
			        `;
	});
	$(".grid-content .info-panel .context").html(
		`<h4 class="title-shop">Points de distributions<br/> Super Retro Game magazine</h4> <div class="shop-values"><b>France</b> <span>(${
			arr.length <= 1
				? `${arr.length} Distributeur"`
				: `${arr.length} Distributeurs"`
		})</span></div>`
	);
	$(".grid-content .info-panel .marker-rich-infos").html(output);
};

document.addEventListener("DOMContentLoaded", fetchInitialMap);

// Show UsersData
function showUsersData(value, newUser) {
	value == ""
		? (document.querySelector(".context").innerHTML = null)
		: (document.querySelector(
				".context"
		  ).innerHTML = `Votre recherche <b>"${value}"</b> a retourné ${newUser.length} distributeur(s)`);

	showUsers(newUser);
}

// Show Search By Filter
function showSearchByFilter() {
	const value = searchDatas.value;
	const element = value.toLowerCase();

	const newUser = datasShopCode[0].filter((datas) => {
		const newShopCode = datas.shopCode.toString();
		const adress = datas.adress;

		!value.includes(newShopCode)
			? null
			: (document.querySelector("#search-val").innerHTML = value) &&
			  value.includes(newShopCode)
			? (document.querySelector("#search-val").innerHTML = value)
			: (searchUserVal.innerHTML = "sorry");
		return (
			datas.shop.toLowerCase().includes(element) ||
			datas.region.toLowerCase().includes(element) ||
			newShopCode.includes(value)
		);
	});

	showUsersData(value, newUser);

	layerActived === false ? showUsersData(value, newUser) : null;
}

// Submit input text by pressing enter
searchDatas.addEventListener("keypress", (e) => {
	if (e.key === "Enter") {
		// Cancel the default action, if needed
		e.preventDefault();
		showSearchByFilter();
	}
});

// Get filter list by keyup
searchDatas.addEventListener("keyup", (e) => {
	if (e.key !== "") {
		// Cancel the default action, if needed
		e.preventDefault();
		showSearchByFilter();
	}
});

// Submit btn filter by click
submitBtn.addEventListener("click", (e) => {
	// Cancel the default action, if needed
	e.preventDefault();
	showSearchByFilter();
});
