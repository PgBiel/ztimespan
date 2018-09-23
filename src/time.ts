import * as _ from "lodash";
import * as moment from "moment";

function endChar(text: string, char = " "): string {
  return text.charAt(text.length - 1) === char ? text : text + char;
}

function pluralize(str: string, num: number) {
  if (typeof str !== "string") return str;
  return num !== 1 ? endChar(str, "s") : str;
}

function entriesPolyfill(obj) {
  const arr = [];
  for (const key of Object.keys(obj)) {
    arr.push([key, obj[key]]);
  }
  return arr;
}

const dur: typeof moment.duration = (...args) => moment.duration(...args);

type Duration = moment.Duration;

export const ALIASES = {
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

type IModifyArg = Time | Duration | Date | Time | string | number | [string, number] | Array<[string, number]>;

function intConstruct(initialVal?: IModifyArg) {
  this.duration = dur();
  if (typeof initialVal === "string") {
    this.duration.add(initialVal);
  } else {
    this.add(initialVal);
  }
}

export class Time {
  public static Time: typeof Time;
  public static ALIASES: typeof ALIASES;

  public duration: Duration;

  constructor(initialVal?: IModifyArg) {
    intConstruct.apply(this, [initialVal]);
  }

  /**
   * Modify the current value.
   * @param {string} type The type. Must be either "add" or "remove".
   * @param {Time|Date|Duration|Time|string|number|Array<[string, number]>} unitOrQuantity Unit or quantity.
   * @param {number} [amount=0] The amount, if unit is specified.
   * @returns {this}
   */
  public modify(type: "add" | "remove", unitOrQuantity: IModifyArg, amount: number = 0): this {
    if (amount == null) amount = 0;
    if (typeof type !== "string") return this;
    const lowerType: string = type.toLowerCase();
    if (lowerType !== "add" && lowerType !== "remove") return this;
    let func: (...args: any[]) => Duration;
    if (lowerType === "add") {
      func = (...args) => this.duration.add(...args);
    } else {
      func = (...args) => this.duration.subtract(...args);
    }
    if (unitOrQuantity instanceof Time) {
      func(unitOrQuantity.duration);
    } else if (moment.isDuration(unitOrQuantity)) {
      func(unitOrQuantity);
    } else if (unitOrQuantity instanceof Date) {
      func(unitOrQuantity.getTime());
    } else if (typeof unitOrQuantity === "number") {
      if (isNaN(unitOrQuantity)) return this;
      func(unitOrQuantity);
    } else if (typeof unitOrQuantity === "string") {
      const str = unitOrQuantity.toLowerCase();
      if (!(str in ALIASES)) throw new TypeError("Invalid unit!");
      const num = Number(amount);
      if (isNaN(num)) return this;
      func(num, ALIASES[str][0]);
    } else if (Array.isArray(unitOrQuantity)) {
      if (unitOrQuantity.length < 1) return this;
      const arr = _.flatten(unitOrQuantity);
      for (let i = 0; i < arr.length; i += 2) {
        const item = String(arr[i]).toLowerCase();
        if (!(item in ALIASES)) continue;
        if (i + 1 >= arr.length) continue;
        const amount = arr[i + 1];
        if (isNaN(Number(amount))) continue;
        func(amount, ALIASES[item][0]);
      }
    }
    return this;
  }

  /**
   * Adds to the current value.
   * @param {Time|Date|Time|string|number|Array<[string, number]>} unitOrQuantity Unit or quantity.
   * @param {number} [amount=0] The amount, if unit is specified.
   * @returns {this}
   */
  public add(unitOrQuantity: IModifyArg, amount?: number) {
    return this.modify("add", unitOrQuantity, amount);
  }

  /**
   * Removes from the current value.
   * @param {Time|Date|Time|string|number|Array<[string, number]>} unitOrQuantity Unit or quantity.
   * @param {number} [amount=0] The amount, if unit is specified.
   * @returns {this}
   */
  public remove(unitOrQuantity: IModifyArg, amount?: number) {
    return this.modify("remove", unitOrQuantity, amount);
  }

  /**
   * Removes from the current value.
   * @param {Time|Date|Time|string|number|Array<[string, number]>} unitOrQuantity Unit or quantity.
   * @param {number} [amount=0] The amount, if unit is specified.
   * @returns {this}
   */
  public subtract(unitOrQuantity: IModifyArg, amount?: number) {
    return this.remove(unitOrQuantity, amount);
  }

  /**
   * Clears the current duration.
   * @returns {this}
   */
  public clear(): this {
    this.duration = dur();
    return this;
  }

  /**
   * Converts this Time into a string
   * @param {boolean} [scale=false] If shouldn't be too specific
   * @returns {string}
   */
  public toString(scale: boolean = false): string {
    let result: string = "";
    if (scale) { // if we should return just part of the date, i.e. approximate
      if (this.years || this.months || this.days) { // if a minimum of days , max of years
        const daysToUse: number = this.days + (this.hours > 11 ? 1 : 0);
        if (this.years) result += this.years + pluralize(" year", this.years); // if years specify
        if (this.months) {
          result += `${this.years ? (daysToUse ? ", " : " and ") : ""}${this.months} ${pluralize("month", this.months)}`;
        }
        if (this.days) {
          const hasBefore: boolean = Boolean(this.months || this.years);
          result += `${hasBefore ? " and " : ""}${daysToUse} ${pluralize("day", daysToUse)}`;
          if (this.hours && !hasBefore) result += ` and ${this.hours} ${pluralize("hour", this.hours)}`;
        }
      } else if (this.hours || this.minutes) {
        if (this.hours) result += this.hours + pluralize(" hour", this.hours);
        if (this.minutes) result += `${this.hours ? " and " : ""}${this.minutes} ${pluralize("minute", this.minutes)}`;
      } else if (this.seconds) {
        result += this.seconds + pluralize(" second", this.seconds);
      }
    } else {
      const units = this.units;
      for (const [unit, num] of entriesPolyfill(units)) {
        if (num === 0) {
          if (!result && unit === "seconds") {
            result = "0 seconds";
          }
          continue;
        }
        const strToUse = num === 1 ? unit.replace(/s$/i, "") : unit;
        if (!result) {
          result = `${num} ${strToUse}`;
        } else if (result.search("and") > -1) {
          result = result.replace(/\s*and(\s*\d+\s*\w+)$/i, ",$1 and");
          result += ` ${num} ${strToUse}`;
        } else {
          result += ` and ${num} ${strToUse}`;
        }
      }
    }
    return result;
  }

  public valueOf(): string {
    return this.ISO;
  }

  // getters
  get years(): number { return this.duration.years(); }
  get months(): number { return this.duration.months(); }
  get weeks(): number { return Math.floor(this.duration.days() / 7); }
  get days(): number { return this.duration.days() % 7; }
  get hours(): number { return this.duration.hours(); }
  get minutes(): number { return this.duration.minutes(); }
  get seconds(): number { return this.duration.seconds(); }

  get totalYears(): number { return this.duration.asYears(); }
  get totalMonths(): number { return this.duration.asMonths(); }
  get totalWeeks(): number { return this.duration.asWeeks(); }
  get totalDays(): number { return this.duration.asDays(); }
  get totalHours(): number { return this.duration.asHours(); }
  get totalMinutes(): number { return this.duration.asMinutes(); }
  get totalSeconds(): number { return this.duration.asSeconds(); }
  get time(): number { return this.duration.asMilliseconds(); }

  get ISO(): string { return this.duration.toISOString(); }
  get date(): Date { return new Date(this.time); }

  get units() {
    return {
      years: this.years,
      months: this.months,
      weeks: this.weeks,
      days: this.days,
      hours: this.hours,
      minutes: this.minutes,
      seconds: this.seconds
    };
  }

  // static
    // utilities
  public static validUnit(str: string): str is keyof typeof ALIASES {
    return String(str).toLowerCase() in ALIASES;
  }
    // methods
  public static years(num = 1) { return new Time(["years", num]); }
  public static months(num = 1) { return new Time(["months", num]); }
  public static weeks(num = 1) { return new Time(["weeks", num]); }
  public static days(num = 1) { return new Time(["days", num]); }
  public static hours(num = 1) { return new Time(["hours", num]); }
  public static minutes(num = 1) { return new Time(["minutes", num]); }
  public static seconds(num = 1) { return new Time(["seconds", num]); }
}

// utilities
Time.Time = Time;
Time.ALIASES = ALIASES;

declare const module: { exports: any };
module.exports = Time;

