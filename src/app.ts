class ProjectInput {
    templateElement: HTMLTemplateElement;
    hotsElement: HTMLDivElement;

    element:HTMLFormElement;

    constructor() {
        this.templateElement = document.getElementById("project-input")! as HTMLTemplateElement;
        this.hotsElement = document.getElementById("app")! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElement.content, true)

        console.log(importedNode);

        this.element = importedNode.firstElementChild as HTMLFormElement
        this.attach();
    }
    

    private attach() {
        this.hotsElement.insertAdjacentElement("afterbegin", this.element)
    }
}

const prjInput = new ProjectInput