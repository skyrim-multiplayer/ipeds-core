import { EventEmitter } from "eventemitter3";
export class IpedsEventsControllerImpl {
    constructor() {
        this.emitter = new EventEmitter();
    }
}
export class IpedsServiceLookupControllerImpl {
    constructor(engine) {
        this.engine = engine;
    }
    lookupService(ctor) {
        const listener = this.engine.getServiceInstances().get(ctor);
        if (!listener) {
            throw new Error(`listener not found for name '${ctor.name}'`);
        }
        if (!(listener instanceof ctor)) {
            throw new Error(`listener class mismatch for name '${ctor.name}'`);
        }
        return listener;
    }
}
;
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
