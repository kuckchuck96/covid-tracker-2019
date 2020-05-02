var search = new Vue(
		{
			el : "#app",
			data : {
				country : "",
				showCountries : false,
				countries : [],
				worldcases: 0,
				confirmed: 0,
				active: 0,
				recovered: 0,
				deaths: 0,
				showOtherDetail: "",
				toggleCards: false,
				safeCountriesCount: 0
			},
			methods : {
				getCountries : function() {
					fetch("/api/allcountries", {
						method: "GET"
					})
					.then((response) => {
						return response.json();
					})
					.then((data) => {
						this.countries = data;
					})
					.catch((err) => {
						alert("Countries fetch error :-S", err);
					});
				},
				checkForInputBlank : function() {
					var countryName = document.getElementById("countryname").value;
					this.showCountries = countryName.trim().length > 0;
				},
				drawDoughnutChart: function(casesData, entityName) {
					// Doughnut chart.
					document.querySelector("#renderchart").innerHTML = "<canvas id=\"covidchart\"></canvas>";
					var ctx = document.querySelector("#covidchart").getContext("2d");
					var doughnutChart = new Chart(ctx, {
						type: "doughnut",
						data: {
							labels: ["Active", "Recovered", "Deaths"],
							datasets: [{
								label: "Visuals of COVID-19 cases",
								backgroundColor: ["#707B7C", "2E4053", "#273746"],
								data: casesData
							}]
						},
						options: {
					        title: {
					            display: true,
					            text: "Visuals of COVID-19 cases in " + entityName,
					            fontSize: 15
					        }
					    }
					});
				},
				loadWorldStats: function() {
					/*fetch("/api/forworld", {
						method: "GET"
					})
					.then((response) => {
						document.querySelector("#loadingdata").style.visibility = "hidden";
						document.querySelector("#statsdata").style.visibility = "visible";
						return response.json();
					})
					.then((data) => {
						var casesData = undefined;
						var date  = new Date();
						var today = date.getDate() - 1;
						var month = date.getMonth() + 1;
						var year = date.getFullYear();
						var yesterday = today + "/" + (month < 10 ? `0${month}` : month) + "/" + year;
						this.country = "World";
						this.confirmed = data.TotalConfirmed;
						this.active = Number(data.TotalConfirmed) - (Number(data.TotalRecovered) + Number(data.TotalDeaths));
						this.recovered = data.TotalRecovered;
						this.deaths = data.TotalDeaths;
						document.querySelector("#entitydesc").innerText = `Coronavirus (COVID-19) cases in World as of ${yesterday}.`;
						// For global value.
						this.worldcases = Number(data.TotalConfirmed);
						// Draw chart.
						casesData = [this.active, this.recovered, this.deaths];
						this.drawDoughnutChart(casesData, "total");
						this.toggleCards = false;
						this.showOtherDetail = "";
					})
					.catch((err) => {
						alert("Error while fetching world stats :-S", err);
					});*/
					
					// Promise solution.
					Promise.all([
						fetch("/api/forworld").then(response => response.json()),
						fetch("/api/unaffected").then(response => response.json())
					])
					.then(res => {
						document.querySelector("#loadingdata").style.visibility = "hidden";
						document.querySelector("#statsdata").style.visibility = "visible";
						
						var data = res[0];
						var unaffectedCountries = res[1];
						var cArr = [];
						// For rendering world summary
						var casesData = undefined;
						var date  = new Date();
						var today = date.getDate();
						var month = date.getMonth() + 1;
						var year = date.getFullYear();
						var yesterday = (today < 10 ? `0${today}` : today) + "/" + (month < 10 ? `0${month}` : month) + "/" + year;
						this.country = "World";
						this.confirmed = data.TotalConfirmed;
						this.active = Number(data.TotalConfirmed) - (Number(data.TotalRecovered) + Number(data.TotalDeaths));
						this.recovered = data.TotalRecovered;
						this.deaths = data.TotalDeaths;
						document.querySelector("#entitydesc").innerText = `Coronavirus (COVID-19) cases in World as of ${yesterday}.`;
						// For global value.
						this.worldcases = Number(data.TotalConfirmed);
						// Draw chart.
						casesData = [this.active, this.recovered, this.deaths];
						this.drawDoughnutChart(casesData, "total");
						this.toggleCards = false;
						// Show unaffected countries.
						unaffectedCountries.forEach(c => {
							// cArr.push(c.Country);
							cArr.push(`<span class="badge badge-secondary">${c.Country}</span>`);
						});
						this.safeCountriesCount = cArr.length;
						this.showOtherDetail = cArr.join(" ");
					})
					.catch(err => {
						alert("Error while fetching world stats :-S", err);
					});
				},
				loadCountryStats: function(slug) {
					// Get statistics by country.
					fetch("/api/bycountry/" + slug, {
						method: "GET"
					})
					.then((response) => {
						document.querySelector("#loadingdata").style.visibility = "hidden";
						document.querySelector("#statsdata").style.visibility = "visible";
						return response.json();
					})
					.then((data) => {
						var percentCasesPerCountry = null;
						var casesData = null;
						this.country = data.Country;
						this.confirmed = data.Confirmed;
						this.active = Number(data.Confirmed) - (Number(data.Recovered) + Number(data.Deaths));
						this.recovered = data.Recovered;
						this.deaths = data.Deaths;
						document.querySelector("#entitydesc").innerText = `Coronavirus (COVID-19) cases in ${data.Country} as of ${data.Date}.`;
						// Draw chart.
						casesData = [this.active, this.recovered, this.deaths];
						this.drawDoughnutChart(casesData, data.Country);
						percentCasesPerCountry = (Number(data.Confirmed) / this.worldcases) * 100;
						this.toggleCards = true;
						this.showOtherDetail = `<b>${data.Country}</b>&nbsp;is having approximately&nbsp;<b>${percentCasesPerCountry.toFixed(1)}%</b>&nbsp;of Coronavirus (COVID-19) cases in the world.`;
					})
					.catch((err) => {
						alert("Error while fetching country stats :-S", err);
					});
				},
				loadSpecificStats : function() {
					// Set loaders and data divisions to original state.
					document.querySelector("#loadingdata").style.visibility = "visible";
					document.querySelector("#statsdata").style.visibility = "hidden";
					var name = document.querySelector("#countryname").value.trim();
					if (name === "" || name.toLowerCase() === "world") {
						this.loadWorldStats();
					} else {
						var slug = this.countries.filter(c => {
							return c.Country == name.split("(")[0].trim();
						}).pop().Slug;
						this.loadCountryStats(slug);
					}
					// Set search text as blank.
					document.querySelector("#countryname").value = "";
				}
			},
			created : function() {
				this.loadWorldStats();
				this.getCountries();
			}
		});