var APPID = "5ed7fe09a8d16f98c682550fd9141a25";
var temp = document.getElementById("temperature");
var description = document.getElementById("description");
var loc = document.getElementById("location");
var country = document.getElementById("country");
var humidity = document.getElementById("humidity");
var wind = document.getElementById("wind");
var direction = document.getElementById("direction");
var city_input = document.getElementById("city-input");
//var icon;
var kelvin = 273.15;







function mile2kilometer(mile){
    return Math.round( mile * 1.609344 );
}

function K2C(k) {
    return Math.round( k - 273.15 );
}

function K2F(k) {
    return Math.round( k * (9/5)-459.67 );
}

function toFahrenheit(){
    // var content = window.getComputedStyle(
    //     document.querySelector('#temperature'), ':after'
    //     ).getPropertyValue('content');
    // var res = content.split("");
    // if(res[2] == "F"){
    //     return;
    // }else{
    //     temp.classList.remove("celsius-degree");
    //     temp.className += " fahrenheit-degree";
    //     temp.innerHTML = K2F(kelvin);
    // }

    temp.classList.remove("celsius-degree");
    temp.className += " fahrenheit-degree";
    temp.innerHTML = K2F(kelvin);
}

function toCelsius(){
    temp.classList.remove("fahrenheit-degree");
    temp.className += " celsius-degree";
    temp.innerHTML = K2C(kelvin);
}

function degreesToDirection(degrees) {
    var range = 360/16 ;
    var low = 360 - range/2 ;
    var high = (low+range) % 360 ;
    var angles = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"] ;
    for( i in angles ){
        //console.log("low= " + low + " , high= " + high + " , angle= " + angles[i]);
        if(degrees >= low && degrees < high){
            return angles[i];
        }
        low = (low + range) % 360;
        high = (high + range) % 360;
    }
}





//===================================================
//                  Update Weather
//===================================================
function update(weather){
    wind.innerHTML = weather.wind;
    direction.innerHTML = weather.direction;
    humidity.innerHTML = weather.humidity;
    loc.innerHTML = weather.loc;
    temp.innerHTML = weather.temp;
    country.innerHTML = weather.country;
    description.innerHTML = weather.description;
    //icon.src = "imgs/codes/" + weather.icon + ".png";
}


//===================================================
//                     AJAX call
//===================================================
function sendRequest(theurl) {
    reqwest({
        url: theurl,
        type: 'jsonp',
        method: 'get',
        success : function(response){
            //var response = JSON.parse(this.responseText);
            var weather = {};
            //weather.icon = response.weather[0].id;
            weather.humidity = response.main.humidity;
            weather.wind = mile2kilometer(response.wind.speed);
            //console.log(response.wind.deg);
            weather.direction = degreesToDirection(response.wind.deg);
            weather.loc = response.name;
            weather.country = response.sys.country
            kelvin = response.main.temp;
            weather.temp = K2C(kelvin);
            weather.description = response.weather[0].description;
            update(weather);
        }
    });
}







function updateByCityName(cityName) {
    var url = "http://api.openweathermap.org/data/2.5/weather?"+
        "q=" + cityName +
        "&APPID=" + APPID;
    sendRequest(url);
}

function updateByGeo(lat, lon) {
    var url = "http://api.openweathermap.org/data/2.5/weather?"+
        "lat=" + lat +
        "&lon=" + lon +
        "&APPID=" + APPID;
    sendRequest(url);
}

function getPosition(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    updateByGeo(lat,lon);
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}










//=============================================
//                  Search
//=============================================

city_input.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode == 13) {
        updateByCityName(city_input.value);
    }
});

function search(){
    updateByCityName(city_input.value);
}

function locate(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getPosition, showError);
    } else {
        var cityName = window.prompt("Geolocation is not supported by this browser. Enter City name in the search box.");
        updateByCityName(cityName);
    }
}





