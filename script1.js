var current = 0;
var running = false;
var preDrag_Running = false;
// step()が最後に呼ばれた時刻
var lastCalledTime = null;
function step(timestamp) {
    if (!running || current >= 5000) { return; }
    var diff = timestamp - lastCalledTime;
    if (diff > 10) {
        current = Math.min(5000, current + diff);
        if (textblock_current != undefined) {
            textblock_current.value = current;
            rangeControl.value = current;
        }
        updatePath(current);
        lastCalledTime = timestamp;
    }
    window.requestAnimationFrame(step);
}
function runAnimation() {
    running = true;
    lastCalledTime = performance.now();
    window.requestAnimationFrame(step);
}
function button_click(playButton) {
    if (!running) {
        runAnimation();
        playButton.value = "Pause";
    }
    else {
        running = false;
        playButton.value = "Play";
    }
}
function slider_changed(sliderValue) {
    current = parseInt(sliderValue);
    textblock_current.value = current;
    updatePath(current);
}
function slider_onMouseDown() {
    preDrag_Running = running;
    running = false;
}
function slider_onMouseUp() {
    if (preDrag_Running) {
        runAnimation();
    }
}
onload = function () {
    var textblock_current = document.getElementById("textblock_current");
    var rangeControl = document.getElementById("rangeControl");
}