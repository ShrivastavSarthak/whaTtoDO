import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDtos {
  @ApiProperty({
    type: Number,
    description: 'This field is important to fill',
  })
  amount: number;

  @ApiProperty({
    type: String,
    description: 'This field is important to fill',
  })
  currency: string;
}

export class VerifyPaymentDtos {
  @ApiProperty({
    type: String,
    description: 'This field is important to fill',
  })
  razorpay_payment_id: string;

  @ApiProperty({
    type: String,
    description: 'This field is important to fill',
  })
  razorpay_order_id: string;

  @ApiProperty({
    type: String,
    description: 'This field is important to fill',
  })
  razorpay_signature: string;
}
