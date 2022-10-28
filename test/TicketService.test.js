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

/*
  tests of valid purchases
*/

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

test("purchase 2 child tickets and 1 adult ticket", () => { // I assume this is okay, wan't totally clear but makes sense

  const accountId = 1
  const purchaseRequest1 = new TicketTypeRequest("ADULT", 1)
  const purchaseRequest2 = new TicketTypeRequest("CHILD", 2)

  const ticketService = new TicketService()
  ticketService.purchaseTickets(accountId, purchaseRequest1, purchaseRequest2)
  
  const mockTicketPaymentService = TicketPaymentService.mock.instances[0]
  const mockMakePayment = mockTicketPaymentService.makePayment
  expect(mockMakePayment.mock.calls[0][0]).toEqual(accountId)
  expect(mockMakePayment.mock.calls[0][1]).toEqual(40)

  const mockSeatReservationService = SeatReservationService.mock.instances[0]
  const mockReserveSeat = mockSeatReservationService.reserveSeat
  expect(mockReserveSeat.mock.calls[0][0]).toEqual(accountId)
  expect(mockReserveSeat.mock.calls[0][1]).toEqual(3)
})

/*
  tests of invalid purchases
*/

test("try to purchase 21 adult tickets (max is 20 tickets total)", () => {

  const accountId = 1
  const purchaseRequest = new TicketTypeRequest("ADULT", 21)

  const ticketService = new TicketService()
  
  expect( () => { ticketService.purchaseTickets(accountId, purchaseRequest) } ).toThrow()
})

test("try to purchase 10 adult, 9 child and 2 infant tickets, i.e. 21 total (max is 20 tickets total)", () => {

  const accountId = 1
  const purchaseRequest1 = new TicketTypeRequest("ADULT", 10)
  const purchaseRequest2 = new TicketTypeRequest("CHILD", 9)
  const purchaseRequest3 = new TicketTypeRequest("INFANT", 2)

  const ticketService = new TicketService()
  
  expect( () => { ticketService.purchaseTickets(accountId, purchaseRequest1, purchaseRequest2, purchaseRequest3) } ).toThrow()
})

test("try to purchase a child ticket without an adult ticket", () => {

  const accountId = 1
  const purchaseRequest = new TicketTypeRequest("CHILD", 1)

  const ticketService = new TicketService()
  
  expect( () => { ticketService.purchaseTickets(accountId, purchaseRequest) } ).toThrow()
})

test("try to purchase an infant ticket without an adult ticket", () => {

  const accountId = 1
  const purchaseRequest = new TicketTypeRequest("INFANT", 1)

  const ticketService = new TicketService()
  
  expect( () => { ticketService.purchaseTickets(accountId, purchaseRequest) } ).toThrow()
})

test("try to purchase more infant tickets than adult tickets", () => {

  const accountId = 1
  const purchaseRequest1 = new TicketTypeRequest("ADULT", 1)
  const purchaseRequest2 = new TicketTypeRequest("INFANT", 2)

  const ticketService = new TicketService()
  
  expect( () => { ticketService.purchaseTickets(accountId, purchaseRequest1, purchaseRequest2) } ).toThrow()
})

test("zero isn't a valid account id", () => {

  const accountId = 0
  const purchaseRequest = new TicketTypeRequest("ADULT", 1)

  const ticketService = new TicketService()
  
  expect( () => { ticketService.purchaseTickets(accountId, purchaseRequest) } ).toThrow()
})

test("account id must be an integer", () => {

  const accountId = "1"
  const purchaseRequest = new TicketTypeRequest("ADULT", 1)

  const ticketService = new TicketService()
  
  expect( () => { ticketService.purchaseTickets(accountId, purchaseRequest) } ).toThrow()
})

test("try to create an invalid ticket type request", () => {

  expect( () => { new TicketTypeRequest("!INVALID!", 1) } ).toThrow()
})
