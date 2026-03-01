export enum CommandMapper {
  CreateOrder = 'order-service.command.order.create',
  CreatePayment = 'payment-service.command.payment.create',
  CompletePayment = 'payment-service.command.payment.complete',
  FailPayment = 'payment-service.command.payment.fail',
  PaymentSuccess = 'payment-service.command.payment.success',
  MarkOrderPaid = 'payment-service.command.order.paid',
  MarkOrderInProgress = 'payment-service.command.order.in_progress',
  CompleteOrder = 'payment-service.command.order.completed',
  CancelOrder = 'payment-service.command.order.cancelled',
}

export enum EventMapper {
  OrderCreated = 'payment-service.event.order.created',
  OrderPaid = 'payment-service.event.order.paid',
  PaymentCreated = 'payment-service.event.payment.created',
  PaymentSucceeded = 'payment-service.event.payment.succeeded',
  PaymentFailed = 'payment-service.event.payment.failed',
  PaymentCompleted = 'payment-service.event.payment.completed',
}
