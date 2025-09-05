import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    CheckedIn: event("0x70790c0ab38e2aca9b5520985fe66db2a3700c3680b61c3853b5554f67a2c31c", "CheckedIn(uint256,address)", {"eventId": indexed(p.uint256), "attendee": indexed(p.address)}),
    EventCancelled: event("0xdc3cb569b066460f4a22dffa05317bdcce5d3826382ed49a21f13e5fa2063d39", "EventCancelled(uint256)", {"eventId": indexed(p.uint256)}),
    EventCreated: event("0x3e1e16dc53562886fa9ab2acde567c1067c24a0c4daad0e47ab75c7b194a90ed", "EventCreated(uint256,address,string,uint256,uint256)", {"eventId": indexed(p.uint256), "organizer": indexed(p.address), "metadataHash": p.string, "startDate": p.uint256, "endDate": p.uint256}),
    EventUpdated: event("0xdec0c072be7f169eb2bb4b8623c860aeea68e353d2d2d4982929b7e3744ba355", "EventUpdated(uint256,string,uint256,uint256)", {"eventId": indexed(p.uint256), "metadataHash": p.string, "startDate": p.uint256, "endDate": p.uint256}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
    Paused: event("0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258", "Paused(address)", {"account": p.address}),
    PaymentReceived: event("0x3df2dc7c3520e3eae9e0204ceb677606a01bb80f05dbbbc6613e951fe194faac", "PaymentReceived(uint256,address,address,uint256)", {"eventId": indexed(p.uint256), "payer": indexed(p.address), "paymentToken": indexed(p.address), "amount": p.uint256}),
    ProfitGenerated: event("0xd949ff8c2855a59e7bb13f5bd0fd68f98ae7daccc2a125d45b7c0b8b1ae512ed", "ProfitGenerated(uint256,address,uint256)", {"eventId": indexed(p.uint256), "token": indexed(p.address), "profitAmount": p.uint256}),
    ProfitWithdrawn: event("0xe6fee221bb8a85476104e6b67ae7b66010866c78f60f8ce4946f80da6ce04df0", "ProfitWithdrawn(address,uint256,address)", {"token": indexed(p.address), "amount": p.uint256, "recipient": indexed(p.address)}),
    RefundIssued: event("0x114fa940c84af7dbbb46acb8165579f0b7ee8f30578eac92a7028b1ade3e003e", "RefundIssued(uint256,address,address,uint256)", {"eventId": indexed(p.uint256), "attendee": indexed(p.address), "paymentToken": indexed(p.address), "amount": p.uint256}),
    RegistrationApproved: event("0x5bb7b658dde929334c584f284e7cdfd4d5df4b5b995d90ba9aadaaaa5fdf0abb", "RegistrationApproved(uint256,address)", {"eventId": indexed(p.uint256), "attendee": indexed(p.address)}),
    RegistrationPending: event("0x355d723605cca5e0de6dc5ca0dae7a071629b9e5d042d388296c04452a1a6c4f", "RegistrationPending(uint256,address)", {"eventId": indexed(p.uint256), "attendee": indexed(p.address)}),
    RegistrationRejected: event("0xac4e641955a817c5afca1e143ab9c74d5ae6a2a01b8cdd054f16bf82012c8a75", "RegistrationRejected(uint256,address)", {"eventId": indexed(p.uint256), "attendee": indexed(p.address)}),
    TicketIssued: event("0x9dcc55c1af5d7ad8552ce05a7bc39c3cd3a3d1bcc1d0f12b1e213d677c0cf5ca", "TicketIssued(uint256,address)", {"eventId": indexed(p.uint256), "attendee": indexed(p.address)}),
    TicketPriceUpdated: event("0x787e32f329f40be5fa0888eb6b6189c8c23013fa10421c2d2561f64d7827b7e4", "TicketPriceUpdated(uint256,address,uint256)", {"eventId": indexed(p.uint256), "paymentToken": indexed(p.address), "ticketPrice": p.uint256}),
    TokenWhiteListed: event("0x17f1f68f2bbafe46f08a302e96f3eacf03f1fdacd67c9ec5aad5bf439cc6b13d", "TokenWhiteListed(address,bool)", {"paymentToken": indexed(p.address), "isWhitelisted": indexed(p.bool)}),
    Unpaused: event("0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa", "Unpaused(address)", {"account": p.address}),
}

