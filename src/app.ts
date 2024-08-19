function Autobind( 
     _: any,
     _2: string, 
     descriptor: PropertyDescriptor)
    {
     const originalMethod = descriptor.value

     const myDescriptor:PropertyDescriptor={
        configurable:true,
        get(){
           const boundFn = originalMethod.bind(this)
           return boundFn;
        }
     }
     return myDescriptor
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
    

    @Autobind
    private submitHandler(event: Event) {
        event.preventDefault()
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