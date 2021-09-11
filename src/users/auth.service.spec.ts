import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999),
          email,
          password,
        } as User;
        users.push(user);

        return Promise.resolve(user);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('should create a user with salted and hashed password', async () => {
    const user = await service.signup('testing@test.com', 'testing');

    expect(user.password).not.toEqual('testing');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('should throws an error if user signs up with email that is in use', async (done) => {
    await service.signup('test@test.com', 'testing');

    try {
      await service.signup('test@test.com', 'testing');
    } catch (error) {
      done();
    }
  });

  it('should throws an error if signin is called with an unused email', async (done) => {
    try {
      await service.signin('test@tes.com', 'test');
    } catch (error) {
      done();
    }
  });

  it('should throws if an invalid password is provided', async (done) => {
    await service.signup('test@test.com', 'testing');

    try {
      await service.signin('test@test.com', 'password');
    } catch (error) {
      done();
    }
  });

  it('should return a user if correct password is provided', async () => {
    const user = { email: 'test@test.com', password: 'testing' };
    await service.signup(user.email, user.password);

    const result = await service.signin(user.email, user.password);
    expect(result).toBeDefined();
  });
});
