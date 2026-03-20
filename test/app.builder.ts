import { INestApplication, ModuleMetadata, Provider } from '@nestjs/common';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { SharedModule } from '../src/shared.module';
import { HttpAppModule } from '../src/ui/http/http-app.module';

export interface AppBuilderParams {
  controllers?: NonNullable<ModuleMetadata['controllers']>;
  imports?: NonNullable<ModuleMetadata['imports']>;
  includeSharedModule?: boolean;
  providers?: Provider[];
}

export class AppBuilder {
  private builder: TestingModuleBuilder;

  constructor(
    params: AppBuilderParams = {},
  ) {
    this.builder = Test.createTestingModule({
      controllers: params.controllers || [],
      imports: [
        ...(params.includeSharedModule === false ? [] : [SharedModule]),
        ...(params.imports || []),
      ],
      providers: params.providers || [],
      exports: [],
    });
  }

  static create(
    params: AppBuilderParams = {},
  ): AppBuilder {
    return new AppBuilder(params);
  }

  static createHttpApp(
    params: AppBuilderParams = {},
  ): AppBuilder {
    return new AppBuilder({ ...params, imports: [...(params.imports || []), HttpAppModule] });
  }

  async buildModule(): Promise<TestingModule> {
    return this.builder.compile();
  }

  async build(): Promise<INestApplication> {
    const moduleRef = await this.buildModule();
    const app = moduleRef.createNestApplication();
    await app.init();
    return app;
  }
}
