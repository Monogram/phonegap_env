(function() {	

  var Calendar = function(options) {
    options = options || {};
    this.el = $("<div>").addClass("container");
    this.day_names = options.day_names || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    this.months = options.months || ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.month_names = options.month_names || ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    this.week_start = options.week_start || 0;
    this.getDayContent = options.getDayContent || function() { return ""; };

    var self = this;
    $(".prev, .next").die("click").live("click", function() {
      self.render(parseInt($(this).attr("month"), 10), parseInt($(this).attr("year"), 10));
    });

    $(".bg").die("click").live("click", function() {
      window.location = "index.html#calorie";
    });
  };

  Calendar.prototype = {
    render: function(month, year) {
      month = typeof month === "number" ? month : new Date().getMonth();
      year = typeof year === "number" ? year : new Date().getFullYear();
      this.el.empty().append(
        this.renderHeader(month, year),
        this.renderDaynamesTable(),
        this.renderEventContainer(month, year)
      );
      return this;
    },

    renderHeader: function(month, year) {
      return $("<table>").addClass("header").append(
        $("<tbody>").append(
          $("<tr>").append(
            $("<td>").addClass("prev").attr("month", month === 0 ? 11 : month - 1).attr("year", month === 0 ? year - 1 : year).text("<"),
            $("<td>").addClass("htitle").text(this.months[month] + " " + year),
            $("<td>").addClass("next").attr("month", month === 11 ? 0 : month + 1).attr("year", month === 11 ? year + 1 : year).text(">")
          )
        )
      );
    },

    renderDaynamesTable: function() {
      return $("<table>").addClass("daynames-table").append(
        $("<tbody>").append(
          $("<tr>").append(
            $.map(this.day_names, function(day_name) {
              return $("<th>").addClass("dayname").text(day_name).get(0);
            })
          )
        )
      );
    },

    renderEventContainer: function(month, year) {
      var start = Calendar.date.getClosestDayOfWeek(
        new Date(year, month, 1),
        this.week_start,
        -1
      );
      var end = Calendar.date.getClosestDayOfWeek(
        new Date(year, month, Calendar.date.getDaysInMonth(year, month)),
        (this.week_start + 6) % 7,
        1
      );
      
      var event_container = $("<div>").addClass("event-container");
      var num_of_rows = ((end - start) / (1000 * 60 * 60 * 24) + 1) / 7;
      for (var r = 0; r < num_of_rows; ++r) {
        event_container.append(
          this.renderMonthRow(
            Calendar.date.addDays(start, r * 7),
            Calendar.date.addDays(start, r * 7 + 6),
            r === 0,
            month
          ).css({
            top: r * 100 / num_of_rows + "%",
            height: 100 / num_of_rows + "%"
          })
        );
      }
      return event_container;
    },

    renderMonthRow: function(start, end, top, month) {
      return $("<div>").addClass("month-row").append(
        this.renderBgTable(start, end),
        this.renderGrid(start, end, top, month)
      );
    },

    renderBgTable: function(start, end) {
      var tds = [];
      for (var d = start; d <= end; d = Calendar.date.addDays(d, 1)) {
        tds.push($("<td>").addClass("bg").attr("date", d.getDate()).attr("month", d.getMonth()).attr("year", d.getFullYear()).html(this.getDayContent(d)).get(0));
      }
      return $("<table>").attr("cellspacing", "0").attr("cellpadding", "0").addClass("bg-table").append(
        $("<tbody>").append(
          $("<tr>").append(
            tds
          )
        )
      );
    },

    renderGrid: function(start, end, top, month) {
      var tds = [];
      for (var d = start; d <= end; d = Calendar.date.addDays(d, 1)) {
        var td = $("<td>").addClass("dtitle").text((1 === d.getDate() ? this.month_names[d.getMonth()] + " " : "") + d.getDate());
        if (top) td.addClass("dtitle-fr");
        if (month !== d.getMonth()) td.addClass("dtitle-nonmonth");
        tds.push(td.get(0));
      }
      return $("<table>").attr("cellspacing", "0").attr("cellpadding", "0").addClass("grid").append(
        $("<tbody>").append(
          $("<tr>").append(
            tds
          )
        )
      );
    }
  };

  Calendar.date = {
    isLeapYear: function (year) {
      return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
    },

    getDaysInMonth: function (year, month) {
      return [31, (this.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    },

    clone: function(date) {
      return new Date(date.getTime());
    },

    addDays: function (date, value) {
      var c_date = this.clone(date)
      c_date.setDate(date.getDate() + value);
      return c_date;
    },

    getFirstDayOfMonth: function (date) {
      this.clone(date).setDate(1);
      return date;
    },

    getLastDayOfMonth: function (date) {
      return this.addDays(date, this.getDaysInMonth(date.getFullYear(), date.getMonth()) - date.getDate());
    },
	
    getClosestDayOfWeek: function (date, dayOfWeek, orient) {
      var diff = (dayOfWeek - date.getDay() + 7 * (orient || +1)) % 7;
      return this.addDays(date, diff);
    }
  }

  this.Calendar = Calendar;

}).call(this);
