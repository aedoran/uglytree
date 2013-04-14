define(['/scripts/lib/d3.js','/scripts/underscore.js'],
    function(d3,_) {

  var ordering_graph = function(args) {


    var width = args.width ? args.width : 800,
        height = args.height ? args.height : 600,
        data = args.data ? args.data : [], 
        padding = args.padding ? args.padding : 0, 
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

    //turns data into:
    //
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

   
    var nodeify = function(data, filter, depth,thing, results) {
      var filtered = data.filter(filter);
      var things = _.keys(_.groupBy(filtered,function(f) { return f[(depth+1)] })).filter(function(k) { return k });
      if (filtered.length && things.length > 1) {
        results.push({
          size : filtered.length,
          data : _.groupBy(filtered,function(d) { return d[(depth+1).toString()] }),
          depth : depth,
          thing : thing
        });

        for (var a = 0; a<things.length;a++) {
          var func = function(f) {
            return f[(depth+1).toString()] == things[a];
          }
          if (things[a]) {
            nodeify(filtered,func,depth+1,things[a],results);
          }
        }
      }
      return results;
    } 

    var makeNodeData = function(data,topThing) {
      var things = findThings(data);
      var flattened = flattenById(data);

      return nodeify(flattened,function(f) { return f['0'] == topThing },0,topThing,[]);

    }

    var addNodeDisplayInfo = function(nodes) {

      var tree = { 
        data : nodes[0]
      };
    

      var addChildren = function(nodes,tree) {
        tree.children = [];
        _.keys(tree.data.data).forEach(function(k) {
            sub = _.find(nodes,function(n) { return n.thing = k && n.depth == tree.data.depth +1})
            console.log(sub);
            if (sub) { tree.children.push({ data: sub}); }
        })

        tree.children.forEach(function(c) { 
          addChildren(nodes,c);
        })
      }

      addChildren(nodes,tree); 

      var t = d3.layout.tree();
      t.nodes(tree);

      
      var populateNodesWithXY = function(nodes,obj) {
        sub = _.find(nodes,function(n) { return obj.data.depth == n.depth && obj.data.thing == n.thing });
        sub.x = obj.x;
        sub.y = obj.y;
        obj.children.forEach(function(s) {
          populateNodesWithXY(nodes,s);
        });
      } 
      populateNodesWithXY(nodes,tree);

    }

    nodes = makeNodeData(data,topThing);
    console.log(nodes);
    addNodeDisplayInfo(nodes);


        

  }
  return ordering_graph;
});
