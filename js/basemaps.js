export var base = {
	Empty: L.tileLayer(""),
	OpenStreetMap: L.tileLayer(
		"http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
		{
			attribution: "Map data &copy; OpenStreetMap contributors"
		}
	)
};

export var map = L.map("map", {
	center: [46.7201676557, 2.13],
	zoom: 5.5,
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
