class Dino {

    // Create Dino Constructor
    constructor() {
        this.DinoList = null;
        this.Human = null;
        this.loadDino();
    }

    // Create Dino Objects
    loadDino = (next, error) => {
        let triggerNext = () => {
            console.log(`load dino.json success.`);
            if (next && typeof (next) === "function")
                next();
        };
        let triggerError = (status, exc) => {
            console.log(`load dino.json failed(${status}${exc ? ":" + JSON.stringify(exc) : ""}).`);
            if (error && typeof (error) === "function")
                error({
                    status: status
                    , exception: exc
                });
        };
        if (this.DinoList) {
            triggerNext();
        } else {
            try {
                let xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = () => {
                    console.log(`xhttp.readyState = ${xhttp.readyState} && xhttp.status = ${xhttp.status}`);
                    if (xhttp.readyState == 4 && xhttp.status == 200) {
                        try {
                            this.DinoList = JSON.parse(xhttp.responseText);
                            // console.log(JSON.stringify(this.DinoList));
                            triggerNext();
                        } catch (exc) {
                            triggerError("parse exception", exc);
                        }
                    }
                };
                xhttp.open("GET", "dino.json", true);
                xhttp.send();
            } catch (exc) {
                triggerError("catch exception", exc);
            }
        }
    }

    // Create Human Object

    // Use IIFE to get human data from form


    // Create Dino Compare Method 1
    // NOTE: Weight in JSON file is in lbs, height in inches. 


    // Create Dino Compare Method 2
    // NOTE: Weight in JSON file is in lbs, height in inches.


    // Create Dino Compare Method 3
    // NOTE: Weight in JSON file is in lbs, height in inches.


    // Generate Tiles for each Dino in Array

    // Add tiles to DOM

    // Remove form from screen

}
// On button click, prepare and display infographic
let controller = new Dino();
// console.log(controller.loadDino());