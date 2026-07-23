let tokenClient;
let g_runtime;

runOnStartup(async runtime => {
	    if (typeof DeviceMotionEvent !== "undefined" && typeof DeviceMotionEvent.requestPermission === "function") {
		    await DeviceMotionEvent.requestPermission();
	    }

	window.addEventListener("devicemotion", (e) => {
        if (runtime.globalVars.MotionSupported) {
		    runtime.globalVars.AccelX = e.accelerationIncludingGravity.x || 0;
		    runtime.globalVars.AccelY = e.accelerationIncludingGravity.y || 0;
		    runtime.globalVars.AccelZ = e.accelerationIncludingGravity.z || 0;
        }
	})
    

    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.onload = () => {
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: "615523125199-40l8ul9u7githbt2qmsj20h1n6l5km6d.apps.googleusercontent.com",
            scope: "openid profile email",
            callback: async (tokenResponse) => {
                // Fetch the user's profile with the access token
                const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                    headers: { Authorization: "Bearer " + tokenResponse.access_token }
                });
                const profile = await res.json();
                runtime.globalVars.Username = profile.name;
                runtime.callFunction("OnLogin");
            }
        });
    };
    document.head.appendChild(s);

    const fb = document.createElement("script");
    fb.src = "https://connect.facebook.net/en_US/sdk.js";
    fb.onload = () => {
        FB.init({
            appId: "1678608540096705",
            version: "v21.0",
            cookie: true
        });
    };
    document.head.appendChild(fb);
});



// Discord
globalThis.doDiscordLogin = () => {
    const clientId = "1522256684582572295";
    const redirect = location.origin + "/";
    const url = "https://discord.com/oauth2/authorize?client_id=" + clientId
        + "&response_type=token&scope=identify"
        + "&redirect_uri=" + encodeURIComponent(redirect);
    const popup = window.open(url, "discordLogin", "width=500,height=700");

    const timer = setInterval(async () => {
        if (!popup || popup.closed) { clearInterval(timer); return; }
        let hash = "";
        try { hash = popup.location.hash; } catch (e) { return; } // still on discord.com, keep waiting
        if (hash.includes("access_token")) {
            clearInterval(timer);
            const token = new URLSearchParams(hash.substring(1)).get("access_token");
            popup.close();
            const res = await fetch("https://discord.com/api/users/@me", {
                headers: { Authorization: "Bearer " + token }
            });
            const profile = await res.json();
            g_runtime.globalVars.Username = profile.global_name || profile.username;
            g_runtime.callFunction("OnLogin");
        }
    }, 500);
};

// Google
globalThis.doGoogleLogin = () => tokenClient.requestAccessToken();

// Facebook
globalThis.doFacebookLogin = () => {
    FB.login((response) => {
        if (response.authResponse) {
            // Ask Graph API for the profile
            FB.api("/me", { fields: "name,email" }, (profile) => {
                g_runtime.globalVars.Username = profile.name;
                g_runtime.callFunction("OnLogin");
            });
        }
    }, { scope: "public_profile" });
};

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
