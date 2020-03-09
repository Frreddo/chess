// Custom elements - Names
const CUSTOM_GRID = 'caraibes-grid';
const CUSTOM_AREA = 'caraibes-area';
const CUSTOM_BRIBE = 'caraibes-bribe';

// Custom elements - Class names
const AREA_LAYER = 'area_layer';
const BRIBE_LAYER = 'bribe_layer';


// Custom elements - Attribute names
const BRIBE_VALUE = 'bribe-value';
const BRIBE_SETUP = 'bribe-setup';
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
const BLUE_CSS_NAME = '--blue-player-color';
const GREEN_CSS_NAME = '--green-player-color';
const RED_CSS_NAME = '--red-player-color';
const YELLOW_CSS_NAME = '--yellow-player-color';
const BLUE_CSS_VALUE = '#09f';
const GREEN_CSS_VALUE = '#060';
const RED_CSS_VALUE = '#900';
const YELLOW_CSS_VALUE = '#ff0';

function getColorCSSName(color: string) {
    switch (color) {
        case BLUE_CODE:
            return BLUE_CSS_NAME;
        case YELLOW_CODE:
            return YELLOW_CSS_NAME;
        case RED_CODE:
            return RED_CSS_NAME;
        case GREEN_CODE:
            return GREEN_CSS_NAME;
    }
}

function getColorCSSValue(color: string) {
    switch (color) {
        case BLUE_CODE:
            return BLUE_CSS_VALUE;
        case YELLOW_CODE:
            return YELLOW_CSS_VALUE;
        case RED_CODE:
            return RED_CSS_VALUE;
        case GREEN_CODE:
            return GREEN_CSS_VALUE;
    }
}

// =============================================== Bribe ===============================================================
class Bribe extends HTMLImageElement {
    // Attributes: COLOR, BRIBE_VALUE, AT
    static get observedAttributes() {
        return [AT];
    }
    constructor() {
        super();
    }
    connectedCallback() {
        this.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30'><ellipse cx='44' cy='61' rx='30' ry='23' fill='#fafa55'></svg>";
        this.style.background = getColorCSSValue(this.getAttribute(COLOR));
    }
}

customElements.define(CUSTOM_BRIBE, Bribe, {extends: 'img'});


// =============================================== Area ================================================================
class Area extends HTMLElement {
    // Attributes: AT
    constructor() {
        super();
    }
}

customElements.define(CUSTOM_AREA, Area);

// =============================================== Grid ================================================================
class Grid extends HTMLElement {
    // Attributes: COLOR, BRIBE_SETUP
    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});

        const grid = document.createElement('div');
        shadow.appendChild(grid);

        // Areas
        const areaLayer = document.createElement('div');
        areaLayer.setAttribute('class', AREA_LAYER);
        grid.appendChild(areaLayer);

        for(let bribe_name of BRIBE_LIST){
            let area = document.createElement(CUSTOM_AREA);
            area.setAttribute(AT, bribe_name);
            areaLayer.appendChild(area);
        }

        for(let target_name of TARGET_LIST){
            let area = document.createElement(CUSTOM_AREA);
            area.setAttribute(AT, target_name);
            areaLayer.appendChild(area);
        }

        // Bribes
        const bribeLayer = document.createElement('div');
        bribeLayer.setAttribute('class', BRIBE_LAYER);
        grid.appendChild(bribeLayer);

        for(let bribe_name of BRIBE_LIST) {
            let bribe = document.createElement(CUSTOM_BRIBE);
            bribe.setAttribute(COLOR, this.getAttribute(COLOR));
            bribe.setAttribute(BRIBE_VALUE, bribe_name);
            bribe.setAttribute(AT, bribe_name);
            bribeLayer.appendChild(bribe);
        }

        const style = document.createElement('style');
        style.textContent = `
            :root {
                ${BLUE_CSS_NAME}  : ${BLUE_CSS_VALUE};
                ${GREEN_CSS_NAME} : ${GREEN_CSS_VALUE};
                ${RED_CSS_NAME}   : ${RED_CSS_VALUE};
                ${YELLOW_CSS_NAME}: ${YELLOW_CSS_VALUE};
            }
            ${CUSTOM_GRID} {
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
                background: var(${GREEN_CSS_NAME});
                padding: 10px;
                width: 400px;
                margin: auto;
                display: grid;
                grid-gap: 10px;
                grid-template-columns: repeat(7, 1fr);
                grid-template-rows: repeat(2, 50px);
                grid-template-areas: ${getGridAreas()};
            }
            ${CUSTOM_AREA} {
                width: 20px;
                height: 15px;
                background-color: grey;
            }       
        `;
        for(let area of TARGET_LIST){
            style.textContent += `
            [${AT}="${area}"] {
                grid-area: ${getGridArea(area)};
            }
            `
            style.textContent += `
            ${CUSTOM_AREA}[${AT}="${area}"]:before {
                content: "${area}";
                color: red;
                font-size: 1em;
            }
            `
        }
        for(let area of BRIBE_LIST){
            style.textContent += `
            [${AT}="${area}"] {
                grid-area: ${getGridArea(area)};
            }
            `
            style.textContent += `
            ${CUSTOM_AREA}[${AT}="${area}"]:before {
                content: "${area}";
                color: red;
                font-size: 1em;
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