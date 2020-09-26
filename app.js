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
            image = "",
            imageScale = 1
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
        this.imageScale = imageScale;
    }

    // Draw into grid item.
    fillGridItem = (domElement) => {
        domElement.classList.add(this.species.toLowerCase().replace(" ", "_"));
        [...domElement.getElementsByClassName("grid-species")].forEach(ele => { ele.innerText = this.species });
        [...domElement.getElementsByClassName("grid-weight")].forEach(ele => { ele.innerText = this.weight });
        [...domElement.getElementsByClassName("grid-height")].forEach(ele => { ele.innerText = this.height });
        [...domElement.getElementsByClassName("grid-diet")].forEach(ele => { ele.innerText = this.diet });
        [...domElement.getElementsByClassName("grid-where")].forEach(ele => { ele.innerText = this.where });
        [...domElement.getElementsByClassName("grid-when")].forEach(ele => { ele.innerText = this.when });
        [...domElement.getElementsByClassName("grid-fact")].forEach(ele => { ele.innerText = this.fact });
        [...domElement.getElementsByClassName("grid-image")].forEach(ele => { ele.setAttribute("src", this.image) });
    }

    showCompareDialog(name) {
        // show modal in compare height mode
        {
            [...document.querySelectorAll("*[class^=compare-view]")].forEach(ele => { ele.classList.add("hide") });
            [...document.querySelectorAll(`.compare-view-${name}`)].forEach(ele => { ele.classList.remove("hide") });
            document.querySelector(".compare-modal").classList.remove("hide");
        }
    }

    // Create Dino Compare Method 1
    // NOTE: Weight in JSON file is in lbs, height in inches. 
    compareWeight = (target) => {
        let multiple = 1;
        // if target is heavier then revirse compare.
        if (Math.round(target.weight / this.weight) > 1) {
            target.compareWeight(this);
            return;
        }
        else {
            multiple = Math.round(this.weight / target.weight)
        }
        // put data into dialog
        {
            if (multiple == 1) {
                document.querySelector(".compare-view-weight>p").innerHTML = `${this.species} and ${target.species} are almost same weight `;
            }
            else {
                document.querySelector(".compare-view-weight>p").innerHTML = `${this.species} are ${multiple} times heavier than ${target.species}`;
            }
            document.querySelector(".compare-view-weight .compare-from p").innerText = `${this.species} is ${this.weight} lbs.`;
            document.querySelector(".compare-view-weight .compare-to p").innerText = `${target.species} is ${target.weight} lbs.`;
        }
        // clear images
        {
            [...document.querySelectorAll(".compare-view-weight>.compare-from>img,.compare-view-weight>.compare-to>img")].forEach((img) => img.remove());
        }
        // add image into scale
        {
            // from
            {
                const img = document.createElement("img");
                img.src = this.image;
                img.style.position = "absolute";
                img.style.height = "240px";
                img.style.width = "320px";
                img.style.bottom = "0px";
                img.style.left = "0px";
                document.querySelector(".compare-view-weight .compare-from").appendChild(img);
            }
            //to
            {
                // calc base number
                let baseLineCount = 1;
                {
                    let maxCount = 1;
                    while (maxCount < multiple) {
                        baseLineCount++;
                        maxCount = (baseLineCount + 1) * baseLineCount / 2;
                    }
                    // console.log(baseLineCount);
                }
                // draw items
                {
                    const itemHeight = 320 / baseLineCount;
                    const itemWidth = 320 / baseLineCount;
                    let count = 0;
                    const shiftBottom = baseLineCount > 5 ? 20 : 0;
                    for (let line = 1, lineWidth = baseLineCount; line <= baseLineCount && count < multiple; line++, lineWidth--) {
                        const shift = (320 - itemWidth * lineWidth) / 2;
                        for (let i = 0; i < lineWidth && count < multiple; i++, count++) {
                            const img = document.createElement("img");
                            img.src = target.image;
                            img.style.position = "absolute";
                            img.style.height = itemHeight + "px";
                            img.style.width = itemWidth + "px";
                            img.style.bottom = (shiftBottom + itemHeight * (line - 1) * 0.90) + "px";
                            img.style.left = (shift + i * itemWidth) + "px";
                            document.querySelector(".compare-view-weight .compare-to").appendChild(img);
                        }
                    }
                }
            }
        }
        // show modal in compare height mode
        {
            this.showCompareDialog("weight");
        }
    }

    // Create Dino Compare Method 2
    // NOTE: Weight in JSON file is in lbs, height in inches.
    compareHeight = (target) => {
        let zoom = 1;
        // if target is taller then revirse compare.
        if (Math.round(target.height * 10 / this.height) > 10) {
            target.compareHeight(this);
            return;
        }
        else {
            zoom = Math.round(this.height * 10 / target.height)
        }
        // put data into dialog
        {
            if (zoom == 1) {
                document.querySelector(".compare-view-height>p").innerHTML = `${this.species} are almost same height to ${target.species}`;
            }
            else {
                document.querySelector(".compare-view-height>p").innerHTML = `${this.species} are ${zoom / 10} times taller than ${target.species}`;
            }
            document.querySelector(".compare-view-height .compare-from p").innerText = `${this.species} is ${this.height} inches height.`;
            document.querySelector(".compare-view-height .compare-to p").innerText = `${target.species} is ${target.height} inches height.`;
        }
        // zoom img
        {
            document.querySelector(".compare-view-height .compare-from img").setAttribute("src", this.image);
            document.querySelector(".compare-view-height .compare-to img").setAttribute("src", target.image);
            document.querySelector(".compare-view-height .compare-to img").style.height = (480 * 10 * target.imageScale / zoom) + "px";
            document.querySelector(".compare-view-height .compare-to img").style["margin-bottom"] = ((480 - 480 * 10 * target.imageScale / zoom) / 2) + "px";
            document.querySelector(".compare-view-height .compare-to img").style["margin-left"] = ((640 - 640 * 10 * target.imageScale / zoom) / 2) + "px";
            document.querySelector(".compare-view-height .compare-to img").style.width = (640 * 10 * target.imageScale / zoom) + "px";
        }
        // show modal in compare height mode
        {
            this.showCompareDialog("height");
        }
    }

    // Create Dino Compare Method 3
    // NOTE: Weight in JSON file is in lbs, height in inches.
    compareDiet = (target) => {
        // put data into dialog
        {
            if (target.diet.toLowerCase() == this.diet.toLowerCase())
                document.querySelector(".compare-view-diet p").innerHTML = `${this.species} and ${target.species} are ${this.diet.toLowerCase()}`;
            else {
                document.querySelector(".compare-view-diet p").innerHTML = `${this.species} are ${this.diet.toLowerCase()}, and ${target.species} are ${target.diet.toLowerCase()}`;
            }
        }
        // show modal in compare height mode
        {
            this.showCompareDialog("diet");
        }
    }
}

