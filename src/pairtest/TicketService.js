import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  purchaseTickets(accountId, ...ticketTypeRequests) {
    // throws InvalidPurchaseException

    const ticketPaymentService = new TicketPaymentService
    ticketPaymentService.makePayment(accountId, 999)

    const seatReservationService = new SeatReservationService
    seatReservationService.reserveSeat(accountId, 123)
  }
}
