(function(swim) {
  swim.storage = {
    set: function(key, value) {
      return window.localStorage.setItem(key, JSON.stringify(value));
    },
    get: function(key) {
      return JSON.parse(window.localStorage.getItem(key));
    }
  };
})(swim);
