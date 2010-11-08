/*!
 * jQuery Columns Plugin v1.0
 *
 * Date: Thu Aug 26 00:37:22 2010 -0400
 * Requires: jQuery v1.2.6+
 *
 * Copyright 2010, Karl Swedberg
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * 
 * 
 *
*/

(function($) {
$.fn.columns = function(options) {
  var opts = $.extend(true, {}, $.fn.columns.defaults, options);

  var roundUp = Math.ceil,
      roundDown = Math.floor;

  var utils = {
    calculateWidths: function($column, info) {
      if (!opts.autoWidth) { return; }
      var fluff = 0;
      $.each(['paddingLeft', 'paddingRight', 'marginLeft', 'borderLeftWidth', 'borderRightWidth'], function(index, val) {
        fluff += ( parseInt($column.css(val), 10) || 0);
      });

      fluff = (fluff * opts.columns) + (opts.gutter * (opts.columns-1));
      var cssProps = {
        width: roundDown( (info.containerWidth - fluff)  / opts.columns ),
        marginRight: info.last ? 0 : opts.gutter
      };
      $column.css(cssProps);
    },
    buildColumn: function(colInfo, items) {
      var parentClass = colInfo.cname + opts.columnClass + ' ' + opts.columnClass + '-' + colInfo.col;
      var $column = $('<' + colInfo.nname + ' class="' + parentClass + '">' + '</' + colInfo.nname + '>')
      .append($(items));

      utils.calculateWidths($column, colInfo);

      if (colInfo.last) {
        $column.addClass(opts.columnClass + '-last last');
      }

      // insert the column in the appropriate place
      $column[colInfo.insertType](colInfo.wrapper);

      return $column;
    }
  };

  var columnizer = {
    dl: function($terms, colInfo) {

       $terms.each(function(index) {
          var dds = $(this).nextUntil('dt');
          var items = $(this);
          items = items.add( dds );
          colInfo.col = index+1;

          colInfo.last = colInfo.col == $terms.length;
          utils.buildColumn(colInfo, items);
        });
    },
    standard: function($kids, colInfo) {
      var items = $([]),
          start = 1;
      $kids.each(function(i) {

        var itemStart = roundUp(colInfo.length*(colInfo.col));
        var readytobuild = i >= itemStart -1 || i >= colInfo.klength-1;
        var readywithdt = readytobuild && this.nodeName == 'DT';

        if (!readywithdt) {
          items = items.add(this);
        }
        if (readytobuild) {

          colInfo.last = i >= colInfo.klength-1;

          var $column = utils.buildColumn(colInfo, items);

          if ($column[0].nodeName == 'OL' && colInfo.col > 1) {
            $column.attr('start', start);
          }

          items = $(readywithdt ? this : []);
          colInfo.col++;
          start = itemStart+1;
        }

      });
    }
  };

  this.each(function(event) {
    var $container = $(this),
        $kids = $container.children();

    var colInfo = {
      nname: this.nodeName,
      cname: this.className ? this.className + ' ' : '',
      col: 1,
      containerWidth: $container.width(),
      wrapper: $container,
      insertType: 'insertBefore',
      klength: $kids.length
    };
    colInfo.length = colInfo.klength / opts.columns;

    if (opts.columnWrapper) {
      var cw = opts.columnWrapperClass;

      colInfo.wrapper = $(opts.columnWrapper)
      .addClass(cw + ' ' + cw + '-' + opts.columns)
      .insertBefore($container);
      $.each(['paddingLeft', 'paddingRight', 'marginLeft', 'marginRight', 'borderLeftWidth', 'borderRightWidth'], function(index, val) {
        colInfo.containerWidth -= parseInt(colInfo.wrapper.css(val), 10);
      });
      colInfo.insertType = 'appendTo';
    }

    var $terms = $kids.filter('dt');
    if (colInfo.nname == 'DL' && $terms.length <= opts.columns) {
      columnizer.dl($terms, colInfo);
    } else {
      columnizer.standard($kids, colInfo);
    }

    $container.remove();

  });

  return this;
};

$.fn.columns.defaults = {
  columns: 3,
  autoWidth: false, // set to true if you want the plugin to automatically define widths for you.
  gutter: 0, // if autoWidth is true, set margin-right on all but last column
  columnClass: 'floatcols', // a single class to add to each column element
  columnWrapper: '<div></div>', // set to null if you don't want a wrapper around all columns
  columnWrapperClass: 'column-wrapper'
};

})(jQuery);
