/**
 * Function to format time correctly for pdf
 * @param {*} hours 
 * @param {*} minutes 
 * @returns formatted time
 */
export function formatTime(hours, minutes) {
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'
    // Format minutes to always have two digits
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return hours+":"+minutesStr+" "+ampm;
}

/**
 * for number of hours worked for each time period
 */
export function getNumberOfHours (start, end) {
    const startsplit = start.split(' ');
    const endsplit = end.split(' ');
    const starttime = startsplit[0].split(":");
    const endtime = endsplit[0].split(":");
    let starthours =  parseInt(starttime[0], 10);
    let endhours =  parseInt(endtime[0], 10);
    let startmin = 0.0;
    let endmin =  0.0;
  
    // Convert to 24 hour time
    if (startsplit[1] === "PM" && starttime[0] != "12") {
      starthours += 12;
    }
    if (endsplit[1] === "PM" && endtime[0] != "12") {
      endhours += 12;
    }
  
    if (starttime[1] === "15") {
      startmin = 0.25;
    }
    else if (starttime[1] === "30") {
      startmin = 0.5;
    }
    else if (starttime[1] === "45") {
      startmin = 0.75;
    }
  
    if (endtime[1] === "15") {
      endmin = 0.25;
    }
    else if (endtime[1] === "30") {
      endmin = 0.5;
    }
    else if (endtime[1] === "45") {
      endmin = 0.75;
    }
  
    let diff = (endhours+endmin) - (starthours+startmin)
    return diff;
  
}