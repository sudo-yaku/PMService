function reformatDates(date) {
    const months = {
      'JAN': '01', 'FEB': '02', 'MAR': '03', 'APR': '04', 'MAY': '05', 'JUN': '06',
      'JUL': '07', 'AUG': '08', 'SEP': '09', 'OCT': '10', 'NOV': '11', 'DEC': '12'
    };
  
    function reformatDateString(dateStr) {
        // Split the input date and time components
        let [datePart, timePart,tt] = dateStr.split(' ');
        let [day, month, year] = datePart.split('-');
        
        // Reformat the date part
        let formattedDate = `20${year}-${months[month]}-${day.padStart(2, '0')}`;
        
        // Check if time part exists and reformat to HH:mm:ss
        if (!timePart) {
          return `${formattedDate}T00:00:00.000Z`;
        }
        
        let timeParts = timePart.split('.');
        let time = timeParts[0];
        let [hours, minutes, seconds] = timeParts;
    
        // Handle AM/PM format
        let period = tt //length > 1 ? timeParts[1].split(' ')[1] : null;
        hours = parseInt(hours, 10);
        if (period === 'PM' && hours !== 12) {
          hours += 12;
        } else if (period === 'AM' && hours === 12) {
          hours = 0;
        }
        
       
    
        let adjustedDate = formattedDate;
    
       
    
        let formattedTime = `${String(hours).padStart(2, '0')}:${minutes}:${seconds}`;
    
        // Combine the date and time
        return `${adjustedDate}T${formattedTime}.000Z`;
      }
    
      function addOneDay(dateStr) {
        let [year, month, day] = dateStr.split('-');
        let nextDay = new Date(`${year}-${month}-${day}`);
        nextDay.setDate(nextDay.getDate() + 1);
        
        // Format back to yyyy-mm-dd
        let nextDayFormatted = nextDay.toISOString().split('T')[0];
        return nextDayFormatted;
      }
  
    return  reformatDateString(date);
      }
  
  // Example usage
  const dates = {
    startdate: "01-JAN-22 12.00.00.000000 AM",
    stopdate: "31-DEC-22 11.59.59.000000 PM"
  };
  
  export {reformatDates}
