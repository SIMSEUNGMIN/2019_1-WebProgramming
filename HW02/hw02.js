var i = 0;
var currentlist = 0;
var currentid = 0;

function reset(){ //아이디랑 패스워드 초기화
  var userId = document.getElementById("userID");
  var userPassword = document.getElementById("userPW");

  userId.setValue = "";
  userPassword.setValue = "";
}

//추가 눌렀을 때 박스를 뜨게 한다.
function viewaddbox(){
  var addbox = document.getElementById("addbox");
  var setstartday = document.getElementById("startday");

  addbox.style.display = "block";

  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();

  if (("" + month).length == 1) { month = "0" + month; }
  if (("" + day).length   == 1) { day   = "0" + day;   }

  setstartday.value = year + "-" + month + "-"+ day;

}

//추가 박스에서 close눌렀을 때
function closeaddbox(){
  document.getElementById("selectlist").value = "가족";
  document.getElementById("addmemo").value = "";
  document.getElementById("endday").value = "";
  document.getElementById("addbox").style.display = "none";
}

//추가 박스에서 submit눌렀을 때
//값들을 전부 가져와서 저장하고, 어느 테이블에 넣을지 생각
function addlist(){
  document.getElementById("addbox").style.display = "none";

  var option = document.getElementById("selectlist").value;
  var memo = document.getElementById("addmemo").value;
  var startday = document.getElementById("startday").value;
  var endday = document.getElementById("endday").value;

  //일정 리스트 추가 목록
  var li = document.createElement("li");
  li.setAttribute("id", "list" + i);
  i++;
  li.setAttribute("draggable", "true");
  li.setAttribute("ondragstart", "drag(event)");
  var delli = document.createElement("span");
  delli.setAttribute("class", "delspan");
  delli.setAttribute("onclick", "deletelist()");
  var delx = document.createElement("i");
  delx.setAttribute("class", "fas fa-cut");
  var content = memo + " ( " + startday + " ~ " + endday + " ) ";
  var textNode = document.createTextNode(content);

  li.appendChild(textNode);
  delli.appendChild(delx);
  li.appendChild(delli);


  //서버에 저장될 데이터로 보기 좋게 변경
  var serverdata = memo + "|" + startday + "|" + endday;

  //어느 칸을 들어가야 할지 확인
  //칸에 넣고 칸의 제목과 내용을 서버에 저장
  switch (option) {
    case "가족":
      document.getElementById("familytable").appendChild(li);
      serverdata = "family" + "|" + serverdata;
      break;
    case "학교":
      document.getElementById("schooltable").appendChild(li);
      serverdata = "school" + "|" + serverdata;
      break;
    case "여행":
      document.getElementById("traveltable").appendChild(li);
      serverdata = "travel" + "|" + serverdata;
      break;
    case "운동":
      document.getElementById("exercisetable").appendChild(li);
      serverdata = "exercise" + "|" + serverdata;
      break;
    default:
      break;
  }

  //서버로 데이터를 저장
  listsave(serverdata);

  //마지막에 값 초기화 해야함 (close 눌렀을 때와 같은 효과)
  closeaddbox();
}

//앞으로 여길 누르면 이게 어느 리스트의 값인지 확인 (가족, 여행, 학교, 운동)
//그리고 삭제, 삭제 후 텍스트 파일에 다시 들어가도록 설정
function deletelist(){
  //이벤트가 실행된 위치
  var e = window.event;
  //table 아이디를 찾기 위해 계속 나감 (html -> span -> li -> table)
  var table = e.target.parentNode.parentNode.parentNode;
  var tableid = table.id;

  //list에 있는 값
  var list = e.target.parentNode.parentNode; //(html -> span -> list)
  var listvalue = e.target.parentNode.parentNode.childNodes[0].nodeValue;

  //나중에 삭제할 때 들어가는 값이랑 저장된 | 구간의 부분들이 전부 일치하는지 비교하고 삭제
  var deletedata = listvalue;
  switch (tableid) {
    case "familytable":
      document.getElementById("familytable").removeChild(list);
      deletedata = "family" + "|" + deletedata;
      break;
    case "schooltable":
      document.getElementById("schooltable").removeChild(list);
      deletedata = "school" + "|" + deletedata;
      break;
    case "traveltable":
      document.getElementById("traveltable").removeChild(list);
      deletedata = "travel" + "|" + deletedata;
      break;
    case "exercisetable":
      document.getElementById("exercisetable").removeChild(list);
      deletedata = "exercise" + "|" + deletedata;
      break;
    default:
      break;
  }

  //서버로 deletedata들어가도록 설정, 서버에서 삭제 구현
  listdelete(deletedata);
}

