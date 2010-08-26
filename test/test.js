// pre-call set up
var opts = {
  mydefs: {columns: 3, autoWidth: true, gutter: 20},
  mylist: {columns: 4, autoWidth: true},
  yourlist: {
      columns: 2, 
      columnClass: 'dummy', 
      columnWrapperClass: 'dummy-wrapper'
    }
  };
    
var mydefs = $('.mydefs'),
    mylist = $('.mylist'),
    yourlist = $('.yourlist');
    

var preItems = {
  dt: mydefs.children('dt').length,
  'dt and dd': mydefs.children().length,
  dd: mydefs.children('dd').length,  
  li: mylist.children().length,
  p: yourlist.children().length
};
var preCols = {
  mydefs: mydefs.length,
  mylist: mylist.length,
  yourlist: yourlist.length
};

// call the columns method
mydefs.columns(opts.mydefs);
mylist.columns(opts.mylist);
yourlist.columns(opts.yourlist);

// post-call setup
mydefs = $('.mydefs'),
mylist = $('.mylist'),
yourlist = $('.yourlist');

var postItems = {
  dt: mydefs.children('dt').length,
  'dt and dd': mydefs.children().length,
  dd: mydefs.children('dd').length,  
  li: mylist.children().length,
  p: yourlist.children().length
};
var postCols = {
  mydefs: mydefs.length,
  mylist: mylist.length,
  yourlist: yourlist.length
};
module('counting');

test('columns', function() {
  $.each(preCols, function(key, val) {
    equals(val*opts[key].columns, postCols[key], 'correct number of columns generated for .' + key);
  });
});

test('children of columns', function() {
  $.each(preItems, function(key, val) {
    equals(preItems[key], postItems[key], 'same number of ' + key + ' items before and after columnizing');
  });
});
test('ordered list numbering', function() {
  equals($('ol.mylist').eq(1).attr('start'), 7, 'second column should start at 7');
  equals($('ol.mylist').eq(2).attr('start'), 12, 'third column should start at 12');
  equals($('ol.mylist').eq(3).attr('start'), 17, 'fourth column should start at 17');
});

