import { BadRequestException } from '@nestjs/common';
import { HomeInterface } from 'src/shared/interface/home-interface';
import {
  ChildSignupInterface,
  ParentSignupInterface,
} from 'src/shared/interface/user-interface';

export const ChildSignupFieldValidators = (fields: ChildSignupInterface) => {
  if (fields.phoneNo.length !== 10) {
    throw new BadRequestException('Phone number should be of 10 digits');
  }
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z0-9]).{8,}$/;
  if (!passwordRegex.test(fields.password)) {
    throw new BadRequestException(
      'Password should be at least 8 characters long, contain at least one uppercase letter, one special character, and be alphanumeric',
    );
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(fields.email)) {
    throw new BadRequestException('Invalid email');
  }
  if (fields.username.length < 3) {
    throw new BadRequestException('Username should be of minimum 5 characters');
  }
  return true;
};

export const ParentSignupFieldValidators = (field: ParentSignupInterface) => {
  if (field.phoneNo.length !== 10) {
    throw new BadRequestException('Phone number should be of 10 digits');
  }
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z0-9]).{8,}$/;
  if (!passwordRegex.test(field.password)) {
    throw new BadRequestException(
      'Password should be at least 8 characters long, contain at least one uppercase letter, one special character, and be alphanumeric',
    );
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(field.email)) {
    throw new BadRequestException('Invalid email');
  }
  if (field.username.length < 3) {
    throw new BadRequestException('Username should be of minimum 5 characters');
  }
  if (
    field.gender !== 'male' &&
    field.gender !== 'female' &&
    field.gender !== 'other'
  ) {
    throw new BadRequestException('Invalid gender');
  }

  if (field.occupation.length < 3) {
    throw new BadRequestException(
      'Occupation should be of minimum 3 characters or greater',
    );
  }
  return true;
};

export const HomeFieldValidators = (field: HomeInterface) => {
  if (field.homeName.length < 3) {
    throw new BadRequestException(
      'Home name should be of minimum 3 characters',
    );
  }
  if (field.homeDesc.length < 10) {
    throw new BadRequestException(
      'Home address should be of minimum 5 characters',
    );
  }

  return true;
};
