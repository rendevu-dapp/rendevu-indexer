// abis
import * as eventPlatformAbi from "../abi/event-platform";

// models
import { Profit } from "../model";

// types
import type { Context, Log } from "../processor";

export async function handleProfitWithdrawn(
  ctx: Context,
  log: Log,
) {
  // decode the log
  let { token, amount, recipient } =
    eventPlatformAbi.events.ProfitWithdrawn.decode(log);

  // create the profit entity
  const profitId = `${token}-${recipient}-${log.block.timestamp}`;
  const profit = new Profit({
    id: profitId,
    token: token,
    withdrawnAmount: amount,
    recipient: recipient,
    withdrawnAt: BigInt(log.block.timestamp),
    type: "Withdrawn"
  });

  await ctx.store.upsert(profit);
  ctx.log.info(`Profit withdrawn event processed for ${token}.`);
}
