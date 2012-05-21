(function(swim) {
  swim.schedule = {
    initiate: function() {
      $(document).bind( "pageinit", _.bind(function(){
        $("#schedule input[type=checkbox]").unbind("change").bind("change", function(event) {
          var checkbox = $(event.target).closest("input[type=checkbox]");
          var schedule = swim.storage.get("schedule") || {};
          schedule[checkbox.attr("id").replace(/schedule-/, "")] = checkbox.is(":checked");
          swim.storage.set("schedule", schedule);
        });

        $("#schedule .schedule").unbind("click").bind("click", function(event) {
          var li = $(event.target).closest(".schedule");
          li.find(".ui-icon").toggleClass("ui-icon-arrow-d").toggleClass("ui-icon-arrow-u");
          li.next().toggle();
        });

        $("#schedule .submit").unbind("click").bind("click", _.bind(function(event) {
          event.preventDefault();
          var mailto = "mailto:a.tough.swimming.club@gmail.com";
          mailto += "?subject=" + encodeURI("學員評估");
          mailto += "&body=" + encodeURI("姓名: " + $("#schedule #name").val().trim()) + "%0A";
          mailto += encodeURI("電話: " + $("#schedule #phone").val().trim()) + "%0A";
          mailto += encodeURI("年齡: " + $("#schedule #age").val()) + "%0A";
          mailto += "%0A";
          mailto += encodeURI("已選項目:") + "%0A";
          var schedule = swim.storage.get("schedule") || {};
          for (var i = 1; i <= 7; ++i) {
            mailto += "%0A";
            mailto += encodeURI($(".schedule-" + i + " .ui-link-inherit").text().trim()) + "%0A";
            var index = 0;
            for (var j = 1; j <= 6; ++j) {
              if (schedule[i + "-" + j]) {
                mailto += (++index) + ".%20" + encodeURI($("label[for=schedule-" + i + "-" + j + "] .ui-btn-text").text().trim()) + "%0A";
              }
					  }
            if (index === 0) {
              mailto += "--%0A";
            }
          }
          window.location.href = mailto;
        }, this));
      }, this));
      $("#schedule").bind("pageinit", _.bind(this.render, this));
      delete this.initiate;
    },
    render: function() {
      var schedule = swim.storage.get("schedule") || {};
      _.each(schedule, function(checked, id) {
        $("#schedule-" + id).attr("checked", checked).checkboxradio("refresh");
      });
    }
  };
})(swim);
