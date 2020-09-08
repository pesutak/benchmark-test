"use strict";
exports.__esModule = true;
/**
 *
 */
var Time = /** @class */ (function () {
    function Time() {
    }
    Time.addMinutes = function (date, minutes) {
        date.setMinutes(date.getMinutes() + minutes);
        return date;
    };
    Time.getMiliseconds = function (date) {
        if (date === void 0) { date = new Date(); }
        return date.getTime();
    };
    Time.getSeconds = function (date) {
        if (date === void 0) { date = new Date(); }
        return Math.round(Time.getMiliseconds(date) / 1000);
    };
    // TODO timezone
    Time.getDayOfWeek = function (date) {
        if (date === void 0) { date = new Date(); }
        var day = ((date.getDay() + 6) % 7);
        return day;
    };
    // TODO timezone
    Time.getTimeOfDay = function (date) {
        if (date === void 0) { date = new Date(); }
        var hours = ("0" + date.getHours()).substr(-2);
        var minutes = ("0" + date.getMinutes()).substr(-2);
        return hours + ":" + minutes;
    };
    //timezone v minutach
    Time.parse = function (date, timezone) {
        if (timezone === void 0) { timezone = 0; }
        if (typeof date === 'number') {
            // TODO: tu netreba zohladnit timezone?
            return (date < 4294967296)
                ? new Date(date * 1000) // TODO pozor ked pouzije velmi skori cas v ms, to by ale nemalo byt nikdy
                : new Date(date);
        }
        else if (typeof date === 'string') {
            var d = new Date(Date.parse(date));
            return (timezone === 0)
                ? d
                : Time.addMinutes(d, timezone);
        }
        throw new Error('Invalid input data');
    };
    Time.parseDay = function (date, timezone) {
        if (timezone === void 0) { timezone = 0; }
        var day = Time.parse(date, timezone);
        var time = Math.floor(day.getTime() / 1000);
        return {
            start: time,
            end: time + 24 * 60 * 60
        };
    };
    Time.parseDate = function (date, timezone) {
        if (timezone === void 0) { timezone = 0; }
        var d = Time.parse(date, timezone);
        return Math.floor(d.getTime() / 1000);
    };
    Time.timezone = function (time) {
        var timezone = 0;
        if (time <= 1521946800 // < 2018 zimny
            || (time > 1540692000 && time <= 1554001200) //2018-2019 zimny
            || (time > 1572141600 && time <= 1585450800) //2019-2020 zimny
            || (time > 1603591200 && time <= 1616900400) //2020-2021 zimny
            || (time > 1635645600) // 2021 >  zimny
        ) {
            timezone = -60;
        }
        else {
            timezone = -120;
        }
        return timezone;
    };
    return Time;
}());
exports.Time = Time;
