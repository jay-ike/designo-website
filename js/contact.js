class Stepper extends HTMLElement {
    #current;
    #outClassIndicator;
    constructor() {
        super();
    }
    static define(name = "step-by-step") {
        let construct;
        if (typeof window.customElements === "undefined") {
            console.warn("custom elements are not supported in this browser");
            return;
        }
        construct = window.customElements.get(name);
        if (construct !== undefined) {
            console.warn(
                "a custom element with the name " + name +
                " already exists"
            );
        } else {
            window.customElements.define(name, Stepper);
        }
    }

    static get observedAttributes() {
        return ["style"];
    }

    connectedCallback() {
        let index;
        let outIndicator;
        if (!this.isConnected) {
            return;
        }
        index = Number.parseInt(this.getAttribute("initial-index"), 10);
        if (!Number.isFinite(index)) {
            index = 0;
        }
        outIndicator = this.getAttribute("out-indicator") ?? "step-out";
        this.#outClassIndicator = outIndicator;
        this.#updateCurrent(index);
        Array.from(this.children).forEach(function (elt, i) {
            elt.style.setProperty("--i", i);
            elt.classList.remove(outIndicator);
            if (i !== index) {
                elt.classList.add(outIndicator);
            }
        });
    }

    attributeChangedCallback(name, ignore, newValue) {
        const current = "--current: " + this.#current + ";";
        if (newValue && newValue.match(current) === null && name === "style") {
            this.style.setProperty("--current", this.#current);
        }
    }

    #updateCurrent(index) {
        this.#current = index;
        this.style.setProperty("--current", index);
    }

    #updateStep(indexUpdater) {
        var next;
        var old;
        var event;
        old = this.#current;
        next = indexUpdater(old);
        if (this.children.item(next) !== null) {
            event = new CustomEvent("indexupdated", {
                detail: {
                    current: next,
                    previous: old
                }
            });
            this.children.item(old).classList.add(this.#outClassIndicator);
            this.children.item(next).classList.remove(this.#outClassIndicator);
            this.#updateCurrent(next);
            this.dispatchEvent(event);
        }
    }
    currentStep() {
        return this.#current;
    }
    nextStep() {
        this.#updateStep((index) => index + 1);
    }
    previousStep() {
        this.#updateStep((index) => index - 1);
    }
    gotoStep(index) {
        if (Number.isFinite(index)) {
            this.#updateStep(() => index);
        }
    }
}
const component = Object.create(null);
component.stepper = document.querySelector("step-by-step");
component.form = document.forms[0];
component.error_list = component.form.querySelector("#error-list");

function setInitialButtons() {
    component.form.elements.next_step.removeAttribute("hidden");
    component.form.elements.submit.setAttribute("hidden", "");
    component.form.elements.prev_step.setAttribute("hidden", "");
}
function initialize() {
    setInitialButtons();
    Stepper.define();
}
component.stepper.addEventListener("indexupdated", function (event) {
    const {current} = event.detail;

    if (current === 1) {
        component.form.elements.prev_step.removeAttribute("hidden");
        component.form.elements.submit.removeAttribute("hidden");
        component.form.elements.next_step.setAttribute("hidden", "");
    }
    if (current === 0) {
        setInitialButtons();
    }
});
component.form.addEventListener("input", function (event) {
    const {target} = event;
    const {error_list} = component;
    if (target.hasAttribute("aria-invalid")) {
        target.removeAttribute("aria-invalid");
        target.setCustomValidity("");
        target.nextElementSibling.setAttribute("hidden", "");
        error_list.innerHTML = "";
        error_list.parentElement.setAttribute("hidden", "");
    }
});
component.form.addEventListener("click", function (event) {
    const {target} = event;
    const {error_list, form, stepper} = component;
    let controls;

    if (!window.HTMLButtonElement.prototype.isPrototypeOf(target)) {
        return;
    }
    event.preventDefault();
    if (target.name === "prev_step") {
        component.stepper.previousStep();
        return;
    }
    controls = form.querySelectorAll(
        "fieldset"
    )[stepper.currentStep()].elements;
    controls = Array.from(controls).map(function (control) {
        const isValid = control.value.length > 0 && control.validity.valid;
        let domNode;
        let content = control.nextElementSibling?.textContent;
        if (control.hasAttribute("aria-required") && !isValid) {
            domNode = document.createElement("li");
            domNode.innerHTML = "<a href='#" + control.id + "'>" + content + "</a>";
            return [control, domNode];
        }
        return null;
    });
    if (controls.some((val) => val !== null)) {
        error_list.innerHTML = "";
        controls.forEach(function (val) {
            if (val === null) {
                return;
            }
            val[0].nextElementSibling.removeAttribute("hidden");
            val[0].setAttribute("aria-invalid", "true");
            val[0].setCustomValidity("invalid value");
            val[0].nextElementSibling.removeAttribute("hidden");
            error_list.appendChild(val[1]);
            error_list.parentElement.removeAttribute("hidden");
        });
        error_list.parentElement.focus();
        return;
    }
    if (target.name === "next_step") {
        component.stepper.nextStep();
    }
    if (target.name === "submit") {
        form.requestSubmit();
    }
});
initialize();
