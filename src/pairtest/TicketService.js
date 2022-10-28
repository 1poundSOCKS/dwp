import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  purchaseTickets(accountId, ...ticketTypeRequests) {
    // throws InvalidPurchaseException

    if( !Number.isInteger(accountId) ) throw InvalidPurchaseException
    if( accountId < 1 ) throw InvalidPurchaseException

    let adultTicketCount = 0
    let childTicketCount = 0
    let infantTicketCount = 0

    // iterate the purchase requests and calculate the total tickets by type
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

    // child tickets require at least one adult
    if( adultTicketCount == 0 && childTicketCount > 0 ) throw InvalidPurchaseException
    
    // each infant needs an adult
    if( adultTicketCount < infantTicketCount > 0 ) throw InvalidPurchaseException

    // max 20 tickets can be purchased
    const totalTicketCount = adultTicketCount + childTicketCount + infantTicketCount
    if( totalTicketCount > 20 ) throw InvalidPurchaseException

     // infants don't require a seat and don't cost anything
    const totalTicketCost = ( adultTicketCount * 20 ) + ( childTicketCount * 10 )
    const totalSeatCount = adultTicketCount + childTicketCount

    // make the payment
    const ticketPaymentService = new TicketPaymentService
    ticketPaymentService.makePayment(accountId, totalTicketCost)

    // reserve the seats
    const seatReservationService = new SeatReservationService
    seatReservationService.reserveSeat(accountId, totalSeatCount)
  }
}
