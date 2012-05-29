(function(swim) {
  swim.information.pool = {
    sections: [
      "address",
      "enquiries",
      "facilities",
      "opening_schedule",
      "temporary_closure_for_annual_maintenance",
      "weekly_cleansing_day",
      "notes"
    ],
    render: function(pool) {
      _.each(this.sections, function(section) {
        $("#pool .pool-" + section).empty().append(
          _.map(pool[section], function(sentence) {
            return $("<p>").html(sentence).get(0);
          })
        );
      });
    }
  };
})(swim);
