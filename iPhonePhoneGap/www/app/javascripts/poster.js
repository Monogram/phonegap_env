(function(swim) {
  swim.poster = {
    initiate: function() {
      $(document).bind("pageinit", _.bind(function(){
        _.defer(this.resizeContent);
      }, this));
      delete this.initiate;
    },
    resizeContent: function() {
        var img_width = 1536;
        var img_height = 1652;
        var height = window.innerHeight -
          $(".ui-header:visible").outerHeight(true) -
          $(".ui-footer:visible").outerHeight(true) -
          $(".ui-content:visible").outerHeight(true) +
          $(".ui-content:visible").height();
        height = Math.min(height, img_height);
        var width = img_width / img_height * height;
        if (width > window.innerWidth) {
          width = window.innerWidth;
          height = img_height / img_width * width;
        }
        $("#poster .poster").css({
          "background-size":  width + " " + height,
          "height": height
        });
    }
  };
})(swim);
