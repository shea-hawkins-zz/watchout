class Game {
  constructor(node) {
    this.targetNode = node;
    this.entities = [];
    this.lives = 5;
    this.highScore = 0;
    this.curScore = 0;
    this.gameState = {
      boardWidth: document.getElementById(this.targetNode).scrollWidth,
      boardHeight: document.getElementById(this.targetNode).scrollHeight 
    };
    //Selects the game board and appends the new game svg to the board
    this.svgSelection = d3.selectAll('#' + this.targetNode)
      .append('svg')
      .attr('width', this.gameState.boardWidth)
      .attr('height', this.gameState.boardHeight);
    this.addEnemies(10);
    this.addPlayer();
    this.render();
  }
  addEnemies(n) {
    for (var i = 0; i <= n; i++) {
      this.entities.push(new Enemy(this.gameState));
    }
  }
  addPlayer() {
    var player = new Player(this.gameState);
    this.entities.push(player);
  }
  render() {
    this.entities.forEach(entity => entity.update());
   
    //From the previously created svg, selects all circle elements as the target.
    //If a new circle has entered, append the circle with the specified parameters.
    var entitySelection = this.svgSelection
      .selectAll('circle')
      .data(this.entities, function(entity) {
        return entity.id;
      });
    entitySelection  
      .enter()
      .append('circle')
      .attr('cx', function(data) {
        return data.x;
      })
      .attr('cy', function(data) {
        return data.y;
      })
      .attr('r', function(data) {
        return data.r;
      })
      .style('fill', function(data) {
        return data.color;
      });
    entitySelection
      .transition()
      .duration(1000)
      .attr('cx', function(data) {
        return data.x;
      })
      .attr('cy', function(data) {
        return data.y;
      })
      .attr('r', function(data) {
        return data.r;
      })
      .style('fill', function(data) {
        return data.color;
      });

    setTimeout(this.render.bind(this), 1000);
      /// SetInterval
        ///  Call render after n secs


  }
}


class Entity {
  constructor (gameState) {
    this.id = Math.floor(Math.random() * 1000);
    this.gameState = gameState;
    this.r = this.getRandomRadius();
    this.color = this.getRandomColor();
    let pos = this.getRandomPosition();
    this.x = pos[0];
    this.y = pos[1];
  }
  getRandomRadius() {
    return Math.random() * 20 + 10;
  }
  getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  getRandomPosition() {
    var x = Math.random() * this.gameState.boardWidth;
    var y = Math.random() * this.gameState.boardHeight;
    if (x > this.gameState.boardWidth - this.r) {
      x = this.gameState.boardWidth - this.r;
    } else if (x < this.r) {
      x = 0 + this.r;
    }
    if (y > this.gameState.boardHeight - this.r) {
      y = this.gameState.boardHeight - this.r;
    } else if (y < this.r) {
      y = 0 + this.r;
    }
    return [x, y];
  }

  update() {
    return;
  }
}

class Player extends Entity {
  constructor(gameState) {
    super(gameState);
  }
}

class Enemy extends Entity {
  constructor(gameState) {
    super(gameState);
  }
  update() {
    [this.x, this.y] = this.getRandomPosition();
    this.r = this.getRandomRadius();
    this.color = this.getRandomColor();
  }
}


// var Class = function() {
//   this.x = 5;
//   this.y = 9;
// };

// var SubClass = function() {

// };
// SubClass.prototype = Object.create(Class);
// SubClass.prototype.constructor = SubClass;

var game = new Game('gameBoard');


// var drag = d3.behavior.drag()
//   .on("drag", dragmove);

// function dragmove(d) {
//   var x = d3.event.x;
//   var y = d3.event.y;
//   d3.select(this).attr("transform", "translate(" + x + , + y + ")");
// }
// }




