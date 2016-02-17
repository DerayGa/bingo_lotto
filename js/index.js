
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
  var myShakeEvent = new Shake();
  myShakeEvent.start();
  window.addEventListener('shake', shakeEventDidOccur, false);

  function shakeEventDidOccur () {
    alert('la')
    me.getWinner();
    alert('ga')
  }
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
    var amount = 75;
    var isMobile = false; //initiate as false
    // device detection
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4)))
      isMobile = true;

    if (isMobile)
      amount = 20;

    for(var i = 1 ; i <= amount ; i++){
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