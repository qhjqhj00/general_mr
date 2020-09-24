var nf = nf || {};
nf.math = {};
nf.util = {};

nf.list = function(type, cnt) {
    //TODO
}

nf.it = function() {}
nf.what = function() {}

nf.math.expression = function(s) {
    return s.split("").join('*');
}

nf.math.to_number = function(s) {
    return Number(s);
}

nf.datetime = function(s) {
    return s;
}

nf.ymd = function(y, m, d) {
    var res={};
    if (m == 0){
        var c=new Date();
        m = c.getMonth() + 1;
    }
    if (y == 0){
        var c=new Date();
        y = c.getFullYear();
    }
    res['year'] = y;
    res['month'] = m;
    res['day'] = d;
    return res;
}

nf.datetime.year = function(d, b) {
    if (d == 0){
        var c = new Date();
        d = c.getFullYear();
    }
    return d/1 + b;
}

nf.datetime.month = function(d, b) {
    return d/1 - b;
}

nf.datetime.day = function(d, b) {
    if (d == 0){
        var c = new Date();
        d = c.getDate();
    }
    return d/1 + b;
}

nf.datetime.hour = function(s) {
    return {"hour": s};
}

nf.datetime.minute = function(s) {
    return {"minute": s};
}

nf.datetime.second = function(s) {
    return {"second": s};
}

nf.math.decimal = function(s) {
    s = s.toString();
    var n = Number(s);
    return n / Math.pow(10, s.length);
}

nf.math.sum = function(x, y) {
    return x + y;
}

nf.math.sub = function(x, y) {
    return x - y;
}

nf.math.mul = function(x, y) {
    return x * y;
}

nf.math.div = function(x, y) {
    return x / y;
}

nf.math.neg = function(x) {
    return -x;
}

nf.math.pow = function(x, y) {
    return Math.pow(x, y);
}

nf.util.concat = function(x, y) {
    return x.toString() + y.toString();
}

