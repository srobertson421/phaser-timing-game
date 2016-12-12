var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update});

var SPEED = 1500;
var CLICK_BOUNDS = {}
CLICK_BOUNDS.left = game.rnd.integerInRange(0, 500);
CLICK_BOUNDS.right = CLICK_BOUNDS.left + 200;

function preload() {
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;

  game.load.image('circle', 'assets/grey_circle.png');
}

var circle;
var tween1;
var tween2;
var score = 0;
var scoreText;
var canClick = true;
var hasStarted = false;

function create() {
  scoreText = game.add.text(50, 50, score, {font: '28px Arial', fill: '#fff'});
  scoreText.anchor.setTo(0.5);

  circle = game.add.sprite(50, game.world.centerY + 50, 'circle');
  circle.anchor.setTo(0.5);

  tween1 = game.add.tween(circle).to({
    x: [game.world.width - 50],
    y: [game.world.centerY - 150, game.world.centerY + 50]
  }, SPEED, Phaser.Easing.Linear.None)
  .interpolation(Phaser.Math.bezierInterpolation);

  tween2 = game.add.tween(circle).to({
    x: [50],
    y: [game.world.centerY - 150, game.world.centerY + 50]
  }, SPEED, Phaser.Easing.Linear.None)
  .interpolation(Phaser.Math.bezierInterpolation);

  tween1.chain(tween2).onComplete.add(restartTween, this);

  tween1.start();

  game.input.onDown.add(clickHandler, this);
}

function endGame() {
  tween1.stop();
}

function clickHandler(pointer) {
  if(!canClick) {
    return;
  }

  if(!hasStarted) {
    hasStarted = true;
    game.time.events.add(Phaser.Timer.SECOND * 15, endGame, this);
  }

  if(circle.x > CLICK_BOUNDS.left && circle.x < CLICK_BOUNDS.right) {
    game.stage.backgroundColor = '00ff00';
    score++;
    score = round(score, 1);
    scoreText.text = score;
    SPEED -= 100;
  } else {
    game.stage.backgroundColor = 'ff0000';
    score--;
    score = round(score, 1);
    scoreText.text = score;
    SPEED += 100;
  }

  CLICK_BOUNDS.left = 0;
  CLICK_BOUNDS.right = 0;
  tween1.updateTweenData('duration', SPEED);
  tween2.updateTweenData('duration', SPEED);

  canClick = false;

  setTimeout(function() {
    game.stage.backgroundColor = '000000';
    CLICK_BOUNDS.left = game.rnd.integerInRange(0, 500);
    CLICK_BOUNDS.right = CLICK_BOUNDS.left + 200;
    canClick = true;
  }, 750);
}

function restartTween(spriteObj, tweenObj) {
  if(hasStarted) {
    score -= 0.1;
    score = round(score, 1);
    scoreText.text = score;
  }
  tweenObj.start();
}

function update() {

  if(circle.x > CLICK_BOUNDS.left && circle.x < CLICK_BOUNDS.right) {
    circle.tint = 0x00ff00;
  } else {
    circle.tint = 0xffffff;
  }
}

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}
