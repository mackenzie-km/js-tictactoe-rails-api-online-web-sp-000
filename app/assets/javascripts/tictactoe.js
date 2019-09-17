// Code your JavaScript / jQuery solution here
window.turn = 0

function player() {
    if (window.turn % 2 != 1) {
      return "X";
    } else {
       return "O";
    };
  }

  function updateState(td_element) {
    td_element.innerHTML = player();
  }

  function setMessage(message) {
    document.getElementById('message').innerHTML = String(message);
  }

  function checkWinner() {
    const combos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    const squares = window.document.querySelectorAll('td');
    let result = false

    for (let i = 0; i < combos.length; i++) {
      // find the index # to check on the board
      index_1 = combos[i][0]
      index_2 = combos[i][1]
      index_3 = combos[i][2]

      square_1 = squares[index_1].innerHTML
      square_2 = squares[index_2].innerHTML
      square_3 = squares[index_3].innerHTML

      if ((square_1 == square_2) && (square_2 == square_3) && (square_1 != "")) {
        result = true
        setMessage(`Player ${square_1} Won!`);
         break;
      } else {
        result = false
      };
    }
    return result
  }

  function checkForBlanks() {
    const squares = window.document.querySelectorAll('td');
    let blanks = true;
    for (let i=0; i < squares.length; i++) {
      if (squares[i].innerHTML == "") {
        blanks = true;
        break;
      } else {
        blanks = false
      }
    }
    return blanks
  }

  function doTurn(td_element) {
    var checkWinner = checkWinner();
    var squares = window.document.querySelectorAll('td');

    if ((td_element.innerHTML == "") && (checkWinner() == false)) {
      updateState(td_element);
      ++window.turn;
    };

    if ((checkWinner() == false) && (checkForBlanks() == false)) {
      setMessage("Tie game.");
    };

    if (checkWinner() == true) {
      clearGame();
    }

  }

  function saveGame() {
    let squares = window.document.querySelectorAll('td')
    let array = []
    squares.forEach(function(element) {
      array.push(element.innerHTML)
    });
    var values = JSON.stringify({"state": array})
    var posting = $.post('/games', values)
    posting.responseJSON.data.attributes.state
  };

  function clearGame() {
    let squares = window.document.querySelectorAll('td')
    for (let i=0; i < squares.length; i++) {
    squares[i].innerHTML = ""
      }
    window.turn = 0
  }

  function previousGames() {
    var retrieving = $.get('/games')
    console.log(retrieving)
    $('#games').html(retrieving)
  };

var attachListeners;

$(document).ready(

    attachListeners = function () {
        window.document.getElementById('save').addEventListener("click", function(event) {
          saveGame();
        });

        window.document.getElementById('previous').addEventListener("click", function(event) {
          previousGames();
        });

        window.document.getElementById('clear').addEventListener("click", function(event) {
          clearGame();
        });

        let squares = window.document.querySelectorAll('td')
        for (let i = 0; i < squares.length; i++) {
          squares[i].addEventListener("click", function(event) {
            doTurn(this);
          });
        }
      }
);
