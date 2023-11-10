import { map } from "./basemaps.js";
import boxToFly from "./boxToFly.js";

const urlMap = "./regions.geojson",
	urlDepartments = "./departements.geojson";

const searchDatas = document.querySelector("#search"),
	searhcShopsVal = document.querySelector(".search-shops-val"),
	submitBtn = document.querySelector("#submit");

let shopMax = [],
	dataItems = [],
	deptsData = [],
	users = [],
	datasShopCode = [],
	newData = [],
	layerActived = false;

//Fetch initialMap
const fetchInitialMap = () => {
	fetch(urlMap)
		.then((res) => {
			res
				.json()
				.then((res) => {
					//My users array = now to my object of all users
					users = res;

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

					showShops(allDatas);
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

$.when(counties).done(function (doto) {
	function zoomToFeature(e) {
		map.fitBounds(e.target.getBounds(209));
	}

	function showData(layers) {
		dataItems.filter((data) => {
			var { shop, shopCode, adress, horaires, telephone, url, qualification } = data;
			const shopCodeShort = shopCode;
			let newShop = shopCodeShort.toString();
			newShop = newShop.substring(0, 2);
			return data.shop === layers.feature.properties.shop
				? $(".grid-content .info-panel .marker-rich-infos").html(
						` 
							<div class="map-item">
								<a href="${url}" class="title" target="_blank">${shop}(${newShop})</a><br/>
								<i class="qualification">${qualification}</i>
								<p class="description">Adresse : ${adress}</p>
								<p class="description" style="${horaires === undefined ? "display: none;" : ""}">Horaires : ${horaires}</p>
								<p class="description" style="${telephone === undefined ? "display: none;" : ""}">Téléphone : ${telephone}</p>
								<a href="${url}" target="_blank" class="see-shop">Voir le site web <i class="fa-solid fa-chevron-right"></i></a>
					  		</div>
				  			`
				  )
				: "";
		});
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

		showData(layers);

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
			dataItems.forEach((data, index) => {
				var { nom, shop, shopCode, adress, horaires, telephone, url, qualification } = data;
				const shopCodeShort = shopCode;
				let newShop = shopCodeShort.toString();
				newShop = newShop.substring(0, 2);
				if (nom === layers.feature.properties.nom) {
					outputsData += `
						<div class="map-item">
							<a href="${url}" class="title" target="_blank">${shop}(${newShop})</a><br/>
							<i class="qualification">${qualification}</i>
							<p class="description">Adresse : ${adress}</p>
							<p class="description" style="${horaires === undefined ? "display: none;" : ""}">Horaires : ${horaires}</p>
							<p class="description" style="${telephone === undefined ? "display: none;" : ""}">Téléphone : ${telephone}</p>
							<a href="${url}" target="_blank" class="see-shop">Voir le site web <i class="fa-solid fa-chevron-right"></i></a>
					  	</div>
					  `;

					return $(".grid-content .info-panel .marker-rich-infos").html(
						outputsData
					);
				}
			});
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
				const { shop, shopCode, adress, url, nom, region } = feature.properties;
				var popupContent = `<h3>${shop}</h3>`;

				if (
					feature.geometry.type &&
					feature.properties.region === e.target.feature.properties.nom
				) {
					popupContent += feature.properties.popupContent;
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
			}
			L.geoJSON(countiesDepartments.responseJSON, {
				filter: function (feature, layer) {
					var output = "";
					if (
						feature.geometry.type === "Point" &&
						feature.properties.region === e.target.feature.properties.nom
					) {
						dataItems.push(feature.properties);

						dataItems.map(function (data) {
							dataItems.sort((a, b) => {
								return a.shopCode - b.shopCode;
							});
							return data;
						});

						dataItems.forEach((items) => {
							const { shop, shopCode, adress, horaires, telephone, url, qualification } = items;

							const shopCodeShort = shopCode;
							let newShop = shopCodeShort.toString();
							newShop = newShop.substring(0, 2);

							output += `
								<div class="map-item">
									<a href="${url}" class="title" target="_blank">${shop}(${newShop})</a><br/>
									<i class="qualification">${qualification}</i>
									<p class="description">Adresse : ${adress}</p>
									<p class="description" style="${horaires === undefined ? "display: none;" : ""}">Horaires : ${horaires}</p>
									<p class="description" style="${telephone === undefined ? "display: none;" : ""}">Téléphone : ${telephone}</p>
									<a href="${url}" target="_blank" class="see-shop">Voir le site web <i class="fa-solid fa-chevron-right"></i></a>
					 			</div>`;
							$(".grid-content .info-panel .marker-rich-infos").html(output);
						});
					}
					if (
						feature.geometry &&
						feature.properties.region === e.target.feature.properties.nom
					) {
						// If the property "underConstruction" exists and is true, return false (don't render features under construction)
						var output = "";
						newData.push(feature.geometry.type);

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
				nom !== "Centre-Val de Loire"
					? boxToFly(box, nom)
					: box.flyTo([47.670163564137, 2.1284487900515], 8)
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

		shopMax.sort((a, b) => {
			return a.shopCode - b.shopCode;
		});

		layer.on({
			click: openLayer
		});

		if (feature.geometry.type === "Point") {
			layer.off("click");
		} else {
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
});

// ShowShops
const showShops = (arr) => {
	let output = "";

	arr.map((datas) => {
		const { shop, shopCode, adress,horaires, telephone, url, qualification } = datas;

		const shopCodeShort = shopCode;
		let newShop = shopCodeShort.toString();
		newShop = newShop.substring(0, 2);
		output += `
			<div class="map-item">
			    <a href="${url}" class="title target="_blank">${shop}(${newShop})</a><br/>
				<i class="qualification">${qualification}</i>
				<p class="description">Adresse : ${adress}</p>
				<p class="description" style="${horaires === undefined ? "display: none;" : ""}">Horaires : ${horaires}</p>
				<p class="description" style="${telephone === undefined ? "display: none;" : ""}">Téléphone : ${telephone}</p>
				<a href="${url}" target="_blank" class="see-shop">Voir le site web <i class="fa-solid fa-chevron-right"></i> </a>
			</div>
		`;
	});
	$(".grid-content .info-panel .context").html(
		`<h4 class="title-shop">Points de distributions<br/> Super Retro Game magazine</h4> <div class="shop-values"><b>France</b> <span>(${
			arr.length <= 1
				? `${arr.length} "Distributeur"`
				: `${arr.length} "Distributeurs"`
		})</span></div>`
	);
	$(".grid-content .info-panel .marker-rich-infos").html(output);
};

document.addEventListener("DOMContentLoaded", fetchInitialMap);

// Show UsersData
function showShopsData(value, newShop) {
	value == ""
		? (document.querySelector(".context").innerHTML = null)
		: (document.querySelector(
				".context"
		  ).innerHTML = `Votre recherche <b>"${value}"</b> a retourné ${newShop.length} distributeur(s)`);

	showShops(newShop);
}

// Show Search By Filter
function showSearchByFilter() {
	const value = searchDatas.value;
	const element = value.toLowerCase();

	const newShop = datasShopCode[0].filter((datas) => {
		const newShopCode = datas.shopCode.toString();
		const adress = datas.adress;

		!value.includes(newShopCode)
			? null
			: (document.querySelector("#search-val").innerHTML = value) &&
			  value.includes(newShopCode)
			? (document.querySelector("#search-val").innerHTML = value)
			: (searhcShopsVal.innerHTML = "sorry");
		return (
			datas.shop.toLowerCase().includes(element) ||
			datas.region.toLowerCase().includes(element) ||
			datas.adress.toLowerCase().includes(element) ||
			newShopCode.includes(value)
		);
	});

	showShopsData(value, newShop);

	layerActived === false ? showShopsData(value, newShop) : null;
}
var getRegion = "";
var getShopName = "";
var paths = [];
var allPoints = [];
var setRegions = [];
var nomData = "";

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
	if (searchDatas.value.length <= 0) {
		var paths = document.querySelectorAll("#map path");
		paths.forEach((classes, index) => {
			classes.classList.contains("hide")
				? classes.classList.remove("hide")
				: "";
			classes.classList.contains("activeLayer")
				? classes.classList.remove("activeLayer")
				: "";
		});
	}
	L.geoJSON(counties.responseJSON, {
		onEachFeature: function (feature, layer) {
			if (
				feature.geometry.type === "Point" &&
				feature.properties.shop.includes(searchDatas.value)
			) {
				getRegion = feature.properties.region;
				getShopName = searchDatas.value;
			}
		}
	});
});

// Submit btn filter by click
submitBtn.addEventListener("click", (e) => {
	// Cancel the default action, if needed
	e.preventDefault();
	showSearchByFilter();

	L.geoJSON(counties.responseJSON, {
		pointToPolygon: function (feature, latlng) {
			return new L.Polygon(
				latlng,
				{
					radius: 0,
					opacity: 0,
					className: "region"
				},
				{ draggable: false }
			);
		},
		pointToLayer: function (feature, latlng) {
			return new L.CircleMarker(
				latlng,
				{
					radius: 0,
					opacity: 0,
					className: "circleMarker"
				},
				{ draggable: false }
			);
		},

		onEachFeature: function (feature, layer) {
			if (
				feature.geometry.type === "Point" &&
				searchDatas.value !== "" &&
				feature.properties.shop.includes(searchDatas.value)
			) {
				nomData = feature.properties.region;
				console.log(nomData);
				setRegions.push(feature.properties.region);
				map.eachLayer(function (layer) {
					if (
						layer instanceof L.CircleMarker &&
						!(layer instanceof L.Rectangle)
					) {
						allPoints.push(layer);
						allPoints.forEach((datas, index) => {
							if (datas.feature.properties.shop.includes(getShopName)) {
								datas._path.classList.add("show");
								// console.log(datas._path);
							} else {
								datas._path.classList.add("hide");
								// console.log(datas._path);
							}
						});
					}
				});
			} else if (
				feature.geometry.type === "Polygon" &&
				feature.properties.nom.includes(getRegion)
			) {
				map.eachLayer(function (layer) {
					if (layer instanceof L.Polygon && !(layer instanceof L.Rectangle)) {
						paths.push(layer);
						paths.forEach((datas, index) => {
							if (setRegions.includes(datas.feature.properties.nom)) {
								datas._path.classList.add("activeLayer");
							} else {
								datas._path.classList.remove("activeLayer");
							}
						});
					}
				});
			}
			if (
				feature.geometry.type === "MultiPolygon" &&
				feature.properties.nom.includes(getRegion) &&
				searchDatas.value !== ""
			) {
				console.log("MULTIPOLYGONLAYER", layer);
				map.eachLayer(function (layer) {
					if (
						layer instanceof L.Polygon &&
						!(layer instanceof L.Rectangle) &&
						searchDatas.value !== ""
					) {
						paths.push(layer);
						paths.forEach((datas, index) => {
							if (
								setRegions.includes(datas.feature.properties.nom) &&
								searchDatas.value !== ""
							) {
								datas._path.classList.add("activeLayer");
								console.log(datas._path);
							} else {
								datas._path.classList.remove("activeLayer");
							}
						});
					}
				});
			}
		}
	});
});
