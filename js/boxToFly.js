export default function boxTofly(box, nom) {
	return box.flyTo(
		nom === "Île-de-France"
			? new L.LatLng(48.6485, 2.5755)
			: "" || nom === "Bourgogne-Franche-Comté"
			? new L.LatLng(47.280513, 4.999437)
			: "" || nom === "Auvergne-Rhône-Alpes"
			? new L.LatLng(45.56342, 4.834277)
			: "" || nom === "Hauts-de-France"
			? new L.LatLng(50.0925, 3.037256)
			: "" || nom === "Grand Est"
			? new L.LatLng(48.9575, 6.365)
			: "" || nom === "Nouvelle-Aquitaine"
			? new L.LatLng(45, 1.2625)
			: "" || nom === "Occitanie"
			? new L.LatLng(43.704, 2.44305)
			: "" || nom === "Provence-Alpes-Côte d'Azur"
			? new L.LatLng(43.99471817979828, 7.007371525764465)
			: "" || nom === "Normandie"
			? new L.LatLng(48.87987, 0.171253)
			: "" || nom === "Pays de la Loire"
			? new L.LatLng(47.7632836, -0.3299687)
			: "" || nom === "Corse"
			? new L.LatLng(41.91, 8.73)
			: "" || nom === "Bretagne"
			? new L.LatLng(48.202, -2.9326)
			: "",
		nom === "Île-de-France" ? 8.5 : 7
	);
}
