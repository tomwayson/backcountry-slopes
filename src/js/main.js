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
  require(["esri/arcgis/utils", "app/BootstrapMap", "dojo/domReady!"],
    function(arcgisUtils, BootstrapMap) {
      var map;
      if (config.webMapId) {
          var mapDeferred = arcgisUtils.createMap(config.webMapId, "mapDiv", {
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

            // TODO: other page features

            // Add titles
            // dom.byId("mapTitle").innerHTML = response.itemInfo.item.title;
            // //dom.byId("mapSubTitle").innerHTML = response.itemInfo.item.snippet;
            // // Add scalebar and legend
            // var layers = esri.arcgis.utils.getLegendLayers(response);
            // if(map.loaded){
            //   initMapParts(layers);
            // }
            // else{
            //   on(map,"load",function(){
            //     initMapParts(layers);
            //   });
            // }

          },function(error){
            alert("Sorry, couldn't load webmap!");
            console.log("Error loading webmap: " & dojo.toJson(error));
          });

      } else {

        map = BootstrapMap.create("mapDiv",{
          basemap:"topo",
          center:[-116.911038,34.243655],
          zoom:12
        });

      }
  });
});