export const functions = {
    BASIS_POINTS_DENOMINATOR: viewFun("0xcfa498a3", "BASIS_POINTS_DENOMINATOR()", {}, p.uint256),
    MAX_PAYMENT_TOKENS: viewFun("0x150682c5", "MAX_PAYMENT_TOKENS()", {}, p.uint256),
    NATIVE_TOKEN: viewFun("0x31f7d964", "NATIVE_TOKEN()", {}, p.address),
    PROFIT_FEE_BASIS_POINTS: viewFun("0x69badd88", "PROFIT_FEE_BASIS_POINTS()", {}, p.uint256),
    approveRegistration: fun("0xf434c963", "approveRegistration(uint256,address,bool)", {"eventId": p.uint256, "attendee": p.address, "isApproved": p.bool}, ),
    bulkApproveRegistrations: fun("0x890698f0", "bulkApproveRegistrations(uint256,address[],bool[])", {"eventId": p.uint256, "attendees": p.array(p.address), "isApproved": p.array(p.bool)}, ),
    bulkCheckIn: fun("0xbd929a0c", "bulkCheckIn(uint256,address[])", {"eventId": p.uint256, "attendees": p.array(p.address)}, ),
    cancelEvent: fun("0x3f69babd", "cancelEvent(uint256)", {"eventId": p.uint256}, ),
    createEvent: fun("0x1c6efbb8", "createEvent((string,uint256,uint256,uint8,bool,uint256,bool,address[],uint256[]))", {"input": p.struct({"metadataHash": p.string, "startDate": p.uint256, "endDate": p.uint256, "venueType": p.uint8, "requiresApproval": p.bool, "capacity": p.uint256, "isPaid": p.bool, "paymentTokens": p.array(p.address), "ticketPrices": p.array(p.uint256)})}, p.uint256),
    erc20EventFunds: viewFun("0xb17db887", "erc20EventFunds(uint256,address)", {"_0": p.uint256, "_1": p.address}, p.uint256),
    erc20Payments: viewFun("0xb3ee3fbe", "erc20Payments(uint256,address,address)", {"_0": p.uint256, "_1": p.address, "_2": p.address}, p.uint256),
    erc20Profits: viewFun("0xd4530914", "erc20Profits(address)", {"_0": p.address}, p.uint256),
    eventAttendees: viewFun("0xfb690d59", "eventAttendees(uint256,uint256)", {"_0": p.uint256, "_1": p.uint256}, p.address),
    eventCount: viewFun("0x71be2e4a", "eventCount()", {}, p.uint256),
    events: viewFun("0x0b791430", "events(uint256)", {"_0": p.uint256}, {"organizer": p.address, "metadataHash": p.string, "startDate": p.uint256, "endDate": p.uint256, "venueType": p.uint8, "requiresApproval": p.bool, "capacity": p.uint256, "isActive": p.bool, "isPaid": p.bool}),
    getERC20Profits: viewFun("0x61110ad0", "getERC20Profits(address)", {"token": p.address}, p.uint256),
    getEvent: viewFun("0x6d1884e0", "getEvent(uint256)", {"eventId": p.uint256}, p.struct({"organizer": p.address, "metadataHash": p.string, "startDate": p.uint256, "endDate": p.uint256, "venueType": p.uint8, "requiresApproval": p.bool, "capacity": p.uint256, "isActive": p.bool, "isPaid": p.bool})),
    getEventAttendees: viewFun("0xad395c14", "getEventAttendees(uint256)", {"eventId": p.uint256}, p.array(p.address)),
    getNativeProfits: viewFun("0x5bf5d34c", "getNativeProfits()", {}, p.uint256),
    getPaymentDetails: viewFun("0x6f4df034", "getPaymentDetails(uint256,address)", {"eventId": p.uint256, "attendee": p.address}, {"_0": p.uint256, "_1": p.address}),
    getPaymentTokens: viewFun("0xc5ba016c", "getPaymentTokens(uint256)", {"eventId": p.uint256}, p.array(p.address)),
    getPendingRegistrants: viewFun("0xfeb294d6", "getPendingRegistrants(uint256)", {"eventId": p.uint256}, p.array(p.address)),
    getProfitFeePercentage: viewFun("0xe3601e34", "getProfitFeePercentage()", {}, {"_0": p.uint256, "_1": p.uint256}),
    getRegistrationStatus: viewFun("0x3b655aff", "getRegistrationStatus(uint256,address)", {"eventId": p.uint256, "attendee": p.address}, p.uint8),
    getTicketPrice: viewFun("0x9ebe6f8d", "getTicketPrice(uint256,address)", {"eventId": p.uint256, "token": p.address}, p.uint256),
    hasPaid: viewFun("0xd8bc7fff", "hasPaid(uint256,address)", {"eventId": p.uint256, "attendee": p.address}, p.bool),
    isPendingApproval: viewFun("0xf5187d2a", "isPendingApproval(uint256,address)", {"eventId": p.uint256, "attendee": p.address}, p.bool),
    nativeEventFunds: viewFun("0xd4b43d5f", "nativeEventFunds(uint256)", {"_0": p.uint256}, p.uint256),
    nativePayments: viewFun("0x4bcb14e2", "nativePayments(uint256,address)", {"_0": p.uint256, "_1": p.address}, p.uint256),
    nativeProfits: viewFun("0xccab7ac2", "nativeProfits()", {}, p.uint256),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    pause: fun("0x8456cb59", "pause()", {}, ),
    paused: viewFun("0x5c975abb", "paused()", {}, p.bool),
    paymentTokens: viewFun("0x931d4e91", "paymentTokens(uint256,uint256)", {"_0": p.uint256, "_1": p.uint256}, p.address),
    register: fun("0xdbbdf083", "register(uint256,address)", {"eventId": p.uint256, "paymentToken": p.address}, ),
    registrationStatus: viewFun("0x50db67ab", "registrationStatus(uint256,address)", {"_0": p.uint256, "_1": p.address}, p.uint8),
    renounceOwnership: fun("0x715018a6", "renounceOwnership()", {}, ),
    selfCheckIn: fun("0xdf0785dc", "selfCheckIn(uint256,uint256,bytes)", {"eventId": p.uint256, "expiry": p.uint256, "signature": p.bytes}, ),
    setSupportedToken: fun("0xe7986466", "setSupportedToken(address,bool)", {"token": p.address, "isWhitelisted": p.bool}, ),
    supportedTokens: viewFun("0x68c4ac26", "supportedTokens(address)", {"_0": p.address}, p.bool),
    ticketPrices: viewFun("0x8ac8029e", "ticketPrices(uint256,address)", {"_0": p.uint256, "_1": p.address}, p.uint256),
    tickets: viewFun("0xb99d6e29", "tickets(uint256,address)", {"_0": p.uint256, "_1": p.address}, {"eventId": p.uint256, "attendee": p.address, "isUsed": p.bool}),
    transferOwnership: fun("0xf2fde38b", "transferOwnership(address)", {"newOwner": p.address}, ),
    unpause: fun("0x3f4ba83a", "unpause()", {}, ),
    updateEvent: fun("0x6119fe90", "updateEvent(uint256,(string,uint256,uint256,uint8,bool,uint256,bool,address[],uint256[]))", {"eventId": p.uint256, "input": p.struct({"metadataHash": p.string, "startDate": p.uint256, "endDate": p.uint256, "venueType": p.uint8, "requiresApproval": p.bool, "capacity": p.uint256, "isPaid": p.bool, "paymentTokens": p.array(p.address), "ticketPrices": p.array(p.uint256)})}, ),
    updateTicketPrice: fun("0xa71b045e", "updateTicketPrice(uint256,address,uint256)", {"eventId": p.uint256, "token": p.address, "price": p.uint256}, ),
    withdrawERC20Funds: fun("0xb015cee8", "withdrawERC20Funds(address,uint256,address)", {"token": p.address, "eventId": p.uint256, "recipient": p.address}, ),
    withdrawERC20Profits: fun("0xbb3fbbf5", "withdrawERC20Profits(address,address)", {"token": p.address, "recipient": p.address}, ),
    withdrawNativeFunds: fun("0x8fe088ae", "withdrawNativeFunds(uint256,address)", {"eventId": p.uint256, "recipient": p.address}, ),
    withdrawNativeProfits: fun("0x3aa563f7", "withdrawNativeProfits(address)", {"recipient": p.address}, ),
}

