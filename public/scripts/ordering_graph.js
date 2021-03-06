define(['/scripts/lib/d3.js','/scripts/underscore.js'],
    function(d3,_) {

  var ordering_graph = function(args) {


    var width = args.width ? args.width : 800,
        height = args.height ? args.height : 800,
        data = args.data ? args.data : [], 
        padding = args.padding ? args.padding : 100, 
        topThing = args.topThing ? args.topThing : args.data[0].thing; 


    //just returns the complete array of things
    var findThings = function(data) {
      var things = [];
      data.forEach(function(d) {
          if (_.indexOf(things,d.thing) < 0) {
            things.push(d.thing);
          }
      })
      return things;
    }


    var flattenById = function(data) {
      return _.pairs(_.groupBy(data,function(d) { return d.id }))
              .map(function(d) { 
                var sorted = _.sortBy(d[1],function(l) { return l.order });
                var obj = { id : d[0] };
                for (var a=0; a<sorted.length; a++) {
                  obj[a] = sorted[a].thing;
                }
                return obj
              });
              
    };

   
    var nodeify = function(data, filter, depth,thing) {
      var filtered = data.filter(filter);
      var things = _.keys(_.groupBy(filtered,function(f) { return f[(depth+1)] })).filter(function(k) { return k });
      if (filtered.length && things.length > 1) {
        var obj = {
          size : filtered.length,
          data : _.groupBy(filtered,function(d) { return d[(depth+1).toString()] }),
          depth : depth,
          thing : thing,
          children : []
        };

        for (var a = 0; a<things.length;a++) {
          var func = function(f) {
            return f[(depth+1).toString()] == things[a];
          }
          if (things[a]) {
            o = nodeify(filtered,func,depth+1,things[a]);
            if (o) {

              obj.children.push(o);
            }
          }
        }
      }
      return obj;
    } 

    var makeNodeData = function(data,topThing) {
      var things = findThings(data);
      var flattened = flattenById(data);

      return nodeify(flattened,function(f) { return f['0'] == topThing },0,topThing);

    }


    var makeConnector =d3.svg.line()
        .x(function(d) { return scaleX(d.x); })
        .y(function(d) { return scaleY(d.y); })
    

    var makeArc = function(startAngle,endAngle,radius) {
      var d = "M0,0 ",
          sweep  = endAngle - startAngle > Math.PI ? "1,1" : "0,1",
          startx = Math.cos(startAngle)*radius,
          starty = Math.sin(startAngle)*radius,
          endx = Math.cos(endAngle) * radius,
          endy = Math.sin(endAngle) * radius;

      d += "L"+startx+","+starty+" ";
      d += "A "+radius + "," + radius+ " 0 "+sweep+" "+endx + "," + endy + " z";

      return d;
    }

    nodes = makeNodeData(data,topThing);
    var t = d3.layout.tree();
    var tree_nodes  = t.nodes(nodes);

    var maxSize = tree_nodes[0].size;
      
    var scaleY = function(y) { return y*(height - (2*padding))+padding }
    var scaleX = function(x) { return x*(width - (2*padding))+padding }
    var radiusScale = d3.scale.linear().domain([0,maxSize]).range([10,80]);
            
    var vis = d3.select("#chart").append("svg:svg")
      .attr("width",width)
      .attr("height",height);

    var node = vis.selectAll("g.node")
        .data(tree_nodes)
      .enter().append("svg:g")
        .attr("transform", function(d) {return "translate("+scaleX(d.x)+","+scaleY(d.y)+")";})

        
    var thingScale = (
        tree_nodes.filter(
          function(node) { return node.depth == 0 }
        )[0].children.map(function(c) { 
          return c.thing;
        }).join("|")+'|'+tree_nodes[0].thing).split("|");



    var thingColor = function(f) {
      return d3.scale.category10().domain(thingScale)(f)
    }



    node.append("svg:circle")
      .attr("class",function(d) {return " node"})
      .attr("dx",0)
      .style("stroke",function(d) { return thingColor(d.thing) })
      .style("stroke-width","5px")
      .style("fill",function(d) { return thingColor(d.thing)})
      .style("display", function(d) { 
        if (!d.children.length) { return "none" } 
      })
      .attr("r",function(d) {  return radiusScale(d.size);  });
      /*
    node.append("svg:path")
      .attr("d", function(d) { 
        if (d.parent) {
          return makeConnector([{x:d.parent.x,y:d.parent.y-.2,thing:d.parent.thing},d]); 
        }
      })
      .attr("transform", function(d) {
        if (d.parent) { 
          var x = - scaleX(d.x);
          var y = - scaleY(d.y);
          return "translate("+x+","+y+")";
        } else {
          return ""
        }
      })
      .style("stroke",function(d) { return thingColor(d.thing)})
      .style("stroke-width","5px")
      .style("display", function(d) { 
        if (!d.children.length) { return "none" } 
      });
    */
    node.selectAll("path")
      .data(function(d) { 
        var start_angle = 0;
        return d.children.map(function(c) {
          var obj = {
            start_angle : start_angle,
            end_angle : start_angle + (2*Math.PI*c.size/d.size),
            thing : c.thing,
            radius : radiusScale(d.size) - 3,
            obj : c
          };
          start_angle = obj.end_angle;
          return obj;
        });
      },function() { return Math.random(); })
      .enter().append("svg:path")
      .attr("class", function(d) { return d.thing })
      .attr("d", function(d,i) { 
        return makeArc(d.start_angle, d.end_angle, d.radius)
      })
      .style("stroke","white")
      .style("fill",function(d) { 
        return thingColor(d.thing);
      })
      .attr("data-ot",function(d) { 
        var getList = function(node,list) {
          if (!node.parent) {
            list.push(node.thing+"("+node.size+")");
            return list;
          } else {
            list = getList(node.parent,list);
            list.push(node.thing+"("+node.size+")");
            return list;
          }
        }
        var getTotal = function(node,sum) {
          if (!node.parent) {
            return sum+node.size;
          } else {
            sum = getTotal(node.parent,sum);
            return sum+node.size;
          }
        }
        return getList(d.obj,[]).join("<br>") +"<br>total="+getTotal(d.obj,0);
      })
      .attr("data-ot-fixed","false");
      

    }

  return ordering_graph;
});
