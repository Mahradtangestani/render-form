interface Draggable{
    dragStartHandler(event:DragEvent):void
    dragEndHandler(event:DragEvent):void
}

interface DragTarget{
    dragOverHandler(event:DragEvent):void
    dropHandler(event:DragEvent):void
    dragLeaveHandler(event:DragEvent):void
}


enum ProjectStatus {
    Active,
    Finished
}


class Project {
    constructor(

        public id: string,
        public title: string,
        public description: string,
        public people: number,
        public status: ProjectStatus
    ) {

    }
}

type Listener<T> = (items:T[]) => void


class State<T>{

    protected listeners: Listener<T>[] = []

    addListener(listenerFn: Listener<T>) {
        this.listeners.push(listenerFn)
    }
}



class ProjectState extends State<Project> {

    

    private projects: Project[] = []

    private static instance: ProjectState

    private constructor() { 
        super()
    }

    static getInstace() {
        if (this.instance) {
            return this.instance
        }
        this.instance = new ProjectState();
        return this.instance;
    }

    

    addProject(title: string, description: string, numOfPeople: number) {
        const newProject = new Project(
            Math.random().toString(),
            title,
            description,
            numOfPeople,
            ProjectStatus.Active
        )
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


abstract class Component<T extends HTMLElement, U extends HTMLElement>{
    templateElement: HTMLTemplateElement;

    hotsElement: T;

    element: U;

    constructor(templateId:string, hostElementId:string, insertAtStart:boolean , newElementId?:string){
        this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
        this.hotsElement = document.getElementById(hostElementId)! as T;

        const importedNode = document.importNode(this.templateElement.content, true)

        console.log(importedNode);

        this.element = importedNode.firstElementChild as U
        if(newElementId){
            this.element.id = newElementId
        }
        this.attach(insertAtStart)
    }

    private attach(insertAtBegin:boolean) {
        this.hotsElement.insertAdjacentElement(insertAtBegin ? "afterbegin" : "beforeend", this.element)
    }

    abstract configure() : void
    abstract renderContent() : void
}


class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable{
     
    private project:Project

    constructor(hostId:string , project:Project){
        super("single-project" , hostId , false , project.id)
        this.project = project
        this.renderContent()
        this.configure();
    }
     
    @Autobind
    dragStartHandler(event: DragEvent): void {
        event.dataTransfer!.setData("text/plain" , this.project.id)
        event.dataTransfer!.effectAllowed = 'move'
    }
    dragEndHandler(_: DragEvent): void {
        console.log("Drag End");
        
    }

    configure(): void {
        this.element.addEventListener("dragstart" , this.dragStartHandler)
        this.element.addEventListener("dragend" , this.dragEndHandler)
    }

    renderContent(): void {
        this.element.querySelector("h2")!.textContent = this.project.title
        this.element.querySelector("h3")!.textContent = this.project.people.toString()
        this.element.querySelector("p")!.textContent = this.project.description
    }

}


class ProjectList extends Component<HTMLDivElement , HTMLUListElement> implements DragTarget {
    
    assignedProject: Project[]


    constructor(private type: "active" | "finished") {
        super("project-list", "app", false , `${type}-projects`)
        
        this.assignedProject = []

        projectState.addListener((projects: Project[]) => {
            const relatedProject = projects.filter(prj => {
                if (this.type === "active") {
                    return prj.status === ProjectStatus.Active
                }
                return prj.status === ProjectStatus.Finished
            })
            
            this.assignedProject = relatedProject;

            this.renderProjects();
        })

        this.renderContent();
        this.configure();
    }
    
    @Autobind
    dragOverHandler(event: DragEvent): void {
        event.preventDefault()
        const listEl = this.element.querySelector("ul")!;
        listEl.classList.add("droppable")
    }
    @Autobind
    dragLeaveHandler(_: DragEvent): void {
        const listEl = this.element.querySelector("ul")!;
        listEl.classList.remove("droppable")
    }
    @Autobind
    dropHandler(event: DragEvent): void {
        const prjId = event.dataTransfer!.getData("text/plain");
        console.log(prjId);
        
    }

    private renderProjects() {
        const listEl = document.getElementById(`${this.type}-prject-list`)! as HTMLUListElement;
        listEl.innerHTML = ""
        for (const prjItem of this.assignedProject) {
            new ProjectItem(this.element.querySelector("ul")!.id , prjItem)
        }
    }
    configure(): void {
        this.element.addEventListener("dragover" , this.dragOverHandler)
        this.element.addEventListener("dragleave" , this.dragLeaveHandler)
        this.element.addEventListener("drop" , this.dropHandler)
    }

    renderContent() {
        const listId = `${this.type}-prject-list`
        this.element.querySelector("ul")!.id = listId
        this.element.querySelector("h2")!.textContent = this.type.toUpperCase() + " PROJECTS"
    }
}


class ProjectInput extends Component<HTMLDivElement , HTMLFormElement> {
    
    titleInputElement: HTMLInputElement;

    descriptionInputElement: HTMLTextAreaElement;

    peopleInputElement: HTMLInputElement;

    constructor() {
        super("project-input" , "app" , true , "user-input")

        this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement

        this.descriptionInputElement = this.element.querySelector("#description") as HTMLTextAreaElement

        this.peopleInputElement = this.element.querySelector("#people") as HTMLInputElement

        this.configure()

        
    }

    configure() {
        this.element.addEventListener("submit", this.submitHandler)
    }

    renderContent(): void {
        
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

}

const prjInput = new ProjectInput

const activePrj = new ProjectList("active")
const finishedPrj = new ProjectList("finished")