//검색 버튼 눌렀을 때마다 뜨는 박스
function viewsearchbox(){
  document.getElementById("searchendday").value = "";
  document.getElementById("memokeyword").value = "";
  var searchbox = document.getElementById("searchbox");
  searchbox.style.display = "block";
  var setstartday = document.getElementById("searchstartday");

  setstartday.value = "";
}

//드랍 앤 드롭
function allowDrop(ev) {
  ev.preventDefault();
}

//드래그 해서 옮기는 부분
//여기 옮길 때 리스트 삭제 해야함
function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id); //li의 아이디
  ev.dataTransfer.setData("cur", ev.target.parentNode.id); //table의 id
}

//떨구고 나서 바뀐 부분 다시 서버에 저장해야한다.
function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  currentlist = ev.dataTransfer.getData("cur");
  currentid = data; //list0
  //새롭게 리스트에 추가
  ev.target.childNodes[0].appendChild(document.getElementById(data));

  //어떤 리스트의 list인지 확인
  var listid = ev.target.childNodes[0].id;
  var listnumber = ev.target.childNodes[0].childElementCount;
  //alert(listnumber);
  var listvalue = ev.target.childNodes[0].childNodes[listnumber-1].childNodes[0].nodeValue;
  //alert(listvalue);

  listvalue = listvalue.split(" ( ");
  var listcontent = listvalue[0];
  var listday = listvalue[1].split(" ~ ");
  var liststart = listday[0];
  var listend = listday[1].split(" ) ");
  listend = listend[0];

  //서버에 저장할 값 가공
  var saveserver = listcontent + "|" + liststart + "|" + listend;
  switch (listid) {
    case "familytable":
      saveserver = "family" + "|" + saveserver;
      break;
    case "schooltable":
      saveserver = "school" + "|" + saveserver;
      break;
    case "traveltable":
      saveserver = "travel" + "|" + saveserver;
      break;
    case "exercisetable":
      saveserver = "exercise" + "|" + saveserver;
      break;
    default:
      break;
  }

  //alert(saveserver);

  listsave(saveserver);

  changedata();

}

//리스트가 추가될 때마다 서버에 저장하기 위해 호출하는 함수
//여기서의 target은 저장될칸|저장될 내용 순으로 구성
function listsave(target) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {};
  xhttp.open("GET", "addlist.php?key="+target, true);
  xhttp.send();
}

//리스트가 삭제할 때마다 서버에 새로 저장하기 위해 호출하는 함수
//여기서의 target은 저장될칸|저장될 내용 순으로 구성
function listdelete(target) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {};
  xhttp.open("GET", "listdelete.php?key="+target, true);
  xhttp.send();
}

//서버에서 값 삭제하기 위한 값 가공 함수
function changedata(){
  //alert(currentlist); //ul의 테이블 아이디 나옴 (schooltable 이런식)
  var listdata = document.getElementById(currentid).textContent;
  //list원소의 id필요

  //들어갈 데이터
  var movedata = listdata;
  switch (currentlist) {
    case "familytable":
      movedata = "family" + "|" + movedata;
      break;
    case "schooltable":
      movedata = "school" + "|" + movedata;
      break;
    case "traveltable":
      movedata = "travel" + "|" + movedata;
      break;
    case "exercisetable":
      movedata = "exercise" + "|" +movedata;
      break;
    default:
      break;
  }

  //서버로 들어가서 삭제하도록 구현
  listdelete(movedata);
}

//로그인 화면에서 todolist로 넘어갈 때 list 불러온다 (가족)
function openlistfamily(){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function(){
  if(this.readyState == 4 && this.status == 200){
    updatelist("familytable", JSON.parse(this.responseText));
    }
  };

  xhttp.open("GET", "openlistfamily.php", true);
  xhttp.send();
}

//로그인 화면에서 todolist로 넘어갈 때 list 불러온다 (학교)
function openlistschool(){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function(){
  if(this.readyState == 4 && this.status == 200){
    updatelist("schooltable", JSON.parse(this.responseText));
    }
  };

  xhttp.open("GET", "openlistschool.php", true);
  xhttp.send();
}

//로그인 화면에서 todolist로 넘어갈 때 list 불러온다 (여행)
function openlisttravel(){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function(){
  if(this.readyState == 4 && this.status == 200){
    updatelist("traveltable", JSON.parse(this.responseText));
    }
  };

  xhttp.open("GET", "openlisttravel.php", true);
  xhttp.send();
}

  //로그인 화면에서 todolist로 넘어갈 때 list 불러온다 (운동)
