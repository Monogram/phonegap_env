(function(swim) {
  swim.records.create = {
    initiate: function() {
      $("#create").live( "pageinit", function(){
        $("#create .create").die("click").live("click", function() {
          var date = $("#create .calendar").val().split(/\//);
          var key = [parseInt(date[1], 10), parseInt(date[0], 10) - 1, date[2]].join("-");
          var minutes = parseInt($("#create #minutes").val(), 10);
          var meters = parseInt($("#create #meters").val(), 10);
          var stroke = $("#create input[name=strokes]:checked").val();
          var records = swim.storage.get("records") || {};
          if (!records[key]) {
            records[key] = [];
          }
          var found = false;
          _.each(records[key], function(record) {
            if (record.stroke === stroke) {
              record.meters = record.meters + meters;
              record.minutes = record.minutes + minutes;
              found = true;
              return false;
            }
          });
          if (!found) {
            records[key].push({
              meters: meters,
              minutes: minutes,
              stroke: stroke
            });
          }
          swim.storage.set("records", records);
        });
      });

      $("#create").live("pageshow", _.bind(this.render, this));
    },
    render: function() {
      $("#create .calendar").replaceWith($("<div>").addClass("calendar"));
      $("#create .calendar").datepicker({
        defaultDate: swim.records.current_date,
        showOtherMonths: true,
        beforeShowDay: function(date) {
          var records = swim.storage.get("records");
          return [true,
            records &&
            records[date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear()] &&
            records[date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear()].length > 0 ?
            "has-events" :
            ""
          ];
        },
        onSelect: function(dateText) {
          swim.records.current_date = swim.records.dateTextToDate(dateText);
        }
      });
    }
  };
})(swim);
