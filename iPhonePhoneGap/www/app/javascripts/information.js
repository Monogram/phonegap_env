(function(swim) {
  swim.information = {
    initiate: function() {
      this.pools.initiate();
      delete this.initiate;
    }
  }
})(swim);
