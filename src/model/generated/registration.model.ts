import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, BooleanColumn as BooleanColumn_, BigIntColumn as BigIntColumn_, OneToOne as OneToOne_} from "@subsquid/typeorm-store"
import {Event} from "./event.model"
import {RegistrationStatus} from "./_registrationStatus"
import {Ticket} from "./ticket.model"

@Entity_()
export class Registration {
    constructor(props?: Partial<Registration>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Event, {nullable: true})
    event!: Event

    @StringColumn_({nullable: false})
    attendee!: string

    @Column_("varchar", {length: 8, nullable: false})
    status!: RegistrationStatus

    @BooleanColumn_({nullable: true})
    approved!: boolean | undefined | null

    @BigIntColumn_({nullable: false})
    registeredAt!: bigint

    @BigIntColumn_({nullable: true})
    approvedAt!: bigint | undefined | null

    @OneToOne_(() => Ticket, e => e.registration)
    ticket!: Ticket | undefined | null
}
