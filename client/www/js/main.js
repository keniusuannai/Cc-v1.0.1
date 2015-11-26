/**
 * Created by bigta on 2015/8/16.
 */




//获得win实例 Load native UI library
var gui = require('nw.gui');
var win = gui.Window.get();


//初始化tray
var isShowWindow = true;
var tray = new gui.Tray({title: 'ChatCoding', icon: 'www/content/icon.png'});
tray.tooltip = 'ChatCoding';
//添加一个菜单
var menu = new gui.Menu();
menu.append(new gui.MenuItem({
    type: 'checkbox', label: '退出',
    click: function () {
        win.close();
    }
}));
tray.menu = menu;
//click事件
tray.on('click',
    function () {
        if (isShowWindow) {
            win.hide();
        }
        else {
            win.show();
        }
        isShowWindow = !isShowWindow;
    }
);

var path = $("#path");
var frame = 1000 / 60;
var startD = createD(350, 0, 1),
    finalD = createD(800, 0, 1);
function start() {
    win.width = 900;
    $(document.body).removeClass("shadow");
    $(document.body).css("width", "900px");
    animatePathD(path, finalD, 600, function () {
        $(document.body).css("width", "800px");
        win.width = 812;
        $(document.body).addClass("shadow");
        $('#main-box').css('display', 'block').css('opacity', '1');
        //处理入场动画
        var seq = [
            {
                elements: $('.person'),
                properties: {top: '0', opacity: 1},
                options: {duration: [250, 15]}
            },
            {
                elements: $('#menu'),
                properties: {top: '2em', opacity: 1},
                options: {duration: [250, 15]}
            },
            {
                elements: $('#editor'),
                properties: {bottom: '0', opacity: 1},
                options: {duration: [250, 15]}
            },
            {
                elements: $('.chat-content'),
                properties: {opacity: 1},
                options: {duration: 600}
            }
        ];
        setTimeout(function(){
            $.Velocity.RunSequence(seq);
        },1000);

    });
}

var easings = {
    smallElastic: function (t, b, c, d) {
        var ts = (t /= d) * t;
        var tc = ts * t;
        return b + c * (33 * tc * ts + -106 * ts * ts + 126 * tc + -67 * ts + 15 * t);
    },
    inCubic: function (t, b, c, d) {
        var tc = (t /= d) * t * t;
        return b + c * (tc);
    }
};
function animatePathD(path, d, time, callback, easingTop, easingX) {
    var steps = Math.floor(time / frame),
        curStep = 0,
        oldArr = startD.split(" "),
        newArr = d.split(" "),
        oldTop = +oldArr[1].split(",")[0],
        topDiff = +newArr[1].split(",")[0] - oldTop,
        nextTop,
        nextX,
        easingTop = easings[easingTop] || easings.smallElastic,
        easingX = easings[easingX] || easingTop;

    function animate() {
        curStep++;
        nextTop = easingTop(curStep, oldTop, topDiff, steps);
        nextX = easingX(curStep, 60, 0 - 60, steps);
        oldArr[1] = nextTop + ",0";
        oldArr[2] = "a" + Math.abs(nextX) + ",300";
        oldArr[4] = (nextX >= 0) ? "1,1" : "1,0";
        path.attr("d", oldArr.join(" "));
        if (curStep > steps) {
            curX = 0;
            diffX = 0;
            path.attr("d", d);
            if (callback) callback();
            return;
        }
        requestAnimationFrame(animate);
    }

    animate();
}
function createD(top, ax, dir) {
    return "M0,0 " + top + ",0 a" + ax + ",300 0 1," + dir + " 0,600 L0,600";
}


//登陆框动画
var $email = $('#email'),
    $lab_email = $('#lab-email'),
    $pwd = $('#pwd'),
    $lab_pwd = $('#lab-pwd');

