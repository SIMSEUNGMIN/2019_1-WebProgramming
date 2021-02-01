<html>
  <body>
    <?php

      class SignUp { //회원가입 버튼을 눌렀을 때
        //생성자
        public function SignUp($userId, $userPw){
          $this->id = $userId;
          $this->pw = $userPw;
        }

        //연관 배열의 목록의 id와 같은지 비교
        //같은게 있으면 false, 같은게 없으면 true
        public function idSearch(){

          //파일에 저장된 목록을 연관배열로 저장
          $signArray;
          $file = fopen("/data/person.txt", "a+");

          while(!feof($file)){
            $temp = fgets($file);
            if($temp != ""){
            $signArray[$temp] = fgets($file);
            }
          }

          fclose($file);

          $result;

          //같은 아이디가 있는지 확인
          foreach ($signArray as $key => $value) {

            if(strcmp(trim($key, "\n"), trim($this->id, "\n")) == 0){
              //같은 아이디가 있는 경우
              return true;
            }
            else{
              $result = false;
            }
          }

          return $result;
        }

        //id 또는 password를 입력하지 않고 회원가입을 누를 경우
        //아이디 또는 패스워드를 입력해주세요 문구 출력
        //id가 이미 존재하면 이미 존재하는 아이디가 있습니다 문구 출력
        //id가 존재하지 않으면 성공적으로 저장되었습니다 문구 출력
        public function checkId(){ //빈칸일 경우
          if($this->id == "" || $this->pw == ""){
            echo "<script>alert(\"아이디 또는 패스워드를 입력해주세요.\");</script>";
          }
          else{
            if($this->idSearch() == true){ //id가 이미 존재할 경우
              echo "<script>alert(\"이미 존재하는 아이디가 있습니다.\");</script>";
            }
            else{ //id가 존재하지 않을 경우
              //새로운 아이디 비번 저장
             $ofile = fopen("/data/person.txt", "a+");
              $txt = "\n";

              $user = $this->id .$txt;
              $userPw = $this->pw .$txt;

              fwrite($ofile, $user);
              fwrite($ofile, $userPw);

              fclose($ofile);

              echo "<script>alert(\"성공적으로 저장되었습니다.\");</script>";
            }
          }
        }

      }

      $file = new SignUp($_POST["userid"], $_POST["userpassword"]);
      $file->checkId();

      //echo("<script>location.href='hw02.html';</script>");

     ?>

  </body>
</html>
