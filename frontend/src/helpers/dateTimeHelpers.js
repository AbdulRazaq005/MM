import {isDate} from "lodash"
import moment from "moment"

export function toMoment(datetimeValue) {
  if (isDate(datetimeValue)) {
    return moment(datetimeValue);
  } else {
    // To safeguard against all possible format from backend & possibly frontend
    return moment(datetimeValue, [
      'DD/MM/YYYY',
      'DD/MM/YYYY HH:mm:ss',
      'YYYY-MM-DD',
      'YYYY-MM-DDTHH:mm:ss',
      'MM/DD/YYYY',
      'MM/DD/YYYY HH:mm:ss',
    ]);
  }
}

export function parseDateTime(datetimeValue, withTime = true) {
  var d = toMoment(datetimeValue)
  if (d.isValid()) {
    return withTime ?
      d.format("YYYY-MM-DD") + "T" + d.format("HH:mm:ss") :
      d.format("YYYY-MM-DD");
  }
  return ""
}

// Display date generated by app
export function displayDate(datetimeValue, format="DD MMM YYYY") {
  var d = toMoment(datetimeValue)
  return d.isValid() ? d.format(format) : '';
}

export function displayDateTime(datetimeValue, format="DD/MM/YYYY HH:mm") {
  var d = toMoment(datetimeValue)
  return d.isValid() ? d.format(format) : '';
}

export function humanizeDate(datetimeValue) {
  var d = toMoment(datetimeValue)
  return d.isValid() ? moment.duration(d.diff(moment())).humanize(true) : "";
}