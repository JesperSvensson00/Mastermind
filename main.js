var pin_colors = color_palettes[3];

for (let i = 0; i < game.settings.rows; i++) {
  game.rows.push({
    pins: [0, 0, 0, 0],
    keys: [],
  });
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

function start() {
  game.settings = {
    rows: document.querySelector('input[name="rows"]').value,
    cols: document.querySelector('#colsSelect').value,
    duplicates: document.querySelector('#duplicatesInp').checked,
  };
  createBoard(game.settings);

  active_row = 0;

  pins = [...document.querySelectorAll('button.pin')];
  code_pins = pins.splice(0, 4);
  check_buttons = document.querySelectorAll('button.check');

  check_buttons[check_buttons.length - 1].style.display = 'block';

  if (game.settings.duplicates) {
    for (let i = 0; i < 4; i++) {
      let idx = (Math.random() * 6 + 1) << 0;
      game.code[i] = idx;
    }
  } else {
    let pool = [1, 2, 3, 4, 5, 6];
    for (let i = 0; i < 4; i++) {
      let idx = (Math.random() * pool.length) << 0;
      game.code[i] = pool[idx];
      pool.splice(idx, 1);
    }
  }
}

function checkRow() {
  if (!game.state == 'running') {
    return;
  }
  let not_perfect_pin = [];
  let not_perfect_code = [];
  let keys = game.rows[active_row].keys;

  //Jämför koden rakt av med de inamtade pinnarna
  for (let i = 0; i < 4; i++) {
    if (game.code[i] == game.rows[active_row].pins[i]) {
      keys.push(2);
    } else {
      not_perfect_pin.push(game.rows[active_row].pins[i]);
      not_perfect_code.push(game.code[i]);
    }
  }

  //Kollar om färgen finns, om den gör det tas den bort för att undvika dubletter
  for (let i = 0; i < not_perfect_pin.length; i++) {
    if (not_perfect_code.find((elem) => elem == not_perfect_pin[i])) {
      keys.push(1);
      let idx = not_perfect_code.indexOf(not_perfect_pin[i]);
      not_perfect_code.splice(idx, 1);
    }
  }

  //Kollar om spelaren vunnit
  if (!keys.find((elem) => elem < 2) && keys.length > 3) {
    console.log('Du klarade det!');
    for (let i = 0; i < 4; i++) {
      let pin = code_pins[i];
      let color = pin_colors[Object.keys(pin_colors)[game.code[i]]];
      pin.style.backgroundColor = color;
    }
    check_buttons[check_buttons.length - active_row - 1].style.display = 'none';
    return;
  }

  setKeys();
  //Kollar om spelaren förlorat
  if (active_row > 8) {
    check_buttons[0].style.display = 'none';
    console.log('Du klarade det tyvärr inte!');
    for (let i = 0; i < 4; i++) {
      let pin = code_pins[i];
      let color = pin_colors[Object.keys(pin_colors)[game.code[i]]];
      pin.style.backgroundColor = color;
    }
    return;
  }

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

start();
