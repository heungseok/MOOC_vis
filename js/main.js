var network_arr = [];
var s,
    g = {
        nodes: [],
        edges: []
    };

var url_arr = ["../data/20140622.json","../data/20140706.json", "../data/20140720.json", "../data/20140727.json", "../data/20140824.json" ];


/*
 json data import and push to network array
 */


$(document).ready(function(){
    init();

});

function init() {
    $.getJSON(url_arr[0], function(data, textStatus, jqXHR){
        network_arr.push(data);
        sigmainit(network_arr[0]);
    });
    for(var i=1; i<url_arr.length;i++){
        requestData(i);
    }

}

function requestData(index){

    $.getJSON(url_arr[index], function(data, textStatus, jqXHR){
        // console.log(data);
        network_arr.push(data);
        network_arr.sort(compare);
    });

}

function compare(a,b){
    if(parseInt(a.time) < parseInt(b.time))
        return -1;
    if(parseInt(a.time) > parseInt(b.time))
        return 1;
    return 0;
}


// sigma instance initialization.
function sigmainit(network){

    // node init
    network.nodes.forEach(function(node, index){
        g.nodes.push({
            id: node.id,
            node_id: node.attributes.node_id,
            label: node.label,
            x: node.x,
            y: node.y,
            size: node.size,
            color: node.color,

            target_color: "#d30bee",
            target_size: 20,
            target_x: -1.253332335643046,
            target_y: -9.921147013144777

        });
    });

    // edge init
    network.edges.forEach(function(edge, index){
        // console.log(edge);
        g.edges.push({
            id: network.time + "-" + edge.id,
            source: edge.source,
            target: edge.target,
            size: edge.size,
            color: edge.color,
            type: "curvedArrow",
            // type: "curve",
            flag: false

        });
    });

    console.log(g);

    // sigma init
    s = new sigma({
        graph: g,
        // container: 'graph-container',
        // when rendering the network with canvas,, the speed is quite slow.
        renderer: {
            container: document.getElementById('graph-container'),
            type: 'canvas'
        },

        settings:{

            minArrowSize: 5,
            defaultLabelSize: 30,
            animationTime: 3000,
            minNodeSize: 3,
            maxNodeSize: 17,
            labelThreshold: 17,
            sideMargin: 70
        }

    });


    console.log(s.graph.nodes());

    network_arr.sort(compare);
    console.log(network_arr);


}

