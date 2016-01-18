=============
date-timezone
=============

Timezone aware :code:`Date` objects.

Install
=======

Node
----

::

    npm install date-timezone

Browser
-------

::

    git clone https://github.com/BenoitZugmeyer/date-timezone
    cd date-timezone
    npm install
    npm run dist

Then include either `dist/date-timezone.js` or `dist/date-timezone-with-moment.js` in your
project. If you include the first one, make sure you also include moment-timezone_.

You can always use `webpack` or `browserify` to include this in your project.

API
===

:code:`new dateTimezone.DateTimezone(...)`
    Construct a new date with the current global timezone. This constructor and the
    returned object have the same API as `native Date objects`_.

:code:`dateTimezone.setGlobalTimezone(timezoneName)`
    Set the global timezone to use when building dates with `DateTimezone`. By
    default, the global timezone is the current runtime timezone. It supports any
    timezone name supported by moment-timezone.

    Call without argument to reset the global timezone to the runtime timezone.

:code:`dateTimezone.patch()`
    Replace the native `Date` constructor with the `DateTimezone` constructor. All new
    dates will respect the global timezone.

:code:`dateTimezone.getNativeDate()`
    Return the native `Date` constructor, useful when `patch()` has been called.

Usage example
=============

.. code:: javascript

    dateTimezone.setGlobalTimezone("America/New_York");

    new Date(2016, 1, 1).toString();
    // 'Mon Feb 01 2016 00:00:00 GMT+0100 (CET)' or whatever local timezone you're on.

    new dateTimezone.DateTimezone(2016, 1, 1).toString();
    // 'Fri Jan 01 2016 00:00:00 GMT-0500 (EST)'

    dateTimezone.patch();

    new Date(2016, 1, 1).toString();
    // 'Fri Jan 01 2016 00:00:00 GMT-0500 (EST)'

.. _moment-timezone: http://momentjs.com/timezone/
.. _native Date objects: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
