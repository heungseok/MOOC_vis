/**
 * Created by heungseok2 on 2017-07-26.
 */



var pc0;
// var PC_height = 400;

var parcoords = d3.parcoords()("#pc-container")

// this data is used to access POC data as global variable, the usage is find edge in the POC, and sync with network.
var global_data;

// load csv file and create the chart
d3.csv('./data/MOOC_parcoord_data_only_net_available.csv', function(data) {
    var colorgen = d3.scale.ordinal()
        .range(["#862a31","#2d8d2d","#7e552c","#767c2b",
            "#7e4b2c","#284562","#342f69","#702a70",
            "#4d3275","#250751","#ffff99","#b15928"]);

    var color = function(d) { return colorgen(d.area); };

    parcoords
        .data(data)
        .hideAxis(["course_id", "review_platform", "title", "school", "subject", "price", "level",
                    "course_length", "effort_hours", "published_time", "time", "session_open", "url"])
        .color(color)
        .alpha(0.25)
        .composite("darken")
        .margin({ top: 24, left: 150, bottom: 12, right: 0 })
        .mode("queue")
        .render()
        .reorderable()
        .brushMode("1D-axes");  // enable brushing

    parcoords.svg.selectAll("text")
        .style("font", "10px sans-serif");
});