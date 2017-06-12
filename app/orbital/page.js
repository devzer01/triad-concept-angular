/**
 * Created by nayana on 8/6/2560.
 */
var Flag_RealTimeUpdate = true;
var CartesianCoordinateType = null;
var CartesianCoordinateColor = { 'geocentric': "#cfffcf", 'heliocentric': "#ffff9f", 'none':"#000000" };
var AngularCoordinateType = "equatorial";
var AngularCoordinateColor = { 'equatorial': "#ccff80", 'ecliptic': "ffdf80", 'horizontal': "ccccff" };
var AstroDateTime = new Date();
var GeographicLatitude = null;
var GeographicLongitude = null;
var GeographicElevationInMeters = 0.0;      // FIXFIXFIX:  Allow user to edit this too!
var COOKIE_EXPIRATION_DAYS = 3650;
var SelectedBody = null;            // celestial body selected for extra info: rise time, culm time, set time, visual magnitude, etc.

var RowBackgroundTable = {};    // indexed using row.id, returning an object x such that x.mouseover and x.mouseout are colors to use
var CellSuffix = ['_name', '_x', '_y', '_z', '_distance', '_mag', '_SA', '_const', '_RA', '_DEC'];
var NameCurrentlyHighlighted = null;

var context=null;
var canvas = null;

function SetAngleMode (mode)
{
    AngleMode = mode;
    CalculateSolarSystem();
}


function AddRowForCelestialBody (p, day)
{
    var planetTable = $('planetTable');
    var pc = null;
    var distance = null;

    let color = "black";

    let more = 1;
    switch (p.Name) {
        case "Sun":
            color="red";
            break;
        case "Earth":
            color="blue";
            more = 9;
            break;
        case "Mercury":
            color="silver";
            more = 9;
            break;
        case "Mars":
            more = 9;
            break;
        case "Venus":
            more = 10;
            color = "yellow";
        case "Saturn":
        case "Jupiter":
            more = 2;
            break;
    }

    distance = p.DistanceFromSun (day);
    pc = p.EclipticCartesianCoordinates (day);
    let x =  pc.x * 30;
    let y =  pc.y * 30;
    context.beginPath();
    context.arc(x + 400, y + 400, 3, 0, Math.PI * 2, false);
    context.fillStyle = color;
    context.fill();
    context.fillText(p.Name, x + 405, y + 400);
    context.stroke();


    var location = new GeographicCoordinates (GeographicLongitude, GeographicLatitude, GeographicElevationInMeters);
    var mag = (p.Name == "Earth") ? "&nbsp;" : p.VisualMagnitude(day).toFixed(2);
    var sunAngle = (p.Name == "Earth") ? "&nbsp;" : Astronomy.AngleWithSunInDegrees (p, day).toFixed(1) + "&deg;";

    var row = InsertRow (planetTable, p.Name + "_row");
    var PRECISION = 7;
    var raHtml  = "&nbsp;";
    var decHtml = "&nbsp;";
    var eq = null;
    var constellation = "&nbsp;";

    if (p.Name != "Earth") {
        eq = p.EquatorialCoordinates (day, location);
        constellation = HtmlConstellation (eq);
        constellation = "<div style='text-align:center;' id='"+p.Name+"_constdiv'>" + constellation + "</div>"
        var hc = p.HorizontalCoordinates (day, location);
        raHtml = HtmlDeclination (hc.azimuth);
        decHtml = HtmlDeclination (hc.altitude);
    }


    var nameTextColor = NakedEyeObjects[p.Name] ? "#000000" : "#808060";
    /*InsertCell (planetTable, row, p.Name + "_name", "", "<div style='text-align:center; color:"+nameTextColor+";' id='"+p.Name+"_namediv'>" + p.Name + "</div>");
    InsertCell (planetTable, row, p.Name + "_x", "NumericData", pc.x.toFixed(PRECISION));
    InsertCell (planetTable, row, p.Name + "_y", "NumericData", pc.y.toFixed(PRECISION));
    InsertCell (planetTable, row, p.Name + "_z", "NumericData", pc.z.toFixed(PRECISION));
    InsertCell (planetTable, row, p.Name + "_distance", "NumericData", distance.toFixed(PRECISION));
    InsertCell (planetTable, row, p.Name + "_mag", "SmallNumericData", mag);
    InsertCell (planetTable, row, p.Name + "_SA", "SmallNumericData", sunAngle);
    InsertCell (planetTable, row, p.Name + "_const", "SmallNumericData", constellation);
    InsertCell (planetTable, row, p.Name + "_RA", "NumericData", raHtml);
    InsertCell (planetTable, row, p.Name + "_DEC", "NumericData", decHtml);*/
}



