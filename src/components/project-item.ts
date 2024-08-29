import { Component } from "../components/base-component";
import { Draggable } from "../models/drag-drop";
import { Project } from "../models/project";
import { Autobind } from "../util/autobinder";





    export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable{
         
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