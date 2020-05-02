package com.tracker.covid.controller;

import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tracker.covid.dto.CountryCasesDTO;
import com.tracker.covid.dto.CountryDTO;
import com.tracker.covid.dto.SummaryDTO;

@RestController
@RequestMapping("/api")
public class CovidPostmanApiController {

	Logger apiLogger = LoggerFactory.getLogger(this.getClass());

	@GetMapping("/allcountries")
	public String getAllCountries() {
		String allCountriesUrl = "https://api.covid19api.com/countries";
		apiLogger.info("Requested API country statistics url => " + allCountriesUrl);
		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<String> response = restTemplate.getForEntity(allCountriesUrl, String.class);
		return response.getBody();
	}

	@GetMapping("/bycountry/{slug}")
	public String getByCountry(@PathVariable String slug) {
		String maxCaseJson = "";
		String byCountry = "https://api.covid19api.com/total/country/" + slug;
		apiLogger.info("Request API country statistics url => " + byCountry);
		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<String> response = restTemplate.getForEntity(byCountry, String.class);
		String json = response.getBody();
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			List<CountryCasesDTO> casesList = Arrays.asList(objectMapper.readValue(json, CountryCasesDTO[].class));
			CountryCasesDTO maxCaseByDate = Collections.max(casesList, Comparator.comparing(c -> c.getDate()));
			maxCaseJson = objectMapper.writeValueAsString(maxCaseByDate);
		} catch (Exception ex) {
			apiLogger.error(ex.getMessage());
		}
		return maxCaseJson;
	}

	@GetMapping("/forworld")
	public String getWorldStatistics() {
		String forWord = "https://api.covid19api.com/world/total";
		apiLogger.info("Request API world statistics url => " + forWord);
		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<String> response = restTemplate.getForEntity(forWord, String.class);
		return response.getBody();
	}

	@GetMapping("/unaffected")
	public String getUnaffectedCountries() {
		String unaffectedJson = "";
		String allSummary = "https://api.covid19api.com/summary";
		apiLogger.info("Request API world summary url => " + allSummary);
		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<SummaryDTO> responseEntity = restTemplate.getForEntity(allSummary, SummaryDTO.class);
		List<CountryDTO> unaffectedCountriesList = responseEntity.getBody().getCountries().stream()
				.filter(dto -> dto.getNewConfirmed() + dto.getTotalConfirmed() <= 0).collect(Collectors.toList());
		// unaffectedCountriesList.forEach(System.out::println);
		try {
			unaffectedJson = new ObjectMapper().writeValueAsString(unaffectedCountriesList);
		} catch (Exception ex) {
			apiLogger.error(ex.getMessage());
		}
		return unaffectedJson;
	}

}
