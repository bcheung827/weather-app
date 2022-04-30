var todayDate = moment().format('MMMM Do YYYY, h:mma');;
$("#currentDay").text(todayDate);

var search = document.querySelector('#search');
var cityInput = document.querySelector('.cityinput');
var apiKey = "2e80b0fd893a1d1ca602fe3246080159";
var cityName = document.querySelector('.cityName');

var searchHistoryList = JSON.parse(localStorage.getItem('city')) || [];

function weatherCondition(lat, lon) {
    var queryURL = `https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=${lat}&lon=${lon}&appid=${apiKey}`;
    $('.currentWeather').empty()
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
        var iconCode = cityWeatherResponse.current.weather[0].icon;
        //Create a p element container to display UV Index value
        var pTemp = $('<p/>');
        var pHumidity = $('<p/>');
        var pWind_speed = $('<p/>');
        var pUV = $('<p/>');
        var iconURL = $('<img/>');
        iconURL.attr("src", `https://openweathermap.org/img/wn/${iconCode}.png`);
        iconURL.css("width", "100px")
        //Display value on container
        pTemp.text(`Temperature: ${temp}°F`);
        pHumidity.text(`Humidity: ${humidity}`);
        pWind_speed.text(`Wind Speed: ${wind_speed}`);
        pUV.text(`UV Index: ${uvi}`);
        $('.currentWeather').append(iconURL, pTemp, pHumidity, pWind_speed, pUV)

        //http://openweathermap.org/img/wn/10d@2x.png
        futureCondition(cityWeatherResponse)
    })
}
function futureCondition(futureResponse) {

    console.log(futureResponse);
    $('.fiveDay').empty();
    //create a var that holds UV index value
    for (var i = 0; i < 5; i++) {

        var currDateConvert = new Date(futureResponse.daily[i].dt * 1000).toISOString();
        var currDate = currDateConvert.split("T")[0] //["Fri", "Apr", "22", "2022", ""]
        // console.log(JSON.stringify(currDateConvert))
        var temp = futureResponse.daily[i].temp.day;
        var humidity = futureResponse.daily[i].humidity;
        var wind_speed = futureResponse.daily[i].wind_speed;
        var iconCode = futureResponse.daily[i].weather[0].icon;

        // var pcurrDate = $('<p/>');
        // var pTemp = $('<p/>');
        // var pHumidity = $('<p/>');
        // var pWind_speed = $('<p/>');
        // var iconURL = $('<img/>');
        // //Display value on container
        // pcurrDate.text(`Date: ${currDate}`)
        // pTemp.text(`Temperature: ${temp} `);
        // pHumidity.text(`Humidity: ${humidity}`);
        // pWind_speed.text(`Wind Speed: ${wind_speed}`);
        // $('.fiveDay').append(pcurrDate, pTemp, pHumidity, pWind_speed)
        var futureCard = $(`
            <div class="card col-2" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title"></h5>
        <h6 class="card-subtitle mb-2 text-muted">Date: ${currDate}</h6>
        <img src="https://openweathermap.org/img/wn/${iconCode}.png" style="width:100px" alt="" ></img>
        <p class="card-text">Temp: ${temp}°F</p>
        <p class="card-text">Humidity: ${humidity}</p>
        <p class="card-text">Wind: ${wind_speed}</p>
      </div>
    </div>
        `);

        $(".fiveDay").append(futureCard);

    }
    //var currDate = moment.unix(currDate).format("MM/DD/YYYY");
    //iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;


}


//retrieve latitude and longitude of coordinates for the inputted city
function getLatLon(city) {
    var queryURL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=' + apiKey

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (cityWeatherResponse) {
        console.log(cityWeatherResponse);
        var lat = cityWeatherResponse[0].lat;
        var lon = cityWeatherResponse[0].lon;
        console.log(lat, lon)
        weatherCondition(lat, lon)
        //futureCondition(lat, lon)
        $(".currentWeather").css("display", "block");
        $("cityDetail").empty();

    })

}
// if (JSON.parse(localStorage.getItem("#searchHistory")) === null) {
//     console.log("search not found")
// } else {
//     console.log("search loaded");
//     renderSearchHistory();
// }

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

$(document).ready(function () {
    //var searchHistoryArr = JSON.parse(localStorage.getItem("city"));

    if (searchHistoryList !== null) {
        var lastSearchedIndex = searchHistoryList.length - 1;
        var lastSearchedCity = searchHistoryList[lastSearchedIndex];
        // weatherCondition(lastSearchedCity);
        console.log(`Last searched city: ${lastSearchedCity}`);
    }

    console.log("Yo")
    displayHistory();
});