function CalculateSolarSystem()
{
    context.clearRect(0, 0, 1000, 1000);
    var day = Astronomy.DayValue (AstroDateTime);

    for (var i in Astronomy.Body) {
        AddRowForCelestialBody (Astronomy.Body[i], day);
    }
    CalculateSelectedBody (day);
}

var BriefDayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function BriefTimeString (date)
{
    if (date == null) {
        return "";
    } else {
        var h = date.getHours();
        h = ((h < 10) ? "0" : "") + h.toString();
        var m = date.getMinutes();
        m = ((m < 10) ? "0" : "") + m.toString();
        var s = date.getSeconds();
        s = ((s < 10) ? "0" : "") + s.toString();
        return BriefDayOfWeek[date.getDay()] + " " + h + ":" + m + ":" + s;
    }
}

function BriefDayValueString (day)
{
    if (day == null) {
        return "";
    } else {
        return BriefTimeString (Astronomy.DayValueToDate (day));
    }
}

function ResetSelectedBodyEvents()
{
    // This gets called whenever the time has been manually reset, to force recalculation of all events.
    if (SelectedBody != null) {
        SelectedBody = { 'Body' : SelectedBody.Body };      // nuke all properties except the body itself
    }
}

function CalculateSelectedBody (day)
{
    if (SelectedBody != null) {
        var location = new GeographicCoordinates (GeographicLongitude, GeographicLatitude, GeographicElevationInMeters);

        if (SelectedBody.NextRiseTime == null || SelectedBody.NextRiseTime < day) {
            SelectedBody.NextRiseTime = Astronomy.NextRiseTime (SelectedBody.Body, day, location);
        }

        if (SelectedBody.NextSetTime == null || SelectedBody.NextSetTime < day) {
            SelectedBody.NextSetTime = Astronomy.NextSetTime (SelectedBody.Body, day, location);
        }

        if (SelectedBody.NextCulmTime == null || SelectedBody.NextCulmTime < day) {
            SelectedBody.NextCulmTime = Astronomy.NextCulmTime (SelectedBody.Body, day, location);
        }

        $('divRiseTime').innerHTML = BriefDayValueString (SelectedBody.NextRiseTime);
        $('divCulmTime').innerHTML = BriefDayValueString (SelectedBody.NextCulmTime);
        $('divSetTime' ).innerHTML = BriefDayValueString (SelectedBody.NextSetTime );
    }
}

/*function ReflectDateTime (date)
{
    $('edit_Year').value = date.getFullYear();
    $('edit_Month').value = 1 + date.getMonth();
    $('edit_Day').value = date.getDate();
    $('edit_Hour').value = date.getHours();
    $('edit_Minute').value = date.getMinutes();
    $('edit_Second').value = date.getSeconds();
}*/

function ParseDateTimeBox (id, min, max)
{
    var rv = null;
    var s = $(id).value;
    if (/^\d+$/.test(s)) {
        var n = parseInt (s, 10);   // explicit radix==10 prevents interpreting "010" as octal!
        if (!isNaN(n) && (n >= min) && (n <= max)) {
            rv = n;
        }
    }

    if (rv == null) {
        var box = id.replace(/^edit_/,"").toLowerCase();
        alert ("The " + box + " value is not valid.  It must be an integer between " + min + " and " + max + ", inclusive.");
        $(id).focus();
    }

    return rv;
}

