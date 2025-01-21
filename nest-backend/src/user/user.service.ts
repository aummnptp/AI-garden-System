import { Injectable } from '@nestjs/common';
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
  
  findOne(userId: number): Promise<User | null> {

    return this.userRepository.findOneBy({ userId: userId });
  }



  findByEmail(email: string):Promise<User| null>{
    return this.userRepository.findOneBy({ email });
  } 
}
