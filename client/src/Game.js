class Game {
  constructor(node) {
    this.targetNode = node;
    this.entities = [];
    this.highScore = 0;
    this.curScore = 0;
    this.cooldown = false;
    this.gameState = {
      boardWidth: document.getElementById(this.targetNode).scrollWidth,
      boardHeight: document.getElementById(this.targetNode).scrollHeight,
      lives: 5
    };
    //Selects the game board and appends the new game svg to the board
    this.svgSelection = d3.selectAll('#' + this.targetNode)
      .append('svg')
      .attr('width', this.gameState.boardWidth)
      .attr('height', this.gameState.boardHeight);
    this.addEnemies(5);
    this.addPlayer();
    setInterval(this.incrementCounter.bind(this), 100);
    this.render();
  }
  addEnemies(n) {
    for (var i = 0; i <= n; i++) {
      this.entities.push(new Enemy(this.gameState));
    }
  }
  incrementCounter() {
    if (this.lives > 0) {
      this.curScore++;
    }
    if (this.curScore > this.highScore) {
      this.highScore = this.curScore;
    }
    //console.log(this.curScore);
  }
  decrementLives() {
    if (!this.cooldown) {
      this.gameState.lives--; 
      this.cooldown = true;
      setTimeout(() => this.cooldown = false, 750);
    }
    console.log(this.gameState.lives);
  }
  addPlayer() {
    this.player = new Player(this.gameState);
    var thisGame = this;
    var move = d3.behavior.drag().on('drag', function(d, i) {
      let dx = d3.event.dx;
      let dy = d3.event.dy;
      d.x += d3.event.dx;
      d.y += d3.event.dy;
      d3.select(this).attr('transform', function(d, i) {
        return 'translate(' + d.x + ',' + d.y + ')';
      });
      d.currentX = Number(this.getAttribute('cx')) + Number(d.x);
      d.currentY = Number(this.getAttribute('cy')) + Number(d.y);
      d.detectCollisionWith('enemies', thisGame.decrementLives.bind(thisGame));
      // Detects if this movement causes the player to collide with an enemy.
      // D3 selection of the enemies, check collision each.
      
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
      .attr('class', 'player')
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
    var thisGame = this;
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
      })
      .tween('collisionDetection', function(d) {
        return function() {
          d.currentX = this.getAttribute('cx');
          d.currentY = this.getAttribute('cy');
          d.currentR = this.getAttribute('r');
          d.detectCollisionWith.call(d, 'player', thisGame.decrementLives.bind(thisGame));
        };
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
    this.x = pos[0]; // Identifies the entity's target position
    this.y = pos[1];
    this.currentX = pos[0]; // Identifies the entity's current in the moment position
    this.currentY = pos[0];
    this.currentR = this.r;
  }
  detectCollisionWith(className, callback) {
    let entities = d3.selectAll('.' + className)[0];
    for (var i = 0; i < entities.length; i++) {
      var cx = Number(entities[i].__data__.currentX);
      var cy = Number(entities[i].__data__.currentY);
      var r = Number(entities[i].__data__.currentR);
      var absoluteX = this.currentX;
      var absoluteY = this.currentY;
      var distance = Math.sqrt(Math.pow(cx - absoluteX, 2) + Math.pow(cy - absoluteY, 2));
      if (distance < r + this.r) {
        callback();       
      }
    }
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