function SaveDateTime (d)
{
    var cookieText = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getHours() + "/" + d.getMinutes() + "/" + d.getSeconds();
    WriteCookie ("AstroDateTime", cookieText, COOKIE_EXPIRATION_DAYS);
}

function LoadDateTime()
{
    var d = new Date();

    /*
     // Put this code back in, if restoring last date/time is desired...
     var cookieText = ReadCookie ("AstroDateTime", "");
     if (cookieText != "") {
     var a = cookieText.split(/\//);
     if (a.length == 6) {
     d.setFullYear (parseInt(a[0],10));
     d.setMonth (parseInt(a[1],10) - 1);
     d.setDate (parseInt(a[2],10));
     d.setHours (parseInt(a[3],10));
     d.setMinutes (parseInt(a[4],10));
     d.setSeconds (parseInt(a[5],10));
     d.setMilliseconds (0);
     }
     }
     */
    return d;
}

function ParseDateTime()
{
    // Validate contents of the edit boxes.
    // If valid, update AstroDateTime and disable button.
    var year = ParseDateTimeBox ('edit_Year', 1000, 3000);
    if (year != null) {
        var month = ParseDateTimeBox ('edit_Month', 1, 12);
        if (month != null) {
            var day = ParseDateTimeBox ('edit_Day', 1, 31);
            if (day != null) {
                var hour = ParseDateTimeBox ('edit_Hour', 0, 23);
                if (hour != null) {
                    var minute = ParseDateTimeBox ('edit_Minute', 0, 59);
                    if (minute != null) {
                        var second = ParseDateTimeBox ('edit_Second', 0, 59);
                        if (second != null) {
                            var date = new Date();

                            date.setFullYear (year);
                            date.setMonth (month - 1);
                            date.setDate (day);
                            date.setHours (hour);
                            date.setMinutes (minute);
                            date.setSeconds (second);
                            date.setMilliseconds (0);

                            return date;
                        }
                    }
                }
            }
        }
    }

    return null;
}

function SetUpdatedDateTime (date)
{
    AstroDateTime = date;
    $('button_SetDateTime').disabled = true;

    SaveDateTime (AstroDateTime);
    ResetSelectedBodyEvents();

    CalculateSolarSystem();
}

function OnSetDateTime()
{
    var date = ParseDateTime();
    if (date != null) {
        SetUpdatedDateTime (date);
    }
}

function AddDays (d)
{
    var date = ParseDateTime();
    if (date != null) {
        date.setDate (date.getDate() + d);
        ReflectDateTime (date);
        SetUpdatedDateTime (date);
    }
}

function Timer()
{
    if (Flag_RealTimeUpdate) {
        AstroDateTime = new Date();
        ReflectDateTime (AstroDateTime);
        CalculateSolarSystem();
    }
    setTimeout ('Timer()', 1000);   // Request that this same function be called again 1 second from now.
}

function OnDateTimeDirty()
{
    $('button_SetDateTime').disabled = false;       // the user may have changed date/time
}

function OnCheckBoxRealTime()
{
    Flag_RealTimeUpdate = $('checkbox_RealTime').checked;
    EnableDisableDateControls (!Flag_RealTimeUpdate);
    WriteCookie ("RealTimeMode", Flag_RealTimeUpdate.toString(), COOKIE_EXPIRATION_DAYS);
    if (Flag_RealTimeUpdate) {
        ResetSelectedBodyEvents();
    } else {
        // Since we are not updating the clock constantly, save this as a sticky date/time...
        SaveDateTime (AstroDateTime);
    }
}

var NakedEyeObjects = {
    'Sun':      true,
    'Moon':     true,
    'Mercury':  true,
    'Venus':    true,
    'Earth':    true,
    'Mars':     true,
    'Jupiter':  true,
    'Saturn':   true
};


