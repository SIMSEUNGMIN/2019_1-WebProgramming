<?php
  session_start();

  //현재 로그인 아이디
  $filename = $_SESSION["loginid"];

  //먼저 가져온 문장이 어디에 속하는지 알아야 함
  $str = explode("|", $_REQUEST["key"]);

  switch ($str[0]) {
    case "family":
      $filename = $filename ."_" ."family.txt";
      break;
    case "school":
      $filename = $filename ."_" ."school.txt";
      break;
    case "travel":
      $filename = $filename ."_" ."travel.txt";
      break;
    case "exercise":
      $filename = $filename ."_" ."exercise.txt";
      break;
    default:
      break;
  }

  $myfile = fopen("data/".$filename, "a+") or die("not save");

  //저장할 데이터 (배열 0번 째 빼고 모아서 저장해야 함)
  $savedata = $str[1] ."|" .$str[2] ."|" .$str[3] ."\n";

  //saveData 저장
  fwrite($myfile, $savedata);
  fclose($myfile);

 ?>
