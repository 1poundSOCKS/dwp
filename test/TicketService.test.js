import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest.js'
import TicketService from '../src/pairtest/TicketService.js'
import TicketPaymentService from '../src/thirdparty/paymentgateway/TicketPaymentService.js'
import SeatReservationService from '../src/thirdparty/seatbooking/SeatReservationService.js'

jest.mock('../src/thirdparty/paymentgateway/TicketPaymentService.js')
jest.mock('../src/thirdparty/seatbooking/SeatReservationService.js')

beforeEach(() => {
  TicketPaymentService.mockClear()
  SeatReservationService.mockClear()
})

test("purchase a single adult ticket", () => {

  const accountId = 1
  const purchaseRequest = new TicketTypeRequest("ADULT", 1)

  const ticketService = new TicketService()
  ticketService.purchaseTickets(accountId, purchaseRequest)

  const mockTicketPaymentService = TicketPaymentService.mock.instances[0]
  const mockMakePayment = mockTicketPaymentService.makePayment
  expect(mockMakePayment.mock.calls[0][0]).toEqual(accountId);
  expect(mockMakePayment.mock.calls[0][1]).toEqual(20);

  const mockSeatReservationService = SeatReservationService.mock.instances[0]
  const mockReserveSeat = mockSeatReservationService.reserveSeat
  expect(mockReserveSeat.mock.calls[0][0]).toEqual(accountId)
  expect(mockReserveSeat.mock.calls[0][1]).toEqual(1)
})

test("purchase a single child ticket", () => {

  const accountId = 1
  const purchaseRequest = new TicketTypeRequest("CHILD", 1)

  const ticketService = new TicketService()
  ticketService.purchaseTickets(accountId, purchaseRequest)

  const mockTicketPaymentService = TicketPaymentService.mock.instances[0]
  const mockMakePayment = mockTicketPaymentService.makePayment
  expect(mockMakePayment.mock.calls[0][0]).toEqual(accountId)
  expect(mockMakePayment.mock.calls[0][1]).toEqual(10)

  const mockSeatReservationService = SeatReservationService.mock.instances[0]
  const mockReserveSeat = mockSeatReservationService.reserveSeat
  expect(mockReserveSeat.mock.calls[0][0]).toEqual(accountId)
  expect(mockReserveSeat.mock.calls[0][1]).toEqual(1)
})

test("purchase a single adult & a single child ticket", () => {

  const accountId = 1
  const purchaseRequest1 = new TicketTypeRequest("ADULT", 1)
  const purchaseRequest2 = new TicketTypeRequest("CHILD", 1)

  const ticketService = new TicketService()
  ticketService.purchaseTickets(accountId, purchaseRequest1, purchaseRequest2)

  const mockTicketPaymentService = TicketPaymentService.mock.instances[0]
  const mockMakePayment = mockTicketPaymentService.makePayment
  expect(mockMakePayment.mock.calls[0][0]).toEqual(accountId)
  expect(mockMakePayment.mock.calls[0][1]).toEqual(30)

  const mockSeatReservationService = SeatReservationService.mock.instances[0]
  const mockReserveSeat = mockSeatReservationService.reserveSeat
  expect(mockReserveSeat.mock.calls[0][0]).toEqual(accountId)
  expect(mockReserveSeat.mock.calls[0][1]).toEqual(2)
})

test("purchase 10 adult & 10 child tickets", () => {

  const accountId = 1
  const purchaseRequest1 = new TicketTypeRequest("ADULT", 10)
  const purchaseRequest2 = new TicketTypeRequest("CHILD", 10)

  const ticketService = new TicketService()
  ticketService.purchaseTickets(accountId, purchaseRequest1, purchaseRequest2)

  const mockTicketPaymentService = TicketPaymentService.mock.instances[0]
  const mockMakePayment = mockTicketPaymentService.makePayment
  expect(mockMakePayment.mock.calls[0][0]).toEqual(accountId)
  expect(mockMakePayment.mock.calls[0][1]).toEqual(300)

  const mockSeatReservationService = SeatReservationService.mock.instances[0]
  const mockReserveSeat = mockSeatReservationService.reserveSeat
  expect(mockReserveSeat.mock.calls[0][0]).toEqual(accountId)
  expect(mockReserveSeat.mock.calls[0][1]).toEqual(20)
})

test("purchase 1 of each type (adult, child & infant)", () => {

  const accountId = 1
  const purchaseRequest1 = new TicketTypeRequest("ADULT", 1)
  const purchaseRequest2 = new TicketTypeRequest("CHILD", 1)
  const purchaseRequest3 = new TicketTypeRequest("INFANT", 1)

  const ticketService = new TicketService()
  ticketService.purchaseTickets(accountId, purchaseRequest1, purchaseRequest2, purchaseRequest3)

  const mockTicketPaymentService = TicketPaymentService.mock.instances[0]
  const mockMakePayment = mockTicketPaymentService.makePayment
  expect(mockMakePayment.mock.calls[0][0]).toEqual(accountId)
  expect(mockMakePayment.mock.calls[0][1]).toEqual(30)

  const mockSeatReservationService = SeatReservationService.mock.instances[0]
  const mockReserveSeat = mockSeatReservationService.reserveSeat
  expect(mockReserveSeat.mock.calls[0][0]).toEqual(accountId)
  expect(mockReserveSeat.mock.calls[0][1]).toEqual(2)
})
