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


    //Grab train info from form
    $("#add-train").click(function (event) {
        event.preventDefault();

        const newTrain = {
            name: $("#train-name-input").val().trim(),
            destination: $("#destination-input").val().trim(),
            frequency: $("#frequency-input").val().trim(),
            time: moment($("#train-time-input").val().trim(), "HH:mm").subtract(1, "years").format("X")
        };

        dbRef.push(newTrain);

        console.log(newTrain.time);

        resetForm();
    })

    dbRef.on("child_added", function(childSnapshot, prevChildKey) {
        const newTrain = childSnapshot.val();
        console.log(newTrain);

        // Calculations

        var timeDiff = 0;
        var timeRemainder = 0;
        var minutesTillArrival = "";
        var nextTrain = "";
        var frequency = childSnapshot.val().frequency;

        console.log(frequency);

        timeDiff = moment().diff(moment.unix(childSnapshot.val().time), "minutes");

        timeRemainder = timeDiff % frequency;

        minutesTillArrival = frequency - timeRemainder;

        nextTrain = moment().add(minutesTillArrival, "m").format("hh:mm A");


        //Append to table
        $("#train-table").append(
            "<tr><td>" + newTrain.name + "</td>" +
            "<td>" + newTrain.destination + "</td>" +
            "<td>" + newTrain.frequency + "</td>" +
            "<td>" + nextTrain + "</td>" +
            "<td>" + minutesTillArrival + "</td></tr>"
        )
    });

    function resetForm() {
        $("form input:not([submit])").val('');
        $("#train-name-input").focus();
    }

    //Reload the page every minute
    setInterval(function() {
        window.location.reload();
      }, 60000);
})