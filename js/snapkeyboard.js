var VirtualKeyboard = function(config) {
  this.shift_on = false;
  this.caps_on = false;
  this.passwordField = document.getElementById(config.passwordId);
  this.shiftLabel = document.getElementById(config.shiftLabelId);
  this.capsLabel = document.getElementById(config.capsLabelId);

  this.margin = 5;
  this.button_settings = {
    'width': 26,
    'height': 23,
    'transform': 't0.5 0.5',
  };

  this.num_x_offset = 454; // Position from the left where the numeric keyboard starts
  this.keys = [
    {lower: "`", upper: "\"", row: 1, x_start: 4, display_both: true, lower_position: 't9,28', upper_position: 't10,17'},
    {lower: "!", row: 1},
    {lower: "@", row: 1},
    {lower: "#", row: 1},
    {lower: "$", row: 1},
    {lower: "%", row: 1},
    {lower: "¨", row: 1},
    {lower: "&", row: 1},
    {lower: "*", row: 1},
    {lower: "(", row: 1},
    {lower: ")", row: 1},
    {lower: "-", upper: "_", row: 1, display_both: true, lower_position: 't7,22', upper_position: 't7,6'},
    {lower: "=", upper: "+", row: 1, display_both: true, lower_position: 't10,23', upper_position: 't2,14'},
    {lower: "", row: 1, width: 35, onclick: this.backspace}, // backspace (arrow drawn on drawNonStandardKeys)
    {lower: "Help", row: 1, x_start: this.num_x_offset, width: 88, 'class': 'small-text help', left_offset: 4, onclick: this.help },
    // Second row
    {lower: "q", upper: "Q", row: 2, x_start: 25},
    {lower: "w", upper: "W", row: 2},
    {lower: "r", upper: "R", row: 2},
    {lower: "e", upper: "E", row: 2},
    {lower: "t", upper: "T", row: 2},
    {lower: "y", upper: "Y", row: 2},
    {lower: "u", upper: "U", row: 2},
    {lower: "i", upper: "I", row: 2},
    {lower: "o", upper: "O", row: 2},
    {lower: "p", upper: "P", row: 2},
    {lower: "´", upper: "`", row: 2, display_both: true, lower_position: 't8,27', upper_position: 't9,18'},
    {lower: "[", upper: "{", row: 2, display_both: true, lower_position: 't16,18', upper_position: 't4,16'},
    {lower: "7", row: 2, x_start: this.num_x_offset},
    {lower: "8", row: 2},
    {lower: "9", row: 2},
    // Third row
    {lower: "\\", row: 3, x_start: 15},
    {lower: "a", upper: "A", row: 3},
    {lower: "s", upper: "S", row: 3},
    {lower: "d", upper: "D", row: 3},
    {lower: "f", upper: "F", row: 3},
    {lower: "g", upper: "G", row: 3},
    {lower: "h", upper: "H", row: 3},
    {lower: "j", upper: "J", row: 3},
    {lower: "k", upper: "K", row: 3},
    {lower: "l", upper: "L", row: 3},
    {lower: "ç", upper: "Ç", row: 3},
    {lower: "~", upper: "^", row: 3, display_both: true, lower_position: 't7,22', upper_position: 't7,16'},
    {lower: "]", upper: "}", row: 3, display_both: true, lower_position: 't16,18', upper_position: 't5,16'},
    {lower: "4", row: 3, x_start: this.num_x_offset},
    {lower: "5", row: 3},
    {lower: "6", row: 3},
    // Fourth row
    {lower: "Shift", row: 4, x_start: 15, width: 43, 'class': 'small-text', left_offset: 4, onclick: this.shift},
    {lower: "z", upper: "Z", row: 4},
    {lower: "x", upper: "X", row: 4},
    {lower: "c", upper: "C", row: 4},
    {lower: "v", upper: "V", row: 4},
    {lower: "b", upper: "B", row: 4},
    {lower: "n", upper: "N", row: 4},
    {lower: "m", upper: "M", row: 4},
    {lower: ",", upper: "<", row: 4, display_both: true, lower_position: 't10,18', upper_position: 't7,14'},
    {lower: ".", upper: ">", row: 4, display_both: true, lower_position: 't10,20', upper_position: 't7,14'},
    {lower: ";", upper: ":", row: 4, display_both: true, lower_position: 't15,17', upper_position: 't5,13'},
    {lower: "/", upper: "?", row: 4, display_both: true, lower_position: 't13,18', upper_position: 't3,16'},
    {lower: "", row: 4, width: 38, onclick: this.shift}, // Right shift (arrow drawn on drawNonStandardKeys)
    {lower: "1", row: 4, x_start: this.num_x_offset},
    {lower: "2", row: 4},
    {lower: "3", row: 4},
    // Fifth row
    {lower: "Caps Lock", row: 5, x_start: 15, width: 87, 'class': 'small-text', 'left_offset': 11, onclick: this.capsLock },
    {lower: "SPACE", row: 5, width: 335, onclick: this.space, 'class': 'small-text', 'left_offset': 4},
    {lower: "0", row: 5, x_start: this.num_x_offset, width: 57},
    {lower: "Ok", row: 5, 'class': 'small-text ok', 'left_offset': 3, onclick: this.ok }
  ];

  this.s = Snap('#' + config.objectId);
  this.s.attr({ 'class': 'letter' });
  this.drawSquareKeys();
  this.drawNonStandardKeys();
};

