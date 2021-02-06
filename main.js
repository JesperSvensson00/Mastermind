const pin_colors = {
  white: '#FFFFFF',
  blue: '#2196F3',
  green: '#4CAF50',
  red: '#F44336',
  orange: '#FF9800',
  magenta: '#9C27B0',
  black: '#263238',
};

var game = {
  code: [0, 0, 0, 0],
  rows: [],
};
for (let i = 0; i < 4; i++) {
  game.rows.push({
    pins: [0, 0, 0, 0],
    keys: [],
  });
}

var active_row = 0;

var pins = [...document.querySelectorAll('button.pin')];
var code_pins = pins.splice(0, 4);
var color_buttons = document.querySelectorAll('button.colorOption');
var check_buttons = document.querySelectorAll('button.check');

var selected_color = pin_colors.blue;
var selected_color_index = 1;

pins.forEach((pin) => {
  //Vanligt vänsterklick
  pin.onclick = (evt) => {
    pin.style.backgroundColor = selected_color;

    let id = evt.srcElement.id;
    let col = id.split('_')[2];
    game.rows[active_row].pins[col] = selected_color_index;
    console.log(col);
  };

  //Mitten eller högerklick
  pin.onauxclick = (evt) => {
    evt.preventDefault();
    pin.style.backgroundColor = pin_colors.white;
  };
});

check_buttons.forEach((button) => {
  button.style.display = 'none';
  button.onclick = (evt) => {
    checkRow();
  };
});
check_buttons[check_buttons.length - 1].style.display = 'block';
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

function start() {
  for (let i = 0; i < 4; i++) {
    let idx = (Math.random() * 6 + 1) << 0;
    game.code[i] = idx;
  }
}

function checkRow() {
  let not_perfect_pin = [];
  let not_perfect_code = [];

  //Jämför koden rakt av med de inamtade pinnarna
  for (let i = 0; i < 4; i++) {
    if (game.code[i] == game.rows[active_row].pins[i]) {
      game.rows[active_row].keys.push(2);
    } else {
      not_perfect_pin.push(game.rows[active_row].pins[i]);
      not_perfect_code.push(game.code[i]);
    }
  }

  //Kollar om färgen finns, om den gör det tas den bort för att undvika dubletter
  for (let i = 0; i < not_perfect_pin.length; i++) {
    if (not_perfect_code.find((elem) => elem == not_perfect_pin[i])) {
      game.rows[active_row].keys.push(1);
      let idx = not_perfect_code.indexOf(not_perfect_pin[i]);
      not_perfect_code.splice(idx, 1);
    }
  }
  console.log(game.rows[active_row].keys);

  if (!game.rows[active_row].keys.find((elem) => elem < 2)) {
    console.log('Du klarade det!');
    for (let i = 0; i < 4; i++) {
      let pin = code_pins[i];
      let color = pin_colors[Object.keys(pin_colors)[game.code[i]]];
      pin.style.backgroundColor = color;
    }
  }

  setKeys();

  check_buttons[check_buttons.length - active_row - 2].style.display = 'block';
  check_buttons[check_buttons.length - active_row - 1].style.display = 'none';
  active_row++;

  console.log('Check row');
}

function setKeys() {
  let keys = document.querySelectorAll('#keyRow0');
  for (let i = 0; i < game.rows[active_row].keys.length; i++) {
    let val = game.rows[active_row].keys[i];
    if (val == 2) {
      keys[i].innerHTML = 'G';
    }
    if (val == 1) {
      keys[i].innerHTML = '⌾';
    }
  }
}

start();
