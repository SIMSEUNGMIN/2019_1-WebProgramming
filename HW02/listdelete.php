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

  //현재 삭제할 파일을 연다
  $myfile = fopen("data/".$filename, "r") or die("not save");

  //삭제할 파일의 정보를 배열로 저장
  $dataarray;

  while(!feof($myfile)){
    $temp = fgets($myfile);
    if($temp != ""){
      $temp = explode("|", $temp); //"|"단위로 쪼갬
      $data = $temp[1] ." " .$temp[2];
      //echo $data;
      $dataarray[$temp[0]] = $data;
    }
  }

  fclose($myfile);

  //들어온 값이랑 배열에 있는 값이랑 비교
  $str = $str[1]; //뒤의 내용 부분만 들어가게 됨
  //echo "여기 있음" .$str;

  foreach ($dataarray as $key => $value) {
    //만약 일정 내용이랑 같으면 뒤의 일정 날짜 비교
    //echo "key " .$key .", " .$str;
    //echo "답 : " .strpos($str, $key);
    if(strpos($str, $key) !== false){
      //echo "들어옴";
      $value = explode(" ", trim($value, "\n"));
      if((strpos($str, $value[0]) !== false) && (strstr($str, $value[1]) !== false)){
        //echo "dfd" .$dataarray[$key];
        //뒤의 일정 날짜랑도 같으면 삭제
        unset($dataarray[$key]);
        //echo "길이" .count($dataarray);
        break;
      }
    }
  }

  //다시 연다.
  $myfile = fopen("data/".$filename, "w") or die("not save");

  //배열에 저장된 데이터 새로 저장해야함
  foreach ($dataarray as $key => $value) {
    $value = explode(" ", trim($value, " "));
    fwrite($myfile, $key ."|" .$value[0] ."|" .$value[1] ."\n");
    //echo "dsfsdfs : " .$value[0] .", " .$value[1];
  }

  fclose($myfile);

 ?>