function openlistexercise(){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function(){
  if(this.readyState == 4 && this.status == 200){
    updatelist("exercisetable", JSON.parse(this.responseText));
    }
  };

  xhttp.open("GET", "openlistexercise.php", true);
  xhttp.send();
}

//들고온 배열 업데이트
function updatelist(table, array){
  for(var key in array){
    if((key == "") || (key == "\n")){
    }
    else{
      var str = array[key].split(" ");
      var startday = str[0];
      var endday = str[1];

      var li = document.createElement("li");
      li.setAttribute("id", "list" + i);
      i++;
      li.setAttribute("draggable", "true");
      li.setAttribute("ondragstart", "drag(event)");
      var delli = document.createElement("span");
      delli.setAttribute("class", "delspan");
      delli.setAttribute("onclick", "deletelist()");
      var delx = document.createElement("i");
      delx.setAttribute("class", "fas fa-cut");
      var content = key + " ( " + startday + " ~ " + endday + " ) ";
      var textNode = document.createTextNode(content);

      li.appendChild(textNode);
      delli.appendChild(delx);
      li.appendChild(delli);

      document.getElementById(table).appendChild(li);
    }
  }
}

//todolist시작할 때 업데이트 시키는 함수 (list업데이트, 저장 내역 불러옴)
function startlist(){
  openlistschool();
  openlisttravel();
  openlistexercise();
  openlistfamily();
}


//검색 버튼에서 제출 버튼을 눌렀을 때 순서 지정해서 밑에 출력
function checkorder(){
  document.getElementById("searchbox").style.display = "none";

  var memokey = document.getElementById("memokeyword").value;
  var startday = document.getElementById("searchstartday").value;
  var endday = document.getElementById("searchendday").value;
  var standard = document.getElementById("searchlist").value;
  //라디오 버튼 값
  var resultorder;
  //라디오 버튼 값 찾기
  var order = document.getElementsByName("order");
  for(var i = 0; i < order.length; i++){
    if(order[i].checked == true){
        resultorder = order[i].value;
    }
  }

  let resultarray = [];

  findNode("familytable", resultarray);
  findNode("schooltable", resultarray);
  findNode("traveltable", resultarray);
  findNode("exercisetable", resultarray);

  if((memokey != "") &&(startday == "") && (endday == "")){
    resultarray = calmemo(memokey, resultarray);
  }

  if((memokey == "") &&(startday != "") && (endday == "")){
    startday = startday.split("-");
    startday = startday[0] + startday[1] + startday[2];
    resultarray = calstartday(startday, resultarray);
  }

  if((memokey == "") &&(startday == "") && (endday != "")){
    endday = endday.split("-");
    endday = endday[0] + endday[1] + endday[2];
    resultarray = calendday(endday, resultarray);
  }

  if((memokey != "") &&(startday != "") && (endday == "")){
    resultarray = calmemo(memokey, resultarray);
    startday = startday.split("-");
    startday = startday[0] + startday[1] + startday[2];
    resultarray = calstartday(startday, resultarray);
  }

  if((memokey != "") &&(startday == "") && (endday != "")){
    resultarray = calmemo(memokey, resultarray);
    endday = endday.split("-");
    endday = endday[0] + endday[1] + endday[2];
    resultarray = calendday(endday, resultarray);
  }

  if((memokey == "") &&(startday != "") && (endday != "")){
    startday = startday.split("-");
    startday = startday[0] + startday[1] + startday[2];
    resultarray = calstartday(startday, resultarray);
    endday = endday.split("-");
    endday = endday[0] + endday[1] + endday[2];
    resultarray = calendday(endday, resultarray);
  }

  if((memokey != "") &&(startday != "") && (endday != "")){
    resultarray = calmemo(memokey, resultarray);
    startday = startday.split("-");
    startday = startday[0] + startday[1] + startday[2];
    resultarray = calstartday(startday, resultarray);
    endday = endday.split("-");
    endday = endday[0] + endday[1] + endday[2];
    resultarray = calendday(endday, resultarray);
  }

  //이제 검색의 결과가 나옴
  //검색의 결과로 이제 정렬 해야함
  if(standard == "메모"){
    //key값만 가지고 배열 만들기
    //그 배열을 정렬한 다음 key값에 맞추어서 순서대로 resultarray에 정렬하기
    var keyarray = [];
    for(var key in resultarray){
      keyarray.push(key);
    }

    if(resultorder == "오름차순"){
      keyarray.sort();
    }
    else{
      keyarray.sort();
      keyarray.reverse();
    }

    resultarray = printkey(keyarray, resultarray);

  }
  else if(standard == "시작 날짜"){
    var startarray = [];
    for(var key in resultarray){
      var str = resultarray[key].split(" ");
      str = str[0].split("-");
      str = str[0] + str[1] + str[2];
      startarray.push(Number(str));
    }

    if(resultorder == "오름차순"){
      startarray.sort();
    }
    else{
      startarray.sort();
      startarray.reverse();
    }

    resultarray = printstart(startarray, resultarray);

  }
  else{
    var endarray = [];
    for(var key in resultarray){
      var str = resultarray[key].split(" ");
      str = str[1].split("-");
      str = str[0] + str[1] + str[2];
      endarray.push(Number(str));
    }

    if(resultorder == "오름차순"){
      endarray.sort();
    }
    else{
      endarray.sort();
      endarray.reverse();
    }

    resultarray = printend(endarray, resultarray);

  }

  var cell = document.getElementById("resultsearch");
  while (cell.hasChildNodes()) {
     cell.removeChild(cell.firstChild);
    }

  for(var key in resultarray){
    var str = resultarray[key].split(" ");
    var startday = str[0];
    var endday = str[1];
    var li = document.createElement("li");
    var content = key + " ( " + startday + " ~ " + endday + " ) ";
    var textNode = document.createTextNode(content);

    li.appendChild(textNode);
    document.getElementById("resultsearch").appendChild(li);
  }


}

