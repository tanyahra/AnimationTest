// class構文を使わずに、javascriptオリジナルの機能でPointクラスを定義する。
// クラスのプロパティは、コンストラクターに定義する。
function Point(x, y) {
    this.x = x;
    this.y = y;
}
// クラスメソッドは、prototypeに定義する。
Point.prototype.scale = function (coefficient) {
    this.x *= coefficient;
    this.y *= coefficient;
}
Point.prototype.showLog = function () {
    console.log("(" + this.x + ", " + this.y + ")")
}
// Pointクラスのstaticメソッドのようなもの
Point.interiorDivide = function (point1, point2, ratio) {
    var invRatio = 1 - ratio;
    var x = ratio * point1.x  + invRatio * point2.x;
    var y = ratio * point1.y + invRatio * point2.y;
    return new Point(x, y);
}

// class構文を使って、BezierNodeを定義する。
class BezierNode{
    constructor(nodeX, nodeY, preCpX, preCpY, postCpX, postCpY){
        this.node = new Point(nodeX, nodeY);
        this.preCp = new Point(preCpX, preCpY);
        this.postCp = new Point(postCpX, postCpY);
    }

    clone(){
        return new BezierNode(this.node.x, this.node.y, this.preCp.x, this.preCp.y, this.postCp.x, this.postCp.y);
    }
}
BezierNode.GetInternalDivide = function(bn1, bn2, ratio){
    var compRatio = 1.0 - ratio;
    return new BezierNode(
        bn1.node.x * compRatio + bn2.node.x * ratio,
        bn1.node.y * compRatio + bn2.node.y * ratio,
        bn1.preCp.x * compRatio + bn2.preCp.x * ratio,
        bn1.preCp.y * compRatio + bn2.preCp.y * ratio,
        bn1.postCp.x * compRatio + bn2.postCp.x * ratio,
        bn1.postCp.y * compRatio + bn2.postCp.y * ratio,
    )
}

class BezierGeometry{
    constructor(bezierNodes, closed){
        this.BezierNodes = bezierNodes;
        this.Closed = closed;
    }

    getdText(){
        var result = "M" + this.BezierNodes[0].node.x + " " + this.BezierNodes[0].node.y;
        for(var i = 1; i < this.BezierNodes.length; i++){
            result += " C " + this.BezierNodes[i - 1].postCp.x + " " + this.BezierNodes[i - 1].postCp.y;
            result += ", " + this.BezierNodes[i].preCp.x + " " + this.BezierNodes[i].preCp.y;
            result += ", " + this.BezierNodes[i].node.x + " " + this.BezierNodes[i].node.y;
        }
        return result;
    }

    copyFrom(src){
        if(this.BezierNodes == undefined || this.BezierNodes.length != src.BezierNodes.length){
            this.BezierNodes = Array(src.BezierNodes.length);
        }
        for(let i in src.BezierNodes){
            this.BezierNodes[i] = src.BezierNodes[i].clone();
        }
        this.closed = src.closed;
    }

    merge(startGeom, endGeom, ratio){
        if(startGeom.BezierNodes.length != endGeom.BezierNodes.length) {
            console.log("fail merge");
            return;
        }

        if(this.BezierNodes == undefined || this.BezierNodes.length != startGeom.BezierNodes.length){
            this.BezierNodes = Array(startGeom.BezierNodes.length);
        }
        for(let i in startGeom.BezierNodes){
            this.BezierNodes[i] = BezierNode.GetInternalDivide(startGeom.BezierNodes[i], endGeom.BezierNodes[i], ratio);
        }
    }
}

class BezierTweenElement{
    constructor(){
        // keyがdouble, ValueがBezierGeometryな連想配列。
        this.keyFrameDictionary = {};
        this.currentGeometry = new BezierGeometry(null, false);
        this.deathTime = 100*100;
        this.canDraw = false;
    }

    setCurrentGeometry(requestTime){
        var preKey = Number.MIN_VALUE;
        var postKey = Number.MAX_VALUE;
        for(var key in this.keyFrameDictionary){
            if(key <= requestTime){
                preKey = key;
            }else{ // preKeyがすでに見つかっている。postKeyだけ更新。
                postKey = key;
                break;
            }
        }

        if (preKey == Number.MIN_VALUE || this.deathTime <= requestTime) {//まだ生まれてないか、死んでいる。
           this.canDraw = false;
        } else if(postKey == Number.MAX_VALUE || preKey == requestTime){
            this.currentGeometry.copyFrom(this.keyFrameDictionary[preKey]);
            this.canDraw = true;
        }else{
            var ratio = (requestTime - preKey) / (postKey - preKey);
            this.currentGeometry.merge(this.keyFrameDictionary[preKey], this.keyFrameDictionary[postKey], ratio);
            this.canDraw = true;
        }
    }
}
