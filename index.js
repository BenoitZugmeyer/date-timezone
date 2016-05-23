
var global = Function("return this")();

var moment;
try {
    moment = require("moment-timezone");
}
catch (e) {
    if (global.moment) {
        moment = global.moment;
    }
    else {
        throw e;
    }
}

var NativeDate = global.Date;

var localTimezone = moment.tz.guess();
var globalTimezone = localTimezone;
var nativeMethods = {};
var patchedMethods = {};

function createMoment() {
    var args = Array.prototype.slice.call(arguments);
    args.push(globalTimezone);
    var Date = global.Date;
    global.Date = NativeDate;
    var result = moment.tz.apply(moment, args);
    global.Date = Date;
    return result;
}

function parseLocalMoment(string) {
    var date = new Date(string);
    return createMoment({
        years: date.getFullYear(),
        months: date.getMonth(),
        date: date.getDate(),
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds(),
        milliseconds: date.getMilliseconds(),
    });
}

function isISOFormat(string) {
    return /^\d\d\d\d-/.test(string);
}

function isTimezoneSpecified(string) {
    return /([A-Z]+|[+-]\d\d\d\d)$/.test(string);
}

function shouldBeParsedAsLocalDate(string) {
    return !isISOFormat(string) && !isTimezoneSpecified(string);
}

function DateTimezone(a, b, c, d, e, f, g) {
    if (!(this instanceof DateTimezone)) return new DateTimezone().toString();

    var m;

    if (arguments.length === 0) {
        m = createMoment(Date.now());
    }
    else if (arguments.length === 1) {
        if (typeof a === "string") {
            if (shouldBeParsedAsLocalDate(a)) {
                m = parseLocalMoment(a);
            }
            else {
                m = createMoment(new Date(a));
            }
        }
        else {
            m = createMoment(Number(a));
        }
    }
    else {
        m = createMoment({
            years: a,
            months: b,
            date: c || 1,
            hours: d,
            minutes: e,
            seconds: f,
            milliseconds: g,
        });
    }

    var result = new NativeDate();
    Object.defineProperty(result, "_m", { value: m });
    Object.defineProperties(result, patchedMethods);
    return result;
}

DateTimezone.__proto__ = Date;

function staticMethod(name, fn) {
    Object.defineProperty(DateTimezone, name, {
        value: fn,
        writable: true,
        configurable: true,
    });
}

function method(name, fn) {
    if (nativeMethods.hasOwnProperty(name)) throw new Error("Can't redefine method " + name);
    nativeMethods[name] = Object.getOwnPropertyDescriptor(NativeDate.prototype, name);
    patchedMethods[name] = {
        value: fn,
        writable: true,
        configurable: true,
    };
}

staticMethod("parse", function (string) {
    if (shouldBeParsedAsLocalDate(string)) {
        return parseLocalMoment(string).unix() * 1000;
    }
    return NativeDate.parse(string);
});

function valueOf() {
    return this._m.valueOf();
}
method("getTime", valueOf);
method("valueOf", valueOf);

method("setTime", function (time) {
    this._m.milliseconds(time - this._m.valueOf());
});

method("getYear", function () {
    return this.getFullYear() - 1900;
});

method("setYear", function (value) {
    this._m.year(value >= 0 && value < 100 ? 1900 + value : value);
});

method("getTimezoneOffset", function () {
    return -this._m.utcOffset();
});

function setUnitMethods(unit, nativeUnit) {
    if (!nativeUnit) nativeUnit = unit[0].toUpperCase() + unit.slice(1).toLowerCase();

    method("get" + nativeUnit, function () {
        return this._m.get(unit);
    });

    method("getUTC" + nativeUnit, function () {
        return this._m.utc().get(unit);
    });

    method("set" + nativeUnit, function (value) {
        this._m.set(unit, value);
    });

    method("setUTC" + nativeUnit, function (value) {
        this._m.utc().set(unit, value);
    });
}

setUnitMethods("year", "FullYear");
setUnitMethods("month");
setUnitMethods("date");
setUnitMethods("day");
setUnitMethods("hours");
setUnitMethods("minutes");
setUnitMethods("seconds");
setUnitMethods("milliseconds");

function setFormatMethod(name, format, utc) {
    method(name, function () {
        var m = utc ? this._m.utc() : this._m;
        return m.format(format);
    });
}

function mapDateMethod(name, utc) {
    method(name, function () {
        var formatingDate;

        if (utc) {
            formatingDate = this._m.toDate();
        }
        else {
            var thisDate = this._m.toDate();
            formatingDate = new Date(
                this._m.valueOf() + (this._m.utcOffset() + thisDate.getTimezoneOffset()) * 1000 * 60
            );
        }

        return formatingDate[name]();
    });
}

mapDateMethod("toDateString");
mapDateMethod("toGMTString", true);
mapDateMethod("toISOString", true);
mapDateMethod("toJSON", true);
mapDateMethod("toLocaleDateString");
mapDateMethod("toLocaleString");
mapDateMethod("toLocaleTimeString");
mapDateMethod("toUTCString", true);

setFormatMethod("toTimeString", "HH:mm:ss [GMT]ZZ (z)");
setFormatMethod("toString",     "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (z)");

// TODO:
// toLocaleFormat
// toSource

function patch() {
    if (!global || !global.Date || global.Date !== NativeDate) {
        throw new Error("date-timezone: Can't patch twice");
    }

    global.Date = DateTimezone;
    return module.exports;
}

function unpatch() {
    global.Date = NativeDate;
    return module.exports;
}

function setGlobalTimezone(tz) {
    globalTimezone = tz || localTimezone;
}

function getNativeDate() {
    return NativeDate;
}

module.exports = {
    patch: patch,
    unpatch: unpatch,
    setGlobalTimezone: setGlobalTimezone,
    getNativeDate: getNativeDate,
    DateTimezone: DateTimezone,
};
