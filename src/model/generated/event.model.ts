import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, BigIntColumn as BigIntColumn_, Index as Index_, StringColumn as StringColumn_, ManyToOne as ManyToOne_, BooleanColumn as BooleanColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {EventMetadata} from "./eventMetadata.model"
import {Ticket} from "./ticket.model"
import {Payment} from "./payment.model"
import {EventToken} from "./eventToken.model"
import {Registration} from "./registration.model"
import {POAP} from "./poap.model"

@Entity_()
export class Event {
    constructor(props?: Partial<Event>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @BigIntColumn_({nullable: false})
    eventId!: bigint

    @Index_()
    @StringColumn_({nullable: false})
    organizer!: string

    @StringColumn_({nullable: false})
    metadataHash!: string

    @Index_()
    @ManyToOne_(() => EventMetadata, {nullable: true})
    metadata!: EventMetadata | undefined | null

    @Index_()
    @BigIntColumn_({nullable: false})
    startDate!: bigint

    @Index_()
    @BigIntColumn_({nullable: false})
    endDate!: bigint

    @StringColumn_({nullable: false})
    venueType!: string

    @BooleanColumn_({nullable: false})
    requiresApproval!: boolean

    @BigIntColumn_({nullable: false})
    capacity!: bigint

    @Index_()
    @BooleanColumn_({nullable: false})
    isActive!: boolean

    @BooleanColumn_({nullable: false})
    isPaid!: boolean

    @BigIntColumn_({nullable: false})
    createdAt!: bigint

    @BigIntColumn_({nullable: true})
    updatedAt!: bigint | undefined | null

    @OneToMany_(() => Ticket, e => e.event)
    tickets!: Ticket[]

    @OneToMany_(() => Payment, e => e.event)
    payments!: Payment[]

    @OneToMany_(() => EventToken, e => e.event)
    paymentTokens!: EventToken[]

    @OneToMany_(() => Registration, e => e.event)
    registrations!: Registration[]

    @OneToMany_(() => POAP, e => e.event)
    poaps!: POAP[]
}
