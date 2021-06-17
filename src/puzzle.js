(function(){
	
	var puzzle = document.getElementById('puzzle');
    var congrats = document.getElementById('congrats')
	var state = true;
	restart();
	
	puzzle.addEventListener('click', function(e){
		if(state == true){
			puzzle.className = 'animate';
            moveCells(e.target)
		}
	});
	
	document.getElementById('restart').addEventListener('click', restart);


	function restart(){
		if(state == false){
			return;
		}
		
        congrats.innerHTML = ''
		puzzle.innerHTML = '';
		
		var n = 1;
		for(var i = 0; i <= 3; i++){
			for(var j = 0; j <= 3; j++){
				var cell = document.createElement('span');
				cell.id = i+'-'+j;
				cell.style.left = (j*80+1*j+1)+'px';
				cell.style.top = (i*80+1*i+1)+'px';
				if(n <= 15){
					cell.classList.add('number');
					cell.classList.add((n % 2 !== 0) ? 'odd' : 'even');
					cell.innerHTML = (n++).toString();
				} else {
					cell.className = 'empty';
				}
				
				puzzle.appendChild(cell);
			}
		}

        scramble()
		
	}


	

	function getCell(row, col){
		return document.getElementById(row+'-'+col);
	}


	function getEmptyCell(){
		return puzzle.querySelector('.empty');
	}
	

	function movePossible(cell) {
        var empty = getEmptyCell()

        var cellCoords = cell.id.split('-');
		var row = parseInt(cellCoords[0]);
		var col = parseInt(cellCoords[1]);

        var emptyCoords = empty.id.split('-');
		var emptyRow = parseInt(emptyCoords[0]);
		var emptyCol = parseInt(emptyCoords[1]);

        if (row === emptyRow) {
            return 'ROW'
        } else if (col === emptyCol) {
            return 'COL'
        } else {
            return false
        }
    }

    function moveCells(cell) {
        if(cell.clasName != 'empty'){
			
			var cells = getMovingCells(cell)
            
            while (cells.length > 0) {
                var numCells = cells.length
                var emptyCell = getEmptyCell(); 
                var last = cells[numCells - 1]
                var tmp = {style: last.style.cssText, id: last.id};
                last.style.cssText = emptyCell.style.cssText;
				last.id = emptyCell.id;
				emptyCell.style.cssText = tmp.style;
				emptyCell.id = tmp.id;

                cells.pop()
            }
				
			checkOrder();


		}
    }

    function getMovingCells(cell) {
        var empty = getEmptyCell()

        var cellCoords = cell.id.split('-');
		var row = parseInt(cellCoords[0]);
		var col = parseInt(cellCoords[1]);

        var emptyCoords = empty.id.split('-');
		var emptyRow = parseInt(emptyCoords[0]);
		var emptyCol = parseInt(emptyCoords[1]);

        var cells = [];
  
        if (movePossible(cell) === 'ROW') {
            if (col < emptyCol) {
                for(i=col; i<emptyCol; i++) {
                    cells.push(getCell(row, i))
                }
            } else {
                for(i=col; i>emptyCol; i--) {
                    cells.push(getCell(row, i))
                }
            }
        } else if (movePossible(cell) === 'COL') {
            if (row < emptyRow) {
                for(i=row; i<emptyRow; i++) {
                    cells.push(getCell(i, col))
                }
            } else {
                for(i=row; i>emptyRow; i--) {
                    cells.push(getCell(i, col))
                }
            }
        }
        return cells
    }

	function getAdjacentCells(cell){

		var coords = cell.id.split('-');
		var row = parseInt(coords[0]);
		var col = parseInt(coords[1]);
		
		var adjacent = [];
		
		if(row < 3){adjacent.push(getCell(row+1, col));}			
		if(row > 0){adjacent.push(getCell(row-1, col));}
		if(col < 3){adjacent.push(getCell(row, col+1));}
		if(col > 0){adjacent.push(getCell(row, col-1));}
		
		return adjacent;	
	}
	
	function checkOrder(){
	
		if(getCell(3, 3).className != 'empty'){
			return;
		}
	
		var n = 1;
	
		for(var i = 0; i <= 3; i++){
			for(var j = 0; j <= 3; j++){
				if(n <= 15 && getCell(i, j).innerHTML != n.toString()){
					return;
				}
				n++;
			}
		}
		
		congrats.innerHTML = 'Congrats You Solved It!'
	
	}


	function scramble(){
	
		if(state == false){
			return;
		}
		
		puzzle.removeAttribute('class');
		state = false;
		
		var previousCell;
		var i = 1;
		var interval = setInterval(function(){
			if(i <= 100){
				var adjacent = getAdjacentCells(getEmptyCell());
				if(previousCell){
					for(var j = adjacent.length-1; j >= 0; j--){
						if(adjacent[j].innerHTML == previousCell.innerHTML){
							adjacent.splice(j, 1);
						}
					}
				}
                
				previousCell = adjacent[rand(0, adjacent.length-1)];
                
				moveCells(previousCell);
				i++;
			} else {
				clearInterval(interval);
				state = true;
			}
		}, 5);

	}
	

	function rand(from, to){
		return Math.floor(Math.random() * (to - from + 1)) + from;
	}

}());