VirtualKeyboard.prototype.addKeyHandlers = function(obj) {
  obj[0].transform('t0.5 0.5');
  obj.hover(function() {
    this[0].attr({'stroke': '#f00'});
    this[0].transform('s1 1');
  }, function() {
    this[0].attr({'stroke': '#88aca0'});
    this[0].transform('t0.5 0.5');
  });
  obj.mousedown(function() {
    this[0].attr({stroke: "#c00"});
    this[0].transform('t0.5 0.5');
  });
};

VirtualKeyboard.prototype.createSquareKey = function(iKey) {
  var letter_settings = {
    'top_offset' : 4,
  };

  var button = this.s.rect();
  button.attr(this.button_settings);
  button.attr({ width : this.keys[iKey].width });

  var _letter = this.s.text(0, 0, this.keys[iKey].lower);
  this.keys[iKey].letter = _letter;

  if (this.keys[iKey].lower_position) {
    _letter.transform(this.keys[iKey].lower_position);
  }
  else {
    // Calculate and reposition text in button
    var left_offset = (this.keys[iKey].left_offset ? this.keys[iKey].left_offset : 0);
    var letter_rect = this.s.g(_letter).node.getBoundingClientRect();
    var left = ((parseInt(button.attr('width')) - letter_rect.width) / 2) + left_offset;
    var top = (parseInt(button.attr('height')) - (letter_rect.height / 2) + letter_settings.top_offset);
    _letter.transform("t" + left + "," + top);
  }

  // Position the key
  var key = this.s.g(button, _letter);
  if (this.keys[iKey].class) {
    key.attr({ 'class' : 'key ' + this.keys[iKey].class });
  }
  else {
    key.attr({ 'class' : 'key' });
  }
  key.transform("t" + this.keys[iKey].x + "," + this.keys[iKey].y);

  if (this.keys[iKey].display_both) {
    var letter_upper = this.s.text(0, 0, this.keys[iKey].upper);
    letter_upper.transform(this.keys[iKey].upper_position);
    this.keys[iKey].letter_upper = letter_upper;
    key.add(letter_upper);
    this.keys[iKey].letter_upper.node.setAttribute('class','not-active');
    this.keys[iKey].letter.node.setAttribute('class','active');
  }

  this.addKeyHandlers(key);

  key.keyboard = this;
  key.settings = this.keys[iKey];
  if (this.keys[iKey].onclick) {
    key.click(this.keys[iKey].onclick);
  }
  else {
    key.click(this.anyKey);
  }
};

