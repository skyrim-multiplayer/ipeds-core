export class IpedsService {
    constructor(_api, _controller) { }
}
export class IpedsEngine {
    constructor(api) {
        this.api = api;
        this.instances = new Map();
    }
    setup(services) {
        services.forEach(ctor => {
            this.instances.set(ctor, new ctor(this.api, this.createController(ctor)));
        });
    }
    getServiceInstances() {
        return this.instances;
    }
}
