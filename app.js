class Animal {
    // Create Dino Constructor
    constructor(
        {
            species = "",
            weight = 0,
            height = 0,
            diet = "",
            where = "",
            when = "",
            fact = "",
            image = ""
        } = {}
    ) {
        this.species = species;
        this.weight = parseFloat(weight);
        this.height = parseFloat(height);
        this.diet = diet;
        this.where = where;
        this.when = when;
        this.fact = fact;
        this.image = image || `images/${lower(species)}`;
    }

    // Draw into grid item.
    fillGridItem = (domElement) => {
        domElement.classList.add(this.species.toLowerCase().replace(" ", "_"));
        [...domElement.getElementsByClassName("grid-title")].forEach(ele => { ele.innerText = this.species });
        [...domElement.getElementsByClassName("grid-image")].forEach(ele => { ele.setAttribute("src", this.image) });
        [...domElement.getElementsByClassName("grid-fact")].forEach(ele => { ele.innerText = this.fact });
    }

    // Create Dino Compare Method 1
    // NOTE: Weight in JSON file is in lbs, height in inches. 
    compareWeight = (target) => {
        alert(`compareWeight ${this.species} vs ${target.species}`);
    }

    // Create Dino Compare Method 2
    // NOTE: Weight in JSON file is in lbs, height in inches.
    compareHeight = (target) => {
        alert(`compareHeight ${this.species} vs ${target.species}`);
    }

    // Create Dino Compare Method 3
    // NOTE: Weight in JSON file is in lbs, height in inches.
    compareDiet = (target) => {
        alert(`compareDiet ${this.species} vs ${target.species}`);
    }
}

class DinoMuseum {
    constructor() {
        this.animalList = null;
        this.compareTarget = null;
        this.compareMethod = ["Weight", "Height", "Diet"][Math.floor(Math.random() * 3)];
        // preload dino.json
        this.loadDino();
        // On button click, prepare and display infographic
        window.onload = () => {
            document.getElementById("btn").onclick = () => {
                this.loadDino(() => {
                    //create human object;
                    this.compareTarget = this.createHuman();
                    //put human into list;
                    this.animalList.splice(4, 0, this.compareTarget);
                    // Generate Tiles for each Dino in Array
                    this.animalList.forEach((animal, index) => {
                        // Add tiles to DOM
                        // const gridItem = document.getElementById("tmpGridItem").content.cloneNode(true);
                        const gridItem = document.importNode(document.getElementById("tmpGridItem").content, true).firstElementChild;
                        document.getElementById("grid").appendChild(gridItem);
                        animal.fillGridItem(gridItem);

                        //trigger compare when gridItem clicked
                        gridItem.onclick = () => {
                            animal["compare" + this.compareMethod](this.compareTarget);
                        };
                    });
                    // Remove form from screen
                    document.getElementById("dino-compare").classList.add("hide");
                    document.getElementById("grid").classList.remove("hide");

                });
            };
        };
    }
    // Create Dino Objects
    loadDino = (() => {
        //use IIFE to create private property and make sure only one ajax request is running even multitriggered.
        let nextQueue = [];
        let errorQueue = [];
        const triggerNext = () => {
            console.log(`load dino.json success.`);
            for (const next of nextQueue) {
                if (next && typeof (next) === "function")
                    next();
            }
            nextQueue = [];
        };
        const triggerError = (status, exc) => {
            console.log(`load dino.json failed(${status}${exc ? ":" + (typeof exc === "object" ? JSON.stringify(exc) : exc) : ""}).`);
            for (const error of errorQueue) {
                if (error && typeof (error) === "function")
                    error({
                        status: status
                        , exception: exc
                    });
            }
            errorQueue = [];
        };
        let loading = false;
        return (next, error) => {
            nextQueue.push(next);
            errorQueue.push(error);
            if (this.animalList) {//already downloaded.
                triggerNext();
            } else {//downloading or haven't start
                if (!loading) {
                    loading = true;
                    try {
                        let xhttp = new XMLHttpRequest();
                        xhttp.onreadystatechange = () => {
                            console.log(`xhttp.readyState = ${xhttp.readyState} && xhttp.status = ${xhttp.status}`);
                            if (xhttp.readyState == 4 && xhttp.status == 200) {
                                try {
                                    // parse responseText to objects
                                    let rsp = JSON.parse(xhttp.responseText).Dinos;
                                    // console.log(JSON.stringify(rsp));

                                    // fill into animalList
                                    this.animalList = [];
                                    for (let index = 0; index < 9; index++) {
                                        //pick one dinosaur randomly
                                        let item = rsp.splice(Math.floor(Math.random() * rsp.length), 1)[0];
                                        item.image = `images/${(item.species || "").toLowerCase()}.png`;
                                        this.animalList.push(new Animal(item));
                                    }
                                    // console.log(JSON.stringify(this.animalList));
                                    triggerNext();
                                } catch (exc) {
                                    triggerError("parse exception", exc);
                                }
                                finally {
                                    loading = false;
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
        };
    })();

    // Create Human Object
    // Use IIFE to get human data from form
    createHuman = (() => (
        ({
            species = "Human",
            weight = 155,
            height = 65,
            diet = "Omnivor",
            where = "World Wide",
            when = "100,000 BC",
            fact = "Can make tools.",
            image = "images/human.png"
        } = {}) => {
            return new Animal({
                species,
                weight,
                height,
                diet,
                where,
                when,
                fact,
                image
            });
        }
    ))();
};
//startup
new DinoMuseum();



