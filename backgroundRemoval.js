// backgroundRemoval.js

document.getElementById('toggleBackgroundBtn').addEventListener('click', function () {
    // Check the current source of the template image and toggle accordingly
    if (template.src.match('wifgattemplate_noBG.png')) {
        template.src = 'wifgattemplate.png'; // Switch back to the original template with background
    } else {
        template.src = 'wifgattemplate_noBG.png'; // Switch to the template without background
    }

    // Since the template image is changed, redraw the canvas to reflect the new template
    draw();
});
