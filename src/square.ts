// Custom elements - Names
const CUSTOM_GRID = 'caraibes-grid';
const CUSTOM_AREA = 'caraibes-area';
const CUSTOM_BRIBE = 'caraibes-bribe';

// Custom elements - Class names
const GRID = 'grid';
const AREA_LAYER = 'area_layer';
const AREA = 'area';
const BRIBE_LAYER = 'bribe_layer';
const BRIBE = 'bribe';


// Custom elements - Attribute names
const BRIBE_VALUE = 'bribe-value';
const AT = 'at';
const COLOR = 'color';

// Areas
const BRIBE_LIST = ["-1", "0", "1", "2", "3", "4", "5"];
const TARGET_LIST = ["A", "B", "C", "D", "E", "F", "J"];
function getGridArea(area: string) {return 'A_' + area;}

function getGridAreas(): string {
    return "\"" + BRIBE_LIST.map(getGridArea).join(" ") + "\" \"" + TARGET_LIST.map(getGridArea).join(" ") + "\"";
}

// Colors
const BLUE_CODE = 'BL';
const GREEN_CODE = 'GR';
const RED_CODE = 'RE';
const YELLOW_CODE = 'YE';
const BLUE_HTML = 'blue';
const GREEN_HTML = 'green';
const RED_HTML = 'red';
const YELLOW_HTML = 'yellow';

function getHTMLColor(color: string) {
    switch (color) {
        case BLUE_CODE:
            return BLUE_HTML;
        case YELLOW_CODE:
            return YELLOW_HTML;
        case RED_CODE:
            return RED_HTML;
        case GREEN_CODE:
            return GREEN_HTML;
    }
}

// =============================================== Bribe ===============================================================
class Bribe extends HTMLImageElement {
    // Attributes: AT, BRIBE_VALUE, COLOR
    static get observedAttributes() {
        return [AT];
    }
    constructor() {
        super();
        this.setAttribute('class', BRIBE);
    }
    connectedCallback() {
        this.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30'><ellipse cx='44' cy='61' rx='30' ry='23' fill='#fafa55'></svg>";
        this.style.background = this.getAttribute(COLOR);
    }
}

customElements.define(CUSTOM_BRIBE, Bribe, {extends: 'img'});


// =============================================== Area ================================================================
class Area extends HTMLElement {
    // Attributes: AT
    constructor() {
        super();
        this.setAttribute('class', AREA);
    }
}

customElements.define(CUSTOM_AREA, Area);

// =============================================== Grid ================================================================
class Grid extends HTMLElement {
    // Attributes:
    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});

        const grid = document.createElement('div');
        grid.setAttribute('class', GRID);
        shadow.appendChild(grid);

        const areaLayer = document.createElement('div');
        areaLayer.setAttribute('class', AREA_LAYER);
        grid.appendChild(areaLayer);

        for(let bribe_name of BRIBE_LIST){
            let area = document.createElement(CUSTOM_AREA);
            area.setAttribute(COLOR, this.getAttribute(COLOR));
            area.setAttribute(AT, bribe_name);
            area.setAttribute(BRIBE_VALUE, bribe_name);
            areaLayer.appendChild(area);
        }

        const bribeLayer = document.createElement('div');
        bribeLayer.setAttribute('class', BRIBE_LAYER);
        grid.appendChild(bribeLayer);

        for(let bribe_name of BRIBE_LIST) {
            let bribe = document.createElement(CUSTOM_BRIBE);
            bribe.setAttribute(AT, bribe_name);
            bribe.setAttribute(COLOR, getHTMLColor(this.getAttribute('color')));
            bribeLayer.appendChild(bribe);
        }

        const style = document.createElement('style');
        style.textContent = `
            .${GRID} {
            }
            .${AREA_LAYER} {
                background: silver;
                padding: 10px;
                width: 400px;
                margin: auto;
                display: grid;
                grid-gap: 10px;
                grid-template-columns: repeat(7, 1fr);
                grid-template-rows: repeat(2, 50px);
                grid-template-areas: ${getGridAreas()};
            }
            .${BRIBE_LAYER} {
                background: silver;
                padding: 10px;
                width: 400px;
                margin: auto;
                display: grid;
                grid-gap: 10px;
                grid-template-columns: repeat(7, 1fr);
                grid-template-rows: repeat(2, 50px);
                grid-template-areas: ${getGridAreas()};
            }
            .${AREA} {
                width: 20px;
                height: 15px;
                background-color: 'grey';
                grid-area: ${this.getAttribute(AT)};
            }
            .${AREA}:before {
                content: ${this.getAttribute(AT)};
                color: red;
                font-size: 1em;
            }           
        `;
        for(let area in TARGET_LIST){
            style.textContent += `
            [${AT}="${area}"] {
                grid-area: ${getGridArea(area)};
            }
            `
        }

        shadow.appendChild(style);
    }
}

customElements.define(CUSTOM_GRID, Grid);

// =============================================== Square ==============================================================
class Square extends HTMLElement {
    // Specify observed attributes so that
    // attributeChangedCallback will work
    static get observedAttributes() {
        return ['c', 'l'];
    }

    constructor() {
        // Always call super first in constructor
        super();

        const shadow = this.attachShadow({mode: 'open'});

        const div = document.createElement('div');
        const style = document.createElement('style');
        shadow.appendChild(style);
        shadow.appendChild(div);
    }

    connectedCallback() {
        console.log('Custom square element added to page.');
        updateStyle(this);
    }

    // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    disconnectedCallback() {
        console.log('Custom square element removed from page.');
    }

    // noinspection JSMethodCanBeStatic
    adoptedCallback() {
        console.log('Custom square element moved to new page.');
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        console.log('Custom square element attributes changed.' + name + ' from ' + oldValue + ' to ' + newValue);
        updateStyle(this);
    }
}

customElements.define('custom-square', Square);

function updateStyle(elem: Square) {
    const shadow = elem.shadowRoot;
    shadow.querySelector('style').textContent = `
    div {
      width: ${elem.getAttribute('l')}px;
      height: ${elem.getAttribute('l')}px;
      background-color: ${elem.getAttribute('c')};
    }
  `;
}

const add = <HTMLButtonElement>document.querySelector('.add');
const update = <HTMLButtonElement>document.querySelector('.update');
const remove = <HTMLButtonElement>document.querySelector('.remove');
let square: Square;

update.disabled = true;
remove.disabled = true;

function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

add.onclick = function() {
    // Create a custom square element
    square = <Square>document.createElement('custom-square');
    square.setAttribute('l', '100');
    square.setAttribute('c', 'red');
    document.body.appendChild(square);

    update.disabled = false;
    remove.disabled = false;
    add.disabled = true;
};

update.onclick = function() {
    // Randomly update square's attributes
    square.setAttribute('l', random(50, 200).toString());
    square.setAttribute('c', `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`);
};

remove.onclick = function() {
    // Remove the square
    document.body.removeChild(square);

    update.disabled = true;
    remove.disabled = true;
    add.disabled = false;
};