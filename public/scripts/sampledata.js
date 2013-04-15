define(['/scripts/underscore.js'],function(_) {

  var attr = {
    things        : ['dre','awesome','weezer', 'led zepplin', 'tony', 'misfits'],
    order         : _.range(6), 
    id            : _.range(1000),
  }

  return function(num) {
    var data = [];

    attr.id.forEach(function(id) {
      var numofthings = Math.floor(Math.random()*6) + 1;
      var shuffle = _.shuffle(attr.things);
      _.range(numofthings).forEach(function(order) {
        data.push({
          id : id,
          order : order,
          thing :  shuffle[order]
        });
      });
    });

    return data;
  }

});
