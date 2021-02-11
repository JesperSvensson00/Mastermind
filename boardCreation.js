let board = document.querySelector('.boardWrapper');
let cols = 4;
let rows = 10;
function createBoard(settings) {
  rows = settings.rows;
  cols = settings.cols;

  //Rensar board om det fann något tidigare
  while (board.firstChild) {
    board.removeChild(board.firstChild);
  }

  //Code
  let codeRow = document.createElement('div');
  codeRow.setAttribute('class', 'rowWrapper');
  let codeWrapper = document.createElement('div');
  codeWrapper.setAttribute('class', 'pinWrapper');
  for (let i = 0; i < cols; i++) {
    let button = document.createElement('button');
    button.setAttribute('class', 'pin');
    codeWrapper.appendChild(button);
  }
  codeRow.appendChild(codeWrapper);
  //checkWrapper
  let restartWrapper = document.createElement('div');
  restartWrapper.setAttribute('class', 'restartWrapper');
  let restart_button = document.createElement('button');
  let restart_txt = document.createTextNode('Börja om');
  restart_button.setAttribute('class', 'restart');
  restart_button.appendChild(restart_txt);
  restart_button.onclick = (evt) => {
    start();
  };
  restartWrapper.appendChild(restart_button);
  codeRow.append(restartWrapper);
  board.appendChild(codeRow);

  //Resterande rader
  for (let i = 0; i < rows; i++) {
    createRow(rows - i - 1);
  }
}

function createRow(rowNr) {
  let row = document.createElement('div');
  row.setAttribute('class', 'rowWrapper');

  //pinWrapper
  let pinWrapper = document.createElement('div');
  pinWrapper.setAttribute('class', 'pinWrapper');
  for (let i = 0; i < cols; i++) {
    createPin(pinWrapper, rowNr, i);
  }
  row.appendChild(pinWrapper);

  //keyWrapper
  let keyWrapper = document.createElement('div');
  keyWrapper.setAttribute('class', 'keyWrapper');
  let table = document.createElement('table');
  let tr1 = document.createElement('tr');
  let tr2 = document.createElement('tr');
  let txt = document.createTextNode('⭙');
  for (let i = 0; i < cols / 2; i++) {
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    td1.setAttribute('class', 'key');
    td1.setAttribute('id', `keyRow${rowNr}`);
    td1.appendChild(txt.cloneNode());
    tr1.appendChild(td1);
    td2.setAttribute('class', 'key');
    td2.setAttribute('id', `keyRow${rowNr}`);
    td2.appendChild(txt.cloneNode());
    tr2.appendChild(td2);
  }
  table.appendChild(tr1);
  table.appendChild(tr2);
  keyWrapper.appendChild(table);
  row.appendChild(keyWrapper);

  //checkWrapper
  let checkWrapper = document.createElement('div');
  checkWrapper.setAttribute('class', 'checkWrapper');
  let btn = document.createElement('button');
  let check = document.createTextNode('✓');
  btn.setAttribute('class', 'check');
  btn.setAttribute('id', `checkRow${rowNr}`);
  btn.appendChild(check);
  btn.style.display = 'none';
  btn.onclick = (evt) => {
    checkRow();
  };
  checkWrapper.appendChild(btn);
  row.appendChild(checkWrapper);

  board.appendChild(row);
}

function createPin(pinWrapper, rowNr, col) {
  let button = document.createElement('button');
  button.setAttribute('class', 'pin');
  button.setAttribute('id', `pin_${rowNr}_${col}`);
  pinWrapper.appendChild(button);

  button.onclick = (evt) => {
    button.style.backgroundColor = selected_color;
    game.rows[active_row].pins[col] = selected_color_index;
  };

  button.onauxclick = (evt) => {
    button.style.backgroundColor = pin_colors.white;
    game.rows[active_row].pins[col] = 0;
  };

  button.oncontextmenu = (evt) => {
    evt.preventDefault();
  };
}
