namespace App{
    export function Autobind(
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
}