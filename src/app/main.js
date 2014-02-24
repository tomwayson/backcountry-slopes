// start app if we're signed in
// or if sign in not required
require(['app/config.js', 'app/OAuthHelper'], function(config, OAuthHelper) {
  // if app id, use OAuth
  if (config.appId) {
    OAuthHelper.init({
      appId: config.appId,
      portal: config.portalUrl,
      expiration: config.expiration
    });
    if (!OAuthHelper.isSignedIn()) {
      OAuthHelper.signIn();
      // NOTE: this line is never reached,
      // above call to sign in redirects to portal
      return;
    }
  }

  // load app dependencies and
  // start app
  require(["esri/map",
    "esri/dijit/Scalebar",
    "esri/dijit/Legend",
    "esri/arcgis/utils",
    "dojo/dom",
    "dojo/on",
    "dojo/query",
    "lib/bootstrap-map-js/js/bootstrapmap.js",
    "dojo/domReady!"],
  function(Map, Scalebar, Legend, esriUtils, dom, on, query, BootstrapMap) {
    "use strict";

    var map;
    var scalebar;
    var legend;

    // Load web map automatically when the page loads
    loadWebmap();

    on(dom.byId("btnWebmap"),"click", loadWebmap);

    function loadWebmap(/*e*/) {

      // Get new webmap and extract map and map parts
      resetMap();

      // Webmaps
      // 8602ad7753a54608a5c359f5977fba13
      // f58996878ac24702afef792e52a07e55
      // 441f68fc13ec4ec480287f9d46c3e319
      var webmap = 'f47b081abf8f4518a03fe8223f049562'; // dom.byId("webmapId").value.trim();
      var mapDeferred = esriUtils.createMap(webmap, "mapDiv", {
        mapOptions: {
          slider: true,
          nav:false,
          smartNavigation:false
        }
      });

      mapDeferred.then(function(response) {
        map = response.map;

        // Bind to map
        BootstrapMap.bindTo(map);

        // Add titles
        dom.byId("mapTitle").innerHTML = response.itemInfo.item.title;
        //dom.byId("mapSubTitle").innerHTML = response.itemInfo.item.snippet;
        // Add scalebar and legend
        var layers = esri.arcgis.utils.getLegendLayers(response);
        if(map.loaded){
          initMapParts(layers);
        }
        else{
          on(map,"load",function(){
            initMapParts(layers);
          });
        }

      },function(error){
        alert("Sorry, couldn't load webmap!");
        console.log("Error loading webmap: " & dojo.toJson(error));
      });
    }

    function initMapParts(layers){
     //add scalebar
      scalebar = new Scalebar({
        map:map,
        scalebarUnit: 'english'
      });
      //add legend
      if (legend) {
        legend.map = map;
        legend.refresh(layers);
      }
      else {
        legend = new Legend({
            map:map,
            layerInfos:layers
          },"mapLegendDiv");
        legend.startup();
      }
    }

    function resetMap() {
      if (map) {
        //BootstrapMap.destroy(map);
        map.removeAllLayers();
        map.spatialReference = null;
        map.destroy();
      }
      if (scalebar)
       scalebar.destroy();
      if (legend) {
        dom.byId("mapLegendDiv").innerHTML = "";
      }
    }

  });
});
