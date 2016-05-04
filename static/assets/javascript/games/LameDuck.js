var fish = document.getElementById("fish-images").children;
var wrapper_top;
var max_score = 25;

setInterval(function () {
    var elems = document.getElementsByClassName("fish");
    var duck = $(document.getElementById("duck"));
    var e1, e2;
    for (var i = 0; i < elems.length - 1; i++) {    // check overlapping fish
        e1 = $(elems[i]);
        for (var a = i + 1; a < elems.length; a++) {
            e2 = $(elems[a])
            if (elemOverlap(e1, e2))
                if (can_eat(e1, e2))
                    eat_elem(e1, e2);
                else if (can_eat(e2, e1))
                    eat_elem(e2, e1);
        }
    }
    for (var i = 0; i < elems.length; i++) {    // check duck overlaps
        e1 = $(elems[i]);
        if (elemOverlap(e1, duck))
            if (can_eat(e1, duck))
                eat_elem(e1, duck);
            else if (can_eat(duck, e1))
                eat_elem(duck, e1);
    }
    resize_elem(duck, get_elem_width(duck) * 0.999, duck.data('ratio'));
}, 100);

var duck = $('#duck').data('ratio', 1).data('count', 0);
var count = 0;

function rotate_duck(rad) {
    duck.css({transform: 'rotate(' + rad + 'rad)'});
}

function resize_elem_abs(elem, width, height)    {
    elem.css({width: width + 'px', height: height + 'px', 'z-index': parseInt((width + height) / 2, 10) + 50});
}

function get_elem_width(elem) {
    if (elem.outerWidth() >= elem.outerHeight())
        return elem.outerWidth();
    return elem.outerHeight();
}

function resize_elem(elem, width, ratio) {
    if (ratio >= 1)
        resize_elem_abs(elem, width, width / ratio);
    else resize_elem_abs(elem, width * ratio, width);
    if (elem.attr('id') === 'duck') {
        if (duck.outerWidth() > max_score) {
            max_score = duck.outerWidth();
            $("#high-score").text(max_score);
        }
        $('#score').text(duck.outerWidth());
    }
}

function calc_dist(dx, dy) {
    xd2 = Math.pow(dx, 2);
    yd2 = Math.pow(dy, 2);
    return Math.sqrt(xd2 + yd2);
}

function get_duck_speed() {
    return duck.outerWidth() / 10.0;
}

function get_fish_speed(fish) {
    return (fish.outerWidth() + fish.outerHeight()) / 2.0;
}

function eat_elem(hunter, prey)    {
    resize_elem(hunter, Math.sqrt(Math.pow(get_elem_width(hunter), 2) + Math.pow(get_elem_width(prey), 2)), hunter.data('ratio'));
    if (prey.attr('id') === "duck")    { // new game functionality
        prey.hide();
        alert("Game Over!!!, Your Score: " + max_score + "!!!");
        $('.fish').remove();
        resize_elem(duck, 25, duck.data('ratio'));
        prey.show();
        max_score = 25;
        $("#high-score").text(max_score);
        $('#score').text(duck.outerWidth());
    }
    else prey.remove();
}

function can_eat(hunter, prey)    {
    return hunter.outerWidth() >= prey.outerWidth() * 1.1 && hunter.outerHeight() >= prey.outerHeight() * 1.1;
}

function elemOverlap(elema, elemb){

    var offseta = elema.offset();
    var offsetb = elemb.offset();

    var al = offseta.left;
    var ar = al + elema.outerWidth();
    var bl = offsetb.left;
    var br = bl + elemb.outerWidth();

    var at = offseta.top;
    var ab = at + elema.outerHeight();
    var bt = offsetb.top;
    var bb = bt + elemb.outerHeight();

    if(bl>ar || br<al){return false;}//overlap not possible
    if(bt>ab || bb<at){return false;}//overlap not possible

    return true;
}

function move_elem(elem, x, y, distance, speed, callback)    {
    elem.clearQueue();
    elem.animate(
        {left: x + 'px', top: y + 'px'},
        {duration: distance * speed, easing: "linear", complete: function() {
            elem.css({left: x + 'px', top: y + 'px'});
            if (callback)
                callback(elem);
        },
        // step: function() {
            // elem.data('count', elem.data('count') + 1);
            // if (elem.data('count') % 10 === 0)
            //     if (elem == duck)
            //         resize_elem(elem, get_elem_width(elem) * 0.999, elem.data('ratio'));
            //     else resize_elem(elem, get_elem_width(elem) * 0.9999, elem.data('ratio'));
        // }
    });
}

function move_duck(x, y)    {
    x -= duck.outerWidth() / 2.0;
    y -= duck.outerHeight() / 2.0;
    var offset = duck.offset();
    var dx = x - offset.left;
    var dy = y - offset.top;
    rotate_duck(Math.atan2(dy, dx));
    count++;
    if (count % 5 === 0)
        move_elem(duck, x, y, calc_dist(dx, dy), get_duck_speed());
}

function move_fish(fish) {
    var dx = -3 * fish.outerWidth() + 6 * fish.outerWidth() * Math.random();
    var dy = -3 * fish.outerHeight() + 6 * fish.outerHeight() * Math.random();
    var offset = fish.offset();
    var x = parseInt(fish.css('left')) + dx;
    var y = parseInt(fish.css('top')) + dy;
    if (x < 0)
        x = 0;
    else if (x > $("#content-wrapper").outerWidth() - fish.outerWidth())
        x = $("#content-wrapper").outerWidth() - fish.outerWidth();

    if (y < wrapper_top)
        y = wrapper_top;
    else if (y > $("#content-wrapper").outerHeight() - fish.outerHeight())
        y = $("#content-wrapper").outerHeight() - fish.outerHeight() - Math.abs(dy);
    move_elem(fish, x, y, calc_dist(dx, dy), get_fish_speed(fish), move_fish);
}

function add_fish() {
    var old_fish = $(fish[Math.random() * fish.length | 0]);
    var new_fish = old_fish.clone();
    var ratio = old_fish.width() * 1.0 / old_fish.height();
    if (old_fish.height() === 0) {
        setTimeout(add_fish, 1000 + Math.random() * 3000);
        return;
    }
    new_fish.data('ratio', ratio).data('count', 0);
    resize_elem(new_fish, duck.outerWidth() / 4.0 + duck.outerWidth() * Math.random(), ratio);
    new_fish.css({left: Math.random() * ($("#content-wrapper").outerWidth() - new_fish.outerWidth()), top: Math.random() * ($("#content-wrapper").outerHeight() - new_fish.outerHeight())});
    var conflict = false;
    new_fish.siblings().each(function() {
        if (conflict)
            return;
        if (elemOverlap(new_fish, $(this)))
            conflict = true;
    });
    if (conflict)
        new_fish.remove();
    else {
        new_fish.appendTo('#content-wrapper').addClass('fish');
        move_fish(new_fish);
    }
    setTimeout(add_fish, 1000 + Math.random() * 3000);
}

function page_ready() {
    add_fish();

    wrapper_top = $("#content-wrapper").position().top;

    $(window).mousemove(function(evt) { move_duck(evt.pageX, evt.pageY - wrapper_top);});
    $(window).mousemove();
};