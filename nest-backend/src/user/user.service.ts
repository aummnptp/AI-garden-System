import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { RegisterDTO } from './dto/register.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    
  ) {}
  create(registerDTO: RegisterDTO): Promise<User> {
    const newUser = this.userRepository.create(registerDTO);
    return this.userRepository.save(newUser);
  }

  
  
  findAll():Promise<User[]> {
    return this.userRepository.find();
  }
  
  findOne(userId: string): Promise<User | null> {

    return this.userRepository.findOneBy({ userId:userId });
  }



  findByEmail(email: string):Promise<User| null>{
    return this.userRepository.findOneBy({ email });
  } 

  async promoteToAdmin(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === 'admin') {
      throw new ForbiddenException('User is already an admin');
    }

    user.role = 'admin';
    return this.userRepository.save(user);
  }
  
}
