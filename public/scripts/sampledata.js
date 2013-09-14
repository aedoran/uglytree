define(['/scripts/underscore.js'],function(_) {

  var attr = {
    things        : ['dre','weezer', 'ledzepplin','ettajames','nelly'],
    id            : _.range(600),
  }

  return function() {
    var data = [];
    attr.id.forEach(function(id) {
      var numofthings = Math.floor(Math.random()*attr.things.length) + 1;
      var shuffle = _.shuffle(attr.things);
      if (shuffle[4] == 'led zepplin') {
        shuffle[2] = 'led zepplin';
      }
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
