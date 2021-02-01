<?php
  session_start();

  //현재 로그인 아이디
  $filename = $_SESSION["loginid"] ."_travel.txt";

  //로그인 아이디로 파일을 family 열어본다.
  $myfile = fopen("data/".$filename, "a+") or die("not save");

  $travelarray;

  while(!feof($myfile)){
    $temp = fgets($myfile);
    if($temp != ""){
      $temp = explode("|", $temp); //"|"단위로 쪼갬
      $data = $temp[1] ." " .$temp[2];
      //echo $data;
      $travelarray[$temp[0]] = $data;
    }
  }

  echo json_encode($travelarray);

  fclose($myfile);

 ?>
