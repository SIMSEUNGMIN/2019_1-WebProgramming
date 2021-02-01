var today;
var select;
var firstDay;
var lastDay;
var year;
var month;
var current;

//달력 세팅
function settingCalendar(){
  var date = new Date();

  //달력의 년도와 월을 나타냄
  year = date.getFullYear();
  month = date.getMonth() + 1;
  var returnData = year + "年" + month + "月";
  document.getElementById("yearNmonth").innerHTML = returnData;

  //달력의 첫째날과 마지막날을 구함
  var firstOfM = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastOfM = new Date(date.getFullYear(), date.getMonth()+1, 0);

  firstDay = firstOfM.getDay(); // 3
  lastDay = lastOfM.getDate(); //31

  //달력의 날짜를 채움
  for(var i = firstDay; i < (firstDay + lastDay); i++){
    document.getElementById(i).innerHTML = i - (firstDay-1);
  }

  //오늘 날짜를 구함
  today = date.getDate();

  //오늘 날짜보다 전의 날짜는 칸을 회색으로 바꿈(확인 필요)
  for(var i = today+firstDay-1; firstDay <= i; i--){
    document.getElementById(i).style.background = "#e3e4ea";
  }

  //오늘 날짜는 파란색으로 바꿈
  document.getElementById(today+firstDay-1).style.background = "#96e3ff";
  document.getElementById(today+firstDay-1).setAttribute("ondblclick", "showAddBox()");
  // var ul = document.createElement("ul");
  // document.getElementById(today+firstDay-1).appendChild(ul).id = "list" + (today+firstDay-1); //원래 id칸
  // alert(document.getElementById(today+firstDay-1).appendChild(ul).id);

  //오늘 날짜보다 뒤의 날짜는 칸을 녹색으로 바꿈
  for(var i = today+firstDay; i < (firstDay+lastDay); i++){
    document.getElementById(i).style.background = "#d9e8ce";
    document.getElementById(i).setAttribute("ondblclick", "showAddBox()");
    // var ul = document.createElement("ul");
    // document.getElementById(i).appendChild(ul).id = "list" + i; //원래 id칸
  }
}

//계획 추가 박스
function showAddBox(){
  //선택한 셀 번호 가져오기
  var e = window.event;
  var cal = e.target || e.srcElement;
  select = cal.id;
  document.getElementById("day").innerHTML = (select-firstDay + 1) + "日 일정추가";

  var addWindow = document.getElementById("addPlanWindow");
  var add = document.getElementById("add");
  var cancel = document.getElementById("cancel");

  //처음에 함수 실행되면 생김
  addWindow.style.display = "block";

  //닫기 버튼 눌렀을 때
  cancel.onclick = function() {
    addWindow.style.display = "none";
  }

  // 다른데 누르면 창 사라짐
  window.onclick = function(event) {
    if (event.target == addWindow) {
      addWindow.style.display = "none";
    }
  }

  //add 버튼을 눌렀을 때
  add.onclick = function() {
    addWindow.style.display = "none";
    //셀에 추가하는 함수 실행
    var addInput = document.getElementById("input").value;
    document.getElementById("input").value = null;
    addcell(addInput);
  }
}

//셀의 내용 박스 추가
function addcell(addInput){

  //cell을 만듦
  var cell = document.createElement("div");
  var delCell = document.createElement("span");
  var x = document.createTextNode("x");
  var input = document.createElement("input");

  input.style.border = "0px";
  input.style.background = "#e3e4ea";
  input.style.width = "75px";
  input.style.height = "10px";
  input.setAttribute("type", "text");
  input.setAttribute("value", addInput);
  delCell.appendChild(x);
  cell.appendChild(input);
  cell.appendChild(delCell);

  //cell스타일
  //cell.value = addInput;
  cell.classList.add("cells");
  cell.style.background = "#e3e4ea";
  cell.style.border = "1px solid black";
  cell.style.color = "black";
  //cell.id = "cell"+ cellCount;//cell에 id부여해줌
  //cellCount++;

  //x표시에 대한 class지정
  delCell.classList.add("close");

  //셀 박스 표시
  cell.style.display = "block";
  //해당 칸에 셀을 넣는 문장
  document.getElementById(select).appendChild(cell);

  // //셀이 어디에 몇 번 째로 들어가는지 지정
  // var newItem = document.createElement("li");
  // newItem.appendChild(cell);
  // var list = document.getElementById("list" + select);
  // list.insertBefore(newItem, list.childNodes[0]);

  //취소 버튼 눌렀을 때 일정 변경 박스가 떠야함
  delCell.onclick = function() {
    modiCell(cell);
  }
}

