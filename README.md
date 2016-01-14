date-timezone
=============

Timezone aware `Date` objects.

## Install

### Node

```
npm install date-timezone
```

### Browser

```
git clone https://github.com/BenoitZugmeyer/date-timezone
cd date-timezone
npm install
npm run dist
```

Then include either `dist/date-timezone.js` or `dist/date-timezone-with-moment.js` in your
project. If you include the first one, make sure you also include
[moment-timezone](http://momentjs.com/timezone/).

You can always use `webpack` or `browserify` to include this in your project.

## API

<dl>
    <dt>`new dateTimezone.DateTimezone(...)`</dt>
    <dd>
        Construct a new date with the current global timezone. This constructor and the
        returned object have the same API as [native `Date`
        objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date).
    </dd>
</dl>

<dl>
    <dt>`dateTimezone.setGlobalTimezone(timezoneName)`</dt>
    <dd>
        Set the global timezone to use when building dates with `DateTimezone`. By
        default, the global timezone is the current runtime timezone. It supports any
        timezone name supported by moment-timezone.
    </dd>
    <dd>
        Call without argument to reset the global timezone to the runtime timezone.
    </dd>
</dl>

<dl>
    <dt>`dateTimezone.patch()`</dt>
    <dd>
        Replace the native `Date` constructor with the `DateTimezone` constructor. All new
        dates will respect the global timezone.
    </dd>
</dl>

<dl>
    <dt>`dateTimezone.getNativeDate()`</dt>
    <dd>
        Return the native `Date` constructor, useful when `patch()` has been called.
    </dd>
</dl>

## Usage example

```javascript
dateTimezone.setGlobalTimezone("America/New_York");

new Date(2016, 1, 1).toString();
// 'Mon Feb 01 2016 00:00:00 GMT+0100 (CET)' or whatever local timezone you're on.

new dateTimezone.DateTimezone(2016, 1, 1).toString();
// 'Fri Jan 01 2016 00:00:00 GMT-0500 (EST)'

dateTimezone.patch();

new Date(2016, 1, 1).toString();
// 'Fri Jan 01 2016 00:00:00 GMT-0500 (EST)'
```
