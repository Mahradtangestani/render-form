class Project {
    constructor(

       public id: string,
       public title: string,
       public description: string,
       public people: number,

    ) {

    }
}


class ProjectState {

    private listeners: any[] = []

    private projects: any[] = []

    private static instance: ProjectState

    private constructor() { }

    static getInstace() {
        if (this.instance) {
            return this.instance
        }
        this.instance = new ProjectState();
        return this.instance;
    }

    addListener(listenerFn: Function) {
        this.listeners.push(listenerFn)
    }

    addProject(title: string, description: string, numOfPeople: number) {
        const newProject = {
            id: Math.random().toString(),
            title: title,
            description: description,
            people: numOfPeople
        }
        this.projects.push(newProject)
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice())
        }
    }
}

const projectState = ProjectState.getInstace()



interface Validatable {
    value: string | number
    required?: boolean
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
}

function validate(validatableInput: Validatable) {
    let isValid = true

    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0
    }
    if (validatableInput.minLength != null && typeof validatableInput.value === "string") {
        isValid = isValid && validatableInput.value.length >= validatableInput.minLength
    }
    if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength
    }
    if (validatableInput.min != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value >= validatableInput.min
    }
    if (validatableInput.max != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value <= validatableInput.max
    }

    return isValid;
}




function Autobind(
    _: any,
    _2: string,
    descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    const myDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this)
            return boundFn;
        }
    }
    return myDescriptor
}



class ProjectList {
    templateElement: HTMLTemplateElement;

    hotsElement: HTMLDivElement;

    element: HTMLFormElement;

    assignedProject: any[]


    constructor(private type: "active" | "finished") {
        this.templateElement = document.getElementById("project-list")! as HTMLTemplateElement;
        this.hotsElement = document.getElementById("app")! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElement.content, true)

        this.assignedProject = []

        this.element = importedNode.firstElementChild as HTMLFormElement
        this.element.id = `${this.type}-projects`;

        projectState.addListener((projects: any[]) => {
            this.assignedProject = projects
            this.renderProjects();
        })

        this.attach();
        this.renderContent();
    }

    private renderProjects() {
        const listEl = document.getElementById(`${this.type}-prject-list`)! as HTMLUListElement;
        for (const prjItem of this.assignedProject) {
            const listItem = document.createElement("li");
            listItem.textContent = prjItem.title

            listEl.appendChild(listItem)
        }
    }

    private attach() {
        this.hotsElement.insertAdjacentElement("beforeend", this.element)
    }

    private renderContent() {
        const listId = `${this.type}-prject-list`
        this.element.querySelector("ul")!.id = listId
        this.element.querySelector("h2")!.textContent = this.type.toUpperCase() + " PROJECTS"
    }
}


class ProjectInput {
    templateElement: HTMLTemplateElement;

    hotsElement: HTMLDivElement;

    element: HTMLFormElement;

    titleInputElement: HTMLInputElement;

    descriptionInputElement: HTMLTextAreaElement;

    peopleInputElement: HTMLInputElement;

    constructor() {
        this.templateElement = document.getElementById("project-input")! as HTMLTemplateElement;
        this.hotsElement = document.getElementById("app")! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElement.content, true)

        console.log(importedNode);

        this.element = importedNode.firstElementChild as HTMLFormElement
        this.element.id = "user-input"

        this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement

        this.descriptionInputElement = this.element.querySelector("#description") as HTMLTextAreaElement

        this.peopleInputElement = this.element.querySelector("#people") as HTMLInputElement

        this.configure()

        this.attach();
    }


    private clearInputs() {
        this.titleInputElement.value = ""
        this.descriptionInputElement.value = ""
        this.peopleInputElement.value = ""
    }


    private getUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value
        const enteredDescription = this.descriptionInputElement.value
        const enteredPeople = this.peopleInputElement.value

        const titleValidatable: Validatable = {
            value: enteredTitle,
            required: true,
            minLength: 3
        }
        const descriptionValidatable: Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5, maxLength: 200
        }
        const peopleValidatable: Validatable = {
            value: +enteredPeople,
            required: true,
            min: 1, max: 10

        }

        if (!validate(titleValidatable) || !validate(descriptionValidatable) || !validate(peopleValidatable)) {
            alert("Invalid Input , Please try again!")
            return;
        } else {
            return [enteredTitle, enteredDescription, +enteredPeople]
        }
    }

    @Autobind
    private submitHandler(event: Event) {
        event.preventDefault()
        const userInput = this.getUserInput()

        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            projectState.addProject(title, desc, people)
            this.clearInputs();

        }
        console.log(this.titleInputElement.value);

    }


    private configure() {
        this.element.addEventListener("submit", this.submitHandler)
    }

    private attach() {
        this.hotsElement.insertAdjacentElement("afterbegin", this.element)
    }
}

const prjInput = new ProjectInput

const activePrj = new ProjectList("active")
const finishedPrj = new ProjectList("finished")