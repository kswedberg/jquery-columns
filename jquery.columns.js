/***************************************
  Columns jQuery Plugin
   @author Karl Swedberg
   @version 1.0 (November 25, 2009)
   @requires jQuery v1.2.6+

***************************************/


(function($) {
$.fn.columns = function(options) {
  var opts = $.extend(true, {}, $.fn.columns.defaults, options);

  var roundUp = Math.ceil,
      roundDown = Math.floor;

  this.each(function(event) {
    var $container = $(this),
      containerWidth = $container.width(),
      nname = this.nodeName,
      cname = this.className ? this.className + ' ' : '',
      $kids = $container.children(),
      col = 1,
      item = 1,
      items = [],
      colClass = opts.columnClass;

    if (opts.columnWrapper) {
      var cw = opts.columnWrapperClass;
      var $wrap = $(opts.columnWrapper)
        .addClass(cw + ' ' + cw + '-' + opts.columns)
        .insertBefore($container);
    }
    for (var i=0, klength = $kids.length; i < klength; i++) {
      items.push($kids[i]);
      var itemStart = (klength/opts.columns)*col;
      if (i+1 >= itemStart || i === klength-1) {
        item = Math.ceil(itemStart);
        var $parent = $('<' + nname + ' class="' + cname + colClass + ' ' + colClass + '-' + col + '"></' + nname + '>')
          .append($(items));
        var lastCol = i === klength-1;
        
        calculateWidths.call($parent, containerWidth, lastCol);
          
        if (lastCol) {
          $parent.addClass(colClass + '-last last');
        }
        if (opts.columnWrapper) {
          $parent.appendTo($wrap);
        } else {
          $parent.insertBefore($container);
        }
        if ($parent[0].nodeName == 'OL' && col > 1) {
          $parent.attr('start', start);
        }
        col++;
        items = [];
      }
      var start = item+1;
    }

    $container.remove();

  });
  function calculateWidths(containerWidth, last) {
    if (!opts.autoWidth) { return; }
    var fluff = 0, 
        $parent = $(this);
    $.each(['paddingLeft', 'paddingRight', 'marginLeft', 'borderLeftWidth', 'borderRightWidth'], function(index, val) {
      fluff += ( parseInt($parent.css(val), 10) || 0);
    });

    fluff = (fluff * opts.columns) + (opts.gutter * (opts.columns-1));
    var cssProps = {
      width: roundDown( (containerWidth - fluff)  / opts.columns ),
      marginRight: last ? 0 : opts.gutter
    };
    $parent.css(cssProps);
  }
  
  return this;
};

$.fn.columns.defaults = {
  columns: 3,
  autoWidth: false, // set to true if you want the plugin to automatically define widths for you.
  gutter: 0, // if autoWidth is true, set margin-right on all but last column
  columnClass: 'floatcols',
  columnWrapper: '<div></div>', // set to null if you don't want a wrapper around all columns
  columnWrapperClass: 'column-wrapper'
};

})(jQuery);
