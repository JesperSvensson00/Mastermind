var color_palettes = [
  {
    white: '#FFFFFF',
    blue: '#2196F3',
    green: '#4CAF50',
    red: '#F44336',
    orange: '#FF9800',
    magenta: '#9C27B0',
    black: '#263238',
  },
  {
    white: '#FFFFFF',
    blue: '#5bc0de',
    green: '#96ceb4',
    red: '#d9534f',
    orange: '#ffad60',
    yellow: '#ffeead',
    black: '#434A53',
  },
  {
    white: '#FFFFFF',
    blue: '#4FC2E5',
    green: '#9FD477',
    red: '#ED5565',
    orange: '#FC6D58',
    purple: '#AD93E6',
    black: '#434A53',
  },
  {
    white: '#FFFFFF',
    blue: '#3498DB',
    green: '#2ECC71',
    red: '#E74C3C',
    orange: '#E67E22',
    purple: '#9B59B6',
    black: '#2C3E50',
  },
];
var game = {
  state: 'running',
  code: [0, 0, 0, 0],
  rows: [],
  settings: {
    rows: 10,
    cols: 4,
    duplicates: false,
  },
};
