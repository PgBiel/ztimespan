# Changelog

Just to organize things.

# 2.0
## 2.1.0
#### Initial (2.1.0)
Added normal operations (`+`, `-`, `*`, `/`, etc) to Time instances.

## 2.0.0
#### Initial (2.0.0)
Changed the amount of time that one month takes from 4 weeks to 30 days (which is around 4.2 weeks). To use the old value, use the `Time#toggleCompat` or `Time#setCompat` methods. The first one toggles it and the second one takes one boolean argument setting the use of old value to it.

# 1.0
## 1.2.0
#### 1.2.1
Made `npm test` actually work...

#### Initial (1.2.0)
Added a `Time#subtract` as alias of `Time#remove`. Also, added `jest` tests and fixed some bugs that made the unit getters not work properly. (+ Added badges to README)

## 1.1.0
#### 1.1.1
Added a `Time#validUnit` method just in case you want to make sure a string is a valid time unit. Also added `mins` and `secs` as valid time units.

#### Initial (1.1.0)
Made typings export a Time property instead for the class, edited code to add Time.Time (a circular) and made `CHANGES.md`.

## 1.0.0
#### 1.0.7
A failed attempt of exporting the class (at typings).

#### 1.0.6
Fixed typings property at `package.json`.

#### 1.0.5
Added `NaN` checks.

#### 1.0.4
Added `MIT` license.

#### 1.0.3
A minor `README.md` list positioning fix.

#### 1.0.2
A minor `README.md` change (added inline code blocks to time units).

#### 1.0.1
Made `README.md`, added the `date` getter and added checks to see if a Time instance's `time` property is 0.

#### Initial (1.0.0)
The package is made.
