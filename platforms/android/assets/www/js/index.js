/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.function mostrarUbicacion(){
            navigator.geolocation.getCurrentPosition(lecturaExitosa,oError,{enableHighAccuracy:true});
        }
        function lecturaExitosa(posicion){  
            document.getElementById("posicion").innerHTML = "Latitud: "+posicion.coords.altitude+ "<br/>Longitud: "+posicion.coords.longitude
            +"<br/>Margen de error: "+posicion.coords.altitudeAccuracy;
            var lat = posicion.coords.altitude;
            var lon = posicion.coords.longitude;
            //createMap(lat, lon);
           // createMap();
            //getData();
         //sendData(lat,lon);
        }
                function oError(error){        
            //document.getElementById("error").innerHTML ='Es Necesario tener Activado el GPS '+ error.message;     
            alert("Es necesario activar el GPS para utilizar esta App");
        }

 */
 function init(){
    //alert("hola");
    onDeviceReady();
    //document.addEventListener("deviceready", onDeviceReady, false);
 }
    
    // device APIs are available
    //
    var map;
    var radio =  $('#radioSearch').val();
    var markerss = [];
    var infowindow = new google.maps.InfoWindow();
    var dTotal;
    var ci;
    var lat, lon;
    var info = [];
    var data = [];
 
    Array.prototype.orderByNumber=function(p,so){
                 if(so!=-1&&so!=1)so=1;
                    this.sort(function(a,b){
                    return(b[p]-a[p])*so;
                    });
            }

    $('#radioSearch').on('change', function() {
          radio = ( this.value ); // or $(this).val()
          clearLocations();
          clearList();
          cleanInfo();
          getData(lat, lon);
        });
    
     function cleanInfo(){
        info = [];
     }
    function onDeviceReady() {
        navigator.geolocation.getCurrentPosition(onSuccess, onnError, {maximumAge: 5000, timeout: 10000, enableHighAccuracy: true});
    }

    // onSuccess Geolocation
    //
    function onSuccess(position) {
       var element = document.getElementById('geolocation');
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        element.innerHTML = 'Latitude: '+ position.coords.latitude              + '<br />' +
                            'Longitude: '          + position.coords.longitude             + '<br />';
                 //var element = document.getElementById('geolocation').innerHTML="Hola";           
        createMap(lat, lon);
        getData(lat, lon);
    }

    // onError Callback receives a PositionError object
    //
    function onnError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }
    //Obtener la distancia de mi posicion a los cerrajeros
    function distance(lat1, lon1, lat2, lon2, tr, d, t, c, c1, h, h1, r, w, p, l, m) {
          var lat =  lat2;
          var lon = lon2;
          var deg2rad = Math.PI / 180;
          lat1 *= deg2rad;
          lon1 *= deg2rad;
          lat2 *= deg2rad;
          lon2 *= deg2rad;
          var diam = 6371; // Diameter of the earth in km (2 * 6371)
          var dLat = lat2 - lat1;
          var dLon = lon2 - lon1;
          var a = (
            (1 - Math.cos(dLat)) +
            (1 - Math.cos(dLon)) * Math.cos(lat1) * Math.cos(lat2)
          ) / 2;
          dTotal = diam * Math.asin(Math.sqrt(a));
          if(dTotal <= radio){
                createMarkers(lat, lon, tr);
                createCard(tr, d, t, c, c1, h, h1, r, w, p, l, m, dTotal);
                $("#distancia").append(dTotal.toFixed(1) + " km "+ tr);     
                $('#cInfo').append(ci);
            }     
        }

    //Obtener los datos de la base de datos
     function getData(lat, lon){
        $.getJSON('http://app.directoriocerrajerias.com/respuesta.php',function(data){
            var tr;
            for (var i = 0; i < data.length; i++) {
                tr = $('<p/>');
                    tr.append("1" + data[i].lat + "<br/>");
                    tr.append("2" + data[i].lon + "<br/>");
                    tr.append("3" + data[i].cerrajeria + "<br/>");  
                $('#datos').append(tr); 
                distance(lat, lon, data[i].lat, data[i].lon, data[i].cerrajeria, data[i].domicilio,
                        data[i].tel, data[i].cel, data[i].cel2, data[i].horario, data[i].horario2,
                        data[i].radio, data[i].whats, data[i].pw, data[i].logo, data[i].mark);
                /*createCard(data[i].cerrajeria, data[i].domicilio,
                        data[i].tel, data[i].cel, data[i].cel2, data[i].horario, data[i].horario2,
                        data[i].radio, data[i].whats, data[i].pw, data[i].logo, data[i].mark);*/

            }
            });
      }
      //Creando el mapa
      function createMap(lat, lng){
           var latlng = new google.maps.LatLng(lat, lng);
            var mapOptions={
                    zoom: 10,
                    center: latlng,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
            var marker= new google.maps.Marker({
                position: latlng,
                map:map
            });
            map = new 
            google.maps.Map(document.getElementById('map_canvas'),mapOptions);
            marker.setMap(map);
             //createMarkers();
        }   
        //Creando los marcadores de los cerrajeros
        function createMarker(latlng, tr){
            var markers = new google.maps.Marker({
                position: latlng,
                map: map,
                animation: google.maps.Animation.DROP,
            });  
            showMsg(markers, tr);
            markerss.push(markers); 
        }
        
        function createMarkers(lat, lon, tr){
            //$("#posicion2").append(lat+ " " +lon);
                var location = new google.maps.LatLng(lat, lon);
                createMarker(location, tr); 
        }

        function showMsg(markers,markInfo){
            google.maps.event.addListener(markers, 'click', function(){
                infowindow.setContent(markInfo);
                infowindow.open(map, markers);
            });
            
        }
        function clearLocations(){
            infowindow.close();
            for (var i = 0; i < markerss.length; i++) {
                markerss[i].setMap(null);
            }
            markerss.length = 0;
        }

        function createCard(cerrajeria, domicilio, tel, cel, cel2, horario, horario2, radio,
                  whats, pw, logo, mark, dTotal){    
        var cis  = {};
           cis["c"]   = cerrajeria;
           cis["d"]   = domicilio;
           cis["t"]   = tel;
           cis["ce"]  = cel;
           cis["ce2"] = cel2;
           cis["h"]   = horario;
           cis["h2"]  = horario2;
           cis["r"]   = radio;
           cis["w"]   = whats;
           cis["pw"]  = pw;
           cis["l"]   = logo;
           cis["m"]   = mark;
           cis["dt"]  = dTotal;         
            info.push(cis);
            info.orderByNumber("dt", -1);
           console.log(info.length);
            var t;
            $('#datos1').empty();
            for (var i = 0; i < info.length; i++) {
                  t=$("<p/>");
                  t.append("Nombre: " + info[i].c + "<br/>");
                  if(info[i].w != ""){
                    t.append("Whatsapp:" + info[i].w + "</p><br/>"+
                    "<button onclick='myWhats("+info[i].w+")'>Enviar Whatsapp</button><br/>");
                  }
                $('#datos1').append(t); 
               
            }
           }

           function myWhats(numTel){
                cordova.plugins.Whatsapp.send(numTel);
           }
        
            
            function clearList() {
            var list = document.getElementById("cInfo");
            var elems = list.getElementsByTagName("div");
            while (elems[0]) {
                list.removeChild(elems[0]);
            }

        }
       
        
        createMap(); 