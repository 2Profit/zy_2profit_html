/// <reference path="jquery-1.8.3.min.js" />
/// <reference path="common.js" />
$(function () {
    $("select").change(function () {
        var $a = $(this).prev();
        if ($a.is("a")) {
            $a.html($(this).find('option:selected').text());

        }
    });
});


jc.uiExtend("header", {
    init: function () {
        this.$item = this.$element.find(".n_item");
        this.$item.hover(function () {
            $(this).addClass("active")
        }, function () {
            $(this).removeClass("active");
        });


    }

});

jc.uiExtend("newsList", {
    init: function () {
        this.$element.on("click", ".t_txt a", function () {
            var $item = $(this).parents(".n_item");
            $item.addClass("current").siblings().removeClass("current");


        });
    }

});


jc.uiExtend("silder", {
    timer: null,
    iNow: 0,
    iMax: 0,
    animate: function (oInfo) {
        var iT = oInfo.scrollTop;
        var offsetTop = this.$element.offset().top;
        var offsetHeight = 400
        var iPre = (iT - offsetTop + 60) / offsetHeight;



        if (iPre >= -1 && iPre <= 1) {
            if (this.aItem) {
                this.aItem.each(function (i, obj) {
                    $(obj).css("backgroundPosition", "50% " + -parseInt(iPre * (offsetHeight / 2)) + "px");
                });


            }
        }
    },
    scroll: function (oInfo) {
        /* 暂不开放 */
        //this.animate(oInfo);
    },
    next: function () {
        if (this.iNow == this.iMax - 1) {
            this.iNow = 0;
        }
        else {
            this.iNow++;
        }
        this.jump(this.iNow);

    },
    prev: function () {
        if (this.iNow == 0) {
            this.iNow = this.iMax - 1;
        }
        else {
            this.iNow--;
        }
        this.jump(this.iNow);

    },
    jump: function (eq, fast) {
        this.iNow = eq;

        if (!fast) {
            this.aItem.eq(eq).stop().animate({ opacity: 1 }, "slow", function () {
                $(this).addClass("active");
            }).siblings().stop().animate({ opacity: 0 }, "slow", function () {
                $(this).removeClass("active");
            });
        }
        else {
            this.aItem.eq(eq).stop().css({ opacity: 1, filter: "alpha(opacity=100)" }).addClass("active").siblings().stop().css({ opacity: 0, filter: "alpha(opacity=0)" }).removeClass("active");
        }

        this.aDot.eq(eq).addClass("active").siblings().removeClass("active");

    },
    autoPlay: function (bool) {
        var _this = this;
        if (bool) {
            clearInterval(this.timer);
            this.timer = setInterval(function () {
                if (_this.iNow == _this.iMax - 1) {
                    _this.iNow = 0;
                }
                else {
                    _this.iNow++
                }
                _this.jump(_this.iNow);
            }, 6000);
        }
        else {
            clearInterval(this.timer);
        }

    },
    init: function (oInfo) {

        var _this = this;

        /* 暂不开放 */
        //this.animate(oInfo);

        this.oMain = this.$element.find(".s_main");
        this.aItem = this.oMain.children();

        this.oStep = this.$element.find(".s_step").children();

        this.oController = this.$element.find(".s_controller");


        this.aItem.each(function (i, obj) {
            var oA = $("<a>").attr("href", "javascript:;").mousemove(function () {
                _this.jump($(this).index(), true);
            });
            _this.oController.append(oA);
        });

        this.aDot = this.oController.children();

        this.iMax = this.aItem.length;
        this.jump(0);
        if (this.iMax == 1) return;


        this.oStep.eq(0).click(function () {
            _this.prev();
        });

        this.oStep.eq(1).click(function () {
            _this.next();
        });

        /*
        this.$element.hover(function () {
            _this.autoPlay(false);
            _this.oStep.eq(0).stop().animate({ left: 20 }, "fast");
            _this.oStep.eq(1).stop().animate({ right: 20 }, "fast");
        }, function () {
            _this.oStep.eq(0).stop().animate({ left: -60 }, "fast");
            _this.oStep.eq(1).stop().animate({ right: -60 }, "fast");
            _this.autoPlay(true);
        });
        */

        this.autoPlay(true);
    }


});



