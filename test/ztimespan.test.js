var Time = require("../build/time");

describe("Constructor", function() {
  test("with 'new'", function() {
    var newTime = new Time();
    expect(newTime).toBeTruthy();
    expect(newTime).toBeInstanceOf(Time);
    expect(newTime.time).toBe(0);
  });
  /* test("without 'new'", function() {
    var time = Time();
    expect(time).toBeTruthy();
    expect(time).toBeInstanceOf(Time);
    expect(time.time).toBe(0);
  });
  test("equal with and without 'new'", function() {
    var newTime = new Time();
    var time = Time();
    expect(newTime.time).toBe(time.time);
    expect(newTime).toMatchObject(time);
  });  - ABANDONED*/
});

describe("Methods", function() {
  describe("Add", function() {
    var time = Time(0);
    test("adds 2 to 0 to become 2", function() { // Adding to 0
      time.add(2);
      expect(time.time).toBe(2);
    });
    test("adds 5 to 2 to become 7", function() { // Adding to existing value
      time.add(5);
      expect(time.time).toBe(7);
    });
    test("adds -8 to 7 to become 0 (reset)", function() { // Resetting cuz negative
      time.add(-8);
      expect(time.time).toBe(0);
    });
  });
  describe("Remove/Subtract", function() {
    test("remove has same behavior as subtract", function() {
      var time1 = Time(10);
      var time2 = Time(10);
      time1.remove(5);
      time2.subtract(5);
      expect(time1.time).toBe(time2.time);
    });
    var time = Time(10);
    test("removes 2 from 10 to become 8", function() { // Removing from existing value
      time.remove(2);
      expect(time.time).toBe(8);
    });
    test("removes 9 from 8 to become 0 (reset)", function() { // Resetting cuz negative
      time.remove(9);
      expect(time.time).toBe(0);
    });
  });
  describe("Clear", function() {
    var time = new Time(14);
    test("clears correctly", function() {
      time.clear();
      expect(time.time).toBe(0);
    });
  });
});
describe("NaN Resetting", function() {
  var time = new Time(1);
  time.time = NaN;
  test("resets on add", function() {
    time.add(0);
    expect(time.time).toBe(0);
  });
  time.time = "B";
  test("resets on remove/subtract", function() {
    time.remove(0);
    expect(time.time).toBe(0);
  });
  describe("'Units' getter", function() {
    time.time = NaN;
    test("resets on NaN", function() {
      time.units;
      expect(time.time).toBe(0);
    });
    time.time = -1;
    test("resets on negative", function() {
      time.units;
      expect(time.time).toBe(0);
    });
  });
  describe("toString", function() {
    time.time = NaN;
    test("resets on NaN", function() {
      time.toString();
      expect(time.time).toBe(0);
    });
    time.time = -1;
    test("resets on negative", function() {
      time.toString();
      expect(time.time).toBe(0);
    });
  });
  // obviously not testing on clear because that's already it's job to set to 0
});
describe("Getters", function() {
  var time = new Time(["y", 4, "mo", 2, "w", 3, "d", 6, "h", 12, "m", 30, "s", 2]);
  test("units", function() {
    expect(time.units).toMatchObject({
      years: 4,
      months: 2,
      weeks: 3,
      days: 6,
      hours: 12,
      minutes: 30,
      seconds: 2
    });
  });
  test("each unit", function() {
    expect(time.years).toBe(4);
    expect(time.months).toBe(2);
    expect(time.weeks).toBe(3);
    expect(time.days).toBe(6);
    expect(time.hours).toBe(12);
    expect(time.minutes).toBe(30);
    expect(time.seconds).toBe(2);
  });
  test("each total unit", function() {
    expect(time.totalYears).toBeCloseTo(4.243113490226338);
    expect(time.totalMonths).toBeCloseTo(50.91736188271605);
    expect(time.totalWeeks).toBeCloseTo(218.2172652116402);
    expect(time.totalDays).toBeCloseTo(1527.5208564814816);
    expect(time.totalHours).toBeCloseTo(36660.500555555554);
    expect(time.totalMinutes).toBeCloseTo(2199630.033333333);
    expect(time.totalSeconds).toBeCloseTo(131977802);
  });
  test("date conversion has same timestamp", function() {
    expect(time.date.getTime()).toBe(time.time);
  });
});
describe("Others", function() {
  var time = new Time(["y", 4, "mo", 2, "w", 3, "d", 6, "h", 12, "m", 30, "s", 2]);
  test("toString", function() {
    expect(time.toString()).toBe("4 years, 2 months, 3 weeks, 6 days, 12 hours, 30 minutes and 2 seconds");
  });
});
