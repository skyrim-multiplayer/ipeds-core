export type Constructor<T> = new (...args: any[]) => T;

export interface IpedsController<UDAPI = any, Settings = any> {
  readonly events: { emit: (event: any) => void };
  readonly settings: Settings;
  readonly api: UDAPI;
  lookupService<T>(ctor: Constructor<T>): T;
}

export abstract class IpedsService<UDAPI = any, Settings = any> {
  constructor(protected readonly ctx: IpedsController<UDAPI, Settings>) {}
}

export class IpedsEngine<UDAPI> {
  private instances = new Map<Function, any>();

  constructor(private api: UDAPI) {}

  public initialize(services: Constructor<any>[]): void {
    const controller: IpedsController<UDAPI> = {
      api: this.api,
      events: { emit: (e) => this.routeEvent(e) },
      settings: {} as any,
      lookupService: (ctor) => this.instances.get(ctor),
    };

    // Instantiate all services (Linear initialization)
    services.forEach(Ctor => {
      this.instances.set(Ctor, new Ctor(controller));
    });
  }

  private routeEvent(event: any): void {
    const eventName = event.constructor.name;
    const methodName = `on${eventName}`;
    
    for (const instance of this.instances.values()) {
      if (typeof instance[methodName] === 'function') {
        instance[methodName](event);
      }
    }
  }
}