export class Contract extends ContractBase {

    BASIS_POINTS_DENOMINATOR() {
        return this.eth_call(functions.BASIS_POINTS_DENOMINATOR, {})
    }

    MAX_PAYMENT_TOKENS() {
        return this.eth_call(functions.MAX_PAYMENT_TOKENS, {})
    }

    NATIVE_TOKEN() {
        return this.eth_call(functions.NATIVE_TOKEN, {})
    }

    PROFIT_FEE_BASIS_POINTS() {
        return this.eth_call(functions.PROFIT_FEE_BASIS_POINTS, {})
    }

    erc20EventFunds(_0: Erc20EventFundsParams["_0"], _1: Erc20EventFundsParams["_1"]) {
        return this.eth_call(functions.erc20EventFunds, {_0, _1})
    }

    erc20Payments(_0: Erc20PaymentsParams["_0"], _1: Erc20PaymentsParams["_1"], _2: Erc20PaymentsParams["_2"]) {
        return this.eth_call(functions.erc20Payments, {_0, _1, _2})
    }

    erc20Profits(_0: Erc20ProfitsParams["_0"]) {
        return this.eth_call(functions.erc20Profits, {_0})
    }

    eventAttendees(_0: EventAttendeesParams["_0"], _1: EventAttendeesParams["_1"]) {
        return this.eth_call(functions.eventAttendees, {_0, _1})
    }

