# ztimespan
[![ztimespan](http://img.shields.io/npm/v/ztimespan.svg)](https://www.npmjs.org/package/ztimespan) [![ztimespan](http://img.shields.io/npm/dm/ztimespan.svg)](https://www.npmjs.org/package/ztimespan)

Timespans in JS.

## Installation
`npm install --save ztimespan`
(Can also be used in browser, just add it as `src` of a `<script>` and it will be added to `window` as `Time`)

## Usage
If on a browser, Time will be in the global namespace. If not, then you can `require` it in Node:
```js
var Time = require("ztimespan");
```
### Constructor
Time (or however you call the variable) will be a function, that can be called with `new` (such as `new Time()`) and can also be called normally (such as `Time()`). Both do the same thing. It takes one optional argument to be the initial value for the Time instance (if not specified, it's 0). It can be one of:
  * A number (in milliseconds);
  * A Date (Gets amount of time since Jan 1, 1970);
  * Another Time instance (Gets the time stored in it);
  * An array of time unit and amount of it (e.g.: `["years", 1]` for 1 year).

Here are all the valid time units, just for reference:
  * `years`, `year`, `y`;
  * `months`, `month`, `mo`;
  * `weeks`, `week`, `w`;
  * `days`, `day`, `d`;
  * `hours`, `hour`, `h`;
  * `minutes`, `minute`, `mins`, `min`, `m`;
  * `seconds`, `second`, `secs`, `sec`, `s`.

P.S.: Using a time unit that is in singular doesn't change anything.

Example:
```js
var Time = require("ztimespan");
var myTimeSpan = new Time(5); // or just Time(5)
```
Time will also have a few utility functions as properties:
* `years(amount)`, `months(amount)`, `weeks(amount)`, `days(amount)`, `hours(amount)`, `minutes(amount)`, `seconds(amount)` -> Returns `amount` of said unit, in milliseconds.
* `validUnit(str)` -> Returns `true` if `str` is a valid time unit string, `false` otherwise. E.g.: `Time.validUnit("min")` returns `true`.

Example:
```js
Time.years(2);
Time.months(4);
Time.weeks(5);
Time.days(6);
Time.hours(9);
Time.minutes(1);
Time.seconds(7);
```

Time instances have the `time` property, which is the time stored, in milliseconds.
NOTE: Make sure to not make `time` negative. Most methods check if time is negative and set it to 0 if so, but keeping it negative can cause buggy behavior. (Same goes for NaN.)

### Methods

Now, let's go in detail on the Time class. It has the following methods:
  * add;
  * remove;
  * subtract;
  * clear.

P.S.: They are all chainable (as in you can do `.add(...).remove(...).subtract(...).clear(...)`).
P.P.S.: `Subtract` is the same as `remove`.

Both `add` and `remove`/`subtract` work the same way, except one is the opposite of the other: `add` is to add to stored time while `remove`/`subtract` is to remove. There are two ways you can call them:
1. `(timeUnit, amount)` -> Add/remove a certain amount of a time unit.
Example:
```js
myTimeSpan.add("year", 3); // add 3 years
myTimeSpan.remove("y", 2); // remove/subtract 2 years
myTimeSpan.subtract("years", 6); // remove/subtract 6 years
```

2. `(quantity)` -> A certain amount of time to add/remove. That can be:
* A Date (Gets amount of time since Jan 1, 1970);
* A Time instance (that can also be itself, gets time stored);
* A number (in milliseconds).
Example:
```js
myTimeSpan.add(new Date());
myTimeSpan.add(Time(1000));
myTimeSpan.add(1000);
```

The `clear` method doesn't take any argument and sets the time stored to 0 (I mean, you can always do `<Time object>.time = 0`, but this has the advantage of being chainable).

### Getter Properties

Time instances have the following properties (they are all read-only because they are getters):
* `units` -> Returns an object that indicates the amount of each unit.
For example:
```js
{
  years: 0,
  months: 0,
  weeks: 5,
  days: 1,
  hours: 0,
  minutes: 59,
  seconds: 3
}
```
* `years`, `months`, `weeks`, `days`, `hours`, `minutes`, `seconds` -> The amount of said unit that perfectly fits in the time stored.
* `totalYears`, `totalMonths`, `totalWeeks`, `totalDays`, `totalHours`, `totalMinutes`, `totalSeconds` -> The amount of said unit that fits in the time stored, perfectly or not. Basically dividing the time stored by 1 of that unit.
* `date` -> The Date representation of this timespan.

### String-ified

The Time class has the `toString` function returning a human-readable string of the timespan. Consider:
```js
var Time = require("ztimespan");
var myOtherTimeSpan = new Time(["y", 4, "m", 7]);
console.log(myOtherTimeSpan.toString());
```
This will output in console:
```
4 years and 7 minutes
```
