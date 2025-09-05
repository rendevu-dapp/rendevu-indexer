import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, OneToOne as OneToOne_, JoinColumn as JoinColumn_, BigIntColumn as BigIntColumn_, BooleanColumn as BooleanColumn_} from "@subsquid/typeorm-store"
import {Event} from "./event.model"
import {Registration} from "./registration.model"
import {Payment} from "./payment.model"

@Entity_()
export class Ticket {
    constructor(props?: Partial<Ticket>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Event, {nullable: true})
    event!: Event

    @StringColumn_({nullable: false})
    attendee!: string

    @Index_({unique: true})
    @OneToOne_(() => Registration, {nullable: true})
    @JoinColumn_()
    registration!: Registration | undefined | null

    @Index_({unique: true})
    @OneToOne_(() => Payment, {nullable: true})
    @JoinColumn_()
    payment!: Payment | undefined | null

    @BigIntColumn_({nullable: false})
    issuedAt!: bigint

    @BooleanColumn_({nullable: false})
    isUsed!: boolean

    @BigIntColumn_({nullable: true})
    checkedInAt!: bigint | undefined | null
}
