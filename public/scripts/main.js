require(['ordering_graph','sampledata','lib/socket.io','lib/tooltip'],
function(ordering_graph,sampledata,socketio,tooltip) {

    var d = sampledata();
    ordering_graph({
      data : d,
      topThing : 'dre',
    });

});
