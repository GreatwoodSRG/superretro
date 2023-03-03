

const searchDatas = document.querySelector("#search");
const value = searchDatas.value;
let datasShopCode = [];

export const fetchInitialMap = () => {
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

export const newUser = datasShopCode[0].filter((datas) => {
	const newShopCode = datas.shopCode.toString();

	!value.includes(newShopCode)
		? null
		: (document.querySelector("#search-val").innerHTML = value) &&
		  value.includes(newShopCode)
		? (document.querySelector("#search-val").innerHTML = value)
		: (searchUserVal.innerHTML = "sorry");
	console.log(datas);
	return (
		datas.shop.toLowerCase().includes(element) ||
		datas.region.toLowerCase().includes(element) ||
		newShopCode.includes(value)
	);
});

export function showUsersData() {
	value == ""
		? (document.querySelector(".context").innerHTML = null)
		: (document.querySelector(
				".context"
		  ).innerHTML = `Votre recherche <b>"${value}"</b> a retourné ${newUser.length} distributeur(s)`);
	showUsers(newUser);
}
