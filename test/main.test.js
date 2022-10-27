import TicketTypeRequest from '../src/pairtest/TicketService.js'
import TicketService from '../src/pairtest/TicketService.js'
import TicketPaymentService from '../src/thirdparty/paymentgateway/TicketPaymentService.js'
import SeatReservationService from '../src/thirdparty/seatbooking/SeatReservationService.js'

jest.mock('../src/thirdparty/paymentgateway/TicketPaymentService.js')
jest.mock('../src/thirdparty/seatbooking/SeatReservationService.js')

beforeEach(() => {
  TicketPaymentService.mockClear();
  SeatReservationService.mockClear();
});

test("purchase a single adult ticket", () => {

  const accountId = 1
  const purchaseRequest = new TicketTypeRequest(1, "ADULT")

  const ticketService = new TicketService()
  ticketService.purchaseTickets(accountId, purchaseRequest)

  const mockTicketPaymentService = TicketPaymentService.mock.instances[0]
  const mockMakePayment = mockTicketPaymentService.makePayment
  expect(mockMakePayment.mock.calls[0][0]).toEqual(accountId);
  expect(mockMakePayment.mock.calls[0][1]).toEqual(999);

  const mockSeatReservationService = SeatReservationService.mock.instances[0]
  const mockReserveSeat = mockSeatReservationService.reserveSeat
  expect(mockReserveSeat.mock.calls[0][0]).toEqual(accountId);
  expect(mockReserveSeat.mock.calls[0][1]).toEqual(123);
})
