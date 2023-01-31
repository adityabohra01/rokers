<?php

// Create connection
$conn = mysqli_connect("localhost", "id20140196_rokerss", "R0kers@12345", "id20140196_rokers");

function Redirect($url, $permanent = false) {
    global $conn;
    header('Location: ' . $url, true, $permanent ? 301 : 302);
    mysqli_close($conn);
    exit();
}



// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (empty($_POST["url"])) {
        header("HTTP/1.1 406 Not Acceptable");
        exit();
    } else {
        // check if name only contains letters and whitespace
        $website = $_POST["url"];
        if (!preg_match("/\b(?:(?:https?|ftp):\/\/|www\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/i",$website)) {
            $websiteErr = "Invalid URL";
            // return 406 status code
            header("HTTP/1.1 406 Not Acceptable");
            exit();
        } else {
            // insert url into database
            $sql = "INSERT INTO domains (domain) VALUES ('" . $website . "')";
            // echo($sql);
            // check if row inserted or not
            if (mysqli_query($conn, $sql)) {
                // successfully inserted into database
                // return 200 status code
                header("HTTP/1.1 200 OK");
                exit();
            } else {
                // failed to insert row
                // return 500 status code
                header("HTTP/1.1 500 Internal Server Error");
                exit();
            }
        }
    }

}

// if request method is get
if ($_SERVER["REQUEST_METHOD"] == "GET") {
  // get latest url from database and redirect to it
  $sql = "SELECT domain FROM domains ORDER BY timestamp DESC LIMIT 1;";
  $result = mysqli_query($conn, $sql);
//   echo($result);
  $row = mysqli_fetch_assoc($result);
  $url = $row["domain"];
  Redirect($url, false);
}
mysqli_close($conn);

?>