    eventCount() {
        return this.eth_call(functions.eventCount, {})
    }

    events(_0: EventsParams["_0"]) {
        return this.eth_call(functions.events, {_0})
    }

    getERC20Profits(token: GetERC20ProfitsParams["token"]) {
        return this.eth_call(functions.getERC20Profits, {token})
    }

    getEvent(eventId: GetEventParams["eventId"]) {
        return this.eth_call(functions.getEvent, {eventId})
    }

    getEventAttendees(eventId: GetEventAttendeesParams["eventId"]) {
        return this.eth_call(functions.getEventAttendees, {eventId})
    }

    getNativeProfits() {
        return this.eth_call(functions.getNativeProfits, {})
    }

    getPaymentDetails(eventId: GetPaymentDetailsParams["eventId"], attendee: GetPaymentDetailsParams["attendee"]) {
        return this.eth_call(functions.getPaymentDetails, {eventId, attendee})
    }

    getPaymentTokens(eventId: GetPaymentTokensParams["eventId"]) {
        return this.eth_call(functions.getPaymentTokens, {eventId})
    }

    getPendingRegistrants(eventId: GetPendingRegistrantsParams["eventId"]) {
        return this.eth_call(functions.getPendingRegistrants, {eventId})
    }

    getProfitFeePercentage() {
        return this.eth_call(functions.getProfitFeePercentage, {})
    }

    getRegistrationStatus(eventId: GetRegistrationStatusParams["eventId"], attendee: GetRegistrationStatusParams["attendee"]) {
        return this.eth_call(functions.getRegistrationStatus, {eventId, attendee})
    }

    getTicketPrice(eventId: GetTicketPriceParams["eventId"], token: GetTicketPriceParams["token"]) {
        return this.eth_call(functions.getTicketPrice, {eventId, token})
    }

