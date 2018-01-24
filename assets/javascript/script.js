$(document).ready(function () {

    // FIREBASE CONFIG
    var config = {
        apiKey: "AIzaSyAT1VHDF0QTrzQxtQBJzfrNjr3-dHRnGEI",
        authDomain: "train-schedule-2968c.firebaseapp.com",
        databaseURL: "https://train-schedule-2968c.firebaseio.com",
        projectId: "train-schedule-2968c",
        storageBucket: "train-schedule-2968c.appspot.com",
        messagingSenderId: "50889465551"
    };

    firebase.initializeApp(config);

    const dbRef = firebase.database().ref("TrainSchedule/trains");
    
    //Reset form after submit button clicked
    function resetForm() {
        $("form input:not([submit])").val('');
        $("#train-name-input").focus();
    };


    //Grab train info from form
    $("#add-train").click(function (event) {
        event.preventDefault();

        const newTrain = {
            name: $("#train-name-input").val().trim(),
            destination: $("#destination-input").val().trim(),
            frequency: $("#frequency-input").val().trim(),
            time: moment($("#train-time-input").val().trim(), "HH:mm").subtract(1, "years").format("X")
        };

        //Push to database
        dbRef.push(newTrain);

        resetForm();
    });


    dbRef.on("child_added", function (childSnapshot, prevChildKey) {
        const newTrain = childSnapshot.val();
        console.log(newTrain);

        // Calculations

        var timeDiff = 0;
        var timeRemainder = 0;
        var frequency = childSnapshot.val().frequency;

        console.log(frequency);

        timeDiff = moment().diff(moment.unix(childSnapshot.val().time), "minutes");

        timeRemainder = timeDiff % frequency;
        
        minutesTillArrival = frequency - timeRemainder;

        nextTrain = moment().add(minutesTillArrival, "m").format("hh:mm A");
        
        
         //Append to table
        $("#train-table").append(
            "<tr><td id='train-name'>" + newTrain.name + "</td>" +
            "<td id='train-dest'>" + newTrain.destination + "</td>" +
            "<td id='train-freq'>" + newTrain.frequency + "</td>" +
            "<td id='next-train'>" + nextTrain + "</td>" +
            "<td id='minutes-till'>" + minutesTillArrival + 
            "<td><button type='button' class='btn btn-danger'>Delete</button></td></tr>"
        )
    });


    function updateTime() {
        nIntervId = setInterval(updateTrains, 1000 * 60);
    }

    //An attempt at updating the minutes till arrival and next train. Still only working for the first row in the table.

    function updateTrains() {

        dbRef.on("child_added", function (childSnapshot, prevChildKey) {

            var timeDiff = 0;
            var timeRemainder = 0;
            var minutesTillArrival = "";
            var nextTrain = "";
            var frequency = childSnapshot.val().frequency;


            timeDiff = moment().diff(moment.unix(childSnapshot.val().time), "minutes");

            timeRemainder = timeDiff % frequency;

            minutesTillArrival = frequency - timeRemainder;

            nextTrain = moment().add(minutesTillArrival, "m").format("hh:mm A");

            $('#next-train').html(nextTrain);
            $('#minutes-till').html(minutesTillArrival);

            console.log("1 minute down");

        });
    }

    $(function () {
        updateTime();
    });

    //Remove a row. Not working :(
    // $("#train-table").on("click", "btn-danger"), function(){
    //    $(this).closest('tr').remove();
    //  };

    //Reload the page every minute
    // setInterval(function() {
    //     window.location.reload();
    //   }, 60000);
})