//끝 날짜와 배열이 들어왔을 때 끝 날짜보다 작은 것 기준으로 배열을 만들어줌
function calendday(end, endarray){
  let result = [];
  for(var key in endarray){
    var str = endarray[key].split(" ");
    str = str[1];
    str = str.split("-");
    str = str[0] + str[1] + str[2];
    if(Number(str) < Number(end)){
      result[key] = endarray[key];
    }
  }
  return result;
}

//첫 날짜와 배열이 들어왔을 경우 첫 날짜보다 같거나 큰 것을 기준으로 배열을 만들어줌
function calstartday(start, startarray){
  let result = [];
  for(var key in startarray){
    var str = startarray[key].split(" ");
    str = str[0];
    str = str.split("-");
    str = str[0] + str[1] + str[2];
    if(Number(start) <= Number(str)){
      result[key] = startarray[key];
    }
  }
  return result;
}

//메모랑 배열이 들어왔을 경우 메모에 배열의 메모가 포함되어있는 것 기준으로 배열을 만들어줌
function calmemo(memo, memoarray){
  let result = [];
  for(var key in memoarray){
    if(key.indexOf(memo) !== -1){
      //글자가 있을 경우 추가
      result[key] = memoarray[key];
    }
  }
  return result;
}

//키 순서에 맞춰서 print하는 함수
function printkey(keyarray, array){
  let result = [];
  for(var key in keyarray){
    var str = array[keyarray[key]].split(" ");
    var startday = str[0];
    var endday = str[1];
    result[keyarray[key]] = startday + " " + endday;
  }
  return result;
}

//start날짜 순에 맞춰서 print하는 함수
function printstart(startarray, resultarray){
  let result = [];
  for(var key in startarray){
    for(var start in resultarray){
      var str = resultarray[start].split(" ");
      var startday = str[0];
      var endday = str[1];
      str = str[0].split("-");
      str = str[0] + str[1] + str[2];

      if(str == startarray[key]){
        result[start] = startday + " " + endday;
      }
    }
  }
  return result;
}

//end날짜 순에 맞춰서 print하는 함수
function printend(endarray, resultarray){
  let result = [];
  for(var key in endarray){
    for(var end in resultarray){
      var str = resultarray[end].split(" ");
      var startday = str[0];
      var endday = str[1];
      str = str[1].split("-");
      str = str[0] + str[1] + str[2];

      if(str == endarray[key]){
        result[end] = startday + " " + endday;
      }
    }
  }
  return result;
}


//전체 테이블의 값 찾기
function findNode(table, resultarray){
  var tab = document.getElementById(table);
  var count = tab.childElementCount;

  for(var i = 0; i < count; i++){
    var value = tab.childNodes[i].childNodes[0].textContent;
    var key = value.split(" ( ");
    var content = key[0];
    var startday = (key[1].split(" ~ "))[0];
    var endday = (((key[1].split(" ~ "))[1]).split(" ) "))[0];
    resultarray[content] = startday + " " + endday;
  }
}
