var basemap = new L.TileLayer(baseUrl, {maxZoom: 17, attribution: baseAttribution, subdomains: subdomains, opacity: opacity});

var center = new L.LatLng(0, 0);
var popup = L.popup();
var map = new L.Map('map', {center: center, zoom: 5, maxZoom: maxZoom, layers: [basemap]});

 var customPopup = "Location Information";
    
    // Μέγεθος Popup 
    var customOptions =
        {
        'minWidth': '500',
		'minHeight': '500',
        'className' : 'custom'
        }

//Προσθήκη market αντικειμένου
var currentMarker;

//Προσθήκη συνάρηρτησης για το κλικ στον Χάρτη
map.on('click', onMapClick);

//Συνάρτηση για το κλικ στον Χάρτη
function onMapClick(e) {

//Καταχώρηση marker επάνω στο click
currentMarker  = L.marker(new L.LatLng(e.latlng.lat, e.latlng.lng));
  //marker.bindPopup(customPopup,customOptions);
 //Δημιουργία popup για την προσθήκη δεδομένων
		popup
		.setLatLng(e.latlng)
		.setContent(getFormContent())
		.openOn(map);
//		markers.addLayer(currentMarker);	
}
//openWindow();

//Συνάρτηση καταχώρησης τοποθεσίας
function addLocationInformation() {
	
	 var popup = '<div class="popup-content"><table class="table table-striped table-bordered table-condensed">';
		popup += '<tr><th>'+'Location'+'</th><td>'+ 'Home' +'</td></tr>';
        popup += '<tr><th>'+'Longitude'+'</th><td>'+ currentMarker.getLatLng().lng +'</td></tr>';
		popup += '<tr><th>'+'Latitude'+'</th><td>'+ currentMarker.getLatLng().lat +'</td></tr>';
        popup += "</table></popup-content>";
	currentMarker.bindPopup(popup);
	//+document.getElementById("location").value );
	//var x = document.getElementById("location").value;
	//alert("Location = "+x);
	markers.addLayer(currentMarker);
	

}

//Ευρεση διπλανών αντικειμένων - δεν υλοποιήθηκε
function nearbyLocation() {

}

// Δημιουργία φορμας καταχώρησης δεδομένων κατά το κλίκ στον Χάρτη
function getFormContent() {
        var content = "";"<h3>Your fare</h3>";
        		
		content += "  <form onSubmit=\"addLocationInformation(); return false;\">";
		//content += "<div id=\"filter-container\" >";
	    content += "<br>";
		content += "<br>";
		content += "<label for=\"locInfo\"><b>Location Information</b></label>";
		content += "<input type=\"text\" placeholder=\"Enter information\" name=\"location\" >"
		content += "<br>";
		content += "<button type=\"submit\">Set Data</button>";
		content += "<label>";
		content += "</label>";
		//content += "</div>";
		content += "</form>";
        return content;
    }

var popupOpts = {
    autoPanPadding: new L.Point(5, 50),
    autoPan: true
};

var points = L.geoCsv (null, {
    firstLineTitles: true,
    fieldSeparator: fieldSeparator,
    onEachFeature: function (feature, layer) {
        var popup = '<div class="popup-content"><table class="table table-striped table-bordered table-condensed">';
        for (var clave in feature.properties) {
            var title = points.getPropertyTitle(clave).strip();
            var attr = feature.properties[clave];
            if (title == labelColumn) {
                layer.bindLabel(feature.properties[clave], {className: 'map-label'});
            }
            if (attr.indexOf('http') === 0) {
                attr = '<a target="_blank" href="' + attr + '">'+ attr + '</a>';
            }
            if (attr) {
                popup += '<tr><th>'+title+'</th><td>'+ attr +'</td></tr>';
            }
        }
        popup += "</table></popup-content>";
        layer.bindPopup(popup, popupOpts);
    },
    filter: function(feature, layer) {
        total += 1;
        if (!filterString) {
            hits += 1;
            return true;
        }
        var hit = false;
        var lowerFilterString = filterString.toLowerCase().strip();
        $.each(feature.properties, function(k, v) {
            var value = v.toLowerCase();
            if (value.indexOf(lowerFilterString) !== -1) {
                hit = true;
                hits += 1;
                return false;
            }
        });
        return hit;
    }
});

var hits = 0;
var total = 0;
var filterString;
var markers = new L.MarkerClusterGroup();
var dataCsv;

var addCsvMarkers = function() {
    hits = 0;
    total = 0;
    filterString = document.getElementById('filter-string').value;

    if (filterString) {
        $("#clear").fadeIn();
    } else {
        $("#clear").fadeOut();
    }

    map.removeLayer(markers);
    points.clearLayers();

    markers = new L.MarkerClusterGroup(clusterOptions);
    points.addData(dataCsv);
    markers.addLayer(points);
	//markers.addLayer(marker);
    
	
	map.addLayer(markers);
	
	
	
    try {
        var bounds = markers.getBounds();
        if (bounds) {
            map.fitBounds(bounds);
        }
    } catch(err) {
        // pass
    }
    if (total > 0) {
        $('#search-results').html("Showing " + hits + " of " + total);
    }
    return false;
};

var typeAheadSource = [];

function ArrayToSet(a) {
    var temp = {};
    for (var i = 0; i < a.length; i++)
        temp[a[i]] = true;
    var r = [];
    for (var k in temp)
        r.push(k);
    return r;
}

function populateTypeAhead(csv, delimiter) {
    var lines = csv.split("\n");
    for (var i = lines.length - 1; i >= 1; i--) {
        var items = lines[i].split(delimiter);
        for (var j = items.length - 1; j >= 0; j--) {
            var item = items[j].strip();
            item = item.replace(/"/g,'');
            if (item.indexOf("http") !== 0 && isNaN(parseFloat(item))) {
                typeAheadSource.push(item);
                var words = item.split(/\W+/);
                for (var k = words.length - 1; k >= 0; k--) {
                    typeAheadSource.push(words[k]);
                }
            }
        }
    }
}

if(typeof(String.prototype.strip) === "undefined") {
    String.prototype.strip = function() {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

map.addLayer(markers);

$(document).ready( function() {
    $.ajax ({
        type:'GET',
        dataType:'text',
        url: dataUrl,
        contentType: "text/csv; charset=utf-8",
        error: function() {
            alert('Error retrieving csv file');
        },
        success: function(csv) {
            dataCsv = csv;
            populateTypeAhead(csv, fieldSeparator);
            typeAheadSource = ArrayToSet(typeAheadSource);
            $('#filter-string').typeahead({source: typeAheadSource});
            addCsvMarkers();
        }
    });

    $("#clear").click(function(evt){
        evt.preventDefault();
        $("#filter-string").val("").focus();
        addCsvMarkers();
    });

});
