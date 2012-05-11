(function(swim) {
  swim.records.list = {
    initiate: function() {
      $("#list").live( "pageinit", _.bind(function(){
        $("#list .prev").die("click").live("click", _.bind(function() {
          var date = swim.records.current_date;
          var month = date.getMonth();
          var year = date.getFullYear();
          swim.records.current_date = new Date(
            month === 0 ? year - 1 : year,
            month === 0 ? 11 : month - 1,
            1
          );
          this.render();
        }, this));

        $("#list .next").die("click").live("click", _.bind(function() {
          var date = swim.records.current_date;
          var month = date.getMonth();
          var year = date.getFullYear();
          swim.records.current_date = new Date(
            month === 11 ? year + 1 : year,
            month === 11 ? 0 : month + 1,
            1
          );
          this.render();
        }, this));
      }, this));

      $("#list").live("pageshow", _.bind(this.render, this));
    },
    render: function() {
      var date = swim.records.current_date;
      var month = date.getMonth();
      var year = date.getFullYear();
      $("#list .title").text(year + "年" +(month + 1) + "月");
			var month_records = this.getMonthRecords(year, month);
			var total_calories = _.reduce(month_records, function(total_calories, month_record) {
				return total_calories + _.reduce(month_record.records, function(total_calories, record) {
					return total_calories + swim.records.calculateCalories(record);
				}, 0);
			}, 0);
      $("#list .records").empty().append(
        _.flatten(this.renderRecords(month_records)).concat(
					$("<li data-role=\"list-divider\" style=\"text-align: center;\">共" + total_calories + "卡</li>").get(0)
				)
      ).listview("refresh");
    },	
    getMonthRecords: function(year, month) {
      return _.compact(_.map(_.range(1, swim.records.getDaysInMonth(year, month) + 1), function(date) {
				var records = swim.records.getRecords(new Date(year, month, date));
				if (records.length > 0) {
					return {
						date: date,
						records: records
					};
				}
			}));	
    },
    renderRecords: function(records) {
      return _.map(records, _.bind(function(date_records) {
        return this.renderDateRecord(date_records);
      }, this));
    },
    renderDateRecord: function(date_records) {
			var lis = [$("<li data-role=\"list-divider\">" + date_records.date + "/" + (swim.records.current_date.getMonth() + 1) + "</li>").get(0)];
			_.each(date_records.records, function(record) {
				var stroke = {
					"breaststroke": "蛙式",
					"freestyle": "自由式",
					"backstroke": "背泳",
					"butterfly-stroke": "蝶泳",
					"other": "其他"
				}[record.stroke];
			  lis.push($("<li stroke=\"" + record.stroke + "\"><span>" + record.meters + "米" + stroke + " (" + record.minutes + "分鐘)</span><span style=\"float: right;\">" + swim.records.calculateCalories(record) + "卡</span></li>").get(0));
			});
      return lis;
		}
  };
})(swim);
