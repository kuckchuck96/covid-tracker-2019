package com.tracker.covid.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SummaryDTO {

	@JsonProperty("Countries")
	private List<CountryDTO> countries = null;

	public List<CountryDTO> getCountries() {
		return countries;
	}

	public void setCountries(List<CountryDTO> countries) {
		this.countries = countries;
	}

	@Override
	public String toString() {
		return "SummaryDTO [countries=" + countries + "]";
	}

}
