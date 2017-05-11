declare var Time: typeof ztimespan.Time;
export = Time;
export as namespace Time;

declare namespace ztimespan {
  type TimeUnit =
    "year"      | "years"  | "y"
    | "months"  | "month"  | "mo"
    | "weeks"   | "week"   | "w"
    | "days"    | "day"    | "d"
    | "hours"   | "hour"   | "h"
    | "minutes" | "minute" | "m" | "min"
    | "seconds" | "second" | "s" | "sec";
  type InitialTimeValue = Time
    | Date
    | number
    | [TimeUnit, number];
  type Addable<T> = {
    (unit: TimeUnit, amount: number): T;
    (quantity: Time | Date | number): T;
  };
  class Time {
    constructor(initialVal: InitialTimeValue);
    // properties
    public time: number;
    // getters
    public readonly years: number;
    public readonly totalYears: number;
    public readonly months: number;
    public readonly totalMonths: number;
    public readonly weeks: number;
    public readonly totalWeeks: number;
    public readonly days: number;
    public readonly totalDays: number;
    public readonly hours: number;
    public readonly totalHours: number;
    public readonly minutes: number;
    public readonly totalMinutes: number;
    public readonly seconds: number;
    public readonly totalSeconds: number;
    public readonly date: Date;
    public readonly units: { [prop in TimeUnit]?: number };
    // methods
    public add: Addable<this>;
    public remove: Addable<this>;
    public clear(): this;
    public toString(): string;
    // static
    public static years: UnitFunc;
    public static months: UnitFunc;
    public static weeks: UnitFunc;
    public static days: UnitFunc;
    public static hours: UnitFunc;
    public static minutes: UnitFunc;
    public static seconds: UnitFunc;
  }
  type UnitFunc = (amount: number) => number;
  type TimeFuncType = {
    (initialVal?: InitialTimeValue): Time;
    new(initialVal?: InitialTimeValue): Time;
    years: UnitFunc;
    months: UnitFunc;
    weeks: UnitFunc;
    days: UnitFunc;
    hours: UnitFunc;
    minutes: UnitFunc;
    seconds: UnitFunc;
  };
  var TimeFunc: TimeFuncType;
}