$email.on('focus', function () {
    $email.css("width", "0");
    $lab_email.velocity({top: '43%', color: '#0099CC'}, [250, 15]);
    $email.velocity({width: '266px', borderColor: '#0099CC'}, [250, 15]);
});
$email.on('blur', function () {
    if ($email.val().length > 0) return;
    $lab_email.velocity({top: '48%', color: '#fff'}, [250, 15]);
    $email.velocity({borderColor: '#fff'}, [250, 15]);
});
$pwd.on('focus', function () {
    $pwd.css("width", "0");
    $lab_pwd.velocity({top: '55%', color: '#0099CC'}, [250, 15]);
    $pwd.velocity({width: '266px', borderColor: '#0099CC'}, [250, 15]);
});
$pwd.on('blur', function () {
    if ($pwd.val().length > 0) return;
    $lab_pwd.velocity({top: '59%', color: '#fff'}, [250, 15]);
    $pwd.velocity({borderColor: '#fff'}, [250, 15]);
});

//登陆按钮弹性
(function () {
    function extend(a, b) {
        for (var key in b) {
            if (b.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        }
        return a;
    }

    function SVGButton(el, options) {
        this.el = el;
        this.options = extend({}, this.options);
        extend(this.options, options);
        this.init();
    }

    SVGButton.prototype.options = {
        speed: {reset: 800, active: 150},
        easing: {reset: mina.elastic, active: mina.easein}
    };

    SVGButton.prototype.init = function () {
        this.shapeEl = this.el.querySelector('span.morph-shape');

        var s = Snap(this.shapeEl.querySelector('svg'));
        this.pathEl = s.select('path');
        this.paths = {
            reset: this.pathEl.attr('d'),
            active: this.shapeEl.getAttribute('data-morph-active')
        };

        this.initEvents();
    };

    SVGButton.prototype.initEvents = function () {
        this.el.addEventListener('mousedown', this.down.bind(this));
        this.el.addEventListener('mouseup', this.up.bind(this));
        this.el.addEventListener('mouseout', this.up.bind(this));
    };

    SVGButton.prototype.down = function () {
        this.pathEl.stop().animate({'path': this.paths.active}, this.options.speed.active, this.options.easing.active);
    };

    SVGButton.prototype.up = function () {
        this.pathEl.stop().animate({'path': this.paths.reset}, this.options.speed.reset, this.options.easing.reset);
    };

    [].slice.call(document.querySelectorAll('#login')).forEach(function (el) {
        new SVGButton(el);
    });


})();

$('#login').hover(
    function () {
        $(this).find('svg').velocity({fill: '#0099CC'}, 333);
    },
    function () {
        $(this).find('svg').velocity("stop");
        $(this).find('svg').css('fill', 'none');
    }
);

//点击登陆
$('#login').on('click', function () {
    //判断是否登陆成功
    var ws = io.connect('http://127.0.0.1:8888');
    ws.on('connect', function(){
        var nickname = $('#email').val();
        var password = $('#pwd').val();
        ws.emit('login', nickname,password);
    });

    var i = 0;
    var time = setInterval(function () {
        if (i > 20) {
            clearInterval(time);
            $('#login-box').css('display', 'none');
            start();
        } else {
            i++;
            win.x -= 10;
        }
    }, 10);


});
$('.close').click(function () {
    win.hide();
});

//主页菜单栏动画
var isOpen;
(function () {

    function SVGMenu(el, options) {
        this.el = el;
        this.init();
    }

    SVGMenu.prototype.init = function () {
        this.trigger = this.el.querySelector('button.menu__handle');
        this.shapeEl = this.el.querySelector('div.morph-shape');

        var s = Snap(this.shapeEl.querySelector('svg'));
        this.pathEl = s.select('path');
        this.paths = {
            reset: this.pathEl.attr('d'),
            open: this.shapeEl.getAttribute('data-morph-open'),
            close: this.shapeEl.getAttribute('data-morph-close')
        };

        isOpen = false;

        this.initEvents();
    };

    SVGMenu.prototype.initEvents = function () {
        this.trigger.addEventListener('click', this.toggle.bind(this));
    };

    SVGMenu.prototype.toggle = function () {
        var self = this;

        if (isOpen) {
            //关闭
            classie.remove(self.el, 'menu--anim');
            setTimeout(function () {
                classie.remove(self.el, 'menu--open');
            }, 250);
            $('.container').css('opacity', '1');
            setTimeout(function () {
                $('.container section').velocity({width: '100%'});
            }, 350);
        }
        else {
            //打开 section右移同时透明度下降
            $('.container section').velocity({width: '80.8%'}, 600);
            $('.container').css('opacity', '.2');
            classie.add(self.el, 'menu--anim');
            setTimeout(function () {
                classie.add(self.el, 'menu--open');
            }, 250);
        }
        this.pathEl.stop().animate({'path': isOpen ? this.paths.close : this.paths.open}, 350, mina.easeout, function () {
            self.pathEl.stop().animate({'path': self.paths.reset}, 800, mina.elastic);
        });

        isOpen = !isOpen;
    };

    new SVGMenu(document.getElementById('menu'));

})();

//点击菜单栏各个功能
var $menu_handle = $('.menu__handle');
$('.menu__inner ul li').each(function () {
    $(this).click(function () {
        console.log($(this).index());
        $('.container section').css('display', 'none');
        //$($('.container section').index($(this).index()+1)).css('display', 'block');
        $('.container section:eq(' + $(this).index() + ')').css('display', 'block');
        $menu_handle.click();
    })
});


//好友列表滚动
var person_top = 0;
var li = $('.person div').find('li').length - 9;
$('.person div').on('mousewheel', function (event, delta, deltaX, deltaY) {
    //delta 下-1；上1
    person_top += delta * 62;
    console.log();
    if (person_top > 0) {
        person_top = 0;
        return;
    }
    if (person_top < li * (-62)) {
        person_top = li * (-62);
        return;
    }
    $(this).find('ul').velocity({top: person_top}, 100)
});
//点击好友头像
$('.person li').on('click', function () {
    $('.person ul div').velocity({top: $(this).index() * 62}, [250, 15]);

    //切换回主页
    if (isOpen) {
        $menu_handle.click();
    }
    $('.index-box').siblings().css('display', 'none');
    $('.index-box').css('display', 'block');
    //读取文件 导入消息记录
    var rf = require("fs");
    rf.readFile("suannai", 'utf-8', function (err, data) {
        if (err) {
            alert(err);
        } else {
            //成功读取数据后
            setTimeout(function () {
                $('.spinner').css('display', 'none');
                $('.chat-content ul').css('display', 'block');
                $('#current').velocity('scroll', {container: $content, duration: 800});
            }, 1200);
        }
    });
    //读取数据时显示loading
    $('.chat-content ul').css('display', 'none');
    $('.spinner').css('display', 'block');
});

//输入框事件
var $content = $('.chat-content');
$('#editor').keydown(function (event) {
    //判断回车还是换行
    if (event.keyCode == 13) {
        if (event.shiftKey != 1) {
            var $editor = $('#editor');
            //如果是回车 则判空
            if ($editor.text().length > 0) {
                var $ul = $content.find('ul');
                $ul.find('li').removeAttr('id');
                $ul.append('<li id="current" class="me">' + $editor.html() + '</li>');
                $('#current').velocity('scroll', {container: $content, duration: 800});
                $('embed').remove();
                $content.append('<embed src="content/notify.ogg" autostart="true" hidden="true" loop="false">');
                eggshell($editor.text());

                $editor.empty();
            }

        }
    }
});
//彩蛋 哈哈哈
var eggtime, dur = 0;
function eggshell(str) {
    switch ($.trim(str)) {
        case 'shake':
            eggtime = setInterval(function () {
                if (dur > 20) {
                    clearInterval(eggtime);
                    dur = 0
                } else {
                    win.x += 8 * Math.pow(-1, dur);
                    dur++;
                }
            }, 32);
            break;
        case 'exit':
            win.close();
            break;
    }
}