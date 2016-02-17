
function Game(){
  this.lotto.dom = $(".lotto");
  this.bingo.dom = $(".bingo");
  var me = this;

  $("#placeholder").css({width: 0});
  $("body").keypress(function(e) {
    if(e.keyCode == 32) {//space
      me.getWinner();
    }

    if(e.keyCode >= 48 && e.keyCode <=57){
      var value = e.keyCode -= 48;
      if(me.security > 10)
        me.security = 0;

      if(me.security > 0 && me.security < 10)
        me.security *= 10;

      me.security += value;
    }
  });
}
Game.prototype = {
  security: 0,

  balls: [],
  winning: [],

  lotto: {
    dom: null,
    width: 0,
    height: 0,
  },

  bingo: {
    dom: null,
  },

  colors: ["#F44336", "#E91E63", "#9C27B0", "#3F51B5", "#2196F3",
  "#009688", "#03A9F4", "#4CAF50", "#CDDC39", "#FFEB3B", "#FF9800",
  "#795548", "#673AB7", "#00BCD4", "#009688", "#8BC34A", "#FFC107",
  "#FF5722", "#607D8B"],
  audio: new Audio('sound/6149.wav'),
  start: function(){
    this.adjustSize();

    for(var i = 1 ; i <= 75 ; i++){
      var ball = this.createBall(i);
      this.balls.push(ball);
      ball.render(this.lotto.dom);

      ball.movedown();
    }
  },

  createBall: function(number){
    return new Ball(number, this.colors[number % this.colors.length], this);
  },

  adjustSize: function(ball){

    var size = 0;
    if(ball) {
      var contains = Math.floor(this.lotto.dom.width() / (ball.width + 10));
      size = Math.ceil(this.winning.length / contains) * ( ball.height + 2);
    }
    this.bingo.dom.css({height: size});

    this.lotto.width = this.lotto.dom.width();
    this.lotto.height = this.lotto.dom.height();

  },

  _getWinnerFlag: false,

  getWinner: function(){
    if(this._getWinnerFlag) return;

    this._getWinnerFlag = true;
    var ball = this.balls[randomToN(this.balls.length) - 1];

    var me = this;
    if(this.security){
      $.each(this.balls, function(index, value){
        if(value.number == me.security){
          ball = value;
          return false;
        }
      });
    }

    if(!ball) return;

    this.security = 0;
    this.audio.play();
    this.audio.ontimeupdate = function() {
      if(me.audio.currentTime >= 2.0) {
        me.audio.ontimeupdate = null;
        me.showWinner(ball);
      }
    };
  },

  showWinner: function(ball){
    var me = this;

    ball.unrender();
    this.winning.push(ball);

    $(ball.content).addClass('superlarge')
    .css({
        left: (this.lotto.width - $(ball.content).width()) / 2,
        top: (this.lotto.height - $(ball.content).height()) / 2,
      });

    $("body").append(ball.content);
    $(".bg").css({
      opacity: 1
    });

    window.setTimeout(function(){
      $("#placeholder").show();

      $(".bg").animate({
        opacity: 0,
      }, {
        duration: 1000,
        queue: false,
      });

      $("#placeholder").animate({
        width: 100,
      }, {
        duration: 1000,
        queue: false,
      });

      me.adjustSize({width: 100, height: 100});
      $(ball.content).animate({
        left: 0,
        top: Math.min($(".bingo").position().top, (me.lotto.height - 100)),
        width: 100,
        height: 100,
        fontSize: 60,
        lineHeight: 100,
      },{
        duration: 1000,
        queue: false,
        easing: 'easeOutSine',
        complete:function(){
          $(ball.content).removeClass('superlarge')
          .css({
              left: 0,
              top: 0,
              background: '#F44336',
            });
          $("#placeholder").css({width: 0});
          ball.prepend($(".bingo"));
          $("#placeholder").hide();
          $(".bingo").prepend($("#placeholder"));
          me._getWinnerFlag = false;
        }
      });
    }, 1000);

    this.balls = jQuery.grep(this.balls, function(value) {
      return value != ball;
    });
  }
}
//-----------------------------------------
function Ball(number, color, game){
  this.game = game;

  this.content = document.createElement("div");
  this.number = number;
  $(this.content).addClass("ball")
  .html(number)
  .css( "background", "linear-gradient(to bottom right, " + 
    this.adjustColor(color, 25) + "," + this.adjustColor(color, -25) + ")");

  this._speed += (randomToN(10) / 100);

  return this;
}

Ball.prototype = {
  _height: null,
  _width: null,
  _speed: 0.5,
  easingModeUp: 'easeOutSine',
  easingModeDown: 'easeInSine',
  game: null,
  render: function(parent){
    $(parent).append(this.content);

    $(this.content).css({
      top: randomToN(this.game.lotto.height - this.height()),
      left: randomToN(this.game.lotto.width - this.width())
    });
  },

  prepend: function(parent){
    $(parent).prepend(this.content);
  },

  unrender: function(){
    this.stop();
    //$(this.content).remove();
  },

  adjustColor: function(color, percent) {
      var num = parseInt(color.slice(1),16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
      return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
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

  stop: function() {
    this._stop = true;

    this.rotate(0, 0);
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
    if(this.left() + (this._diff * 2) > (this.game.lotto.width - this.width()))
      this._diff *= -1;
    if(this.left() + (this._diff * 2) < 0)
      this._diff *= -1;

    var range = $(this.content).position().top -= randomToN(150);
    $(this.content).animate({
      top: '-=' + range,
      left: '+=' + this._diff
    },{
        duration: range/this._speed,
        queue: false,
        easing: this.easingModeUp,
        complete:(function(){ this.movedown(); }).bind(this)
    });

    if(Math.random() > 0.7)
      this.rotate(randomToN(360));
    $($(this.content).parent()).append(this.content);
  },

  movedown: function(){
    if(this._stop) return;

    var range = this.game.lotto.height - this.height() - $(this.content).position().top;
    $(this.content).animate({
      top: '+=' + range,
      left: '+=' + this._diff
    },{
        duration: range/this._speed,
        queue: false,
        easing: this.easingModeDown,
        complete:(function(){ this.moveup(); }).bind(this)
    });
  },

  rotate: function(angle, duration){
    if(this._rotate && angle != 0) return;

    duration = duration || 3000;
    this._rotate = true;

    $({deg: 0}).animate({deg: angle}, {
      duration: duration,
      step: function(now) {
        $(this.content).css({
            transform: 'rotate(' + now + 'deg)'
        });
      },
      complete: function() {
        this._rotate = false;
      }
    }).bind(this);
  }
}

//-----------------------------------------

function randomToN(n){
  return Math.floor((Math.random() * n) + 1);
}