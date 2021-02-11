//Kollar om det är en saml skärm
let ratio = window.innerHeight / window.innerWidth;
console.log(ratio);
if (ratio > 1.2) {
  document.querySelector('.boardWrapper').remove();
  let board = document.createElement('div');
  board.setAttribute('class', 'boardWrapper');
  document.querySelector('.gameWrapper').appendChild(board);
}

var pin_colors = color_palettes[3];

var GAMEHASH = '';
let link_hash = location.hash.substring(1);
if (checkValidHash(link_hash)) {
  GAMEHASH = link_hash;
  document.querySelector('#gameHashInp').value = link_hash;
}

var active_row = 0;

var pins = [];
var code_pins = [];
var check_buttons = [];
var color_buttons = document.querySelectorAll('button.colorOption');

var selected_color = pin_colors.blue;
var selected_color_index = 1;

//Option knapparna
for (let i = 0; i < 6; i++) {
  let button = color_buttons[i];
  button.style.backgroundColor = pin_colors[Object.keys(pin_colors)[i + 1]];

  //Lägger till event för varje knapp
  button.onclick = (evt) => {
    evt.preventDefault();
    color_buttons[selected_color_index - 1].classList.remove('activeColor');

    selected_color_index = parseInt(button.id);
    selected_color = pin_colors[Object.keys(pin_colors)[selected_color_index]];

    button.classList.add('activeColor');
  };
  if (i == 0) button.classList.add('activeColor');
}

window.addEventListener('wheel', (evt) => {
  let dir = evt.deltaY / Math.abs(evt.deltaY);
  color_buttons[selected_color_index - 1].classList.remove('activeColor');

  selected_color_index = selected_color_index + dir;
  if (selected_color_index > 6) {
    selected_color_index = 1;
  } else if (selected_color_index < 1) {
    selected_color_index = 6;
  }
  selected_color = pin_colors[Object.keys(pin_colors)[selected_color_index]];

  color_buttons[selected_color_index - 1].classList.add('activeColor');
});

document.querySelector('#themeSelect').onchange = () => {
  let val = document.querySelector('#themeSelect').value;
  pin_colors = color_palettes[val];

  for (let i = 0; i < game.rows.length; i++) {
    let row = game.rows[i].pins;
    for (let j = 0; j < row.length; j++) {
      let pin = document.querySelector(`#pin_${i}_${j}`);
      pin.style.backgroundColor = pin_colors[Object.keys(pin_colors)[row[j]]];
    }
  }

  for (let i = 0; i < 6; i++) {
    let button = color_buttons[i];
    button.style.backgroundColor = pin_colors[Object.keys(pin_colors)[i + 1]];
  }

  console.log(pin_colors);
};

document.querySelector('#gameHashTxt').onclick = () => {
  let txt = document.querySelector('#gameHashTxt').innerHTML;
  let temp = document.createElement('input');
  temp.setAttribute('value', txt);
  document.body.appendChild(temp);
  temp.select();
  document.execCommand('copy');
  temp.remove();
};

document.querySelector('.settingsBtn').onclick = () => {
  let wrapper = document.querySelector('.settingsWrapper');
  wrapper.classList.toggle('activeSettings');

  let button = document.querySelector('.settingsBtn');
  button.classList.toggle('activeSettings');
};

function start() {
  game.state = 'running';
  let hash_inp = document.querySelector('#gameHashInp').value;
  console.log('Hashen är ok: ' + checkValidHash(hash_inp));
  if (checkValidHash(hash_inp)) {
    let gameData = decryptHASH(hash_inp);
    let len = gameData.length;
    let c = gameData.substring(0, len - 3).split(''); //Code
    let d = parseInt(gameData.substring(len - 3, len - 2)); //Duplicates
    let r = parseInt(gameData.substring(len - 2, len)); //Rows
    let co = c.length;

    if (co > 6) {
      d = true;
    }
    game.code = c;
    game.settings = {
      rows: r,
      cols: co,
      duplicates: d,
    };
    //Ändra inställningarna i menyn
    document.querySelector('#rowsInp').value = r;
    document.querySelector('#colsSelect').value = co;
    document.querySelector('#duplicatesInp').checked = d;
  } else {
    game.settings = {
      rows: document.querySelector('#rowsInp').value,
      cols: document.querySelector('#colsSelect').value,
      duplicates: document.querySelector('#duplicatesInp').checked,
    };

    if (game.settings.cols > 6) {
      d = true;
      document.querySelector('#duplicatesInp').checked = true;
    }

    if (game.settings.duplicates) {
      for (let i = 0; i < game.settings.cols; i++) {
        let idx = (Math.random() * 6 + 1) << 0;
        game.code[i] = idx;
      }
    } else {
      let pool = [1, 2, 3, 4, 5, 6];
      for (let i = 0; i < game.settings.cols; i++) {
        let idx = (Math.random() * pool.length) << 0;
        game.code[i] = pool[idx];
        pool.splice(idx, 1);
      }
    }
  }

  game.rows = [];
  for (let i = 0; i < game.settings.rows; i++) {
    game.rows.push({
      pins: [0, 0, 0, 0],
      keys: [],
    });
  }

  createBoard(game.settings);

  active_row = 0;

  pins = [...document.querySelectorAll('button.pin')];
  code_pins = pins.splice(0, game.settings.cols);
  check_buttons = document.querySelectorAll('button.check');

  check_buttons[check_buttons.length - 1].style.display = 'block';

  GAMEHASH = createHASH();
  console.log('Game hash: ' + GAMEHASH);
  document.querySelector('#gameHashTxt').innerHTML = GAMEHASH;
}

