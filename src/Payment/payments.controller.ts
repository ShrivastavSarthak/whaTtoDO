import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDtos, VerifyPaymentDtos } from './dtos/paymentDtos';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.gurd';

@ApiBearerAuth('access-token')
@ApiTags('Payment')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentServices: PaymentsService) {}

  @Post('create-payment')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async create_payment(@Body() payment: CreatePaymentDtos) {
    return this.paymentServices.createOrder(payment.amount, payment.currency);
  }

  @Post('verify-payment')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async verify_payment(@Body() verifyPayment: VerifyPaymentDtos) {
    return this.paymentServices.verifyPayment(verifyPayment);
  }
}