    hasPaid(eventId: HasPaidParams["eventId"], attendee: HasPaidParams["attendee"]) {
        return this.eth_call(functions.hasPaid, {eventId, attendee})
    }

    isPendingApproval(eventId: IsPendingApprovalParams["eventId"], attendee: IsPendingApprovalParams["attendee"]) {
        return this.eth_call(functions.isPendingApproval, {eventId, attendee})
    }

    nativeEventFunds(_0: NativeEventFundsParams["_0"]) {
        return this.eth_call(functions.nativeEventFunds, {_0})
    }

    nativePayments(_0: NativePaymentsParams["_0"], _1: NativePaymentsParams["_1"]) {
        return this.eth_call(functions.nativePayments, {_0, _1})
    }

    nativeProfits() {
        return this.eth_call(functions.nativeProfits, {})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    paused() {
        return this.eth_call(functions.paused, {})
    }

    paymentTokens(_0: PaymentTokensParams["_0"], _1: PaymentTokensParams["_1"]) {
        return this.eth_call(functions.paymentTokens, {_0, _1})
    }

    registrationStatus(_0: RegistrationStatusParams["_0"], _1: RegistrationStatusParams["_1"]) {
        return this.eth_call(functions.registrationStatus, {_0, _1})
    }

    supportedTokens(_0: SupportedTokensParams["_0"]) {
        return this.eth_call(functions.supportedTokens, {_0})
    }

    ticketPrices(_0: TicketPricesParams["_0"], _1: TicketPricesParams["_1"]) {
        return this.eth_call(functions.ticketPrices, {_0, _1})
    }

    tickets(_0: TicketsParams["_0"], _1: TicketsParams["_1"]) {
        return this.eth_call(functions.tickets, {_0, _1})
    }
}

/// Event types
export type CheckedInEventArgs = EParams<typeof events.CheckedIn>
export type EventCancelledEventArgs = EParams<typeof events.EventCancelled>
export type EventCreatedEventArgs = EParams<typeof events.EventCreated>
export type EventUpdatedEventArgs = EParams<typeof events.EventUpdated>
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>
export type PausedEventArgs = EParams<typeof events.Paused>
export type PaymentReceivedEventArgs = EParams<typeof events.PaymentReceived>
export type ProfitGeneratedEventArgs = EParams<typeof events.ProfitGenerated>
export type ProfitWithdrawnEventArgs = EParams<typeof events.ProfitWithdrawn>
export type RefundIssuedEventArgs = EParams<typeof events.RefundIssued>
export type RegistrationApprovedEventArgs = EParams<typeof events.RegistrationApproved>
export type RegistrationPendingEventArgs = EParams<typeof events.RegistrationPending>
export type RegistrationRejectedEventArgs = EParams<typeof events.RegistrationRejected>
export type TicketIssuedEventArgs = EParams<typeof events.TicketIssued>
export type TicketPriceUpdatedEventArgs = EParams<typeof events.TicketPriceUpdated>
export type TokenWhiteListedEventArgs = EParams<typeof events.TokenWhiteListed>
export type UnpausedEventArgs = EParams<typeof events.Unpaused>

/// Function types
export type BASIS_POINTS_DENOMINATORParams = FunctionArguments<typeof functions.BASIS_POINTS_DENOMINATOR>
export type BASIS_POINTS_DENOMINATORReturn = FunctionReturn<typeof functions.BASIS_POINTS_DENOMINATOR>

export type MAX_PAYMENT_TOKENSParams = FunctionArguments<typeof functions.MAX_PAYMENT_TOKENS>
export type MAX_PAYMENT_TOKENSReturn = FunctionReturn<typeof functions.MAX_PAYMENT_TOKENS>

export type NATIVE_TOKENParams = FunctionArguments<typeof functions.NATIVE_TOKEN>
export type NATIVE_TOKENReturn = FunctionReturn<typeof functions.NATIVE_TOKEN>

export type PROFIT_FEE_BASIS_POINTSParams = FunctionArguments<typeof functions.PROFIT_FEE_BASIS_POINTS>
export type PROFIT_FEE_BASIS_POINTSReturn = FunctionReturn<typeof functions.PROFIT_FEE_BASIS_POINTS>

export type ApproveRegistrationParams = FunctionArguments<typeof functions.approveRegistration>
export type ApproveRegistrationReturn = FunctionReturn<typeof functions.approveRegistration>

export type BulkApproveRegistrationsParams = FunctionArguments<typeof functions.bulkApproveRegistrations>
export type BulkApproveRegistrationsReturn = FunctionReturn<typeof functions.bulkApproveRegistrations>

export type BulkCheckInParams = FunctionArguments<typeof functions.bulkCheckIn>
export type BulkCheckInReturn = FunctionReturn<typeof functions.bulkCheckIn>

export type CancelEventParams = FunctionArguments<typeof functions.cancelEvent>
export type CancelEventReturn = FunctionReturn<typeof functions.cancelEvent>

export type CreateEventParams = FunctionArguments<typeof functions.createEvent>
export type CreateEventReturn = FunctionReturn<typeof functions.createEvent>

export type Erc20EventFundsParams = FunctionArguments<typeof functions.erc20EventFunds>
export type Erc20EventFundsReturn = FunctionReturn<typeof functions.erc20EventFunds>

export type Erc20PaymentsParams = FunctionArguments<typeof functions.erc20Payments>
export type Erc20PaymentsReturn = FunctionReturn<typeof functions.erc20Payments>

export type Erc20ProfitsParams = FunctionArguments<typeof functions.erc20Profits>
export type Erc20ProfitsReturn = FunctionReturn<typeof functions.erc20Profits>

export type EventAttendeesParams = FunctionArguments<typeof functions.eventAttendees>
export type EventAttendeesReturn = FunctionReturn<typeof functions.eventAttendees>

export type EventCountParams = FunctionArguments<typeof functions.eventCount>
export type EventCountReturn = FunctionReturn<typeof functions.eventCount>

export type EventsParams = FunctionArguments<typeof functions.events>
export type EventsReturn = FunctionReturn<typeof functions.events>

export type GetERC20ProfitsParams = FunctionArguments<typeof functions.getERC20Profits>
export type GetERC20ProfitsReturn = FunctionReturn<typeof functions.getERC20Profits>

export type GetEventParams = FunctionArguments<typeof functions.getEvent>
export type GetEventReturn = FunctionReturn<typeof functions.getEvent>

export type GetEventAttendeesParams = FunctionArguments<typeof functions.getEventAttendees>
export type GetEventAttendeesReturn = FunctionReturn<typeof functions.getEventAttendees>

export type GetNativeProfitsParams = FunctionArguments<typeof functions.getNativeProfits>
export type GetNativeProfitsReturn = FunctionReturn<typeof functions.getNativeProfits>

export type GetPaymentDetailsParams = FunctionArguments<typeof functions.getPaymentDetails>
export type GetPaymentDetailsReturn = FunctionReturn<typeof functions.getPaymentDetails>

export type GetPaymentTokensParams = FunctionArguments<typeof functions.getPaymentTokens>
export type GetPaymentTokensReturn = FunctionReturn<typeof functions.getPaymentTokens>

export type GetPendingRegistrantsParams = FunctionArguments<typeof functions.getPendingRegistrants>
export type GetPendingRegistrantsReturn = FunctionReturn<typeof functions.getPendingRegistrants>

export type GetProfitFeePercentageParams = FunctionArguments<typeof functions.getProfitFeePercentage>
export type GetProfitFeePercentageReturn = FunctionReturn<typeof functions.getProfitFeePercentage>

export type GetRegistrationStatusParams = FunctionArguments<typeof functions.getRegistrationStatus>
export type GetRegistrationStatusReturn = FunctionReturn<typeof functions.getRegistrationStatus>

export type GetTicketPriceParams = FunctionArguments<typeof functions.getTicketPrice>
export type GetTicketPriceReturn = FunctionReturn<typeof functions.getTicketPrice>

export type HasPaidParams = FunctionArguments<typeof functions.hasPaid>
export type HasPaidReturn = FunctionReturn<typeof functions.hasPaid>

export type IsPendingApprovalParams = FunctionArguments<typeof functions.isPendingApproval>
export type IsPendingApprovalReturn = FunctionReturn<typeof functions.isPendingApproval>

export type NativeEventFundsParams = FunctionArguments<typeof functions.nativeEventFunds>
export type NativeEventFundsReturn = FunctionReturn<typeof functions.nativeEventFunds>

export type NativePaymentsParams = FunctionArguments<typeof functions.nativePayments>
export type NativePaymentsReturn = FunctionReturn<typeof functions.nativePayments>

export type NativeProfitsParams = FunctionArguments<typeof functions.nativeProfits>
export type NativeProfitsReturn = FunctionReturn<typeof functions.nativeProfits>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type PauseParams = FunctionArguments<typeof functions.pause>
export type PauseReturn = FunctionReturn<typeof functions.pause>

export type PausedParams = FunctionArguments<typeof functions.paused>
export type PausedReturn = FunctionReturn<typeof functions.paused>

export type PaymentTokensParams = FunctionArguments<typeof functions.paymentTokens>
export type PaymentTokensReturn = FunctionReturn<typeof functions.paymentTokens>

export type RegisterParams = FunctionArguments<typeof functions.register>
export type RegisterReturn = FunctionReturn<typeof functions.register>

export type RegistrationStatusParams = FunctionArguments<typeof functions.registrationStatus>
export type RegistrationStatusReturn = FunctionReturn<typeof functions.registrationStatus>

export type RenounceOwnershipParams = FunctionArguments<typeof functions.renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof functions.renounceOwnership>

export type SelfCheckInParams = FunctionArguments<typeof functions.selfCheckIn>
export type SelfCheckInReturn = FunctionReturn<typeof functions.selfCheckIn>

export type SetSupportedTokenParams = FunctionArguments<typeof functions.setSupportedToken>
export type SetSupportedTokenReturn = FunctionReturn<typeof functions.setSupportedToken>

export type SupportedTokensParams = FunctionArguments<typeof functions.supportedTokens>
export type SupportedTokensReturn = FunctionReturn<typeof functions.supportedTokens>

export type TicketPricesParams = FunctionArguments<typeof functions.ticketPrices>
export type TicketPricesReturn = FunctionReturn<typeof functions.ticketPrices>

export type TicketsParams = FunctionArguments<typeof functions.tickets>
export type TicketsReturn = FunctionReturn<typeof functions.tickets>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

export type UnpauseParams = FunctionArguments<typeof functions.unpause>
export type UnpauseReturn = FunctionReturn<typeof functions.unpause>

export type UpdateEventParams = FunctionArguments<typeof functions.updateEvent>
export type UpdateEventReturn = FunctionReturn<typeof functions.updateEvent>

export type UpdateTicketPriceParams = FunctionArguments<typeof functions.updateTicketPrice>
export type UpdateTicketPriceReturn = FunctionReturn<typeof functions.updateTicketPrice>

export type WithdrawERC20FundsParams = FunctionArguments<typeof functions.withdrawERC20Funds>
export type WithdrawERC20FundsReturn = FunctionReturn<typeof functions.withdrawERC20Funds>

export type WithdrawERC20ProfitsParams = FunctionArguments<typeof functions.withdrawERC20Profits>
export type WithdrawERC20ProfitsReturn = FunctionReturn<typeof functions.withdrawERC20Profits>

export type WithdrawNativeFundsParams = FunctionArguments<typeof functions.withdrawNativeFunds>
export type WithdrawNativeFundsReturn = FunctionReturn<typeof functions.withdrawNativeFunds>

export type WithdrawNativeProfitsParams = FunctionArguments<typeof functions.withdrawNativeProfits>
export type WithdrawNativeProfitsReturn = FunctionReturn<typeof functions.withdrawNativeProfits>

