import { Component } from "../components/base-component.js"
import { DragTarget } from "../models/drag-drop.js"
import { Project, ProjectStatus } from "../models/project.js"
import { projectState } from "../state/project-state.js"
import { Autobind } from "../util/autobinder.js"
import { ProjectItem } from "../components/project-item.js"





    export class ProjectList extends Component<HTMLDivElement , HTMLUListElement> implements DragTarget {
        
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
            projectState.moveProject(prjId , this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished)
            
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