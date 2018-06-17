var endpointdata = [];
var endpoint = 'https://query.wikidata.org/bigdata/namespace/wdq/sparql';

define(['ojs/ojcore', 'knockout', 'ojs/ojknockout', 'd3-sparql', 'ojs/ojtable', 'ojs/ojarraytabledatasource', 'ojs/ojgauge',
    'ojs/ojdatetimepicker', 'ojs/ojselectcombobox', 'ojs/ojtimezonedata', 'ojs/ojlabel'],
    function (oj, ko, ojs, myd3) {
     function ControllerViewModel() {
         var self = this;

         self.Date = ko.observable();
         var runQuery = function (date) {
             var temp = [];
             spaceCraftsObservableArray([]);
             var query = `#Timeline of space probes
    #defaultView:Timeline
    SELECT ?item ?itemLabel ?launchdate (SAMPLE(?image) AS ?image)
    WHERE
    {
      ?item wdt:P31 wd:Q26529 .
      FILTER (?launchdate <= "` + date + `"^^xsd:dateTime)
        ?item wdt:P619 ?launchdate .
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
        OPTIONAL { ?item wdt:P18 ?image }
    }
    GROUP BY ?item ?itemLabel ?launchdate`;
             myd3.sparql(endpoint, query).get(function (error, data) {
                 data.forEach(function (item, i, data) {
                     spaceCraftsObservableArray.push({
                         name: item.itemLabel,
                         date: item.launchdate,
                         image: item.image
                     });
                 });
             });
             console.log(spaceCraftsObservableArray);
         }

         self.updateQuery = function() {
             var newDate = self.Date;
             runQuery(new Date(newDate()).toISOString());
         }

         var spaceCraftsObservableArray = ko.observableArray(endpointdata); 

         self.dataSource = new oj.ArrayTableDataSource(spaceCraftsObservableArray, { idAttribute: 'name'});
     }
        return new ControllerViewModel();

  }
);
