(function(swim) {
  swim.records = {
    current_date: new Date,
    initiate: function() {
      this.calendar.initiate();
      this.charts.initiate();
      this.create.initiate();
      this.list.initiate();
    },
    isLeapYear: function (year) {
      return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
    },
    getDaysInMonth: function (year, month) {
      return [31, (this.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    },
    getRecords: function(date) {
      date = _.isString(date) ? this.dateTextToDate(date) : date;
      return (swim.storage.get("records") || {})[[date.getDate(), date.getMonth(), date.getFullYear()].join("-")] || [];
    },
    dateTextToDate: function(dateText) {
      var d = dateText.split(/\//);
      return new Date(d[2], parseInt(d[0], 10) - 1, d[1]);
    },
    calculateCalories: function(record) {
      return record.minutes / 60 * 350;
    }
  };
})(swim);
