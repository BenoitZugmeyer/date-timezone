var dateTimezone = require("..");
var moment = require("moment-timezone");

var DateTimezone = dateTimezone.DateTimezone;

var FOREIGN_TZ = "America/Noronha"; // one of the least populated timezone
var TIMESTAMP = 1000000000000; // why not.
var OFFSET_MIN = moment(TIMESTAMP).tz(FOREIGN_TZ).utcOffset() - moment(TIMESTAMP).utcOffset();
var OFFSET_MS = OFFSET_MIN * 60 * 1000;

if (!OFFSET_MIN) {
    console.log("WARNING: date-timezone spec is expected to be launched with a timezone " +
                "different than UTC-2 (TZ environment variable)");
}

if (process.env.LANG && process.env.LANG.indexOf("en_US") !== 0) {
    console.log("WARNING: date-timezone spec is expected to be launched with an en_US locale " +
                "(LANG environment variable)");
}

beforeEach(function () {
    dateTimezone.setGlobalTimezone();
});

describe("Date", function () {

    describe("Constructor", function () {
        it("has the same length property", function () {
            expect(DateTimezone.length).toBe(7);
        });

        it("works without arguments", function () {
            var now = new Date().getTime();
            var nowtz = new DateTimezone().getTime();
            expect(nowtz).toBe(now);
        });

        it("parses ISO formats", function () {
            expect(new DateTimezone("2001-09-09").getTime())
                .toBe(new Date("2001-09-09").getTime());
        });

        it("parses ISO formats and changing the timezone", function () {
            dateTimezone.setGlobalTimezone(FOREIGN_TZ);
            expect(new DateTimezone("2001-09-09").getTime())
                .toBe(new Date("2001-09-09").getTime());
        });

        it("parses local formats", function () {
            expect(new DateTimezone("September 9, 2001").getTime())
                .toBe(new Date("September 9, 2001").getTime());
        });

        it("parses local formats and changing the timezone", function () {
            dateTimezone.setGlobalTimezone(FOREIGN_TZ);
            expect(new DateTimezone("September 9, 2001").getTime())
                .toBe(new Date("September 9, 2001").getTime() - OFFSET_MS);
        });

        it("builds with year + month", function () {
            expect(new DateTimezone(2001, 8).getTime()).toBe(new Date(2001, 8).getTime());
        });

        it("builds with year + month + day", function () {
            expect(new DateTimezone(2001, 8, 9).getTime()).toBe(new Date(2001, 8, 9).getTime());
        });

        it("builds with year + month + day + time", function () {
            expect(new DateTimezone(2001, 8, 9, 3, 46, 40, 0).getTime())
                .toBe(new Date(2001, 8, 9, 3, 46, 40, 0).getTime());
        });

        it("builds with year + month following the global timezone", function () {
            dateTimezone.setGlobalTimezone(FOREIGN_TZ);
            expect(new DateTimezone(2001, 8).getTime())
                .toBe(new Date(2001, 8).getTime() - OFFSET_MS);
        });

        it("builds with year + month + day + time following the global timezone", function () {
            dateTimezone.setGlobalTimezone(FOREIGN_TZ);
            expect(new DateTimezone(2001, 8, 9, 3, 46, 40, 0).getTime())
                .toBe(new Date(2001, 8, 9, 3, 46, 40, 0).getTime() - OFFSET_MS);
        });

        it("builds with timestamp", function () {
            dateTimezone.setGlobalTimezone(FOREIGN_TZ);
            expect(new DateTimezone(TIMESTAMP).getTime()).toBe(new Date(TIMESTAMP).getTime());
        });

        it("builds instance of dates", function () {
            expect(new DateTimezone() instanceof Date).toBe(true);
        });

        it("returns the current formated date if called as a function", function () {
            var date = Date(TIMESTAMP);
            var datetz = DateTimezone(TIMESTAMP);
            expect(datetz).toBe(date);
        });
    });

    describe("Date.now", function () {
        it("returns the same timestamp as the native function", function () {
            var now = Date.now();
            var nowtz = DateTimezone.now();
            expect(nowtz).toBe(now);
        });
    });

    describe("Date.parse", function () {
        it("parses ISO formats", function () {
            expect(DateTimezone.parse("2001-09-09")).toBe(Date.parse("2001-09-09"));
        });

        it("parses ISO formats when changing the timezone", function () {
            dateTimezone.setGlobalTimezone(FOREIGN_TZ);
            expect(DateTimezone.parse("2001-09-09")).toBe(Date.parse("2001-09-09"));
        });

        it("parses local formats", function () {
            expect(DateTimezone.parse("September 9, 2001")).toBe(Date.parse("September 9, 2001"));
        });

        it("parses local formats when changing the timezone", function () {
            dateTimezone.setGlobalTimezone(FOREIGN_TZ);
            expect(DateTimezone.parse("September 9, 2001"))
                .toBe(Date.parse("September 9, 2001") - OFFSET_MS);
        });
    });

    describe("Date.UTC", function () {
        it("builds with year + month", function () {
            expect(DateTimezone.UTC(2001, 8)).toBe(Date.UTC(2001, 8));
        });

        it("builds with year + month + day", function () {
            expect(DateTimezone.UTC(2001, 8, 9)).toBe(Date.UTC(2001, 8, 9));
        });

        it("builds with year + month + day + time", function () {
            expect(DateTimezone.UTC(2001, 8, 9, 3, 46, 40, 0))
                .toBe(Date.UTC(2001, 8, 9, 3, 46, 40, 0));
        });

        it("builds with year + month following the global timezone", function () {
            dateTimezone.setGlobalTimezone(FOREIGN_TZ);
            expect(DateTimezone.UTC(2001, 8)).toBe(Date.UTC(2001, 8));
        });

        it("builds with year + month + day + time following the global timezone", function () {
            dateTimezone.setGlobalTimezone(FOREIGN_TZ);
            expect(DateTimezone.UTC(2001, 8, 9, 3, 46, 40, 0))
                .toBe(Date.UTC(2001, 8, 9, 3, 46, 40, 0));
        });
    });

    describe("Date.p.setTime", function () {
        it("sets the time inplace", function () {
            var datetz = new DateTimezone(TIMESTAMP);
            datetz.setTime(TIMESTAMP + 1000);
            expect(datetz.getTime()).toBe(TIMESTAMP + 1000);
        });
    });

    describe("Date.p.get{FullYear,Month...}", function () {
        it("returns the same without timezone", function () {
            var date = new Date(TIMESTAMP);
            var datetz = new DateTimezone(TIMESTAMP);
            expect(datetz.getFullYear()).toBe(date.getFullYear());
            expect(datetz.getYear()).toBe(date.getYear());
            expect(datetz.getMonth()).toBe(date.getMonth());
            expect(datetz.getDate()).toBe(date.getDate());
            expect(datetz.getDay()).toBe(date.getDay());
            expect(datetz.getHours()).toBe(date.getHours());
            expect(datetz.getMinutes()).toBe(date.getMinutes());
            expect(datetz.getSeconds()).toBe(date.getSeconds());
            expect(datetz.getMilliseconds()).toBe(date.getMilliseconds());
            expect(datetz.getTimezoneOffset()).toBe(date.getTimezoneOffset());
        });

        it("returns the values shifted by the timezone offset", function () {
            dateTimezone.setGlobalTimezone(FOREIGN_TZ);
            var date = new Date(TIMESTAMP + OFFSET_MS);
            var datetz = new DateTimezone(TIMESTAMP);
            expect(datetz.getFullYear()).toBe(date.getFullYear());
            expect(datetz.getYear()).toBe(date.getYear());
            expect(datetz.getMonth()).toBe(date.getMonth());
            expect(datetz.getDate()).toBe(date.getDate());
            expect(datetz.getDay()).toBe(date.getDay());
            expect(datetz.getHours()).toBe(date.getHours());
            expect(datetz.getMinutes()).toBe(date.getMinutes());
            expect(datetz.getSeconds()).toBe(date.getSeconds());
            expect(datetz.getMilliseconds()).toBe(date.getMilliseconds());
            expect(datetz.getTimezoneOffset()).toBe(date.getTimezoneOffset() - OFFSET_MIN);
        });
    });

    describe("Date.p.getUTC{FullYear,Month...}", function () {
        it("returns the same without timezone", function () {
            var date = new Date(TIMESTAMP);
            var datetz = new DateTimezone(TIMESTAMP);
            expect(datetz.getUTCFullYear()).toBe(date.getUTCFullYear());
            expect(datetz.getUTCMonth()).toBe(date.getUTCMonth());
            expect(datetz.getUTCDate()).toBe(date.getUTCDate());
            expect(datetz.getUTCDay()).toBe(date.getUTCDay());
            expect(datetz.getUTCHours()).toBe(date.getUTCHours());
            expect(datetz.getUTCMinutes()).toBe(date.getUTCMinutes());
            expect(datetz.getUTCSeconds()).toBe(date.getUTCSeconds());
            expect(datetz.getUTCMilliseconds()).toBe(date.getUTCMilliseconds());
        });

        it("returns the same with timezone", function () {
            dateTimezone.setGlobalTimezone(FOREIGN_TZ);
            var date = new Date(TIMESTAMP);
            var datetz = new DateTimezone(TIMESTAMP);
            expect(datetz.getUTCFullYear()).toBe(date.getUTCFullYear());
            expect(datetz.getUTCMonth()).toBe(date.getUTCMonth());
            expect(datetz.getUTCDate()).toBe(date.getUTCDate());
            expect(datetz.getUTCDay()).toBe(date.getUTCDay());
            expect(datetz.getUTCHours()).toBe(date.getUTCHours());
            expect(datetz.getUTCMinutes()).toBe(date.getUTCMinutes());
            expect(datetz.getUTCSeconds()).toBe(date.getUTCSeconds());
            expect(datetz.getUTCMilliseconds()).toBe(date.getUTCMilliseconds());
        });
    });

    describe("Date.p.set{FullYear,Month,...}", function () {
        it("set the same without timezone", function () {
            var date = new Date(TIMESTAMP);
            var datetz = new DateTimezone(TIMESTAMP);
            date.setFullYear(2015);
            datetz.setFullYear(2015);
            expect(datetz.getTime()).toBe(date.getTime());
        });

        it("handles out of bound values correctly", function () {
            var date = new Date(TIMESTAMP);
            var datetz = new DateTimezone(TIMESTAMP);
            date.setDate(-2);
            datetz.setDate(-2);
            expect(datetz.getTime()).toBe(date.getTime());
        });
    });

    describe("Date.p.to*", function () {
        function makeTest(name, tzExpected) {
            var expected = new Date(TIMESTAMP)[name]();
            if (!tzExpected) tzExpected = expected;

            it(name, function () {
                expect(new DateTimezone(TIMESTAMP)[name]()).toBe(expected);
            });

            it(name + " with timezone", function () {
                dateTimezone.setGlobalTimezone(FOREIGN_TZ);
                expect(new DateTimezone(TIMESTAMP)[name]()).toBe(tzExpected);
            });
        }

        makeTest("toDateString", "Sat Sep 08 2001");
        makeTest("toGMTString");
        makeTest("toISOString");
        makeTest("toJSON");
        makeTest("toLocaleDateString", "9/8/2001");
        makeTest("toLocaleString", "9/8/2001, 11:46:40 PM");
        makeTest("toLocaleTimeString", "11:46:40 PM");
        makeTest("toString", "Sat Sep 08 2001 23:46:40 GMT-0200 (FNT)");
        makeTest("toTimeString", "23:46:40 GMT-0200 (FNT)");
        makeTest("toUTCString", "Sun, 09 Sep 2001 01:46:40 GMT");
    });

    describe("Object.prototype.toString", function () {
        it("returns [object Date]", function () {
            expect(Object.prototype.toString.call(new DateTimezone())).toBe("[object Date]");
        });
    });

});

describe("patch", function () {
    var nativeDate = Date;

    beforeEach(function () {
        dateTimezone.patch();
    });

    afterEach(function () {
        dateTimezone.unpatch();
    });

    it("patches the global Date constructor", function () {
        expect(Date).not.toBe(dateTimezone.getNativeDate());
        expect(Date).not.toBe(nativeDate);
    });

    it("creates patched dates", function () {
        dateTimezone.setGlobalTimezone(FOREIGN_TZ);
        expect(new Date(2001, 8, 9).getDate()).toBe(9);
        expect(new Date("2001-09-09").getDate()).toBe(8);
        expect(new Date("September 9, 2001").getDate()).toBe(9);
        expect(new Date("September 9, 2001").toDateString()).toBe("Sun Sep 09 2001");
        expect(new Date("September 9, 2001").toUTCString()).toBe("Sun, 09 Sep 2001 02:00:00 GMT");
    });

});