//일정 변경 박스
function modiCell(id){
  //document.getElementById("modiPlanWindow").style.display = "block";
  var modiWindow = document.getElementById("modiPlanWindow");

  //일정 날짜 변경을 기본 값으로 하기
  var day = document.getElementById("modiDay");
  var cMonth = month;
  var cDay = (id.parentNode.childNodes[0].textContent);

  if(cMonth < 10){
    cMonth = "0" + cMonth;
  }

  if(cDay < 10){
    cDay = "0" + cDay;
  }

  //일정 날짜 변경 세팅
  day.value = year + "-" + cMonth + "-" + cDay;

  //일정 순서 변경 부분 현재 기본 값으로 하기
  var order = document.getElementById("modiNumber");
  var orderCount = 0;

  //현재 id의 value의 값이랑 부모노드를 통해서 자신의 노드위치를 찾도록 함
  for(var i = 1; i <= id.parentNode.childElementCount; i++){
    //childElementCount 수는 1부터 시작
    if(id.childNodes[0].value == id.parentNode.childNodes[i].childNodes[0].value){
      //childeNode[0]은 text라서 1부터 봐도 됨
      orderCount = i;
    }
  }

  //일정 순서 변경 세팅
  var currentOrder = orderCount;
  order.value = orderCount;
  order.min = 1;
  order.max = id.parentNode.childElementCount;
  modiNumber.disabled=false;

  //노드 구조 알기 위해서 참고하면 좋을 부분
  // alert(id.childNodes[0].value);
  // alert(id.parentNode.childNodes[1].childNodes[0].value); //div의 value
  // alert(id.parentNode.childElementCount); //element 개수만 구함 (text제외)

  //-기준으로 나누어서 배열에 저장
  current = document.getElementById("modiDay").value;
  var currentDate = document.getElementById("modiDay").value.split("-");
  var currentYear = currentDate[0]; //현재 년도
  var currentMonth = currentDate[1]; //현재 월
  var currentDay = currentDate[2]; //현재 일

  //세팅 다 하고 일정 변경 박스 띄움
  modiWindow.style.display = "block";

  //save버튼 누르면 일정 날짜 변경된 부분이랑 일정 순서 변경된 부분에 맞추어 변화
  //순서와 날짜는 같이 변경 안됨(변경하는 순간 순서 변경은 불가능하도록 해야함)
  //modiWindow 사라짐
  save.onclick = function(){

    //save시 받는 날짜
    var save = document.getElementById("modiDay").value.split("-");
    var saveYear = save[0];
    var saveMonth = save[1];
    var saveDay = save[2];

    //날짜가 바뀐 경우가 더 큰 경우이므로 날짜가 바뀌었을 때를 우선 순위로 해야함
    if(parseInt(today) > parseInt(saveDay)){ //날이 예전 날일 경우(회색부분일 경우)
      alert("지난 날로 이동 불가합니다.");
    }
    else if(parseInt(currentMonth) != parseInt(saveMonth)){ //달이 바뀌었을 경우
      alert("이번 달이 아닌 달로 이동이 불가능합니다.");
    }
    else if(modiNumber.disabled == false){ //날짜가 바뀌지 않고 순서만 바뀐 경우
      //만약 일정 순서가 변경되었다면 그에 해당하는 행동을 하기 위해서 함수 호출
      if(order.value != currentOrder){
        changeOrder(id, currentOrder, order.value);
      }
    }
    else{ //날짜가 바뀐 경우(일정 이동이 가능한 경우)
      //현재 노드 삭제하고 저장된 날짜 칸에 넣어줌(appendChild)
    //  alert(id.parentNode.childNodes[0].textContent);

      var cTable = document.getElementById("currentTable");
      //저장된 날짜 칸을 찾아 나섬
      //alert("바꾸고 싶은 날짜 : " + saveDay);

      var count = 1;

      for(var j = firstDay; j < 7; j++){ //첫 줄로 갈 경우
        if(parseInt(saveDay) == parseInt(cTable.rows[2].cells[j].childNodes[0].textContent)){
          id.parentNode.removeChild(id);
          cTable.rows[2].cells[j].appendChild(id);
          modiWindow.style.display = "none";
          break;
        }
        //alert(cTable.rows[2].cells[j].childNodes[0].textContent);
      }

      for(var i = 3; i < 8; i++){ //중간 줄
        for(var j = 0; j < 7; j++){
          if(count >= parseInt(lastDay)){
            break;
            break;
          }
          else{
            //alert("i : " + i + ", " + "j : " + j);
            //alert(parseInt(cTable.rows[i].cells[j].childNodes[0].textContent));
            if(parseInt(saveDay) == parseInt(cTable.rows[i].cells[j].childNodes[0].textContent)){
              id.parentNode.removeChild(id);
              cTable.rows[i].cells[j].appendChild(id);
              modiWindow.style.display = "none";
              break;
              break;
            }
            count++;
            //alert(count);
          }
        }
      }
    }
    modiWindow.style.display = "none";
  }

  //delete버튼 누르면 modiWindow사라지고 박스도 사라짐
  deleteButton.onclick=function(){
      modiWindow.style.display = "none";
      id.parentNode.removeChild(id);
  }

  //다른데 누르면 창 사라짐
  window.onclick = function(event) {
    if (event.target == modiWindow) {
      modiWindow.style.display = "none";
    }
  }
}

//순서가 변경 되었을 때 박스의 순서를 바꿔줌
function changeOrder(id, currentOrder, order){ //order이 원하는 순서
    // list.insertBefore(newItem, list.childNodes[0]);

    var parent = id.parentNode; //td

    if(order == 1){ //가장 첫 번째로 움직일 경우
      parent.insertBefore(id, parent.childNodes[1]);
    }
    else if(order == parent.childElementCount){ //가장 마지막으로 움직일 경우
      parent.removeChild[currentOrder];
      parent.appendChild(id);
    }
    else if(currentOrder > order){ //순서가 현재보다 위로 올라갈 경우
      parent.insertBefore(id, parent.childNodes[order]);
    }
    else{ //순서가 현재보다 아래로 내려오는 경우
      order = parseInt(order);
      order = order + 1;
      parent.insertBefore(id, parent.childNodes[order]);
    }
}

//날짜 변경시마다 일정 순서 변경박스 disabled 풀었다 열었다 하기
function changeDay(){
  if(current == document.getElementById("modiDay").value){
  modiNumber.disabled=false;
  }
  else{
  modiNumber.disabled=true;
  }
}
