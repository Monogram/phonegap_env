(function() {	

  var Charts = function(options) {
    options = options || {};
    this.y = options.y || [];
    this.x = [];
    if (options.x) {
      this.x = options.x;
    } else {
      for (var i in this.y) {
        this.x.push(i);
      }
    }
    this.xlim = options.xlim || [Math.min.apply(null, this.x), Math.max.apply(null, this.x)];
    this.ylim = options.ylim || [Math.min.apply(null, this.y), Math.max.apply(null, this.y)];
    this.XTick = options.XTick || this.x;
    this.XTickLabel = options.XTickLabel || this.XTick;
    this.YTick = options.YTick ? options.YTick : this.ylim;
    this.YTickLabel = options.YTickLabel || this.YTick;
    this.paddingBottom = options.paddingBottom || 50;
    this.paddingLeft = options.paddingLeft || 50;
    this.paddingRight = options.paddingRight || 25;
    this.paddingTop = options.paddingTop || 30;
    this.frameColor = options.frameColor || "#000000";
    this.gridColor = options.paddingTop || "#AAAAAA";
    this.pointColor = options.pointColor || "#D5DDF3";
    this.lineColor = options.lineColor || "#0000FF";
    this.titleColor = options.titleColor || "#000000";
    this.xLabel = options.xLabel || "";
    this.yLabel = options.yLabel || "";
    this.title = options.title || "";
    this.space = options.space || 10;
    this.radius = options.radius || 5;
  };

  Charts.prototype = {

    clear: function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    getX: function(x) {
      return this.paddingLeft + x / (this.xlim[1] - this.xlim[0]) * (this.canvas.width - this.paddingRight - this.paddingLeft);
    },

    getY: function(y) {
      return this.paddingTop + (this.ylim[1] - y) / (this.ylim[1] - this.ylim[0]) * (this.canvas.height - this.paddingBottom - this.paddingTop);
    },

    renderFrame: function() {
      this.context.beginPath();

      // bottom
      this.context.moveTo(this.getX(this.xlim[0]), this.getY(this.ylim[0]));
      this.context.lineTo(this.getX(this.xlim[1]), this.getY(this.ylim[0]));
      
      // left
      this.context.moveTo(this.getX(this.xlim[0]), this.getY(this.ylim[0]));
      this.context.lineTo(this.getX(this.xlim[0]), this.getY(this.ylim[1]));

      // right
      this.context.moveTo(this.getX(this.xlim[1]), this.getY(this.ylim[0]));
      this.context.lineTo(this.getX(this.xlim[1]), this.getY(this.ylim[1]));

      // top
      this.context.moveTo(this.getX(this.xlim[0]), this.getY(this.ylim[1]));
      this.context.lineTo(this.getX(this.xlim[1]), this.getY(this.ylim[1]));

      this.context.closePath();
      this.context.strokeStyle = this.frameColor;
      this.context.stroke();
    },

    renderGrid: function() {
      this.context.beginPath();
      var i = 0;
      for (i = 0; i < this.XTick.length; ++i) {
        this.context.moveTo(this.getX(this.XTick[i]), this.getY(this.ylim[0]));
        this.context.lineTo(this.getX(this.XTick[i]), this.getY(this.ylim[1]));        
      }

      for (i = 0; i < this.YTick.length; ++i) {
        this.context.moveTo(this.getX(this.xlim[0]), this.getY(this.YTick[i]));
        this.context.lineTo(this.getX(this.xlim[1]), this.getY(this.YTick[i]));
      }

      this.context.closePath();
      this.context.strokeStyle = this.gridColor;
      this.context.stroke();
    },

    renderXAxis: function() {
      this.context.textAlign = "center";
      this.context.textBaseline = "top";
      for (var i = 0; i < this.XTick.length; ++i) {
        this.context.fillText(this.XTickLabel[i], this.getX(this.XTick[i]), this.canvas.height - this.paddingBottom + this.space);
      }
      this.context.textBaseline = "bottom";
      this.context.fillText(this.xLabel, this.paddingLeft + (this.canvas.width - this.paddingRight - this.paddingLeft) / 2, this.canvas.height - this.space);
    },

    renderYAxis: function() {
      this.context.textAlign = "end";
      this.context.textBaseline = "middle";
      for (var i = 0; i < this.YTick.length; ++i) {        
        this.context.fillText(this.YTickLabel[i], this.paddingLeft - this.space, this.getY(this.YTick[i]));
      }
      this.context.save();
      this.context.translate(0, this.canvas.height);
      this.context.rotate(-Math.PI / 2);
      this.context.textAlign = "center";
      this.context.textBaseline = "top";
      this.context.fillText(this.yLabel, this.paddingBottom + (this.canvas.height - this.paddingBottom - this.paddingTop) / 2, this.space);
      this.context.restore();
    },

    renderAxes: function() {
      this.renderXAxis();
      this.renderYAxis();
    },

    renderPoints: function() {
      for (var i = 0; i < this.x.length; ++i) {
        this.context.beginPath();
        this.context.arc(this.getX(this.x[i]), this.getY(this.y[i]), this.radius, 0, Math.PI * 2, true);
        this.context.closePath();
        this.context.fillStyle = this.pointColor;
        this.context.fill();
      }
    },

    renderLine: function() {
      for (var i = 0; i < this.x.length - 1; ++i) {
        this.context.beginPath();
        this.context.moveTo(this.getX(this.x[i]), this.getY(this.y[i]));
        this.context.lineTo(this.getX(this.x[i+1]), this.getY(this.y[i+1]));
        this.context.closePath();
        this.context.strokeStyle = this.lineColor;
        this.context.stroke();
      }
    },

    renderTitle: function() {
      this.context.textAlign = "center";
      this.context.textBaseline = "top";
      this.context.fillStyle = this.titleColor;
      this.context.fillText(this.title, this.paddingLeft + (this.canvas.width - this.paddingRight - this.paddingLeft) / 2, this.space);
    },

    plot: function(canvas) {
      this.canvas = canvas;
      this.context = this.canvas.getContext("2d");
      this.clear();
      this.renderGrid();
      this.renderFrame();
      this.renderAxes();
      this.renderLine();
      this.renderPoints();
      this.renderTitle();
    }
  }

  Charts.plot = function(canvas) {
    new Charts().plot(canvas);
  }

  this.Charts = Charts;

}).call(this);
