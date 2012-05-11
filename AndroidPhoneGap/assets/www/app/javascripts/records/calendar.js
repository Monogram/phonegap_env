(function(swim) {
  swim.records.calendar = {
    initiate: function() {
      $("#calendar").live( "pageinit", _.bind(function(){
        $("#calendar .records li").die("click").live("click", _.bind(function(event) {
          if ($(event.target).closest(".delete").length === 0) {
            $(event.target).closest("li").find(".delete").toggle();
          }
        }, this));

        $("#calendar .records li .delete").die("click").live("click", _.bind(function(event) {
          var records = swim.storage.get("records");
          var date = $("#calendar .calendar").val().split(/\//);
          var key = [parseInt(date[1], 10), parseInt(date[0], 10) - 1, date[2]].join("-");

          _.each(records[key], function(record, i) {
            if (record.stroke === $(event.target).closest("li").attr("stroke")) {
              records[key].splice(i, 1);
              return false;
            }
          });

          swim.storage.set("records", records);
          this.render();
        }, this));
      }, this));

      $("#calendar").live("pageshow", _.bind(this.render, this));
    },
    onSelect: function(dateText) {
			swim.records.current_date = _.isString(dateText) ? swim.records.dateTextToDate(dateText) : dateText;
      $("#calendar .records").empty().append(
        this.renderRecords(swim.records.getRecords(swim.records.current_date))
      ).listview("refresh");
    },
		render: function() {
      $("#calendar .calendar").replaceWith($("<div>").addClass("calendar"));
      $("#calendar .calendar").datepicker({
        defaultDate: swim.records.current_date,
        showOtherMonths: true,
        beforeShowDay: function(date) {
          return [true, swim.records.getRecords(date).length > 0 ? "has-events" : ""];
        },
        onSelect: _.bind(this.onSelect, this)
      });
      this.onSelect(swim.records.current_date);
		},
    renderRecords: function(records) {
      return _.map(records, _.bind(function(record) {
        return this.renderRecord(record).get(0);
      }, this));
    },
    renderRecord: function(record) {
      var stroke = {
        "breaststroke": "蛙式",
        "freestyle": "自由式",
        "backstroke": "背泳",
        "butterfly-stroke": "蝶泳",
        "other": "其他"
      }[record.stroke];
      return $("<li stroke=\"" + record.stroke + "\"><span>" + record.meters + "米" + stroke + " (" + record.minutes + "分鐘)</span><span class=\"delete\" style=\"display: none; float: right;\">刪除</span></li>");
    }
  };
})(swim);
