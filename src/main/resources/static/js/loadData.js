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
				safeCountriesCount: 0,
				showLoader: true,
				showStatsAfterLoad: false
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
					var data = null;
					
					// Fetch world summary.
					fetch("/api/forworld", {
						method: "GET"
					})
					.then((response) => {
						return response.json();
					})
					.then((val) => {
						data = val;
						// Another fetch.
						return fetch("/api/unaffected",  {
							method: "GET"
						});
					})
					.then(response => {
						this.showLoader = false;
						this.showStatsAfterLoad = true;
						return response.json();
					})
					.then(unaffectedCountries => {
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
						this.showOtherDetail = "";
						// Safe countries.
						var cArr = [];
						this.toggleCards = false;
						// Show unaffected countries.
						unaffectedCountries.forEach(c => {
							cArr.push(`<span class="badge badge-secondary">${c.Country}</span>`);
						});
						this.safeCountriesCount = cArr.length;
						this.showOtherDetail = cArr.join(" ");
					})
					.catch((err) => {
						// alert("Error while fetching world stats :-S", err);
						this.showLoader = this.showStatsAfterLoad = false;
					});	
				},
				loadCountryStats: function(slug) {
					// Get statistics by country.
					fetch("/api/bycountry/" + slug, {
						method: "GET"
					})
					.then((response) => {
						this.showLoader = false;
						this.showStatsAfterLoad = true;
						return response.json();
					})
					.then((data) => {
						var percentCasesPerCountry = null;
						var casesData = null;
						this.country = data.Country;
						
						if (this.country == "") {
							throw 0;
						}
						
						this.confirmed = data.Confirmed;
						this.active = Number(data.Confirmed) - (Number(data.Recovered) + Number(data.Deaths));
						this.recovered = data.Recovered;
						this.deaths = data.Deaths;
						document.querySelector("#entitydesc").innerText = `Coronavirus (COVID-19) cases in ${data.Country} as of ${data.Date}.`;
						// Draw chart.
						casesData = [this.active, this.recovered, this.deaths];
						this.drawDoughnutChart(casesData, data.Country);
						percentCasesPerCountry = ((Number(data.Confirmed) / this.worldcases) * 100).toFixed(2);
						// console.log(percentCasesPerCountry.toFixed(2) == 0);
						this.toggleCards = true;
						// this.showOtherDetail = `<b>${data.Country}</b>&nbsp;is having &nbsp;<b>${percentCasesPerCountry.toFixed(2)}%</b>&nbsp;of Coronavirus (COVID-19) cases in the world.`;
						this.showOtherDetail = "<b>" + data.Country + "</b>&nbsp";
						if (percentCasesPerCountry == 0) {
							this.showOtherDetail += "is having <b><1%</b>&nbsp;";
						} else {
							this.showOtherDetail += "is having approximately&nbsp;<b>" + percentCasesPerCountry + "%</b>&nbsp";
						}
						this.showOtherDetail += "of Coronavirus (COVID-19) cases in the world.";
					})
					.catch((err) => {
						if (err == false) {
							alert("Sorry :( data for this country isn't available.");
						} 
						this.showLoader = this.showStatsAfterLoad = false;
					});
				},
				loadSpecificStats : function() {
					// Set loaders and data divisions to original state.
					this.showLoader = true;
					this.showStatsAfterLoad = false;
					
					var name = document.querySelector("#countryname").value.trim();
					if (name === "" || name.toLowerCase() === "world") {
						this.loadWorldStats();
					} else {
						try {
							var slug = this.countries.filter(c => {
								return c.Country == name.trim();
							}).pop().Slug;
							this.loadCountryStats(slug);
						} catch (e) {
							alert("Please search and select valid country."); 
							this.loadWorldStats();
						}
					}
					// Set search text as blank.
					document.querySelector("#countryname").value = "";
				},
				detectMobileBrowser : function() {
					var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
					var githubIssueBtn = document.querySelector(".github-button");
					if (isMobile) {
						githubIssueBtn.setAttribute("data-show-count", "false");
					} else {
						githubIssueBtn.setAttribute("data-show-count", "true");
					}
				}
			},
			created : function() {
				this.loadWorldStats();
				this.getCountries();
				this.detectMobileBrowser();
			}
		});