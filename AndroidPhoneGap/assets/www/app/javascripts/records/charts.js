(function(swim) {
  swim.records.charts = {
    initiate: function() {
      $("#charts").live("pageshow", _.bind(this.render, this));
    },

    getCumulativeCalories: function(year, month) {
      var cumulative_calories = 0;
      return _.map(_.range(1, swim.records.getDaysInMonth(year, month) + 1), function(date) {
        cumulative_calories += _.reduce(swim.records.getRecords(new Date(year, month, date)), function(calories, record) {
          return calories + swim.records.calculateCalories(record);
        }, 0);
        return cumulative_calories;
      });			
    },

    clear: function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    getX: function(x) {
      return this.paddingLeft +
        (
          this.ylim[1] > this.ylim[0] ?
            (x - this.ylim[0]) / (this.ylim[1] - this.ylim[0]) * (this.canvas.width - this.paddingRight - this.paddingLeft) :
            0
        );
    },
		
    getY: function(y) {
      return this.paddingTop +
        (
          this.xlim[1] > this.xlim[0] ?
            (y - this.xlim[0]) / (this.xlim[1] - this.xlim[0]) * (this.canvas.height - this.paddingBottom - this.paddingTop) :
            0
        );
    },
    renderFrame: function() {
      this.context.beginPath();
      this.context.moveTo(this.paddingLeft, this.getY(this.xlim[0]));
      this.context.lineTo(this.canvas.width - this.paddingRight, this.getY(this.xlim[0]));
      this.context.closePath();
      this.context.strokeStyle = this.frameColor;
      this.context.lineWidth= "1";
      this.context.stroke();
    },

    renderGrid: function() {
      this.context.beginPath();
      for (var i = 0; i < this.YTick.length; ++i) {
        this.context.moveTo(this.getX(this.YTick[i]), this.getY(this.xlim[0]));
        this.context.lineTo(this.getX(this.YTick[i]), this.getY(this.xlim[1]));
      }
			this.context.closePath();
			this.context.strokeStyle = this.gridColor;
			this.context.lineWidth= "1";
      this.context.stroke();
    },

    renderBackground: function() {
      _.each(this.backgroundColors, _.bind(function(color) {
        if (color[0] < this.ylim[1]) {
          this.context.fillStyle = color[1];
          this.context.fillRect(
            this.getX(color[0]),
            this.getY(this.xlim[0]),
            this.getX(this.ylim[1]) - this.getX(color[0]),
            this.getY(this.xlim[1]) - this.getY(this.xlim[0])
          );
        }
      }, this));
    },

    renderXAxis: function() {
      this.context.save();
      this.context.translate(this.canvas.width, 0);
      this.context.rotate(Math.PI/2);
      this.context.textAlign = "center";
      this.context.textBaseline = "top";
			this.context.fillStyle = this.textColor;
			for (var i = 0; i < this.XTick.length; ++i) {
        this.context.fillText(this.XTickLabel[i], this.getY(this.XTick[i]), this.canvas.width - this.paddingLeft + this.space);
      }
      this.context.textBaseline = "bottom";
      this.context.fillText(this.xLabel, this.paddingTop + (this.canvas.height - this.paddingTop - this.paddingBottom) / 2, this.canvas.width - this.space);
      this.context.restore();
    },

    renderYAxis: function() {
      this.context.save();
      this.context.textAlign = "center";
      this.context.textBaseline = "top";
			this.context.fillStyle = this.textColor;
      this.context.fillText(this.yLabel, this.paddingLeft + (this.canvas.width - this.paddingLeft - this.paddingRight) / 2, this.space);
      this.context.translate(this.canvas.width, 0);
      this.context.rotate(Math.PI/2);
      this.context.textAlign = "end";
      this.context.textBaseline = "middle";
			for (var i = 0; i < this.YTick.length; ++i) {
        this.context.fillText(this.YTickLabel[i], this.paddingTop - this.space, this.canvas.width - this.getX(this.YTick[i]));
      }
      this.context.restore();
    },

    renderAxes: function() {
      this.renderXAxis();
      this.renderYAxis();
    },

    renderPoints: function() {
      for (var i = 0; i < this.x.length; ++i) {
        this.context.beginPath();
        this.context.arc(this.getX(this.y[i]), this.getY(this.x[i]), this.radius, 0, Math.PI * 2, true);
        this.context.closePath();
        this.context.fillStyle = this.pointColor;
        this.context.fill();
      }
    },

    renderLine: function() {
      for (var i = 0; i < this.x.length - 1; ++i) {
        this.context.beginPath();
        this.context.moveTo(this.getX(this.y[i]), this.getY(this.x[i]));
        this.context.lineTo(this.getX(this.y[i+1]), this.getY(this.x[i+1]));
        this.context.closePath();
        this.context.strokeStyle = this.lineColor;
				this.context.lineWidth= "2";
        this.context.stroke();
      }
    },

    render: function() {
			var date = swim.records.current_date;
      var month = date.getMonth();
      var year = date.getFullYear();

			this.x = _.range(1, swim.records.getDaysInMonth(year, month) + 1);
			this.y = this.getCumulativeCalories(year, month);
			this.xlim = [_.min(this.x), _.max(this.x)];
			this.ylim = [_.min(this.y), _.max(this.y)];
			this.XTick = this.x;
			this.XTickLabel = _.map(this.XTick, function(date) {
			  var suffix = ["th", "st", "nd", "rd"];
			  return date + (suffix[(date - 20) % 10] || suffix[date] || suffix[0]);
			});
			this.YTick = _.range(this.ylim[0], this.ylim[1] + 1, parseInt(this.ylim[1] / 5));
			this.YTickLabel = this.YTick;
			this.paddingBottom = 15;
			this.paddingLeft = 35;
			this.paddingRight = 15;
			this.paddingTop = 50;
			this.backgroundColors = [
			  [0, "#666666"],
			  [500, "#AE57A4"],
			  [2000, "#EAC100"],
			  [2300, "#FF8000"],
			  [2500, "#FF0000"]
			];
			this.frameColor = "#CCFFFF";
			this.gridColor = "#CCFFFF";
			this.pointColor = "#D5DDF3";
			this.lineColor = "#FFFFFF";
			this.titleColor = "#000000";
			this.textColor = "#FFFFFF";
			this.xLabel = "日期";
			this.yLabel = "卡路里";
			this.title = "";
			this.space = 5;
			this.radius = 2;

      $("#charts .title").text(year + "年" +(month + 1) + "月");
			$("#charts canvas").attr({
				height: Math.max(1000, window.innerHeight - $("#charts .ui-header").outerHeight(true) - $("#charts .ui-footer").outerHeight(true)),
				width: window.innerWidth
      });
      this.canvas = $("#charts canvas").get(0);
      this.context = this.canvas.getContext("2d");
      this.clear();
      this.renderBackground();
      this.renderGrid();
      this.renderFrame();
      this.renderAxes();
      this.renderLine();
      this.renderPoints();
    }
  };
})(swim);