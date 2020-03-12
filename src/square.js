// Custom elements - Names
const CUSTOM_GRID = 'caraibes-grid';
const CUSTOM_AREA = 'caraibes-area';
const CUSTOM_BRIBE = 'caraibes-bribe';
// Custom elements - Class names
const AREA_LAYER = 'area_layer';
const BRIBE = 'bribe';
// Custom elements - Attribute names
const BRIBE_VALUE = 'bribe-value';
const BRIBE_SETUP = 'bribe-setup';
const AT = 'at';
const BRIBE_COLOR = 'bribe-color';
// Areas
const BRIBE_LIST = ["-1", "0", "1", "2", "3", "4", "5"];
const TARGET_LIST = ["A", "B", "C", "D", "E", "F", "J"];
function getGridArea(area) { return 'A_' + area; }
function getGridAreas() {
    return "\"" + BRIBE_LIST.map(getGridArea).join(" ") + "\" \"" + TARGET_LIST.map(getGridArea).join(" ") + "\"";
}
// Drag and drop
const gridDnDType = "text/grid-bribe-value";
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
function getColorCSSName(color) {
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
function getColorCSSValue(color) {
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
class Bribe extends HTMLObjectElement {
    // Attributes: COLOR, BRIBE_VALUE, AT
    static get observedAttributes() {
        return [AT];
    }
    constructor() {
        super();
        this.type = 'image/svg+xml';
        this.data = 'bribe.svg';
        this.setAttribute('class', BRIBE);
        this.draggable = true;
        this.addEventListener('dragstart', dragStartHandler);
        this.ondragend = dragEndHandler;
    }
    connectedCallback() {
        this.addEventListener("load", function () {
            // Set background color and bribe value in SVG element
            let bribeContent = this.contentDocument;
            let bribeBackground = bribeContent.getElementById("bribe-background");
            let cssColor = getColorCSSValue(this.getAttribute(BRIBE_COLOR));
            bribeBackground.setAttribute("fill", cssColor);
            let bribeText = bribeContent.getElementById("bribe-text");
            bribeText.innerHTML = this.getAttribute(BRIBE_VALUE);
        });
    }
    static getCSS() {
        return `
            .${BRIBE} {
                user-select: none;
            }
            .${BRIBE} .dragged {
                display: none;
            }
        `;
    }
}
customElements.define(CUSTOM_BRIBE, Bribe, { extends: 'object' });
function dragStartHandler(e) {
    console.log('Entering dragstart event');
    let target = e.target;
    if ((target) && (target instanceof Bribe)) {
        // Target is a bribe element
        e.stopPropagation();
        target.classList.add("dragged");
        const bribeValue = target.getAttribute(BRIBE_VALUE);
        if (!bribeValue) {
            console.log('No value for the bribe element');
        }
        else {
            if (!e.dataTransfer) {
                console.log('No dataTransfer for the event');
            }
            else {
                e.dataTransfer.setData(gridDnDType, bribeValue);
                e.dataTransfer.effectAllowed = "move";
                // Set up destination areas (all targets, plus start position for this value)
                // TODO modify aspect of areas during drag
            }
        }
    }
}
function dragEndHandler(e) {
    console.log('Entering dragend event');
    let target = e.target;
    if ((target) && (target instanceof Bribe)) {
        target.classList.remove("dragged");
        // restore drop areas
        // TODO restore aspect of areas after drag
    }
}
// =============================================== Area ================================================================
class Area extends HTMLElement {
    // Attributes: AT
    constructor() {
        super();
    }
    static getCSS() {
        let cssContent = `
            ${CUSTOM_AREA} {
                background: lavender;
                padding: 0;
                border: white 5px solid;
                border-radius: 25px;
            }
        `;
        let areaList = TARGET_LIST.concat(BRIBE_LIST);
        for (let area of areaList) {
            cssContent += `
            ${CUSTOM_AREA}[${AT}="${area}"]:before {
                content: "${area}";
                color: gray;
                line-height: 80px;
                font-size: 4em;
                text-align: center;
            }
            `;
        }
        return cssContent;
    }
}
customElements.define(CUSTOM_AREA, Area);
// =============================================== Grid ================================================================
class Grid extends HTMLElement {
    // Attributes: COLOR, BRIBE_SETUP
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        // Style
        const style = document.createElement('style');
        style.textContent = Grid.getCSS() + Area.getCSS() + Bribe.getCSS();
        shadow.appendChild(style);
        // Grid
        const grid = document.createElement('div');
        shadow.appendChild(grid);
        // Areas
        const areaLayer = document.createElement('div');
        areaLayer.setAttribute('class', AREA_LAYER);
        grid.appendChild(areaLayer);
        for (let bribe_name of BRIBE_LIST) {
            let area = document.createElement(CUSTOM_AREA);
            area.setAttribute(AT, bribe_name);
            areaLayer.appendChild(area);
        }
        for (let target_name of TARGET_LIST) {
            let area = document.createElement(CUSTOM_AREA);
            area.setAttribute(AT, target_name);
            areaLayer.appendChild(area);
        }
        // Bribes
        for (let bribe_name of BRIBE_LIST) {
            let bribe = document.createElement('object', { 'is': CUSTOM_BRIBE });
            bribe.setAttribute(BRIBE_COLOR, this.getAttribute(BRIBE_COLOR));
            bribe.setAttribute(BRIBE_VALUE, bribe_name);
            bribe.setAttribute(AT, bribe_name);
            areaLayer.appendChild(bribe);
        }
    }
    static getCSS() {
        let cssContent = `
            :root {
                ${BLUE_CSS_NAME}  : ${BLUE_CSS_VALUE};
                ${GREEN_CSS_NAME} : ${GREEN_CSS_VALUE};
                ${RED_CSS_NAME}   : ${RED_CSS_VALUE};
                ${YELLOW_CSS_NAME}: ${YELLOW_CSS_VALUE};
            }
            .${AREA_LAYER} {
                background: silver;
                padding: 10px;
                width: 1110px;
                margin: auto;
                display: grid;
                grid-gap: 10px;
                grid-template-columns: repeat(7, 1fr);
                grid-template-rows: repeat(2, 200px);
                grid-template-areas: ${getGridAreas()};
            }
        `;
        let areaList = TARGET_LIST.concat(BRIBE_LIST);
        for (let area of areaList) {
            cssContent += `
            [${AT}="${area}"] {
                grid-area: ${getGridArea(area)};
            }
            `;
        }
        return cssContent;
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
        const shadow = this.attachShadow({ mode: 'open' });
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
    attributeChangedCallback(name, oldValue, newValue) {
        console.log('Custom square element attributes changed.' + name + ' from ' + oldValue + ' to ' + newValue);
        updateStyle(this);
    }
}
customElements.define('custom-square', Square);
function updateStyle(elem) {
    const shadow = elem.shadowRoot;
    shadow.querySelector('style').textContent = `
    div {
      width: ${elem.getAttribute('l')}px;
      height: ${elem.getAttribute('l')}px;
      background-color: ${elem.getAttribute('c')};
    }
  `;
}
const add = document.querySelector('.add');
const update = document.querySelector('.update');
const remove = document.querySelector('.remove');
let square;
update.disabled = true;
remove.disabled = true;
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
add.onclick = function () {
    // Create a custom square element
    square = document.createElement('custom-square');
    square.setAttribute('l', '100');
    square.setAttribute('c', 'red');
    document.body.appendChild(square);
    update.disabled = false;
    remove.disabled = false;
    add.disabled = true;
};
update.onclick = function () {
    // Randomly update square's attributes
    square.setAttribute('l', random(50, 200).toString());
    square.setAttribute('c', `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`);
};
remove.onclick = function () {
    // Remove the square
    document.body.removeChild(square);
    update.disabled = true;
    remove.disabled = true;
    add.disabled = false;
};
