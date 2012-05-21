(function(swim) {
  swim.information.pools = {
    initiate: function() {
      $(document).bind( "pageinit", function(){
        $(".to-pool").unbind("click").bind("click", function(event) {
          var obj = $(event.target);
          var area = obj.closest(".page").attr("id");
          var pool = swim.data.pools[obj.closest(".to-pool").attr("pool-id")];
          swim.information.pool.render(pool);

          $(".header").hide();
          $(".header#header-pool").show();
          $(".header#header-pool").find(".to-page").attr("target", area);
          $(".header#header-pool").find("h1").html(pool["venue"]);

          $(".page").hide();
          $(".page#pool").show();
          swim.content.myScroll.refresh();
        });
      });
    }
  };
})(swim);
