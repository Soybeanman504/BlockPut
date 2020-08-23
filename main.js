// JavaScript source code
window.onload = function () {
	var canvas = document.getElementById('block');
	var bodyRect = document.body.getBoundingClientRect();
	var block = new Block(canvas, Math.floor(bodyRect.width / 64), Math.ceil(bodyRect.height / 64));

	no_scroll();
    block.main();
}

class Block {
	constructor(canvas, width, height) {
        this.canvas = canvas;
		this.context = canvas.getContext('2d');

        this.width = width;
		this.height = height;

        this.map = Array(width).fill().map(() => Array(height).fill(0));

		this.name = ['void','block'];
		this.image = {};
		for (let n in this.name) {
			var char = this.name[n];
			this.image[char] = new Image();
			this.image[char].src = char + '.png';
		}

		this.pressing = false;

        canvas.width = width * 16;
        canvas.height = height * 16;
    }

	main() {
		var block = this;
		var pressedAction = ['mousedown', 'touchstart'];
		var keptAction = ['mousemove', 'touchmove'];
		var releasedOverAction = ['mouseup', 'touchend', 'touchcancel'];
		for (let n in pressedAction) {
			block.canvas.addEventListener(pressedAction[n], () => block.press(event));
		}

		for (let n in keptAction) {
			block.canvas.addEventListener(keptAction[n], () => block.keep(event));
		}

		for (let n in releasedOverAction) {
			block.canvas.addEventListener(releasedOverAction[n], () => block.releaseOver(event));
		}
	}

	//押されたとき
	press(event) {
		var block = this;
		block.pressing = true;
		block.draw(event);
	}

	//要素上にあるとき
	keep(event) {
		var block = this;
		if (block.pressing) {
			block.draw(event);
        }
	}

	//離されたとき
	releaseOver(event) {
		var block = this;
		block.pressing = false;
		block.draw(event);
    }

	//タッチイベントで呼び出される関数
	draw(event) {
		var block = this;
		var coordinate = touchHandler(block.canvas, event);
		coordinate = block.coordinate16(coordinate);
		block.put(coordinate, 'block');
    }

	mapChar(x,y) {
		var block = this;
		if (block.coordinateOK(x, y)) {
			return block.map[x][y];
		} else {
			return 'block';
        }
    }

