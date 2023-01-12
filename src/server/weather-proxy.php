<?php
  set_time_limit(120);

  define("NODE_PORT", 8181);
  define("FILE_OUT", "node.out");
  define("SCRIPT_PATH", "~/www/pikus.spb.ru/app/code/WeatherChart/src/server/weather.js");
  define("REQUEST_URL", "http://localhost:".NODE_PORT."/weather");

  $node_pid = intval(file_get_contents("nodepid"));
  if($node_pid === 0) {
    $node_pid = exec("PORT=".NODE_PORT." node ".SCRIPT_PATH." ".NODE_PORT." >nodeout 2>&1 & echo $!");
    if ($node_pid > 0) {
      file_put_contents("nodepid", $node_pid, LOCK_EX);
      sleep(1); // wait for node to spin up
    } else {
      echo "Error while weather server start. Please see nodeout file for logs..";
      return;
    }
  }

  $curl = curl_init(REQUEST_URL);
  curl_setopt($curl, CURLOPT_HEADER, 1);
  curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
  $headers = array();
  foreach(getallheaders() as $key => $value) {
    $headers[] = $key . ": " . $value;
  }
  curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
  curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $_SERVER["REQUEST_METHOD"]);
  if($_SERVER["REQUEST_METHOD"] === "POST") {
    curl_setopt($curl, CURLOPT_POST, 1);
    curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($_POST));
  }
  $resp = curl_exec($curl);
  if($resp === false) {
    echo "Error requesting ".REQUEST_URL." ".curl_error($curl);
  } else {
    list($head, $body) = explode("\r\n\r\n", $resp, 2);
    $headarr = explode("\n", $head);
    foreach($headarr as $headval) {
      header($headval);
    }
    echo $body;
  }
  curl_close($curl);
?>
