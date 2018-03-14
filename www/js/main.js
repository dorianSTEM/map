// This is a JavaScript file
var marks = [];
var directions = false;

var storage = window.localStorage;

key = "name";
value = "bob";

$("#toast-msg").on('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
    $("#toast-msg").removeClass("animated-toast");
});

function showToast(msg){
    $("#toast-msg").removeClass("animated-toast");
    $("#toast-msg").html(msg);
    $("#toast-msg").addClass("animated-toast");
}

//storage.removeItem("saved-locations");

//storage.setItem("saved-locations", value) // Pass a key name and its value to add or update that key.
console.log();

if (!JSON.parse(storage.getItem("saved-locations"))){
    console.log("initial setup");
    storage.setItem("saved-locations", '{"locs":[]}');
    console.log(storage.getItem("saved-locations"));
}

var locations = JSON.parse(storage.getItem("saved-locations"));

setTimeout(200, function(){
    
});


//storage.removeItem("saved-locations"); // Pass a key name to remove that key from storage.11

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    console.log("navigator.geolocation works well");
    navigator.geolocation.getCurrentPosition(function(position){
         console.log('Latitude: '          + position.coords.latitude          + '\n' +
              'Longitude: '         + position.coords.longitude         + '\n' +
              'Altitude: '          + position.coords.altitude          + '\n' +
              'Accuracy: '          + position.coords.accuracy          + '\n' +
              'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
              'Heading: '           + position.coords.heading           + '\n' +
              'Speed: '             + position.coords.speed             + '\n' +
              'Timestamp: '         + position.timestamp                + '\n');
    }, function(){
        
    }, {enableHighAccuracy: true });
}

$("#destination-picker").hide();
$("#choose-destination").click(function(){
    directions = false;
    $("#destination-picker").show();
    $("#menu").hide();
});

$("#back").click(function(){
    $(".menu").show();
    
    $("#menu").show();
    $("#destination-picker").hide();
    
    $("#back").css({opacity:0});
});

$('#destination-picker').on('click', '.dest', function() {
//$(".dest").click(function(){
    //alert("click")
    if (!directions){
        directionsDisplay.setMap(null);
        var geocoder = new google.maps.Geocoder();
        // Get LatLng information by name
        geocoder.geocode({
            "address": $(this)[0].dataset.addr
            }, function(results, status){
                map.setCenter(results[0].geometry.location);
                for (var mark in marks){
                    marks[mark].setMap(null);
                }
                marks.push(new google.maps.Marker({
                    position: results[0].geometry.location,
                    map: map,
                    title: "chosen location"
                })); 
        });
        //alert();
    } else {
        directionsDisplay.setMap(map);
        //alert($(this)[0].dataset.addr)
        calculateAndDisplayRoute("STEM School Highlands Ranch", $(this)[0].dataset.addr)
    }
    
    $(".menu").hide();
    $("#back").css({opacity:1});
    
        
    //{lat:50.8503, lng:4.3517});
});

$("#surprise").click(function(){
    directionsDisplay.setMap(null);
    var geocoder = new google.maps.Geocoder();
    // Get LatLng information by name
    geocoder.geocode({
        "address": $(".dest").eq(Math.floor(Math.random()*4))[0].dataset.addr //$(this)[0].dataset.addr
        }, function(results, status){
            map.setCenter(results[0].geometry.location);
            for (var mark in marks){
                marks[mark].setMap(null);
            }
            marks.push(new google.maps.Marker({
                position: results[0].geometry.location,
                map: map,
                title: 'Random Location'
            })); 
        });
        $(".menu").hide();
        $("#back").css({opacity:1});
});

$("#directions").click(function(){
    directions = true;
    $("#destination-picker").show();
    $("#menu").hide();
});

$("#save-loc").click(function(){
   showToast("Acquiring location..");
   
    navigator.geolocation.getCurrentPosition(function(position){
        var good = true;
        
        var lat = Math.round(position.coords.latitude*1000)/1000;
        var long = Math.round(position.coords.longitude*1000)/1000;
        console.log("INDEX: " + locations["locs"].indexOf({"lat":lat, "long":long}))
        
        for (var loc in locations["locs"]){
            if (locations["locs"][loc]["lat"] == lat || locations["locs"][loc]["long"] == long){
                console.log("loc stor")
                good = false;
            }
        }
        
        if (good){
            locations["locs"].push({"lat":lat, "long":long});
            storage.setItem("saved-locations", JSON.stringify(locations));
            locations = JSON.parse(storage.getItem("saved-locations"));
            console.log(JSON.stringify(locations));
            showToast("location saved.");
            
            geocoder.geocode({'location': {lat:lat , lng:long }}, function(results, status) {
                //alert(results[0].formatted_address);
                $("#destination-picker").append('<div class="menu-item dest" data-addr="' + results[0].formatted_address + '">' + results[0].formatted_address + '</div>');
                
            });
        } else {
            showToast("already stored");
        }
    
        //alert(storage.getItem("saved-locations"));
        
    }, function(){}, {enableHighAccuracy: true });
});