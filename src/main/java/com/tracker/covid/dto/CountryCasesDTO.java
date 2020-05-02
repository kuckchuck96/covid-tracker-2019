package com.tracker.covid.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.tracker.covid.component.JsonDateSerializer;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CountryCasesDTO {

	@JsonProperty("Country")
	private String country = "";
	
	@JsonProperty("Confirmed")
	private String confirmed = "";
	
	@JsonProperty("Deaths")
	private String deaths = "";
	
	@JsonProperty("Recovered")
	private String recovered = "";
	
	@JsonProperty("Date")
	private Date date = null;

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getConfirmed() {
		return confirmed;
	}

	public void setConfirmed(String confirmed) {
		this.confirmed = confirmed;
	}

	public String getDeaths() {
		return deaths;
	}

	public void setDeaths(String deaths) {
		this.deaths = deaths;
	}

	public String getRecovered() {
		return recovered;
	}

	public void setRecovered(String recovered) {
		this.recovered = recovered;
	}

	@JsonSerialize(using = JsonDateSerializer.class)
	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	@Override
	public String toString() {
		return "CountryCasesDTO [country=" + country + ", confirmed=" + confirmed + ", deaths=" + deaths
				+ ", recovered=" + recovered + ", date=" + date + "]";
	}

}
