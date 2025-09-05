import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, ManyToOne as ManyToOne_, Index as Index_} from "@subsquid/typeorm-store"
import {EventMetadata} from "./eventMetadata.model"

@Entity_()
export class Location {
    constructor(props?: Partial<Location>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    name!: string

    @StringColumn_({nullable: true})
    address!: string | undefined | null

    @StringColumn_({nullable: false})
    latitude!: string

    @StringColumn_({nullable: false})
    longitude!: string

    @StringColumn_({nullable: true})
    placeId!: string | undefined | null

    @Index_()
    @ManyToOne_(() => EventMetadata, {nullable: true})
    metadata!: EventMetadata
}
