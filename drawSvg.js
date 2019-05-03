var svgRoot = document.getElementById("svgRoot");
var svgNamespace = "http://www.w3.org/2000/svg";
// svg要素を生成するときは、下のようにNamespaceを指定して、svg要素であることを明確化させること。
// さもないと、html要素が指定されたと解釈されてしまう。
var group = document.createElementNS(svgNamespace, "g");
group.setAttribute("transform", "matrix(0.9, 0.1, -0.1, 1.1, 50, 30)");
var path = document.createElementNS(svgNamespace, "path");
path.setAttribute("d", "M70 60 C 70 80, 110 80, 110 60");
path.setAttribute("stroke", "black");
path.setAttribute("fill", "red");
svgRoot.appendChild(group);
group.appendChild(path);

var points = [new BezierNode(100, 100, 1000, 1000, 100, 150), new BezierNode(300, 300, 250, 300, 350, 300), new BezierNode(500, 100, 500, 150, 1000, 1000)];
var points2 = [new BezierNode(100, 300, 1000, 1000, 300, 250), new BezierNode(300, 200, 250, 200, 350, 200), new BezierNode(500, 300, 500, 250, 1000, 1000)];
var bg = new BezierGeometry(points, true);
var be = new BezierTweenElement();
be.keyFrameDictionary[0] = new BezierGeometry(points, true);
be.keyFrameDictionary[5000] = new BezierGeometry(points2, true);

var path2 = document.createElementNS(svgNamespace, "path");
path2.setAttribute("stroke", "black");
path2.setAttribute("fill", "blue");
path2.setAttribute("d", bg.getdText());
group.appendChild(path2);

function updatePath(current) {
    var str = "M10,10 L10,190 L" + current/50 + "," + current/50 + " z"
    path.setAttribute("d", str);
    be.setCurrentGeometry(current);
    path2.setAttribute("d", be.currentGeometry.getdText());
}