jc.uiExtend("editFace", {
    over: null,
    setMask: function () {
        this.oTop.height(this.iTop);
        this.oBottom.height(this.iSize - (this.iTop + this.iDragSize));

        this.oLeft.css({ top: this.iTop, height: this.iDragSize, width: this.iLeft });
        this.oRight.css({ top: this.iTop, height: this.iDragSize, width: this.iSize - (this.iLeft + this.iDragSize) });

    },
    reset: function () {
        this.iLeft = parseInt((this.iSize - this.iDragSize) / 2);
        this.iTop = parseInt((this.iSize - this.iDragSize) / 2);

        this.oDrag.css({ left: this.iLeft, top: this.iTop });
        this.setMask();
    },
    getPos: function () {
        return { x: this.iLeft, y: this.iTop, w: this.iDragSize, h: this.iDragSize };
    },
    init: function () {
        var _this = this;

        this.iSize = this.$element.width();
        this.iLeft = 0;
        this.iTop = 0;
        this.iDragSize = 200;

        this.oDrag = this.$element.find(".e_drag");
        this.oResize = this.oDrag.find(".d_resize");
        this.oImg = this.$element.find(".e_face");

        this.oTop = this.$element.find(".e_top");
        this.oRight = this.$element.find(".e_right");
        this.oBottom = this.$element.find(".e_bottom");
        this.oLeft = this.$element.find(".e_left");

        this.oImg.width(this.iSize).height(this.iSize);


        this.oDrag.mousedown(function (e) {
            var e = e || window.event;

            var iDisX = e.clientX - this.offsetLeft;
            var iDisY = e.clientY - this.offsetTop;

            if (document.body.setCapture) {
                _this.oDrag.each(function (idx, obj) {
                    obj.setCapture();
                });
            }

            document.onmousemove = function (e) {
                var e = e || window.event;

                _this.iLeft = jc.tools.range(e.clientX - iDisX, 0, _this.iSize - _this.oDrag.width());
                _this.iTop = jc.tools.range(e.clientY - iDisY, 0, _this.iSize - _this.oDrag.width());



                _this.oDrag.css({ left: _this.iLeft, top: _this.iTop });

                _this.setMask();

                return false;
            }

            document.onmouseup = function (e) {
                document.onmousemove = null;
                document.onmouseup = null;

                if (document.body.releaseCapture) {
                    _this.oDrag.each(function (idx, obj) {
                        obj.releaseCapture();
                    });
                }

                if (_this.over) _this.over(_this.getPos());
            }
            return false;
        });


        this.oResize.mousedown(function (e) {
            var e = e || window.event;


            document.onmousemove = function (e) {
                var e = e || window.event;
                _this.iDragSize = jc.tools.range(e.clientX - _this.oDrag.offset().left, 100, _this.iSize - Math.max(_this.iLeft, _this.iTop));
                _this.oDrag.css({ width: _this.iDragSize, height: _this.iDragSize });
                _this.setMask();
            }

            document.onmouseup = function (e) {
                document.onmousemove = null;
                document.onmouseup = null;
                if (_this.over) _this.over(_this.getPos());
            }





            if (e.stopPropagation) { //W3C阻止冒泡方法  
                e.stopPropagation();
            } else {
                e.cancelBubble = true; //IE阻止冒泡方法  
            }

            return false;
        });


        this.reset();
    }

});

jc.uiExtend("msg", {
    init: function () {
        var _this = this;

        this.$title_item = this.$element.find(".t_item");
        this.$main_item = this.$element.find(".m_item");


        this.$title_item.each(function (i, obj) {
            $(obj).click(function () {
                _this.$title_item.removeClass("current");
                $(this).addClass("current");

                _this.$main_item.removeClass("current");
                _this.$main_item.eq($(this).index()).addClass("current");

            });


        });

    }

});


/* 侧边栏 */
jc.uiExtend("gotoTop", {
    init: function () {
        var $item = this.$element.find(".l_item");

        $item.hover(function () {
            $(this).addClass("hover");
            $(this).find(".i_tips").show();
        }, function () {
            $(this).removeClass("hover");
            $(this).find(".i_tips").hide();
        });

    }
});

jc.uiExtend("market", {
    init: function () {
        var _this = this;

        this.$title = this.$element.find(".t_title");
        this.$title_child = this.$title.children();

        this.$main = this.$element.find(".t_main");
        this.$main_child = this.$main.children();

        this.$title_child.click(function () {
            _this.$title_child.removeClass("active");
            $(this).addClass("active");
            _this.$main_child.removeClass("active");
            _this.$main_child.eq($(this).index()).addClass("active");
        });






    }

});
