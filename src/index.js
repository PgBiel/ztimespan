(function(){
  // constants
  var ADD_ERROR = "Unit or quantity must be a Time instance, Date instance, \
string (of unit, if using this add a second argument of the amount of that unit to use) or a number (milliseconds)!";
  var METHODS = ["years", "months", "weeks", "days", "hours", "minutes", "seconds"];
  var ALIASES = {
    years: ["years", "year", "y"],
    year: ["years", "year", "y"],
    y: ["years", "year", "y"],

    months: ["months", "month", "mo"],
    month: ["months", "month", "mo"],
    mo: ["months", "month", "mo"],

    weeks: ["weeks", "week", "w"],
    week: ["weeks", "week", "w"],
    w: ["weeks", "week", "w"],

    days: ["days", "day", "d"],
    day: ["days", "day", "d"],
    d: ["days", "day", "d"],

    hours: ["hours", "hour", "h"],
    hour: ["hours", "hour", "h"],
    h: ["hours", "hour", "h"],

    minutes: ["minutes", "minute", "mins", "min", "m"],
    minute: ["minutes", "minute", "mins", "min", "m"],
    mins: ["minutes", "minute", "mins", "min", "m"],
    min: ["minutes", "minute", "mins", "min", "m"],
    m: ["minutes", "minute", "mins", "min", "m"],

    seconds: ["seconds", "second", "secs", "sec", "s"],
    second: ["seconds", "second", "secs", "sec", "s"],
    sec: ["seconds", "second", "secs", "sec", "s"],
    secs: ["seconds", "second", "secs", "sec", "s"],
    s: ["seconds", "second", "secs", "sec", "s"],
  };
  // compatibility option
  var useCompat = false;
  // map
  var MAP = {
    years: 31104e6,
    months: 2592e6,
    weeks: 6048e5,
    days: 864e5,
    hours: 36e5,
    minutes: 6e4,
    seconds: 1e3
  };
  var MAP_ALT = {
    years: 290304e5,
    months: 24192e5
  };
  var appropriateNum = function(method) {
    let num;
    if (useCompat && method in MAP_ALT) {
      num = MAP_ALT[method];
    } else {
      num = MAP[method];
    }
    return num || 1e3;
  };
  // constructor
  var Time = function(initialVal) {
    this.time = 0;
    if (initialVal == null) {
      initialVal = 0;
    }
    if (this instanceof Time && !this.hasOwnProperty("__constructedTime")) {
      Object.defineProperty(this, "__constructedTime", {
        value: true,
        writable: false,
        configurable: false,
        enumerable: false
      });
      if (initialVal instanceof Date) {
        this.time = initialVal.getTime();
      } else if (initialVal instanceof Time) {
        this.time = initialVal.time;
      } else if (initialVal instanceof Array) {
        if (initialVal.length > 0) {
          for (var i = 0; i < initialVal.length; i += 2) {
            var item;
            try {
              item = initialVal[i].toString();
            } catch (err) {
              item = String(initialVal[i]);
            }
            if (!(item.toLowerCase() in ALIASES)) throw new TypeError('"' + item + '" is not a valid time unit!');
            if (i + 1 > initialVal.length) throw new Error('Amount for time unit "' + item + '" was not given!');
            var amount = initialVal[i + 1];
            if (isNaN(amount)) throw new TypeError('Amount for time unit "' + item + '" is not a number!');
            this.time += Time[ALIASES[item.toLowerCase()][0]](Number(amount));
          }
        }
      } else if (typeof initialVal === "number") {
        this.time = initialVal;
      } else {
        throw new TypeError("Initial value must be either a Date, a Time object, a number (in milliseconds)\
or an array of time unit and their amount.");
      }
    } else {
      return new Time(initialVal);
    }
  };
  Time.validUnit = function(str) {
    if (typeof str !== "string") return false;
    return (str.toLowerCase()) in ALIASES;
  };
  Time.setCompat = function(use) {
    const oldCompat = useCompat;
    useCompat = Boolean(use);
    return oldCompat;
  }
  Time.toggleCompat = function() {
    useCompat = !useCompat;
    return !useCompat;
  }
  Time.Time = Time;
  // methods
  var TP = Time.prototype;
  TP.add = function(unitOrQuantity, amount) {
    if (amount == null) amount = 0;
    if (unitOrQuantity instanceof Time) {
      this.time += unitOrQuantity.time;
    } else if (unitOrQuantity instanceof Date) {
      this.time += unitOrQuantity.getTime();
    } else if (typeof unitOrQuantity === "string") {
      unitOrQuantity = unitOrQuantity.toLowerCase();
      if (!(unitOrQuantity in ALIASES)) throw new TypeError("Invalid unit!");
      if (isNaN(amount)) throw new TypeError("Amount must be a number!");
      amount = Number(amount);
      this.time += Time[ALIASES[unitOrQuantity][0]](amount);
    } else if (typeof unitOrQuantity === "number") {
      if (isNaN(unitOrQuantity)) throw new TypeError("Quantity must not be NaN!");
      this.time += unitOrQuantity;
    } else {
      throw new TypeError(ADD_ERROR);
    }
    if (this.time < 0 || isNaN(this.time)) this.time = 0;
    return this;
  };
  TP.remove = function(unitOrQuantity, amount) {
    if (amount == null) amount = 0;
    if (unitOrQuantity instanceof Time) {
      return this.add(-unitOrQuantity.time);
    } else if (unitOrQuantity instanceof Date) {
      return this.add(-unitOrQuantity.getTime());
    } else if (typeof unitOrQuantity === "string") {
      return this.add(unitOrQuantity, -amount);
    } else if (typeof unitOrQuantity === "number") {
      return this.add(-unitOrQuantity);
    } else {
      throw new TypeError(ADD_ERROR);
    }
  };
  TP.subtract = TP.remove; // alias
  TP.clear = function() {
    this.time = 0;
    return this;
  };
  TP.valueOf = function() {
    if (this.time < 0 || isNaN(this.time)) this.time = 0;
    return Number(this.time); // in case it's null or undefined
  }
  TP.toString = function() {
    if (this.time < 0 || isNaN(this.time)) this.time = 0;
    var unitObj = this.units;
    var result = "";
    for (var i = 0; i < Object.keys(unitObj).length; i++) {
      var unit = Object.keys(unitObj)[i];
      if (!unitObj.hasOwnProperty(unit)) continue;
      var amount = unitObj[unit];
      if (amount === 0) {
        if (!result && unit === "seconds") {
          result = "0 seconds";
        }
        continue;
      }
      var strToUse = amount === 1 ? unit.replace(/s$/i, "") : unit;
      if (!result) {
        result = `${amount} ${strToUse}`;
      } else if (result.includes("and")) {
        result = result.replace(/\s*and(\s*\d+\s*\w+)$/i, ",$1 and");
        result += ` ${amount} ${strToUse}`;
      } else {
        result += ` and ${amount} ${strToUse}`;
      }
    }
    return result;
  };
  // getters
  var defineGetter = function(name, func) {
    Object.defineProperty(TP, name, { get: func });
  };
  defineGetter("units", function() {
    if (this.time < 0 || isNaN(this.time)) this.time = 0;
    var diff = this.time;
    var years = Math.floor(diff / (1000 * 60 * 60 * 24 * (useCompat ? 7 * 4 : 30) * 12));
    diff -= years * (1000 * 60 * 60 * 24 * (useCompat ? 7 * 4 : 30) * 12);

    var months = Math.floor(diff / (1000 * 60 * 60 * 24 * (useCompat ? 7 * 4 : 30)));
    diff -= months * (1000 * 60 * 60 * 24 * (useCompat ? 7 * 4 : 30));

    var weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
    diff -= weeks * (1000 * 60 * 60 * 24 * 7);

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);

    var hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    var mins = Math.floor(diff / (1000 * 60));
    diff -= mins * (1000 * 60);

    var seconds = Math.floor(diff / (1000));
    diff -= seconds * (1000);
    return {
      years: years,
      months: months,
      weeks: weeks,
      days: days,
      hours: hours,
      minutes: mins,
      seconds: seconds };
  });
  defineGetter("date", function() {
    return new Date(this.time);
  });
  for (var ind = 0; ind < METHODS.length; ind++) {
    var method = METHODS[ind];
    (function() { // sigh
      var actualMethod = method;
      Time[actualMethod] = function(amount) {
        return amount * appropriateNum(actualMethod);
      };
      defineGetter(actualMethod, function() {
        return this.units[actualMethod];
      });
      defineGetter("total" + actualMethod.replace(/^(\w)/, function(l) { return l.toUpperCase(); }), function() {
        return this.time / appropriateNum(actualMethod);
      });
    })();
  }
  if (typeof module === "object" && module.exports) {
    module.exports = Time;
  } else if (typeof window !== "undefined") {
    window.Time = Time;
  }
})();