class DinoMuseum {
    constructor() {
        this.animalList = null;
        this.compareTarget = null;
        // this.compareMethod = ["Weight", "Height", "Diet"][Math.floor(Math.random() * 3)];
        this.compareMethod = ["Weight", "Height", "Diet"][0];
        // preload dino.json
        this.loadDino();
        window.onload = () => {
            // On button click, prepare and display infographic
            document.querySelector("#btn").onclick = () => {
                this.loadDino(() => {
                    //create human object;
                    {
                        const species = document.querySelector("#name").value || "Human";
                        const height = document.querySelector("#inches").value || 155;
                        const weight = document.querySelector("#weight").value || 65;
                        const diet = document.querySelector("#diet").value || "Omnivor";
                        this.compareTarget = this.createHuman({
                            species,
                            height,
                            weight,
                            diet
                        });
                    }
                    //put human into list;
                    this.animalList.splice(4, 0, this.compareTarget);
                    // Generate Tiles for each Dino in Array
                    this.animalList.forEach((animal, index) => {
                        // Add tiles to DOM
                        const gridItem = document.importNode(document.querySelector("#tmpGridItem").content, true).firstElementChild;
                        document.querySelector("#grid").appendChild(gridItem);
                        animal.fillGridItem(gridItem);

                        //trigger compare when gridItem clicked
                        gridItem.onclick = () => {
                            if (animal !== this.compareTarget)
                                animal["compare" + this.compareMethod](this.compareTarget);
                        };
                    });
                    // Remove form from screen
                    document.querySelector("#dino-compare").classList.add("hide");
                    document.querySelector("#grid").classList.remove("hide");

                });
            };
            // sync feet and inches
            {
                document.querySelector("#inches").oninput = () => {
                    document.querySelector("#feet").value = Math.round((+document.querySelector("#inches").value) / 12);
                }
                document.querySelector("#feet").oninput = () => {
                    document.querySelector("#inches").value = Math.round((+document.querySelector("#feet").value) * 12);
                }
            }
            // dismiss compare-modal
            {
                //click outside
                document.querySelector(".compare-modal").onclick = (e) => {
                    if (e.target === document.querySelector(".compare-modal"))
                        document.querySelector(".compare-modal").classList.add("hide");
                };
                //click dismiss
                document.querySelector(".compare-modal .compare-modal-dissmiss").onclick = () => document.querySelector(".compare-modal").classList.add("hide");
            }
        };
    }
    // Create Dino Objects
    loadDino = (() => {
        //use IIFE to create private property and make sure only one ajax request is running even multitriggered.
        let nextQueue = [];
        let errorQueue = [];
        const triggerNext = () => {
            // console.log(`load dino.json success.`);
            for (const next of nextQueue) {
                if (next && typeof (next) === "function")
                    next();
            }
            nextQueue = [];
        };
        const triggerError = (status, exc) => {
            // console.log(`load dino.json failed(${status}${exc ? ":" + (typeof exc === "object" ? JSON.stringify(exc) : exc) : ""}).`);
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
                            // console.log(`xhttp.readyState = ${xhttp.readyState} && xhttp.status = ${xhttp.status}`);
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
                                        item.imageScale = item.scale;
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



