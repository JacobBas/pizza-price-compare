import { unit_selector } from "./units.js";

/**
 * Calculated the area of a pizza given the diameter
 *
 * @param {Number} diameter the diameter of the pizza
 * @returns {Number} the area of the pizza in squared units
 */
var calc_area = (diameter) => {
  return Math.PI * (diameter / 2) ** 2;
};

/**
 * Calculates the units of pizza per one unit of currency
 *
 * @param {Number} area the area of the pizza in squared units
 * @param {Number} price the price of the pizza
 * @returns {Number} returns the squared units of pizza for one unit of currency
 */
var calc_unit_per_currency = (area, price) => {
  return Math.round((100 * area) / price) / 100;
};

const calculate_button = document.getElementById("calculate-button");

/**
 * calculate the statistics for the given parameters
 */
const calculate_stats = () => {
  let calc_sections = document.querySelectorAll(".price-per-unit-calc");
  calc_sections.forEach((elem) => {
    // extracting out the parameters for the different calculations
    let price = elem.querySelector("input[name='price']");
    let diameter = elem.querySelector("input[name='diameter']");
    let output_value = elem.querySelector("output[name='unit-per-currency']");
    output_value.innerHTML = "";

    // validating that all of the required inputs are filled out
    let missing_inputs = [];
    if (!price.value) {
      missing_inputs.push("price");
    }
    if (!diameter.value) {
      missing_inputs.push("size");
    }
    if (missing_inputs.length !== 0) {
      output_value.appendChild(
        document.createTextNode(
          `Missing the following inputs: ${missing_inputs}`
        )
      );
      return;
    }

    // calculating the unit pizza per unit of currency
    let area = calc_area(diameter.value);
    let unit_per_currency = calc_unit_per_currency(area, price.value);
    output_value.innerHTML = `<span class="calc-result">${unit_per_currency}</span>${unit_selector.value}<sup>2</sup>`;
  });
};

/**
 * aggregates the calculated results into a table that is more easily interpretable
 */
const aggregate_results = () => {
  let calc_sections = document.querySelectorAll(".price-per-unit-calc");

  // initializing the results data structure
  let results = {};
  let best_option = { name: "", value: -Infinity };
  calc_sections.forEach((elem) => {
    let option_name = elem.querySelector(".option-name").innerText;
    let calc_result = Number(
      elem.querySelector("span[class='calc-result']").innerText
    );
    results[option_name] = { result: calc_result, compare: {} };

    // tracking the best option to go with
    if (best_option.value < calc_result) {
      best_option.name = option_name;
      best_option.value = calc_result;
    }
  });

  // calculating the percent changes to get the best options visualization
  Object.keys(results).forEach((i) => {
    Object.keys(results).forEach((j) => {
      results[i].compare[j] =
        Math.round((results[i].result / results[j].result - 1) * 10000) / 100;
    });
  });

  // displaying the resulting data within a table
  let results_message = document.getElementById("results-message");
  results_message.innerHTML = `To get the most pizza for your money ${best_option.name} is the best option! `;

  let results_table = document.getElementById("results-table");
  // deleting all old rows
  while (results_table.rows.length > 1) {
    results_table.deleteRow(1);
  }
  // repopulating the table with the new values
  Object.keys(results[best_option.name].compare).forEach((key) => {
    if (key === best_option.name) {
    } else {
      let row = results_table.insertRow(1);
      let cell1 = row.insertCell(0);
      let cell2 = row.insertCell(1);
      cell1.innerText = key;
      cell2.innerText = `${results[best_option.name].compare[key]}%`;
    }
  });
};

calculate_button.addEventListener("click", (e) => {
  e.preventDefault();
  calculate_stats();
  aggregate_results();
});
