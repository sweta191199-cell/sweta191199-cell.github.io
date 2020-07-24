// Declare variables
var flag = true;
var symbolFlag;
var minimaxBoard;
var checkwinBoard;
var player1;
var player2;
var mode = {
    noplayer: "1",
    size: 3,
    playas: 'X',
    level: 'easy',
}
// Execute when ready
$(function(){
  //Intro
  $('div.ButtonGroup>button:first-child').css('background-color','#00796B').css('color','white');     // Set default color button
  $('div.ButtonGroup>button').on('click',buttonClick); //Register event handler 
  $('#Start').on('click',startgame); 
});
// Start Game function
function startgame(){
  //print map
  var size = parseInt($("input").val());
  if(!isNaN(size)) mode.size = size;
  console.log(mode.size);
  printMap(mode.size);
  // hide mode field
  $("#field").css("display",'none');
  // set play turn;
  flag = true;
  if(mode.playas == 'X'){
     player1 = 'X'; player2 = 'O'; symbolFlag = true;
  }
  else if(mode.playas == 'O'){ 
     player1 = 'O'; player2 = 'X'; symbolFlag = false;
  }
  else console.log('Error!');
  // Resigter event handler for each td
  $("td").on('mouseover',MouseOver).on('mouseout',MouseOut).on('click',MouseClick);
  $("#restartButton").on('click',restartGame);
}
// Button click function
function buttonClick(){
  $(this).css('background-color','#DEB887').css('color','white');
  $(this).prevAll().css('background-color','inherit').css('color','inherit');
  $(this).nextAll().css('background-color','inherit').css('color','inherit');
  var object = $(this).parent().attr('id');
  if(object=='playerButton') mode.noplayer = $(this).attr('value');
  else if(object=='symbolButton') mode.playas = $(this).attr('value');
  else if(object=='levelButton') mode.level = $(this).attr('value');
  else  console.log("Error!");
}
//Print table
function printMap(size){
  var s = "<table>";
  for(var i=0; i<size; i++){
    s+="<tr>";
    for(var j=0; j<size; j++){
      s+="<td class='text-center' id='"+(i*size+j)+"'></td>";
    }
    s+="</tr>";
  }
  s += "</table>";
  $("#displayField").html(s);
  //Set board for working
  minimaxBoard = new Array(size*size);
  for(var i=0; i<size*size; i++){
    minimaxBoard[i] = i;
  }
  checkwinBoard = new Array(size);
  for(var i=0; i<size; i++){
    checkwinBoard[i] = new Array(size);
    for(var j=0; j<size; j++){
      checkwinBoard[i][j] = 0;
    }
  }
  
}
// Make mouseover
function MouseOver(){
   $(this).css('background-color','#DEB887');
   if(symbolFlag) $(this).html('<i class="fa fa-times fa-5x"></i>');
   else $(this).html('<i class="far fa-circle fa-5x"></i>');
 }
// Make mouseout
function MouseOut(){
   $(this).css('background-color','#DEB887');
   $(this).html('');
 }
// Make mouseclick
function MouseClick(){
   var pos = parseInt($(this).attr('id'));
   if(symbolFlag) $(this).css('background-color','#FFB6C1');
   else $(this).css('background-color','#AFEEEE');
   if(flag) {
     minimaxBoard[pos] = player1;
     checkwinBoard[Math.floor(pos/mode.size)][pos%mode.size] = player1;
   }
   else {
     minimaxBoard[pos] = player2;
     checkwinBoard[Math.floor(pos/mode.size)][pos%mode.size] = player2;
   }
   console.log(minimaxBoard);
   console.log(checkwinBoard);
   $(this).off('click');
   $(this).off('mouseover');
   $(this).off('mouseout');
   // Check win
   if(checkWin(checkwinBoard,pos)){
     if(flag) winDisplay(player1);
     else winDisplay(player2);
   }
   else {
     var available = emptyIndex(minimaxBoard);
     if(available.length == 0){
        winDisplay();
     }
   }
   flag = !flag;
   symbolFlag= !symbolFlag;
   //Check wether computer's turn or not;
   if(!flag&&mode.noplayer=='1'){
     var cturn = minimax(minimaxBoard,checkwinBoard,pos,player2,0,-10000,10000);
     var index = cturn.index;
     $("#"+index).trigger("mouseover").trigger("click");
   }
 }
