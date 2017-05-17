export as namespace Time;

export declare class Time {
  constructor(initialVal?: Time.InitialTimeValue);
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
  public readonly units: { [prop in Time.TimeUnit]?: number };
  // methods
  public add: Time.TimeAddable<this>;
  public remove: Time.TimeAddable<this>;
  public clear(): this;
  public toString(): string;
  // static
  public static years: Time.UnitFunc;
  public static months: Time.UnitFunc;
  public static weeks: Time.UnitFunc;
  public static days: Time.UnitFunc;
  public static hours: Time.UnitFunc;
  public static minutes: Time.UnitFunc;
  public static seconds: Time.UnitFunc;
  public static validUnit(str: string): str is Time.TimeUnit;
}

declare namespace Time {
  export type TimeUnit =
    "year"      | "years"  | "y"
    | "months"  | "month"  | "mo"
    | "weeks"   | "week"   | "w"
    | "days"    | "day"    | "d"
    | "hours"   | "hour"   | "h"
    | "minutes" | "minute" | "m" | "mins" | "min"
    | "seconds" | "second" | "s" | "secs" | "sec";
  export type InitialTimeValue = Time
    | Date
    | number
    | [TimeUnit, number];
  export type TimeAddable<T> = {
    (unit: TimeUnit, amount: number): T;
    (quantity: Time | Date | number): T;
  };
  export type UnitFunc = (amount: number) => number;
  /* export type TimeFuncType = {
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
  var TimeFunc: TimeFuncType; */
}
