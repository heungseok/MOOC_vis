var network_arr = [];
var platform = "classCentral"
var s,
    g = {
        nodes: [],
        edges: []
    };

var url_arr = [
    "../data/t1_classCentral_network.json",
    "../data/t2_classCentral_network.json",
    "../data/t3_classCentral_network.json",
    "../data/t4_classCentral_network.json",
    ];


/*
 json data import and push to network array
 */


$(document).ready(function(){
    init();

});

function init() {
    $.getJSON(url_arr[0], function(data, textStatus, jqXHR){
        network_arr.push(data);
        sigma_init(network_arr[0]);
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
function sigma_init(network){

    // node init
    network.nodes.forEach(function(node, index){
        g.nodes.push({
            id: node.course_id,
            node_id: node.attributes.node_id,
            label: node.attributes.title,
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


// ####################### Init utility ####################

// attach addTargetNodeAttr fucntion to sigma graph method
sigma.classes.graph.addMethod('addTargetNodeAttr', function(target_network) {
    var l = this.nodesArray.length,
        source;


    // assingn the target node from source.
    for(i=0; i<l; i++){
        source = this.nodesArray[i];
        // console.log(this.nodesArray[i]);
        for(index in target_network.nodes){
            var target_node = target_network.nodes[index];
            // console.log(source.node_id);
            // console.log(target_node);

            if(source.node_id == target_node.attributes.node_id){
                // console.log(source.label);
                // console.log("Matched!! before chainging node");
                // console.log(this.nodesArray[i]);
                this.nodesArray[i].target_color = target_node.color;
                this.nodesArray[i].target_x = target_node.x;
                this.nodesArray[i].target_y = target_node.y;
                this.nodesArray[i].target_size = target_node.size;

                // console.log("after chainging node");
                // console.log(this.nodesArray[i]);
            }
        }
    }

});

// attach updateEdge function to sigma graph method
sigma.classes.graph.addMethod('updateEdge', function(target_network){
    var edge_length = this.edgesArray.length;
    var node_length = this.nodesArray.length;

    var source, target;

    var tar_source, tar_target;


    // edge check whther exsting or not
    for(i=0; i<edge_length; i++){
        source = s.graph.nodes(this.edgesArray[i].source).node_id;
        target = s.graph.nodes(this.edgesArray[i].target).node_id;

        for(edge_index in target_network.edges){
            var temp_source = target_network.edges[index].source;
            var temp_target = target_network.edges[index].target;

            // find unified node_id from other network
            for(node_index in target_network.nodes){
                var temp_node = target_network.nodes[node_index];

                if(temp_node.id == temp_source){
                    tar_source = temp_node.attributes.node_id;
                }else if(temp_node.id == temp_target){
                    tar_target = temp_node.attributes.node_id;
                }

            }

            // if each edge is equal, change flag as true;
            if(source == tar_source && target == tar_target){
                this.edgesArray[i].flag = true;
            }
        }
    }


    // add the id of the edges having true flag
    var deleteEdgeArr = [];
    for(index in this.edgesArray){
        if(!this.edgesArray[index].flag) deleteEdgeArr.push(this.edgesArray[index].id);
    }
    // delete edges which have false flag
    deleteEdgeArr.forEach(function(id){
        s.graph.dropEdge(id);
    });


});


// attach updateEdge function to sigma graph method
sigma.classes.graph.addMethod('updateEdge2', function(target_network){
    // clear previous edge list, we will change from all edges to new edge.
    // (cuz edge id and node id are quite different..)
    // this.edgesArray.length = 0;
    // delete this.edgesArray;
    // this.edgesArray = [];

    s.graph.clearEdge();


    var edge_length = target_network.edges.length;
    var nodeArr_length = this.nodesArray.length;
    var origin_source, origin_target;


    for(i=0; i<edge_length; i++){
        var target_edge = target_network.edges[i];

        var source_id, target_id;

        // find node_id from target_network.
        for(j in target_network.nodes){
            // console.log(target_network.nodes[j]);
            if(target_network.nodes[j].course_id == target_edge.source)
                source_id = target_network.nodes[j].course_id;
            else if(target_network.nodes[j].course_id == target_edge.target)
                target_id = target_network.nodes[j].course_id;
        }

        // find real node id from origin network
        for(k in this.nodesArray){
            if(this.nodesArray[k].node_id == source_id)
                origin_source = this.nodesArray[k].id;
            else if(this.nodesArray[k].node_id == target_id)
                origin_target = this.nodesArray[k].id;

        }

        var newEdge = {
            id: target_network.time + "-" + target_edge.id,
            source: origin_source,
            target: origin_target,
            size: target_edge.size,
            color: target_edge.color,
            type: "curvedArrow",
            // type: "curve",
            flag: false

        }
        s.graph.addEdge(newEdge);

    }

});


// ####################### END of utility ####################



// incresing Time T and changing and animating network.
$("#plus-btn").click( function(){
    var source_value = parseInt(document.getElementById("min-degree").value);
    var max_value = parseInt(document.getElementById("min-degree").max);

    if(source_value < max_value){
        // console.log(source_value);
        var target_value = source_value+1;
        // console.log(target_value);

        document.getElementById("min-degree").value = target_value;
        showValue(target_value);

        changeNetwork(source_value, target_value);
    }

});

// decreasing Time T and changing and animating network.
$("#minus-btn").click(function(){

    var source_value = parseInt(document.getElementById("min-degree").value);
    var min_value = parseInt(document.getElementById("min-degree").min);

    if(source_value>min_value){
        // console.log(source_value);
        var target_value = source_value-1;
        // console.log(target_value);

        document.getElementById("min-degree").value = target_value;
        showValue(target_value);

        changeNetwork(source_value, target_value);
    }
});

// automatically increasing degree and changing network
$("#play-btn").click(function(){

    var flag = false;
    var timerId = 0 ;

    var source_value = parseInt(document.getElementById("min-degree").value);
    var max_value = parseInt(document.getElementById("min-degree").max);

    var length = max_value-source_value;

    // automatically increasing degree and changing network
    timerId = setInterval(function(){
        if(source_value >= max_value || parseInt(document.getElementById("current_date").innerHTML) >= max_value){
            clearInterval(timerId);
        }else{
            source_value++;
            document.getElementById("min-degree").value = source_value;
            showValue(source_value);
            changeNetwork(source_value-1, source_value);
        }

    },2000);

});



// show the value of the degree bar
function showValue(newValue)
{
    document.getElementById("current_date").innerHTML=newValue;

}


// reset degree
$("#reset-btn").click(function(){

    var source_value = parseInt(document.getElementById("min-degree").value);
    if(source_value != 1){
        document.getElementById("min-degree").value = 1;
        showValue(1);
        changeNetwork(source_value, 1);
    }


});

// call the binded function in sigam.graph
function changeNetwork(from, to){

    var target_network = network_arr[to-1];
    s.graph.addTargetNodeAttr(target_network);
    s.graph.updateEdge2(target_network);
    animation();
}


// animation func
function animation(){
    sigma.plugins.animate(
        s,
        {
            x: 'target_x',
            y: 'target_y',
            size: 'target_size',
            color: 'target_color'
        },
        {
            easing: 'cubicInOut',
            duration: 2000,
            onComplete: function() {
                console.log("success!");
                console.log(s.graph.nodes());


                // do stuff here after animation is complete
            }
        }
    );
}

