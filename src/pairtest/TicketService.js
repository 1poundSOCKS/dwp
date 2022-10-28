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

    let adultTicketCount = 0
    let childTicketCount = 0
    let infantTicketCount = 0

    for (const ticketTypeRequest of ticketTypeRequests) {
      switch( ticketTypeRequest.getTicketType() )
      {
        case "ADULT":
          adultTicketCount += ticketTypeRequest.getNoOfTickets()
          break
        case "CHILD":
          childTicketCount += ticketTypeRequest.getNoOfTickets()
          break
        case "INFANT":
          infantTicketCount += ticketTypeRequest.getNoOfTickets()
          break
      }
    }

     // infants don't require a seat and don't cost anything
    const totalTicketCost = ( adultTicketCount * 20 ) + ( childTicketCount * 10 )
    const totalSeatCount = adultTicketCount + childTicketCount

    const ticketPaymentService = new TicketPaymentService
    ticketPaymentService.makePayment(accountId, totalTicketCost)

    const seatReservationService = new SeatReservationService
    seatReservationService.reserveSeat(accountId, totalSeatCount)
  }
}