function WriteSkyChart (body, location, doc)
{
    // Get selected date, round down to midnight, then show chart for 24 hours.
    var when = new Date ();
    when.setFullYear (AstroDateTime.getFullYear());
    when.setMonth (AstroDateTime.getMonth());
    when.setDate (AstroDateTime.getDate());
    when.setHours (0, 0, 0, 0);
    doc.writeln ("<h3>Altitude/Azimuth chart for " + when.toLocaleDateString() + "</h3>");
    doc.writeln ("<table style='text-align:right; font-family:Monospace;'>");
    doc.write ("<tr>");
    doc.write ("<td style='width:6em;'>Time</td>");
    doc.write ("<td style='width:10em;'>Azimuth</td>");
    doc.write ("<td style='width:10em;'>Altitude</td>");
    doc.writeln ("</tr>");

    var TIME_STEP_MINUTES = 5;      // number of minutes between time steps
    var NUM_TIME_STEPS = Math.round ((24 * 60) / TIME_STEP_MINUTES);
    var hours = 0;
    var minutes = 0;
    var printing = true;
    for (var i=0; i < NUM_TIME_STEPS; ++i) {
        when.setHours (hours, minutes, 0, 0);

        var day = Astronomy.DayValue (when);
        var timeString = ((hours < 10) ? "0" : "") + hours + ":" + ((minutes < 10) ? "0" : "") + minutes;

        var hc = body.HorizontalCoordinates (day, location);
        if (hc.altitude >= -1.5) {
            if (!printing) {
                // emit a blank row so it is easy to see where an object rose after having set.
                doc.writeln ("<tr><td>&nbsp;</td></tr>");
                printing = true;
            }
            doc.write ("<tr>");
            doc.write ("<td>" + timeString + "</td>");
            doc.write ("<td>" + HtmlDeclination(hc.azimuth) + "</td>");
            doc.write ("<td>" + HtmlDeclination(hc.altitude) + "</td>");
            doc.writeln ("</tr>");
        } else {
            printing = false;
        }

        // Update minutes and hours values for next iteration...
        minutes += TIME_STEP_MINUTES;
        if (minutes >= 60) {
            minutes = 0;
            if (++hours >= 24) {
                break;  // this should never happen, but prevent rolling over to next calendar day in any case.
            }
        }
    }

    doc.writeln ("</table>");
}

function OnDetailsButton()
{
    if (SelectedBody!=null && SelectedBody.Body!=null) {
        var location = new GeographicCoordinates (GeographicLongitude, GeographicLatitude, GeographicElevationInMeters);
        var body = SelectedBody.Body;
        var w = window.open ("", "CelestialBodyDetails");
        if (w!=null && w.document!=null) {
            var doc = w.document;
            doc.writeln ("<html><head><title>" + SelectedBody.Body.Name + " details</title></head><body>");
            doc.writeln ("<h2>Details for " + SelectedBody.Body.Name + "</h2>");

            WriteSkyChart (body, location, doc);

            doc.writeln ("</body></html>");
            doc.close();        // otherwise browser will keep spinning like the document is still loading
        } else {
            alert ("Error creating new browser window.");
        }
    } else {
        alert ("No celestial body is selected.");
    }
}

function OnRadioButton_Cartesian (id)
{
    switch (id) {
        case "rb_Cartesian_Heliocentric":
            CartesianCoordinateType = "heliocentric";
            break;

        case "rb_Cartesian_Geocentric":
            CartesianCoordinateType = "geocentric";
            break;

        case "rb_Cartesian_None":
            CartesianCoordinateType = "none";
            break;

        default:
            throw ("Internal error - unknown radio button '" + id + "'");
            break;
    }

    WriteCookie ("CartesianCoordinateType", id.substring("rb_Cartesian_".length), COOKIE_EXPIRATION_DAYS);
    CalculateSolarSystem();
}


function InitPage()
{
    canvas = document.getElementById("solar");
    context = canvas.getContext("2d");
    LoadGeographicCoordinates();
    CalculateSolarSystem();
    Timer();    // prime the pump for the self-perpetuating every-1-second timer event
}