	//blockを配置
	put(coordinate, char) {
		var block = this;
		var x = coordinate.x16;
		var y = coordinate.y16;

		if (x != null && y != null) {
			block.map[x][y] = char;

			//上下、左右どちらかあり、斜めあるときの動作を追加
			if (block.mapChar(x - 1, y) == char) {
				if (block.mapChar(x, y - 1) == char) {
					if (block.mapChar(x - 1, y - 1) == char) {
						block.imagePut(char, true, 1, 1, 2, 2, x * 16 - 8, y * 16 - 8);
					} else {
						block.imagePut(char, true, 5, 1, 1, 1, x * 16, y * 16);
						block.imagePut(char, true, 1, 0, 1, 1, x * 16 - 8, y * 16);
						block.imagePut(char, true, 0, 1, 1, 1, x * 16, y * 16 - 8);
						block.imagePut(char, true, 5, 3, 1, 1, x * 16 - 8, y * 16 - 8);
					}
				} else {
					block.imagePut(char,  true, 1, 0, 2, 1, x * 16 - 8, y * 16);
				}

				if (block.mapChar(x, y + 1) == char) {
					if (block.mapChar(x - 1, y + 1) == char) {
						block.imagePut(char, true, 1, 1, 2, 2, x * 16 - 8, y * 16 + 8);
					} else {
						block.imagePut(char, true, 5, 0, 1, 1, x * 16, y * 16 + 8);
						block.imagePut(char, true, 1, 3, 1, 1, x * 16 - 8, y * 16 + 8);
						block.imagePut(char, true, 0, 2, 1, 1, x * 16, y * 16 + 16);
						block.imagePut(char, true, 5, 2, 1, 1, x * 16 - 8, y * 16 + 16);
					}
				} else {
					block.imagePut(char, true, 1, 3, 2, 1, x * 16 - 8, y * 16 + 8);
				}
			} else {
				if (block.mapChar(x, y - 1) == char) {
					block.imagePut(char, true, 0, 1, 1, 2, x * 16, y * 16 - 8);
				} else {
					block.imagePut(char, true, 0, 0, 1, 1, x * 16, y * 16);
				}

				if (block.mapChar(x, y + 1) == char) {
					block.imagePut(char, true, 0, 1, 1, 2, x * 16, y * 16 + 8);
				} else {
					block.imagePut(char, true, 0, 3, 1, 1, x * 16, y * 16 + 8);
				}
			}

			if (block.mapChar(x + 1, y) == char) {
				if (block.mapChar(x, y - 1) == char) {
					if (block.mapChar(x + 1, y - 1) == char) {
						block.imagePut(char, true, 1, 1, 2, 2, x * 16 + 8, y * 16 - 8);
					} else {
						block.imagePut(char, true, 4, 1, 1, 1, x * 16 + 8, y * 16);
						block.imagePut(char, true, 2, 0, 1, 1, x * 16 + 16, y * 16);
						block.imagePut(char, true, 3, 1, 1, 1, x * 16 + 8, y * 16 - 8);
						block.imagePut(char, true, 4, 3, 1, 1, x * 16 + 16, y * 16 - 8);
					}
				} else {
					block.imagePut(char, true, 1, 0, 2, 1, x * 16 + 8, y * 16);
				}

				if (block.mapChar(x, y + 1) == char) {
					if (block.mapChar(x + 1, y + 1) == char) {
						block.imagePut(char, true, 1, 1, 2, 2, x * 16 + 8, y * 16 + 8);
					} else {
						block.imagePut(char, true, 4, 0, 1, 1, x * 16 + 8, y * 16 + 8);
						block.imagePut(char, true, 2, 3, 1, 1, x * 16 + 16, y * 16 + 8);
						block.imagePut(char, true, 3, 2, 1, 1, x * 16 + 8, y * 16 + 16);
						block.imagePut(char, true, 4, 2, 1, 1, x * 16 + 16, y * 16 + 16);
					}
				} else {
					block.imagePut(char, true, 1, 3, 2, 1, x * 16 + 8, y * 16 + 8);
				}
			} else {
				if (block.mapChar(x, y - 1) == char) {
					block.imagePut(char, true, 3, 1, 1, 2, x * 16 + 8, y * 16 - 8);
				} else {
					block.imagePut(char, true, 3, 0, 1, 1, x * 16 + 8, y * 16);
				}

				if (block.mapChar(x, y + 1) == char) {
					block.imagePut(char, true, 3, 1, 1, 2, x * 16 + 8, y * 16 + 8);
				} else {
					block.imagePut(char, true, 3, 3, 1, 1, x * 16 + 8, y * 16 + 8);
				}
			}
		}
	}

	imagePut(char, clear, sx, sy, w ,h, dx, dy) {
		var block = this;
		if (clear) {
			block.context.clearRect(dx, dy, w * 8, h * 8);
        }
		block.context.drawImage(block.image[char], sx * 8, sy * 8, w * 8, h * 8, dx, dy, w * 8, h * 8);
    }

	//in:coordinate out:coordinate.16
	coordinate16(coordinate) {
		coordinate.x16 = Math.floor(coordinate.x / 16);
		coordinate.y16 = Math.floor(coordinate.y / 16);
		return coordinate;
	}

	coordinateOK(x, y) {
		if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
			return true;
		}
		return false;
    }
}

//out:coordinate
function touchHandler(element,event) {
	var x = 0, y = 0;
	var clientRect = element.getBoundingClientRect();
	
	if (event.touches && event.touches[0]) {
		x = event.touches[0].pageX;
		y = event.touches[0].pageY;
	} else if (event.originalEvent && event.originalEvent.changedTouches[0]) {
		x = event.originalEvent.changedTouches[0].pageX;
		y = event.originalEvent.changedTouches[0].pageY;
	} else {
		if (event.pageX) {
			x = event.pageX;
		}
		if (event.pageY) {
			y = event.pageY;
		}
	}

	x = x - window.pageXOffset - clientRect.left;
	y = y - window.pageYOffset - clientRect.top;

	if (x >= 0 && x < clientRect.width) {
		x = x / clientRect.width * element.width;
	} else {
		x = null;
	}
	if (y >= 0 && y < clientRect.height) {
		y = y / clientRect.height * element.height;
	} else {
		y = null;
	}

	return { x: x, y: y };
}

// スクロール禁止
function no_scroll() {
	// PCでのスクロール禁止
	document.addEventListener("mousewheel", scroll_control, { passive: false });
	// スマホでのタッチ操作でのスクロール禁止
	document.addEventListener("touchmove", scroll_control, { passive: false });
}

// スクロール関連メソッド
function scroll_control(event) {
	event.preventDefault();
}