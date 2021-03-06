import { AuthenticationMiddleware } from './shared/middlewares/authentication.middleware';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { CommentController } from './modules/comment/comment.controller';
import { CommentGatewayModule } from './gateways/comment/comment.gateway.module';
import { CommentModule } from './modules/comment/comment.module';
import { DatabaseModule } from './modules/database/database.module';
import { EntryController } from './modules/entry/entry.controller';
import { EntryModule } from './modules/entry/entry.module';
import { MiddlewareConsumer } from '@nestjs/common/interfaces/middleware';
import { Module, NestModule, RequestMethod } from '@nestjs/common';
import { strategy } from './shared/config/passport-strategy.config';
import { UserGatewayModule } from './gateways/user/user.gateway.module';
import { UserModule } from './modules/user/user.module';
import { KeywordModule } from './modules/keyword/keyword.module';

@Module({
    imports: [
        DatabaseModule,
        AuthenticationModule.forRoot('jwt'),
        UserModule,
        EntryModule,
        CommentModule,
        UserGatewayModule,
        CommentGatewayModule,
        KeywordModule
    ],
    controllers: [],
    providers: []
})
export class AppModule implements NestModule {
    public configure(consumer: MiddlewareConsumer) {
        const userControllerAuthenticatedRoutes = [
            { path: '/users', method: RequestMethod.GET },
            { path: '/users/:id', method: RequestMethod.GET },
            { path: '/users/:id', method: RequestMethod.PUT },
            { path: '/users/:id', method: RequestMethod.DELETE }
        ];

        consumer
            .apply(AuthenticationMiddleware)
            .with(strategy)
            .forRoutes(
                ...userControllerAuthenticatedRoutes,
                EntryController,
                CommentController
            );
    }
}
