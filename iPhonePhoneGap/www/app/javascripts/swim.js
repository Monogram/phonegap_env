(function() {
  this.swim = {
    initiate: function() {
      this.poster.initiate();
      this.schedule.initiate();
      this.records.initiate();
      this.information.initiate();
      this.content.initiate();
      this.footer.initiate();
      delete this.initiate;
    }
  };
}).call(this);
