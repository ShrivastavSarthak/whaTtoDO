import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  constructor(private configureService: ConfigService) {}

  private readonly razorPayKey = 'rzp_test_OcKVkBHQTl22Ye';
  private readonly razorPaySecret = '1nPA1WVGoEOkSazbFRhtZkIg';
  private readonly razorpayBaseUrl = 'https://api.razorpay.com/v1/orders';

  async createOrder(amount: number, currency: string) {
    const instance = new Razorpay({
      key_id: this.razorPayKey,
      key_secret: this.razorPaySecret,
    });

    const options = {
      amount: amount,
      currency: currency,
      receipt: `${uuidv4()}`,
    };
    try {
      const order = await instance.orders.create(options);
      return order;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  verifyPayment(razorPay_data) {
    try {
      const { orderId, paymentId, signature } = razorPay_data;

      const body = `${orderId}|${paymentId}`;

      const expectedSignature = crypto
        .createHmac('sha256', this.razorPaySecret)
        .update(body)
        .digest('hex');

      if (expectedSignature === signature) {
        const paymentData = {
          orderId,
          paymentId,
          status: 'success',
          created_at: new Date(),
        };
        return {
          message: 'payment successfully ',
          data: paymentData,
          status_code: 200,
        };
      } else {
        return {
          message: 'payment failed',
          status_code: 400,
        };
      }
    } catch (error) {
      throw new Error(error);

      console.log(error);
    }
  }
}
