import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, BigIntColumn as BigIntColumn_, StringColumn as StringColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class Profit {
    constructor(props?: Partial<Profit>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @BigIntColumn_({nullable: true})
    eventId!: bigint | undefined | null

    @StringColumn_({nullable: false})
    token!: string

    @BigIntColumn_({nullable: false})
    profitAmount!: bigint

    @BigIntColumn_({nullable: true})
    withdrawnAmount!: bigint | undefined | null

    @StringColumn_({nullable: true})
    recipient!: string | undefined | null

    @BigIntColumn_({nullable: false})
    createdAt!: bigint

    @BigIntColumn_({nullable: true})
    withdrawnAt!: bigint | undefined | null

    @StringColumn_({nullable: false})
    type!: string
}