// Check Win function
function checkWin(checkwinBoard,pos){
  var n = mode.size;
  var max = n>=5?5:n;
  var i = Math.floor(pos/n);
  var j = pos%n;
  var count=1;
	var x, y,x1,y1;
	var temp = checkwinBoard[i][j];
	// cheo 1
	x = i-1;
	y = j-1;
	x1 = i+1;
	y1 = j+1;
	while(x>=0&&y>=0&&checkwinBoard[x][y]==temp){count++; x--; y--;}
	while(x1<n&&y1<n&&checkwinBoard[x1][y1]==temp){count++; x1++; y1++;}
	if(count>=max){return true;}
	// hàng dọc
	count = 1;
	x = i - 1;
  x1 = i + 1;
  while(x>=0&&checkwinBoard[x][j]==temp){count++; x--;}
  while(x1<n&&checkwinBoard[x1][j]==temp){count++; x1++;}
	if(count>=max) {return true;}
	// cheo 2
	count = 1;
	x = i - 1;
	y = j + 1;
	x1 = i + 1;
	y1 = j - 1;
	while(x>=0&&y<n&&checkwinBoard[x][y]==temp){count++;x--;y++;}
	while(x1<n&&y1>=0&&checkwinBoard[x1][y1]==temp){count++;x1++;y1--;}
	if(count>=max){return true;}
	//ngang 
	count = 1;
	y = j+1;
	y1 = j-1;
	while(y<n&&checkwinBoard[i][y]==temp){count++;y++}
	while(y1>=0&&checkwinBoard[i][y1]==temp){count++;y1--;}
	if(count>=max){ return true;}
  // else return false;
  return false;
}
// Display the result
function winDisplay(player){
  var str="";
  if(player==player1) str = "Player 1 Wins!";
  else if(player==player2) str = "Player 2 Wins!";
  else str = "Draw!";
  $("#end>h2").text(str);
  $("#end").css("display","block");
  $("td").off("click");
  //$("#restartButton").on('click',restartGame);
}
// Restart function
function restartGame(){
  $("#end").css("display","none");
  printMap(mode.size);
  flag = true;
  if(player1=='X') symbolFlag = true;
  else symbolFlag = false;
  $("td").on('mouseover',MouseOver).on('mouseout',MouseOut).on('click',MouseClick);
}
// Filter Index
function emptyIndex(board){
  return  board.filter(s => s != 'X' && s != 'O');
}
// Minimax function
function minimax(minimaxBoard, checkwinBoard, pos, player, iter,alpha,beta){
  iter++;
  var available = emptyIndex(minimaxBoard);
  if(checkWin(checkwinBoard,pos)&&player==player2) return {score:-10, iter:iter};
  if(checkWin(checkwinBoard,pos)&&player==player1) return {score:10, iter:iter};
  if(available.length==0) return {score:0, iter:iter};
  //if(iter==6) return {score:0, iter:iter};
  var moves = [];
  var size = available.length;
  var bestVal = player==player2?-10000:10000;
  for(var i=0; i<size; i++){
    var move = {};
    move.index = minimaxBoard[available[i]];
    minimaxBoard[available[i]] = player;
    checkwinBoard[Math.floor(move.index/mode.size)][move.index%mode.size] = player;
    if(player==player2){
      var result = minimax(minimaxBoard, checkwinBoard, move.index, player1, iter,alpha,beta);
      move.score = result.score;
      move.iter = result.iter;
      bestVal = bestVal>=move.score?bestVal:move.score;
      alpha = alpha >= bestVal;
    }
    else{
      var result = minimax(minimaxBoard, checkwinBoard, move.index, player2, iter,alpha,beta);
      move.score = result.score;
      move.iter = result.iter;
      bestVal = bestVal <= move.score?bestVal:move.score;
      beta = beta <= bestVal?beta:bestVal;
    }
    minimaxBoard[available[i]] = move.index;
    checkwinBoard[Math.floor(move.index/mode.size)][move.index%mode.size] = 0;
    moves.push(move);
    if(beta<=alpha) break;
  }
  var bestmove;
  if(player == player2){
    var bestScore = -10000;
    for(var i = 0; i < moves.length; i++){
      if(moves[i].score > bestScore){
        bestScore = moves[i].score;
        bestmove = i;
      }
    }
  }
  else{
    var bestScore = 10000;
    for(var i = 0; i < moves.length; i++){
      if(moves[i].score < bestScore){
        bestScore = moves[i].score;
        bestmove = i;
      }
    } 
  }
  return moves[bestmove];
}
