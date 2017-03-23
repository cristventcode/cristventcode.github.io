$(document).ready(function () {
    var locationUrl = "http://freegeoip.net/json/",
        currentTemp = document.getElementById("current-temp"),
        condImage = document.getElementById("cond-image"),
        condDesc = document.getElementById("cond-desc"),
        cityState = document.getElementById("city-state");

    $.getJSON(locationUrl, function (response) {
        getTemp(response.region_code, response.city);
    })

    var getTemp = function getTemp(stateCode, city) {
        var weatherUrl = "http://api.wunderground.com/api/4474e9a4fe0c0025/conditions/q/" + stateCode + "/" + city + ".json"

        $.getJSON(weatherUrl, function (response) {
            console.log(response.current_observation);
            currentTemp.innerText = Math.ceil(response.current_observation.temp_f) + " F";
            cityState.innerText = city + ", " + stateCode;
            condDesc.innerText = response.current_observation.weather;
            condImage.src = response.current_observation.icon_url;
        })
    }
});