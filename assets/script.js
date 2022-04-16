var todayDate = moment().format('MMMM Do YYYY, h:mma');;
$("#currentDay").text(todayDate);

var search = document.querySelector('#search');
var cityInput = document.querySelector('.cityinput');
var apiKey = "2e80b0fd893a1d1ca602fe3246080159";
var cityName = document.querySelector('.cityName');

var searchHistoryList = [];

function weatherCondition(lat, lon) {
    var queryURL = `http://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=${lat}&lon=${lon}&appid=${apiKey}`;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (cityWeatherResponse) {
        console.log(cityWeatherResponse);
        //create a var that holds UV index value
        var temp = cityWeatherResponse.current.temp;
        var humidity = cityWeatherResponse.current.humidity;
        var wind_speed = cityWeatherResponse.current.wind_speed;
        var uvi = cityWeatherResponse.current.uvi;

        //Create a p element container to display UV Index value
        var pTemp = $('<p/>');
        var pHumidity = $('<p/>');
        var pWind_speed = $('<p/>');
        var pUV = $('<p/>');
        var iconURL = $('<img/>');
        //Display value on container
        pTemp.text(`Temperature: ${temp}`);
        pHumidity.text(`Humidity: ${humidity}`);
        pWind_speed.text(`Wind Speed: ${wind_speed}`);
        pUV.text(`UV Index: ${uvi}`);
        $('.currentWeather').append(pTemp, pHumidity, pWind_speed, pUV)

        var iconCode = cityWeatherResponse.weather[0].icon;
        iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;
    })
}
function futureCondition(lat, lon) {
    var futureURL = `http://api.openweathermap.org/data/2.5/forecast?units=imperial&lat=${lat}&lon=${lon}&appid=${apiKey}`;

    $.ajax({
        url: futureURL,
        method: "GET"
    }).then(function (futureResponse) {
        console.log(futureResponse);
        $('.fiveDay').empty();
        //create a var that holds UV index value
        for (var i = 0; i < 5; i++) {

            var temp = futureResponse.list[i].main.temp;
            var humidity = futureResponse.list[i].main.humidity;
            var wind_speed = futureResponse.list[i].wind.speed;

            //Create a p element container to display UV Index value
            var pTemp = $('<p/>');
            var pHumidity = $('<p/>');
            var pWind_speed = $('<p/>');
            var iconURL = $('<img/>');
            //Display value on container
            pTemp.text(`Temperature: ${temp} `);
            pHumidity.text(`Humidity: ${humidity}`);
            pWind_speed.text(`Wind Speed: ${wind_speed}`);
            $('.fiveDay').append(pTemp, pHumidity, pWind_speed)
        }
        var iconCode = futureResponse.list.weather[0].icon;
        iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;
    })
}
//retrieve latitude and longitude of coordinates for the inputted city
function getLatLon(city) {
    var queryURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=' + apiKey

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (cityWeatherResponse) {
        console.log(cityWeatherResponse);
        var lat = cityWeatherResponse[0].lat;
        var lon = cityWeatherResponse[0].lon;
        weatherCondition(lat, lon)
        futureCondition(lat, lon)
        $(".currentWeather").css("display", "block");
        $("cityDetail").empty();

    })

}
if (JSON.parse(localStorage.getItem("#searchHistory")) === null) {
    console.log("search not found")
} else {
    console.log("search loaded");
    renderSearchHistory();
}

$("#search").on("click", function (event) {
    event.preventDefault();

    var city = $(".cityInput").val().trim();
    getLatLon(city);
    if (!searchHistoryList.includes(city)) {
        searchHistoryList.push(city);
        var searchedCity = $(`
            <li class="list-group-item">${city}</li>
            `);
        $("#searchHistory").append(searchedCity);
    };

    localStorage.setItem("city", JSON.stringify(searchHistoryList));
    console.log(searchHistoryList);
});

$(document).ready(function() {
    var searchHistoryArr = JSON.parse(localStorage.getItem("city"));

    if (searchHistoryArr !== null) {
        var lastSearchedIndex = searchHistoryArr.length - 1;
        var lastSearchedCity = searchHistoryArr[lastSearchedIndex];
        weatherCondition(lastSearchedCity);
        console.log(`Last searched city: ${lastSearchedCity}`);
    }
});


