import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, ManyToOne as ManyToOne_, Index as Index_} from "@subsquid/typeorm-store"
import {Event} from "./event.model"
import {Location} from "./location.model"

@Entity_()
export class EventMetadata {
    constructor(props?: Partial<EventMetadata>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    referenceHash!: string

    @Index_()
    @ManyToOne_(() => Event, {nullable: true})
    event!: Event

    @StringColumn_({nullable: false})
    title!: string

    @StringColumn_({nullable: false})
    description!: string

    @StringColumn_({nullable: true})
    image!: string | undefined | null

    @StringColumn_({nullable: true})
    virtualLink!: string | undefined | null

    @Index_()
    @ManyToOne_(() => Location, {nullable: true})
    location!: Location | undefined | null
}
