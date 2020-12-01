// export const baseURL = "http://localhost:1337/";
export const baseURL = "https://api.gcmmasterclass.com/";

export const riskCalculatorURL = "http://www.cvriskcalculator.com/";

export const firebaseConfig = {
    apiKey: "AIzaSyAKZjBPQSf99s3-a_eItbEupB6Shj5KsfA",
    authDomain: "msd-gcm.firebaseapp.com",
    databaseURL: "https://msd-gcm.firebaseio.com",
    projectId: "msd-gcm",
    storageBucket: "msd-gcm.appspot.com",
    messagingSenderId: "575980337670",
    appId: "1:575980337670:web:1c4ee83139917804302187",
    measurementId: "G-6BRKSGNE97"
  };


export const datesDiff = (date1, date2) => {
    var milliInDay = 1000 * 60 * 60 * 24;
    var milliInHour = 1000 * 60 * 60;
    var milliInMinute = 1000 * 60;
    const datediff = Math.floor(Math.abs(date2-date1) / milliInDay);
    const hourdiff = Math.floor((Math.abs(date2-date1) % milliInDay) / milliInHour);
    const minutediff = Math.floor(((Math.abs(date2-date1) % milliInDay) % milliInHour) / milliInMinute);
    const seconddiff = Math.floor((((Math.abs(date2-date1) % milliInDay) % milliInHour) % milliInMinute) / 1000);
    
    return datediff + "&&&" + hourdiff + "&&&" + minutediff + "&&&" + seconddiff;
}