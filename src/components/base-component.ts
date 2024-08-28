namespace App{
    export abstract class Component<T extends HTMLElement, U extends HTMLElement>{
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
}