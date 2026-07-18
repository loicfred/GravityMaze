
// Import any other script files here, e.g.:
// import * as myModule from "./mymodule.js";

runOnStartup(async runtime => {
    if (typeof DeviceMotionEvent !== "undefined" &&
        typeof DeviceMotionEvent.requestPermission === "function") {
        await DeviceMotionEvent.requestPermission();
    }

    window.addEventListener("devicemotion", (e) => {
        runtime.globalVars.AccelX = e.accelerationIncludingGravity.x || 0;
        runtime.globalVars.AccelY = e.accelerationIncludingGravity.y || 0;
        runtime.globalVars.AccelZ = e.accelerationIncludingGravity.z || 0;
    });
});

async function OnBeforeProjectStart(runtime)
{
	// Code to run just before 'On start of layout' on
	// the first layout. Loading has finished and initial
	// instances are created and available to use here.
	
	runtime.addEventListener("tick", () => Tick(runtime));
}

function Tick(runtime)
{
	// Code to run every tick
}
