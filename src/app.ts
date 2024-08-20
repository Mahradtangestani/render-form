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
    

    private clearInputs(){
        this.titleInputElement.value = ""
        this.descriptionInputElement.value = ""
        this.peopleInputElement.value = ""
    }


    private getUserInput():[string , string , number] | void{
        const enteredTitle = this.titleInputElement.value
        const enteredDescription = this.descriptionInputElement.value
        const enteredPeople = this.peopleInputElement.value

        if( 
            enteredTitle.trim().length === 0 || 
            enteredDescription.trim().length === 0 || 
            enteredPeople.trim().length === 0){

            alert("Invalid Input , Please try again!")
            return;
        }else{
           return [enteredTitle , enteredDescription , +enteredPeople]
        }
    }

    @Autobind
    private submitHandler(event: Event) {
        event.preventDefault()
        const userInput = this.getUserInput()

        if(Array.isArray(userInput)){
            const [title , desc , people] = userInput;
            console.log(title , desc , people);
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