var colors = ["#F44336", "#E91E63", "#9C27B0", "#3F51B5", "#2196F3", "#009688", "#03A9F4", "#4CAF50", "#CDDC39", "#FFEB3B", "#FF9800", "#795548"];
var balls = [];
var winning = [];

var lotto = {
  width: 0,
  height: 0,
}

var easingModeUp = 'easeOutSine';
var easingModeDown = 'easeInSine';
var easingModeLeftRight = 'easeInCirc';
var speedPerPixel = 0.5;

function Ball(number, color){
  this.content = document.createElement("div");
  this.number = number;
  $(this.content).addClass("ball")
  .html(number)
  .css( "background-color", color);

  this._speed += (randomToN(10) / 100);

  return this;
}

Ball.prototype = {
  _height: null,
  _width: null,
  _speed: speedPerPixel,
  render: function(parent){
    $(parent).append(this.content);

    $(this.content).css({
      top: randomToN(lotto.height - this.height()),
      left: randomToN(lotto.width - this.width())
    });
  },

  prepend: function(parent){
    $(parent).prepend(this.content);
  },

  unrender: function(){
    this.stop();
    //$(this.content).remove();
  },

  height: function(){
    if(this._height)
      return this._height;

    this._height = $(this.content).height();
    return this._height;
  },

  width: function(){
    if(this._width)
      return this._width;

    this._width = $(this.content).width();
    return this._width;
  },

  left: function(){
    return $(this.content).position().left;
  },

  run: function() {
    this.movedown();
    //(Math.random() > 0.5) ? this.moveup() : this.movedown();
    //(Math.random() > 0.5) ? this.moveright(): this.moveleft();
  },

  stop: function() {
    this._stop = true;
    $(this.content).stop(true, true)
    .css({
      left: 0,
      top: 0,
    })
    .addClass('selected').addClass('large');
  },

  _diff: 0,
  moveup: function(){
    if(this._stop) return;

    this._diff = randomToN(200) * ((Math.random() > 0.5) ? 1 : -1);
    if(this.left() + (this._diff * 2) > (lotto.width - this.width()))
      this._diff *= -1;
    if(this.left() + (this._diff * 2) < 0)
      this._diff *= -1;

    var me = this;
    var range = $(this.content).position().top -= randomToN(150);
    $(this.content).animate({
      top: '-=' + range,
      left: '+=' + this._diff
    },{
        duration: range/this._speed,
        queue: false,
        easing: easingModeUp,
        complete:function(){ me.movedown(); }
    });

    $($(this.content).parent()).append(this.content);
  },

  movedown: function(){
    if(this._stop) return;

    var me = this;
    var range = lotto.height - this.height() - $(this.content).position().top;
    $(this.content).animate({
      top: '+=' + range,
      left: '+=' + this._diff
    },{
        duration: range/this._speed,
        queue: false,
        easing: easingModeDown,
        complete:function(){ me.moveup(); }
    });
  },

  moveleft: function(){
    if(this._stop) return;

    var me = this;
    var range = lotto.width - this.width() - $(this.content).position().left;
    $(this.content).animate({
      left: '+=' + range
    },{
        duration: range/this._speed,
        queue: false,
        easing: easingModeLeftRight,
        complete:function(){ me.moveright(); }
      });
  },

  moveright: function(){
    if(this._stop) return;

    var me = this;
    var range = $(this.content).position().left;
    $(this.content).animate({
      left: '-=' + range
    },{
        duration: range/this._speed,
        queue: false,
        easing: easingModeLeftRight,
        complete:function(){ me.moveleft(); }
    });
  }
}

function randomToN(n){
  return Math.floor((Math.random() * n) + 1);
}

function createBall(number){
  var color = colors[number % colors.length];

  var ball = new Ball(number, color);

  return ball;
}

function adjustSize(ball){

  var size = 0;
  if(ball) {
    var contains = Math.floor($(".lotto").width() / ($(ball.content).width() + 10));
    size = Math.ceil(winning.length / contains) * ( $(ball.content).height() + 2);
  }
  $(".bingo").css({height: size});

  lotto.width = $(".lotto").width();
  lotto.height = $(".lotto").height();

}

function createBalls(){
  adjustSize();

  for(var i = 1 ; i <= 75 ; i++){
    var ball = createBall(i);
    balls.push(ball);
    ball.render($(".lotto"));

    ball.run();
  }
}


var security = 0;

function gameStart(){
  createBalls();

  $("#placeholder").css({width: 0});
  $( "body" ).keypress(function(e) {
    if(e.keyCode == 32) {//space
      getWinner();
    }

    if(e.keyCode >= 48 && e.keyCode <=57){
      var value = e.keyCode -= 48;
      if(security > 10)
        security = 0;

      if(security > 0 && security < 10)
        security *= 10;
      security += value;
    }
  });
}

var getWinnerFlag = false;

function getWinner(){
  if(getWinnerFlag) return;

  getWinnerFlag = true;
  var ball = balls[randomToN(balls.length) - 1];

  if(security){
    $.each(balls, function(index, value){
      if(value.number == security){
        ball = value;
        return false;
      }
    })
  }

  if(!ball) return;

  security = 0;

  ball.unrender();
  winning.push(ball);

  $(ball.content).addClass('superlarge')
  .css({
      left: (lotto.width - $(ball.content).width()) / 2,
      top: (lotto.height - $(ball.content).height()) / 2,
    });

  $("body").append(ball.content);

  window.setTimeout(function(){
    $("#placeholder").show();
    $("#placeholder").animate({
      width: (100),
    }, {
      duration: 1000,
      queue: false,
    });

    $(ball.content).animate({
      left: 0,
      top: Math.min($(".bingo").position().top, (lotto.height - 100)),
      width: 100,
      height: 100,
      fontSize: 60,
      lineHeight: 100,
      backgroundColor: '#F44336',
    },{
      duration: 1000,
      queue: false,
      easing: 'easeOutSine',
      complete:function(){
        $(ball.content).removeClass('superlarge')
        .css({
            left: 0,
            top: 0,
          });
        $("#placeholder").css({width: 0});
        adjustSize(ball);
        ball.prepend($(".bingo"));
        $("#placeholder").hide();
        $(".bingo").prepend($("#placeholder"));
        getWinnerFlag = false;
      }
    });
  }, 1000);
  //

  balls = jQuery.grep(balls, function(value) {
    return value != ball;
  });
}
