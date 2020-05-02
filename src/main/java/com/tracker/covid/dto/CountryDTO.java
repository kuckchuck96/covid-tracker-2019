package com.tracker.covid.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CountryDTO {

	@JsonProperty("Country")
	private String country = "";

	@JsonProperty("NewConfirmed")
	private long newConfirmed = 0;

	@JsonProperty("TotalConfirmed")
	private long totalConfirmed = 0;

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public long getNewConfirmed() {
		return newConfirmed;
	}

	public void setNewConfirmed(long newConfirmed) {
		this.newConfirmed = newConfirmed;
	}

	public long getTotalConfirmed() {
		return totalConfirmed;
	}

	public void setTotalConfirmed(long totalConfirmed) {
		this.totalConfirmed = totalConfirmed;
	}

	@Override
	public String toString() {
		return "CountryDTO [country=" + country + ", newConfirmed=" + newConfirmed + ", totalConfirmed="
				+ totalConfirmed + "]";
	}

}
