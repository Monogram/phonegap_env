(function(swim) {
  swim.records.list = {
    initiate: function() {
      $(document).bind( "pageinit", _.bind(function(){
        $("#header-list .prev").unbind("click").bind("click", _.bind(function() {
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

        $("#header-list .next").unbind("click").bind("click", _.bind(function() {
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
				
				$("#list .to-charts").unbind("click").bind("click", _.bind(function() {
          swim.records.charts.render();					
          $(".header").hide();
          $(".header#header-charts").show();
          $(".page#list").hide();
          $(".page#charts").show();
          swim.content.myScroll.refresh();
        }, this));
				
				this.render();
      }, this));
      delete this.initiate;
    },
    render: function() {
      var date = swim.records.current_date;
      var month = date.getMonth();
      var year = date.getFullYear();
      $("#header-list .title").text(year + "年" +(month + 1) + "月");
			var month_records = this.getMonthRecords(year, month);
      var total_meters = _.reduce(month_records, function(total_meters, month_record) {
        return total_meters + _.reduce(month_record.records, function(total_meters, record) {
          return total_meters + record.meters;
        }, 0);
      }, 0);
			var total_calories = _.reduce(month_records, function(total_calories, month_record) {
				return total_calories + _.reduce(month_record.records, function(total_calories, record) {
					return total_calories + swim.records.calculateCalories(record);
				}, 0);
			}, 0);
      $("#list .records").empty().append(
        _.flatten(this.renderRecords(month_records)).concat(
          $("<li data-role=\"list-divider\"><span>共" + total_meters + "米</span><span style=\"float: right;\">共" + Math.round(total_calories) + "卡</span></li>").get(0)
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
			  lis.push($("<li stroke=\"" + record.stroke + "\"><span>" + record.meters + "米" + stroke + " (" + record.minutes + "分鐘)</span><span style=\"float: right;\">" + Math.round(swim.records.calculateCalories(record)) + "卡</span></li>").get(0));
			});
      return lis;
		}
  };
})(swim);
