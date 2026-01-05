import { EventEmitter } from "eventemitter3";

export type IpedsConstructor<T> = new (...args: any[]) => T;

export type IpedsServiceConstructor<T, TUserDefinedAPI, TController> = new (api: TUserDefinedAPI, controller: TController) => T;

// https://blog.makerx.com.au/a-type-safe-event-emitter-in-node-js/
export interface IpedsEventEmitter<TEvents extends Record<string, any>> {
  emit<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    ...eventArg: TEvents[TEventName]
  ): void;

  on<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    handler: (...eventArg: TEvents[TEventName]) => void
  ): void;

  off<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    handler: (...eventArg: TEvents[TEventName]) => void
  ): void;
}

export interface IpedsEventsController<TEvents extends Record<string, any>> {
  readonly emitter: IpedsEventEmitter<TEvents>;
}

export class IpedsEventsControllerImpl<TEvents extends Record<string, any>> implements IpedsEventsController<TEvents> {
  readonly emitter: IpedsEventEmitter<TEvents>;

  constructor() {
    this.emitter = new EventEmitter() as IpedsEventEmitter<TEvents>;
  }
}

export interface IpedsServiceLookupController<TUserDefinedAPI, TController> {
  lookupService<T extends IpedsService<TUserDefinedAPI, TController>>(ctor: IpedsConstructor<T>): T;
}

export class IpedsServiceLookupControllerImpl<TUserDefinedAPI, TController> implements IpedsServiceLookupController<TUserDefinedAPI, TController> {
  constructor(private engine: IpedsEngine<TUserDefinedAPI, TController>) { }

  lookupService<T extends IpedsService<TUserDefinedAPI, TController>>(ctor: IpedsConstructor<T>): T {
    const listener = this.engine.getServiceInstances().get(ctor);
    if (!listener) {
      throw new Error(`listener not found for name '${ctor.name}'`);
    }
    if (!(listener instanceof ctor)) {
      throw new Error(`listener class mismatch for name '${ctor.name}'`);
    }
    return listener;
  }
};

export abstract class IpedsService<TUserDefinedAPI, TController> {
  constructor(_api: TUserDefinedAPI, _controller: TController) { }
}

export abstract class IpedsEngine<TUserDefinedAPI, TController> {
  private instances = new Map<Function, IpedsService<TUserDefinedAPI, TController>>();

  constructor(private api: TUserDefinedAPI) { }

  public setup(services: IpedsServiceConstructor<any, TUserDefinedAPI, TController>[]): void {
    services.forEach(ctor => {
      this.instances.set(ctor, new ctor(this.api, this.createController(ctor)));
    });
  }

  public getServiceInstances(): ReadonlyMap<Function, IpedsService<TUserDefinedAPI, TController>> {
    return this.instances;
  }

  protected abstract createController(serviceCtor: IpedsServiceConstructor<unknown, TUserDefinedAPI, TController>): TController;
}