function checkRow() {
  if (!game.state == 'running') {
    return;
  }
  let not_perfect_pin = [];
  let not_perfect_code = [];
  let keys = game.rows[active_row].keys;

  //Låser raden för ändring
  for (let i = 0; i < game.settings.cols; i++) {
    let button = document.querySelector(`#pin_${active_row}_${i}`);
    button.onclick = null;
    button.onauxclick = null;
  }

  //Jämför koden rakt av med de inamtade pinnarna
  for (let i = 0; i < game.settings.cols; i++) {
    if (game.code[i] == game.rows[active_row].pins[i]) {
      keys.push(2);
    } else {
      not_perfect_pin.push(game.rows[active_row].pins[i]);
      not_perfect_code.push(game.code[i]);
    }
  }

  //Kollar om färgen finns, om den gör det tas den bort för att undvika dubletter
  for (let i = 0; i < not_perfect_pin.length; i++) {
    let pin = not_perfect_pin[i];
    for (let j = 0; j < not_perfect_code.length; j++) {
      let code_pin = not_perfect_code[j];
      if (pin == code_pin) {
        keys.push(1);
        not_perfect_code.splice(j, 1);
      }
    }
  }

  //Kollar om spelaren vunnit
  if (!keys.find((elem) => elem < 2) && keys.length > game.settings.cols - 1) {
    game.state = 'won';
    console.log('Du klarade det!');
    for (let i = 0; i < game.settings.cols; i++) {
      let pin = code_pins[i];
      let color = pin_colors[Object.keys(pin_colors)[game.code[i]]];
      pin.style.backgroundColor = color;
    }
    check_buttons[check_buttons.length - active_row - 1].style.display = 'none';
    return;
  }

  //Kollar om spelaren förlorat
  if (active_row > game.settings.rows - 2) {
    game.state = 'lost';
    check_buttons[0].style.display = 'none';
    console.log('Du klarade det tyvärr inte!');
    for (let i = 0; i < game.settings.cols; i++) {
      console.log(i);
      let pin = code_pins[i];
      let color = pin_colors[Object.keys(pin_colors)[game.code[i]]];
      pin.style.backgroundColor = color;
    }
    return;
  }

  setKeys();

  check_buttons[check_buttons.length - active_row - 2].style.display = 'block';
  check_buttons[check_buttons.length - active_row - 1].style.display = 'none';
  active_row++;
}

function setKeys() {
  let keys = document.querySelectorAll(`#keyRow${active_row}`);
  for (let i = 0; i < game.rows[active_row].keys.length; i++) {
    let val = game.rows[active_row].keys[i];
    if (val == 2) {
      keys[i].innerHTML = '⦿';
    }
    if (val == 1) {
      keys[i].innerHTML = '⌾';
    }
  }
}

function createHASH() {
  // ccccCCCCdrr
  let c = game.code.toString().replace(/[ ,\[\]]/gm, '');
  let d = game.settings.duplicates ? 1 : 0;
  let r = ('0' + game.settings.rows).slice(-2);

  let code = c + d + r;
  console.log('Code: ' + code);

  //Kryptering
  let control = code % 7;
  let hash = (code - control) / 7;
  hash += '' + control;
  hash = parseInt(hash).toString(26);

  //Gör om till en kod med 6 siffror
  let aplphaHash = '';
  for (let i = 0; i < hash.length; i++) {
    let char = hash.charAt(i);
    aplphaHash += String.fromCharCode(65 + parseInt(char, 26));
  }

  location.assign('#' + aplphaHash);

  return aplphaHash;
}

function decryptHASH(aplphaHash) {
  let hash26 = '';
  for (let i = 0; i < aplphaHash.length; i++) {
    let val = aplphaHash.charCodeAt(i) - 65;
    hash26 += val.toString(26);
  }

  let hash = parseInt(hash26, 26) + '';

  let control = parseInt(hash[hash.length - 1]);
  hash = hash.substring(0, hash.length - 1);
  code = hash * 7 + control;

  return code.toString();
}

function checkValidHash(hash) {
  // ccccCCCCdrr
  hash = hash.toUpperCase();
  if (hash !== '' && hash.length > 6 && hash.length < 9) {
    //Kollar om den innehåller ogitliga tecken
    if (hash.match(/^[A-Z]+$/)) {
      //Dekryptera koden och kontrollera att den är giltig
      let code = decryptHASH(hash);
      let len = code.length;
      if (len < 12) {
        let c = code.substring(0, len - 3).split(''); //Code
        let d = parseInt(code.substring(len - 3, len - 2)); //Duplicates
        let r = parseInt(code.substring(len - 2, len)); //Rows

        //Kollar att c är en fungerande kod
        for (let i = 0; i < c.length; i++) {
          let digit = c[i];
          if (digit < 1 || digit > 6) {
            console.log('Koden som angavs fungera inte. Felkod 4');
            return false;
          }
        }

        if (c.length > 3 && c.length < 9 && r > 1 && r < 100 && d < 2) {
          return true;
        }
        console.log('Koden som angavs är inte korrekt. 1');
        return false;
      }
      console.log('Koden som angavs är inte korrekt. 2');
      return false;
    }
    console.log('Koden som angavs är inte korrekt. 3');
    return false;
  } else {
    return false;
  }
}

start();
