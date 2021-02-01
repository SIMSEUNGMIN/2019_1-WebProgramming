    <?php
      session_start();

      class SignIn { //제출버튼을 눌렀을 때
        //생성자
        public function SignIn($userId, $userPw){
          $this->id = $userId;
          $this->pw = $userPw;
        }

        //연관 배열의 목록의 id와 같은지 비교
        //같은게 있으면 false, 같은게 없으면 true
        public function idSearch(){

          //파일에 저장된 목록을 연관배열로 저장
          $signArray;
          $file = fopen("data/person.txt", "a+");

          while(!feof($file)){
            $temp = fgets($file);
            if($temp != ""){
            $signArray[$temp] = fgets($file);
            }
          }

          fclose($file);

          $result;

          //같은 계정이 있는지 확인
          foreach ($signArray as $key => $value) {
            //입력한 아이디가 있을 경우
            if(strcmp(trim($key, "\n"), trim($this->id, "\n")) == 0){
              //비밀번호를 확인
              if(strcmp(trim($value, "\n"), trim($this->pw, "\n")) == 0){
                //다른 초기 화면으로 가야함(to do list 초기 화면)
                echo("<script>location.href='todolist.html';</script>");
                $_SESSION["loginid"] = $this->id;
                return;
              }
              //비밀번호가 안 맞을 경우
              else{
                echo "<script>alert(\"패스워드가 틀립니다.\");</script>";
                echo("<script>location.href='hw02.html';</script>");
                return;
              }
            }
          }

          //다 돌았는데 아이디가 없을 경우
          echo "<script>alert(\"존재하지 않는 아이디 입니다.\");</script>";
          echo("<script>location.href='hw02.html';</script>");
          return;

        }

      }
      $file = new SignIn($_POST["userid"], $_POST["userpassword"]);
      $file->idSearch();

     ?>
