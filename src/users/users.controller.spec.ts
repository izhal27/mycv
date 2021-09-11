import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        const user = {
          id: 1,
          email: 'test@test.com',
          password: 'testing',
        } as User;

        return Promise.resolve(user);
      },
      find: (email: string) => {
        const user = {
          id: 1,
          email: 'test@test.com',
          password: 'testing',
        } as User;

        return Promise.resolve([user]);
      },
      // remove: () => {},
      // update: () => {},
    };

    fakeAuthService = {
      // signup: () => {},
      signin: (email: string, password: string) => {
        return Promise.resolve({
          id: 1,
          email,
          password,
        } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('test@test.com');

    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@test.com');
  });

  it('should returns a single user with the given id', async () => {
    const user = await controller.findUser(1);
    expect(user).toBeDefined();
  });

  it('should findUser throws an error with the given id is not found', async (done) => {
    fakeUsersService.findOne = null;

    try {
      await controller.findUser(1);
    } catch (error) {
      done();
    }
  });

  it('should updatee session object and return a user', async () => {
    const session = { userId: 0 };
    const user = await controller.signin(
      { email: 'test@test.com', password: 'testing' },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(user.id);
  });
});
