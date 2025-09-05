import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, BooleanColumn as BooleanColumn_, OneToOne as OneToOne_} from "@subsquid/typeorm-store"
import {Event} from "./event.model"
import {EventToken} from "./eventToken.model"
import {Ticket} from "./ticket.model"
import {Registration} from "./registration.model"

@Entity_()
export class Payment {
    constructor(props?: Partial<Payment>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Event, {nullable: true})
    event!: Event

    @StringColumn_({nullable: false})
    payer!: string

    @BigIntColumn_({nullable: false})
    amount!: bigint

    @Index_()
    @ManyToOne_(() => EventToken, {nullable: true})
    token!: EventToken

    @BigIntColumn_({nullable: false})
    paymentDate!: bigint

    @BooleanColumn_({nullable: false})
    isRefunded!: boolean

    @OneToOne_(() => Ticket, e => e.payment)
    ticket!: Ticket | undefined | null

    @Index_()
    @ManyToOne_(() => Registration, {nullable: true})
    registration!: Registration | undefined | null
}
