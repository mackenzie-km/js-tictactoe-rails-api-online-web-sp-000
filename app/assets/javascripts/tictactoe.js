// You can set all of your constants at the top
// Note how combos is capitalized
const COMBOS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
var currentGame = 0;
var turn = 0;

// best practice to just get this part out of the way early
$(document).ready(function() {
  attachListeners();
});

// look at this nice terse syntax
// parameter list if no functions - just write with parenthesis
var player = () => turn % 2 ? "O" : "X";

// uses vanilla javascript. $(square).text(value); is jquery.
// but you would have to psas in the square - see alternative
  function updateState(td_element) {
    td_element.innerHTML = player();
    //   var token = player();
    //   $(square).text(token);
  }

  function setMessage(message) {
    document.getElementById('message').innerHTML = String(message);
    //  alternative is $('#message').text(string);
  }

  function checkWinner() {
    const squares = $('td');
    let result = false

    for (let i = 0; i < COMBOS.length; i++) {
      // find the index # to check on the board
      index_1 = COMBOS[i][0]
      index_2 = COMBOS[i][1]
      index_3 = COMBOS[i][2]

      square_1 = squares[index_1].innerHTML
      square_2 = squares[index_2].innerHTML
      square_3 = squares[index_3].innerHTML

      if ((square_1 == square_2) && (square_2 == square_3) && (square_1 != "")) {
        result = true
        setMessage(`Player ${square_1} Won!`);
        saveGame();
         break;
      } else {
        result = false
      };
    }
    return result
  }
// more terse snippet
  // $('td').text((index, square) => board[index] = square);
  //
  // WINNING_COMBOS.some(function(combo) {
  //   if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
  //     setMessage(`Player ${board[combo[0]]} Won!`);

  function doTurn(square) {
    updateState(square);
     turn++;
     if (checkWinner()) {
       saveGame();
       clearGame();
     } else if (turn === 9) {
       setMessage("Tie game.");
       saveGame();
       clearGame();
     }
// much more terse; just runs through these functions
// doesn't need to check for blanks b/c you know turn max
  }

  function populateBoard(arr) {
    let squares = $('td')
    for (let i = 0; i < 9; i++) {
      squares[i].innerHTML = arr[i];
    }
  }

// note the syntax for saving the data in an object form
// for each in this case, NEED the index to push on based on object
// note the stricter ===
  function saveGame() {
    let squares = $('td')
    let array = []
    squares.each(function(index, element) {
      array.push(element.innerHTML)
    });
    // $('td').text((index, square) => {
    // state.push(square);
    // });
    if (currentGame) {
      var url = "/games/" + currentGame
      $.ajax({
          type: "PATCH",
          url: url,
          dataType: "json",
          data: {
            "state": array
            }
        });
    } else {
       $.post('/games', {"state": array})
      };
    };


  function clearGame() {
    let squares = $('td')
    for (let i=0; i < squares.length; i++) {
    squares[i].innerHTML = ""
      }
    turn = 0
    currentGame = 0
  }

// note - forEach works for vanilla javascript. for jquery, $('something') use .each
  function previousGames() {
// super fast way to clear, get, and buttonizePreviousGame
//     $('#games').empty();
//   $.get('/games', (savedGames) => {
//     if (savedGames.data.length) {
//       savedGames.data.forEach(buttonizePreviousGame);
//     }
//   });
// }
// function buttonizePreviousGame(game) {
//   $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
//   $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
// }

    $('#games').empty();
    $.get('/games', function(data, status, json) {
      var object = json.responseJSON["data"]
       object.forEach(function(element) {
         var id = element['id']
         $('#games').append(`<button data-id='${id}'>${id}</button><br>`)
         document.querySelector("button[data-id='" + id + "']").addEventListener("click", function() {
          var url = '/games/' + id
          currentGame = id
          $.get(url, function(data, status, json) {
            var state = json.responseJSON.data.attributes.state
            populateBoard(state);
            turn = countIt(state);
           });
        });
    });
  });
};

function countIt(state) {
  count = 0;
  for(var i = 0; i < state.length; ++i){
    if (state[i] != "") {
    count++;
    };
  };
  return count;
};

//with jquery, this is the proper syntax
function attachListeners() {


  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => previousGames());
  $('#clear').on('click', () => {
    clearGame()
    setMessage("")
  });

  // this little bit allows you to check to see if winner BEFORE you run turn
  // this allowed us to pass test to pause if winner before clearing board
  // check for text and check no winner
  // be gate keeper for text
  // $.text(this) - sets up jquery, looks for nothing, checks the text of this
    $('td').on('click', function() {
      if (!$.text(this) && !checkWinner()) {
        doTurn(this);
      }
    });
  }

    // var squares = $('td')
    // for (let i = 0; i < squares.length; i++) {
    //   squares[i].addEventListener("click", function(event) {
    //     if ((!checkWinner()) && (!this.innerHTML)) {
    //     doTurn(this);
    //   }
    //   });
    // }
    // }
    // this also fixes error

// reload game
// function reloadGame(gameID) {
//   document.getElementById('message').innerHTML = '';
//
//   const xhr = new XMLHttpRequest;
//   xhr.overrideMimeType('application/json');
//   xhr.open('GET', `/games/${gameID}`, true);
//   xhr.onload = () => {
//     const data = JSON.parse(xhr.responseText).data;
//     const id = data.id;
//     const state = data.attributes.state;
//
//     let index = 0;
//     for (let y = 0; y < 3; y++) {
//       for (let x = 0; x < 3; x++) {
//         document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
//         index++;
//       }
//     }
//
//     turn = state.join('').length;
//     currentGame = id;
//
//     if (!checkWinner() && turn === 9) {
//       setMessage('Tie game.');
//     }
//   };
//
//   xhr.send(null);
// }
