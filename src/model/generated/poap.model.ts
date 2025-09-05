import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, StringColumn as StringColumn_, BooleanColumn as BooleanColumn_, ManyToOne as ManyToOne_} from "@subsquid/typeorm-store"
import {Event} from "./event.model"

@Entity_()
export class POAP {
    constructor(props?: Partial<POAP>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    poapId!: number

    @Index_()
    @StringColumn_({nullable: false})
    fancyId!: string

    @StringColumn_({nullable: false})
    name!: string

    @StringColumn_({nullable: false})
    description!: string

    @StringColumn_({nullable: true})
    city!: string | undefined | null

    @StringColumn_({nullable: true})
    country!: string | undefined | null

    @StringColumn_({nullable: true})
    eventUrl!: string | undefined | null

    @StringColumn_({nullable: true})
    imageUrl!: string | undefined | null

    @StringColumn_({nullable: true})
    animationUrl!: string | undefined | null

    @IntColumn_({nullable: true})
    year!: number | undefined | null

    @StringColumn_({nullable: true})
    startDate!: string | undefined | null

    @StringColumn_({nullable: true})
    endDate!: string | undefined | null

    @StringColumn_({nullable: true})
    expiryDate!: string | undefined | null

    @BooleanColumn_({nullable: true})
    fromAdmin!: boolean | undefined | null

    @BooleanColumn_({nullable: true})
    virtualEvent!: boolean | undefined | null

    @IntColumn_({nullable: true})
    eventTemplateId!: number | undefined | null

    @BooleanColumn_({nullable: true})
    privateEvent!: boolean | undefined | null

    @StringColumn_({nullable: true})
    dropImagePublicId!: string | undefined | null

    @IntColumn_({nullable: true})
    dropImageDropId!: number | undefined | null

    @Index_()
    @ManyToOne_(() => Event, {nullable: true})
    event!: Event
}
