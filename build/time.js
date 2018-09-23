"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var moment = require("moment");
function endChar(text, char) {
    if (char === void 0) { char = " "; }
    return text.charAt(text.length - 1) === char ? text : text + char;
}
function pluralize(str, num) {
    if (typeof str !== "string")
        return str;
    return num !== 1 ? endChar(str, "s") : str;
}
function entriesPolyfill(obj) {
    var arr = [];
    for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
        var key = _a[_i];
        arr.push([key, obj[key]]);
    }
    return arr;
}
var dur = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return moment.duration.apply(moment, args);
};
exports.ALIASES = {
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
    s: ["seconds", "second", "secs", "sec", "s"]
};
function intConstruct(initialVal) {
    this.duration = dur();
    if (typeof initialVal === "string") {
        this.duration.add(initialVal);
    }
    else {
        this.add(initialVal);
    }
}
var Time = (function () {
    function Time(initialVal) {
        intConstruct.apply(this, [initialVal]);
    }
    /**
     * Modify the current value.
     * @param {string} type The type. Must be either "add" or "remove".
     * @param {Time|Date|Duration|Time|string|number|Array<[string, number]>} unitOrQuantity Unit or quantity.
     * @param {number} [amount=0] The amount, if unit is specified.
     * @returns {this}
     */
    Time.prototype.modify = function (type, unitOrQuantity, amount) {
        var _this = this;
        if (amount === void 0) { amount = 0; }
        if (amount == null)
            amount = 0;
        if (typeof type !== "string")
            return this;
        var lowerType = type.toLowerCase();
        if (lowerType !== "add" && lowerType !== "remove")
            return this;
        var func;
        if (lowerType === "add") {
            func = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return (_a = _this.duration).add.apply(_a, args);
                var _a;
            };
        }
        else {
            func = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return (_a = _this.duration).subtract.apply(_a, args);
                var _a;
            };
        }
        if (unitOrQuantity instanceof Time) {
            func(unitOrQuantity.duration);
        }
        else if (moment.isDuration(unitOrQuantity)) {
            func(unitOrQuantity);
        }
        else if (unitOrQuantity instanceof Date) {
            func(unitOrQuantity.getTime());
        }
        else if (typeof unitOrQuantity === "number") {
            if (isNaN(unitOrQuantity))
                return this;
            func(unitOrQuantity);
        }
        else if (typeof unitOrQuantity === "string") {
            var str = unitOrQuantity.toLowerCase();
            if (!(str in exports.ALIASES))
                throw new TypeError("Invalid unit!");
            var num = Number(amount);
            if (isNaN(num))
                return this;
            func(num, exports.ALIASES[str][0]);
        }
        else if (Array.isArray(unitOrQuantity)) {
            if (unitOrQuantity.length < 1)
                return this;
            var arr = _.flatten(unitOrQuantity);
            for (var i = 0; i < arr.length; i += 2) {
                var item = String(arr[i]).toLowerCase();
                if (!(item in exports.ALIASES))
                    continue;
                if (i + 1 >= arr.length)
                    continue;
                var amount_1 = arr[i + 1];
                if (isNaN(Number(amount_1)))
                    continue;
                func(amount_1, exports.ALIASES[item][0]);
            }
        }
        return this;
    };
    /**
     * Adds to the current value.
     * @param {Time|Date|Time|string|number|Array<[string, number]>} unitOrQuantity Unit or quantity.
     * @param {number} [amount=0] The amount, if unit is specified.
     * @returns {this}
     */
    Time.prototype.add = function (unitOrQuantity, amount) {
        return this.modify("add", unitOrQuantity, amount);
    };
    /**
     * Removes from the current value.
     * @param {Time|Date|Time|string|number|Array<[string, number]>} unitOrQuantity Unit or quantity.
     * @param {number} [amount=0] The amount, if unit is specified.
     * @returns {this}
     */
    Time.prototype.remove = function (unitOrQuantity, amount) {
        return this.modify("remove", unitOrQuantity, amount);
    };
    /**
     * Removes from the current value.
     * @param {Time|Date|Time|string|number|Array<[string, number]>} unitOrQuantity Unit or quantity.
     * @param {number} [amount=0] The amount, if unit is specified.
     * @returns {this}
     */
    Time.prototype.subtract = function (unitOrQuantity, amount) {
        return this.remove(unitOrQuantity, amount);
    };
    /**
     * Clears the current duration.
     * @returns {this}
     */
    Time.prototype.clear = function () {
        this.duration = dur();
        return this;
    };
    /**
     * Converts this Time into a string
     * @param {boolean} [scale=false] If shouldn't be too specific
     * @returns {string}
     */
    Time.prototype.toString = function (scale) {
        if (scale === void 0) { scale = false; }
        var result = "";
        if (scale) {
            if (this.years || this.months || this.days) {
                var daysToUse = this.days + (this.hours > 11 ? 1 : 0);
                if (this.years)
                    result += this.years + pluralize(" year", this.years); // if years specify
                if (this.months) {
                    result += "" + (this.years ? (daysToUse ? ", " : " and ") : "") + this.months + " " + pluralize("month", this.months);
                }
                if (this.days) {
                    var hasBefore = Boolean(this.months || this.years);
                    result += "" + (hasBefore ? " and " : "") + daysToUse + " " + pluralize("day", daysToUse);
                    if (this.hours && !hasBefore)
                        result += " and " + this.hours + " " + pluralize("hour", this.hours);
                }
            }
            else if (this.hours || this.minutes) {
                if (this.hours)
                    result += this.hours + pluralize(" hour", this.hours);
                if (this.minutes)
                    result += "" + (this.hours ? " and " : "") + this.minutes + " " + pluralize("minute", this.minutes);
            }
            else if (this.seconds) {
                result += this.seconds + pluralize(" second", this.seconds);
            }
        }
        else {
            var units = this.units;
            for (var _i = 0, _a = entriesPolyfill(units); _i < _a.length; _i++) {
                var _b = _a[_i], unit = _b[0], num = _b[1];
                if (num === 0) {
                    if (!result && unit === "seconds") {
                        result = "0 seconds";
                    }
                    continue;
                }
                var strToUse = num === 1 ? unit.replace(/s$/i, "") : unit;
                if (!result) {
                    result = num + " " + strToUse;
                }
                else if (result.search("and") > -1) {
                    result = result.replace(/\s*and(\s*\d+\s*\w+)$/i, ",$1 and");
                    result += " " + num + " " + strToUse;
                }
                else {
                    result += " and " + num + " " + strToUse;
                }
            }
        }
        return result;
    };
    Time.prototype.valueOf = function () {
        return this.ISO;
    };
    Object.defineProperty(Time.prototype, "years", {
        // getters
        get: function () { return this.duration.years(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Time.prototype, "months", {
        get: function () { return this.duration.months(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Time.prototype, "weeks", {
        get: function () { return Math.floor(this.duration.days() / 7); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Time.prototype, "days", {
        get: function () { return this.duration.days() % 7; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Time.prototype, "hours", {
        get: function () { return this.duration.hours(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Time.prototype, "minutes", {
        get: function () { return this.duration.minutes(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Time.prototype, "seconds", {
        get: function () { return this.duration.seconds(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Time.prototype, "totalYears", {
        get: function () { return this.duration.asYears(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Time.prototype, "totalMonths", {
        get: function () { return this.duration.asMonths(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Time.prototype, "totalWeeks", {
        get: function () { return this.duration.asWeeks(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Time.prototype, "totalDays", {
        get: function () { return this.duration.asDays(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Time.prototype, "totalHours", {
        get: function () { return this.duration.asHours(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Time.prototype, "totalMinutes", {
        get: function () { return this.duration.asMinutes(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Time.prototype, "totalSeconds", {
        get: function () { return this.duration.asSeconds(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Time.prototype, "time", {
        get: function () { return this.duration.asMilliseconds(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Time.prototype, "ISO", {
        get: function () { return this.duration.toISOString(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Time.prototype, "date", {
        get: function () { return new Date(this.time); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Time.prototype, "units", {
        get: function () {
            return {
                years: this.years,
                months: this.months,
                weeks: this.weeks,
                days: this.days,
                hours: this.hours,
                minutes: this.minutes,
                seconds: this.seconds
            };
        },
        enumerable: true,
        configurable: true
    });
    // static
    // utilities
    Time.validUnit = function (str) {
        return String(str).toLowerCase() in exports.ALIASES;
    };
    // methods
    Time.years = function (num) {
        if (num === void 0) { num = 1; }
        return new Time(["years", num]);
    };
    Time.months = function (num) {
        if (num === void 0) { num = 1; }
        return new Time(["months", num]);
    };
    Time.weeks = function (num) {
        if (num === void 0) { num = 1; }
        return new Time(["weeks", num]);
    };
    Time.days = function (num) {
        if (num === void 0) { num = 1; }
        return new Time(["days", num]);
    };
    Time.hours = function (num) {
        if (num === void 0) { num = 1; }
        return new Time(["hours", num]);
    };
    Time.minutes = function (num) {
        if (num === void 0) { num = 1; }
        return new Time(["minutes", num]);
    };
    Time.seconds = function (num) {
        if (num === void 0) { num = 1; }
        return new Time(["seconds", num]);
    };
    return Time;
}());
exports.Time = Time;
// utilities
Time.Time = Time;
Time.ALIASES = exports.ALIASES;
module.exports = Time;
