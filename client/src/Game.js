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
    this.player = new Player(this.gameState);
    var that = this;
    var move = d3.behavior.drag().on('drag', function(d, i) {
      let dx = d3.event.dx;
      let dy = d3.event.dy;
      d.x += d3.event.dx;
      d.y += d3.event.dy;
      var absoluteX = d.x + that.gameState.boardWidth / 2;
      var absoluteY = d.y + that.gameState.boardHeight / 2;

      // Detects if this movement causes the player to collide with an enemy.
      // D3 selection of the enemies, check collision each.
      let enemies = d3.selectAll('.enemies')[0];
      for (var i = 0; i < enemies.length; i++) {
        var cx = enemies[i].getAttribute('cx');
        var cy = enemies[i].getAttribute('cy');
        var r = Number(enemies[i].getAttribute('r'));
        var distance = Math.sqrt(Math.pow(Number(cx) - Number(absoluteX), 2) + Math.pow(Number(cy) - Number(absoluteY), 2));
        if (distance < r + d.r) {
          that.lives = that.lives - 1;        
        }
      }
      d3.select(this).attr('transform', function(d, i) {
        var stringTest = 'translate(' + dx + ',' + dy + ')';
        return 'translate(' + d.x + ',' + d.y + ')';
      });
    });
    // the player on move must check all of the enemy objects
    // and determine if its absolute coordinate + width and + height collides with any 
    // enemy objects. 
    this.svgSelection
      .selectAll('circle')
      .data([this.player], function(entity) {
        return entity.id;
      })
      .enter()
      .append('circle')
      .attr('cx', (data) => {
        return this.gameState.boardWidth / 2;
      })
      .attr('cy', (data) => {
        return this.gameState.boardHeight / 2;
      })
      .attr('r', 25)
      .style('fill', (data) => {
        return data.color;
      }).call(move);
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
      .attr('class', 'enemies')
      .style('fill', function(data) {
        return data.color;
      });
    entitySelection
      .transition()
      .duration(1750)
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

    setTimeout(this.render.bind(this), 2000);
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
    this.x = 0;
    this.y = 0;
  }
  update(entities) {
    // go through each entity
    // check if this' bounding box collides with other's
    // if it collides, 
  }
}

class Enemy extends Entity {
  constructor(gameState) {
    super(gameState);
  }
  update() {
    this.r = this.getRandomRadius();
    [this.x, this.y] = this.getRandomPosition();
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