VirtualKeyboard.prototype.drawSquareKeys = function() {
  var y_offset = this.button_settings.height + this.margin;
  var y_start = 10;

  // Calculate x and y to position buttons
  for(var letter in this.keys) {
    var key = this.keys[letter];
    if (key.x_start) {
      key.x = key.x_start;
    }
    else {
      var previous_key = this.keys[letter-1];
      key.x = previous_key.x + previous_key.width + this.margin;
    }
    key.y = y_start + (key.row * y_offset);
    if (!key.width) {
        // Use default width if not specified
        key.width = this.button_settings.width;
    }

    // Create key
    this.createSquareKey(letter);
  }
};

VirtualKeyboard.prototype.drawNonStandardKeys = function() {
  // Draw non-rectangular shapes
  var enter = this.s.polygon(397, 66, 442, 66, 442, 117, 418, 117, 418, 89, 397, 89);
  enter.transform('t0.5 0.5');
  var enter_text = this.s.text(410, 83, "Ok");
  var arrow = this.s.polygon(6, 26, 9, 30, 2, 25, 9, 20, 6, 25, 14, 25, 14, 12, 14, 25);
  arrow.attr({
    'class': 'arrow',
    'transform' : 't421 80',
  });
  var enter_g = this.s.g(enter, enter_text, arrow);
  enter_g.attr({ 'class': 'key ok small-text' });
  this.addKeyHandlers(enter_g);

  var shift_arrow = this.s.polygon(5, 6, 0, 10, 5, 3, 10, 10, 5, 6, 5, 16);
  shift_arrow.attr({
    'class' : 'arrow',
    'transform' : 't419 125'
  });

  var backspace_arrow = this.s.polygon(6, 5, 9, 10, 2, 5, 9, 0, 6, 5, 27, 5);
  backspace_arrow.attr({
    'class' : 'arrow',
    'transform' : 't410 45'
  });
};

VirtualKeyboard.prototype.anyKey = function() {
  if ((this.keyboard.caps_on && !this.keyboard.shift_on || this.keyboard.shift_on && !this.keyboard.caps_on) && 
  this.settings.upper) {
    this.keyboard.passwordField.value += this.settings.upper;
  }
  else {
    this.keyboard.passwordField.value += this.settings.lower;
  }

  if (this.keyboard.shift_on) {
    this.keyboard.shift_on = false;
    this.keyboard.shiftLabel.style.setProperty('display', 'none');
    this.keyboard.toggleKeys();
  }
};

VirtualKeyboard.prototype.space = function() {
  this.keyboard.passwordField.value += ' ';
};

VirtualKeyboard.prototype.shift = function() {
  this.keyboard.shift_on = !this.keyboard.shift_on;
  this.keyboard.shiftLabel.style.setProperty('display', (this.keyboard.shift_on ? 'block' : 'none'));
  this.keyboard.toggleKeys();
};

VirtualKeyboard.prototype.capsLock = function() {
  this.keyboard.caps_on = !this.keyboard.caps_on;
  this.keyboard.capsLabel.style.setProperty('display', (this.keyboard.caps_on ? 'block' : 'none'));
  this.keyboard.toggleKeys();
};

VirtualKeyboard.prototype.backspace = function() {
  this.keyboard.passwordField.value = '';
};

VirtualKeyboard.prototype.ok = function() {
  console.log('ok pressed');
};

VirtualKeyboard.prototype.help = function() {
  console.log('help pressed');
};

VirtualKeyboard.prototype.toggleKeys = function() {
  for(var iKey in this.keys) {
    if ((this.caps_on && !this.shift_on || this.shift_on && !this.caps_on) && 
    this.keys[iKey].upper) {
        if (this.keys[iKey].lower_position) {
          this.keys[iKey].letter.node.setAttribute('class', 'not-active');
          this.keys[iKey].letter_upper.node.setAttribute('class', 'active');
        }
        else {
          this.keys[iKey].letter.node.textContent = this.keys[iKey].upper;
        }
    }
    else {
      if (this.keys[iKey].display_both) {
        this.keys[iKey].letter_upper.node.setAttribute('class', 'not-active');
        this.keys[iKey].letter.node.setAttribute('class', 'active');
      }
      else {
        this.keys[iKey].letter.node.textContent = this.keys[iKey].lower;
      }
    }
  }
};