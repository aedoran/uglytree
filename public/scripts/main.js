require(['ordering_graph','sampledata','lib/socket.io'],
    



    function(ordering_graph,sampledata,socketio) {

//console.log(sampledata(100));
    console.log(sampledata(10));
    ordering_graph({
      data : sampledata(100),
      topThing : 'tony',
    });
    /*
    vennison(
    { 
      width   : 1050,
      height  : 800,
      data    : sampledata(20000),
      filters :  [
        { 
          name   : "test",
          filter : function(user) { return user.notes_num > 70 },
          color  : "#A2A6FE"
        }, 
        { 
          name   : "test1",
          filter : function(user) { return user.notes_num < 70 },
          color  : "#B2A6FE"
        }, 
        { 
          name   : "test2",
          filter : function(user) { return user.notes_num > 30 },
          color  : "#C2A6FE"
        }, 
        { 
          name   : "test3",
          filter : function(user) { return user.notes_num < 30 },
          color  : "#D2A6FE"
        }, 
        { 
          name   : "test4",
          filter : function(user) { return user.notes_num > 50 },
          color  : "#E2A6FE"
        }, 
        { 
          name   : "test5",
          filter : function(user) { return user.notes_num < 50 },
          color  : "#F2A6FE"
        }, 
        { 
          name   : "test6",
          filter : function(user) { return user.key_chagnes < 2  },
          color  : "#F2A6FE"
        }, 
        { 
          name   : "test7",
          filter : function(user) { return user.key_chagnes > 2  },
          color  : "#F2A6FE"
        }, 
          

    ],
      
    });
    */

});
