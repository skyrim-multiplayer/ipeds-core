export class IpedsService {
    constructor(ctx) {
        this.ctx = ctx;
    }
}
export class IpedsEngine {
    constructor(api) {
        this.api = api;
        this.instances = new Map();
    }
    initialize(services) {
        const controller = {
            api: this.api,
            events: { emit: (e) => this.routeEvent(e) },
            settings: {},
            lookupService: (ctor) => this.instances.get(ctor),
        };
        // Instantiate all services (Linear initialization)
        services.forEach(Ctor => {
            this.instances.set(Ctor, new Ctor(controller));
        });
    }
    routeEvent(event) {
        const eventName = event.constructor.name;
        const methodName = `on${eventName}`;
        for (const instance of this.instances.values()) {
            if (typeof instance[methodName] === 'function') {
                instance[methodName](event);
            }
        }
    }
}
