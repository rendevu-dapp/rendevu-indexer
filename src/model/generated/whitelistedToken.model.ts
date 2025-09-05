import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BooleanColumn as BooleanColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class WhitelistedToken {
    constructor(props?: Partial<WhitelistedToken>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    tokenAddress!: string

    @BooleanColumn_({nullable: false})
    isWhitelisted!: boolean

    @BigIntColumn_({nullable: false})
    updatedAt!: bigint
}
