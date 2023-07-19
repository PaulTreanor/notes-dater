function formatDate(date: string) {
    const dateObject = new Date(date);
    const day = dateObject.getDate();
    const month = dateObject.getMonth();
    const year = dateObject.getFullYear();
  
    // Array of month names
    const monthNames = ["January", "February", "March", "April", "May", "June", 
                        "July", "August", "September", "October", "November", "December"];
  
    // Convert day number to ordinal
    let dayOrdinal;
    if (day % 10 === 1 && day !== 11) {
      dayOrdinal = day + "st";
    } else if (day % 10 === 2 && day !== 12) {
      dayOrdinal = day + "nd";
    } else if (day % 10 === 3 && day !== 13) {
      dayOrdinal = day + "rd";
    } else {
      dayOrdinal = day + "th";
    }
  
    return `${dayOrdinal} ${monthNames[month]} ${year}`;
  }

export default formatDate;