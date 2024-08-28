namespace App{
    export class ProjectInput extends Component<HTMLDivElement , HTMLFormElement> {
        
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
}